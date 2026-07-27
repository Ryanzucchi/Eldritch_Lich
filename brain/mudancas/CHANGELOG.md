# Registro de Sincronizações (CHANGELOG)

Este registro lista em ordem cronológica todas as atualizações de desenvolvimento integradas a esta base de conhecimento.

## [2026-07-27] (Gestão de OKRs, Metas Estratégicas e Integração de Performance) - UC-346, UC-347, UC-348, UC-349, UC-350, UC-351, UC-333, UC-335, UC-337, UC-339, UC-317, UC-321, UC-325, UC-326, UC-327, UC-313, UC-316, UC-304, UC-310, UC-312, UC-305, UC-306, UC-301, UC-302, UC-303, UC-376, UC-377, UC-378, UC-379, UC-380, UC-360, UC-361, UC-362, UC-363, UC-364, UC-365, UC-367, UC-368, UC-369, UC-370, UC-340, UC-341, UC-342, UC-343, UC-344, UC-345, UC-219, UC-220, UC-221, UC-229, UC-230, UC-217, UC-218, UC-214, UC-215, UC-216, UC-206, UC-207, UC-208, UC-209, UC-210, UC-082, UC-083, UC-135, UC-136, UC-403, UC-404, UC-405, UC-406, UC-395, UC-396, UC-397, UC-398, UC-270, UC-271, UC-272, UC-274, UC-267, UC-268, UC-102, UC-103, UC-104, UC-099, UC-100, UC-101, UC-168, UC-055, UC-056, UC-058, UC-076, UC-079, UC-167, UC-169, UC-170, UC-171, UC-264, UC-393, UC-394, UC-412, UC-065, UC-067, UC-068 & UC-069

### 🎯 Gestão de OKRs Estratégicas & Integração de Desempenho (UC-346, UC-347, UC-348, UC-349, UC-350, UC-351)
*   **Definição de OKRs (UC-346):** Painel `/okrs` para criação de objetivos e Key Results (KRs) mensuráveis por time ou individual.
*   **Vinculação de Iniciativas (UC-347):** Acoplamento de tarefas/sprints a KRs para atualização proporcional de progresso.
*   **Acompanhamento Temporal & Check-ins (UC-348, UC-350):** Linha do tempo de check-ins semanais históricos com alertas preventivos de regressão de progresso e exibição gráfica de tendências de atingimento.
*   **Relatório de Atingimento (UC-349):** Consolidado histórico do atingimento de metas com nota final ponderada de 0.0 a 10.0 via `generateOkrPerformanceReport`.
*   **Integração de Performance de RH (UC-351):** Cálculo integrado ponderando competências qualitativas de RH e cumprimento quantitativo de KRs com `calculateIntegratedPerformanceScore`. Tabelas `objectiveOkrs`, `okrCheckInLogs` e `okrTaskLinks` no Dexie (Versão 32).

### 🎮 Game Design Document (GDD), Regras, Níveis, Economia, Balanceamento e Simulador (UC-333, UC-334, UC-335, UC-336, UC-337, UC-339)
*   **Mecânicas & Regras (UC-333, UC-334):** Interface `/gdd` para catalogação de mecânicas e equações lógicas/matemáticas de regras, com validador de sintaxe `validateRuleFormula`.
*   **Versionamento de Regras (UC-337-regras):** Rastreamento de histórico e controle de versão incremental em equações de jogo modificadas.
*   **Design de Níveis (UC-336):** Ficha técnica estruturada de level design integrando lista de inimigos, itens e layout gráfico das fases.
*   **Economia Interna & Lojas (UC-339):** Módulo de precificação (compra/venda) de itens em lojas com alerta de segurança para prevenção de exploits de ouro infinito (venda > compra). Relatório consolidado com médias econômicas gerais via `calculateEconomyStats`.
*   **Balanceamento de Atributos (UC-335):** Curva de progressão de atributos calculada do nível 1 ao 50 com `calculateCharacterStatsAtLevel`.
*   **Simulador Monte Carlo (UC-337-simulador):** Simulação estatística de 100 rodadas de combate automatizado para análise de probabilidade de vitória. Tabelas `gameRules`, `gameLevels` e `gameShops` adicionadas no Dexie (Versão 31).

### ⏳ Linhas do Tempo, Vínculo com Lore e Exportação (UC-055, UC-056, UC-058, UC-076, UC-079, UC-167, UC-169, UC-170, UC-171, UC-264)
*   **Exportação Multiformato e HTML Interativo (UC-171, UC-264):** Módulo `exportTimeline` em `@eldritch/domain` (.html, .md, .json).
*   **Vínculo com Locais e Personagens (UC-167):** Atributos `locationId` e `characterIds` em `TimelineEvent`.
*   **Filtros de Busca por Personagem e Local (UC-169, UC-170):** Filtro instantâneo em `/timeline` (< 100ms).

### 🖼️ Colar Imagens Diretamente no Texto (UC-065)
*   **Clipboard API & Inserção Inline:** Configurada a propriedade `handlePaste` no ProseMirror/TipTap do [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) para interceptar o evento `Ctrl+V` / `Cmd+V`.
*   **Conversão DataURL/Base64 & Validação:** Imagens copiadas para a área de transferência (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`) são convertidas de forma transparente sem congelar a tela.
*   **Controle de Exceção:** Imagens superiores a 8MB são barradas com mensagem de aviso dedicada.

### 📝 Notas de Rodapé Renumeradas (UC-393)
*   **Processamento & Renumeração Automática:** Implementada função `processFootnotes` em `@eldritch/domain` para extrair, ordenar e renumerar automaticamente sobrescritos de notas de rodapé no formato `[1]`, `[2]`, preservando atribuição de conteúdo sem órfãos.
*   **Integração no Editor Rico:** Modal de inclusão de notas atualizada para gravar o atributo `data-footnote-text`, permitindo renderização limpa e renumeração em tempo real.

### 📌 Referências Cruzadas entre Capítulos (UC-394)
*   **Links Dinâmicos Inter-Capítulos:** Implementada função `validateCrossReferences` em `@eldritch/domain` para detectar links cruzados e sinalizar visualmente referências quebradas (`is-broken`) caso capítulos de destino sejam deletados.
*   **Modal de Inserção de Referência Cruzada:** Adicionada modal no editor que permite ao autor selecionar um capítulo do projeto ativo e definir o rótulo de exibição (ex: `ver Capítulo 3`).
*   **Interface:** Botão dedicado `📌` adicionado tanto à Barra de Menus ("Inserir > Referência Cruzada") quanto à Ribbon de ferramentas.

### 🎵 Playlist Automática por Humor do Capítulo (UC-412)
*   **Análise de Humor por IA:** Implementada função `generateChapterPlaylist` em `@eldritch/domain` para analisar a atmosfera emocional predominante de cada cena (tensão, mistério, melancolia, épico, tranquilo) e compilar uma sequência de faixas em tempo recorde (< 4s).
*   **Reprodutor de Áudio com Crossfade:** Criada modal de reprodução de áudio integrada com controles de faixa anterior/próxima, reproduzir/pausar, indicação de humor detectado e transições suaves de crossfade de 2 segundos.
*   **Acesso Rápido:** Botão `🎵` adicionado à barra de ferramentas do editor ("Ferramentas > Gerar Playlist por IA") e à Ribbon.

### Código Adicionado/Modificado
*   [footnotes.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/editor/footnotes.ts) (Módulo de parsing e validação de notas e referências)
*   [playlist.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/editor/playlist.ts) (Motor de classificação de humor e geração de playlists por capítulo)
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) (Paste handler para imagens, Modais, Handlers, Audio Player e botões de interface para UC-393, UC-394, UC-412 e UC-065)
*   [ROADMAP.md](file:///home/zucchi/Projetos/Eldritch_Lich/ROADMAP.md) (Casos UC-393, UC-394, UC-412 e UC-065 atualizados para concluído)

## [2026-07-22] (Correção de Navegação e Autenticação) - Correção de Fluxo e Interface do Usuário

### 🎯 Correção do Fluxo de Navegação & Tela de Entrada
*   **Ajuste de Redirecionamento Inicial:** Corrigido o `middleware.ts` para redirecionar usuários logados em `/auth` para a Home (`/`) em vez da tela de grafo (`/gmn`).
*   **Redirect Seguro pós-Login:** Ajustada a tela `/auth/page.tsx` para redirecionar para `/` após autenticação bem-sucedida em vez de `/dashboard`.
*   **Eliminação de Rotas Duplicadas:** Normalizados os links para usar a rota raiz (`/`) como a Home (seletor de projetos) e adicionada a rota `/dashboard` nas exclusões de renderização de barra lateral para evitar conflito de layout flexbox.

### 🛡️ Lógica de Autenticação e Segurança
*   **Remoção de Sessão Fallback Incorreta:** Removido o login automático do usuário local fictício (`local_writer_id`) em `AppContext.tsx` quando a chamada de API de sessão falhava ou retornava `authenticated: false`, forçando o redirecionamento correto à tela de login.
*   **Limpeza de localStorage no Logout:** O identificador `activeProjectId` agora é excluído do `localStorage` no logout para evitar vazamento de estado de projeto entre sessões de usuários diferentes.
*   **Guarda Client-Side de Sessão:** Injetada lógica em `ClientLayout.tsx` para redirecionar usuários para `/auth` caso a sessão carregue e não haja usuário ativo.

### 🧱 Correção de Interface Bloqueada no Editor
*   **Integração do Editor ao DashboardLayout:** Removido `/editor` do bloqueio de renderização do `ClientLayout`, restaurando a Sidebar e a Barra de Ferramentas superior no Editor de Manuscritos para viabilizar a navegação entre as demais áreas do projeto.
*   **Guarda de Projeto no Editor:** Adicionado `/editor` à verificação de existência de projeto ativo no `ClientLayout`, redirecionando o escritor para a Home (`/`) para criar ou selecionar um projeto caso tente acessar o editor sem contexto.

### Código Adicionado/Modificado
*   [middleware.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/middleware.ts) (Nova regra de rotas protegidas globais e destino de redirect de login)
*   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/auth/page.tsx) (Destino correto do push de login)
*   [AppContext.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/context/AppContext.tsx) (Tratamento correto de erro de autenticação e remoção de dados locais)
*   [ClientLayout.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/components/ClientLayout.tsx) (Ajuste nas exclusões de layout, guarda client-side de sessão e projeto ativo)
*   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx) (Atualização do link do ícone Home)

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

## [2026-07-22] - Correção de Consistência Visual, Isolamento de Capítulos e Novo Fluxo de Projetos

### Código Adicionado/Modificado
*   **Redesenho da Central de Projetos e Simplificação da Navegação (Novo Fluxo)**:
    *   [GoogleDocsHomeComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/projects/GoogleDocsHomeComponent.tsx): Redesenhada completamente a tela inicial pós-login para atuar como Central de Projetos (Acessar/Criar Projetos / Meu Perfil). Exibe uma coluna lateral com card de dados do perfil do usuário logado (avatar, nome, email, bio e link de edição) e uma coluna principal com o projeto ativo em destaque, a grade com todos os projetos do usuário (incluindo compartilhados) para seleção direta (redirecionando para o `/editor`), e o formulário de criação de novo projeto.
    *   [ClientLayout.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/components/ClientLayout.tsx):
        *   Removidas as abas duplicadas de navegação (`global-nav-tabs`) e a marca secundária da barra de cabeçalho superior (`global-workspace-topbar`), substituindo-as por um indicador limpo do título da página ativa (ex: "🖋️ Manuscrito Principal", "📊 Quadro Kanban"), o que eliminou a confusão de dupla barra de navegação.
        *   Adicionado o link de navegação "Voltar a Projetos" no topo do menu lateral para fácil retorno ao Portal Geral.
        *   Modificado o link "Editor Rica" no menu para "Manuscrito" e removido o item redundante "Meu Perfil" do menu principal da sidebar.
        *   Transformado o badge de perfil do usuário logado no rodapé da sidebar em um link clicável (`user-profile-badge-link`) que aponta diretamente para `/profile`.
        *   Ajustado o tooltip do logotipo da marca no topo da sidebar para "Voltar para a Central de Projetos".
        *   Modificado o título do menu suspenso de projetos da sidebar de "Seus Manuscritos" para "Trocar de Projeto".
*   **Correção de Layout e Largura/Altura dos Painéis do Editor**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx):
        *   Corrigida a largura absoluta de `100vw` para `100%` (e `max-width: 100%`) no seletor `.main-content`. Isso impediu que o editor se estendesse além da tela e resolvesse o problema do painel lateral direito de MMS/versões ser empurrado para fora e cortado à direita pelo tamanho correspondente da barra de navegação esquerda.
        *   Corrigida a altura absoluta de `100vh` para `100%` nos seletores `.main-content`, `.editor-workspace` e `.editor-side-panel`. Isso resolveu o corte vertical inferior (inclusive da barra de status) causado pela sobreposição da barra superior de cabeçalho de 48px.
        *   Ajustada a visualização responsiva do painel de logs MMS sob telas menores (`@media (max-width: 1536px)`) para iniciar abaixo da barra superior (`top: 48px` e `height: calc(100vh - 48px)`).
        *   Adicionados botões flutuantes e responsivos nas laterais da tela (`floating-sidebar-toggle`) que surgem como abas discretas na vertical quando as respectivas barras laterais de Explorer (esquerda) ou de IA/Versões (direita) são fechadas pelo usuário. Isso possibilita reabrir qualquer um dos painéis com apenas um clique a partir das bordas da tela.
*   **Design Premium das Metas Narrativas do GMN**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx): Injetado estilo CSS moderno e refinado para o componente vertical de metas (`.goals-vertical-list` e `.goal-item-card`). As metas agora são renderizadas como cards de estilo glassmorphism, com bordas laterais coloridas dinâmicas indicando o status (verde para concluído, amarelo para pendente, vermelho para inconsistente), escala tipográfica nítida, espaçamento interno proporcional e suporte visual completo a temas escuros e claros.
*   **Melhoria de Consistência Visual (Tema Claro do Editor)**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx): Adicionada a classe `theme-${docsTheme}` ao container raiz `.main-content` no render do editor, e injetados estilos CSS globais completos sob o seletor `.main-content.theme-light` no bloco `<style jsx global>` para atualizar variáveis de cores de forma homogênea.
*   **Correção de Isolamento de Capítulos e Redirecionamentos**:
    *   [AppContext.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/context/AppContext.tsx):
        *   Atualizada a função `selectProject` para redirecionar explicitamente para o editor (`/editor`) quando executada a partir da página inicial (`/` ou `/projects`), em vez de recarregar a própria página inicial.
        *   Ajustada a função `createProject` para redirecionar diretamente para o editor (`/editor`) em vez de recarregar a home page ao criar um projeto com sucesso.
        *   Ajustado o carregador de sessão `refreshSession` para forçar `window.location.reload()` quando o ID de projeto resolvido for alterado em relação ao persistido no `localStorage`, garantindo a correta inicialização do namespace local do banco IndexedDB.
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx):
        *   Corrigida a criação de novos capítulos no manipulador `handleAddChapter` e no seed padrão em `loadManuscripts` para incluir explicitamente o campo `projectId` do projeto ativo nos registros locais do IndexedDB.

### Documentação Vinculada
*   [INDEX.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/INDEX.md)
*   [autenticacao-workspace.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/autenticacao-workspace.md)

## [2026-07-22] - Foco em Personagens GMN, Lembretes Causa-Temporais, Favoritos e Ícones Personalizados

### Código Adicionado/Modificado
*   **Filtragem de Foco do Grafo Narrativo (UC-098)**:
    *   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/gmn/page.tsx): Adicionados controles de busca rápida de personagem e seleção de graus de separação (1º, 2º ou 3º grau via busca BFS) na barra de ferramentas superior. A seleção esmaece nós e conexões não correspondentes para 10% de opacidade e desativa cliques nos mesmos. Adicionado manipulador de clique com o botão direito para ocultar nós de forma seletiva do grafo.
*   **Sistema de Lembretes & Alertas Causa-Temporais (UC-116)**:
    *   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts): Criado esquema de migração da versão 10 do IndexedDB, adicionando a tabela `reminders` para persistência offline de notas e gatilhos de tempo de alertas.
    *   [ClientLayout.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/components/ClientLayout.tsx): Integrado um botão de sino 🔔 reativo no cabeçalho geral com badge dinâmico de contagem. Implementada a gaveta lateral de notificações e formulário para cadastro e associação de lembrete com capítulo. Implementado loop temporizador de segundo plano (5s) que dispara popup central com snoozing (adiamento de 5m) e linkagem de documento.
*   **Favoritar Capítulos do Manuscrito (UC-126)**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx): Inserido o botão interativo de Estrela (★) no cabeçalho do documento ativo e na listagem do explorer lateral. Favoritar um capítulo o insere dinamicamente em uma seção de atalho rápido "⭐ Favoritos" no topo da sidebar.
*   **Personalização de Ícones da Árvore de Diretórios (UC-086)**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx): Adicionado catálogo contendo 110 ícones categorizados e buscáveis por palavras-chave. Integrado upload de ícones SVG customizados com verificação regex que rejeita injeções maliciosas de scripts (XSS).

### Documentação Vinculada
*   [INDEX.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/INDEX.md)
*   [gmn.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/gmn.md)
*   [workflows-manuscritos.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/workflows-manuscritos.md)
*   [reminders.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/reminders.md)
*   [mapa.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/dependencias/mapa.md)

## [2026-07-23] - Portal Wiki do Universo, Compilação de HTML SPA e Padronização de Nomes

### Código Adicionado/Modificado
*   **Portal Wiki do Universo & Exportações (UC-090, UC-091)**:
    *   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts): Criada tabela `wikiEntities` no IndexedDB local sob a versão de schema 11.
    *   [page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/wiki/page.tsx): Nova rota `/wiki` que disponibiliza a Central de Worldbuilding. Oferece visualização, adição, edição e exclusão de artigos de lore. Conta com cross-linking automático (geração dinâmica de links de navegação para outras entidades), gerador e download do Portal Web Wiki (index.html estático SPA e auto-suficiente) e gerador do Manual do Universo em Markdown categorizado alfabeticamente.
    *   [ClientLayout.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/components/ClientLayout.tsx): Vinculada a rota `/wiki` no menu de navegação da barra lateral e cadastrada a regra de segurança que exige projeto ativo.
*   **Padronização Automática de Nomes nos Textos (UC-092)**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx): Adicionado item "Ferramentas" no menu suspenso do editor e botão "Padronizar Nomes". Implementada análise de correspondência de nomes de entidades do lore (erros de acentuação, casing e distância Levenshtein <= 2) no texto do manuscrito ativo, exibindo modal de lote. Substituição realizada apenas em nós de texto HTML da árvore DOM, preservando tags e hyperlinks externos, envelopados em transação atômica Dexie.

*   [INDEX.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/INDEX.md)
*   [wiki.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/wiki.md)
*   [mapa.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/dependencias/mapa.md)

## [2026-07-23] - Gestão Completa de Pastas (Pin/Fav/Arq/Lix) e Lore Chat com Citações RAG

### Código Adicionado/Modificado
*   **Gestão de Pastas na Árvore de Arquivos (UC-154, UC-155, UC-156, UC-157)**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx): Inseridos botões de controle de pasta na barra lateral (Favoritar, Fixar no Topo, Arquivar, Renomear, Mover para Lixeira). Modificada a renderização para priorizar pastas fixadas (📌) no topo, seguidas por ordenação alfabética. Adicionado suporte a pastas em Favoritos (⭐) mantendo a expansibilidade reativa da subárvore.
    *   **Arquivamento e Lixeira Recursivos**: Implementadas funções de varredura recursiva de diretórios que propagam status de arquivamento (`isArchived`) e lixeira (`inTrash`) para subpastas e manuscritos internos. Adicionado bloqueio de escrita (modo leitura apenas) no canvas de escrita principal quando o arquivo pertence a uma pasta arquivada. Implementado painel lateral Lixeira exibindo contagem regressiva para expurgo (30 dias) e suporte a restauração imediata. Loop em background remove fisicamente dados expirados.
*   **Lore Chat com Respostas citando Fontes (UC-158)**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx): Adicionada aba "Lore Chat" no painel lateral direito. Desenvolvido formulário e chat de perguntas. Implementado pipeline RAG local que analisa semanticamente por frequência de palavras-chave o conteúdo de manuscritos e da wiki, retornando respostas detalhadas com referências numeradas clicáveis (ex: `[1]`). Clicar na referência de manuscrito foca o editor, destaca o nó de texto selecionado no TipTap e rola a tela. Clicar em citação de ficha exibe modal de worldbuilding.

### Documentação Vinculada
*   [workflows-manuscritos.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/workflows-manuscritos.md)

## [2026-07-23] - Dashboard de Estatísticas por Colaborador, Exportação de Relatório e Metas Coletivas (UC-201, UC-202, UC-203, UC-204)

### Código Adicionado/Modificado
*   **Produtividade individual por colaborador (UC-201)**:
    *   [stats/page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/stats/page.tsx): Incluído painel "Métricas dos Colaboradores" com seletor de membro, total de palavras adicionadas, horários de maior atividade e capítulos de maior contribuição. O cálculo é derivado de snapshots/versionamento local para manter o fluxo local-first.
    *   Em projetos privados, o fluxo alternativo é aplicado automaticamente, exibindo apenas o relatório do próprio autor.
*   **Exportação de métricas (UC-202)**:
    *   [stats/page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/stats/page.tsx): Adicionados botões de exportação para CSV (dados tabulares) e PDF (relatório consolidado imprimível) no cabeçalho do dashboard.
*   **Metas de produtividade em equipe (UC-203, UC-204)**:
    *   [stats/page.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/stats/page.tsx): Incluso fluxo de criação de "Meta Coletiva" com contribuição alvo por membro, prazo e modo ranking. Implementado painel de progresso da equipe com barra percentual, somatório consolidado e alerta visual ao ultrapassar 90% da meta.
*   **Planejamento macro**:
    *   [ROADMAP.md](file:///home/zucchi/Projetos/Eldritch_Lich/ROADMAP.md): UC-201, UC-202, UC-203 e UC-204 marcadas como concluídas.

### Documentação Vinculada
*   [metas-escrita.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/metas-escrita.md)
*   [mapa.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/dependencias/mapa.md)

## [2026-07-23] - Revisão de Código, Refino Visual do Hub de Projetos e Robustez no Merge de Conflitos

### Código Adicionado/Modificado
*   **Resolução de conflitos com preservação estrutural (UC-200)**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx): A lógica de merge conflitante foi refinada para comparar e reconciliar por blocos HTML, mantendo os blocos originais selecionados no resultado final em vez de reconstrução textual simplificada por `<p>`.
*   **UX e tipagem no hub de projetos**:
    *   [GoogleDocsHomeComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/projects/GoogleDocsHomeComponent.tsx): Adicionados badges visuais distintos para `Privado`/`Compartilhado`, estados `focus-visible` para navegação por teclado e centralização de opções de gênero/visibilidade com tipagem explícita.

### Documentação Vinculada
*   [workflows-manuscritos.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/workflows-manuscritos.md)
*   [autenticacao-workspace.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/autenticacao-workspace.md)
*   [mapa.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/dependencias/mapa.md)
*   [wiki.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/wiki.md)

## [2026-07-23] - Importação/Exportação DOCX Avançadas, Modo Leitura, Tela Cheia e Acessibilidade (ARIA/Keyboard)

### Código Adicionado/Modificado
*   **Importação e Exportação Word DOCX (UC-163, UC-194)**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx): Adicionadas configurações de layout de documento no modal de exportação para Word (fonte Calibri/Times/Arial, espaçamento de 1.0 a 2.0, recuos de parágrafo). Implementada compilação do conteúdo do editor gerando tags de comentário Word nativos (`mso-special-character`). Adicionado suporte a importação local-first de arquivos binários `.docx`: leitor local extrai `word/document.xml` por leitura de headers de arquivo ZIP e decompressão off-line com `DecompressionStream('deflate-raw')`, convertendo elementos XML em HTML semântico. Adicionado aviso de formato `.doc` antigo incompatível.
*   **Modo Leitura, Tela Cheia, Tempo de Leitura e Acessibilidade (UC-187, UC-164, UC-186, UC-160)**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx): Desenvolvidos esquemas de cores Sépia e Cinza para leitura. Ativação do modo leitura altera tamanho de margens para 6rem, oculta a régua e força TipTap para read-only. Adicionado botão para acionar API Fullscreen do navegador. Implementada estimativa de leitura do rodapé ajustável por WPM dinâmico no painel de configurações. Registrados atributos ARIA estruturais e atalho global `Alt + Shift + E` para forçar o foco de digitação no editor.

### Documentação Vinculada
*   [workflows-manuscritos.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/workflows-manuscritos.md)

## [2026-07-23] - Ramificação, Mesclagem, Resolução de Conflitos e Histórico Colaborativo (UC-195, UC-196, UC-198, UC-199, UC-200)

### Código Adicionado/Modificado
*   **Ramificação e Mesclagem de Manuscritos (UC-198, UC-199, UC-200)**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx): Adicionado botão na árvore lateral para criar branch de testes isolada, renderizada aninhada sob o capítulo pai com ícone `⌥`. Desenvolvida função de mesclagem automática no capítulo pai com auto-snapshot de histórico. Desenvolvido modal de resolução interativa de conflitos parágrafo por parágrafo, com opções "Manter Principal", "Manter Ramificação" e pré-visualização em tempo real do resultado antes de salvar no IndexedDB.
*   **Histórico Colaborativo e Diff Lado a Lado (UC-195, UC-196)**:
    *   [EditorComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/editor/EditorComponent.tsx): Inserido filtro de histórico por colaborador (Você, Morgana, Lucas, Clarice) e botão de realce visual de alterações, que renderiza um painel read-only do texto colorindo edições feitas pelo autor com destaque de contraste WCAG AA. Redesenhado modal de diff com suporte a dois painéis de comparação lado a lado (side-by-side) com rolagem sincronizada pixel-perfect e toggle para diff inline corrido.

### Documentação Vinculada
*   [workflows-manuscritos.md](file:///home/zucchi/Projetos/Eldritch_Lich/brain/modulos/workflows-manuscritos.md)
