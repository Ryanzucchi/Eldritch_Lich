# Linha do Tempo

## Responsabilidade

Mantém cronologias e seus eventos narrativos no IndexedDB. A tela prioriza a leitura clara da sequência, criação local de eventos e alertas de ordem causal.

## Depende de

- `@eldritch/domain/timeline` — tipos e validação causal.
- `db/schema.ts` — persistência de timelines e eventos no Dexie.

## É usado por

- `apps/web/src/app/timeline/page.tsx` — criação e visualização local de cronologias e eventos.
- `apps/web/src/services/manuscript-extraction.ts` — insere eventos detectados após aprovação do autor.
- `apps/web/src/app/nlp/page.tsx` — validação causal de eventos.

## Integração cartográfica relacionada

`GeoMap.parentMapId` organiza mapas em hierarquia no módulo cartográfico. A UI cria submapas a partir do mapa ativo e fornece breadcrumb navegável, sem duplicar imagens ou marcadores entre níveis.

## Decisões relevantes

- A interface atual mantém somente as operações que têm dados e persistência local claros: criar cronologia, adicionar e remover evento e alertar uma precedência inválida.
- Cada evento pode carregar `chronologicalSortKey`, `datePrecision`, `temporalSource`, calendário, era e componentes de data. A chave só é gravada para datas explícitas (`Ano 1042`, ISO, dia/mês/ano ou ano de uma Era), nunca para números soltos. Anos sem marcador só são aceitos em linhas cronológicas de anais com predicado narrativo.
- A tela ordena primeiro datas comprovadas e mantém eventos sem data em ordem editorial. **Ordenar datas reconhecidas** atualiza uma cronologia existente sem inventar datas para medidas, páginas ou outros números.
- O editor pode alimentar a cronologia com datas explícitas do manuscrito, mas grava apenas após revisão em lote do autor.

## Pontos de atenção

- A extração reconhece apenas formatos de data explícitos; contexto, personagens e causalidade continuam editáveis pelo autor. Datas antigas ambíguas aparecem como “ordem editorial” até correção humana.

## Última atualização

`2026-08-06` — simplificação da tela para cronologia local legível e integração com sugestões extraídas do manuscrito.
