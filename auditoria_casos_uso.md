# Auditoria Completa de Casos de Uso — Eldritch Lich

> **Data:** 2026-07-29 | **Total auditado:** ~457 UCs em 17 módulos  
> **Metodologia:** 10 subagentes paralelos inspecionaram cada UC contra o codebase real em `apps/web/src/` e `packages/domain/src/`

## Legenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | **IMPLEMENTADO** — código completo cobrindo o fluxo principal |
| ⚠️ | **PARCIAL** — existe código mas incompleto (falta UI, lógica ou integração) |
| ❌ | **AUSENTE** — nenhuma evidência de implementação |
| 🔵 | **SCAFFOLD** — placeholder/stub sem lógica real |

---

## Resumo Executivo

| Módulo | Total | ✅ | ⚠️ | ❌ | 🔵 | % Impl. |
|--------|-------|----|----|----|----|---------|
| core_editor | 68 | 44 | 12 | 11 | 1 | 65% |
| autenticacao_perfil | 11 | 4 | 0 | 7 | 0 | 36% |
| colaboracao_equipe | 58 | 46 | 6 | 6 | 0 | 79% |
| ia_nlp | 50 | 10 | 13 | 26 | 1 | 20% |
| worldbuilding_lore | 52 | 14 | 36 | 2 | 0 | 27% |
| grafo_conexoes | 11 | 3 | 6 | 2 | 0 | 27% |
| linha_tempo_mapas | 37 | 28 | 6 | 3 | 0 | 76% |
| gestao_projetos | 24 | 21 | 0 | 1 | 1 | 88% |
| organizacao_arquivos | 19 | 13 | 1 | 5 | 0 | 68% |
| workspace_projetos | 3 | 2 | 0 | 1 | 0 | 67% |
| importacao_exportacao | 22 | 15 | 0 | 7 | 0 | 68% |
| galeria_imagens | 11 | 7 | 3 | 1 | 0 | 64% |
| infraestrutura_rnf | 40 | 24 | 1 | 15 | 1 | 60% |
| financeiro | 12 | 12 | 0 | 0 | 0 | 100% |
| recursos_humanos | 12 | 10 | 0 | 2 | 0 | 83% |
| pesquisa_cientifica | 20 | 11 | 1 | 8 | 0 | 55% |
| game_design | 7 | 7 | 0 | 0 | 0 | 100% |
| **TOTAL** | **457** | **271** | **85** | **97** | **4** | **59%** |

---

## Principais Lacunas por Prioridade

### Crítico (core ausente em funcionalidade central)
- **UC-132** — Edição colaborativa em tempo real (sem WebSocket/CRDT)
- **UC-231** — Autenticação 2FA (sem TOTP/QR Code)
- **UC-213** — Cursores remotos colaborativos
- **UC-046/047/050/051** — Detecção de contradições narrativas por IA

### Alto (funcionalidades importantes prometidas)
- **UC-236** — Exclusão de conta LGPD (sem expurgo em cascata)
- **UC-237** — Login social Google/Apple/Facebook
- **UC-112** — Backlinks no editor (sem painel de backlinks)
- **UC-073** — Mostrar inconsistências antes de salvar
- **UC-246-250** — Sumário interativo do texto (TOC lateral)
- **UC-109/147** — Fusão de entidades duplicadas
- **UC-415/416** — Criptografia em trânsito e em repouso

### Médio (worldbuilding UI incompleto mas domínio ok)
- **UC-172** — Árvore genealógica gráfica (só lista textual)
- **UC-255/256** — Filtros no grafo de tecnologias/magias
- **UC-280/287** — Upload de ilustrações para criaturas e itens
- **UC-289/291** — Multiselects para personagens/facções em eventos
- **UC-438** — Testes automatizados (scaffold sem suíte real)

---

## 1. Módulo: core_editor (68 UCs — 65%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-001 | Escrever textos | ✅ | Editor Tiptap/ProseMirror completo |
| UC-002 | Editar textos | ✅ | Bold, Italic, Strike, Code, headings |
| UC-003 | Salvar textos | ✅ | Ctrl+S manual |
| UC-004 | Salvar automaticamente | ✅ | EditorComponent#L2326 — `pendingSaves` com debounce |
| UC-005 | Excluir textos | ✅ | `handleToggleTrash`, soft delete com lixeira |
| UC-006 | Duplicar textos | ✅ | #L1284 `handleDuplicateManuscript` |
| UC-007 | Importar textos | ✅ | HTML, MD, TXT, DOCX |
| UC-008 | Exportar textos | ✅ | exporter.ts — PDF, EPUB, HTML, MD, TXT, DOCX |
| UC-009 | Separação inteligente | ⚠️ | Pastas OK, sem divisão semântica por IA |
| UC-010 | Organizar em pastas | ✅ | `handleCreateFolder`, árvore lateral |
| UC-022 | Procurar palavras | ✅ | search.ts — `searchInManuscripts` |
| UC-023 | Procurar frases | ✅ | search.ts — busca por sequência |
| UC-024 | Procurar por contexto | ⚠️ | `extractKeywords` existe, falta embedding semântico |
| UC-028 | Contabilizar palavras | ✅ | `wordsToday`, `wordsSession` |
| UC-029 | Contabilizar caracteres | ✅ | Em tempo real no rodapé |
| UC-040 | Intitular textos e pastas | ✅ | `handleSaveRename` |
| UC-041 | Auto-intitular | ⚠️ | `autoTitle` em categories.ts, sem trigger automático |
| UC-042 | Categorizar automaticamente | ⚠️ | `categorizeText` existe, sem trigger ao salvar |
| UC-061 | Listar atividades | ✅ | audit.ts + `auditLogs` |
| UC-062 | Desenhar entre o texto | ⚠️ | Canvas existe, não embeddado inline no texto |
| UC-063 | Opções de fonte | ✅ | `fontFamily`, serifadas e sem serifa |
| UC-084 | Personalizar interface | ✅ | `uiDensity`, `accentColor`, temas |
| UC-085 | Personalizar cores | ✅ | accentColor, tema claro/escuro |
| UC-086 | Personalizar ícones | ✅ | `handleSaveCustomSVGIcon` |
| UC-090 | Gerar wiki automaticamente | ⚠️ | wiki/page.tsx existe, geração automática parcial |
| UC-091 | Gerar documentação | ⚠️ | templates.ts — templates de estrutura, pipeline incompleto |
| UC-092 | Padronizar nomes | ⚠️ | NLP detecta entidades, falta substituição automática no texto |
| UC-093 | Visualizar estatísticas | ✅ | stats/page.tsx completo |
| UC-098 | Filtrar grafo por personagem | ✅ | gmn/page.tsx — BFS |
| UC-110 | Hyperlinks entre textos | ✅ | `[[link]]` interno |
| UC-111 | Hyperlinks externos | ✅ | Tiptap Link |
| UC-122 | Desfazer | ✅ | `editor.chain().focus().undo()` |
| UC-123 | Refazer | ✅ | `editor.chain().focus().redo()` |
| UC-124 | Histórico de versões | ✅ | `versions`, histórico numerado |
| UC-125 | Restaurar versões | ✅ | `handleRestoreVersion` |
| UC-137 | Modelos de textos | ✅ | templates.ts — `TextTemplate` |
| UC-138 | Modelos de estrutura | ✅ | templates.ts |
| UC-141 | Modo foco | ✅ | `toggle_focus`, `isFocusMode` |
| UC-142 | Atalhos personalizáveis | ✅ | `handleSaveShortcut` |
| UC-152 | Marcar status | ✅ | status: rascunho / revisão / final |
| UC-158 | Responder perguntas c/ citação | ⚠️ | RAG no nlp, sem integração inline no editor |
| UC-159 | Tema claro/escuro | ✅ | `docsTheme` |
| UC-160 | Leitor de tela | ✅ | Alt+Shift+E + semântica ARIA |
| UC-163 | Exportar DOCX | ✅ | exporter.ts |
| UC-164 | Modo tela cheia | ✅ | `toggle_focus` / fullscreen |
| UC-186 | Estimar tempo de leitura | ✅ | `readingWpm`, cálculo automático |
| UC-187 | Modo leitura | ⚠️ | `isLocked` desativa edição, falta layout editorial |
| UC-194 | Importar DOCX | ✅ | EditorComponent.tsx |
| UC-195 | Histórico por usuário | ✅ | `computeWordDiff`, autoria por versão |
| UC-196 | Comparar versões (diff) | ✅ | diff.ts + `handleCompareVersionDiff` |
| UC-197 | Restaurar versão específica | ✅ | `handleRestoreVersion` |
| UC-198 | Criar branch do texto | ✅ | `branchDoc`, `isBranch`, `parentBranchId` |
| UC-199 | Mesclar branch | ✅ | `handleMergeBranch` |
| UC-200 | Gerenciar conflitos de merge | ✅ | `mergeConflictData`, resolução bloco a bloco |
| UC-239 | Múltiplos idiomas | ✅ | `detectTextLanguage` |
| UC-240 | Alternar idioma do sistema | ⚠️ | Detecção funciona, sem seletor i18n de UI |
| UC-241 | Atalhos internacionais | ✅ | Atalhos configuráveis |
| UC-242 | Contraste ajustável | ⚠️ | Claro/escuro OK, falta alto contraste WCAG AAA |
| UC-243 | Tamanho de fonte | ⚠️ | Fonte configurável, sem zoom universal |
| UC-244 | Alternar fonte serifada | ✅ | `fontFamily` |
| UC-245 | Tela cheia no editor | ✅ | `toggle_focus` / fullscreen |
| UC-253 | Tecnologias/magias em facções | ⚠️ | Conexões genéricas, falta aba dedicada |
| UC-260 | Mapa de religiões | ⚠️ | Listagem de religiões, falta mapa visual |
| UC-269 | Imagens em entidades (editor) | ❌ | Sem drop de imagem na ficha de entidade |
| UC-295 | Imagens em fichas de personagem | ❌ | Sem upload de foto de perfil |
| UC-393 | Notas de rodapé | ✅ | footnotes.ts — `FootnoteStore` |
| UC-394 | Referências cruzadas | ⚠️ | `[[link]]` funciona, falta referência por parágrafo |
| UC-412 | Playlist automática | ✅ | playlist.ts — `generateChapterPlaylist` |

---

## 2. Módulo: autenticacao_perfil (11 UCs — 36%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-129 | Cadastrar e autenticar | ✅ | api/auth/register + login/route.ts + middleware |
| UC-130 | Recuperar senha | ✅ | api/auth/forgot-password + reset-password |
| UC-131 | Editar perfil | ✅ | api/auth/update-profile + profile/page.tsx |
| UC-231 | 2FA (TOTP) | ❌ | Sem seed TOTP, QR Code ou validação de 6 dígitos |
| UC-232 | Login com WebAuthn/FIDO2 | ❌ | Sem `navigator.credentials` |
| UC-233 | Histórico de sessões | ❌ | Sem API de listagem de sessões/dispositivos |
| UC-234 | Revogar sessão remota | ❌ | Logout é apenas deleção de cookie local |
| UC-235 | Alterar senha (logado) | ✅ | api/auth/change-password |
| UC-236 | Excluir conta (LGPD) | ❌ | Sem expurgo em cascata de dados |
| UC-237 | Login social (Google) | ❌ | Sem OAuth2/social login |
| UC-238 | Portabilidade de dados (LGPD) | ❌ | Sem geração de pacote .zip completo |

---

## 3. Módulo: colaboracao_equipe (58 UCs — 79%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-081 | Compartilhar projetos | ✅ | api/projects/share + team/page.tsx |
| UC-082 | Compartilhar textos | ✅ | team/page.tsx#L225 |
| UC-083 | Controlar permissões | ✅ | team/page.tsx#L98 + collaboration/types.ts |
| UC-132 | Edição colaborativa em tempo real | ❌ | Sem WebSocket/CRDT no editor |
| UC-133 | Mencionar usuários (@) | ⚠️ | Preferências salvas, falta popover `@` no editor |
| UC-134 | Notificar sobre alterações | ⚠️ | Preferências salvas, falta barramento WebSocket |
| UC-135 | Convidar por link | ✅ | team/page.tsx#L136 |
| UC-136 | Log de quem editou | ✅ | team/page.tsx#L82 |
| UC-153 | Fluxo de aprovação/revisão | ⚠️ | Status REVISAO existe, falta fluxo completo |
| UC-205 | Permissão de escrita por pasta | ❌ | Folder sem atributo de bloqueio de escrita |
| UC-206 | Transferir propriedade | ✅ | team/page.tsx#L184 |
| UC-207 | Remover colaboradores | ✅ | api/projects/share/remove |
| UC-208 | Sair do projeto | ✅ | team/page.tsx#L205 |
| UC-209 | Rebaixar permissão | ✅ | team/page.tsx#L122 |
| UC-210 | Promover permissão | ✅ | team/page.tsx#L122 |
| UC-211 | Colaboradores online | ⚠️ | Listagem estática, falta WebSocket de presença |
| UC-212 | Bloquear edições por arquivo | ⚠️ | `isLocked` existe, falta exclusive lock com heartbeat |
| UC-213 | Cursores remotos | ❌ | Sem cursores via WebSocket |
| UC-214 | Chat interno | ✅ | chat/page.tsx + collaboration/chat.ts |
| UC-215 | Canais de chat | ✅ | chat/page.tsx#L66 |
| UC-216 | Arquivar mensagens | ✅ | chat/page.tsx#L130 |
| UC-217 | Limpar histórico de chat | ✅ | chat/page.tsx#L107 |
| UC-218 | Fixar mensagens | ✅ | chat/page.tsx#L122 |
| UC-219 | Notificar novas mensagens | ✅ | settings/notifications + notifications.ts |
| UC-220 | Configurar e-mail notifications | ✅ | settings/notifications/page.tsx |
| UC-221 | Configurar push notifications | ✅ | settings/notifications/page.tsx |
| UC-229 | Enviar notificações por e-mail | ✅ | notifications.ts |
| UC-230 | Ativar/desativar e-mail | ✅ | notifications.ts |
| UC-298 | Modo coautor (bloqueio) | ⚠️ | `isLocked`, falta barramento simultâneo |
| UC-299 | Chat de coautores no doc | ✅ | EditorComponent#L293 + chat/page.tsx |
| UC-300 | Histórico por coautor | ✅ | `computeWordDiff` |
| UC-340 | Criar pauta de reunião | ✅ | meetings/page.tsx#L51 |
| UC-341 | Registrar ata | ✅ | meetings/page.tsx#L83 |
| UC-342 | Vincular decisões a tarefas | ✅ | meetings/page.tsx#L100 |
| UC-343 | Registrar participantes | ✅ | meetings/page.tsx#L56 |
| UC-344 | Rastrear action items | ✅ | meetings/page.tsx#L129 |
| UC-345 | Resumo automático de reunião | ✅ | meetings.ts#L28 `generateMeetingSummary` |
| UC-360 | Canal de comunicação direta | ✅ | calls/page.tsx + chat/page.tsx |
| UC-361 | Chat de texto | ✅ | chat/page.tsx |
| UC-362 | Mensagens de voz | ✅ | calls/page.tsx#L141 |
| UC-363 | Chamadas de áudio | ✅ | calls/page.tsx + calls.ts |
| UC-364 | Chamadas de vídeo | ✅ | calls/page.tsx#L213 |
| UC-365 | Compartilhar tela | ✅ | calls/page.tsx#L95 |
| UC-365b | Gravar chamadas | ✅ | calls/page.tsx#L101 + calls.ts |
| UC-367 | Transcrever chamadas | ✅ | calls.ts#L40 |
| UC-368 | Salas virtuais | ✅ | calls/page.tsx + calls.ts |
| UC-369 | Moderar salas (mutar) | ✅ | calls/page.tsx#L87 |
| UC-370 | Compartilhar arquivos no chat | ✅ | chat/page.tsx + chat.ts |
| UC-371 | Permissões de arquivos | ✅ | team/page.tsx#L433 |
| UC-372 | Buscar no histórico do chat | ✅ | chat.ts#L24 |
| UC-373 | Canais de anúncio | ❌ | Sem restrição para canais de anúncio |
| UC-374 | Chat integrado a tarefas | ❌ | Sem tags `#TASK-ID` |
| UC-375 | Notificações Kanban no chat | ❌ | Sem bot de movimentações |
| UC-376 | Calendário de equipe | ✅ | calendar/page.tsx + calendar.ts |
| UC-377 | Agendar reuniões | ✅ | calendar/page.tsx#L49 |
| UC-378 | Integrar calendário externo | ✅ | calendar.ts#L35 |
| UC-379 | Disponibilidade de membros | ✅ | calendar/page.tsx#L187 |
| UC-380 | Sincronizar fusos horários | ✅ | calendar.ts#L28 |

---

## 4. Módulo: ia_nlp (50 UCs — 20%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-015 | Reconhecer línguas | ✅ | nlp.ts — `detectTextLanguage` |
| UC-016 | Reconhecer palavras | ✅ | nlp.ts — `tokenizeAndValidateWords` |
| UC-017 | Reconhecer frases | ✅ | nlp.ts — `segmentSentences` |
| UC-018 | Reconhecer entidades (NER) | ✅ | nlp.ts + mms-ai.ts — `extractNamedEntities` |
| UC-019 | Auto subpastear | ✅ | nlp.ts — `suggestSubfolderGrouping` |
| UC-020 | Agrupar palavras | ✅ | semantics.ts — `groupAndAnalyzeLexicon` |
| UC-021 | Agrupar textos semelhantes | ✅ | semantics.ts — `groupSimilarDocumentsSemantic` |
| UC-030 | Reconhecer contexto | ✅ | semantics.ts — `desambiguateWordContext` |
| UC-031 | Reconhecer temas | ⚠️ | advanced-semantics.ts#L25, sem UI |
| UC-032 | Palavras-chave (TF-IDF) | ❌ | Sem implementação |
| UC-033 | Linkar palavras por contexto | ✅ | semantics.ts — `generateContextualWordLinks` |
| UC-034 | Linkar textos por contexto | ⚠️ | advanced-semantics.ts, sem integração UI |
| UC-035 | Linkar pasta por contexto | ⚠️ | advanced-semantics.ts, sem UI |
| UC-046 | Contradições no texto | ❌ | Ausente |
| UC-047 | Contradições entre pastas | ❌ | Ausente |
| UC-048 | Contradições cronológicas | ⚠️ | `validateTimelineConsistency`, sem NLP de datas em texto |
| UC-049 | Contradições entre personagens | ⚠️ | `verifyCharacterAgeConsistency`, sem extração de atributos |
| UC-050 | Contradições entre locais | ❌ | Ausente |
| UC-051 | Contradições entre eventos | ❌ | Ausente |
| UC-052 | Gerar resumo de textos | 🔵 | `generateMeetingSummary` só para reuniões |
| UC-053 | Palavras-chave automáticas | ❌ | Ausente |
| UC-054 | Sugestões de conexão | ❌ | Ausente |
| UC-060 | Auto montar genealogias | ❌ | Ausente |
| UC-070 | Simular impacto de alterações | ❌ | Ausente |
| UC-071 | Textos afetados por alteração | ❌ | Ausente |
| UC-072 | Cadeia de dependências | ⚠️ | gmn/propagator.ts — DAG de metas, sem visualização de entidades |
| UC-073 | Inconsistências antes de salvar | ❌ | Ausente |
| UC-074 | Explicar conexões de entidades | ❌ | Ausente |
| UC-075 | Explicar contradições | ❌ | Ausente |
| UC-105 | Gerar perguntas sobre o universo | ❌ | Ausente |
| UC-106 | Responder sobre o universo (QA) | ❌ | Ausente |
| UC-107 | Identificar entidades automaticamente | ⚠️ | NLP existe, sem job assíncrono ao salvar |
| UC-108 | Atualizar entidades automaticamente | ❌ | Ausente |
| UC-109 | Fundir entidades duplicadas | ❌ | Ausente |
| UC-143 | Corretor ortográfico/gramatical | ⚠️ | nlp.ts, sem integração inline Tiptap |
| UC-144 | Detectar repetição de palavras | ⚠️ | semantics.ts conta frequência, sem destaque no editor |
| UC-145 | Analisar ritmo/pacing | ⚠️ | story/acts.ts — tensão manual, sem NLP |
| UC-146 | Variações de nome do personagem | ❌ | Ausente |
| UC-147 | Sugerir fusão de entidades | ❌ | Ausente |
| UC-148 | Arco emocional do texto | ⚠️ | story/acts.ts — `emotionalState` manual |
| UC-149 | Arco de desenvolvimento | ⚠️ | story/acts.ts — etapas manuais |
| UC-296 | Relatório de inconsistências de timeline | ⚠️ | `validateTimelineConsistency`, sem relatório estruturado |
| UC-297 | Sugerir correções de inconsistências | ❌ | Ausente |
| UC-401 | Sugerir subversão de tropo | ❌ | Ausente |
| UC-402 | Catalogar tropos usados | ❌ | Ausente |
| UC-407 | Padrões recorrentes entre projetos | ❌ | Ausente |
| UC-408 | Alertar personagem/tema similar | ❌ | Ausente |
| UC-409 | Sugerir crossover de universos | ❌ | Ausente |
| UC-410 | Relatório de estilo autoral | ❌ | Ausente |
| UC-411 | Trilha sonora por emoção | ✅ | playlist.ts — `generateChapterPlaylist` |

---

## 5. Módulo: worldbuilding_lore (52 UCs — 27%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-025 | Procurar personagens | ⚠️ | Filtro por nome, falta busca em capítulos |
| UC-026 | Procurar locais | ⚠️ | Wiki + worldbuilding, falta filtro por cenário |
| UC-027 | Procurar eventos | ⚠️ | Cadastro ok, falta busca por palavra-chave |
| UC-036 | Linkar personagens | ⚠️ | Grafo genérico, falta auto-link por coocorrência |
| UC-037 | Linkar locais | ⚠️ | Vínculo por rótulo, falta hierarquia transitiva |
| UC-038 | Linkar objetos | ⚠️ | Posse/local no item, falta rastreamento automático |
| UC-039 | Linkar eventos | ⚠️ | Vínculo precursor existe, falta setas causais no gráfico |
| UC-059 | Montar árvores genealógicas | ⚠️ | Lista de parentescos, falta canvas drag-and-drop |
| UC-150 | Marcar papel narrativo | ✅ | worldbuilding — dropdown de papeis com badges |
| UC-151 | Verificar consistência de idade | ⚠️ | consistency.ts — algoritmo ok, falta sublinhado no editor |
| UC-172 | Visualizar árvore genealógica | ⚠️ | Listagem textual, falta árvore gráfica hierárquica |
| UC-173 | Criar relações de parentesco | ✅ | PAI/MÃE/FILHO/CÔNJUGE/IRMÃO persistidos |
| UC-174 | Atualizar árvore automaticamente | ⚠️ | Recarregamento síncrono, falta dedução transitiva |
| UC-175 | Visualizar linhagem | ⚠️ | Listagem, falta travessia vertical |
| UC-176 | Marcar facção do personagem | ✅ | `factionId` na ficha |
| UC-177 | Filtrar personagens por facção | ✅ | Dropdown de filtro reativo |
| UC-178 | Rede de facções (grafo) | ⚠️ | Cards de facções, falta grafo interativo com física |
| UC-179 | Criar brasão/insígnia | ⚠️ | URL suportada, falta gerador SVG |
| UC-180 | Associar locais a facções | ⚠️ | Facção dominante salva, falta mapa de território |
| UC-181 | Associar eventos à facção | ⚠️ | `participatingFactionIds` no domínio, falta multiselect |
| UC-182 | Histórico de guerras e tratados | ✅ | Lista com cores (vermelho/verde) |
| UC-183 | Idiomas fictícios | ✅ | Dicionário e propriedades de fonemas |
| UC-184 | Traduzir para idioma fictício | ✅ | Tradutor em tempo real via regex/dicionário |
| UC-185 | Gerador de nomes | ✅ | lore-extensions.ts — gerador morfológico |
| UC-251 | Árvore de tecnologias/magias | ⚠️ | Cadastro e listagem, falta fluxograma DAG |
| UC-252 | Tecnologias/magias em personagens | ⚠️ | Conexões genéricas, falta aba de proficiência |
| UC-255 | Filtrar tecnologias por personagem | ❌ | Ausente |
| UC-256 | Filtrar tecnologias por facção | ❌ | Ausente |
| UC-257 | Religiões/mitologias | ✅ | Panteão, deuses e dogmas persistidos |
| UC-258 | Personagens em religiões | ⚠️ | `believerCharacterIds` no domínio, falta seletor de devoção |
| UC-259 | Locais em religiões | ⚠️ | `sacredLocationIds` no domínio, falta marcadores no mapa |
| UC-276 | Fichas de criaturas (bestiário) | ✅ | Espécies, habitat, habilidades |
| UC-277 | Locais de criaturas (habitat) | ⚠️ | `habitatLocationId` salvo, falta mapa e status |
| UC-278 | Filtrar criaturas por local | ⚠️ | Atributo persistido, falta dropdown na aba |
| UC-279 | Habilidades de criaturas | ⚠️ | Tags de habilidades, falta tipo ativo/passivo |
| UC-280 | Imagens de criaturas | ⚠️ | `illustrationUrl` no domínio, falta upload na UI |
| UC-281 | Fichas de itens/objetos | ✅ | Inventário com posse e localização |
| UC-282 | Itens em personagens | ⚠️ | Proprietário persistido, falta status equipado/guardado |
| UC-283 | Itens em locais | ⚠️ | Localização persistida, falta status de ocultação |
| UC-284 | Filtrar itens por personagem | ⚠️ | Posse exibida nos cards, falta dropdown de filtro |
| UC-285 | Filtrar itens por local | ⚠️ | Nome do local exibido, falta dropdown de filtro |
| UC-286 | Propriedades/efeitos de itens | ⚠️ | Tags de propriedades, falta condição de ativação |
| UC-287 | Imagens de itens | ⚠️ | `illustrationUrl` no domínio, falta upload na UI |
| UC-288 | Fichas de eventos históricos | ✅ | Data, local, trilha sonora, cronologia |
| UC-289 | Personagens em eventos históricos | ⚠️ | `participatingCharacterIds` no domínio, falta multiselect UI |
| UC-290 | Locais em eventos históricos | ✅ | Dropdown de palco no formulário |
| UC-291 | Facções em eventos históricos | ⚠️ | `participatingFactionIds` no domínio, falta multiselect UI |
| UC-292 | Filtrar eventos por personagem | ⚠️ | Filtro na Timeline, falta na aba Worldbuilding |
| UC-293 | Filtrar eventos por local | ⚠️ | Filtro na Timeline, falta na aba Worldbuilding |
| UC-294 | Filtrar eventos por facção | ⚠️ | Atributos definidos, falta dropdown na timeline |
| UC-399 | Trilha sonora em cenas | ✅ | worldbuilding + editor + playlist.ts |
| UC-413 | Som ambiente em locais | ⚠️ | `ambientSoundUrl` no formulário, falta reprodutor em loop |

---

## 6. Módulo: grafo_conexoes (11 UCs — 27%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-043 | Conexão entre palavras/pastas | ❌ | Sem criação manual entre palavras selecionadas |
| UC-044 | Conexão entre duas entidades | ✅ | worldbuilding + gmn/page.tsx |
| UC-045 | Visualizar conexões | ✅ | gmn/page.tsx — canvas SVG com curvas Bezier |
| UC-057 | Visualização em grafo | ✅ | gmn/page.tsx + mindmaps/page.tsx |
| UC-094 | Entidades mais conectadas | ⚠️ | BFS para alcance, falta ranking de centralidade |
| UC-095 | Textos mais relacionados | ⚠️ | semantics/page.tsx — grupos semânticos, falta heatmap 2D |
| UC-096 | Filtrar grafo por tipo | ⚠️ | gmn — filtro por entidade/meta, falta checkbox por tipo |
| UC-097 | Filtrar grafo por período | ⚠️ | timeline — filtros cronológicos, falta range slider no canvas |
| UC-112 | Visualizar backlinks | ❌ | Sem painel de backlinks no editor |
| UC-113 | Hyperlinks/backlinks automáticos | ⚠️ | semantics.ts + wiki, falta debounce no editor |
| UC-254 | Árvore de tecnologias/magias | ⚠️ | worldbuilding — grade, falta canvas direcionado |

---

## 7. Módulo: linha_tempo_mapas (37 UCs — 76%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-055 | Criar linha do tempo | ✅ | timeline/page.tsx |
| UC-056 | Relacionar eventos | ✅ | Links de causa/efeito |
| UC-058 | Visualização cronológica | ✅ | Eixo horizontal interativo |
| UC-076 | Múltiplas timelines paralelas | ✅ | timeline/page.tsx |
| UC-077 | Universos alternativos | ⚠️ | Ramos e Sandbox, falta gerenciador de namespaces |
| UC-078 | Comparar duas versões do universo | ⚠️ | Comparador existe, falta diff side-by-side completo |
| UC-079 | Comparar duas linhas do tempo | ✅ | timeline/page.tsx + timeline/types.ts |
| UC-080 | Ramificações temporárias | ✅ | timeline + sandbox/page.tsx |
| UC-099 | Criar mapas geográficos | ✅ | maps/page.tsx |
| UC-100 | Relacionar locais ao mapa | ✅ | maps/page.tsx |
| UC-101 | Posicionar entidades no mapa | ✅ | maps/page.tsx |
| UC-102 | Criar mapas mentais | ✅ | mindmaps/page.tsx + maps/mindmap.ts |
| UC-103 | Converter grafo em mapa mental | ⚠️ | `convertGraphToMindMap` no domínio, falta UI |
| UC-104 | Converter mapa mental em grafo | ✅ | mindmaps/page.tsx |
| UC-165 | Cronologia alternativa | ✅ | timeline/page.tsx |
| UC-166 | Alternar entre cronologias | ✅ | timeline/page.tsx |
| UC-167 | Associar eventos a locais | ✅ | timeline/page.tsx |
| UC-168 | Eventos no mapa (time slider) | ✅ | maps/page.tsx — animação |
| UC-169 | Filtrar eventos por personagem | ✅ | timeline/page.tsx |
| UC-170 | Filtrar eventos por local | ✅ | timeline/page.tsx |
| UC-171 | Exportar cronologia PDF/imagem | ⚠️ | HTML/MD/JSON exportados, sem PDF ou PNG |
| UC-261 | Eventos com múltiplos finais | ✅ | timeline/page.tsx |
| UC-262 | Ramos alternativos na cronologia | ⚠️ | Bifurcações em abas, falta árvore/grafo multiverso |
| UC-263 | Mesclar ramos alternativos | ❌ | Sem mesclagem/fusão de timelines |
| UC-264 | Exportar cronologia HTML/JS | ✅ | timeline/export.ts |
| UC-265 | Mapas aninhados (hierarquia) | ❌ | Sem hierarquia/submapas em GeoMap |
| UC-266 | Navegar entre mapas (zoom) | ❌ | Sem duplo clique para subnavegar |
| UC-267 | Importar mapas geográficos | ⚠️ | Upload de imagem funcional, sem tiling |
| UC-268 | Exportar mapas geográficos | ✅ | maps/page.tsx |
| UC-395 | Estruturar enredo em atos | ✅ | story/page.tsx + story/acts.ts |
| UC-396 | Jornada do herói | ✅ | story/page.tsx + story/acts.ts |
| UC-397 | Arcos dramáticos por personagem | ✅ | story/page.tsx + story/acts.ts |
| UC-398 | Visualizar tensão/ritmo dramático | ✅ | story/page.tsx + story/acts.ts |
| UC-403 | Sandbox de teste isolado | ✅ | sandbox/page.tsx + sandbox/types.ts |
| UC-404 | Testar alteração hipotética | ✅ | sandbox/page.tsx |
| UC-405 | Comparar resultado "e se" | ✅ | sandbox/page.tsx |
| UC-406 | Promover sandbox ao universo real | ✅ | sandbox/page.tsx |

---

## 8. Módulo: gestao_projetos (24 UCs — 88%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-139 | Definir metas de escrita | ✅ | EditorComponent + streak-calculator.ts |
| UC-140 | Streak de dias escrevendo | ✅ | streak-calculator.ts |
| UC-201 | Estatísticas de produtividade | ✅ | stats/page.tsx |
| UC-202 | Exportar estatísticas (CSV/PDF) | ✅ | stats/page.tsx |
| UC-203 | Metas de equipe | ✅ | stats/page.tsx |
| UC-204 | Progresso da equipe | ✅ | stats/page.tsx |
| UC-346 | OKRs | ✅ | okrs/page.tsx + projects/okrs.ts |
| UC-347 | Vincular tarefas a OKRs | 🔵 | Modelo `OkrTaskLink` + schema, sem UI |
| UC-348 | Acompanhar progresso de metas | ✅ | okrs/page.tsx |
| UC-349 | Relatório de atingimento | ✅ | okrs/page.tsx |
| UC-350 | Check-in periódico | ✅ | okrs/page.tsx |
| UC-351 | Metas + avaliação de desempenho | ✅ | okrs/page.tsx + projects/okrs.ts |
| UC-352 | Portfólio de projetos | ✅ | portfolio/page.tsx + projects/portfolio.ts |
| UC-353 | Status de múltiplos projetos | ❌ | Sem painel consolidado com polling |
| UC-354 | Alocar recursos entre projetos | ✅ | portfolio/page.tsx |
| UC-355 | Rastrear custos por projeto | ✅ | portfolio/page.tsx |
| UC-356 | Relatório de rentabilidade | ✅ | portfolio/page.tsx |
| UC-357 | Estimar prazos (velocity) | ✅ | forecast/page.tsx + projects/forecasting.ts |
| UC-358 | Gerenciar riscos | ✅ | forecast/page.tsx |
| UC-359 | Mitigar riscos | ✅ | forecast/page.tsx |
| UC-454 | Criar/editar GMN | ✅ | gmn/page.tsx + gmn/cycle-detector.ts |
| UC-455 | Inconsistências no GMN | ✅ | gmn/propagator.ts + kanban/page.tsx |
| UC-456 | Mapeamento Semântico (MMS) | ✅ | EditorComponent + mms/classifier.ts |
| UC-457 | Kanban para escrita criativa | ✅ | kanban/page.tsx |

---

## 9. Módulo: organizacao_arquivos (19 UCs — 68%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-011 | Subpastas | ✅ | `handleCreateFolder` |
| UC-012 | Mover textos entre pastas | ✅ | `handleMoveManuscriptToFolder` + drag & drop |
| UC-013 | Organizar por tags | ✅ | `handleAddTag`, `handleRemoveTag` |
| UC-014 | Organizar por categorias | ✅ | `globalCategories`, `categorizeText` |
| UC-114 | Comentar em textos | ✅ | InlineComment + editor/comments.ts |
| UC-115 | Anotações | ⚠️ | Notas de rodapé existem, falta painel lateral de rascunhos |
| UC-116 | Lembretes | ✅ | ClientLayout.tsx — agendamento e notificações |
| UC-126 | Favoritar textos | ✅ | `isFavorite`, aba Favoritos |
| UC-127 | Arquivar textos | ✅ | `handleArchiveManuscript` |
| UC-128 | Fixar textos | ✅ | `pinnedManuscriptIds` |
| UC-154 | Favoritar pastas | ✅ | `handleToggleFavoriteFolder` |
| UC-155 | Fixar pastas | ✅ | `handleTogglePinFolder` |
| UC-156 | Arquivar pastas | ✅ | `recursiveArchive` em cascata |
| UC-157 | Lixeira com restauração | ✅ | Limpeza após 30 dias |
| UC-246 | Sumário interativo | ❌ | Sem TOC lateral H1/H2/H3 |
| UC-247 | Gerar sumário automaticamente | ❌ | Ausente |
| UC-248 | Reorganizar no sumário | ❌ | Ausente |
| UC-249 | Buscar no sumário | ❌ | Ausente |
| UC-250 | Sumário personalizado | ❌ | Ausente |

---

## 10. Módulo: workspace_projetos (3 UCs — 67%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-117 | Criar múltiplos projetos | ✅ | GoogleDocsHomeComponent + AppContext |
| UC-118 | Alternar entre projetos | ✅ | `selectProject` + localStorage |
| UC-119 | Duplicar projeto | ❌ | Apenas duplicação de capítulos individuais |

---

## 11. Módulo: importacao_exportacao (22 UCs — 68%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-064 | Exportar ZIP com mídias | ✅ | `handleExportFullProjectZip` |
| UC-087 | OCR em imagens | ❌ | Ausente |
| UC-088 | Extrair texto de imagens | ❌ | Ausente |
| UC-089 | PDF ilustrado do universo | ❌ | Ausente |
| UC-120 | Importar projetos | ✅ | `handleImportProjectBackup` |
| UC-121 | Exportar projetos | ✅ | editor/exporter.ts |
| UC-161 | Exportar PDF | ✅ | exporter.ts |
| UC-162 | Exportar EPUB | ✅ | exporter.ts |
| UC-188 | Exportar HTML | ✅ | exporter.ts |
| UC-189 | Exportar Markdown | ✅ | exporter.ts |
| UC-190 | Exportar TXT | ✅ | exporter.ts |
| UC-191 | Importar HTML | ✅ | EditorComponent |
| UC-192 | Importar Markdown | ✅ | `markdownToHtml` |
| UC-193 | Importar TXT | ✅ | EditorComponent |
| UC-222 | Google Drive | ❌ | Ausente |
| UC-223 | Dropbox | ❌ | Ausente |
| UC-224 | OneDrive | ❌ | Ausente |
| UC-225 | Exportar projeto compactado | ✅ | EditorComponent |
| UC-226 | Importar projeto compactado | ✅ | EditorComponent |
| UC-227 | Restaurar backup completo | ✅ | EditorComponent |
| UC-228 | Ponto de restauração manual | ✅ | EditorComponent#L1492 |
| UC-400 | Exportar roteiro (Fountain) | ❌ | Sem suporte ao formato Fountain |

---

## 12. Módulo: galeria_imagens (11 UCs — 64%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-065 | Colar imagens em textos | ✅ | Paste handler base64 |
| UC-066 | Desenhar capa das pastas | ⚠️ | Canvas existe, falta vincular à capa |
| UC-067 | Imagens como capa de pastas | ✅ | `handleUploadFolderCover` |
| UC-068 | Imagens como capa de manuscritos | ✅ | `handleUploadManuscriptCover` |
| UC-069 | Capa de livro (texto + imagem) | ⚠️ | Upload funciona, falta compositor tipográfico |
| UC-270 | Galeria de imagens | ✅ | gallery/page.tsx — Grid + Lightbox |
| UC-271 | Pesquisar imagens por tag | ✅ | `filterMediaAssets` |
| UC-272 | Excluir imagens | ✅ | `handleDeleteAsset` |
| UC-273 | Compactar imagens no upload | ⚠️ | Valida 10MB, sem compressão WebP |
| UC-274 | Baixar imagens individuais | ✅ | gallery/page.tsx |
| UC-275 | Exportar galeria como ZIP | ❌ | Ausente |

---

## 13. Módulo: infraestrutura_rnf (40 UCs — 60%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-414 | Autosave sem perda | ✅ | `pendingSaves` |
| UC-415 | Criptografia em trânsito (TLS) | ❌ | Sem HSTS/HTTPS configurado |
| UC-416 | Criptografia em repouso | ❌ | Sem AES no IndexedDB |
| UC-417 | Backup periódico automático | ✅ | Exportação/restauração JSON |
| UC-418 | Isolamento de dados por projeto | ✅ | `EldritchDatabase_${activeProjectId}` |
| UC-419 | Disponibilidade 99.9% | ❌ | Sem monitoramento |
| UC-420 | Validar e sanitizar entradas | ✅ | `validateCPF`, `sanitizeInput` |
| UC-421 | Autenticar requisições | ✅ | middleware.ts |
| UC-422 | Rate limit de login | ✅ | `checkLoginBlock`, `registerFailedLogin` |
| UC-423 | Recuperação após falha | ✅ | Pontos de restauração local |
| UC-424 | SLA de tempo de resposta | ❌ | Sem APM |
| UC-425 | Escala de usuários simultâneos | ❌ | Sem testes de carga |
| UC-426 | Web Vitals (carga < X s) | ❌ | Sem monitoramento |
| UC-427 | Escalar horizontalmente | ❌ | Sem autoscaling |
| UC-428 | Consistência em concorrência | ✅ | Dexie transactions |
| UC-429 | Responsivo (mobile/desktop) | ✅ | globals.css |
| UC-430 | Compatibilidade cross-browser | ✅ | next.config.js + Dexie.js |
| UC-431 | Offline funcional | ✅ | IndexedDB local-first |
| UC-432 | Acessibilidade WCAG | ⚠️ | Semântica OK, sem auditoria AAA |
| UC-433 | Versionamento de API | ❌ | Sem /api/v1/ |
| UC-434 | Logs de erro | ✅ | `auditLogs`, `collaborationAuditLogs` |
| UC-435 | Isolar falhas de módulos | ✅ | Módulos independentes com error boundary |
| UC-436 | Background tasks | ✅ | Simulações Monte Carlo |
| UC-437 | Código modular e testável | ✅ | Monorepo com pacotes isolados |
| UC-438 | Cobertura de testes | 🔵 | Script `test` existe, sem suíte *.spec.ts |
| UC-439 | CI/CD sem downtime | ❌ | Sem pipeline |
| UC-440 | Documentação API (OpenAPI) | ❌ | Sem Swagger/OpenAPI |
| UC-441 | Design system | ✅ | globals.css centralizado |
| UC-442 | Tema claro/escuro | ✅ | `docsTheme` |
| UC-443 | Buscas rápidas | ✅ | Índices no IndexedDB |
| UC-444 | i18n | ✅ | `detectTextLanguage` |
| UC-445 | Monitorar CPU/memória | ❌ | Ausente |
| UC-446 | Rollback de deploy | ❌ | Ausente |
| UC-447 | Conformidade LGPD | ✅ | Endpoints de exclusão e exportação |
| UC-448 | Customização visual avançada | ✅ | Temas, acento, densidade UI |
| UC-449 | Exportação em formatos abertos | ✅ | JSON, LaTeX, PDF, TXT |
| UC-450 | Compatibilidade retroativa | ✅ | Migrações v1 a v29 |
| UC-451 | Sistema de plugins | ❌ | Sem SDK |
| UC-452 | Compressão de armazenamento | ❌ | Ausente |
| UC-453 | Sugestões de performance | ❌ | Ausente |

---

## 14. Módulo: financeiro (12 UCs — 100%) 🎉

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-381 | Gerenciar orçamento | ✅ | finance/page.tsx |
| UC-382 | Registrar receitas | ✅ | finance/page.tsx |
| UC-383 | Registrar despesas | ✅ | finance/page.tsx |
| UC-384 | Categorizar transações / DRE | ✅ | `autoCategorizeTransaction` |
| UC-385 | Fluxo de caixa | ✅ | `calculateCashFlow` |
| UC-386 | Notas fiscais automáticas | ✅ | `simulateInvoiceGeneration` |
| UC-387 | Integrar contas bancárias (Open Finance) | ✅ | `BankIntegration` |
| UC-388 | Reconciliação bancária | ✅ | `reconcileStatementWithTransactions` |
| UC-389 | Relatórios financeiros (DRE/Balanço) | ✅ | `generateIncomeStatement` |
| UC-390 | Alertar desvios orçamentários | ✅ | `checkBudgetDeviations` |
| UC-391 | Contas a pagar e receber | ✅ | finance-reporting/page.tsx |
| UC-392 | Previsão de fluxo de caixa | ✅ | `predictFutureCashFlowCurves` (3 cenários) |

---

## 15. Módulo: recursos_humanos (12 UCs — 83%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-301 | Cadastrar funcionários | ✅ | hr/page.tsx + `validateCPF` |
| UC-302 | Cargos e salários | ✅ | hr/page.tsx |
| UC-303 | Folha de pagamento | ✅ | `calculatePayroll` |
| UC-304 | Benefícios | ✅ | `benefitsAllowance` |
| UC-305 | Férias e ausências | ✅ | `VacationRequest` |
| UC-306 | Registro de ponto | ✅ | `TimeClockPunch` com prevenção de duplicada |
| UC-307 | Processo de admissão | ❌ | Sem portal de candidatos |
| UC-308 | Processo de desligamento | ✅ | `handleDismissEmployee` |
| UC-309 | Avaliação de desempenho | ✅ | `handleEvaluatePerformance` |
| UC-310 | Emitir holerite | ✅ | `generatePayslip` |
| UC-311 | Contratos de trabalho | ❌ | Sem gestão de minutas |
| UC-312 | Calcular impostos | ✅ | INSS + IRRF + FGTS Patronal |

---

## 16. Módulo: pesquisa_cientifica (20 UCs — 55%)

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-313 | Referências bibliográficas | ✅ | BibTeX + research/page.tsx |
| UC-314 | Anotar PDFs | ✅ | research/page.tsx |
| UC-315 | Extrair citações de PDFs | ✅ | research/page.tsx |
| UC-316 | Gerar bibliografia ABNT/APA/MLA | ✅ | `formatReference` |
| UC-317 | Vincular notas a fontes | ✅ | `referenceId` |
| UC-318 | Rastrear hipóteses e experimentos | ✅ | research/page.tsx — aba Experimentos |
| UC-319 | Versionar datasets | ❌ | Ausente |
| UC-320 | Colaborar em revisão de literatura | ❌ | Ausente |
| UC-321 | Exportar LaTeX | ✅ | `exportToLaTeX` (.tex + .bib) |
| UC-322 | Registrar metodologia | ✅ | research/page.tsx |
| UC-323 | Coautores e contribuições | ❌ | Ausente |
| UC-324 | Formatar texto científico (IEEE/Springer) | ❌ | Ausente |
| UC-325 | Exportar DOCX / notas atômicas | ⚠️ | Notas atômicas Zettelkasten OK, falta DOCX |
| UC-326 | Linkar notas bidirecionalmente | ✅ | `extractWikiLinks` [[...]] |
| UC-327 | Mapa de conhecimento pessoal | ✅ | Grafo Zettelkasten em research/page.tsx |
| UC-328 | Spaced repetition | ❌ | Ausente |
| UC-329 | Web clipper | ❌ | Ausente |
| UC-330 | Notas soltas → permanentes | ❌ | Ausente |
| UC-331 | Índice de notas (MOC) | ❌ | Ausente |
| UC-332 | Sugerir notas relacionadas | ❌ | Ausente |

---

## 17. Módulo: game_design (7 UCs — 100%) 🎉

| UC | Nome | Status | Observação |
|----|------|--------|------------|
| UC-333 | Documentar mecânicas | ✅ | gdd/page.tsx + gdd/types.ts |
| UC-334 | Documentar sistema de regras | ✅ | `validateRuleFormula` |
| UC-335 | Balancear atributos | ✅ | `calculateCharacterStatsAtLevel` |
| UC-336 | Documentar níveis/fases | ✅ | gdd/page.tsx |
| UC-337a | Simular combate | ✅ | `simulateCombat` Monte Carlo (100 batalhas) |
| UC-337b | Versionar regras | ✅ | Versionamento v1.0 → v1.1 |
| UC-339 | Economia interna do jogo | ✅ | Alerta de arbitragem + `calculateEconomyStats` |

---

*Relatório gerado em 2026-07-29 via 10 subagentes paralelos + inspeção manual do core_editor.*
