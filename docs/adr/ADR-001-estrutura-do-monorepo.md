# ADR 001: Estrutura do Monorepo (pnpm + Turborepo)

## Status
Aprovado

## Data
20 de julho de 2026

## Contexto
O projeto Eldritch Lich necessita gerenciar código compartilhado de forma eficiente entre o frontend (Next.js), a API do servidor (NestJS), os contratos e modelos do domínio, e a biblioteca comum de componentes de interface. Separar esses módulos em repositórios independentes aumentaria a latência de integração, o overhead de CI/CD e a complexidade de deploy.

## Decisão
Adotamos uma estrutura de **Monorepo** utilizando o gerenciador de pacotes **pnpm** (via pnpm workspaces) para gerenciar links simbólicos locais e dependências de forma rápida e eficiente, orquestrado pela ferramenta **Turborepo** para cache inteligente de pipelines de compilação, testes e typecheck.

A estrutura de diretórios adotada é:
```text
eldritch-lich/
├── apps/
│   ├── web/        # Next.js, React, Dexie, Yjs
│   └── api/        # NestJS Backend
├── packages/
│   ├── domain/     # Tipagem, schemas e validações
│   └── ui/         # Componentes compartilhados acessíveis
└── infra/          # Configurações de Docker, volumes locais, etc.
```

## Consequências
* **Positivas:**
  * Facilidade em compartilhar contratos de tipagem e validação entre a API e a Web.
  * Pipeline de build otimizado com cache local e remoto do Turborepo.
  * Consistência de pacotes de terceiros através de um único lockfile (`pnpm-lock.yaml`).
* **Negativas:**
  * Curva de aprendizado inicial para gerenciar imports locais com workspaces.
  * Configurações de linting e TypeScript centralizadas precisam ser bem mantidas.
