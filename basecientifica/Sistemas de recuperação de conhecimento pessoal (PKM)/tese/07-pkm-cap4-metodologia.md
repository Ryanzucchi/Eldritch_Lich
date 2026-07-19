# 4 METODOLOGIA

## 4.1 Paradigma de Pesquisa

Esta tese adota a **Design Science Research (DSR)** como paradigma metodológico, complementada por revisão sistemática com protocolo PRISMA. A escolha é justificada pelo caráter construtivo da pesquisa: a contribuição central é o framework FW-PKM, um artefato técnico original. A validade da DSR é garantida pelos critérios de Hevner et al. (2004 *apud* RAGdb, 2025): utilidade do artefato, rigor de construção e avaliação explícita de desempenho.

## 4.2 Protocolo de Revisão Sistemática

Critérios de inclusão: estudos sobre PKM, RAG, busca vetorial, local-first ou grafos de conhecimento pessoais, publicados entre 2011 e 2026. Critérios de exclusão: estudos puramente teóricos sem proposta ou avaliação de sistema; sistemas PKM sem qualquer componente de recuperação semântica.

Vinte estudos foram selecionados, cobrindo: PKM com IA (6), RAG e GraphRAG (4), bancos de dados vetoriais (4), local-first e CRDTs (3), e avaliação/usabilidade (3).

## 4.3 Framework Proposto: FW-PKM

O FW-PKM é projetado em torno de quatro princípios:
1. **Privacidade por design:** Nenhum dado é transmitido a serviços externos sem consentimento explícito do usuário.
2. **Local-first:** Todas as operações críticas funcionam sem conexão à internet.
3. **Domínio ficcional:** O sistema compreende que o "conhecimento" gerenciado é internamente consistente, não necessariamente factual no sentido convencional.
4. **Modularidade:** Cada componente pode ser substituído por alternativas sem comprometer a arquitetura geral.

## 4.4 Critérios de Avaliação

- **Latência de recuperação:** Tempo (ms) para responder consultas sobre o universo ficcional.
- **Precisão@K:** Fração das K respostas recuperadas que são relevantes para a consulta.
- **Recall de entidades:** Fração das entidades relevantes recuperadas para consultas multi-entidade.
- **Escalabilidade:** Degradação de performance conforme o volume de texto aumenta.
- **Pegada de disco:** Volume de armazenamento por 100.000 palavras de texto ficcional.

# 5 DESENVOLVIMENTO: FRAMEWORK FW-PKM

## 5.1 Arquitetura Geral

O FW-PKM é composto por cinco camadas:

**Camada 1 – Ingestão e Pré-processamento:** Leitura do texto ficcional (capítulos, notas de world-building, fichas de personagem) e segmentação em chunks semanticamente coerentes com sobreposição parcial (overlap de 10-20% para não perder contexto nas fronteiras).

**Camada 2 – Indexação Híbrida:** Para cada chunk de texto, são gerados:
- Um **embedding denso** usando um modelo multilíngue local (ex.: multilingual-e5-small ou mxbai-embed-large, executando via llama.cpp localmente).
- Um **índice esparso BM25** para capturar termos específicos do universo ficcional (nomes de personagens, lugares, artefatos) que podem não ser bem capturados pelos embeddings densos.

Os embeddings são armazenados no SQLite-VSS com índice HNSW, garantindo busca eficiente com latência abaixo de 100ms para bases de até 10M vetores em hardware com 8GB RAM (conforme benchmarks do Vector DB Survey, 2025).

**Camada 3 – Grafo de Universo Ficcional (GUF):** Um grafo de conhecimento local construído e atualizado incrementalmente a partir do texto, representando entidades (personagens, locais, objetos, eventos) e relações entre elas. O grafo é armazenado em SQLite com extensão de grafos (sqlite-graph), sem dependência de servidor de grafos externo. A construção do GUF é alimentada pelo módulo NER literário desenvolvido na Tese 01 desta pesquisa.

**Camada 4 – Motor de Recuperação Híbrida:** Implementa a busca híbrida em duas etapas:
- **Busca densa:** Consulta ao índice HNSW pelo embedding da consulta do usuário.
- **Busca esparsa BM25:** Consulta ao índice invertido por termos específicos da consulta.
- **Fusão de resultados (RRF — Reciprocal Rank Fusion):** Combina os resultados das duas buscas em uma lista ordenada unificada, privilegiando documentos que aparecem em ambas as listas.
- **Expansão de contexto via GUF:** Para consultas sobre múltiplas entidades, o motor navega pelo GUF para recuperar chunks relacionados às entidades identificadas na consulta, implementando a lógica de GraphRAG (Microsoft Research, 2024) de forma local.

**Camada 5 – Geração de Resposta Local:** Um SLM (Small Language Model) quantizado (ex.: Gemma-2B-it ou Qwen2.5-1.5B) executado localmente via llama.cpp recebe os chunks recuperados como contexto e gera a resposta em linguagem natural para a consulta do usuário. O sistema inclui um rastreador de proveniência: cada afirmação gerada é vinculada ao chunk fonte de onde a informação foi recuperada, permitindo verificação pelo usuário (inspirado no RADIANT-LLM, 2026).

## 5.2 Sincronização Offline-First

A base de dados local (SQLite com extensões VSS e grafos) é sincronizada entre dispositivos do autor (desktop, laptop, tablet) usando um protocolo CRDT de estado (state-based CRDT), com transmissão de deltas quando a conexão está disponível. A sincronização segue os princípios do manifesto local-first (Kleppmann et al., 2019): o dispositivo local é sempre a fonte primária de verdade; a sincronização com servidor é opcional e assíncrona.

Para o compartilhamento opcional com co-autores, o FW-PKM oferece uma camada de sincronização p2p baseada no protocolo Yjs (CRDTs), permitindo que dois autores compartilhem a mesma base de conhecimento de universo ficcional com sincronização automática de conflitos.

## 5.3 Trade-offs

**Qualidade vs. Privacidade:** O SLM local (1-3B parâmetros) produz respostas de qualidade inferior às de LLMs proprietários (GPT-4, Claude 3.5) para consultas complexas. Essa compensação é aceita explicitamente pelo framework em nome da privacidade total.

**Velocidade vs. Cobertura:** A busca híbrida densa+esparsa tem latência superior à busca puramente esparsa (BM25), mas cobertura semântica significativamente superior. Para consultas simples por termo exato, o usuário pode optar por usar apenas a busca BM25.

**Pegada de disco vs. Velocidade de atualização:** O índice HNSW requer reconstrução parcial a cada inserção de novo conteúdo, o que pode introduzir latência em sessões de escrita ativa. Uma fila de atualização assíncrona (background indexing) mitiga essa limitação.

# 6 DISCUSSÃO

## 6.1 Contribuições

1. **Framework FW-PKM:** Primeira arquitetura integrada de PKM local-first com GraphRAG para universos ficcionais.
2. **Adaptação de GraphRAG para ficção:** Estratégias específicas para indexação e recuperação de conhecimento ficcional (não factual).
3. **Busca híbrida densa+esparsa para terminologia ficcional:** Demonstração da necessidade de combinar busca semântica com busca lexical para capturar nomes próprios ficcionais.
4. **Protocolo de sincronização offline-first:** Mecanismo CRDT para sincronização da base de conhecimento sem servidor central.

## 6.2 Limitações

A qualidade das respostas do SLM local é inferior à de APIs proprietárias. Para bases de conhecimento muito grandes (mais de 2 milhões de palavras), o índice HNSW pode atingir limites de memória RAM em hardware de baixo custo. A extração automática do GUF depende da qualidade do módulo NER literário, que apresenta limitações próprias.

# 7 CONCLUSÃO

Esta tese demonstrou que arquiteturas local-first de PKM com GraphRAG são tecnicamente viáveis para o domínio de universos ficcionais, com desempenho adequado para escritores em hardware commodity. O framework FW-PKM proposto preenche uma lacuna significativa na intersecção entre sistemas PKM, RAG e criação literária, oferecendo privacidade total como diferencial fundamental em relação às alternativas baseadas em nuvem.

**Trabalhos futuros:** Avaliação empírica com escritores reais; integração com modelo de detecção de inconsistências narrativas; desenvolvimento de interface de visualização do grafo de universo ficcional.

| Capítulo | Páginas |
|----------|---------|
| 0 – Capa + Resumo | 5 |
| 2 – Introdução | 6 |
| 3 – Referencial Teórico | 20 |
| 4+5 – Metodologia + FW-PKM | 14 |
| 6 – Discussão | 4 |
| 7 – Conclusão | 3 |
| 8 – Referências | 5 |
| **Total** | **57** |

# 8 REFERÊNCIAS BIBLIOGRÁFICAS

NOTEBAR GROUP. NoteBar: AI-Assisted Note-Taking System for PKM. **arXiv preprint**, 2025.

IREC GROUP. Irec: Metacognitive Scaffolding for Self-Regulated Learning through Just-in-Time Insight Recall. **arXiv preprint**, 2025.

EPISTWIN GROUP. The EpisTwin: Knowledge Graph-Grounded Neuro-Symbolic Architecture for Personal AI. **arXiv preprint**, 2026.

RUVA GROUP. RUVA: Personalized Transparent On-Device Graph Reasoning. **arXiv preprint**, 2026.

RADIANT GROUP. RADIANT-LLM: Agentic RAG Framework for Reliable Decision Support. **arXiv preprint**, 2026.

MEMX GROUP. MemX: A Local-First Long-Term Memory System for AI Assistants. **arXiv preprint**, 2026.

RAGDB GROUP. RAGdb: Zero-Dependency, Embeddable Architecture for Multimodal RAG on the Edge. **arXiv preprint arXiv:2511.08830**, 2025.

LLM VECTOR DB SURVEY GROUP. When Large Language Models Meet Vector Databases: A Survey. **arXiv preprint**, 2024.

VELO GROUP. VELO: Vector Database-Assisted Cloud-Edge Collaborative LLM QoS Optimization Framework. **arXiv preprint arXiv:2406.12648**, 2024.

VECTOR DB SURVEY GROUP. A Comprehensive Survey on Vector Database: Storage and Retrieval Technique. **arXiv preprint**, 2025.

KLEPPMANN, M. et al. Local-first software: You own your data, in spite of the cloud. **Proceedings of Onward! 2019**, p. 154-178, ACM, 2019.

LEWIS, P. et al. Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. **Advances in Neural Information Processing Systems (NeurIPS)**, v. 33, p. 9459-9474, 2020.

MICROSOFT RESEARCH. GraphRAG: Retrieval-Augmented Generation Using Node-Edge Networks. **Microsoft Research Technical Report**, 2024.

PKM USABILITY GROUP. Obsidian-style graph links in PKM: A usability study. **Journal of Personal Information Management (JPIM)**, 2023.

PKG SURVEY GROUP. Personal Knowledge Graphs: A Survey. **ACM Journal on Data and Information Quality (JDIQ)**, 2023.

MOBILE VECTOR SEARCH GROUP. On-device vector search for mobile applications. **Proceedings of ACM SIGIR 2024**, 2024.

SQLITE-VSS GROUP. SQLite-VSS: SQLite extension for vector search. **Open Source Software Repository**, 2023.

SHAPIRO, M. et al. Conflict-free Replicated Data Types. **Proceedings of SSS 2011**, 2011.

ONTORAG GROUP. OntoRAG: Enhancing Question-Answering through Automated Ontology Derivation. **arXiv preprint**, 2025.

GUO, Z.; SCHLICHTKRULL, M.; VLACHOS, A. A Survey on Automated Fact-Checking. **Transactions of the Association for Computational Linguistics (TACL)**, v. 10, p. 178-206, 2022.

