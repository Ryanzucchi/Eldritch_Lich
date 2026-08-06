# Módulo de Autenticação, Perfis e Workspace de Projetos

Este módulo é responsável pelo cadastro, login, redefinição de senha, gestão de perfis de usuário e isolamento de múltiplos projetos/workspaces na plataforma.

## Responsabilidades

* **Duplicação local de projetos (UC-119):** o portal cria o novo projeto pela API sem ativá-lo e `project-clone.ts` copia a base Dexie particionada. IDs são pré-mapeados para que relações entre documentos, lore, timeline e mapas apontem exclusivamente para a cópia. Atalhos globais permanecem fora da clonagem.
*   **Autenticação Segura (UC-129, UC-130)**: Criptografia de senhas usando hashing scrypt no backend (Next.js server-side) e autenticação de requisições por meio de cookies seguros contendo tokens JWT (HS256).
*   **Gestão de Perfis de Usuário (UC-131)**: Interface Meu Perfil para atualização cadastral, incluindo avatar com redimensionamento e compressão WebP em canvas no client-side para garantir o limite de 2MB.
*   **Segundo fator TOTP (UC-231, parcial)**: O perfil cria uma semente compatível com RFC 6238, exige um código antes de ativá-la e permite desativação apenas após confirmar a senha. A semente é cifrada com AES-256-GCM derivado do segredo do servidor e não faz parte das respostas de sessão/perfil.
*   **Sessões rastreáveis e revogáveis (UC-233, UC-234)**: Cada login novo registra dispositivo, IP e datas em `sessions.json`. O JWT incorpora o `sid`; o backend consulta esse registro em cada verificação, portanto uma revogação remota invalida o token sem depender de o dispositivo revogado cooperar.
*   **Privacidade e encerramento (UC-236; UC-238 parcial)**: A tela de Segurança permite baixar uma exportação JSON antes de confirmar a exclusão. A exclusão remove fisicamente os registros JSON sob propriedade da conta e mantém somente um evento de consentimento append-only, anonimizado como `DELETED`.
    *   **Limite conhecido:** os bancos Dexie atuais são identificados por projeto, não por usuário. A limpeza automática do IndexedDB foi deliberadamente adiada para não apagar conteúdo offline de outra conta no mesmo navegador; o isolamento por usuário é pré-requisito para concluir a exclusão ponta a ponta.
*   **Workspace Multi-Projeto (UC-117, UC-118)**: Mecanismo de criação e seleção de projetos. O isolamento de dados é garantido na camada de dados local-first através da abertura de instâncias independentes de banco de dados Dexie/IndexedDB por projeto (`EldritchDatabase_${projectId}`).
*   **Execução dinâmica dos endpoints:** as rotas de autenticação declaram `dynamic = 'force-dynamic'`, pois dependem de cookies de sessão e de arquivos JSON locais. O build de produção deve receber `JWT_SECRET`; essa exigência é de segurança e não é substituída por um segredo padrão em produção.

## Arquivos Relacionados
*   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/auth/types.ts) e [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/project/types.ts): Definições de tipos de dados para `User`, `AuthSession`, `ResetToken` e `Project`.
*   [auth-backend.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/services/auth-backend.ts): Utilitário backend para manipulação do banco local de usuários e criptografia.
*   [2fa](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/auth/2fa): Endpoints de provisionamento, verificação e desativação do TOTP.
*   [account](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/auth/account/route.ts) e [export](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/api/auth/export/route.ts): Endpoints de direito ao esquecimento e portabilidade.
*   [middleware.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/middleware.ts): Middleware Next.js para controle e proteção das rotas privadas.
*   [GoogleDocsHomeComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/projects/GoogleDocsHomeComponent.tsx): Hub de projetos com criação/abertura de workspace, seleção de visibilidade e feedback visual para estado privado/compartilhado.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts): Inicializador do Dexie DB parametrizado com o ID do projeto ativo para isolamento local.

## Fluxo Causal e Segurança
1.  Qualquer acesso a rotas sob `/gmn` ou `/kanban` sem cookie `token` válido é interceptado pelo middleware e redirecionado para `/auth`.
2.  Ao registrar ou logar, o token JWT gerado é salvo como cookie `httpOnly`, impedindo o roubo de sessão via scripts de terceiros (XSS).
3.  Para uma conta com 2FA habilitado, a senha válida cria somente o cookie temporário `twoFactorPending` (cinco minutos). O cookie `token` normal só é criado depois de um TOTP válido; assim, a aplicação não trata uma senha isolada como sessão autenticada.
4.  A saída local e a revogação remota registram `revokedAt` na sessão. O backend rejeita JWTs com `sid` revogado; tokens legados sem `sid` expiram pelo prazo antigo e não aparecem na lista.
5.  A exclusão exige senha, e-mail exato e a confirmação de exportação no cliente. Ela não usa lixeira ou marcação lógica: os registros de conta e conteúdo próprio são removidos dos arquivos de persistência do backend.
6.  Ao alternar projetos, a aplicação grava a chave `activeProjectId` no `localStorage` e recarrega a página. Isso força o Dexie a se conectar ao banco de dados específico daquele projeto, garantindo 100% de isolamento.
7.  O hub de projetos prioriza clareza de estado (badges de visibilidade) e acessibilidade de navegação por teclado (`focus-visible`) para reduzir ambiguidade ao criar e abrir workspaces.
