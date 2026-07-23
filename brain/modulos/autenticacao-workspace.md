# Módulo de Autenticação, Perfis e Workspace de Projetos

Este módulo é responsável pelo cadastro, login, redefinição de senha, gestão de perfis de usuário e isolamento de múltiplos projetos/workspaces na plataforma.

## Responsabilidades
*   **Autenticação Segura (UC-129, UC-130)**: Criptografia de senhas usando hashing scrypt no backend (Next.js server-side) e autenticação de requisições por meio de cookies seguros contendo tokens JWT (HS256).
*   **Gestão de Perfis de Usuário (UC-131)**: Interface Meu Perfil para atualização cadastral, incluindo avatar com redimensionamento e compressão WebP em canvas no client-side para garantir o limite de 2MB.
*   **Workspace Multi-Projeto (UC-117, UC-118)**: Mecanismo de criação e seleção de projetos. O isolamento de dados é garantido na camada de dados local-first através da abertura de instâncias independentes de banco de dados Dexie/IndexedDB por projeto (`EldritchDatabase_${projectId}`).

## Arquivos Relacionados
*   [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/auth/types.ts) e [types.ts](file:///home/zucchi/Projetos/Eldritch_Lich/packages/domain/src/project/types.ts): Definições de tipos de dados para `User`, `AuthSession`, `ResetToken` e `Project`.
*   [auth-backend.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/services/auth-backend.ts): Utilitário backend para manipulação do banco local de usuários e criptografia.
*   [middleware.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/middleware.ts): Middleware Next.js para controle e proteção das rotas privadas.
*   [GoogleDocsHomeComponent.tsx](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/app/projects/GoogleDocsHomeComponent.tsx): Hub de projetos com criação/abertura de workspace, seleção de visibilidade e feedback visual para estado privado/compartilhado.
*   [schema.ts](file:///home/zucchi/Projetos/Eldritch_Lich/apps/web/src/db/schema.ts): Inicializador do Dexie DB parametrizado com o ID do projeto ativo para isolamento local.

## Fluxo Causal e Segurança
1.  Qualquer acesso a rotas sob `/gmn` ou `/kanban` sem cookie `token` válido é interceptado pelo middleware e redirecionado para `/auth`.
2.  Ao registrar ou logar, o token JWT gerado é salvo como cookie `httpOnly`, impedindo o roubo de sessão via scripts de terceiros (XSS).
3.  Ao alternar projetos, a aplicação grava a chave `activeProjectId` no `localStorage` e recarrega a página. Isso força o Dexie a se conectar ao banco de dados específico daquele projeto, garantindo 100% de isolamento.
4.  O hub de projetos prioriza clareza de estado (badges de visibilidade) e acessibilidade de navegação por teclado (`focus-visible`) para reduzir ambiguidade ao criar e abrir workspaces.
