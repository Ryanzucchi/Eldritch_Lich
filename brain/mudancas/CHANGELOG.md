# Registro de Sincronizações (CHANGELOG)

Este registro lista em ordem cronológica todas as atualizações de desenvolvimento integradas a esta base de conhecimento.

## [2026-07-21] (Refatoração Visual) - Design System do Dashboard, Sidebar Unificada, AppContext e Melhoria de Fluxo (UX/UI)

### Melhorias de UI/UX e Arquitetura Visual
*   **Sidebar Unificada de Dashboard (ClientLayout.tsx)**: Removida a barra superior (`Navbar.tsx`) que causava recargas e duplicação em cada página. Implementada uma barra lateral retrátil elegante à esquerda com visual dark space e glassmorphic translúcido, agregando o seletor de projetos dinâmico, navegação interna, dados do usuário ativo e atalho rápido de logout.
*   **Contexto Global da Aplicação (AppContext.tsx)**: Centralizado o gerenciamento da sessão do usuário e projetos ativos no React Context. Isso eliminou requisições duplicadas nas páginas, garantiu transições SPA fluidas e manteve o estado de inicialização da IA local entre telas.
*   **Integração do Modo Foco com o Dashboard**: Adicionada funcionalidade de ocultação dinâmica da Sidebar (`hideSidebar` no contexto) para preservar o foco total na escrita quando o usuário ativa o Modo Foco no editor.
*   **Remoção de Código Duplicado**: Limpeza de dezenas de linhas de estilo CSS inline e classes redundantes nas páginas de GMN, Kanban e Perfil, unificando a viewport no dashboard.

### Código Adicionado/Modificado
*   [AppContext.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/context/AppContext.tsx) (State provider do monorepo)
*   [ClientLayout.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/components/ClientLayout.tsx) (Novo layout de dashboard de alto padrão visual)
*   [layout.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/layout.tsx) (Envelopamento do app)
*   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/gmn/page.tsx) (Remoção de navbar e adaptação de layout)
*   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/kanban/page.tsx) (Remoção de navbar e adaptação de layout)
*   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/profile/page.tsx) (Remoção de navbar, adaptação de layout e atualização dinâmica de sessão)
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) (Integração de estados de IA global, ocultação de sidebar em modo foco e remoção de navbar)
*   [mapa.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/dependencias/mapa.md) (Diagrama arquitetural atualizado)

## [2026-07-21] - Autenticação, Perfis de Usuário, Múltiplos Workspaces/Projetos e Segurança (UC-129, UC-130, UC-131, UC-117, UC-118, UC-418, UC-420, UC-421, UC-422)

### Requisitos Não-Funcionais de Segurança (RNF)
*   **Isolamento Absoluto (UC-418)**: Bancos IndexedDB separados dinamicamente por ID de projeto ativo no frontend.
*   **Validação e Sanitização (UC-420)**: Sanitização ativa de entradas do usuário para prevenir injeções de scripts maliciosos (XSS) via `sanitizeInput` helper.
*   **Autenticação JWT Stateless (UC-421)**: Validação criptográfica de tokens HS256 em cookies HTTPOnly seguros para todas as requisições privadas sensíveis.
*   **Contramedidas de Força Bruta (UC-422)**: Limitação a no máximo 5 tentativas falhas consecutivas de login por IP/Conta em um intervalo de 5 minutos, bloqueando novas tentativas por exatamente 15 minutos (HTTP 429 Too Many Requests).

### Código Adicionado/Modificado
*   Adicionados os módulos de domínio de **Autenticação e Projetos**:
    *   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/auth/types.ts) (User, AuthSession, ResetToken)
    *   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/project/types.ts) (Project)
*   Criadas as páginas, componentes e serviços do Web App Next.js:
    *   [auth-backend.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/services/auth-backend.ts) (scrypt hash Sync, signToken/verifyToken JWT, persistência em arquivo JSON)
    *   [middleware.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/middleware.ts) (Proteção de rotas privadas /gmn, /kanban, /editor)
    *   [Navbar.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/components/Navbar.tsx) (Navbar global com gerenciamento e troca dinâmica de projetos)
    *   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/auth/register/route.ts) (Cadastro)
    *   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/auth/login/route.ts) (Login com cookie HTTPOnly)
    *   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/auth/logout/route.ts) (Logout)
    *   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/auth/session/route.ts) (Verificação de Sessão)
    *   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/auth/forgot-password/route.ts) (Geração de Token de Recuperação)
    *   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/auth/reset-password/route.ts) (Validação de Token e Reset)
    *   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/auth/profile/route.ts) (Dados do perfil)
    *   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/auth/update-profile/route.ts) (Atualização cadastral e tamanho de avatar)
    *   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/auth/change-password/route.ts) (Alteração de senha interna)
    *   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/projects/route.ts) (Listagem e criação de projetos)
    *   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/auth/page.tsx) (Tela de login, cadastro e forgot password integrada)
    *   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/auth/reset/page.tsx) (Tela de definição de nova senha)
    *   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/profile/page.tsx) (Tela Meu Perfil com uploader de avatar WebP e troca de senha)
*   Modificados arquivos para suporte multi-projeto isolado:
    *   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) (Dexie instanciado com base no ID do projeto ativo para isolamento)
    *   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/gmn/page.tsx) e [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/kanban/page.tsx) (Integrados com a Navbar global e limpos de lógica auth local)

### Documentação Vinculada
*   [INDEX.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/INDEX.md)
*   [autenticacao-workspace.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/autenticacao-workspace.md)
*   [mapa.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/dependencias/mapa.md)

## [2026-07-20] - Implementação Core do GMN, MMS e Metas de Escrita

### Código Adicionado/Modificado
*   Adicionados os módulos de domínio do **Grafo de Metas Narrativas (GMN)**:
    *   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/gmn/types.ts) (Metas e Arestas)
    *   [cycle-detector.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/gmn/cycle-detector.ts) (Algoritmo de Kahn)
    *   [propagator.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/gmn/propagator.ts) (BFS/Topological Status Propagator)
*   Adicionados os módulos de domínio do **Mapeamento Semântico de Progresso (MMS)**:
    *   [similarity.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/mms/similarity.ts) (Fórmula de Cosseno)
    *   [classifier.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/mms/classifier.ts) (Embeddings locais + Classificador Zero-shot)
*   Adicionados os módulos de domínio de **Metas de Escrita (Métricas)**:
    *   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/metrics/types.ts) (Metas, Logs e Streaks)
    *   [streak-calculator.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/metrics/streak-calculator.ts) (Cálculo de Streak e Quota diária)
*   Criadas as páginas e serviços do Web App Next.js:
    *   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) (Banco Dexie + Transações + Produtividade V2 + Atalhos V3 + Capítulos V4)
    *   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/gmn/page.tsx) (Visualizador de Grafos interativo SVG)
    *   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/kanban/page.tsx) (Quadro Kanban com Drag & Drop e suporte WCAG)
    *   [mms-ai.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/services/mms-ai.ts) (Integração com @huggingface/transformers para modelo `multilingual-e5-small` e NER)
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) (TipTap Editor com explorer de capítulos, seletor de status rascunho/revisão/finalizado, bloqueio de escrita, streaks e atalhos customizados)
*   Atualizado o cronograma de progresso:
    *   [ROADMAP.md](file:///home/zucchi/Projetos/Eldritch_Lich/ROADMAP.md) (Casos de uso marcados como concluídos)

### Documentação Vinculada
*   [INDEX.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/INDEX.md)
*   [gmn.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/gmn.md)
*   [mms.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/mms.md)
*   [mapa.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/dependencias/mapa.md)
