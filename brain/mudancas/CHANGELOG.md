# Registro de Sincronizações (CHANGELOG)

Este registro lista em ordem cronológica todas as atualizações de desenvolvimento integradas a esta base de conhecimento.

## [2026-07-21] (Correção de Carregamento de Documento por ID & Elementos de Botão Nativo) - Abertura Direta de Templates e Manuscritos (UC-084, UC-085, UC-127)

### 🎯 Leitura de Parâmetro `chapterId` no Editor
*   **Carregamento Direto por ID:** O `EditorComponent.tsx` agora inspeciona o parâmetro de busca `searchParams.get('chapterId')` na URL para carregar e ativar instantaneamente o manuscrito recém-criado ou selecionado na Tela Inicial.
*   **Eliminação da Abertura de Documento Errado:** Sanado o problema onde o editor sempre forçava a abertura do primeiro elemento (`activeList[0]`), ignorando o modelo escolhido.

### 🖱️ Elementos Nativos de Botão nos Templates
*   **Conversão para `<button type="button">`:** Todos os cartões da Galeria de Templates (*Documento em Branco, Jornada do Herói, Ficha de Personagem, Worldbuilding, 3 Atos*) foram convertidos em elementos de botão nativos, garantindo 100% de propagação de clique e foco em todos os navegadores.

### Novos Casos de Uso Concluídos
*   **Arquivar Textos (`UC-127`):** Botão `📦 Arquivar` nas ações do capítulo e painel retrátil "📦 Arquivados" no Explorer para consultar e desarquivar manuscritos a qualquer momento.
*   **Personalizar Densidade da Interface (`UC-084`):** Seletor no painel de configurações para alternar entre as densidades *Compacta*, *Padrão* e *Confortável*, ajustando padding e espaçamento global.
*   **Personalizar Cores do Editor (`UC-085`):** Seletor de cores de destaque (*Roxo Eldritch*, *Azul Mágico*, *Esmeralda*, *Âmbar*, *Rosa/Rubro*) com propagação instantânea de variáveis CSS.

### Código Adicionado/Modificado
*   [types.ts](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/packages/domain/src/editor/types.ts) (Atualização da interface `Manuscript` com `isArchived`, `tags` e `category`)
*   [schema.ts](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/apps/web/src/db/schema.ts) (Atualização do esquema Dexie IndexedDB para a versão 9)
*   [EditorComponent.tsx](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/apps/web/src/app/editor/EditorComponent.tsx) (Quebra de texto do painel direito, densidade de UI, temas de cores de destaque e painel de textos arquivados)

## [2026-07-21] (Correção do Painel Lateral & Recursos Avançados) - Correção do Layout Flexbox (Zero Corte), Fixar Capítulos (Pins), Categorização Automática, Audit Log do Sistema e Quadro de Desenho Inline (UC-010, UC-011, UC-012, UC-040, UC-042, UC-061, UC-062, UC-128)

### Correção de Layout & Ergonomia
*   **Correção Definitiva do Corte no Painel Esquerdo:** Adição de `min-width: 0 !important` no `.editor-workspace` e `flex-shrink: 0 !important` no `.editor-side-panel`, impedindo o estouro de largura e garantindo exibição 100% perfeita do explorer e estatísticas à esquerda.

### Novos Casos de Uso Concluídos
*   **Fixar Capítulos no Topo do Explorer (`UC-128`):** Botão `📌` nas ações do capítulo para fixar manuscritos preferidos no grupo destacado "📌 Fixados no Topo".
*   **Quadro de Desenho & Rascunho Visual Inline (`UC-062`):** Ferramenta com canvas HTML5 2D interativo e paleta de cores para desenhar mapas, diagramas ou rascunhos à mão livre e inseri-los diretamente no documento.
*   **Log de Atividades Automáticas do Sistema (`UC-061`):** Modal acessível no menu *Exibir* que registra o histórico em tempo real de auto-salvamentos, backups, auto-títulos e sincronizações do sistema.
*   **Categorização Automática de Textos (`UC-042`):** Algoritmo semântico que lê a frequência de diálogos e palavras-chave para classificar automaticamente o capítulo (*Cena de Diálogo*, *Ação & Tensão*, *Romance*, *Mistério & Suspense*).
*   **Organização Completa em Pastas & Subpastas (`UC-010`, `UC-011`, `UC-012`, `UC-040`):** Suporte completo a criação de estruturas de pastas, movimentação por drag & drop e renomeação.

### Código Adicionado/Modificado
*   [categories.ts](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/packages/domain/src/editor/categories.ts) (Classificador automático de categorias e métricas de diálogo)
*   [audit.ts](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/packages/domain/src/editor/audit.ts) (Gerenciador de logs de auditoria de sistema)
*   [schema.ts](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/apps/web/src/db/schema.ts) (Tabela `auditLogs` adicionada ao Dexie IndexedDB v8)
*   [EditorComponent.tsx](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/apps/web/src/app/editor/EditorComponent.tsx) (Correção do App Shell Flexbox, grupo de fixados no topo, modais de desenho 2D e histórico de atividades)

## [2026-07-21] (Google Docs Fidelidade 1:1 & Ferramentas Avançadas) - Comentários na Margem, Divisão de Capítulos, Duplicação, Auto-Título com IA, Templates e Tema Claro/Escuro (UC-006, UC-009, UC-041, UC-114, UC-137, UC-138, UC-159)

### Recursos 1:1 do Google Docs & Estrutura Literária
*   **Coluna de Comentários na Margem Direita (UC-114):** Permite selecionar qualquer trecho do texto e fixar comentários flutuantes na margem direita com avatar do autor, timestamp, trecho citado e botão para resolver o comentário (`✓ Resolver`).
*   **Régua Superior Graduada estilo Google Docs (`.google-docs-ruler`):** Régua visual com marcações de recuo e margens.
*   **Alternância de Temas Claro/Escuro estilo Google Docs (UC-159):** Troca fluida entre o tema padrão escuro do Eldritch Lich e o tema original branco/claro do Google Docs (`#ffffff` sheet sobre `#f8f9fa` workspace).
*   **Divisão Inteligente de Capítulo no Cursor (UC-009):** Permite cortar um capítulo extenso no meio ou no parágrafo ativo, criando um novo capítulo `[Título] - Parte 2` automaticamente.
*   **Duplicação Instantânea de Manuscrito (UC-006):** Criação de cópia exata do capítulo selecionado (`[Título] (Cópia)`) preservando todo o conteúdo e formato.
*   **Geração Automática de Título com IA (UC-041):** Leitura do primeiro parágrafo do manuscrito para sugerir e aplicar um título conciso automaticamente.
*   **Galeria de Modelos/Templates de Capítulos (UC-137, UC-138):** Modal com estruturas narrativas pré-definidas (*Jornada do Herói*, *Ficha de Personagem*, *Worldbuilding de Local*, *Estrutura de 3 Atos*).

### Código Adicionado/Modificado
*   [templates.ts](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/packages/domain/src/editor/templates.ts) (Módulo de templates narrativos e gerador de auto-título)
*   [comments.ts](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/packages/domain/src/editor/comments.ts) (Módulo de comentários inline com respostas e resolução)
*   [schema.ts](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/apps/web/src/db/schema.ts) (Tabela `comments` adicionada ao Dexie IndexedDB v7)
*   [EditorComponent.tsx](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/apps/web/src/app/editor/EditorComponent.tsx) (Coluna de comentários flutuante na margem, régua do Google Docs, alternador de tema claro/escuro, modais de comentário e templates)

## [2026-07-21] (Design System & Editor Literário) - Interface Estilo Google Docs / MS Word, Ribbon de Formatação, Métricas de Leitura, Hyperlinks e Notas (UC-028, UC-029, UC-063, UC-110, UC-111, UC-115, UC-186, UC-187, UC-243, UC-244, UC-393)

### Interface Estilo Google Docs / MS Word
*   **Barra Superior de Menus Estilo Processador de Texto:** Menus dropdown retráteis (*Arquivo*, *Editar*, *Exibir*, *Inserir*, *Formatar*) com atalhos rápidos para ações do sistema.
*   **Ribbon Bar de Formatação:** Barra de ferramentas com seletores de fonte (Georgia, Inter, Times, Courier, Arial - UC-063, UC-244), ajuste de tamanho de fonte em pontos (UC-243), botões de estilo (Negrito, Itálico, Tachado, Código), alinhamento (Esquerda, Centro, Direita, Justificado), espaçamento entre linhas (1.2, 1.5, 1.8, 2.0) e listas.
*   **Visualização em Papel Virtual A4:** Canvas central estilizado como uma folha de papel física com sombras realistas, margens configuráveis e tipografia fluida para máxima ergonomia cognitiva.
*   **Barra de Status do Documento:** Exibição dinâmica de contagem de palavras (UC-028), contagem de caracteres (UC-029), tempo estimado de leitura (UC-186), progresso de meta diária e selo do modo de exibição.

### Inserção de Elementos Rica & Modos de Leitura
*   **Modo Leitura Apenas (UC-187):** Alternância rápida para modo somente leitura sem barras de edição, bloqueando mutações acidentais.
*   **Modal de Hyperlinks (UC-110, UC-111):** Inserção de links para navegação web e referências internas no manuscrito.
*   **Modal de Notas de Rodapé e Anotações (UC-115, UC-393):** Inserção de anotações explicativas no texto com pré-visualização em tooltip.

### Código Adicionado/Modificado
*   [EditorComponent.tsx](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/apps/web/src/app/editor/EditorComponent.tsx) (Redesign da interface no padrão Google Docs/Word, barra ribbon de ferramentas, folha de papel A4, barra de status, modais de hyperlink/nota e estilos CSS)

## [2026-07-21] (Core Editor, Versões e Interoperabilidade) - Busca & Substituição no Editor, Diff de Versões e Importação/Exportação Multiformato (UC-007, UC-008, UC-022, UC-023, UC-024, UC-124, UC-125, UC-163, UC-194, UC-195, UC-196, UC-197)

### Busca & Substituição no Editor (UC-022, UC-023, UC-024)
*   **Módulo de Busca & Substituição:** Painel flutuante no editor acionado por botão na barra do documento ou atalho de teclado (`Ctrl+F`).
*   **Filtros de Busca Avançados:** Suporte para busca exata de palavras (UC-022), frases completas (UC-023) e padrões de contexto/regex (UC-024), com opções de diferenciar maiúsculas/minúsculas e palavra inteira.
*   **Navegação e Substituição:** Contador de correspondências ativas (ex: `1/8`), botões de navegação Próximo/Anterior e ações de *Substituir* (ocorrência selecionada) e *Substituir Tudo* instantâneo.

### Versionamento Avançado e Visualizador de Diff (UC-124, UC-125, UC-195, UC-196, UC-197)
*   **Snapshots com Rótulos Customizados (UC-124):** Além dos pontos de restauração automáticos, o escritor pode criar versões rotuladas manualmente (ex: "Draft Final", "Revisão dos Diálogos").
*   **Comparador Visual de Diff (UC-196):** Modal interativo de comparação entre a versão atual e qualquer snapshot anterior. Exibe contagem de palavras adicionadas/removidas/inalteradas com marcação visual colorida (adições em verde e remoções tachadas em vermelho).
*   **Restauração Segura (UC-125, UC-197):** Restauração de qualquer versão anterior preservando um backup automático do estado presente antes de sobrescrever o manuscrito.

### Importação e Exportação Multiformato (UC-007, UC-008, UC-163, UC-194)
*   **Exportação Multiformato (UC-008, UC-163):** Pipeline de compilação e download direto para **Word (.docx)**, **PDF para impressão (.pdf)**, **E-book ePub (.epub)**, **Markdown (.md)**, **Texto Puro (.txt)** e **HTML (.html)**. Suporta exportar apenas o capítulo ativo ou compilar o livro inteiro em um único documento.
*   **Importação de Manuscritos (UC-007, UC-194):** Upload e conversão automática de arquivos `.txt`, `.md`, `.docx`, `.html` e `.json`. O autor pode importar como um novo capítulo ou substituir o conteúdo do capítulo ativo.

### Código Adicionado/Modificado
*   [diff.ts](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/packages/domain/src/editor/diff.ts) (Algoritmo de cálculo de diff de palavras entre versões)
*   [search.ts](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/packages/domain/src/editor/search.ts) (Motor de busca e substituição por palavra, frase e regex)
*   [exporter.ts](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/packages/domain/src/editor/exporter.ts) (Conversores e compiladores para DOCX, PDF, ePub, Markdown, TXT, HTML)
*   [index.ts](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/packages/domain/src/index.ts) (Exportação dos módulos no pacote de domínio)
*   [EditorComponent.tsx](file:///C:/Users/RyanZ/Documents/antigravity/projeto_uni/apps/web/src/app/editor/EditorComponent.tsx) (Painéis e modais de Busca/Substituição, Visualizador de Diff, Importação/Exportação e estilos CSS)

## [2026-07-21] (Escrita e Organização) - Sistema de Pastas Hierárquicas, Drag-and-Drop e Lixeira com Purga de 30 Dias (UC-010, UC-011, UC-012, UC-157)

### Organização de Arquivos e Pastas
*   **Pastas e Subpastas Hierárquicas (UC-010, UC-011):** Implementada a modelagem e interface para criação de pastas e subpastas ilimitadas. O explorador de capítulos foi refatorado para renderizar uma estrutura em árvore recursiva.
*   **Drag-and-Drop Nativo (UC-012):** Integrado suporte a arrastar-e-soltar baseado na API HTML5. Os usuários podem mover manuscritos para dentro de pastas ou reorganizar subpastas arrastando os componentes. 
*   **Expansão Inteligente no Drag:** Se o usuário passar o cursor com um item arrastado por mais de 1,5 segundos sobre uma pasta fechada, ela se expande automaticamente para revelar seu conteúdo.
*   **Prevenção de Loops Hierárquicos:** Implementada validação a nível de cliente e servidor (API) que detecta e impede movimentações circulares inválidas (como tentar mover uma pasta para dentro de si mesma ou de suas filhas).

### Lixeira Lógica e Purga Temporal (UC-157)
*   **Exclusão Lógica:** O fluxo de deleção de capítulos agora move os manuscritos para um estado de Lixeira lógica (`inTrash: true` e `deletedAt`).
*   **Gerenciamento da Lixeira:** Adicionado painel retrátil de Lixeira na Sidebar do editor. Os usuários visualizam os itens deletados, a data de deleção, o tempo restante antes da exclusão física definitiva e possuem botões rápidos para *Restaurar* (que devolve o capítulo à pasta original sem perder metadados) ou *Excluir permanentemente*.
*   **Esvaziar Lixeira:** Adicionado botão para limpar todos os itens da lixeira fisicamente de uma vez só.
*   **Purga Automática de 30 Dias:** Integrada rotina em background no mount do editor que varre e elimina fisicamente do banco de dados (local e servidor) qualquer arquivo que esteja na lixeira há mais de 30 dias.

### Código Adicionado/Modificado
*   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/editor/types.ts) (Inclusão da interface Folder e do campo folderId em Manuscript)
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts) (Incremento do schema do Dexie para a versão 6, adicionando a tabela folders e indexando folderId)
*   [auth-backend.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/services/auth-backend.ts) (Leitura/gravação de folders.json)
*   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/folders/route.ts) (Endpoints GET e POST para criar e listar pastas com detecção de ciclos)
*   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/folders/id/route.ts) (Endpoint de deleção física de pasta)
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) (Estado local de folders, renderização recursiva da árvore, handlers de drag-and-drop, painel visual de Lixeira com dias restantes, limpeza de 30 dias e estilos CSS)

## [2026-07-21] (Colaboração e Segurança) - Compartilhamento de Projetos e Isolamento Multi-Tenant (UC-081, UC-418, UC-421, UC-083)

### Compartilhamento e Controle de Acesso de Projetos
*   **Convite e Permissões (UC-081):** Desenvolvido o motor de compartilhamento de projetos no monorepo. O proprietário do projeto pode abrir o modal de Gerenciamento de Colaboradores, inserir o e-mail de um colaborador cadastrado e atribuir uma permissão de acesso inicial: `LEITOR`, `EDITOR` ou `ADMINISTRADOR`.
*   **Expiração de Convite (RNF):** Definida a validade temporal de 7 dias para convites pendentes. Convites expirados são automaticamente invalidados e limpos pela API.
*   **Aceite/Recusa de Convites:** Os colaboradores recebem convites em tempo real no dashboard (painel de "Convites de Equipe") e podem aceitar ou recusar com botões rápidos. Ao aceitar, o projeto é integrado à Sidebar do usuário instantaneamente.
*   **Isolamento Multi-Tenant Robusto (UC-418):** Atualizadas as APIs de manuscritos (`/api/manuscripts` e `/api/manuscripts/[id]`) para impedir que qualquer usuário sem permissão acesse ou exclua dados de projetos alheios.
*   **Validação de Nível de Escrita:** Colaboradores atribuídos com nível de permissão `LEITOR` (read-only) são bloqueados no backend de criar, editar ou excluir manuscritos (retornando HTTP 403 Forbidden).

### Código Adicionado/Modificado
*   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/project/types.ts) (Inclusão da interface ProjectCollaborator)
*   [auth-backend.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/services/auth-backend.ts) (Persistência local de colaboradores no banco simulado JSON)
*   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/projects/route.ts) (Listagem de projetos compartilhados aceitos e injeção de convites pendentes)
*   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/projects/share/route.ts) (Criação de convites de projeto e listagem de colaboradores ativos)
*   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/projects/share/accept/route.ts) (Endpoint de aceite de convite de projeto)
*   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/projects/share/reject/route.ts) (Endpoint de recusa de convite)
*   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/projects/share/remove/route.ts) (Endpoint de remoção de colaborador pelo proprietário)
*   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/manuscripts/route.ts) (Controle de privilégios de colaborador)
*   [route.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/manuscripts/[id]/route.ts) (Controle de deleção para read-only)
*   [ClientLayout.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/components/ClientLayout.tsx) (Modal de gerenciamento de colaboradores, card de aceitar/rejeitar convites na Sidebar e estilos CSS)
*   [AppContext.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/context/AppContext.tsx) (Propagação global de convites pendentes)

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
