# Motor GMN (Grafo de Metas Narrativas)

O motor **GMN** gerencia a causalidade das metas da história usando grafos direcionados acíclicos (DAGs). Ele garante que inconsistências de enredo sejam detectadas e propagadas em tempo real.

## Responsabilidades
1.  **Validação de Ciclos**: Previne a criação de loops de precedência no grafo usando o algoritmo de Kahn (`cycle-detector.ts`).
2.  **Propagação Causal**: Atualiza recursivamente o status dos nós dependentes em ordem topológica (`propagator.ts`). Se uma meta ancestral falhar ou se tornar inconsistente, as metas dependentes transicionam para o estado `INCONSISTENTE` gerando alertas explicativos.
3.  **Persistência Local**: Salva e restaura dados em transações atômicas no IndexedDB usando o Dexie (`schema.ts`).

## Componentes Importantes
*   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/gmn/types.ts) - Definição dos tipos `MetaNode`, `MetaEdge` e enum `MetaStatus`.
*   [cycle-detector.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/gmn/cycle-detector.ts) - Implementação de verificação de ciclos O(|V| + |E|).
*   [propagator.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/gmn/propagator.ts) - Ordenação topológica e propagação causal.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) - Esquema Dexie e transações de exclusão atômica.
