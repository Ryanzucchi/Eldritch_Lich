# Auditoria aprofundada — reanálise 3 — Senhor dos Anéis

**Dump:** `senhor_dos_aneis_indexeddb (4).json`  
**Exportado em:** 2026-08-07T17:34:04.977Z  
**Projeto:** `08579d2f-26d5-4d2f-95d1-e3884eba5dae`  
**Método:** auditoria completa do export IndexedDB, inspeção da implementação local da extração/timeline e pesquisa de ferramentas. Nenhum dado do projeto foi alterado por esta auditoria.

## Diagnóstico executivo

A v4 reduziu o lote de 6.344 para 1.869 candidatos, mas ainda promoveu todos eles automaticamente em três execuções. A linha do tempo continua semanticamente inválida: ela mistura medidas, anos editoriais e calendários fictícios, e a interface ordena por ordem de inserção (`sortOrder`) em vez de uma chave cronológica normalizada.

| Área | Evidência | Resultado |
|---|---|---:|
| V4 aplicada | 3 execuções, todas `APPLIED` | 1.869 candidatos |
| Falsos positivos v4 mínimos | lista conservadora de palavras/títulos não canônicos | 124 |
| Conflitos ficha de personagem × Wiki | mesmo nome existe na Wiki com tipo não-pessoa | 759 |
| Eventos de timeline | total atual | 299 |
| Inversões adjacentes de ano em `sortOrder` | sequência carregada pela tela | 37 |
| Títulos temporais com fragmentação de PDF | letras separadas | 136 |
| Títulos de evento longos (>110 caracteres) | trechos, não resumos | 52 |
| Duplicatas ativas por `baseFingerprint + sourceHash` na v4 | três reanálises promovidas | 616 chaves |

## Linha do tempo — causa confirmada da ordem errada

### Causa no código

- [timeline/page.tsx](apps/web/src/app/timeline/page.tsx) lê eventos e ordena apenas por `sortOrder`.
- [EditorWorkspace.tsx](apps/web/src/app/editor/EditorWorkspace.tsx) atribui `sortOrder = existingEvents.length` ao aplicar novo evento. Ele acrescenta eventos ao fim e **não recalcula** a sequência temporal.
- `dateStr` é texto livre. Não há campos para `era`, `calendário`, ano numérico normalizado, mês/dia ou precisão. Por isso `ano 1601`, `1422`, `1937`, `120` (milhas) e `365` (dias) competem no mesmo eixo.

Consequência: mesmo eventos corretos não podem ser mostrados em ordem confiável enquanto não houver uma chave temporal estruturada. Ordenar a string visualmente seria outra forma de corrupção, pois a obra mistura calendários e eras.

### Evidências no dump

- A sequência por `sortOrder` tem **37 quedas de ano** entre eventos consecutivos. Exemplo: `sortOrder=0`, `ano 1601`; `sortOrder=1`, `120` (milhas); `sortOrder=2`, `1147`.
- [timelineEvents id=`6bc56f5b-a6f7-4014-afd3-3ccc2ded63f9`] `dateStr=120`, título sobre milhas. Distância foi tratada como ano.
- [timelineEvents id=`17607888-562d-405f-99cb-16a8fb98aa7b`] `dateStr=1937`, texto de prefácio/autoria. Não é evento narrativo.
- [timelineEvents id=`294b4088-caed-4dc4-bd0b-5ee6d7901d06`] `dateStr=1936`, trecho editorial. Não é evento narrativo.
- [timelineEvents id=`260a4d4e-0e5d-412b-af9e-113243b1ede1`] `dateStr=300`, texto sobre metros. Não é evento narrativo.
- [timelineEvents id=`16c6a4aa-fe47-4a88-8b34-152e64125d64`] `dateStr=365`, texto sobre dias/horas. Não é evento narrativo.
- 136 títulos ainda têm fragmentação, por exemplo `I ncêndio`, `E ra`, `C ondado`; 52 são trechos longos, não títulos editoriais.

**Correção necessária:** aplicar **E-01/S-01** antes de **E-05/S-05**, introduzir `calendarSystem`, `era`, `year`, `month`, `day`, `precision`, `sourceKind` (`narrative`/`editorial`) e `chronologicalSortKey`; migrar a timeline atual por revisão, não por conversão cega.

## Entidades — erros que permanecem na v4

O limiar 0,90 não resolveu o problema: a pontuação atual mede a coincidência com regras, não uma probabilidade calibrada de ser entidade canônica.

| Nome incorreto ou incompleto | Ocorrências v4 aplicadas | Tipo aplicado | Evidência |
|---|---:|---|---|
| `Não` | 49 | Personagem | “Não — disse Aragorn”; a fala é de Aragorn, não de “Não”. |
| `Negro` | 21 | Local | fragmento de “Portão Negro”/adjetivo, não local independente. |
| `Dourada` | 15 | Local | fragmento de “Floresta Dourada”, não entidade autônoma. |
| `Pedra` | 12 | Personagem | fragmento de “Pedra Élfica”, não pessoa. |
| `Abençoado` | 6 | Local | adjetivo de “Reino Abençoado”. |
| `Solitária` | 6 | Local | fragmento de “Montanha Solitária”. |
| `Corrente` | 3 | Local | fragmento/termo genérico de rio. |
| `Diretor`, `Ouro`, `Senhor`, `Sua` | 3 cada | Personagem | título, substantivo comum ou pronome sem identidade canônica. |

Achados localizáveis:

- [extractionCandidates v4] `Não`, `Personagem`, 0,90 — “Não — disse Aragorn.” A regra de elocução está associando a palavra anterior ao verbo de fala, em vez de reconhecer o sujeito posterior. Correção: analisar a dependência/sentença e excluir palavras funcionais antes de agregar ocorrências.
- [extractionCandidates v4] `Pedra`, `Personagem`, 0,90 — “Senhor Pedra Élfica”. A regra aceita fragmento de epíteto. Correção: preservar a menção inteira e exigir que um candidato não seja apenas prefixo/sufixo de expressão nominal maior.
- [extractionCandidates v4] `Negro`, `Local`, 0,90 — “Portão Negro”. Correção: resolver *span* máximo antes de classificar e usar alias apenas após vinculação canônica.

O código atual ainda não contém `não` na lista de exclusão e agrega contextos de todas as ocorrências de um nome antes de decidir o tipo; uma única ocorrência que casa com “disse” pode promover todas as outras. Isso explica por que a v4 ainda erra mesmo com uma regra mais restritiva.

## Cânone, relações e reexecuções

- Permanecem **759** fichas de personagem cujo nome já existe na Wiki como outro tipo. É legado contaminado e continua alimentando as telas, mesmo que a v4 passe a bloquear novos conflitos.
- Há uma relação familiar [familyRelations id=`48eaf95b-7b97-4769-b9a6-4e1825499bee`]: `Tinúviel` (`df526bc6-0839-4d64-a967-5e6d26cd7dd0`) como `FILHO` de `Rei` (`3941ee3f-2b95-4cab-b63a-887f582d363e`). `Rei` é título genérico, não pessoa canônica. A relação deve ser marcada para revisão e não servir à árvore. **E-10/S-10**.
- Os três lotes v4 (`616`, `630`, `623`) permanecem todos `APPLIED`. Há 616 chaves iguais de `baseFingerprint + sourceHash` em candidatos ativos: o histórico é versionado, mas a auditoria não diferencia adequadamente “já aplicado em execução anterior” de “novo fato aplicável”. **E-07/S-07**.
- 6.463 candidatos v2 legados continuam sem `runId`, `sourceHash` e `baseFingerprint`; mantenha-os somente como histórico, nunca como origem de nova aplicação. **E-08/S-08** e **E-09/S-09**.

## Importação

- [manuscripts id=`0196e3d4-f456-4c9d-a00a-d0d693dcdeaa`] ainda contém HTML escapado em conteúdo de capítulo.
- [manuscripts id=`e600c7cf-e5f8-42b1-9e2d-1a6eec637727`, `Capítulo II — A S`] permanece como resíduo na lixeira.

Essas fontes não podem ser reanalisadas até passar pelo *quality gate* de importação. **E-01/S-01**.

## Ferramentas e plugins recomendados

As ferramentas abaixo tratam deficiências específicas; elas não devem ser adicionadas todas ao navegador sem uma camada local de serviço, fila e testes de regressão.

| Necessidade | Ferramenta | Papel recomendado | Decisão |
|---|---|---|---|
| NER, POS e dependências em português | [Stanza](https://stanfordnlp.github.io/stanza/pipeline.html) | Serviço local Python para tokenização, etiquetas morfossintáticas, dependências e menções NER antes das regras do app. | Prioridade alta |
| Dicionário de cânone/aliases e padrões controlados | [spaCy Matcher / EntityRuler](https://spacy.io/usage/rule-based-matching) | Camada local de padrões para nomes canônicos, títulos e aliases, combinada ao NER — não substitui revisão. | Prioridade alta |
| Datas, eras e expressões temporais | [HeidelTime](https://github.com/HeidelTime/heideltime) | Serviço Java local para reconhecer/normalizar TIMEX3; possui recursos em português e modo narrativo. | Prioridade alta |
| Datas simples e testes negativos de parse | [Duckling](https://github.com/facebook/duckling) | Complemento para datas/durações estruturadas; não usar como único extrator narrativo. | Média |
| NER literário em português | Skill local `deteccao-entidades-literarias-portugues` | Define BERTimbau/PPORTAL_ner, janelas de 512 tokens e saída IOB2 com *spans*. | Prioridade alta |
| Aliases/correferência | Skill local `resolucao-correferencia-e-aliases-literarios` | Unifica `Passolargo`/`Aragorn` após NER e impede multiplicar fichas. | Média, após o NER |
| Validação de grafo temporal | Skill local `analise-consistencia-narrativa-tempo-e-eventos` | Detecta colisões e exibe inconsistências; requer campos temporais estruturados primeiro. | Média |

### Arquitetura recomendada

```text
Importação validada
  -> Stanza/BERTimbau: tokens, POS, dependências, spans NER
  -> EntityRuler: nomes canônicos e aliases do projeto
  -> resolução de aliases/correferência
  -> HeidelTime: TIMEX3 + calendário/era + rejeição editorial
  -> candidatos com evidência e alternativas de tipo
  -> validação de tipo, duplicata e ordem temporal
  -> revisão por lote com amostra obrigatória
  -> promoção ao cânone
```

## Próxima correção prioritária

1. Criar modelo temporal estruturado e migrador revisável; a tela deve ordenar por `chronologicalSortKey`, nunca por inserção.
2. Separar o extrator em tokenização/POS, NER e ligação canônica; corrigir o erro de agregação de contexto e proibir fragmentos de *span*.
3. Criar fila de remediação para os 759 conflitos e os falsos positivos já canônicos, com backup/exportação e aprovação por grupo.
4. Inserir testes de regressão com os casos: `Não — disse Aragorn`, `Portão Negro`, `Pedra Élfica`, `Montanha Solitária`, 120 milhas, 300 metros, 365 dias e 1937 editorial.

## Conclusão

O erro não é de apresentação: a timeline está modelada como uma lista de inserção e as entidades ainda são inferidas por padrões que não preservam corretamente o *span* nem o papel sintático. A correção real exige evolução do modelo de dados, pipeline NLP local com POS/NER e uma remediação revisável do legado.
