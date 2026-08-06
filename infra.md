# Infraestrutura para destravar o correction roadmap

Este documento transforma os bloqueios externos do roadmap em decisões e tarefas executáveis. A regra comum é: segredos ficam somente no servidor/CI; o navegador recebe apenas identificadores públicos e tokens de curta duração.

## Ordem recomendada

1. Publicar um ambiente HTTPS com banco/segredos gerenciados.
2. Implantar autenticação OAuth e armazenamento seguro de tokens.
3. Adicionar colaboração em tempo real com Socket.IO e Redis.
4. Conectar provedores de arquivos (Drive, Dropbox e OneDrive).
5. Provisionar modelos NLP locais ou em worker dedicado.

## 1. Base de produção, TLS e CI/CD

**Decisão recomendada:** hospedar o Next.js em Vercel, Fly.io ou Railway, com domínio próprio, HTTPS automático e variáveis de ambiente configuradas no provedor. Usar o endpoint já criado `GET /api/health` como health check e manter o workflow `.github/workflows/ci.yml` como gate de typecheck, lint e testes.

Para deploy sem downtime, a plataforma escolhida precisa oferecer rollout gradual/blue-green, duas instâncias durante a troca e rollback automático quando `/api/health` não responder `200`. A configuração exata, domínio e conta do provedor requerem autorização do proprietário.

Variáveis mínimas:

```env
APP_URL=https://app.exemplo.com
NODE_ENV=production
JWT_SECRET=<segredo-aleatorio-32-bytes-ou-maior>
DATABASE_URL=<postgres-gerenciado>
REDIS_URL=rediss://<usuario>:<senha>@<host>:<porta>
```

Critério de aceite: `https://dominio/api/health` responde `200` sob HTTPS; uma implantação nova só recebe tráfego após health check; rollback preserva a versão anterior.

## 2. Login social: Google e GitHub (UC-237)

**Google:** registrar OAuth Client no Google Cloud, usar Authorization Code Flow com PKCE/state e callback HTTPS. Google recomenda a biblioteca Google Identity Services para web e descreve o uso de tokens de acesso para chamadas às APIs. [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2), [Google Identity Services para web](https://developers.google.com/identity/oauth2/web/guides/overview).

**GitHub:** preferir GitHub App quando houver automações ou permissões de repositório; ela oferece permissões granulares e tokens curtos. Para login simples, OAuth App com Authorization Code + PKCE/state é suficiente. O callback deve coincidir com a URL registrada. [GitHub OAuth web flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps), [criar OAuth App](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).

Variáveis:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
OAUTH_ENCRYPTION_KEY=<chave-para-refresh-tokens>
```

Implementação: criar callbacks `/api/auth/oauth/google/callback` e `/api/auth/oauth/github/callback`; validar `state` e PKCE; vincular por `provider + providerAccountId`; guardar refresh tokens cifrados no servidor, nunca no IndexedDB/browser. Solicitar somente `openid email profile` para login.

## 3. Colaboração, cursores e notificações (UC-132/133/134/213)

**Decisão recomendada:** executar um serviço Node separado com Socket.IO, autenticar o handshake com JWT, usar rooms `doc:<id>` e `user:<id>`, e escalar com Redis Pub/Sub usando `@socket.io/redis-adapter`. O adapter substitui o pacote antigo `socket.io-redis`. [Socket.IO Redis adapter](https://socket.io/docs/v4/redis-adapter/).

Eventos mínimos:

```text
join_document { documentId }
cursor_move { documentId, position, selection }
document_changed { documentId, update }
comment_created { documentId, commentId }
mention_created { userId, commentId }
notification { type, payload }
```

Segurança: validar JWT e autorização de documento antes de entrar em qualquer room; limitar `cursor_move` a 10/s; persistir notificações para offline; publicar por `user:<id>` para menções. Para o CRDT, manter o estado Yjs no serviço/Redis e persistir snapshots no banco.

Critério de aceite: dois nós de Socket.IO conectados ao mesmo Redis propagam cursor, comentário e menção entre si; usuário offline vê a notificação ao retornar.

## 4. Integrações de nuvem (UC-222/223/224)

Implementar uma interface única `CloudProvider` com `authorize`, `list`, `download`, `upload`, `refreshToken` e `revoke`; cada conta externa fica associada ao usuário e ao provedor, com token cifrado no servidor.

| Provedor | Fluxo e escopo inicial | Upload |
| --- | --- | --- |
| Google Drive | OAuth code flow; começar com `drive.file` para limitar acesso a arquivos criados/abertos pelo app. | Drive API `files.create`; usar upload resumable para arquivos grandes. [Drive uploads](https://developers.google.com/workspace/drive/api/guides/manage-uploads) |
| Dropbox | OAuth code + PKCE para clientes públicos; selecionar escopos mínimos de arquivos. | API Dropbox; OAuth requer redirect URI registrado exatamente. [Dropbox OAuth guide](https://developers.dropbox.com/oauth-guide) |
| OneDrive | Microsoft identity platform + Microsoft Graph com permissão delegada mínima (`Files.ReadWrite` quando suficiente). | PUT de conteúdo para arquivos menores e upload session para transferências resilientes. [Microsoft Graph upload](https://learn.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0), [OneDrive upload options](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/concepts/upload?view=odsp-graph-online) |

Não usar token permanente no browser. Ao desconectar, revogar token remoto quando o provedor suportar e apagar o token cifrado local.

## 5. NLP especializado (OCR, correferência, tropos, perguntas, análise cross-project)

O projeto já usa Transformers.js; a biblioteca suporta token classification/NER, feature extraction e text-to-text generation no navegador. [Transformers.js](https://huggingface.co/docs/transformers.js/en/index).

Plano:

1. Manter os fallbacks determinísticos já implementados para não bloquear o uso offline.
2. Criar `apps/ai-worker` (ou serviço interno) com fila e GPU opcional; expor jobs com status, cancelamento e revisão humana.
3. Para OCR, usar Tesseract.js no worker para imagens locais; validar idioma `por` e armazenar apenas texto extraído revisável.
4. Para correferência/tropos/perguntas abstrativas, testar modelos ONNX/Transformers.js dentro de limites de memória; se a qualidade não alcançar o corpus PT-BR, hospedar modelo em llama.cpp/vLLM no worker e não no request da UI.
5. Guardar embeddings por projeto e usuário; a análise cross-project só pode consultar projetos autorizados pelo mesmo usuário.

Critério de aceite: cada job apresenta fontes, confiança e ação de aceitar/rejeitar; nunca altera lore canônico apenas por saída do modelo.

## 6. Segurança operacional e LGPD

* Produção somente em HTTPS, cookies `HttpOnly`, `Secure`, `SameSite=Lax/Strict` e HSTS no proxy.
* Criptografar refresh tokens e integrações externas com chave rotacionável; separar chaves de desenvolvimento e produção.
* Aplicar RLS no PostgreSQL por `user_id`/`project_id`; registrar consentimento para integrações externas.
* Configurar retenção e exclusão de tokens, backups e logs; não registrar conteúdo de manuscrito em logs de aplicação.
* Antes de habilitar um provedor, criar página de consentimento com escopos, finalidade e botão de revogação.

## Autoridade ainda necessária

Para concluir os itens bloqueados, o proprietário precisa fornecer/autorizar: conta de hospedagem, domínio DNS, projeto Google Cloud, registro GitHub App/OAuth, app registrations de Dropbox/Microsoft, instância Redis/PostgreSQL, chaves de produção e orçamento/ambiente de GPU quando NLP especializado for desejado.
