# Erros e soluções de categorização

## Objetivo e regra de consistência

Este documento transforma os achados de `AUDITORIA_CATEGORIZACAO_SENHOR_DOS_ANEIS.md` e `REAUDITORIA_CATEGORIZACAO_SENHOR_DOS_ANEIS_2026-08-07.md` em regras reutilizáveis. Ele é a referência para qualquer extração automática de manuscrito.

**Regra obrigatória:** um caso recebe um único código de erro principal (`E-xx`) e, para esse código, recebe sempre o mesmo pacote de solução (`S-xx`). Não se corrige uma ocorrência isoladamente com uma regra nova: ajusta-se o pacote da categoria e reprocessam-se todos os casos daquela categoria. Quando um registro tiver duas falhas independentes, ambas são registradas, mas cada uma conserva sua solução canônica.

Nenhuma sugestão automática é dado canônico. Somente itens revisados e promovidos podem alimentar fichas, atlas, linha do tempo, genealogia e grafo do universo.

## Fluxo único de prevenção

```text
Fonte importada
  -> S-01 validação/normalização do texto
  -> S-02 detecção de menções no contexto
  -> S-03 classificação e ligação à entidade canônica
  -> S-05 ou S-10 validação temporal/de relações
  -> S-09 registro de evidência e proveniência
  -> S-06 revisão humana
  -> promoção transacional ao dado canônico
  -> S-11 auditoria global e métricas
```

Uma reexecução usa `S-07`: ela cria uma nova execução versionada, não duplica os resultados antigos nem os promove automaticamente.

## Matriz canônica: problema encontrado -> solução encontrada

| Código | Problema encontrado | Solução encontrada e obrigatória |
|---|---|---|
| **E-01** | Texto de origem corrompido, truncado, com HTML escapado ou letras artificialmente separadas. Isso ocorreu em manuscritos como prólogo/prefácio e contamina toda extração posterior. | **S-01 — Quality gate de importação.** Guardar o texto bruto e seu hash; gerar uma versão normalizada separada; validar tamanho, proporção de caracteres isolados, tags/entidades HTML e preservação de parágrafos. Se falhar, bloquear a extração e sinalizar o manuscrito para reparo. Não tentar deduzir entidades, eventos ou relações de texto reprovado. |
| **E-02** | Falso positivo lexical: verbo, pronome, advérbio, determinante ou quantificador tratado como personagem/local/item. Exemplos auditados: `Fugimos`, `Mesmo`, `Fico`, `Logo`, `Tudo`, `Ali` e `Muitas`. | **S-02 — NER literário contextual com filtro morfossintático.** Substituir a regra de “palavra com maiúscula” por detecção de *span* dentro da frase; rejeitar classes gramaticais incompatíveis (verbos, pronomes, determinantes, advérbios e quantificadores); manter candidatos ambíguos como `PENDING`. Um limiar numérico isolado, inclusive 0,70, nunca autoriza promoção. |
| **E-03** | Tipo semântico incorreto por perda de contexto ou por classificar cada ocorrência de modo independente. Exemplos: `Frodo` como item, `Paladin` como item, `Bombadil` como local, `Umbar` como item e `Morte de Boromir` como item. | **S-03 — Ligação de entidade e restrições de tipo.** Registrar limites exatos da menção, contexto da sentença e alternativas de tipo; resolver a menção contra uma entidade canônica do projeto antes de criar outra. Aplicar restrições linguísticas e ontológicas: “filho de” requer pessoa; “casa de” não transforma o nome do morador em local; um evento não é item. Em conflito, manter uma sugestão revisável, sem atualizar a ficha canônica. |
| **E-04** | Mesma entidade criada repetidas vezes, ou a mesma ocorrência distribuída em categorias divergentes ao longo do projeto. | **S-04 — Resolução de identidade e canonização.** Normalizar rótulo/acentos, comparar aliases e contexto, eleger um `canonicalEntityId` por entidade e guardar as variantes como aliases com evidência. A categoria da entidade canônica é única; uma tentativa de mudá-la abre revisão, não cria um duplicado. |
| **E-05** | Número, distância, duração ou data editorial promovido a evento narrativo; título temporal ilegível por texto segmentado. Exemplos: `120` (milhas), `300` (metros), `365` (dias) e datas de edição/publicação como 1937, 1936 e 1949. | **S-05 — Gramática temporal narrativa e normalizador.** Aceitar evento temporal apenas quando houver expressão temporal válida, âncora e predicado narrativo; rejeitar números com unidade de medida e metadados editoriais. Distinguir explicitamente `narrative`, `editorial` e `unknown`; normalizar a representação sem alterar o trecho-fonte. Textos com letras separadas retornam ao S-01, antes de qualquer análise temporal. |
| **E-06** | Aprovação em massa sem revisão: as 6.463 sugestões da reauditoria ficaram `APPROVED` no mesmo instante, o que permitiu que ruído entrasse no banco canônico. | **S-06 — Revisão humana segura e transacional.** Nenhuma linha vem selecionada por padrão; a tela exibe tipo, confiança, trecho de evidência e destino. Ações em lote exigem seleção explícita, confirmação com contagem e gravam uma decisão por item. `Aprovar` é diferente de `aplicar`: só a aplicação confirmada cria/atualiza dado canônico, com possibilidade de desfazer o lote. |
| **E-07** | Reprocessamento cria candidatos repetidos, preserva resultados obsoletos ou mistura execuções diferentes. | **S-07 — Execuções idempotentes e ciclo de vida.** Cada execução recebe `runId`, versão do extrator e hash do manuscrito normalizado; sua chave de deduplicação inclui esses campos, trecho e tipo. Estados permitidos: `PENDING`, `APPROVED`, `REJECTED`, `APPLIED`, `SUPERSEDED`. Uma nova versão substitui candidatos pendentes equivalentes por `SUPERSEDED`; jamais duplica ou reaplica os aprovados. |
| **E-08** | Dados canônicos legados já contaminados (por exemplo, fichas e entidades sem suporte textual) continuam aparecendo apesar de um extrator novo. | **S-08 — Remediação reversível do legado.** Criar backup/exportação do projeto, marcar registros legados como `needsReview`, agrupar por E-02/E-03/E-05 e corrigir somente após revisão. Arquivar ou excluir apenas o registro confirmado como incorreto, preservando a trilha de migração. Não usar uma reextração como autorização para apagar dados antigos. |
| **E-09** | Não há evidência suficiente para explicar de onde veio uma entidade, evento, relação ou decisão automática. | **S-09 — Contrato de proveniência.** Cada candidato e dado promovido deve conter: `sourceManuscriptId`, intervalo de caracteres, citação curta, hash da fonte normalizada, `runId`, versão/modelo/regra, confiança, data, decisão, responsável e motivo. O modelo segue a separação entre dado, atividade e agente, permitindo auditoria e reversão. |
| **E-10** | Relações, genealogias e vínculos de grafo podem ser inventados ou ligados a entidades erradas. A ausência atual de relações não deve ser preenchida por inferência sem prova. | **S-10 — Verificador de relações tipadas.** Criar relação somente com evidência textual explícita, duas entidades canônicas compatíveis e tipo permitido. Guardar direção, inversa quando aplicável e fonte; bloquear autoaprovação de parentesco. Validar ciclos impossíveis e conflitos (por exemplo, uma relação parental incompatível com a cronologia). |
| **E-11** | Falta uma barreira final que meça qualidade antes de publicar alterações para os módulos. | **S-11 — Auditoria global antes da promoção.** Em cada lote, medir precisão amostral por tipo, taxa de falso positivo, duplicatas, candidatos sem evidência, conflitos de tipo e eventos temporais inválidos. Se qualquer métrica crítica piorar, bloquear a promoção e manter os resultados como candidatos revisáveis. |

## Aplicação aos achados conhecidos

| Casos do mesmo tipo | Código aplicado | Solução que deve ser repetida para todos |
|---|---|---|
| `Fugimos`, `Mesmo`, `Fico`, `Logo`, `Tudo`, `Ali`, `Muitas` e qualquer palavra funcional ou flexão verbal categorizada como entidade | E-02 | S-02 |
| `Frodo`/`Paladin` como item; `Bombadil` como local; `Umbar` como item; qualquer nome próprio com tipo incompatível | E-03 | S-03; usar S-04 se houver duplicata canônica |
| `Morte de Boromir` como item e qualquer título de acontecimento tratado como objeto | E-03 | S-03; aplicar S-05 quando houver âncora temporal |
| `Rocha do Espigão` partido ou títulos com letras espaçadas; prólogo/prefácio com HTML escapado | E-01 | S-01 antes de qualquer nova extração |
| `120`, `300`, `365`, datas editoriais e números de página/edição promovidos a eventos | E-05 | S-05 |
| As 6.463 sugestões aprovadas no mesmo segundo, ou qualquer aprovação com seleção inicial automática | E-06 | S-06 |
| Novas execuções que repetem ou misturam candidatos de versões diferentes | E-07 | S-07 |
| Entidades/fichas antigas que permanecerem sem evidência ou com tipo errado após a correção | E-08 | S-08, classificando o defeito pelo E-02, E-03 ou E-05 correspondente |
| Toda entidade, evento, item, local, relação, árvore genealógica ou cenário criado automaticamente | E-09 | S-09; e S-10 para relações/genealogia |

## Reanálise 4: regra adicional de promoção

O dump `(5)` mostrou que uma lista menor ainda pode estar errada quando o fallback por regras é aplicado em massa. Portanto, a repetição de **S-06** para todo lote passa a incluir esta restrição: **somente entidades retornadas por NER local com spans e tipo explícito podem entrar na seleção automática**. Entidades produzidas pelo fallback são candidatas individuais; nunca se tornam canônicas por “selecionar todos”.

Para **S-02/S-03**, duas novas regras são obrigatórias em todos os projetos:

1. contextos são avaliados por ocorrência, e não concatenados; uma ocorrência não pode tipar todas as demais;
2. para o fallback, um nome de um token precisa de duas evidências independentes do mesmo tipo. Empate de tipos, título genérico, direção, pronome, adjetivo ou fragmento de expressão é rejeitado.

Para **S-05**, um ano sem a palavra “Ano” só pode ser aceito se ocupar o início de uma linha cronológica e vier seguido de predicado narrativo. Unidades de medida, duração e texto editorial continuam rejeitados.

## Critérios de aceite

Uma alteração só está pronta quando, para todo candidato automático:

1. existe uma fonte textual legível e o intervalo de evidência abre no manuscrito;
2. o candidato começa como `PENDING`, sem seleção automática na interface;
3. a aplicação é idempotente e registra `runId`, decisão e responsável;
4. entidades têm tipo canônico coerente e aliases não criam duplicatas;
5. eventos distinguem cronologia da narrativa de metadados editoriais e medidas;
6. relações e genealogias possuem evidência explícita e tipos compatíveis; e
7. a auditoria S-11 é aprovada antes de popular os módulos derivados.

## Base científica e fontes consultadas

### Base científica local

- [Pipeline de NLP narrativo e tratamento em estágios](<basecientifica/Reconhecimento de Entidades e NLP em texto narrativoficção/tese/01-nlp-narrativo-cap5-desenvolvimento.md>) — sustenta separar reconhecimento, correferência/aliases, ligação e etapa de desambiguação.
- [Consistência narrativa global](<basecientifica/Detecção de contradição e consistência narrativa/tese/02-contradicao-narrativa-cap5-desenvolvimento.md>) — sustenta validação em duas camadas e grafo temporal tipado.
- [Ontologia e grafo do universo ficcional](<basecientifica/Grafos de conhecimento e visualização de relações/tese/03-grafos-conhecimento-cap5-desenvolvimento.md>) — sustenta categorias tipadas e eventos como nós próprios.
- [Recuperação e rastreabilidade de conhecimento](<basecientifica/Sistemas de recuperação de conhecimento pessoal (PKM)/tese/07-pkm-cap7-conclusao.md>) — sustenta evidência recuperável e uso de proveniência para confiança.

### Pesquisa externa

- [Hugging Face — token classification](https://huggingface.co/docs/transformers/main/tasks/token_classification) — NER como classificação de tokens com *spans*, rótulos e pontuações; justifica S-02/S-03, não uma regra por maiúsculas.
- [Chrono: A Hybrid Approach to Temporal Tagging](https://aclanthology.org/S18-1012/) — identificação e normalização de expressões temporais com regras e aprendizado; justifica S-05.
- [Temporal tagging across domains](https://aclanthology.org/L12-1219/) — mostra que mudanças de domínio exigem estratégias específicas para expressões temporais; justifica separar texto narrativo de metadados editoriais em S-05.
- [Joint Entity Recognition and Linking](https://aclanthology.org/P19-2026/) — sustenta resolver reconhecimento e ligação de entidades de forma integrada; justifica S-03/S-04.
- [W3C PROV-DM](https://www.w3.org/TR/prov-overview/) — define proveniência como informação sobre entidades, atividades e agentes para avaliar qualidade e confiabilidade; orienta S-09.

As fontes externas definem princípios e técnicas; as regras de produto acima foram adaptadas aos erros efetivamente auditados neste projeto.
