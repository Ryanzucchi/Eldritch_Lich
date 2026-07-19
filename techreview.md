# Tech Review — Plataforma de Escrita Criativa e Worldbuilding

**Data da revisão:** 19 de julho de 2026  
**Status:** recomendação arquitetural para início do projeto; validar com um *spike* técnico antes do MVP.

## Resumo executivo

A melhor relação entre risco, produtividade e eficiência para a primeira versão web é **TypeScript + Next.js/React + Tiptap/ProseMirror + Yjs + IndexedDB + PostgreSQL/RLS**. Essa escolha reutiliza padrões presentes em projetos open-source de colaboração e PKM, sem tentar reproduzir a complexidade de um produto nativo multiplataforma como AppFlowy.

Para busca semântica, o servidor deve começar com **PostgreSQL + pgvector**, enquanto a busca local do navegador inicia com **BM25/FTS**. `sqlite-vec` é promissor para desktop/WASM, mas permanece pré-1.0; portanto, não deve ser dependência crítica do MVP. IA deve ser local por padrão, em fila assíncrona e com fontes/versionamento.

## Método e limites

Foram revisados repositórios e documentação primária de projetos comparáveis, além das tecnologias candidatas. A revisão mede adequação arquitetural, maturidade aparente, interoperabilidade, operação offline e custo de implementação — **não** substitui benchmark no hardware, conjunto de dados e carga reais deste projeto. Estrelas, releases e alegações de desempenho não foram usados como prova de desempenho.

## Projetos comparáveis analisados

| Projeto | O que demonstra | Decisão para este projeto |
| --- | --- | --- |
| [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy) | Workspace colaborativo e autohospedável, com foco em privacidade e código Flutter/Rust multiplataforma. | Referência de produto e privacidade; não copiar a stack nativa no MVP web, pois aumenta muito o custo de execução. |
| [AFFiNE / BlockSuite](https://github.com/toeverything/blocksuite) | Editor por blocos, colaboração nativa com Yjs, atualizações incrementais e múltiplas visualizações. | Referência para modelar blocos e CRDT; avaliar BlockSuite apenas se o editor precisar de canvas/edgeless cedo. |
| [Logseq](https://github.com/logseq/logseq) | PKM local-first, privacidade e grafo de conhecimento. | Reforça que dados e busca precisam continuar úteis offline; não adotar Clojure como linguagem principal sem equipe especializada. |
| [Outline](https://github.com/outline/outline) | Base de conhecimento colaborativa em React/Node, uso de migrações, logs estruturados e cobertura forte para API/autenticação. | Referência de operação web e processo de testes; adotar TypeScript e testes de fluxos críticos. |
| [Automerge](https://automerge.org/docs/tutorial/) | Alternativa CRDT local-first com armazenamento em IndexedDB, sincronização e histórico por documento. | Manter como plano B/alternativa para metadados complexos; não usá-lo junto com Yjs no mesmo dado sem uma fronteira explícita. |

## Comparativo de decisões técnicas

| Domínio | Opções avaliadas | Escolha | Motivo e condição |
| --- | --- | --- | --- |
| Aplicação web | Next.js/React; Flutter/Rust | **Next.js + React + TypeScript** | Menor tempo para MVP web, ecossistema direto para Tiptap/Yjs e testes. Flutter/Rust passa a fazer sentido se app desktop/mobile nativo for requisito próximo. |
| Editor | Tiptap/ProseMirror; BlockSuite | **Tiptap/ProseMirror** | Melhor ponto de partida para manuscrito rico, extensões e colaboração; BlockSuite fica para uma futura experiência de blocos/canvas. |
| Texto colaborativo | Yjs; Automerge | **Yjs** | Integrações prontas com ProseMirror/Tiptap, providers WebSocket e persistência IndexedDB. A documentação descreve modelo agnóstico de rede e integração com editores ricos. |
| Metadados colaborativos | Y.Map/Y.Array; Automerge | **Yjs no MVP** | Reduz duas pilhas CRDT. Reavaliar Automerge em spike se histórico local completo de fichas e branches for mais valioso que integração direta com o editor. |
| Persistência local web | IndexedDB/Dexie; SQLite/WASM | **IndexedDB + y-indexeddb/Dexie** | Browser suporta persistência local sem distribuir runtime SQLite. SQLite/WASM fica para desktop ou busca local avançada. |
| API | NestJS; FastAPI | **NestJS/TypeScript** | Compartilha linguagem, contratos e validações com a web. FastAPI é alternativa válida se os serviços de IA em Python passarem a dominar. |
| Dados compartilhados | PostgreSQL; banco de grafos separado | **PostgreSQL + RLS** | Relações, transações, migrações e proteção multi-tenant em um banco; um grafo dedicado só entra após medir gargalo real. |
| Busca semântica servidor | pgvector; serviço vetorial separado | **pgvector** | Vetores ficam junto dos dados, com ACID, joins e recuperação; HNSW oferece trade-off de busca/recall configurável. |
| Busca semântica local | sqlite-vec; SQLite-VSS | **BM25/FTS primeiro; sqlite-vec em spike** | `sqlite-vec` substitui o antigo `sqlite-vss`, roda em múltiplos ambientes, mas é pré-1.0 e pode ter quebras. |
| Mensageria | Redis + BullMQ; execução síncrona | **Redis + BullMQ** | Indexação, OCR, importação, exportação e IA não podem competir com a digitação. |
| Observabilidade | logs soltos; tracing estruturado | **OpenTelemetry + Sentry + logs JSON** | Diagnóstico com dados mínimos; nunca registrar manuscrito, token ou prompt sem consentimento. |

## Evidências e implicações

### 1. Editor, offline e colaboração

Yjs declara tipos compartilhados que convergem independentemente da ordem de atualização, é agnóstico à rede e possui integrações para ProseMirror/Tiptap e providers de persistência. Isso se encaixa nos casos de edição simultânea e sincronização offline. [Yjs — Introduction](https://docs.yjs.dev/)  

O guia oficial do Tiptap mostra `y-indexeddb` persistindo cada alteração no navegador e sincronizando-a quando a conexão retorna. Para o MVP, essa é a rota de menor risco para autosave local. [Tiptap — Offline support](https://tiptap.dev/docs/guides/offline-support)

BlockSuite confirma o padrão de editor por blocos construído sobre Yjs, mas seu próprio repositório o descreve como ainda em refinamento. Portanto, não é a escolha inicial para o editor literário; deve ser avaliado quando canvas, whiteboard e blocos multimodais forem prioridade. [BlockSuite](https://github.com/toeverything/blocksuite)

Automerge oferece boa persistência e sincronização local, inclusive IndexedDB e adapters de rede, e é uma alternativa legítima. A decisão de não combiná-lo já no MVP é de simplicidade operacional: um único CRDT evita duplicação de sincronização, observabilidade e resolução de identidade. [Automerge — Local storage & sync](https://automerge.org/docs/tutorial/local-sync/)

### 2. Dados, autorização e busca

PostgreSQL RLS permite restringir linhas para leitura e escrita; sem política aplicável, o comportamento é *default deny*. Isso sustenta isolamento por tenant, projeto e recurso como controle na camada de dados, complementado pela autorização da API. [PostgreSQL — Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

pgvector mantém vetores junto de dados relacionais e suporta busca exata e aproximada. HNSW melhora a relação velocidade/recall, mas aumenta memória e tempo de construção; a decisão de índice deve ser baseada em `EXPLAIN`, latência p95 e recall medido no corpus real. [pgvector](https://github.com/pgvector/pgvector)

`sqlite-vec` é sucessor de `sqlite-vss`, compila para múltiplos ambientes e oferece vetores em SQLite; porém, o projeto declara-se pré-1.0. Usá-lo somente atrás de uma interface de busca permite experimentar sem prender o produto a uma API instável. [sqlite-vec](https://github.com/asg017/sqlite-vec)

### 3. Lições de produto e operação

AppFlowy e Logseq validam a demanda por privacidade, autohospedagem e dados sob controle do usuário. AppFlowy usa Flutter/Rust para experiência nativa multiplataforma, uma troca de engenharia válida, mas excessiva para o MVP web. [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy), [Logseq](https://github.com/logseq/logseq)

Outline demonstra uma base de conhecimento colaborativa React/Node e documenta foco de testes em endpoints e autenticação, em vez de uma meta artificial de 100% de cobertura. Esse é o padrão de qualidade adotado aqui: cobertura orientada a risco, com E2E para jornadas críticas. [Outline](https://github.com/outline/outline)

## Stack recomendada para a Fase 0–2

```text
pnpm workspaces / Turborepo
├─ apps/web: Next.js, React, TypeScript, Tailwind, Tiptap, Yjs, Dexie
├─ apps/api: NestJS, REST versionado, WebSocket, validação tipada
├─ packages/domain: contratos, schemas e regras de autorização
├─ packages/ui: design system acessível
└─ infra: Docker Compose, PostgreSQL + RLS, Redis, MinIO/S3, OpenTelemetry
```

## Spikes obrigatórios antes de congelar escolhas

1. **Yjs + Tiptap:** 5 colaboradores, reconexão, duplicação de mensagens, documento de 100 mil palavras e medição de convergência/latência p95.
2. **Local-first:** editar offline, encerrar navegador, restaurar estado e sincronizar sem perda ou sobrescrita.
3. **RLS:** testes de leitura/escrita/exportação com IDs adulterados, jobs assíncronos e cache; confirmar *default deny*.
4. **Busca:** comparar FTS/BM25, pgvector exato e HNSW com corpus em português; medir recall@k, p95 e custo de indexação.
5. **IA:** validar modelo local em corpus narrativo com precisão, recall, alucinação, fonte citável e impacto na memória/CPU.

## Decisões a evitar neste estágio

- Não introduzir banco de grafos, mecanismo vetorial separado ou microserviços antes de métricas justificarem o custo.
- Não enviar manuscritos para APIs externas por padrão.
- Não usar duas bibliotecas CRDT para o mesmo documento.
- Não prometer latência sem perfil de hardware, volume e percentil definidos.
- Não adotar `sqlite-vec` como dependência crítica até estabilização e benchmark próprio.

## Decisão final

Começar com a stack recomendada, registrar ADRs para as decisões acima e executar os cinco spikes antes de concluir a Fase 1. Os resultados dos spikes, e não alegações de marketing ou popularidade de repositório, determinam se alguma tecnologia será trocada.
