# Correction Roadmap — Eldritch Lich

> **Gerado em:** 2026-07-29 | **Base:** Auditoria de 457 UCs em 17 módulos  
> **Cobertura atual:** 271 ✅ implementados · 85 ⚠️ parciais · 97 ❌ ausentes · 4 🔵 scaffold

---

## Convenções

| Prioridade | Critério |
|-----------|----------|
| 🔴 P1 — Crítico | Funcionalidade central prometida ou bloqueante de outros UCs |
| 🟠 P2 — Alto | Funcionalidade importante para usuários ativos |
| 🟡 P3 — Médio | Melhoria de UX ou completar domínio já modelado |
| 🟢 P4 — Baixo | Integrações externas e infra avançada |

| Status | Significado |
|--------|-------------|
| ❌ | Precisa ser criado do zero |
| ⚠️ | Existe código base — só completar/integrar |

---

## FASE 1 — Fundamentos Críticos (P1 🔴)

### 1.1 — Autenticação Avançada (módulo: `autenticacao_perfil`)

#### ⚠️ UC-231 — Autenticação em Dois Fatores (2FA / TOTP)
**Implementado:**
- APIs `POST /api/auth/2fa/setup`, `/verify` e `/disable`, com TOTP RFC 6238 de seis dígitos
- Segredo cifrado em AES-256-GCM no armazenamento local; jamais exposto por perfil ou sessão
- Perfil: seção Segurança para configurar, confirmar e desabilitar por senha
- Login: cookie temporário de cinco minutos; a sessão regular somente é emitida após o segundo fator

**Ainda falta:**
- QR Code local de provisionamento: a chave e o URI `otpauth://` já são gerados, mas a tela oferece somente cadastro manual enquanto a dependência de geração de QR não estiver disponível no monorepo

#### ❌ UC-232 — Login com Chave Física (WebAuthn / FIDO2)
**O que falta:**
- Dependências: `@simplewebauthn/browser` + `@simplewebauthn/server`
- API `POST /api/auth/webauthn/register` — geração de challenge + salvar credencial
- API `POST /api/auth/webauthn/authenticate` — verificar asserção
- UI: botão "Adicionar chave de segurança" no perfil

#### ✅ UC-233 — Histórico de Sessões Ativas
**Implementado:**
- Persistência local de sessões com usuário, dispositivo, IP, criação, último acesso e revogação
- API `GET /api/auth/sessions` e cards de sessões ativas na aba Segurança do perfil
- Cada token novo contém um identificador de sessão (`sid`) validado no servidor

#### ✅ UC-234 — Revogar Sessão Remota
**Implementado:**
- API `DELETE /api/auth/sessions/:id` marca a sessão como revogada, sem permitir encerrar acidentalmente a sessão atual
- Botão "Encerrar sessão" por dispositivo; tokens com `sid` revogado deixam de ser válidos no backend

#### ⚠️ UC-236 — Excluir Conta (LGPD / GDPR)
**Implementado:**
- API `DELETE /api/auth/account` com confirmação de e-mail, senha e exportação prévia obrigatória na interface
- Expurgo físico dos registros backend pertencentes à conta: usuário, tokens de recuperação, sessões, projetos próprios, manuscritos, pastas e colaborações
- Log append-only de consentimento registra a conclusão sem reter o identificador da conta (`DELETED`)

**Ainda falta:**
- Namespace de IndexedDB por usuário e rotina de limpeza local direcionada; o nome atual do banco é por projeto e uma remoção global poderia apagar dados offline de outra conta no mesmo navegador

#### ❌ UC-237 — Login Social (Google / GitHub)
**O que falta:**
- Dependência: `next-auth` com providers Google + GitHub
- API `GET /api/auth/[...nextauth]` — callback OAuth2
- UI: botões "Entrar com Google" e "Entrar com GitHub" em `app/auth/page.tsx`
- Migração: vincular conta social a conta existente por e-mail

#### ⚠️ UC-238 — Portabilidade de Dados (LGPD)
**Implementado:**
- API `GET /api/auth/export` e botão no perfil para baixar JSON consolidado de usuário, projetos, textos, pastas e colaborações

**Ainda falta:**
- Empacotamento ZIP de mídias e confirmação por e-mail antes da emissão

---

### 1.2 — Colaboração em Tempo Real (módulo: `colaboracao_equipe`)

#### ❌ UC-132 — Edição Colaborativa em Tempo Real
**O que falta:**
- Servidor WebSocket (ex: `ws` no Next.js custom server ou Liveblocks/Partykit como SaaS)
- Integração Yjs + `y-websocket` no editor Tiptap existente
- Provider: `new WebsocketProvider(wsUrl, roomId, ydoc)` no `EditorComponent.tsx`
- Awareness: broadcast de cursor e seleção entre clientes
- Merge automático via CRDT (sem conflito)

#### ❌ UC-213 — Cursores Remotos de Coautores
**O que falta:**
- Depende da infra Yjs do UC-132
- `y-tiptap` awareness extensions para renderizar cursores coloridos por usuário
- Badge com nome do usuário flutuando acima do cursor

#### ✅ UC-205 — Permissão de Escrita por Pasta
**Implementado:**
- Campo `writePermission: 'all' | 'owner' | 'editors'` na entidade `Folder`, com padrão compatível `all`
- Seletor na árvore de pastas, exclusivo do proprietário do projeto
- Editor bloqueia localmente manuscritos de pasta configurada como `owner` para colaboradores
- API de manuscritos aplica o mesmo guard no servidor; leitores permanecem bloqueados pelo papel do projeto e só o proprietário altera a política da pasta

#### ✅ UC-373 — Canais de Anúncio (só admins postam)
**Implementado:**
- Tipo `chat | announcement` no canal e badge 📣/ANÚNCIO na interface
- APIs autenticadas para criação de canal e postagem de mensagem
- API bloqueia postagens em anúncios para qualquer pessoa sem papel de proprietário ou administrador

#### ✅ UC-374 — Chat Integrado com Tarefas (tags #TASK-ID)
**Implementado:**
- Comando `/todo Descrição` cria uma meta Kanban e publica referência `#TASK-…`
- Referências são chips navegáveis para `/kanban?task=…`
- Kanban rola e foca o card solicitado pelo identificador

#### ⚠️ UC-375 — Notificações de Movimentação de Tarefas no Chat
**Implementado:**
- Movimento de cartão no Kanban publica mensagem automática no canal Geral (ou primeiro canal de conversa) do projeto
- Mensagem recebe identificação visual "Sistema"

**Ainda falta:**
- Publicador de sistema exclusivamente server-side; no armazenamento atual o evento é disparado pelo cliente autenticado

---

### 1.3 — IA e NLP — Camada de Contradições (módulo: `ia_nlp`)

#### ⚠️ UC-046 — Detectar Contradições no Texto (intra-capítulo)
**Implementado:**
- Detector local em janela limitada de sentenças para contradições por negação e termos factuais repetidos
- Painel de alertas no NLP, com premissa, hipótese, explicação e confiança

**Ainda falta:**
- Modelo NLI local para inferências sem regra explícita e ação de ignorar alertas

#### ⚠️ UC-047 — Contradições entre Pastas
**Implementado:**
- Comparação local entre manuscritos do projeto ativo no painel NLP, identificando os dois títulos envolvidos

**Ainda falta:**
- Filtro por pasta e modelo NLI para ampliar a cobertura semântica

#### ⚠️ UC-050 — Contradições entre Locais
**Implementado:**
- Extrator local de declarações de localização e alerta quando a mesma entidade recebe locais distintos

**Ainda falta:**
- Comparação cruzada com fichas de locais do worldbuilding

#### ⚠️ UC-051 — Contradições entre Eventos
**Implementado:**
- Painel NLP valida a ordenação causal declarada na timeline e exibe eventos anteriores aos próprios precursores

**Ainda falta:**
- Extrair menções de eventos e datas diretamente dos manuscritos

#### ⚠️ UC-073 — Mostrar Inconsistências antes de Salvar
**Implementado:**
- Autosave executa verificação local com debounce curto e alerta não bloqueante apontando para o painel NLP

**Ainda falta:**
- Modelo NLI quantizado e sublinhado contextual no TipTap

#### ⚠️ UC-106 — QA do Universo (responder perguntas sobre o lore)
**Implementado:**
- Consulta local por termos nos manuscritos do projeto ativo, retornando trechos e citações de capítulo

**Ainda falta:**
- Busca vetorial/BM25 combinada, chunking e resposta sumarizada por SLM local

---

## FASE 2 — Alta Prioridade (P2 🟠)

### 2.1 — Editor Core — Funcionalidades Faltantes (módulo: `core_editor`)

#### ✅ UC-112 — Painel de Backlinks
**Implementado:**
- Aba Backlinks no painel direito do editor
- Consulta local por `[[título do capítulo atual]]`, excluindo o capítulo atual
- Lista clicável que seleciona o capítulo de origem

#### ⚠️ UC-246 a UC-250 — Sumário Interativo (TOC)
**Implementado:**
- Aba Sumário no painel direito, lendo H1/H2/H3 do DOM do TipTap em tempo real
- Navegação por clique e busca de headings

**Ainda falta:**
- Drag-and-drop para reordenar blocos e favoritos/ocultos persistentes

#### ❌ UC-269 — Imagens em Fichas de Entidades (pelo editor)
**O que falta:**
- No painel de detalhes de entidade (popup/sidebar ao clicar `[[link]]`), adicionar zona de drop de imagem
- Vincular à propriedade `illustrationUrl` já existente no domínio

#### ✅ UC-295 — Foto de Perfil de Personagem
**Concluído em 2026-08-06:**
- A ficha aceita imagem local de até 5 MB, armazena como data URL em `avatarUrl` e mostra prévia e avatar no cartão do personagem.

### 2.2 — Worldbuilding — Filtros e Multiselects Faltantes (módulo: `worldbuilding_lore`)

#### ✅ UC-255 — Filtrar Árvore de Tecnologias por Personagem
**Concluído em 2026-08-06:**
- Nós de magia/tecnologia agora persistem os personagens relacionados em `masterCharacterIds`.
- A aba oferece dropdown de personagem e filtra a árvore pelos vínculos cadastrados.

#### ✅ UC-256 — Filtrar Árvore de Tecnologias por Facção
**Concluído em 2026-08-06:**
- Nós de magia/tecnologia agora persistem as facções relacionadas em `factionIds`.
- A mesma aba permite combinar o filtro de facção ao filtro de personagem.

#### ✅ UC-289 — Multiselect de Personagens em Eventos Históricos
**Concluído em 2026-08-06:**
- O formulário de eventos lista os personagens do projeto em seleção múltipla e persiste `participatingCharacterIds`.
- Os participantes são exibidos no cartão do evento.

#### ✅ UC-291 — Multiselect de Facções em Eventos Históricos
**Concluído em 2026-08-06:**
- O formulário de eventos lista as facções do projeto em seleção múltipla e persiste `participatingFactionIds`.
- As facções participantes são exibidas no cartão do evento.

#### ✅ UC-280 — Upload de Imagem para Criaturas
**Concluído em 2026-08-06:**
- A ficha aceita imagem local de até 5 MB, armazena-a como data URL em `illustrationUrl` e mostra prévia e imagem no card.

#### ✅ UC-287 — Upload de Imagem para Itens
**Concluído em 2026-08-06:**
- Itens usam o mesmo fluxo local de validação, prévia e persistência em `illustrationUrl`.

#### ✅ UC-258 — Seletor de Devoção (Personagem → Religião)
**Concluído em 2026-08-06:**
- A ficha de personagem permite selecionar múltiplas religiões e atribuir intensidade individual: devoto, seguidor ou ateu.
- Os vínculos são persistidos em `religiousDevotions`; apenas devotos e seguidores entram automaticamente na lista de crentes da religião.

#### ✅ UC-259 — Marcadores de Locais Sagrados no Mapa
**Concluído em 2026-08-06:**
- Religiões permitem selecionar múltiplos locais sagrados.
- O mapa permite vincular marcadores a locais cadastrados e os exibe com ícone de templo quando forem sagrados para qualquer religião.

### 2.3 — Grafo — Backlinks e Filtros (módulo: `grafo_conexoes`)

#### ✅ UC-043 — Conexão Manual entre Palavras/Pastas
**Concluído em 2026-08-06:**
- O toolbar do GMN agora abre “Nova conexão”, com origem, destino e rótulo livre para as metas do grafo.
- A criação continua usando a validação de DAG já existente, bloqueia duplicatas e mostra o rótulo da relação na aresta.

#### ❌ UC-112 — Backlinks (duplicado c/ core_editor, implementar uma vez)
Coberto pela implementação do UC-112 no editor.

### 2.4 — Linha do Tempo — Exportação e Mesclagem (módulo: `linha_tempo_mapas`)

#### ✅ UC-263 — Mesclar Ramos Alternativos de Timeline
**Concluído em 2026-08-06:**
- Linhas derivadas exibem “Mesclar na principal”.
- Eventos idênticos são ignorados; conflitos por data e personagem exigem escolher manter o original ou aplicar a alternativa.
- Eventos exclusivos e precursores resolvidos são gravados na timeline-pai, preservando a ordem causal disponível.

#### ✅ UC-265 — Mapas Aninhados (Hierarquia)
**Concluído em 2026-08-06:**
- `GeoMap.parentMapId` permite modelar mapas raiz e submapas.
- A cartografia permite criar submapa a partir do mapa ativo e apresenta breadcrumb navegável.

#### ✅ UC-266 — Navegar entre Mapas (duplo clique)
**Concluído em 2026-08-06:**
- Submapas do mapa ativo são exibidos como atalhos e podem ser abertos por duplo clique (ou clique, para acessibilidade).
- Cada nível do breadcrumb permite retornar a qualquer mapa-pai.

#### ✅ UC-171 — Exportar Cronologia como PDF/PNG
**Concluído em 2026-08-06:**
- A exportação gera PNG localmente por Canvas API, contendo os eventos visíveis da cronologia.
- A opção de impressão abre um documento sanitizado e pronto para “Salvar como PDF”, sem serviço ou biblioteca externa.

### 2.5 — Organização — Sumário e Duplicação de Projeto

#### ✅ UC-119 — Duplicar Projeto Completo
**Concluído em 2026-08-06:**
- Cada cartão de projeto oferece “Duplicar Projeto”, que cria o destino sem alterar o projeto ativo.
- O clonador percorre as tabelas locais do projeto (manuscritos, pastas, lore, timeline, mapas, galeria e configurações), executa cópia transacional e remapeia IDs e referências cruzadas.
- A nova base usa o novo `projectId`; atalhos globais de teclado não são copiados deliberadamente.

### 2.6 — Galeria e Importação

#### ✅ UC-275 — Exportar Galeria como ZIP
**Concluído em 2026-08-06:**
- A galeria oferece “Exportar tudo (ZIP)” e inclui todos os assets locais.
- O ZIP é criado em modo store no navegador, com CRC-32 e diretório central compatíveis, sem dependência externa.

#### ❌ UC-087/UC-088 — OCR em Imagens
**O que falta:**
- Integrar `tesseract.js` (client-side WASM)
- Botão "Extrair texto" em `gallery/page.tsx` e no paste handler do editor
- Resultado inserido como texto abaixo da imagem no editor

#### ✅ UC-400 — Exportar Roteiro (Fountain)
**Concluído em 2026-08-06:**
- O editor oferece o formato Fountain e o exportador produz arquivo `.fountain` sem biblioteca externa.
- H1 é convertido em heading de cena `INT. … - DAY`; headings menores viram seções e texto/itálico são emitidos como ação.

---

## FASE 3 — Média Prioridade (P3 🟡)

### 3.1 — IA/NLP — Completar Pipeline (módulo: `ia_nlp`)

#### ✅ UC-032 — Palavras-chave Automáticas (TF-IDF)
**Concluído em 2026-08-06:**
- O domínio calcula TF-IDF local com remoção de stopwords e retorna os dez termos mais relevantes.
- O editor exibe as palavras-chave no painel lateral, usando os demais capítulos como corpus; o painel NLP também mostra a análise do texto informado.

#### ⚠️ UC-052 — Resumo de Capítulos
**Parcial em 2026-08-06:**
- O toolbar do editor gera resumo local por cenas e preenche uma nota de rodapé pronta para inserção.
- O fallback extractivo respeita quebras de cena; a etapa pendente é substituir/complementar pelo SLM local quantizado para resumo abstrativo.

#### ⚠️ UC-054 — Sugestões de Conexão entre Entidades
**Parcial em 2026-08-06:**
- A aba de conexões oferece sugestões locais com similaridade cosseno TF-IDF ≥ 0,8 e mostra os termos compartilhados.
- A substituição por embeddings densos das fichas permanece pendente; o mecanismo atual é lexical e explicável.

#### ✅ UC-109 — Fundir Entidades Duplicadas
**Concluído em 2026-08-06:**
- Worldbuilding detecta personagens, facções, locais e itens com distância Levenshtein ≤ 1.
- Cada sugestão exige confirmação de fusão; a ficha principal preserva seus dados, recebe campos ausentes da secundária e a secundária é removida.
- Referências locais são redirecionadas em transação antes da exclusão, incluindo relações, eventos, mapas, religiões e nós de tecnologia.

#### ❌ UC-143 — Corretor Inline no Tiptap
**O que falta:**
- Integrar `Xenova/bert-base-multilingual-cased` para spell check
- Ou usar `cspell` com dicionário PT-BR
- Extension Tiptap que sublinha palavras com wavy red underline
- Clique direito → sugestões de correção

#### ❌ UC-402 — Catalogar Tropos Usados
**O que falta:**
- Pipeline de classificação com ontologia de tropos (arquivo JSON com ~100 tropos)
- Usar `zero-shot-classification` com `Xenova/nli-deberta-v3-small`
- Painel em `app/nlp/page.tsx` listando tropos detectados + capítulos onde aparecem

#### ⚠️ UC-410 — Relatório de Estilo Autoral
**Parcial em 2026-08-06:**
- O dashboard calcula e compara por capítulo TTR, comprimento médio de sentença e taxa aproximada de adjetivos/advérbios.
- Permanecem pendentes a comparação entre projetos e um gráfico temporal dedicado às métricas de estilo.

### 3.2 — Worldbuilding — Visualizações Gráficas (módulo: `worldbuilding_lore`)

#### ✅ UC-172 — Árvore Genealógica Gráfica
**Concluído em 2026-08-06:**
- A aba Genealogia normaliza relações PAI, MÃE e FILHO em uma árvore hierárquica local, sem adicionar uma dependência de visualização.
- Nós clicáveis abrem a ficha correspondente na aba de personagens; ciclos cadastrados são identificados para impedir recursão infinita.

#### ✅ UC-178 — Grafo Interativo de Facções
**Concluído em 2026-08-06:**
- Grafo SVG local e clicável mostra facções e as ligações de alianças, tratados e guerras, sem introduzir D3-force.
- O cadastro de conflitos agora permite selecionar as facções envolvidas e a rede reflete esses vínculos.

#### ✅ UC-179 — Gerador de Brasão/Insígnia SVG
**Concluído em 2026-08-06:**
- O formulário de facção compõe localmente escudo ou círculo, símbolo e cores com prévia imediata.
- O resultado é persistido como `coatOfArmsSvg` autocontido e renderizado no cartão da facção; uma URL externa continua opcional.

#### ✅ UC-251 — Fluxograma DAG de Tecnologias/Magias
**Concluído em 2026-08-06:**
- O cadastro permite selecionar pré-requisitos e persiste as arestas em `prerequisiteIds`.
- A aba mostra um fluxograma SVG local por níveis, com setas de dependência e nós cinza para referências indisponíveis; não exige `@dagrejs/dagre`.

### 3.3 — Colaboração — Completar Parciais

#### ⚠️ UC-133 — Popover `@mention` no Editor
**Parcial em 2026-08-06:**
- O modal de comentários sugere colaboradores ao digitar `@` e insere a menção textual no comentário local.
- Ainda faltam a extensão Tiptap semântica e a entrega de notificação ao usuário, dependente da infraestrutura WebSocket do UC-134.

#### ⚠️ UC-134 — Barramento de Eventos WebSocket para Notificações
**O que falta:**
- Depende da infra WebSocket do UC-132
- Publicar evento quando: comentário adicionado, texto alterado, menção feita
- Client: ouvir eventos e exibir toast/badge no sininho

#### ⚠️ UC-153 — Fluxo Completo de Aprovação/Revisão
**O que falta:**
- Botão "Solicitar revisão" que muda status e notifica o(s) revisor(es)
- Botão "Aprovar" e "Solicitar alterações" (com comentário obrigatório)
- Status trava edição pelo autor enquanto aguarda decisão

### 3.4 — Pesquisa Científica — Completar (módulo: `pesquisa_cientifica`)

#### ✅ UC-320 — Colaboração em Revisão de Literatura
**Concluído em 2026-08-06:**
- Referências armazenam comentários granulares com autor e data, exibidos e incluídos na própria ficha bibliográfica.

#### ✅ UC-323 — Coautores e Contribuições
**Concluído em 2026-08-06:**
- `ResearchProject` local persiste coautores com e-mail e percentual de contribuição por workspace científico.
- A tela de pesquisa permite cadastrar e visualizar a lista de contribuições.

#### ✅ UC-325 — Exportar Notas Atômicas como DOCX
**Concluído em 2026-08-06:**
- A aba Zettelkasten oferece download DOCX e adapta cada nota para o contrato de `exportManuscripts`.
- O conteúdo de texto é escapado antes da geração, preservando segurança e quebras de linha.

#### ✅ UC-328 — Spaced Repetition
**Concluído em 2026-08-06:**
- O domínio implementa SM-2 com fator de facilidade limitado e intervalo progressivo.
- Notas persistem repetição, intervalo, facilidade e próxima revisão; a fila diária permite qualificar a lembrança.

### 3.5 — Infraestrutura — Completar Parciais Importantes

#### ⚠️ UC-432 — Acessibilidade WCAG 2.1 AA
**O que falta:**
- Executar auditoria com `axe-core` ou Lighthouse
- Corrigir: labels em todos os inputs sem aria-label, navegação por Tab em menus dropdown, anúncios de mudança de estado para screen readers

#### 🔵 UC-438 — Suíte de Testes Automatizados
**O que falta:**
- Configurar `vitest` ou `jest` + `@testing-library/react`
- Criar testes unitários para domínio: `streak-calculator`, `forecasting`, `cycle-detector`, `diff`, `nlp`
- Meta mínima: 60% de cobertura em `packages/domain/src/`

#### ✅ UC-440 — Documentação de API (OpenAPI)
**Concluído em 2026-08-06:**
- `GET /api/docs` entrega especificação OpenAPI 3.0.3 local para autenticação, projetos, manuscritos, pastas e colaboração por chat.

---

## FASE 4 — Baixa Prioridade / Infra Avançada (P4 🟢)

### 4.1 — Integrações de Nuvem (módulo: `importacao_exportacao`)

#### ❌ UC-222 — Integração com Google Drive
**O que falta:**
- Google Drive API v3 com OAuth2
- "Salvar no Drive" e "Importar do Drive" em `settings/page.tsx`

#### ❌ UC-223 — Integração com Dropbox
**O que falta:**
- Dropbox SDK + OAuth2
- Mesma UI do UC-222

#### ❌ UC-224 — Integração com OneDrive
**O que falta:**
- Microsoft Graph API + MSAL
- Mesma UI do UC-222

### 4.2 — Infraestrutura de Produção (módulo: `infraestrutura_rnf`)

#### ❌ UC-415 — Criptografia em Trânsito (TLS/HSTS)
**O que falta:**
- Configurar HTTPS no servidor de produção (Let's Encrypt / Vercel já fornece)
- Header `Strict-Transport-Security` no `next.config.js`

#### ❌ UC-416 — Criptografia em Repouso
**O que falta:**
- Cifrar dados sensíveis no IndexedDB usando `crypto.subtle` (AES-GCM)
- Chave derivada da senha do usuário com PBKDF2

#### ❌ UC-419/UC-424/UC-425/UC-426 — SLAs e Monitoramento
**O que falta:**
- Integrar Sentry para erros de runtime
- Integrar Vercel Analytics ou Plausible para Web Vitals
- Configurar alerts de uptime (UptimeRobot / Better Uptime)

#### ❌ UC-427 — Escalar Horizontalmente
**O que falta:**
- Documentar arquitetura stateless (JWT, sem sessão em memória)
- Configurar deploy em plataforma com autoscaling (Vercel, Fly.io, Railway)

#### ✅ UC-433 — Versionamento de API
**Concluído em 2026-08-06:**
- O middleware reescreve `/api/v1/...` para os handlers atuais e expõe `X-API-Version: 1`.
- `/api/...` permanece como alias da versão atual, e ambas as bases constam no OpenAPI.

#### ❌ UC-439 — CI/CD sem Downtime
**Parcial em 2026-08-06:**
- O repositório possui CI GitHub Actions para instalação determinística, typecheck, lint e testes, além de `GET /api/health` sem cache.
- O deploy sem downtime permanece pendente de uma plataforma de hospedagem e credenciais de ambiente autorizadas.

#### ⚠️ UC-451 — Sistema de Plugins
**Parcial em 2026-08-06:**
- O domínio define manifestos e hooks `beforeSave`, `afterLoad` e `onEditorCommand`; o runtime carrega módulos por URL em Web Worker com timeout de 5s, sem acesso ao DOM, cookies ou IndexedDB do app.
- Ainda falta UI/registro persistente para o autor instalar e habilitar plugins.

#### ❌ UC-452 — Compressão de Armazenamento Local
**O que falta:**
- Comprimir conteúdo HTML dos manuscritos com `lz-string` antes de salvar no IndexedDB
- Descomprimir ao carregar

### 4.3 — IA/NLP Avançado

#### ✅ UC-060 — Auto-Montar Árvores Genealógicas via NLP
**Concluído em 2026-08-06:**
- A genealogia varre capítulos por padrões factuais explícitos (filho, pai/mãe e casamento) entre personagens já cadastrados.
- Sugestões são revisadas e aceitas pelo autor antes de criar `FamilyRelation`.

#### ✅ UC-070/UC-071 — Simular Impacto de Alterações
**Concluído em 2026-08-06:**
- A central de conexões permite selecionar qualquer entidade e lista os capítulos do projeto que a mencionam, oferecendo a revisão de impacto antes da alteração.

#### ❌ UC-105 — Gerar Perguntas sobre o Universo
**Parcial em 2026-08-06:**
- A central de conexões gera perguntas determinísticas a partir de lacunas e vínculos ausentes nas fichas locais.
- A geração abstrativa por T5, alimentada também pelos capítulos, segue pendente de modelo local.

#### ❌ UC-108 — Atualizar Entidades Automaticamente
**Parcial em 2026-08-06:**
- O autosave do editor atualiza de forma assíncrona as fichas de personagens já existentes com os capítulos em que são mencionados literalmente (`mentionedInManuscriptIds`).
- A extração NER de novos atributos e entidades permanece pendente de uma fila de revisão semântica.

#### ❌ UC-146 — Detectar Variações de Nome de Personagem
**O que falta:**
- Resolver correferências: "ele", "o rei", "Aragorn" → mesma entidade
- Implementar pipeline de coreference resolution com SpanBERT ou cross-encoder

#### ❌ UC-401 — Sugerir Subversão de Tropos
**O que falta:**
- Depende do UC-402 (catálogo de tropos)
- Para cada tropo detectado, buscar em banco de dados de subversões comuns
- Exibir sugestão no painel de análise narrativa

#### ❌ UC-407-UC-409 — Análise Cross-Project
**O que falta:**
- Comparar embeddings de personagens/temas entre projetos diferentes do mesmo usuário
- Detectar padrões recorrentes e sugerir crossovers ou derivações

### 4.4 — Recursos Humanos

#### ❌ UC-307 — Portal de Admissão
**O que falta:**
- Pipeline de candidatos: criação de vaga, formulário de inscrição, avaliação
- Status: candidato → entrevista → aprovado → admitido

#### ❌ UC-311 — Gestão de Contratos
**O que falta:**
- Template de contrato editável (editor rico ou DOCX)
- Assinatura digital (DocuSign API ou `pdf-lib`)
- Status: rascunho → enviado → assinado

### 4.5 — Pesquisa Científica

#### ❌ UC-319 — Versionar Datasets
**O que falta:**
- Estrutura `DatasetVersion { id, datasetId, hash, createdAt, changelog }`
- Upload de arquivo CSV/JSON com cálculo de hash SHA-256
- Diff de metadados entre versões

#### ❌ UC-329 — Web Clipper
**O que falta:**
- Extensão de navegador (Chrome/Firefox) usando `webextension-polyfill`
- Capturar URL + conteúdo selecionado + screenshot
- Enviar para API da plataforma e criar nota em `research/page.tsx`

#### ❌ UC-330-UC-332 — Zettelkasten Avançado
**O que falta:**
- UC-330: mover nota de `type: 'fleeting'` para `type: 'permanent'` com revisão manual
- UC-331: criar nota de índice (MOC) que agrega links para outras notas por tema
- UC-332: ao digitar nova nota, sugerir notas relacionadas por similaridade semântica

---

## Sumário de Esforço Estimado

| Fase | UCs | Esforço estimado | Impacto |
|------|-----|-----------------|---------|
| P1 — Crítico | 14 | ~8 semanas (2 devs) | 🔴 Bloqueante |
| P2 — Alto | 24 | ~6 semanas (2 devs) | 🟠 Core UX |
| P3 — Médio | 22 | ~5 semanas (1 dev) | 🟡 Qualidade |
| P4 — Baixo | 37 | ~8 semanas (1 dev) | 🟢 Produção |
| **Total** | **97 ❌ + 85 ⚠️** | **~27 semanas** | |

---

## Dependências Críticas (ordem de implementação)

```
UC-132 (WebSocket infra)
  └── UC-213 (cursores remotos)
  └── UC-134 (barramento de eventos)
       └── UC-133 (mentions @)
       └── UC-375 (notificações Kanban)

UC-231 (2FA)
  └── UC-232 (WebAuthn) — opcional paralelo

UC-046 (NLI pipeline)
  └── UC-047 (contradições entre pastas)
  └── UC-050 (contradições de locais)
  └── UC-051 (contradições de eventos)
  └── UC-073 (alerta antes de salvar)

UC-172 (árvore genealógica gráfica)  ← depende de UC-173 já OK

UC-265 (mapas aninhados)
  └── UC-266 (navegação entre mapas)

UC-402 (catálogo de tropos)
  └── UC-401 (sugestão de subversão)
```

---

*Roadmap gerado com base na auditoria de 2026-07-29. Atualizar após cada sprint concluída.*
