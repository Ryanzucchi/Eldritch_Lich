# Auditoria aprofundada de categorização — Senhor dos Anéis

**Data do dump:** 2026-08-07T17:05:32.895Z  
**Projeto:** `08579d2f-26d5-4d2f-95d1-e3884eba5dae`  
**Fonte auditada:** `senhor_dos_aneis_indexeddb (3).json` (exportação completa do IndexedDB)  
**Escopo:** importação, candidatos v2/v3, dados canônicos, cronologia, genealogia, automações e referências lógicas.  
**Método:** leitura do dump completo, confronto de evidências armazenadas nos candidatos com os manuscritos e aplicação do catálogo em `erros_e_solucoes.md`. Esta auditoria **não alterou** o banco.

## Resumo executivo

O dump é estruturalmente completo, mas a qualidade semântica continua crítica. A execução v3 reduziu alguns tipos de erro de contexto, porém promoveu **6.344 candidatos de uma vez** em 2026-08-07T17:05:13.223Z. Desses, 6.314 são entidades e 30 eventos; não há relações familiares. A confirmação em lote foi usada como aprovação de massa, portanto o problema de qualidade não foi resolvido pela interface.

| Indicador | Resultado | Severidade |
|---|---:|---|
| Candidatos v3 aplicados | 6.344 | crítica |
| Candidatos v3 com nome funcional/gramatical em lista conservadora | 650 | crítica |
| Fichas de personagem cujo nome só existe na Wiki com outro tipo | 759 | crítica |
| Eventos na cronologia | 299 | alta |
| Títulos temporais com espaçamento de importação | 136 | alta |
| Eventos temporais longos (>110 caracteres) | 52 | alta |
| Candidatos v2 legados sem proveniência v3 | 6.463 | alta |
| Referências órfãs encontradas nas tabelas auditadas | 0 | positivo, mas insuficiente para validar semântica |

## Cobertura e estado da automação

O projeto possui 65 manuscritos (64 ativos e 1 na lixeira), 2.522 entidades Wiki, 2.486 fichas de personagem, 831 locais, 319 itens, 283 facções, 158 criaturas, uma cronologia com 299 eventos e nenhuma relação familiar.

- `extractionCandidates`: 19.151 registros.
  - 6.463 v2, todos `SUPERSEDED` e sem `runId`, `sourceHash` ou `baseFingerprint`.
  - 6.344 v3 do `runId=58022f14-5e76-4645-976f-1caa7bc72e8a`, todos `SUPERSEDED`.
  - 6.344 v3 do `runId=23c53cc9-edf2-4abf-9ab0-a47525a44a85`, todos `APPLIED`.
- A aplicação mais recente possui histórico `automationHistories id=6b4448af-66a7-4634-94a4-5f36b4153d7d`: “6.344 sugestões revisadas e aplicadas ao projeto”. Não há registros `PENDING` após ela.
- A chave `fingerprint` não se repete e não há candidato apontando para manuscrito inexistente. Isso confirma a integridade mecânica do reprocessamento, **não** a qualidade dos fatos.

## Importação/exportação

- [manuscripts id=`0196e3d4-f456-4c9d-a00a-d0d693dcdeaa`, **A Sociedade do Anel — Livro II — Capítulo III: O ANEL VAI PARA O SUL**] O conteúdo ainda contém blocos inteiros como `&lt;p&gt;...&lt;/p&gt;`. Evidência: o dump preserva HTML como texto, misturado a trechos HTML reais no mesmo manuscrito. Problema: o texto deixa de ser uma fonte confiável para segmentação, contexto e offsets. Impacto: erros de entidade e de cronologia podem ser derivados desse capítulo. Correção: **E-01 / S-01** — bloquear análise, preservar hash bruto e normalizar/revisar a importação antes de qualquer nova execução.

- [manuscripts id=`08daf1d0-4a85-4413-b44f-26fb8998d825`, `prologo`; id=`7575b03f-9044-4d67-a62e-4b8849a23b0a`, `prefacio`] Ambos continuam com HTML escapado. Impacto: metadados editoriais podem vazar para a extração temporal. Correção: **E-01 / S-01**.

- [manuscript id=`e600c7cf-e5f8-42b1-9e2d-1a6eec637727`, `Capítulo II — A S`] Permanece na lixeira e tem apenas 24 caracteres de conteúdo. Impacto: é um resíduo de importação, não um capítulo utilizável. Correção: **E-08 / S-08** — manter como lixeira até confirmação e não incluí-lo em análises.

## Entidades — falsos positivos lexicais

Foi aplicada uma lista conservadora de palavras funcionais, pronomes, advérbios, conectivos, quantificadores e flexões verbais ao conjunto v3 `APPLIED`. Ela identificou **650 candidatos** que não devem ser personagens. Esse número é um mínimo verificável, não a quantidade total de erros.

| Evidência | Ocorrências aplicadas | Problema |
|---|---:|---|
| `Quando` | 49 | conjunção temporal promovida a personagem |
| `Finalmente` | 44 | advérbio promovido a personagem |
| `Isso` | 42 | pronome demonstrativo promovido a personagem |
| `Ali` | 38 | advérbio promovido a personagem |
| `Logo` | 35 | conectivo/advérbio promovido a personagem |
| `Mesmo` | 35 | pronome/advérbio promovido a personagem |
| `Muito` | 26 | quantificador promovido a personagem |
| `Nem` | 26 | conjunção promovida a personagem |
| `Senhora` | 24 | tratamento isolado, sem identidade canônica |
| `Tudo` | 24 | pronome indefinido promovido a personagem |

Achados individuais verificáveis:

- [extractionCandidates id=`049192d8-e1cc-4763-825d-bbab9783e2a9`] `Quando`, tipo `Personagem`, confiança 0,74. Trecho: “Quando todos tiverem chegado conversaremos”. Problema: conjunção. Impacto: cria ficha e/ou polui pesquisa de personagens. Correção: **E-02 / S-02**.
- [extractionCandidates id=`02d8d75b-e81f-4567-b6c7-fb481c63a3d1`] `Finalmente`, tipo `Personagem`, confiança 0,74. Trecho: “Finalmente o banquete chegou ao fim.” Problema: advérbio. Correção: **E-02 / S-02**.
- [extractionCandidates id=`02fdaf24-d386-47e7-a53e-443c579ce78a`] `Isso`, tipo `Personagem`, confiança 0,70. Trecho: “Isso é bom”. Problema: pronome demonstrativo. Correção: **E-02 / S-02**.
- [extractionCandidates id=`009aa1bf-6385-4ec5-831e-0ae4f326a2b3`] `Ali`, tipo `Personagem`, confiança 0,74. Trecho: “Ali pararam e ajustaram as correias”. Problema: advérbio locativo. Correção: **E-02 / S-02**.

O padrão prova que confiança 0,70–0,74 não é critério suficiente: 6.088 das 6.314 entidades v3 aplicadas estão nessa faixa baixa. Correção sistêmica: aumentar a barreira de promoção para que candidatos sem validação morfossintática permaneçam `PENDING`, conforme **E-02 / S-02** e **E-06 / S-06**.

## Entidades — classificação e conflito entre tabelas

- [extractionCandidates id=`029f4bf0-7117-4fff-875d-55e526f98ed9`] `Valfenda` foi aplicado como `Personagem` (0,74), embora o trecho seja “acima de Valfenda” e o universo da obra o trate como local. Correção: **E-03 / S-03**.
- [extractionCandidates id=`02a54fbf-8128-49e4-bb3e-e99736b67f17`] `Sauron` foi classificado como `Local` (0,82) no trecho “o reino de Sauron está terminado”; outras ocorrências o classificam como `Personagem` (por exemplo, id=`02f78a19-d46b-4fdb-8e8d-e784b7f5e217`). O contexto de “reino de” não pode redefinir a identidade do nome. Correção: **E-03 / S-03** e **E-04 / S-04**.
- [characterSheets] Há **759** fichas de personagem sem uma entidade Wiki `Personagem` de mesmo nome; em todos esses casos o nome já aparece na Wiki com outro tipo. Exemplos: `Levantou-se` (Wiki `Item`), `Lothlórien` (Wiki `Local`), `Rhovanion` (Wiki `Local`), `Bregalad` (Wiki `Local`), `Varda` (Wiki `Local`) e `Uruk-hai` (Wiki `Organizacao`). Impacto: módulos diferentes exibem a mesma cadeia de caracteres como pessoa, local, item ou organização. Correção: **E-03 / S-03** seguido de **E-04 / S-04**; não mesclar automaticamente nomes homônimos, mas revisar os 759 conflitos por evidência.

Exemplos com localização precisa:

- [characterSheets id=`01c14431-b835-4832-8405-0b2c43cee481`] `Levantou-se` possui biografia “começou a chorar. Levantou-se passando...”; a Wiki associada é `Item` id=`03b0653d-b5a4-4144-b3a5-89cfda98cd82`. Problema: verbo convertido em duas categorias canônicas. Correção: **E-02 / S-02**, depois **E-08 / S-08**.
- [characterSheets id=`0490268e-a068-4304-8ba8-37dd94771552`] `Lothlórien` é ficha de personagem, enquanto `wikiEntities id=d1719bc4-ee38-4ba2-ba42-cf4f18c3d676` o traz como local. Problema: conflito canônico. Correção: **E-03 / S-03** e **E-04 / S-04**.
- [characterSheets id=`04e4db64-0c89-4ac2-9915-85fde3b46e77`] `Rhovanion` é ficha de personagem e `wikiEntities id=34f81867-691e-4f35-8e7d-be7e2eabafdf` o traz como local. Correção: **E-03 / S-03**.

## Cronologia

Não há `sortOrder` duplicado nem eventos apontando para linha do tempo inexistente. Contudo, a cronologia é semanticamente inválida em grande parte:

- [timelineEvents id=`17607888-562d-405f-99cb-16a8fb98aa7b`] data `1937`, texto de prefácio sobre a escrita/ordenação da obra. É metadado editorial, não evento narrativo. Correção: **E-05 / S-05**.
- [timelineEvents id=`294b4088-caed-4dc4-bd0b-5ee6d7901d06`] data `1936`, texto sobre período de escrita/estudo. Mesmo erro editorial. Correção: **E-05 / S-05**.
- [timelineEvents id=`6bc56f5b-a6f7-4014-afd3-3ccc2ded63f9`] data `120`, descrição de milhas. Distância foi promovida a ano/evento. Correção: **E-05 / S-05**.
- [timelineEvents id=`260a4d4e-0e5d-412b-af9e-113243b1ede1`] data `300`, descrição de metros. Correção: **E-05 / S-05**.
- [timelineEvents id=`16c6a4aa-fe47-4a88-8b34-152e64125d64`] data `365`, descrição de dias/horas/minutos. Correção: **E-05 / S-05**.

Dos 299 eventos, 136 possuem caracteres artificialmente separados no título e 52 possuem título acima de 110 caracteres. Exemplos: `I ncêndio de Osgiliath...` (id=`02a3ffec-fcbd-4bfe-8dd6-11d0febf9950`) e `mas para os ﬁns dos anais...` (id=`0581c37c-9144-44bc-866e-ce4eee7423cf`). Impacto: a linha do tempo não é legível nem confiável como síntese narrativa. Correção: **E-01 / S-01** antes de **E-05 / S-05**; não apenas “formatar” o título.

## Genealogia e relações

- [familyRelations] A tabela está vazia.
- [extractionCandidates v3] Não há candidato `relation`, embora o corpus tenha fórmulas explícitas de parentesco e as fichas de personagem tenham sido criadas em massa.

Isso evita uma genealogia inventada, mas revela cobertura incompleta do pipeline: as entidades foram promovidas, relações explícitas não foram sequer oferecidas para revisão. Correção: **E-10 / S-10** — extrair somente relações com trecho explícito, exigir duas entidades canônicas compatíveis e mantê-las pendentes até aprovação.

## Referências órfãs e integridade técnica

Foram verificadas as referências existentes em `itemSheets.ownerCharacterId`, `itemSheets.locationId`, `locationSheets.factionId`, `creatureSheets.habitatLocationId`, `timelineEvents.timelineId` e `automationHistories.manuscriptId`.

- Nenhuma referência órfã foi encontrada.
- Não há `fingerprint` duplicado, nem duplicação de candidato ativo por `baseFingerprint + sourceHash + heuristicVersion`.

Esse resultado é positivo, mas não reduz os problemas de categorização: os registros podem apontar para IDs válidos e ainda representar palavras, locais ou objetos com tipo incorreto.

## Proveniência e histórico

- Os 6.463 candidatos v2 legados não contêm os campos introduzidos para rastreabilidade (`runId`, `sourceHash`, `baseFingerprint`). Eles permanecem `SUPERSEDED`, portanto não devem ser promovidos novamente. Correção: **E-09 / S-09** e **E-08 / S-08** — mantê-los como histórico legado, nunca como fonte de reaplicação.
- Os candidatos v3 possuem chave versionada e não duplicam a execução anterior. Porém, o lote aplicado demonstra que proveniência técnica sem revisão semântica não garante qualidade. Correção: **E-06 / S-06** e **E-11 / S-11** — a seleção em lote precisa de uma etapa de validação por tipo antes da promoção, com amostragem e bloqueio quando a taxa de falsos positivos exceder o limite.

## Ordem segura de correção

1. **Não executar nova aplicação em lote.** Manter o dump atual como ponto de restauração.
2. Aplicar **S-01** nos quatro manuscritos com HTML escapado e revalidar sua legibilidade.
3. Criar uma remediação revisável para os 650 falsos positivos mínimos e os 759 conflitos de tipo; não apagar em massa sem lista de revisão/exportação.
4. Corrigir a regra de promoção: filtro morfossintático + resolução canônica devem ocorrer antes de a UI permitir seleção automática por categoria.
5. Recriar a cronologia a partir de candidatos temporais válidos, excluindo metadados editoriais, medidas e texto com espaçamento de PDF.
6. Reexecutar a auditoria S-11 e promover somente lotes que atinjam a métrica de precisão definida por categoria.

## Conclusão

O reprocessamento v3 é idempotente no nível técnico, mas ainda não é seguro no nível semântico. O defeito central é a promoção de candidatos de baixa confiança e falsos positivos para tabelas canônicas. A prioridade não é extrair mais dados: é remediar o legado, bloquear promoção sem validação por tipo e só então reanalisar o manuscrito normalizado.
