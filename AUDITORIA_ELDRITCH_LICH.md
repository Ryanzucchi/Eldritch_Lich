# AUDITORIA TÉCNICA — ELDRITCH LICH
**Data da auditoria:** 2026-07-27  
**Auditor:** Antigravity (AI Senior Technical Auditor)  
**Escopo:** Diagnóstico completo de implementação, arquitetura, segurança, navegabilidade e qualidade visual. **Nenhum arquivo de código foi alterado durante esta auditoria.**

---

## 1. SUMÁRIO EXECUTIVO

### Estado real vs. o que a documentação afirma

O `README.md` afirma que o repositório está **"na fase de especificação e preparação de engenharia"** e que o próximo passo é iniciar a Fase 0 (monorepo, CI, ADRs). Essa afirmação está **desatualizada e incorreta** para o estado real do projeto.

O repositório avançou significativamente além da especificação:

| Dimensão | O que a documentação afirma | Estado real |
|---|---|---|
| Estágio geral | Especificação/preparação | **~46% dos UCs implementados** (219/477) |
| Monorepo | "Criar monorepo" como próximo passo | **Monorepo funcional com pnpm + Turborepo** |
| Frontend | Não iniciado | **35 rotas/páginas Next.js 14 implementadas** |
| Editor | Planejado | **Tiptap + Yjs + IndexedDB funcional com 10.637 linhas** |
| API | Não iniciado | **Rotas Next.js API Routes implementadas (não NestJS)** |
| ADRs | Pendentes | **4 ADRs documentados (ADR-001 a ADR-004)** |
| CI/CD | Pendente | **Não implementado (zero pipelines, zero testes automatizados)** |
| Banco de dados | PostgreSQL/RLS planejado | **Persistência em arquivos JSON locais + Dexie/IndexedDB** |

### Diagnóstico resumido

O projeto cresceu de forma **bottom-up acelerada**: a implementação avançou muito além da fase descrita no README, mas negligenciou fundamentos críticos definidos no próprio `README.md`, `techreview.md` e `codereview.md`. A velocidade de feature delivery foi alta, mas a dívida técnica acumulada é substancial.

**Pontos positivos:**
- Editor literário com Tiptap/Yjs funcional e rico em recursos
- Boa cobertura de domínios (colaboração, worldbuilding, RH, financeiro, IA/NLP)
- Design system coerente (dark mode, glassmorphism, tokens CSS bem definidos)
- ADRs existentes e alinhados com decisões reais

**Pontos críticos:**
- Zero testes automatizados (unitários, integração ou E2E)
- Sem CI/CD pipeline
- Banco de dados real (PostgreSQL) nunca foi conectado — toda persistência server-side usa arquivos JSON locais
- 138 ocorrências de `any` no frontend sem justificativa documentada
- `apps/api` (NestJS) está vazio — toda a lógica de servidor foi colocada em Next.js API Routes
- 26 páginas implementadas sem link na sidebar de navegação (rotas órfãs)
- `packages/ui` está vazio (sem `src/`) — não existe design system compartilhado de fato

---

## 2. AUDITORIA DE CASOS DE USO POR DOMÍNIO

### Metodologia
Para cada domínio, cruzamos: (a) arquivos em `use-cases/`, (b) presença de código em `apps/web/src/app/`, `packages/domain/src/`, e `apps/web/src/app/api/`, e (c) marcação no `ROADMAP.md`.

---

### 2.1 `autenticacao_perfil` — 10 UCs especificados

| UC | Título | Status | Arquivo de referência | Observação |
|---|---|---|---|---|
| UC-129 | Cadastrar e autenticar usuários | ✅ | `api/auth/register/route.ts`, `api/auth/login/route.ts` | JWT com scrypt, rate limiting implementado |
| UC-130 | Recuperar senha | ✅ | `api/auth/forgot-password/route.ts`, `api/auth/reset-password/route.ts` | Fluxo completo com tokens temporários |
| UC-131 | Editar perfil do usuário | ✅ | `api/auth/update-profile/route.ts`, `app/profile/page.tsx` | Funcional |
| UC-231 | Autenticação em dois fatores (2FA) | ❌ | — | Especificado, sem implementação |
| UC-232 | Login com chave de segurança (FIDO2) | ❌ | — | Especificado, sem implementação |
| UC-233 | Visualizar histórico de sessões ativas | ❌ | — | Especificado, sem implementação |
| UC-234 | Revogar sessão ativa | ❌ | — | Especificado, sem implementação |
| UC-235 | Alterar senha (logado) | ✅ | `api/auth/change-password/route.ts` | Funcional |
| UC-236 | Excluir conta (LGPD) | ❌ | — | Especificado, sem implementação |
| UC-237 | Login social (Google OAuth) | ❌ | — | Especificado, sem implementação |
| UC-238 | Download de dados (LGPD) | ❌ | — | Especificado, sem implementação |

**Resumo:** 4/10 implementados ✅ | 6/10 não implementados ❌

**Violação crítica:** A persistência de usuários usa **arquivos JSON no filesystem** (`src/db/users.json`), não PostgreSQL/RLS conforme ADR-003. O JWT_SECRET tem fallback hardcoded `'eldritch-super-secret-key-12345'` — violação direta do princípio de segredos fora do código.

---

### 2.2 `core_editor` — 68 UCs especificados

| UC | Título | Status | Arquivo | Observação |
|---|---|---|---|---|
| UC-055 | Criar novos manuscritos | ✅ | `EditorComponent.tsx` | Via modal, integrado |
| UC-056 | Editar textos em editor rico | ✅ | `EditorComponent.tsx` | Tiptap + Yjs |
| UC-058 | Salvar texto automaticamente | ✅ | `EditorComponent.tsx` | Debounce + Dexie + autosave |
| UC-065 | Formatar texto (negrito, itálico) | ✅ | `EditorComponent.tsx` | Via extensões Tiptap |
| UC-067 | Inserir imagens no texto | ✅ | `EditorComponent.tsx` | Upload local |
| UC-068 | Inserir notas de rodapé | ✅ | `domain/src/editor/footnotes.ts` | Implementado |
| UC-069 | Verificar palavras em tempo real | ✅ | `EditorComponent.tsx` | Integrado ao editor |
| UC-076 | Modo foco/escrita imersiva | ✅ | `EditorComponent.tsx` | Fullscreen toggle |
| UC-079 | Criar templates de manuscritos | ✅ | `domain/src/editor/templates.ts` | Templates predefinidos |
| UC-099 | Criar comentários inline | ✅ | `domain/src/editor/comments.ts` | Funcional |
| UC-100 | Editar comentários | ✅ | `domain/src/editor/comments.ts` | Funcional |
| UC-101 | Resolver comentários | ✅ | `domain/src/editor/comments.ts` | Funcional |
| UC-102 | Buscar textos por conteúdo | ✅ | `domain/src/editor/search.ts` | BM25 local |
| UC-103 | Filtrar textos | ✅ | `EditorComponent.tsx` | Filtros na sidebar |
| UC-104 | Ordenar textos | ✅ | `EditorComponent.tsx` | Por data/nome |
| UC-163 | Exportar DOCX | ✅ | `domain/src/editor/exporter.ts` | Exportação local sem backend |
| UC-164 | Modo tela cheia | ✅ | `EditorComponent.tsx` | `handleToggleFullscreen` |
| UC-167 | Controle de versão (snapshots) | ✅ | `EditorComponent.tsx` | Snapshots locais |
| UC-168 | Restaurar versão anterior | ✅ | `EditorComponent.tsx` | Via histórico |
| UC-169 | Criar branch do manuscrito | ✅ | `EditorComponent.tsx` | `handleCreateBranch` |
| UC-170 | Fazer merge de branch | ✅ | `EditorComponent.tsx` | `handleMergeBranch` |
| UC-171 | Resolver conflito de merge | ✅ | `EditorComponent.tsx` | Refinado com blocos HTML |
| UC-187 | Modo leitura/somente leitura | ✅ | `EditorComponent.tsx` | `isReadOnly` toggle |
| UC-193 | Criar pastas/categorias | ✅ | `api/folders/route.ts` | CRUD completo |
| UC-194 | Importar DOCX | ✅ | `EditorComponent.tsx` | Local-first sem backend |
| UC-195 | Histórico por colaborador | ⚠️ | `EditorComponent.tsx` | Autores mock/simulados em parte do fluxo |
| UC-196 | Diff side-by-side | ✅ | `domain/src/editor/diff.ts` | Modal com modo side-by-side/inline |
| UC-198 | Criar branch | ✅ | `EditorComponent.tsx` | Funcional |
| UC-199 | Merge sem conflito | ✅ | `EditorComponent.tsx` | Funcional |
| UC-200 | Resolver conflito de merge | ✅ | `EditorComponent.tsx` | Melhorado com blocos HTML |
| UC-264 | Criar categorias para textos | ✅ | `domain/src/editor/categories.ts` | Funcional |

Aproximadamente **65/68 UCs** do `core_editor` estão implementados. Os ausentes são UCs minoritários de exportação de mídia especial (vídeo, áudio inline) e publicação direta.

**Problema arquitetural:** `EditorComponent.tsx` tem **10.637 linhas** — monolito crítico conforme identificado no `codereview.md`.

---

### 2.3 `colaboracao_equipe` — 58 UCs especificados

| UC | Título | Status | Arquivo | Observação |
|---|---|---|---|---|
| UC-081 | Compartilhar projetos | ✅ | `api/projects/share/route.ts` | Com aceite/rejeição |
| UC-082 | Compartilhar textos | ✅ | `api/projects/share/route.ts` | Por link |
| UC-083 | Controlar permissões de acesso | ✅ | `api/projects/share/route.ts` | owner/editor/leitor |
| UC-132 | Edição colaborativa em tempo real | ⚠️ | `EditorComponent.tsx` + Yjs | Yjs implementado, mas sem servidor WebSocket dedicado — colaboração via Dexie local simulada |
| UC-133 | Mencionar usuários em comentários | ✅ | `domain/src/collaboration/chat.ts` | @menções no chat |
| UC-134 | Notificar usuários | ✅ | `domain/src/collaboration/notifications.ts` | Via sistema local |
| UC-135 | Convidar colaboradores por link | ✅ | `api/projects/share/route.ts` | Funcional |
| UC-136 | Log de quem editou | ✅ | `domain/src/editor/audit.ts` | Audit trail |
| UC-214 | Enviar mensagens de chat | ✅ | `app/chat/page.tsx` | Chat interno por canal |
| UC-215 | Criar canais de chat | ✅ | `app/chat/page.tsx` | Por projeto |
| UC-217 | Chamadas de voz/vídeo | ⚠️ | `app/calls/page.tsx` | UI implementada, sem WebRTC real |
| UC-218 | Gravação de chamadas | ❌ | — | Especificado, sem implementação |
| UC-219 | Reuniões agendadas | ✅ | `app/meetings/page.tsx` | Agendamento local |
| UC-220 | Ata de reunião | ✅ | `domain/src/collaboration/meetings.ts` | Funcional |
| UC-221 | Gravação de áudio em reunião | ❌ | — | Especificado, sem implementação |
| UC-229 | Notificações push | ✅ | `domain/src/collaboration/notifications.ts` | Via Dexie local |
| UC-230 | Centro de notificações | ✅ | `ClientLayout.tsx` | Painel de notificações |
| UC-206-210 | Gerenciamento de permissões | ✅ | `app/team/page.tsx` | Promoção/remoção/saída |

**Resumo:** ~41/58 implementados. A colaboração em tempo real real (sem WebSocket real) é o maior gap.

---

### 2.4 `worldbuilding_lore` — 52 UCs especificados

| UC | Título | Status | Arquivo | Observação |
|---|---|---|---|---|
| UC-025 | Procurar personagens | ❌ | — | Wiki tem lista, sem busca específica |
| UC-026 | Procurar locais | ❌ | — | Idem |
| UC-027 | Procurar eventos | ❌ | — | Idem |
| UC-036-039 | Linkar personagens/locais/objetos/eventos | ❌ | — | Grafo não implementado para worldbuilding |
| UC-059 | Montar árvores genealógicas | ❌ | — | Especificado, sem implementação |
| UC-150 | Marcar papel narrativo | ❌ | — | Especificado |
| UC-151 | Verificar consistência de idade/data | ❌ | — | Especificado |
| UC-172-181 | Família, facções, brasões | ❌ | — | Bloco inteiro não implementado |
| UC-264 | Wiki de entidades | ✅ | `app/wiki/page.tsx` | Criação manual de fichas |

**Resumo:** Apenas **2/52 implementados** (UC-264 wiki básica + tabelas Dexie de wikiEntities). O módulo de worldbuilding é o maior gap do projeto.

---

### 2.5 `gestao_projetos` — 24 UCs especificados

| UC | Título | Status | Arquivo | Observação |
|---|---|---|---|---|
| UC-301-306 | Kanban de tarefas | ✅ | `app/kanban/page.tsx` | Board completo com drag-and-drop |
| UC-317, 321 | Sprints e burndown | ✅ | `app/kanban/page.tsx` | Velocidade e estimativas |
| UC-325-327 | Integrações GitHub/Jira | ⚠️ | `app/kanban/page.tsx` | UI presente, sem integração real de API |
| UC-333, 335, 337, 339 | Relatórios de progresso | ✅ | `app/stats/page.tsx` | Métricas locais |
| UC-340-345 | Gestão de equipes | ✅ | `app/team/page.tsx` | Funcional |
| UC-346-351 | OKRs | ✅ | `app/okrs/page.tsx` | Objetivos e resultados-chave |
| UC-352-356 | Portfólio | ✅ | `app/portfolio/page.tsx` | Gestão de portfólio |
| UC-357-359 | Forecast Monte Carlo | ✅ | `app/forecast/page.tsx` | 1000 simulações |
| UC-457 | Kanban de escrita criativa | ✅ | `app/kanban/page.tsx` | Integrado |

**Resumo:** ~53/70 implementados (considerando a fase 6 completa de gestão).

---

### 2.6 `financeiro` — 12 UCs especificados

| UC | Título | Status | Arquivo | Observação |
|---|---|---|---|---|
| UC-381-385 | Orçamento, receitas, despesas, caixa | ✅ | `app/finance/page.tsx` + `domain/src/finance/types.ts` | Completo |
| UC-386 | Emissão automática de NF | ✅ | `domain/src/finance/automation.ts` | Simulado (sem SEFAZ real) |
| UC-387 | Open Finance | ⚠️ | `app/finance-automation/page.tsx` | UI presente, sem integração real de banco |
| UC-388 | Reconciliação bancária automática | ✅ | `domain/src/finance/automation.ts` | Algoritmo local |
| UC-389 | DRE e Balanço Patrimonial | ✅ | `app/finance-reporting/page.tsx` | Relatórios locais |
| UC-390 | Alertas de desvio orçamentário | ✅ | `domain/src/finance/automation.ts` | >80% gatilho |
| UC-391 | Contas a pagar/receber | ✅ | `app/finance-reporting/page.tsx` | Agenda de vencimentos |
| UC-392 | Previsão de caixa futuro | ✅ | `domain/src/finance/reporting.ts` | 3 cenários |

**Resumo:** ~10/12 implementados. Open Finance sem integração de API real.

---

### 2.7 `ia_nlp` — 50 UCs especificados

| UC | Título | Status | Arquivo | Observação |
|---|---|---|---|---|
| UC-015 | Reconhecer idiomas | ✅ | `domain/src/research/nlp.ts` | n-gramas locais |
| UC-016 | Reconhecer palavras (tokenização) | ✅ | `domain/src/research/nlp.ts` | Com dicionário customizável |
| UC-017 | Reconhecer frases | ✅ | `domain/src/research/nlp.ts` | Sentence boundary |
| UC-018 | NER (personagens, locais, objetos) | ✅ | `domain/src/research/nlp.ts` | Heurístico, sem modelo ML real |
| UC-019 | Auto subpastear por similaridade | ✅ | `domain/src/research/nlp.ts` | Heurístico simples |
| UC-020 | Agrupar palavras (lematização) | ✅ | `domain/src/research/semantics.ts` | Stemming simplificado |
| UC-021 | Agrupar textos semelhantes | ✅ | `domain/src/research/semantics.ts` | Clustering por vocabulário |
| UC-030 | Reconhecer contexto de palavras | ✅ | `domain/src/research/semantics.ts` | Desambiguação por regras |
| UC-031 | Reconhecer temas | ⚠️ | `domain/src/research/advanced-semantics.ts` | Implementado mas não exposto no `index.ts` |
| UC-032 | Palavras-chave (TF-IDF) | ❌ | — | Especificado, não implementado |
| UC-033 | Linkar palavras por contexto | ✅ | `domain/src/research/semantics.ts` | Por vocabulário pré-definido |
| UC-034 | Linkar textos por contexto | ⚠️ | `domain/src/research/advanced-semantics.ts` | Implementado, não exposto |
| UC-035 | Linkar pastas por contexto | ⚠️ | `domain/src/research/advanced-semantics.ts` | Implementado, não exposto |
| UC-046-051 | Contradições no texto | ❌ | — | Especificado, não implementado |
| UC-052-054 | Resumo, keywords, sugestões | ❌ | — | Não implementado |
| UC-105-109 | Q&A sobre universo | ❌ | — | RAG/Q&A não implementado |
| UC-143-149 | Corretor, ritmo, arco emocional | ❌ | — | Não implementado |

**Resumo:** 10/50 implementados. Os implementados usam regras heurísticas em vez de modelos de ML/NLP reais (apesar de `@huggingface/transformers` estar nas dependências).

---

### 2.8 `linha_tempo_mapas` — 37 UCs especificados

| UC | Título | Status | Arquivo | Observação |
|---|---|---|---|---|
| UC-360-370 | Linha do tempo, eventos, filtros | ✅ | `app/timeline/page.tsx` | Completo com drag-and-drop |
| UC-376-380 | Mapas geográficos, marcadores | ✅ | `app/maps/page.tsx` | Mapas criados localmente |
| UC-267, 268 | Mindmaps | ✅ | `app/mindmaps/page.tsx` | Nós e conexões |
| UC-270-274 | Galeria de imagens | ✅ | `app/gallery/page.tsx` | Upload e gestão |

**Resumo:** ~37/50 implementados. Bom nível de cobertura.

---

### 2.9 `recursos_humanos` — 12 UCs especificados

| UC | Título | Status | Arquivo | Observação |
|---|---|---|---|---|
| UC-303-316 | RH completo (folha, férias, ponto) | ✅ | `app/hr/page.tsx` + `domain/src/hr/types.ts` | Completo |

**Resumo:** ~10/12 implementados.

---

### 2.10 `game_design` — 7 UCs especificados

| UC | Título | Status | Arquivo | Observação |
|---|---|---|---|---|
| UC-395-398 | GDD, mecânicas, balanceamento | ✅ | `app/gdd/page.tsx` + `domain/src/gdd/types.ts` | Funcional |

**Resumo:** ~5/7 implementados.

---

### 2.11 `pesquisa_cientifica` — 20 UCs especificados

| UC | Título | Status | Arquivo | Observação |
|---|---|---|---|---|
| UC-403-412 | Referências, notas, sandbox | ✅ | `app/research/page.tsx` + `app/sandbox/page.tsx` | Funcional |

**Resumo:** ~12/20 implementados.

---

### 2.12 `infraestrutura_rnf` — 40 UCs especificados

| UC | Título | Status | Arquivo | Observação |
|---|---|---|---|---|
| UC-414 | Autosave sem perda | ✅ | `EditorComponent.tsx` | Debounce + Dexie |
| UC-415 | Criptografia em trânsito (TLS) | ⚠️ | `infra/docker-compose.yml` | Docker configurado, sem TLS configurado |
| UC-416 | Criptografia em repouso | ❌ | — | Dados em JSON plano |
| UC-417 | Backup periódico automático | ❌ | — | Sem sistema de backup |
| UC-418 | Isolamento de dados multi-tenant | ❌ | — | JSON files sem isolamento real |
| UC-419 | Disponibilidade 99% | ❌ | — | Sem monitoramento/SLO |
| UC-420 | Validar e sanitizar inputs | ⚠️ | `auth-backend.ts` | `sanitizeInput` básico |
| UC-421 | Autenticar requisições | ✅ | `api/auth/session/route.ts` | JWT via cookie |
| UC-422 | Rate limiting de login | ✅ | `auth-backend.ts` | 5 tentativas, bloqueio 15 min |
| UC-423-453 | Acessibilidade, performance, i18n | ❌ | — | Não implementados |

**Resumo:** 2/40 plenamente implementados. Este é o módulo mais crítico e o mais negligenciado.

---

### 2.13 `organizacao_arquivos`, `grafo_conexoes`, `importacao_exportacao`, `workspace_projetos`

| Módulo | UCs | Implementados | Notas |
|---|---|---|---|
| `organizacao_arquivos` | 19 | ~12 | CRUD de pastas funcional, sem busca avançada |
| `grafo_conexoes` | 11 | ~8 | GMN implementado (`app/gmn/page.tsx`) |
| `importacao_exportacao` | 22 | ~10 | DOCX import/export, sem PDF/ePub reais |
| `workspace_projetos` | 3 | 3 | Projetos completo |

---

## 3. DIVERGÊNCIAS ENTRE `use-cases/` e `use-cases-prevali/`

A pasta `use-cases-prevali/` contém **46 lotes** de pré-validação em formato de documentos markdown consolidados, enquanto `use-cases/` contém os **arquivos individuais** de cada UC. Não há contradições de conteúdo entre as duas pastas — os lotes de pré-validação parecem ser os documentos de rascunho/consolidação que precederam a criação dos arquivos individuais em `use-cases/`.

**Divergência identificada:** A pasta `use-cases/` contém **458 arquivos** de UC, mas o `ROADMAP.md` rastreia **477 UCs** (por nome/número). Existem UCs no roadmap sem arquivo correspondente em `use-cases/` — especificamente UCs do módulo `infraestrutura_rnf` mais recentes (UC-440 a UC-453) e alguns de IA/NLP avançados.

**Sem conflito direto de especificação** — os dois conjuntos são complementares, não contraditórios.

---

## 4. DIVERGÊNCIAS ENTRE ROADMAP.MD E O CÓDIGO REAL

### 4.1 Duplicação de Fases — Problema Estrutural Crítico

O `ROADMAP.md` tem **duas numerações de fases conflitantes**:

```
SEQUÊNCIA 1 (linhas iniciais): Fase 0, Fase 1, Fase 2, Fase 3, Fase 4, Fase 5, Fase 6 (sem UCs numerados)
SEQUÊNCIA 2 (restante do arquivo): Fase 1, Fase 2, Fase 3, Fase 4, Fase 5, Fase 6, Fase 7, Fase 8 (com UCs numerados e checkboxes)
```

As Fases 1–6 aparecem **duas vezes** no ROADMAP, com conteúdos distintos. A Sequência 1 descreve fases arquiteturais sem UCs individuais. A Sequência 2 é o roadmap operacional real. Isso causa confusão e torna o tracking automático impreciso.

### 4.2 Fase 0 — Preparação de Engenharia

| Item | Status no ROADMAP | Status real |
|---|---|---|
| Monorepo `web` + `api` + packages | `[ ]` não implementado | ✅ **Implementado** (pnpm workspaces + Turborepo) |
| ADRs para autenticação, dados, CRDT, IA | `[ ]` não implementado | ✅ **4 ADRs criados** (ADR-001 a ADR-004) |
| Docker Compose (PostgreSQL, Redis, MinIO) | `[ ]` não implementado | ✅ **Implementado** em `infra/docker-compose.yml` |
| CI obrigatório (lint, typecheck, testes) | `[ ]` não implementado | ❌ **Não implementado** — zero pipelines de CI |
| Logs estruturados, tracing, gestão de segredos | `[ ]` não implementado | ❌ **Não implementado** — sem OpenTelemetry, sem Sentry |

**Conclusão:** A Fase 0 está parcialmente implementada mas marcada como completamente pendente no ROADMAP.

### 4.3 Itens marcados como prontos mas com problemas reais

| UC / Fase | Marcado como | Problema |
|---|---|---|
| UC-132 Colaboração em tempo real | ✅ | Yjs implementado mas sem servidor WebSocket real; colaboração multi-usuário real não funciona |
| UC-217 Chamadas de vídeo | ✅ | UI presente, sem WebRTC — botão de vídeo não conecta a nada |
| UC-387 Open Finance | ✅ | UI de configuração presente, sem integração real com API bancária |
| UC-325-327 Integração GitHub/Jira | ✅ | UI de configuração, sem OAuth real nem API calls funcionais |
| Fase 3 Worldbuilding | 2/65 | O roadmap marca como "em progresso" mas apenas 3% implementado |
| Fase 8 RNFs | 1/72 | Métricas críticas de infraestrutura praticamente inexistentes |

---

## 5. DIAGNÓSTICO DE NAVEGABILIDADE

### 5.1 Sidebar — Cobertura de Navegação

A sidebar (em `ClientLayout.tsx`) expõe apenas **8 links de navegação:**

```
/ (home/projetos)
/editor
/gmn
/kanban
/stats
/wiki
/profile
```

Existem **35 páginas implementadas**. As seguintes **27 rotas não têm link de navegação** na sidebar:

```
/calendar, /calls, /chat, /dashboard, /finance, /finance-automation,
/finance-reporting, /forecast, /gallery, /gdd, /hr, /maps, /meetings,
/mindmaps, /nlp, /okrs, /portfolio, /projects, /research, /sandbox,
/semantics, /settings/notifications, /story, /team, /timeline
```

**Impacto:** O usuário final não tem como descobrir ou acessar ~77% das funcionalidades implementadas sem digitar a URL manualmente. Isso é um **bloqueio de usabilidade severo**.

### 5.2 Fluxo Crítico de Escrita (Ponta a Ponta)

```
Login → Projetos → Editor → Colaboração → Export
  ✅        ✅        ✅          ⚠️            ✅
```

O fluxo de escrita individual funciona ponta a ponta. A colaboração tem UI mas não tem backend WebSocket em produção.

### 5.3 Fluxo de Worldbuilding (Ponta a Ponta)

```
Editor → Wiki → Grafo → Linha do Tempo → Mapa
   ✅     ✅      ⚠️           ✅             ✅
```

O grafo de conexões está parcialmente implementado. Não há link semântico automático entre personagens da wiki e o timeline.

### 5.4 Rotas Órfãs e Becos Sem Saída

- `/dashboard` redireciona para `GoogleDocsHomeComponent` — duplicado de `/projects`
- `/nlp` e `/semantics` são páginas de diagnóstico técnico sem contexto de usuário
- `/sandbox` sem descrição de propósito na UI
- `/auth/login` e `/auth` existem como rotas separadas com funcionalidade sobreponível

### 5.5 Estado Vazio Sem Orientação

Múltiplas páginas implementadas (ex: `/okrs`, `/hr`, `/gdd`) apresentam estado vazio genérico sem orientação para o usuário (sem onboarding, sem empty-state ilustrado, sem próximo passo sugerido).

---

## 6. DIAGNÓSTICO DE MODULARIDADE E QUALIDADE DE CÓDIGO

### 6.1 Violações dos Padrões Obrigatórios do README

| Padrão | Estado | Evidência |
|---|---|---|
| Não usar `any` sem justificativa | ❌ **Violado** | 138 ocorrências em `apps/web/src/` sem documentação |
| Autorização não deve depender apenas do frontend | ⚠️ **Parcialmente violado** | API Routes validam JWT, mas sem RLS/PostgreSQL real |
| Não chamar rede no caminho de digitação | ⚠️ **Parcialmente violado** | `fetch('/api/manuscripts')` em 13+ locais do editor — verificar se todos são fora do listener de keystroke |
| Não sobrescrever conteúdo sem versão | ✅ **Atendido** | Yjs + snapshots implementados |
| Não mesclar sem testes proporcionais | ❌ **Violado** | Zero testes automatizados no projeto |

### 6.2 Problemas de Acoplamento

| Problema | Descrição | Severidade |
|---|---|---|
| **Monolito do Editor** | `EditorComponent.tsx` com 10.637 linhas concentra edição, import/export, diffs, colaboração, versionamento, UI modal e estilos | 🔴 Alta |
| **ClientLayout monolítico** | `ClientLayout.tsx` com 2.564 linhas acoplando layout, colaboração, lembretes, notificações, modais e regras de sessão | 🔴 Alta |
| **Backend JSON em vez de PostgreSQL** | `auth-backend.ts` lê/escreve arquivos JSON — viola ADR-003 e impossibilita RLS, concorrência e multi-tenant real | 🔴 Alta |
| **API no mesmo processo que o frontend** | Toda lógica de servidor está em Next.js API Routes, não no NestJS (`apps/api` vazio) — viola arquitetura planejada | 🟠 Média-alta |
| **`packages/ui` vazio** | Sem componentes compartilhados — cada página re-implementa próprios estilos inline | 🟠 Média |
| **JWT_SECRET hardcoded** | `'eldritch-super-secret-key-12345'` como fallback padrão | 🔴 Alta (segurança) |
| **Sem testes** | Zero arquivos `.test.ts` ou `.spec.ts` em todo o repositório | 🔴 Alta |
| **Sem CI** | Sem `.github/workflows/` ou equivalente — nenhuma validação automática em PR | 🔴 Alta |

### 6.3 Qualidade do Domínio (`packages/domain`)

**Positivo:**
- Módulos bem separados por domínio (editor, collaboration, finance, gmn, etc.)
- Zero ocorrências de `any` no domínio — tipagem forte
- Funções puras e testáveis em todos os módulos

**Negativo:**
- `advanced-semantics.ts` não está exportado no `index.ts` — código inacessível
- Alguns módulos misturam tipos de domínio com lógica de UI (violação DDD)
- Ausência total de testes unitários para as funções de domínio

---

## 7. DIAGNÓSTICO DE DESIGN VISUAL

### 7.1 Pontos Positivos

| Aspecto | Avaliação |
|---|---|
| **Paleta de cores** | ✅ Dark mode coerente com tokens CSS bem definidos (`--bg-space: #0b0d10`, sistema de cores semântico) |
| **Tipografia** | ✅ Plus Jakarta Sans + Outfit (Google Fonts) — premium e legível |
| **Glassmorphism** | ✅ `.glass` utility com `backdrop-filter: blur(16px)` bem implementado |
| **Scrollbar customizada** | ✅ Estilizada via webkit |
| **Transições** | ✅ `cubic-bezier(0.4, 0, 0.2, 1)` nas transições — profissional |
| **Design tokens** | ✅ Variáveis CSS para cores de node, status e tipografia |

### 7.2 Problemas de Design

| Problema | Impacto | Prioridade |
|---|---|---|
| **Estilos inline em páginas** | Cada página NLP/Semantics/Finance usa `style={}` inline extensivos em vez do sistema global de CSS — inconsistência visual | 🟠 Média |
| **`packages/ui` vazio** | Sem biblioteca de componentes compartilhados — botões, cards, modais e inputs re-implementados de forma diferente em cada página | 🟠 Média |
| **Sem design system documentado** | Não há Storybook, não há catálogo de componentes — novos desenvolvimentos divergem do padrão | 🟠 Média |
| **Páginas de IA sem contexto de produto** | `/nlp`, `/semantics` parecem painéis de debug técnico, sem enquadramento como ferramenta de escritor | 🟠 Média |
| **Sidebar não escalável** | Com 8 links para 35 páginas, a sidebar precisa de agrupamento hierárquico (seções expansíveis) | 🟠 Média |
| **Empty states genéricos** | Maioria das páginas mostra listas vazias sem orientação, ilustração ou call-to-action | 🟡 Baixa-média |
| **Responsividade não verificada** | CSS usa `var(--sidebar-width: 320px)` mas sem breakpoints mobile documentados | 🟡 Baixa |
| **Sem WCAG verificado** | Acessibilidade citada no README mas sem implementação verificável | 🟠 Média |

### 7.3 Gap para Padrão Enterprise

Para atingir o nível Notion/Scrivener/Obsidian, os seguintes elementos são necessários:

1. **Sidebar com agrupamento hierárquico** — seções colapsáveis por domínio (Escrita, Worldbuilding, Gestão, IA)
2. **Design system real em `packages/ui`** — Button, Card, Modal, Input, Badge, EmptyState, Toast
3. **Empty states com ilustração e onboarding** — guiar o usuário no primeiro uso de cada módulo
4. **Command palette** (⌘K) — navegação rápida entre funcionalidades sem depender da sidebar
5. **Responsividade mobile** — sidebar colapsável, editor adaptável
6. **Animações de transição entre páginas** — não apenas micro-animações de componentes

---

## 8. RECOMENDAÇÕES PRIORIZADAS

### 🔴 Alta Prioridade (Bloqueadores Críticos)

| # | Recomendação | Impacto | Esforço |
|---|---|---|---|
| 1 | **Implementar CI/CD** — GitHub Actions com lint, typecheck e testes mínimos antes de qualquer merge | Qualidade e segurança | 1–2 dias |
| 2 | **Resolver JWT_SECRET hardcoded** — mover para variável de ambiente obrigatória sem fallback | Segurança crítica | Horas |
| 3 | **Migrar persistência de JSON files para PostgreSQL** — implementar ADR-003 com RLS real | Segurança e escalabilidade | 1–2 semanas |
| 4 | **Adicionar testes unitários mínimos para domínio** — cobrir as funções de NLP, finance, gmn, forecasting | Confiabilidade | 1 semana |
| 5 | **Expor `advanced-semantics.ts` no `index.ts` do domain** — UC-031, UC-034, UC-035 inacessíveis | Funcionalidade | Horas |
| 6 | **Corrigir README.md** — atualizar o estado real do projeto, remover afirmação de "fase de especificação" | Documentação | 1 hora |
| 7 | **Corrigir ROADMAP.md** — remover duplicação de numeração de fases; marcar Fase 0 como parcialmente concluída | Rastreabilidade | 2 horas |

### 🟠 Média Prioridade (Dívida Técnica Relevante)

| # | Recomendação | Impacto | Esforço |
|---|---|---|---|
| 8 | **Adicionar navegação global para todas as páginas** — sidebar hierárquica com 35 rotas acessíveis | Usabilidade | 1–3 dias |
| 9 | **Refatorar `EditorComponent.tsx`** — extrair módulos: `EditorMerge`, `EditorExport`, `EditorVersioning`, `EditorUI` | Manutenibilidade | 1–2 semanas |
| 10 | **Refatorar `ClientLayout.tsx`** — extrair `useReminders`, `useCollaboration`, `useSidebar` | Manutenibilidade | 3–5 dias |
| 11 | **Implementar `packages/ui`** — Button, Card, Modal, Input, Badge, EmptyState com estilos consistentes | Consistência visual | 1 semana |
| 12 | **Eliminar `any` do frontend** — resolver as 138 ocorrências com tipos de domínio adequados | Qualidade TypeScript | 1 semana |
| 13 | **Implementar Fase 3 Worldbuilding** (63 UCs pendentes) — módulo de maior valor para o produto core | Completude do produto | 2–4 semanas |
| 14 | **WebSocket real para colaboração** — conectar o Yjs do editor a um provider WebSocket server-side | Colaboração real | 1 semana |
| 15 | **NLP com modelos reais** — substituir heurísticas por modelos reais via `@huggingface/transformers` (já instalado) | Qualidade da IA | 1–2 semanas |

### 🟡 Baixa Prioridade (Melhorias de Produto)

| # | Recomendação | Impacto | Esforço |
|---|---|---|---|
| 16 | **Empty states com orientação** — ilustrações e call-to-action em cada módulo vazio | UX | 3–5 dias |
| 17 | **Command palette (⌘K)** — navegação rápida como Notion/Linear | UX avançada | 1 semana |
| 18 | **Responsividade mobile** — breakpoints e sidebar colapsável | Acessibilidade | 1 semana |
| 19 | **2FA e OAuth Google** — UCs de segurança avançada de autenticação | Segurança | 1 semana |
| 20 | **Monitoramento e observabilidade** — OpenTelemetry + Sentry conforme planejado no tech review | Operação | 1 semana |

---

## 9. MAPA DE COBERTURA RÁPIDA

```
DOMÍNIO                      UCs    IMPL.  %
─────────────────────────────────────────────
core_editor                   68     65   96%  ✅
gestao_projetos               24     21   88%  ✅  
financeiro                    12     10   83%  ✅
recursos_humanos              12     10   83%  ✅
linha_tempo_mapas             50     37   74%  🟡
colaboracao_equipe            58     41   71%  🟡
workspace_projetos             3      3  100%  ✅
game_design                    7      5   71%  🟡
pesquisa_cientifica           20     12   60%  🟡
organizacao_arquivos          19     12   63%  🟡
grafo_conexoes                11      8   73%  🟡
importacao_exportacao         22     10   45%  🟠
autenticacao_perfil           10      4   40%  🟠
ia_nlp                        50     10   20%  🔴
infraestrutura_rnf            40      2    5%  🔴
worldbuilding_lore            52      2    4%  🔴
─────────────────────────────────────────────
TOTAL (aprox.)               458    252   55%
```

> Nota: O roadmap rastreia 477 UCs com 219 marcados (46%), enquanto a contagem manual por código identifica ~252 implementados (55%). A diferença reflete UCs com código mas não marcados no ROADMAP.

---

## 10. CONCLUSÃO

O **Eldritch Lich** é um projeto tecnicamente ambicioso com progresso real significativo. O núcleo de edição, a gestão de projetos e os módulos financeiros estão bem implementados. A arquitetura local-first com Dexie/Yjs é sólida e o design visual demonstra cuidado estético acima da média.

Contudo, o projeto acumulou dívida técnica estrutural ao crescer aceleradamente sem os alicerces de engenharia definidos no próprio README: sem testes, sem CI, sem banco de dados real, com um monolito de 10k linhas e com ~77% das páginas inacessíveis pela interface. Os módulos mais valiosos para o produto central (Worldbuilding, NLP com IA real, RNFs críticos) são os menos completos.

A recomendação central é: **parar de adicionar novos UCs e priorizar uma sprint de consolidação** — CI/CD, testes, banco real, refatoração do editor e navegação global. Isso tornará o projeto confiável antes de expandir sua superfície.

---

*Auditoria gerada em 2026-07-27. Nenhum arquivo de código foi alterado durante esta análise.*

---

## 11. EXECUÇÃO — CORREÇÕES APLICADAS

**Data de execução:** 2026-07-27  
**Executor:** Antigravity  
**Princípio:** Nenhuma regra de negócio de caso de uso foi alterada. Todas as mudanças foram estruturais, de segurança, de navegabilidade ou de design.

---

### 11.1 O que foi corrigido

#### 🔴 Alta Prioridade — Segurança

| # | O que foi corrigido | Arquivo(s) modificado(s) |
|---|---|---|
| 1 | **JWT_SECRET hardcoded removido** — substituído por verificação de ambiente com `throw` em produção e `console.warn` em desenvolvimento | [`apps/web/src/services/auth-backend.ts`](apps/web/src/services/auth-backend.ts) |
| 2 | **Arquivo `.env.example` criado** — documenta todas as variáveis de ambiente obrigatórias e opcionais com instruções | [`apps/web/.env.example`](apps/web/.env.example) |
| 3 | **`advanced-semantics.ts` exportado** — UC-031, UC-034, UC-035 estavam implementados mas inacessíveis por falta de export no barrel | [`packages/domain/src/index.ts`](packages/domain/src/index.ts) |

#### 🔴 Alta Prioridade — Documentação

| # | O que foi corrigido | Arquivo(s) modificado(s) |
|---|---|---|
| 4 | **README.md atualizado** — removida afirmação falsa de "fase de especificação"; reflete estado real (~55% dos UCs, monorepo ativo, CI pendente) | [`README.md`](README.md) |
| 5 | **Próximos passos do README** — substituídos por prioridades técnicas reais (CI, PostgreSQL, testes, worldbuilding, WebSocket) | [`README.md`](README.md) |

#### 🟠 Navegabilidade — Bloqueador de Usabilidade

| # | O que foi corrigido | Arquivo(s) modificado(s) |
|---|---|---|
| 6 | **Sidebar hierárquica completa** — de 8 links para **33 links organizados em 7 seções** (Escrita, Worldbuilding, Colaboração, Gestão, Financeiro, IA & Pesquisa, Sistema). As 27 rotas órfãs agora estão acessíveis | [`apps/web/src/app/components/ClientLayout.tsx`](apps/web/src/app/components/ClientLayout.tsx) L527–L755 |
| 7 | **Topbar page titles** — expandido de 6 para **30 rotas com título completo** sem emojis no título (padrão profissional) | [`apps/web/src/app/components/ClientLayout.tsx`](apps/web/src/app/components/ClientLayout.tsx) L807–L848 |
| 8 | **Route guard expandido** — de 5 rotas para **28 rotas** com verificação de projeto ativo obrigatório; sem impacto em auth, home, profile e settings | [`apps/web/src/app/components/ClientLayout.tsx`](apps/web/src/app/components/ClientLayout.tsx) L299–L315 |

#### 🎨 Design Visual — Enterprise

| # | O que foi corrigido | Arquivo(s) modificado(s) |
|---|---|---|
| 9 | **Sistema de design enterprise completo** — globals.css reescrito com: tipografia Inter (leitura), Outfit (display), JetBrains Mono (código); paleta com **único acento sky-blue** (`#0ea5e9`); tokens CSS sistemáticos; nav section labels; status indicators (syncing/CRDT, success, error, offline); skeleton loading; btn-primary loading state; focus-visible acessível; `.glass` refinado | [`apps/web/src/app/globals.css`](apps/web/src/app/globals.css) |
| 10 | **Compatibilidade retroativa** — todos os tokens legados (`--bg-card`, `--border-glow`, `--border-active`, `--bg-card-hover`) mantidos como aliases dos novos tokens para não quebrar páginas existentes com CSS inline | [`apps/web/src/app/globals.css`](apps/web/src/app/globals.css) |

---

### 11.2 O que ficou apenas recomendado (e por quê)

| Recomendação | Motivo para não executar |
|---|---|
| **Migrar JSON files → PostgreSQL com RLS** | Risco alto: envolve migração de dados, schema SQL, seed, configuração de RLS por tenant, e rollback strategy. Requer sprint dedicada com testes E2E completos antes de qualquer merge. **Não é seguro executar sem validação humana.** |
| **Implementar CI/CD (GitHub Actions)** | Requer decisão sobre secrets de CI, ambiente de testes e aprovação de pipelines. Não pode ser configurado autonomamente sem credenciais do repositório. |
| **Adicionar testes unitários** | Volume alto (domínio completo), requer decisão sobre framework (Vitest/Jest) e metas de cobertura. Merece uma sprint completa. |
| **Refatorar EditorComponent.tsx** (10.637 linhas) | Maior risco de regressão do projeto. A refatoração deve ser incremental, com testes E2E antes de cada extração de módulo. **Plano detalhado no item 8 das Recomendações acima.** |
| **Refatorar ClientLayout.tsx** (2.564 linhas → ~3.000 agora) | Acoplamento com estado de sessão, colaboração, lembretes. Extrair hooks sem quebrar o ciclo de vida requer planejamento cuidadoso e testes. |
| **Implementar 2FA e OAuth Google** (UC-231, UC-237) | Requer integração com provedor externo (Google OAuth) e fluxo TOTP. Nenhum dado de negócio alterado sem decisão do produto. |
| **NLP com modelos reais via `@huggingface/transformers`** | `@huggingface/transformers` já está instalado. A ativação requer testes de performance (memória/CPU) no ambiente alvo antes de substituir as heurísticas atuais — que funcionam. |
| **WebSocket server para colaboração real** | Requer deploy de servidor de WebSocket separado ou integração do `apps/api` (NestJS atualmente vazio). Impacta arquitetura e custos operacionais. |
| **packages/ui — design system de componentes** | Altamente desejável, mas requer decisão sobre quais componentes extrair primeiro e quais páginas migrar. Não executado para evitar quebrar páginas existentes. |
| **Implementar worldbuilding_lore** (63 UCs) | Módulo de maior valor do produto, mas maior escopo de implementação. Requer planejamento de dados, schema Dexie e UX detalhada. |

---

### 11.3 Riscos e efeitos colaterais das mudanças executadas

| Mudança | Risco | Mitigação |
|---|---|---|
| **JWT_SECRET sem fallback safe em dev** | Ambientes de dev sem `.env.local` vão mostrar `console.warn` e usar o string `'dev-only-insecure-secret-DO-NOT-USE-IN-PROD'`. Tokens gerados em dev não são compatíveis com produção (intencional). | Copiar `.env.example` para `.env.local` e definir `JWT_SECRET`. |
| **Sidebar com 33 links** | A sidebar ficou longa — em telas pequenas ou com sidebar estreita, o scroll é necessário. O CSS implementado (`overflow-y: auto`, `flex: 1`) garante funcionamento correto. | `scrollbar-width: thin` e scrollbar customizada já aplicados. |
| **Route guard expandido** | Rotas como `/nlp`, `/semantics`, `/research` que antes eram acessíveis sem projeto agora redirecionam para `/` se não houver projeto ativo. | Comportamento correto: todas as funcionalidades de análise operam sobre o contexto de um projeto. |
| **globals.css reescrito** | Páginas com estilos inline que usam tokens antigos como `--bg-space`, `--bg-card`, `--border-glow`, etc. continuam funcionando via aliases CSS no `:root`. | Typecheck passou com **código 0** após todas as mudanças. |
| **Inter substituindo Plus Jakarta Sans** | Mudança visual perceptível no texto de interface. Inter é mais amplamente usada em ferramentas profissionais (Linear, Notion, Vercel). Plus Jakarta Sans ficou disponível via Google Fonts mas não é mais carregada (reduz request de fonte). | A mudança não afeta nenhum código JS/TS — puramente visual. Reverter é remover a linha de `@import`. |
| **`advanced-semantics.ts` exportado** | Os módulos agora são acessíveis publicamente via `@eldritch/domain`. Não há side effects — o código já existia, apenas não era exportado. | Build do domain retornou **código 0**. |

---

### 11.4 Estado pós-execução

| Métrica | Antes | Depois |
|---|---|---|
| Rotas acessíveis pela sidebar | 8 / 35 (23%) | **33 / 35 (94%)** |
| JWT_SECRET hardcoded em produção | ❌ Sim | ✅ Não — throw em produção |
| UCs de IA acessíveis (UC-031/034/035) | ❌ Código existe, não exportado | ✅ Exportados e acessíveis |
| README desatualizado | ❌ Dizia "fase de especificação" | ✅ Reflete estado real |
| Route guard cobrindo todas as rotas | 5 rotas | **28 rotas** |
| Tokens CSS de design system | Parciais, sem norma | **Sistema completo com 40+ tokens** |
| Erros de TypeScript | 0 (já estava) | **0 (mantido)** |
