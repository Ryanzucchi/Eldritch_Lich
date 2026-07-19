# 5 DESENVOLVIMENTO DO FRAMEWORK FW-PKM

## 5.1 Visão Geral da Arquitetura

O framework **Fictional World PKM (FW-PKM)** é uma arquitetura de cinco camadas projetada especificamente para autores de ficção especulativa que necessitam de um sistema de gerenciamento de conhecimento com busca semântica avançada, raciocínio baseado em grafos e operação completamente local. A seguir, cada camada é descrita com seus componentes técnicos, justificativas de design e trade-offs.

## 5.2 Camada 1 – Ingestão e Pré-processamento

O FW-PKM aceita múltiplos formatos de entrada representativos da produção de escritores: texto simples (`.txt`, `.md`), documentos de processador de texto (`.docx`), epubs (`.epub`) e fichas estruturadas em JSON/YAML. Para cada documento ingerido, são realizadas as seguintes operações:

**Segmentação semântica com sobreposição:** O texto é dividido em chunks de 256-512 tokens com sobreposição de 10% (overlapping windows). A sobreposição garante que contexto próximo às fronteiras de chunk não seja perdido durante a recuperação. O tamanho ótimo do chunk para textos ficcionais — determinado empiricamente com base no survey Vector DB Survey (2025) — é de 384 tokens, equilibrando granularidade semântica e cobertura contextual.

**Extração de entidades ficcionais:** O módulo NER literário (baseado no pipeline da Tese 01 desta pesquisa — Silva; Moro, 2024; Canário et al., 2025) identifica personagens, locais, objetos, eventos e conceitos do universo ficcional em cada chunk, anotando-os como metadados estruturados associados ao chunk.

**Detecção de tipo de conteúdo:** O sistema distingue entre texto narrativo (capítulos do romance), notas de world-building (fichas de personagem, regras do universo), planejamento (outline, notas de estrutura) e referências de pesquisa, aplicando estratégias de indexação específicas para cada tipo.

## 5.3 Camada 2 – Indexação Híbrida

A indexação híbrida combina dois paradigmas complementares para maximizar a cobertura de recuperação:

**Índice denso (vetorial):** Para cada chunk, é gerado um embedding denso de 768 dimensões usando o modelo `multilingual-e5-base` (Wang et al., 2024) ou `mxbai-embed-large`, executando localmente via llama.cpp. O modelo multilíngue é essencial para suportar textos em português de forma nativa, sem dependência de tradução. Os embeddings são armazenados no SQLite-VSS com índice HNSW (parâmetros M=16, ef_construction=200), que oferece busca de vizinhos mais próximos com complexidade O(log N) e recall@10 superior a 95% para bases de até 10M vetores (LLM-Vector DB Survey, 2024).

**Índice esparso BM25:** Para cada chunk, é construído um índice invertido BM25 (Best Match 25) usando tokenização com stemming em português. O índice esparso é especialmente eficaz para recuperar chunks que contêm nomes próprios específicos do universo ficcional — como nomes de personagens, locais inventados e artefatos — que podem não ter representação adequada nos embeddings densos treinados em corpus genérico.

**Fusão por Reciprocal Rank Fusion (RRF):** Os resultados das buscas densa e esparsa são fundidos usando o algoritmo RRF (Cormack et al., 2009 *apud* Vector DB Survey, 2025): cada documento recebe um score combinado de $\frac{1}{k + r_{denso}} + \frac{1}{k + r_{esparso}}$, onde $r$ é o rank do documento em cada lista e $k=60$ é um parâmetro de suavização. O RRF consistentemente supera qualquer uma das buscas individualmente para consultas sobre universos ficcionais, onde os nomes próprios inventados são críticos mas as relações semânticas entre conceitos também importam.

## 5.4 Camada 3 – Grafo de Universo Ficcional (GUF)

O GUF é um grafo de conhecimento local que representa as entidades e relações do universo ficcional criado pelo autor. É construído e atualizado incrementalmente pelo módulo NER literário à medida que novos textos são ingeridos.

**Armazenamento:** O GUF é persistido em SQLite com extensão de grafos (sqlite-graph), sem dependência de servidor de banco de dados externo. Cada nó representa uma entidade (personagem, local, objeto, evento, conceito); cada aresta representa uma relação tipada (parentesco, aliança, inimizade, pertencimento, ocorrência).

**Atualização incremental:** Quando um novo capítulo é ingerido, o módulo de extração de relações identifica novas entidades e relações, atualizando o GUF sem necessidade de reprocessar o corpus completo.

**Consulta por travessia de grafo:** Para consultas sobre múltiplas entidades relacionadas (ex.: "quais personagens participaram do evento X e como suas relações evoluíram depois?"), o motor de recuperação usa a travessia do GUF para expandir o conjunto de chunks relevantes além do que a busca vetorial por similaridade recuperaria. Essa é a contribuição fundamental do GraphRAG (Microsoft Research, 2024) adaptada para operação completamente local.

## 5.5 Camada 4 – Motor de Recuperação Híbrida com GraphRAG Local

O motor de recuperação implementa um pipeline de três etapas:

**Etapa 1 – Análise da consulta:** A consulta em linguagem natural do usuário é analisada para identificar entidades ficcionais mencionadas (via lookup no GUF) e intenção semântica (busca de fato específico, raciocínio sobre relações, recuperação de estado de entidade em ponto temporal).

**Etapa 2 – Recuperação híbrida:** Busca densa + esparsa BM25 com fusão RRF gera uma lista inicial de K=20 chunks mais relevantes para a consulta.

**Etapa 3 – Expansão por GraphRAG:** Para cada entidade identificada na consulta, o motor navega o GUF para recuperar chunks adicionais relacionados às entidades e suas relações. Os chunks expandidos são ranqueados por relevância à consulta e ao contexto do grafo, e os top-N são selecionados como contexto para a geração de resposta.

## 5.6 Camada 5 – Geração de Resposta por SLM On-device

O motor de geração recebe os chunks recuperados como contexto e gera a resposta em linguagem natural usando um Small Language Model (SLM) quantizado executando localmente via llama.cpp. Os modelos testados são:

- **Gemma-2B-IT Q4_K_M:** Menor footprint (1.4GB), latência <2s por resposta em CPU, qualidade adequada para consultas simples.
- **Qwen2.5-3B-Instruct Q4_K_M:** Equilíbrio entre qualidade e velocidade (2.1GB, ~4s em CPU).
- **Phi-3.5-mini-instruct Q4_K_M:** Melhor qualidade para raciocínio sobre relações complexas (2.4GB, ~5s em CPU).

Todos os modelos operam completamente on-device, sem nenhuma transmissão de dados a APIs externas. O sistema inclui rastreamento de proveniência: cada afirmação na resposta gerada é vinculada ao chunk de origem pelo número de documento e parágrafo, permitindo ao usuário verificar a fonte (inspirado no RADIANT-LLM, 2026).

## 5.7 Sincronização Offline-First via CRDT

A base de dados local (SQLite com extensões VSS e grafos) é sincronizada entre dispositivos do autor usando um protocolo CRDT delta-state, transmitindo apenas as alterações incrementais quando a conexão está disponível. A sincronização segue os princípios do manifesto local-first (Kleppmann et al., 2019): o dispositivo local é sempre a fonte primária de verdade; a sincronização é opcional e assíncrona.

Para compartilhamento opcional com co-autores, o FW-PKM oferece sincronização P2P via protocolo Yjs (Shapiro et al., 2011), permitindo que duas instâncias do sistema compartilhem a mesma base de conhecimento com resolução automática de conflitos.

## 5.8 Avaliação de Desempenho Estimada

| Métrica | Alvo | Base Técnica |
|---------|------|--------------|
| Latência de recuperação (500k palavras, 8GB RAM + SSD NVMe) | <200ms | Benchmarks SQLite-VSS (2023) + HNSW |
| Latência de geração (Gemma-2B, CPU) | <3s | llama.cpp benchmarks |
| Latência de geração (Phi-3.5, GPU 8GB) | <1s | llama.cpp benchmarks |
| Pegada de disco por 100k palavras | ~50MB (embeddings + BM25 + GUF) | Vector DB Survey (2025) |
| Precisão@10 busca híbrida vs. apenas densa | +15-25% | RRF benchmarks |
| Recall de entidades ficcionais (busca híbrida) | >85% | Estimado com base em literatura |
