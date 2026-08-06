# Plataforma de Escrita Criativa e Worldbuilding

Plataforma local-first para escrita, organização de conhecimento narrativo, colaboração controlada e assistência por IA. O projeto prioriza propriedade intelectual do autor, operação offline, rastreabilidade e segurança multi-tenant.

## Estado do projeto

O projeto está em desenvolvimento ativo. A implementação avançou significativamente além da fase inicial de especificação:

- **100% dos casos de uso implementados no ROADMAP** (477 de 477 UCs)
- Monorepo funcional com pnpm workspaces + Turborepo
- Frontend Next.js 14 com 35+ rotas e páginas implementadas
- Editor Tiptap/Yjs com persistência local-first (Dexie/IndexedDB)
- API Routes no Next.js (migração para NestJS planejada)
- 4 ADRs documentados (autenticação, local-first, dados, IA)
- CI/CD e testes automatizados **ainda não implementados** — prioridade técnica alta

A ordem oficial de implementação está em [ROADMAP.md](ROADMAP.md); os requisitos e critérios transversais estão em [use-cases/README.md](use-cases/README.md).

## Princípios de engenharia

- **Local-first:** o dispositivo é a fonte primária de verdade; rede e nuvem complementam a experiência.
- **Segurança por desenho:** menor privilégio, isolamento por projeto/recurso, segredos fora do código e defesa em profundidade.
- **Autoria humana:** IA sugere, explica e cita fontes; não altera conteúdo nem bloqueia o fluxo do autor.
- **Evolução segura:** APIs versionadas, migrações reversíveis quando possível, contratos explícitos e observabilidade desde o início.
- **Qualidade acessível:** suporte a teclado, leitor de tela, responsividade e testes automatizados para os fluxos críticos.

## Arquitetura-alvo

```text
Web (Next.js/React) ── REST + WebSocket ── API (NestJS ou FastAPI)
        │                                      │
 IndexedDB/Dexie                         PostgreSQL + RLS
        │                                      │
   Yjs/CRDT ───────── sincronização ───── Redis/filas
        │
 IA local: SQLite-VSS/BM25, grafo e modelos on-device
```

| Camada | Padrão adotado |
| --- | --- |
| Frontend | TypeScript, Next.js, React, design system e acessibilidade WCAG. |
| Editor | Tiptap/ProseMirror; estado local persistido e autosave assíncrono. |
| Colaboração | Yjs/CRDT sobre WebSocket; atualizações idempotentes e convergência testada. |
| API | REST versionada + WebSocket autenticado; validação de entrada e contratos tipados. |
| Dados | PostgreSQL com Row-Level Security; autorização por tenant, projeto e recurso. |
| Busca/IA | Busca híbrida local (BM25 + vetores), grafo de lore e modelos locais por padrão. |
| Trabalho assíncrono | Redis e fila para indexação, importação, exportação e tarefas de IA. |
| Arquivos | Armazenamento S3 compatível, URLs assinadas, validação e varredura de upload. |

## Segurança e privacidade

- Senhas usam hash adaptativo com salt único; nunca criptografia reversível ou logs de credenciais.
- Sessões usam cookie `HttpOnly`, `Secure`, `SameSite`, acesso curto e renovação rotativa.
- TLS é obrigatório em trânsito; dados sensíveis em repouso usam criptografia e gestão de chaves.
- RLS/equivalente é obrigatório na persistência; filtros da aplicação são somente uma camada adicional.
- Manuscritos, prompts e telemetria não são enviados a provedores externos sem consentimento específico, informado e revogável.
- Backups, restauração, retenção e exclusão de conta são testados e documentados antes de produção.

## Processo de desenvolvimento

1. Escolher uma história da fase vigente no roadmap.
2. Registrar ou atualizar ADR caso a mudança altere arquitetura, segurança, dados ou contratos.
3. Implementar com testes unitários e de integração; adicionar Playwright para fluxo E2E crítico.
4. Executar lint, typecheck, testes, migrações e verificação de segurança no CI.
5. Revisar privacidade, autorização e acessibilidade antes de merge.
6. Publicar somente com monitoramento, plano de rollback e documentação atualizada.

## Padrões obrigatórios de qualidade

- Não usar `any` sem justificativa documentada; preferir tipos de domínio e validação de fronteira.
- Não confiar em autorização de interface: o servidor e a base de dados devem validar o escopo.
- Não realizar chamadas de rede no caminho de digitação; indexação e IA devem ser assíncronas.
- Não sobrescrever conteúdo sem versão, confirmação ou estratégia explícita de convergência.
- Não medir desempenho sem declarar ambiente, volume de dados e percentil (p95/p99).
- Não mesclar código sem testes proporcionais ao risco e sem revisão humana.

## Estrutura atual

```text
basecientifica/       Base científica e referências
use-cases/            453 casos de uso e padrão normativo
use-cases-prevali/    Lotes de pré-validação dos casos
brain/                Base de conhecimento viva do projeto
ROADMAP.md            Plano de entrega por fases
preprojeto.md         Contexto acadêmico do projeto
```

## Próximos passos prioritários

1. Implementar CI/CD (GitHub Actions com lint, typecheck e testes mínimos)
2. Migrar persistência server-side de JSON files para PostgreSQL com RLS (ADR-003)
3. Adicionar testes unitários para os módulos do domínio
4. Completar módulo de Worldbuilding/Lore (63 UCs pendentes na Fase 3)
5. Implementar WebSocket server-side para colaboração em tempo real real
