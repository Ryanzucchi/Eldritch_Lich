# Auditoria de categorização - Senhor dos Anéis

Data da auditoria: 2026-08-07

Projeto: `08579d2f-26d5-4d2f-95d1-e3884eba5dae`

Fonte dos dados: `senhor_dos_aneis_indexeddb (1).json` (exportação IndexedDB em `2026-08-07T16:21:18.153Z`)
Fonte de referência: `li-2-o-senhor-dos-aneis-j-r-r-tolkien.pdf`

## Resumo

O dump é completo e pertence a um único projeto, mas a categorização automática **não está correta**. A automação reduziu toda a taxonomia a personagens: há 578 registros em `wikiEntities`, todos do tipo `Personagem`, e as mesmas 578 entradas em `characterSheets`, todas com o papel `SECUNDARIO`.

Não foram encontradas referências órfãs nos registros presentes. Porém, as tabelas específicas de universo estão vazias (`familyRelations`, facções, locais, criaturas, itens, eventos históricos e relações entre entidades); logo, não há genealogia nem atlas categorizado para validar.

## Importação e manuscritos

- [manuscripts id=`0196e3d4-f456-4c9d-a00a-d0d693dcdeaa`] **A Sociedade do Anel - Livro II - Capítulo III: O ANEL VAI PARA O SUL** começa com HTML codificado como texto (`&lt;p&gt;`).
  - Evidência: o conteúdo exportado inicia com entidades HTML; o PDF contém texto normal do capítulo.
  - Impacto: editor, busca e extração podem ler marcação como texto e perder segmentação.
  - Sugestão: decodificar o conteúdo uma única vez antes de reexecutar qualquer análise.
- [manuscripts id=`08daf1d0-4a85-4413-b44f-26fb8998d825`] `prologo` e [manuscripts id=`7575b03f-9044-4d67-a62e-4b8849a23b0a`] `prefacio` também têm HTML codificado.
  - Impacto: essas partes geraram candidatos ruins e datas editoriais na automação.
  - Sugestão: manter os textos, mas excluí-los da extração narrativa até a importação ser normalizada.
- [manuscripts id=`e600c7cf-e5f8-42b1-9e2d-1a6eec637727`] `Capítulo II - A S` está vazio e na lixeira.
  - Impacto: nenhum no manuscrito ativo.
  - Sugestão: manter na lixeira até a revisão final ou apagá-lo permanentemente com autorização explícita.

## Entidades e fichas de personagem

- [wikiEntities e characterSheets - 578 registros] Todos os registros foram classificados como `Personagem`/`SECUNDARIO`, sem nenhuma entrada em `locationSheets`, `itemSheets`, `creatureSheets` ou `factionSheets`.
  - Evidência: o PDF identifica lugares, objetos, povos e criaturas além de pessoas; o dump contém somente a categoria de personagem.
  - Impacto: wiki, atlas, árvore genealógica e relações do universo exibem dados falsos ou ficam vazios.
  - Sugestão: descartar os candidatos automáticos inválidos e reextrair com classificação por tipo e revisão antes de aplicar.
- [wikiEntities id=`01a1d52c-d381-4d34-a99f-ccafddf143b8`] `Fugimos` foi criado como personagem.
  - Evidência: no PDF, o trecho diz “Fugimos sem levar quase nada”; é uma forma verbal, não um nome próprio.
  - Impacto: falso personagem replicado em `characterSheets`.
  - Sugestão: remover as duas fichas correspondentes após a confirmação do usuário.
- [wikiEntities id=`03bc47c5-fbac-4e28-8945-873b4e616965`] `Rocha do` foi criado como personagem.
  - Evidência: o PDF traz “Rocha do Espigão”; a extração truncou um local e ainda o classificou como pessoa.
  - Impacto: local ausente do atlas e ficha falsa de personagem.
  - Sugestão: substituir por uma ficha de local `Rocha do Espigão` somente se houver confirmação editorial.
- [wikiEntities id=`10effcc8-7dd2-4743-836e-ab15fce2e7b6`] `Anel de Frodo` foi criado como personagem.
  - Evidência: o PDF usa a expressão no diálogo de Boromir sobre o Anel; trata-se de objeto/descrição, não pessoa.
  - Impacto: item importante não é representado corretamente.
  - Sugestão: remover o candidato atual; uma futura ficha de item deve usar o nome canônico aprovado pelo autor.
- [wikiEntities id=`06dbc517-8a6f-4dd1-b356-276f603dc93f`] `Gondolin`, [id=`12e0e1ef-f10e-4f7e-b626-55bfd7031f13`] `Lórien`, [id=`154e5b65-f426-46e6-b9ac-4370a708b58c`] `Rhûn`, [id=`5e4e15ca-fd60-46cb-a4da-3acf61c0843b`] `Gondor`, [id=`7f85ad47-ec81-41b2-a918-208fb3ab3544`] `Mordor` e [id=`beba9d7d-50cd-4198-8499-a71e1b5b3e5e`] `Rohan` foram classificados como personagens.
  - Evidência: são locais/regiões da obra.
  - Impacto: o atlas não recebe marcadores nem fichas de local.
  - Sugestão: reclassificar como locais durante uma correção revisável, preservando a evidência do capítulo.
- [wikiEntities id=`0c5f587d-4ded-4698-929f-76856b927773`] `Laracna` foi classificada como personagem.
  - Evidência: é uma criatura, não uma pessoa.
  - Impacto: a ficha de criatura não é criada.
  - Sugestão: reclassificar como criatura somente após revisão de nomenclatura e evidência.

## Cronologia

- [timelineEvents - 269 registros] 263 títulos contêm separação artificial entre letras (por exemplo, `I ncêndio`, `C ondado`, `dopalantír`).
  - Evidência: o PDF extraído apresenta espaçamento tipográfico entre letras; a automação o gravou literalmente.
  - Impacto: busca, leitura e deduplicação cronológica ficam comprometidas.
  - Sugestão: normalizar o texto-fonte antes de extrair e regenerar os eventos, não apenas editar títulos isolados.
- [timelineEvents id=`17607888-562d-405f-99cb-16a8fb98aa7b`, sortOrder=`6`] `1937` foi tratado como data de evento narrativo; [id=`294b4088-caed-4dc4-bd0b-5ee6d7901d06`, sortOrder=`7`] mistura `1936` e `1949`.
  - Evidência: os trechos pertencem ao prefácio editorial sobre a escrita/publicação da obra, não à cronologia da Terra-média.
  - Impacto: a linha do tempo mistura metadados editoriais com acontecimentos ficcionais.
  - Sugestão: excluir eventos provenientes de `prefacio` e `prologo` da cronologia narrativa e exigir era/contexto para datas aceitas.
- [timelineEvents id=`6bc56f5b-a6f7-4014-afd3-3ccc2ded63f9`, sortOrder=`1`] `120` foi criado como data a partir de uma medida em milhas.
  - Evidência: o trecho fala de “120 milhas”, não de um ano.
  - Impacto: falso evento cronológico.
  - Sugestão: aceitar números como data apenas quando acompanhados por marcador temporal explícito e validado.
- Não há `sortOrder` duplicado e a única linha do tempo possui os 269 registros, mas essa integridade estrutural não torna a cronologia semanticamente válida.

## Genealogia, universo e integridade

- [familyRelations, factionSheets, locationSheets, creatureSheets, itemSheets, historicalEventSheets, entityRelationLinks] todas estão vazias.
  - Evidência: contagem zero no dump.
  - Impacto: não existem relações, genealogias ou categorias próprias para conferir contra a obra.
  - Sugestão: corrigir primeiro as entidades; só então gerar relações explícitas e rastreáveis ao capítulo de origem.
- Não foram identificados `manuscriptId` órfãos nos 3.218 registros de `automationHistories`, nem fichas de personagem sem capítulo citado.
  - Impacto: os vínculos técnicos estão íntegros, embora a semântica dos candidatos esteja comprometida.

## Histórico de automações

- [automationHistories] há 3.218 entradas: 2.660 candidatos de entidade, 551 de evento e 7 lotes aplicados. Destas, 3.211 permanecem como `DETECTED` e 7 como `APPLIED`.
- [automationHistories id=`246ed1b9-ffb7-4ce5-81fe-839d04724cf7` e id=`aa64ac1f-b743-4dd3-9c8c-14ea1b13430f`] o lote “1.547 sugestões aplicadas ao projeto” foi aplicado duas vezes.
  - Evidência: os dois registros têm o mesmo resumo e o mesmo volume; o dump resultante contém somente 578 nomes únicos, o que indica deduplicação parcial após reaplicação.
  - Impacto: a origem de cada ficha permanece ambígua e a aplicação em massa tornou falsos positivos persistentes.
  - Sugestão: manter os históricos como evidência, marcar esses lotes como revisão necessária e não aplicar novos lotes sem aprovação por candidato.
- [automationHistories id=`d017fa53-77b7-4194-a90b-4d079339af1f` e id=`d9e8ce89-3a85-46de-8fe0-73ece1970d77`] o lote “21 sugestões aplicadas ao projeto” foi aplicado duas vezes ao mesmo manuscrito.
  - Impacto: repetição de candidatos e risco de reaplicação futura.
  - Sugestão: usar uma chave de idempotência por manuscrito + conteúdo + versão da heurística.

## Conclusão

A estrutura técnica do dump está íntegra quanto aos IDs presentes, mas a categorização literária não é utilizável ainda. A correção recomendada é uma operação revisável em duas fases: (1) arquivar/remover os candidatos automáticos falsos e os eventos inválidos, preservando `automationHistories`; (2) reextrair somente entidades aprovadas, distribuindo-as nas tabelas corretas e exigindo trecho de evidência para cada registro.
