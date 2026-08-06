# Galeria de mídia

## Superfície atual

A página `app/gallery/page.tsx` oferece upload local de imagens de até 5 MB, persistidas como Data URL em `mediaAssets`. A galeria filtra por categoria e texto e não depende de armazenamento externo.

## Responsabilidade

Armazena imagens do projeto no IndexedDB, permite filtrá-las e exporta o acervo completo como ZIP local.

## Depende de

- `db/schema.ts` — tabela `mediaAssets` particionada por projeto.
- `services/zip-export.ts` — montagem de ZIP compatível sem biblioteca externa.

## É usado por

- `apps/web/src/app/gallery/page.tsx` — upload, visualização, remoção e exportação.

## Decisões relevantes

- A exportação usa ZIP sem compressão (store), preservando bytes e evitando dependência adicional; o arquivo contém CRC-32 e diretório central padrão.

## Pontos de atenção

- URLs remotas precisam ser acessíveis pelo navegador para que seus bytes possam ser incluídos; assets enviados pela galeria usam data URLs e funcionam offline.

## Última atualização

`2026-08-06` — via sincronização automática (`brain-sync`) referente à exportação ZIP (UC-275).
