# Reauditoria de categorização - Senhor dos Anéis

Data: 2026-08-07

Projeto: `08579d2f-26d5-4d2f-95d1-e3884eba5dae`

Dump auditado: `senhor_dos_aneis_indexeddb (2).json`, exportado em `2026-08-07T16:40:16.051Z`.

Fonte textual: `li-2-o-senhor-dos-aneis-j-r-r-tolkien.pdf`.

## Resultado executivo

O dump está estruturalmente íntegro quanto às referências auditadas, mas a categorização literária continua incorreta e piorou em volume. A nova extração criou 6.463 candidatos e **todos foram aprovados no mesmo instante** (`2026-08-07T16:39:49.019Z`), sem permanecer nenhum candidato pendente para revisão. Isso propagou candidatos errados para 2.522 entidades e fichas de universo.

## Importação/exportação

- [manuscripts id=`08daf1d0-4a85-4413-b44f-26fb8998d825`] `prologo` e [manuscripts id=`7575b03f-9044-4d67-a62e-4b8849a23b0a`] `prefacio` ainda contêm HTML codificado como texto.
  - Evidência: o conteúdo começa com `&lt;p&gt;` no dump.
  - Problema/impacto: material editorial pode alimentar extrações e datas indevidas; a normalização ainda não foi salva nesses dois documentos.
  - Sugestão: normalizar esses textos antes de qualquer nova análise e mantê-los fora da cronologia narrativa.
- [manuscripts id=`e600c7cf-e5f8-42b1-9e2d-1a6eec637727`] `Capítulo II — A S` continua vazio e na lixeira.
  - Impacto: não afeta os 64 manuscritos ativos.
  - Sugestão: manter fora da análise; apagar permanentemente apenas mediante confirmação explícita.

## Candidatos e aprovação automática

- [extractionCandidates - 6.463 registros] Todos possuem `status=APPROVED`, a mesma `decidedAt` e a versão `conservative-pt-v2`.
  - Evidência: 6.433 candidatos de entidade e 30 de evento foram aprovados em `2026-08-07T16:39:49.019Z`; não há `PENDING`.
  - Problema: houve aplicação coletiva, não uma revisão seletiva verificável por candidato.
  - Impacto: a etapa criada para proteger o cânone foi contornada na prática; confiança de 70% a 84% foi tratada como aprovação, apesar de não ser prova semântica.
  - Sugestão: o botão de aplicar deve iniciar sem itens selecionados, exigir confirmação de quantidade e registrar a decisão individual ou em lote com usuário/motivo.
- [extractionCandidates id=`00192818-de5c-4b97-801d-62178a6ddf99`] `Mesmo` foi aprovado como `Personagem` com confiança 74%.
  - Evidência da fonte: ocorre na frase “Mesmo que precisasse...”; é palavra funcional, não entidade.
  - Impacto: ficha falsa de personagem.
  - Sugestão: descartar o candidato e bloquear palavras funcionais, verbos conjugados e pronomes antes da classificação.
- [extractionCandidates id=`0025e1f0-7ee7-4357-82f7-887e5644a9e6`] `Fico` foi aprovado como `Personagem` com 70%.
  - Evidência: “Fico imaginando...”; é forma verbal.
  - Impacto: ficha falsa de personagem.
  - Sugestão: rejeitar candidatos de uma palavra que só aparecem como verbo no contexto.
- [extractionCandidates id=`00b8e230-c3b3-484f-8eaf-a9068131b178`] `Muitas` foi aprovado como `Local` com 78%.
  - Evidência: “Muitas orelhas em pé...”; é quantificador.
  - Impacto: marcador/ficha de local falsa.
  - Sugestão: o contexto de uma palavra genérica como “vila” não pode classificar automaticamente o token seguinte ou anterior como local.
- [extractionCandidates id=`00e2f8cb-3800-45ff-a2ed-744d1a27cedc`] `Frodo` foi aprovado como `Item` com 84%.
  - Evidência: o trecho identifica Frodo como pessoa diante de Faramir.
  - Impacto: cria item falso e contradiz a ficha de personagem existente.
  - Sugestão: aplicar desambiguação por nome consolidado antes da classificação contextual; um personagem canônico não deve ser promovido a item pelo contexto vizinho.
- [extractionCandidates id=`005c58b6-9472-447c-90c8-be42798e1ee2`] `Bombadil` foi aprovado como `Local` com 78%.
  - Evidência: “na casa de Bombadil”; a casa é o local, Bombadil é personagem.
  - Impacto: troca sujeito por local.
  - Sugestão: exigir que o núcleo do sintagma de local seja o candidato, e não apenas uma palavra no contexto.
- [extractionCandidates id=`000425c4-f5a7-473b-8834-d64be1dd5c6d`] `Paladin` foi aprovado como `Item` com 84%.
  - Evidência: “Peregrin, filho de Paladin”; Paladin é pessoa.
  - Impacto: categoria errada em `itemSheets`.
  - Sugestão: relações explícitas como “filho de” devem prevalecer sobre pistas lexicais de item.

## Entidades e fichas do universo

- [wikiEntities - 2.522 registros] A distribuição passou a ser 1.727 personagens, 489 locais, 138 itens, 119 organizações e 49 criaturas. Porém, as tabelas específicas receberam volumes incompatíveis: 1.851 fichas de personagem, 829 locais, 319 itens, 278 facções e 158 criaturas.
  - Evidência: contagens do dump; exemplos de falsos positivos estão acima.
  - Problema: o mesmo texto produziu classificações conflitantes por ocorrência, e não uma entidade canônica consolidada.
  - Impacto: atlas, wiki, facções e inventário não são confiáveis para consulta ou geração posterior.
  - Sugestão: consolidar primeiro pelo nome normalizado e pela evidência, classificar a entidade depois de agregar todas as ocorrências e exigir revisão dos casos que recebem tipos diferentes.
- [wikiEntities id=`0062a3f9-f94c-461a-96af-a8139f96a126`] `Umbar` está como `Item`.
  - Evidência da fonte: “aportando em Umbar”; é local.
  - Sugestão: reclassificar como local após revisão humana.
- [wikiEntities id=`06264a7a-389a-4199-8007-4443c51112eb`] `Morte de Boromir` está como `Item`.
  - Evidência da fonte: é acontecimento narrativo.
  - Sugestão: não criar entidade perene; representar como evento histórico somente se aprovado.
- Registros legados incorretos continuam presentes, incluindo [wikiEntities id=`01a1d52c-d381-4d34-a99f-ccafddf143b8`] `Fugimos` como personagem e [wikiEntities id=`03bc47c5-fbac-4e28-8945-873b4e616965`] `Rocha do` como personagem.
  - Evidência da fonte: “Fugimos sem levar...” é verbo; “Rocha do Espigão” é um local cujo nome foi truncado.
  - Sugestão: corrigir o acervo legado em uma operação separada, com backup e lista de aprovação.

## Cronologia

- [timelineEvents - 299 registros] 292 títulos ainda apresentam espaçamento artificial entre letras.
  - Evidência: títulos como `T orre E scura` e `L este` persistem.
  - Impacto: busca, deduplicação e leitura da linha do tempo ficam degradadas.
  - Sugestão: normalizar a origem e regenerar os eventos afetados; não acrescentar uma segunda cópia ao registro antigo.
- [timelineEvents id=`6bc56f5b-a6f7-4014-afd3-3ccc2ded63f9`, sortOrder=`1`] usa `120` como data para um trecho sobre “120 milhas”.
  - Impacto: medida espacial tratada como data.
  - Sugestão: remover como evento cronológico.
- [timelineEvents id=`260a4d4e-0e5d-412b-af9e-113243b1ede1`, sortOrder=`266`] usa `300` para “300 metros”; [id=`16c6a4aa-fe47-4a88-8b34-152e64125d64`, sortOrder=`250`] usa `365` para dias e horas.
  - Sugestão: rejeitar números acompanhados por unidade física ou de duração.
- [timelineEvents id=`17607888-562d-405f-99cb-16a8fb98aa7b`] usa `1937`; [id=`294b4088-caed-4dc4-bd0b-5ee6d7901d06`] mistura `1936` e `1949`.
  - Evidência: são datas editoriais do prefácio, não fatos da Terra-média.
  - Sugestão: excluir cronologia de prefácio/prólogo e limpar os eventos já gravados dessa origem.
- Não há `sortOrder` duplicado nem referências a `timelineId` inexistente. A integridade técnica da sequência não valida seu significado narrativo.

## Genealogia, automação e integridade

- `familyRelations`, `historicalEventSheets` e `entityRelationLinks` continuam vazias.
  - Impacto: não existe genealogia ou grafo factual categorizado para validar.
  - Sugestão: só gerar relações a partir de candidatos revisados e com trecho explícito.
- [automationHistories - 9.682 registros] 9.674 continuam como `DETECTED` e 8 como `APPLIED`.
  - Evidência: os históricos preservam origem, mas não impedem o acúmulo de detecções antigas.
  - Sugestão: vincular cada histórico a um candidato por fingerprint e arquivar detecções substituídas, sem apagá-las.
- Não foram identificados `manuscriptId` órfãos em `automationHistories` ou `extractionCandidates`, nem `timelineId` órfão. Também não há fingerprint duplicado nos candidatos v2.

## Conclusão

As proteções de proveniência e idempotência funcionaram tecnicamente: os candidatos têm fingerprint, versão de heurística, decisão e referência de manuscrito. A falha é de qualidade e fluxo de aprovação: a extração ainda aceita candidatos demasiadamente amplos e todos foram promovidos em lote. A próxima correção deve impedir a seleção inicial automática, endurecer a filtragem linguística e executar uma limpeza revisável dos dados aprovados neste lote antes de qualquer nova análise.
