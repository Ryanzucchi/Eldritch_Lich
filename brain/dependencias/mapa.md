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
    WebApp --> DashboardLayout[app/components/ClientLayout.tsx]
    WebApp --> AppContext[context/AppContext.tsx]
    
    %% Relações Funcionais
    WebApp -->|Importa tipos e lógica| Domain
    MMSService -->|Usa pipelines locais| TransformersJS[@huggingface/transformers]
    AuthService -->|Persistência Criptografada| UsersJSON[src/db/users.json & reset_tokens.json & projects.json]
    TwoFactorAPI[app/api/auth/2fa] -->|Gera, cifra e valida TOTP| AuthService
    AuthPage -->|Conclui login 2FA| TwoFactorAPI
    ProfilePage -->|Configura/desabilita 2FA| TwoFactorAPI
    SessionsAPI[app/api/auth/sessions] -->|Lista e revoga sessões| AuthService
    ProfilePage -->|Consulta e revoga dispositivos| SessionsAPI
    PrivacyAPI[app/api/auth/account & export] -->|Exporta e remove dados próprios| AuthService
    ProfilePage -->|Portabilidade e exclusão permanente| PrivacyAPI
    ManuscriptsAPI[app/api/manuscripts] -->|Aplica permissão de pasta e preserva metadados| AuthService
    ManuscriptEditor -->|Reidrata cópia local e sincroniza capítulos| ManuscriptsAPI
    ManuscriptEditor -->|Configura e respeita writePermission| ManuscriptsAPI
    ChatPage[app/chat/page.tsx] -->|Cria canais e envia mensagens| ChatAPI[app/api/chat]
    ChatAPI -->|Autoriza anúncios por papel| AuthService
    ChatPage -->|Cria e referencia tarefas| KanbanBoard
    KanbanBoard -->|Publica movimentações automáticas| ChatAPI
    NlpDashboard[app/nlp/page.tsx] -->|Exibe contradições locais| ContradictionEngine[packages/domain/nlp/contradictions.ts]
    NlpDashboard -->|Compara manuscritos do projeto| ContradictionEngine
    NlpDashboard -->|Detecta conflito de local| ContradictionEngine
    NlpDashboard -->|Valida dependências causais| TimelineEngine[packages/domain/timeline/types.ts]
    ManuscriptEditor -->|Verifica antes de autosalvar| ContradictionEngine
    NlpDashboard -->|Recupera trechos citados| DexieSchema
    ManuscriptEditor -->|Consulta referências cruzadas| EditorSearch[packages/domain/editor/search.ts]
    ManuscriptEditor -->|Exporta roteiro Fountain| EditorExporter[packages/domain/editor/exporter.ts]
    ManuscriptEditor -->|Extrai termos TF-IDF do corpus local| KeywordEngine[packages/domain/nlp/keywords.ts]
    NlpDashboard -->|Exibe palavras-chave locais| KeywordEngine
    ManuscriptEditor -->|Gera resumo por cenas para nota| SummaryEngine[packages/domain/nlp/summary.ts]
    Middleware -->|Verifica Cookie JWT| AuthService
    DashboardLayout -->|Consome dados e expõe fluxos literários prontos| AppContext
    AppContext -->|Gerencia projetos e sessão| AuthService
    DexieSchema -->|Isolamento por projeto| DexieDB[IndexedDB Client]
    DexieSchema -->|Transações GMN| DexieDB
    
    %% Telas do Editor
    AuthPage[app/auth/page.tsx] -->|Loga / Cadastra / Recupera| WebApp
    ProfilePage[app/profile/page.tsx] -->|Layout unificado| DashboardLayout
    GMNEditor[app/gmn/page.tsx] -->|Layout unificado| DashboardLayout
    GMNEditor -->|Lê/Grava Grafo| DexieSchema
    GMNEditor -->|Valida conexões manuais e propaga estado| CoreGMN
    KanbanBoard[app/kanban/page.tsx] -->|Layout unificado| DashboardLayout
    KanbanBoard -->|Lê/Grava Metas| DexieSchema
    ManuscriptEditor[app/editor/EditorWorkspace.tsx] -->|Edita e salva capítulos locais| DexieSchema
    ManuscriptEditor -->|Normaliza, solicita e revisa candidatos| ManuscriptExtraction[services/manuscript-extraction.ts]
    ManuscriptExtraction -->|Quando configurado, reconhece entidades em português sem API externa| LocalLinguistics[services/local-linguistic-analysis.ts]
    LocalLinguistics -->|POST somente em localhost| StanzaLocal[infralauch/linguistics]
    ManuscriptExtraction -->|Produz evidência, confiança, hash da fonte e fingerprint| ExtractionCandidates[db.extractionCandidates]
    ManuscriptEditor -->|Escolhe adicionar/refazer, versiona execução e promove somente seleção confirmada| DexieSchema
    ManuscriptEditor -->|Sincroniza cópia de trabalho| ManuscriptsAPI
    ManuscriptEditor[app/editor/page.tsx] -->|Analisa digitação| MMSService
    ManuscriptEditor -->|Atualiza status| DexieSchema
    StoryPage[app/story/page.tsx] -->|Organiza capítulos existentes em atos escolhidos| DexieSchema
    ProjectsHub[app/projects/GoogleDocsHomeComponent.tsx] -->|Consome sessão e projetos| AppContext
    ProjectsHub -->|Cria/abre workspace| DexieSchema
    ProjectsHub -->|Cria destino sem ativar e clona base local| ProjectClone[services/project-clone.ts]
    ProjectClone -->|Abre bases particionadas e remapeia referências| DexieSchema
    GalleryPage[app/gallery/page.tsx] -->|Empacota assets locais| ZipExport[services/zip-export.ts]
    GalleryPage -->|Lê mídia por projeto| DexieSchema
    StatsPage[app/stats/page.tsx] -->|Layout unificado| DashboardLayout
    StatsPage -->|Lê estatísticas| DexieSchema
    StatsPage -->|Consulta membros do projeto| ShareAPI[app/api/projects/share/route.ts]
    StatsPage -->|Calcula métricas de estilo dos manuscritos| DexieSchema
    DashboardLayout -->|Gerencia lembretes| DexieSchema
    WikiPortal[app/wiki/page.tsx] -->|Layout unificado| DashboardLayout
    WikiPortal -->|Lê/Grava Lore| DexieSchema
    WorldbuildingPage[app/worldbuilding/page.tsx] -->|Lê personagens e vínculos familiares confirmados| WorldbuildingTypes[domain/worldbuilding/types.ts]
    WorldbuildingPage -->|Persiste nós e aplica filtros combinados| DexieSchema
    WorldbuildingPage -->|Seleciona participantes de eventos| WorldbuildingTypes
    WorldbuildingPage -->|Armazena ilustrações locais em data URL| DexieSchema
    WorldbuildingPage -->|Sincroniza devoções e listas de crentes| WorldbuildingTypes
    MapsPage[app/maps/page.tsx] -->|Lê locais sagrados e marca templos| WorldbuildingTypes
    MapsPage -->|Persiste vínculo de marcador com local| DexieSchema
    MapsPage -->|Navega hierarquia parentMapId| Domain
    WorldbuildingPage -->|Sugere vínculos por similaridade local| WorldbuildingTypes
    WorldbuildingPage -->|Detecta e funde duplicatas com remapeamento| DexieSchema
    WorldbuildingPage -->|Normaliza parentescos e navega fichas| WorldbuildingTypes
    WorldbuildingPage -->|Compõe brasões SVG e renderiza rede de facções| WorldbuildingTypes
    WorldbuildingPage -->|Persiste e desenha DAG de pré-requisitos| WorldbuildingTypes
    WorldbuildingPage -->|Gera perguntas de lacunas do lore| WorldbuildingTypes
    ManuscriptEditor[app/editor/EditorComponent.tsx] -->|Sugere menções em comentários| CollaborationDomain
    ResearchPage[app/research/page.tsx] -->|Lê e grava notas e capítulos do projeto| DexieSchema
    AnalysisPage[app/nlp/page.tsx] -->|Calcula métricas determinísticas do capítulo selecionado| DexieSchema
    AuditPage[app/audit/page.tsx] -->|Exporta dump completo e apresenta achados| ProjectAudit[services/project-audit.ts]
    ProjectAudit -->|Lê todas as tabelas e valida candidatos| DexieSchema
    CalendarPage[app/calendar/page.tsx] -->|Agenda eventos e lê capítulos vinculáveis| DexieSchema
    ChatPage[app/chat/page.tsx] -->|Lê e grava canais e mensagens locais| DexieSchema
    MapsPage[app/maps/page.tsx] -->|Lê locais e persiste mapas e marcadores| DexieSchema
    MindMapsPage[app/mindmaps/page.tsx] -->|Lê capítulos e persiste mapas e ramos| DexieSchema
    WorldRulesPage[app/gdd/page.tsx] -->|Lê capítulos e persiste regras narrativas| DexieSchema
    MeetingsPage[app/meetings/page.tsx] -->|Lê capítulos e persiste pautas e decisões| DexieSchema
    ResearchPage -->|Lê e grava notas e referências| DexieSchema
    ResearchPage -->|Agenda revisões SM-2| ResearchSpacedRepetition[domain/research/spaced-repetition.ts]
    ResearchPage -->|Mantém coautores e percentuais| DexieSchema
    APIDocs[app/api/docs/route.ts] -->|Documenta endpoints HTTP| AuthAPI
    Middleware[app/middleware.ts] -->|Reescreve namespace API v1| AuthAPI
    HealthAPI[app/api/health/route.ts] -->|Sonda disponibilidade| WebRuntime
    PluginRuntime[services/plugin-runtime.ts] -->|Executa módulos isolados| PluginTypes[domain/plugins/types.ts]
    TimelinePage[app/timeline/page.tsx] -->|Cria e organiza cronologias e eventos locais| DexieSchema
    TimelinePage -->|Ordena somente datas normalizadas e preserva ordem editorial| ManuscriptExtraction
    TimelinePage -->|Valida ordenação causal| TimelineEngine
    ManuscriptEditor -->|Padroniza Nomes| DexieSchema
```

## Resumo das Dependências Físicas
*   **`@eldritch/domain`**: Pacote core contendo as regras de negócio puras (sem dependência de banco de dados ou ambiente de execução).
*   **`@eldritch/web`**: Aplicação Next.js client-side. Depende de `@eldritch/domain`, `dexie` (IndexedDB) e `@huggingface/transformers` (para inteligência artificial local).
