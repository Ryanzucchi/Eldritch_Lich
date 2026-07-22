# Motor GMN (Grafo de Metas Narrativas)

O motor **GMN** gerencia a causalidade das metas da história usando grafos direcionados acíclicos (DAGs). Ele garante que inconsistências de enredo sejam detectadas e propagadas em tempo real.

## Responsabilidades
1.  **Validação de Ciclos**: Previne a criação de loops de precedência no grafo usando o algoritmo de Kahn (`cycle-detector.ts`).
2.  **Propagação Causal**: Atualiza recursivamente o status dos nós dependentes em ordem topológica (`propagator.ts`). Se uma meta ancestral falhar ou se tornar inconsistente, as metas dependentes transicionam para o estado `INCONSISTENTE` gerando alertas explicativos.
3.  **Persistência Local**: Salva e restaura dados em transações atômicas no IndexedDB usando o Dexie (`schema.ts`).
4.  **Filtragem de Foco (UC-098)**: Permite focar em um personagem ou entidade do lore (Kael, Elara, Varis, etc.) no visualizador, destacando arestas e nós vizinhos de grau 1, 2 ou 3 via BFS, reduzindo a opacidade de elementos não relacionados a 10%, e ocultando nós via clique com o botão direito ("Ocultar do Grafo").

## Componentes Importantes
*   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/gmn/types.ts) - Definição dos tipos `MetaNode`, `MetaEdge` e enum `MetaStatus`.
*   [cycle-detector.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/gmn/cycle-detector.ts) - Implementação de verificação de ciclos O(|V| + |E|).
*   [propagator.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/gmn/propagator.ts) - Ordenação topológica e propagação causal.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) - Esquema Dexie e transações de exclusão atômica.
*   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/gmn/page.tsx) - Tela visual interativa do grafo com toolbar de filtros e exclusões.
