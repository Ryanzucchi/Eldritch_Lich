# Schema Eldritch Lich: consulta da auditoria

O banco principal é Dexie/IndexedDB local, atualmente na versão 40, nomeado `EldritchDatabase_<activeProjectId>`. A fonte canônica e detalhada é `bd.md` na raiz do projeto e `apps/web/src/db/schema.ts`.

## Tabelas mínimas para auditoria

| Área | Tabelas |
|---|---|
| Manuscrito | `manuscripts`, `manuscriptVersions`, `pendingSaves`, `folders`, `comments` |
| Extração | `automationHistories`, `wikiEntities`, `characterSheets` |
| Universo | `familyRelations`, `factionSheets`, `locationSheets`, `creatureSheets`, `itemSheets`, `historicalEventSheets`, `entityRelationLinks` |
| Tempo | `timelines`, `timelineEvents` |
| Laboratório | `sandboxes`, `sandboxChanges` |

## Relações importantes

- `projectId` delimita registros do projeto e deve ser usado como filtro.
- `personId` e `relatedPersonId` de `familyRelations` apontam para `characterSheets`.
- `timelineEvents.timelineId` aponta para `timelines`.
- `manuscriptId` em versões, comentários, salvamentos e histórico aponta para `manuscripts`.
- Campos terminados em `Id` são referências lógicas: IndexedDB não tem chaves estrangeiras, cascatas ou RLS.

## Índices que importam para a auditoria

- `automationHistories`: `projectId`, `source`, `kind`, `status`, `manuscriptId`, `createdAt`.
- `familyRelations`: `projectId`, `personId`, `relatedPersonId`, `relationType`.
- `characterSheets`: `projectId`, `name`, `role`, `factionId`.
- `wikiEntities`: `projectId`, `name`, `type`, `isConfidential`.
- `timelineEvents`: `timelineId`, `sortOrder`.

`manuscripts` não possui índice Dexie por `projectId`; filtre a coleção lida pelo projeto ativo.
