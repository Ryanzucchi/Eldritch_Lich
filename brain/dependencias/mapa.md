# Mapa de Dependências do Sistema

Este documento descreve a topologia de dependências entre os módulos de Gestão de Projetos e Escrita Criativa.

```mermaid
graph TD
    %% Módulos do Sistema
    Domain[packages/domain] --> CoreGMN[gmn/types.ts & cycle-detector.ts & propagator.ts]
    Domain --> CoreMMS[mms/similarity.ts & classifier.ts]
    Domain --> CoreMetrics[metrics/types.ts & streak-calculator.ts]
    
    WebApp[apps/web] --> DexieSchema[db/schema.ts]
    WebApp --> MMSService[services/mms-ai.ts]
    
    %% Relações Funcionais
    WebApp -->|Importa tipos e lógica| Domain
    MMSService -->|Usa pipelines locais| TransformersJS[@huggingface/transformers]
    DexieSchema -->|Transações GMN| DexieDB[IndexedDB Client]
    DexieSchema -->|Tabelas de Produtividade| DexieDB
    DexieSchema -->|Mapeamento de Atalhos| DexieDB
    DexieSchema -->|Tabela de Manuscritos| DexieDB
    
    %% Telas do Editor
    GMNEditor[app/gmn/page.tsx] -->|Lê/Grava Grafo| DexieSchema
    KanbanBoard[app/kanban/page.tsx] -->|Lê/Grava Metas| DexieSchema
    ManuscriptEditor[app/editor/page.tsx] -->|Analisa digitação| MMSService
    ManuscriptEditor -->|Atualiza status| DexieSchema
    ManuscriptEditor -->|Atualiza progresso e streaks| DexieSchema
    ManuscriptEditor -->|Lê/Grava Atalhos Customizados| DexieSchema
    ManuscriptEditor -->|Gerencia Capítulos e Bloqueio| DexieSchema
```

## Resumo das Dependências Físicas
*   **`@eldritch/domain`**: Pacote core contendo as regras de negócio puras (sem dependência de banco de dados ou ambiente de execução).
*   **`@eldritch/web`**: Aplicação Next.js client-side. Depende de `@eldritch/domain`, `dexie` (IndexedDB) e `@huggingface/transformers` (para inteligência artificial local).
