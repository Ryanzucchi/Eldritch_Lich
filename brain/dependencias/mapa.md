# Mapa de Dependências do Sistema

Este documento descreve a topologia de dependências entre os módulos de Gestão de Projetos e Escrita Criativa.

```mermaid
graph TD
    %% Módulos do Sistema
    Domain[packages/domain] --> CoreGMN[gmn/types.ts & cycle-detector.ts & propagator.ts]
    Domain --> CoreMMS[mms/similarity.ts & classifier.ts]
    Domain --> CoreMetrics[metrics/types.ts & streak-calculator.ts]
    Domain --> CoreAuth[auth/types.ts & project/types.ts]
    
    WebApp[apps/web] --> DexieSchema[db/schema.ts]
    WebApp --> MMSService[services/mms-ai.ts]
    WebApp --> AuthService[services/auth-backend.ts]
    WebApp --> Middleware[middleware.ts]
    WebApp --> GlobalNavbar[app/components/Navbar.tsx]
    
    %% Relações Funcionais
    WebApp -->|Importa tipos e lógica| Domain
    MMSService -->|Usa pipelines locais| TransformersJS[@huggingface/transformers]
    AuthService -->|Persistência Criptografada| UsersJSON[src/db/users.json & reset_tokens.json & projects.json]
    Middleware -->|Verifica Cookie JWT| AuthService
    GlobalNavbar -->|Alterna context e gerencia projetos| AuthService
    DexieSchema -->|Isolamento por projeto| DexieDB[IndexedDB Client]
    DexieSchema -->|Transações GMN| DexieDB
    
    %% Telas do Editor
    AuthPage[app/auth/page.tsx] -->|Loga / Cadastra / Recupera| WebApp
    ProfilePage[app/profile/page.tsx] -->|Edita Perfil / WebP canvas| WebApp
    GMNEditor[app/gmn/page.tsx] -->|Navbar integrada| GlobalNavbar
    GMNEditor -->|Lê/Grava Grafo| DexieSchema
    KanbanBoard[app/kanban/page.tsx] -->|Navbar integrada| GlobalNavbar
    KanbanBoard -->|Lê/Grava Metas| DexieSchema
    ManuscriptEditor[app/editor/page.tsx] -->|Analisa digitação| MMSService
    ManuscriptEditor -->|Atualiza status| DexieSchema
```

## Resumo das Dependências Físicas
*   **`@eldritch/domain`**: Pacote core contendo as regras de negócio puras (sem dependência de banco de dados ou ambiente de execução).
*   **`@eldritch/web`**: Aplicação Next.js client-side. Depende de `@eldritch/domain`, `dexie` (IndexedDB) e `@huggingface/transformers` (para inteligência artificial local).
