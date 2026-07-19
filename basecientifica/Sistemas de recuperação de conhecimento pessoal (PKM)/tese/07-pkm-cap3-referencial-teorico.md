# 3 REFERENCIAL TEÓRICO E REVISÃO SISTEMÁTICA

## 3.1 Fundamentos Conceituais

### 3.1.1 Personal Knowledge Management (PKM)

O gerenciamento de conhecimento pessoal (PKM) tem raízes na gestão do conhecimento organizacional (KM), mas foca no indivíduo como agente central de criação, curadoria e recuperação de informação. O survey de Personal Knowledge Graphs (PKG Survey, 2023) apresenta uma taxonomia abrangente dos sistemas PKM, distinguindo entre sistemas baseados em notas (Obsidian, Roam Research, Notion), sistemas baseados em grafos de conhecimento pessoal (PKGs) e sistemas baseados em memória de longo prazo para agentes de IA (MemX, 2026).

Para escritores de ficção, o PKM assume características especiais: a base de conhecimento é fundamentalmente ficcional e internamente consistente, não factual; o volume de informação é muito alto (milhares de entidades interconectadas); e a privacidade é primordial, pois o material é propriedade intelectual sensível.

### 3.1.2 Retrieval-Augmented Generation (RAG)

O paradigma RAG, formalizado por Lewis et al. (2020), combina modelos de linguagem generativos com um recuperador de informação: ao invés de depender exclusivamente do conhecimento parametrizado no LLM, o sistema recupera documentos relevantes de uma base de conhecimento e os fornece como contexto adicional ao modelo generativo. Isso permite respostas mais precisas, atualizadas e verificáveis em relação a bases de conhecimento externas ao modelo.

A extensão GraphRAG (Microsoft Research, 2024) representa uma evolução significativa do RAG convencional: em vez de recuperar chunks de texto por similaridade semântica, o GraphRAG navega por um grafo de conhecimento construído a partir dos documentos, recuperando não apenas os chunks mais relevantes, mas também as entidades e relações conectadas a eles. Essa abordagem é especialmente eficaz para consultas que envolvem múltiplas entidades interconectadas — exatamente o tipo de consulta mais comum em universos ficcionais complexos ("quais personagens foram afetados pela batalha de X e como suas relações com Y mudaram depois?").

O framework OntoRAG (2025) estende essa perspectiva ao propor a extração automática de uma ontologia a partir de documentos não estruturados como base para o RAG, automatizando a construção do grafo de conhecimento que alimenta o sistema de recuperação.

### 3.1.3 Busca Vetorial e Bancos de Dados Vetoriais

A busca vetorial por similaridade semântica utiliza embeddings — representações numéricas densas de alta dimensão (tipicamente 768-3072 dimensões) que capturam o significado semântico de trechos de texto. A busca eficiente de vizinhos mais próximos (ANN — Approximate Nearest Neighbors) em espaços de alta dimensão é o problema central dos bancos de dados vetoriais.

O Survey LLM-Vector DB (2024) oferece uma revisão abrangente das técnicas de indexação ANN disponíveis, com destaque para:

**HNSW (Hierarchical Navigable Small World):** O algoritmo de indexação ANN mais eficiente em termos de velocidade de busca, amplamente adotado em produção (utilizado por pgvector, Qdrant, ChromaDB). Opera com complexidade de busca O(log N) e oferece excelente balanço entre velocidade e precisão.

**IVF (Inverted File Index):** Técnica baseada em clusterização do espaço vetorial. Menos eficiente que HNSW para buscas exatas, mas com menor overhead de memória.

O SQLite-VSS (2023) é uma extensão de código aberto que adiciona capacidade de busca vetorial ao SQLite, o banco de dados mais amplamente implantado do mundo. Sua relevância para arquiteturas local-first é fundamental: permite implementar busca vetorial em um único arquivo de banco de dados, sem necessidade de serviços adicionais, com performance aceitável para bases de conhecimento de até milhões de vetores.

O Vector DB Survey (2025) oferece um panorama atualizado das opções disponíveis, incluindo soluções embeddable (SQLite-VSS, LanceDB, DuckDB-vss) e soluções de servidor (Qdrant, Weaviate, Milvus). Para arquiteturas local-first, as soluções embeddable são claramente superiores.

O framework VELO (2024) propõe uma arquitetura híbrida cloud-edge para otimização de QoS em buscas vetoriais com LLMs, relevante para cenários onde a sincronização opcional com a nuvem é desejável mas não obrigatória.

### 3.1.4 Software Local-First

O manifesto local-first de Kleppmann et al. (2019) estabelece sete ideias que definem o paradigma: velocidade (operações locais instantâneas), múltiplos dispositivos (sincronização entre dispositivos), offline (funcionalidade sem rede), colaboração (suporte a múltiplos usuários), longevidade (dados acessíveis mesmo sem software proprietário), privacidade (dados do usuário no dispositivo do usuário) e controle do usuário (propriedade dos dados).

O trabalho RAGdb (2025) implementa um sistema RAG com zero dependências externas e pegada de disco mínima, operando completamente na borda (edge), sem nenhuma chamada a APIs externas. O RAGdb demonstra que é tecnicamente viável construir sistemas RAG de alta performance completamente locais, desafiando o pressuposto de que RAG de qualidade requer infraestrutura de nuvem.

### 3.1.5 Sistemas PKM com IA

O NoteBar (2025) propõe um sistema de tomada de notas assistido por IA que integra sumarização automática, vinculação de conceitos e recuperação semântica, mantendo os dados localmente. O Irec (2025) foca em recordação de insights em momentos contextualmente relevantes (just-in-time insight recall), usando modelos de aprendizagem espaçada para surfaçar informações relevantes no momento certo.

O EpisTwin (2026) proposta uma arquitetura neurossimbólica baseada em grafos de conhecimento para assistentes pessoais de IA, integrando raciocínio lógico (simbólico) com capacidades de geração de linguagem (neural). O RUVA (2026) desenvolve um sistema de raciocínio personalizado em dispositivo (on-device) baseado em grafos, com transparência total sobre o processo de recuperação de informação.

O MemX (2026) propõe um sistema de memória de longo prazo para assistentes de IA que opera localmente, persistindo contexto entre sessões e recuperando memórias relevantes por similaridade semântica — diretamente relevante para sistemas de apoio à escrita que precisam manter contexto sobre o universo ficcional ao longo de meses de trabalho.

O RADIANT-LLM (2026) apresenta um framework RAG agnóstico para suporte a decisão confiável, com mecanismos de verificação de qualidade das respostas geradas — relevante para garantir que as respostas do sistema sobre o universo ficcional sejam verificáveis e rastreáveis ao texto fonte.

### 3.1.6 Grafos de Conhecimento Pessoais

O PKG Survey (2023) e o PKM Usability study (2023, Obsidian-style) fornecem evidências empíricas de que sistemas PKM baseados em grafos melhoram significativamente a qualidade do processo criativo de escritores, especialmente quando os links entre notas são baseados em relações semânticas além da simples co-ocorrência de palavras-chave. O Mobile Vector Search (2024) demonstra a viabilidade de busca vetorial em dispositivos móveis — relevante para escritores que trabalham em tablets e smartphones.

O trabalho de Shapiro et al. (2011) sobre CRDTs fornece as bases para a sincronização offline-first da base de conhecimento entre múltiplos dispositivos do mesmo autor, sem necessidade de servidor central.

O Guo et al. (2022) sobre verificação automática de fatos fornece técnicas adaptáveis para verificação de consistência interna nas respostas geradas pelo sistema RAG sobre o universo ficcional.

## 3.2 Tabela Comparativa dos Trabalhos

| # | Autor/Projeto | Ano | Categoria | Local-First | Grafo | Privacidade | Domínio Ficcional |
|---|---------------|-----|-----------|------------|-------|------------|-------------------|
| 1 | NoteBar | 2025 | PKM+IA | Sim | Não | Alta | Não |
| 2 | Irec | 2025 | PKM | Parcial | Não | Alta | Não |
| 3 | EpisTwin | 2026 | PKM+Grafo | Sim | Sim | Alta | Não |
| 4 | RUVA | 2026 | PKM on-device | Sim | Sim | Total | Não |
| 5 | RADIANT-LLM | 2026 | RAG | Não | Não | Baixa | Não |
| 6 | MemX | 2026 | Memória IA | Sim | Não | Alta | Não |
| 7 | RAGdb | 2025 | RAG edge | Sim | Não | Total | Não |
| 8 | LLM-Vector DB Survey | 2024 | Survey | N/A | N/A | N/A | Não |
| 9 | VELO | 2024 | Vetorial edge | Híbrido | Não | Média | Não |
| 10 | Vector DB Survey | 2025 | Survey | N/A | N/A | N/A | Não |
| 11 | Kleppmann et al. (local-first) | 2019 | Filosofia | Total | Não | Total | Não |
| 12 | Lewis et al. (RAG) | 2020 | RAG | Não | Não | Baixa | Não |
| 13 | GraphRAG | 2024 | RAG+Grafo | Não | Sim | Baixa | Não |
| 14 | PKM Usability | 2023 | Usabilidade | Sim | Sim | Alta | Parcial |
| 15 | PKG Survey | 2023 | Survey PKG | N/A | Sim | N/A | Não |
| 16 | Mobile Vector Search | 2024 | Vetorial mobile | Sim | Não | Alta | Não |
| 17 | SQLite-VSS | 2023 | Infraestrutura | Sim | Não | Total | Não |
| 18 | Shapiro et al. (CRDTs) | 2011 | Sinc. local | Sim | Não | Total | Não |
| 19 | OntoRAG | 2025 | RAG+Ontologia | Parcial | Sim | Média | Não |
| 20 | Guo et al. (Fact-Checking) | 2022 | Verificação | Não | Não | Baixa | Não |

## 3.3 Análise Crítica e Lacunas

**Lacuna Principal:** Nenhum sistema existente combina simultaneamente: (a) operação completamente local, (b) GraphRAG para recuperação baseada em grafos, (c) adaptação para o domínio ficcional e (d) sincronização offline-first via CRDT. O FW-PKM proposto preenche todas essas lacunas.

**Lacuna de domínio ficcional:** Todos os sistemas PKM revisados pressupõem que o conhecimento gerenciado é factual (verificável no mundo real). Para universos ficcionais, a "verdade" é interna ao universo criado pelo autor, o que exige estratégias específicas de indexação, recuperação e verificação de consistência.

**Lacuna de privacidade em RAG:** Os sistemas RAG de alto desempenho (GraphRAG da Microsoft) dependem de APIs proprietárias. O RAGdb (2025) demonstra a viabilidade de RAG local, mas não inclui suporte a GraphRAG nem adaptação para domínios ficcionais.

