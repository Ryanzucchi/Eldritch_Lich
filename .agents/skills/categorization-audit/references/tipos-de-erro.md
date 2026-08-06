# Catálogo de erros de categorização

## Tipagem de entidade

- Item, arma ou artefato nomeado classificado como personagem por conter nome próprio.
- Local classificado como facção, ou facção como local, quando o nome é compartilhado.
- Criatura genérica ou montaria promovida a personagem.

## Cronologia

- Número de página, capítulo ou artefato de extração tratado como ano/data.
- `sortOrder` diferente da ordem real do texto.
- Evento duplicado, normalmente por reprocessamento.

## Genealogia

- Relação assimétrica: A é `PAI` de B sem contraparte coerente `FILHO`.
- Tipo de relação invertido ou contraditório.
- Pessoa mencionada de passagem promovida indevidamente a ficha completa.

## Referências órfãs

- `ownerCharacterId`, `locationId`, `factionId`, `habitatLocationId` ou equivalente aponta para registro inexistente.
- `manuscriptId` em comentários, versões ou salvamentos pendentes aponta para capítulo excluído.

## Importação/exportação

- Parágrafos ou capítulos ausentes em relação à fonte.
- Perda de itálico, quebra de linha ou diálogo.
- Metadados de capítulo não correspondem à estrutura da obra.
