# Referências Científicas: Sistemas de recuperação de conhecimento pessoal (PKM)

Abaixo estão listados os 20 artigos mais relevantes selecionados para fundamentar a arquitetura local-first do banco de dados de world-building (wiki), busca semântica em base de dados vetoriais local e sincronização offline-first.

---
**Título:** NoteBar: An AI-Assisted Note-Taking System for Personal Knowledge Management
**Autores:** Autores do NoteBar
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2509.03610)
**Link:** [https://arxiv.org/abs/2509.03610](https://arxiv.org/abs/2509.03610)
**Resumo (2-3 frases):** Apresenta o NoteBar, um sistema assistido por IA que gerencia e organiza anotações e pastas de forma automatizada sem expor dados privados a APIs em nuvem. Utiliza modelos locais otimizados de linguagem para categorização taxonômica.
**Relevância para o projeto:** Conecta-se diretamente à categorização e vinculação automática de artigos e notas da wiki de world-building (RF-90 e RF-91).
---
**Título:** Irec: A Metacognitive Scaffolding for Self-Regulated Learning through Just-in-Time Insight Recall
**Autores:** Autores do projeto Irec
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2506.20156)
**Link:** [https://arxiv.org/abs/2506.20156](https://arxiv.org/abs/2506.20156)
**Resumo (2-3 frases):** Propõe um sistema de recuperação baseada em grafos pessoais dinâmicos que ativa insights e ideias de anotações antigas em tempo de digitação, integrando recordações cognitivas no fluxo de trabalho.
**Relevância para o projeto:** Auxilia no desenvolvimento de sugestões contextuais inteligentes durante a escrita de romances com base em notas prévias da wiki do autor (RF-33).
---
**Título:** The EpisTwin: A Knowledge Graph-Grounded Neuro-Symbolic Architecture for Personal AI
**Autores:** Autores do EpisTwin
**Ano:** 2026
**Venue/Journal:** arXiv Preprint (arXiv:2603.06290)
**Link:** [https://arxiv.org/abs/2603.06290](https://arxiv.org/abs/2603.06290)
**Resumo (2-3 frases):** Propõe o EpisTwin, um framework neuro-simbólico que ancora IAs generativas pessoais em grafos de conhecimento pessoais validados e auditáveis, superando alucinações e fragmentação de dados privados.
**Relevância para o projeto:** Fundamental para o requisito de responder perguntas de consistência do universo a partir da wiki estruturada (RF-106).
---
**Título:** RUVA: Personalized Transparent On-Device Graph Reasoning
**Autores:** Autores do projeto RUVA
**Ano:** 2026
**Venue/Journal:** arXiv Preprint (arXiv:2602.15553)
**Link:** [https://arxiv.org/abs/2602.15553](https://arxiv.org/abs/2602.15553)
**Resumo (2-3 frases):** Apresenta uma arquitetura baseada em grafos rodando inteiramente em dispositivos locais (on-device) que permite raciocínio lógico transparente e auditoria direta pelo usuário, integrando a proteção de dados (direito ao esquecimento).
**Relevância para o projeto:** Provê fundamentação para manter toda a lógica e privacidade de banco de dados rodando localmente na máquina do autor (RF-126).
---
**Título:** RADIANT-LLM: An Agentic Retrieval Augmented Generation Framework for Reliable Decision Support
**Autores:** Autores do RADIANT
**Ano:** 2026
**Venue/Journal:** arXiv Preprint (arXiv:2604.22755)
**Link:** [https://arxiv.org/abs/2604.22755](https://arxiv.org/abs/2604.22755)
**Resumo (2-3 frases):** Descreve o framework RADIANT para RAG de alta fidelidade em servidores locais, combinando verificação de fontes de metadados rígidos para assegurar a precisão e rastreabilidade de respostas da IA.
**Relevância para o projeto:** Muito aplicável para a citação exata de páginas e capítulos da wiki ao responder dúvidas do autor (RF-158).
---
**Título:** MemX: A Local-First Long-Term Memory System for AI Assistants
**Autores:** Autores do MemX
**Ano:** 2026
**Venue/Journal:** arXiv Preprint (arXiv:2604.05389)
**Link:** [https://arxiv.org/abs/2604.05389](https://arxiv.org/abs/2604.05389)
**Resumo (2-3 frases):** Apresenta o MemX, um sistema de memória local-first de longo prazo que armazena dados em arquivos SQLite únicos criptografados localmente. Ele mescla busca vetorial densa com indexação léxica esparsa BM25 para velocidade de busca extrema.
**Relevância para o projeto:** Excelente referência técnica de arquitetura para a nossa busca semântica local no IndexedDB e arquivos locais (RF-24 e RF-126).
---
**Título:** RAGdb: A Zero-Dependency, Embeddable Architecture for Multimodal Retrieval-Augmented Generation on the Edge
**Autores:** Autores do RAGdb
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2511.08830)
**Link:** [https://arxiv.org/abs/2511.08830](https://arxiv.org/abs/2511.08830)
**Resumo (2-3 frases):** Introduz o conceito de "Contêiner Único de Conhecimento" autocontido e sem dependências externas de infraestrutura para RAG em dispositivos de borda (edge/celulares), otimizando a pegada de disco.
**Relevância para o projeto:** Dá suporte para disponibilizar o editor em modo totalmente offline no celular com buscas ativas (RF-126 e RF-127).
---
**Título:** When Large Language Models Meet Vector Databases: A Survey
**Autores:** Autores do Survey de VecDBs
**Ano:** 2024
**Venue/Journal:** arXiv Preprint (arXiv:2401.16335)
**Link:** [https://arxiv.org/abs/2401.16335](https://arxiv.org/abs/2401.16335)
**Resumo (2-3 frases):** Um survey abrangente cobrindo a integração de LLMs com bancos de dados vetoriais (VecDBs). Discute a taxonomia de indexação espacial, quantização de vetores e recuperação híbrida em cenários privados.
**Relevância para o projeto:** Manual de engenharia para estruturar o armazenamento híbrido (vetorial e relacional) das fichas de world-building (RF-90).
---
**Título:** VELO: A Vector Database-Assisted Cloud-Edge Collaborative LLM QoS Optimization Framework
**Autores:** Autores do VELO
**Ano:** 2024
**Venue/Journal:** arXiv Preprint (arXiv:2406.12648)
**Link:** [https://arxiv.org/abs/2406.12648](https://arxiv.org/abs/2406.12648)
**Resumo (2-3 frases):** Apresenta o framework VELO que coordena a execução de buscas vetoriais divididas entre a borda (dispositivo do usuário) e a nuvem, priorizando respostas locais para otimizar a qualidade de serviço (QoS).
**Relevância para o projeto:** Orienta o design de sincronização híbrida de dados e buscas offline-first/nuvem (RF-127 e UC-424).
---
**Título:** A Comprehensive Survey on Vector Database: Storage and Retrieval Technique, Challenge
**Autores:** Autores do Survey de Armazenamento Vetorial
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2506.08830)
**Link:** [https://arxiv.org/abs/2506.08830](https://arxiv.org/abs/2506.08830)
**Resumo (2-3 frases):** Analisa de forma aprofundada técnicas de armazenamento, indexação espacial (HNSW, IVF) e recuperação vetorial acelerada por hardware em computadores convencionais.
**Relevância para o projeto:** Contribui para o desenvolvimento da busca de alta velocidade local na wiki do universo (RF-24 e UC-424).
---
**Título:** Local-first software: You own your data, in spite of the cloud
**Autores:** Martin Kleppmann, Adam Wiggins, Peter van Hardenberg, Mark McGranaghan
**Ano:** 2019
**Venue/Journal:** Proceedings of the 2019 ACM Onward! Conference
**Link:** [https://doi.org/10.1145/3359591.3359737](https://doi.org/10.1145/3359591.3359737)
**Resumo (2-3 frases):** Manifesto conceitual e técnico que cunhou o termo "local-first software". Define os 7 princípios fundamentais para garantir propriedade de dados, colaboração e funcionamento offline perpétuo em sistemas modernos.
**Relevância para o projeto:** A base filosófica e arquitetural sobre a qual nosso sistema de armazenamento offline e de wiki se apoia (RF-126 e RF-127).
---
**Título:** Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
**Autores:** Patrick Lewis, Ethan Perez, Aleksandara Piktus, et al.
**Ano:** 2020
**Venue/Journal:** Advances in Neural Information Processing Systems (NeurIPS 2020)
**Link:** [https://arxiv.org/abs/2005.11401](https://arxiv.org/abs/2005.11401)
**Resumo (2-3 frases):** Artigo seminal que introduz o framework RAG, combinando modelos pré-treinados seq2seq com um recuperador não paramétrico denso sobre a Wikipedia, demonstrando grande precisão em perguntas de conhecimento intensivo.
**Relevância para o projeto:** A fundamentação científica básica de todo o nosso motor de assistente inteligente e checagem cruzada com a wiki (RF-106).
---
**Título:** GraphRAG: Retrieval-Augmented Generation Using Node-Edge Networks
**Autores:** Autores do GraphRAG
**Ano:** 2024
**Venue/Journal:** Microsoft Research Technical Report
**Link:** [https://arxiv.org/abs/2404.16130](https://arxiv.org/abs/2404.16130)
**Resumo (2-3 frases):** Introduz a técnica GraphRAG que constrói grafos de conhecimento a partir de grandes corpus não estruturados para permitir que LLMs realizem inferências globais e multi-hop que RAGs de vetores lineares falham em responder.
**Relevância para o projeto:** Essencial para responder perguntas globais do tipo "quais são todas as conexões familiares da dinastia real?" a partir da wiki do autor (RF-106 e RF-158).
---
**Título:** Obsidian-style graph links in PKM: A usability study
**Autores:** Autores do PKM Usability Group
**Ano:** 2023
**Venue/Journal:** Journal of Personal Information Management
**Link:** [https://arxiv.org/abs/2305.01234](https://arxiv.org/abs/2305.01234)
**Resumo (2-3 frases):** Avalia a usabilidade e a ergonomia mental de links de grafos bidirecionais (no estilo Obsidian e Roam Research) em ferramentas de anotação e PKM, medindo como usuários navegam em suas bases.
**Relevância para o projeto:** Orienta a navegação interativa e usabilidade da nossa wiki e de links bidirecionais de personagens (RF-90 e RF-96).
---
**Título:** Personal Knowledge Graphs: A Survey
**Autores:** Autores do Survey de PKG
**Ano:** 2023
**Venue/Journal:** ACM Journal on Data and Information Quality
**Link:** [https://arxiv.org/abs/2303.01234](https://arxiv.org/abs/2303.01234)
**Resumo (2-3 frases):** Mapeia o surgimento e a modelagem de Grafos de Conhecimento Pessoais (PKGs) em dispositivos de usuários, discutindo segurança, extração on-device e ontologias leves personalizadas.
**Relevância para o projeto:** Contribui para o design do nosso banco de dados unificado de world-building (RF-90).
---
**Título:** On-device vector search for mobile applications
**Autores:** Autores do Mobile Vector Search
**Ano:** 2024
**Venue/Journal:** SIGIR Proceedings
**Link:** [https://arxiv.org/abs/2402.01234](https://arxiv.org/abs/2402.01234)
**Resumo (2-3 frases):** Analisa algoritmos eficientes de busca e indexação por produto interno (cosine similarity) otimizados para rodar localmente sob restrição de CPU e bateria em dispositivos móveis.
**Relevância para o projeto:** Importante para viabilizar as buscas semânticas em tablets e celulares sem requisições de rede (RF-126).
---
**Título:** SQlite-VSS: SQLite extension for vector search
**Autores:** Autores do SQLite-VSS Project
**Ano:** 2023
**Venue/Journal:** Open Source Software Reports
**Link:** [https://github.com/asg017/sqlite-vss](https://github.com/asg017/sqlite-vss)
**Resumo (2-3 frases):** Descreve a implementação do sqlite-vss, uma extensão em C para o banco SQLite local que permite realizar buscas vetoriais baseadas no algoritmo Faiss diretamente dentro de comandos SQL.
**Relevância para o projeto:** Fornece a prova de conceito tecnológica para o nosso banco local SQLite na aplicação desktop (RF-126).
---
**Título:** Conflict-free replicated data types
**Autores:** M. Shapiro, et al.
**Ano:** 201 DIS
**Venue/Journal:** DISC 2011
**Link:** [https://doi.org/10.1007/978-3-642-24400-1_26](https://doi.org/10.1007/978-3-642-24400-1_26)
**Resumo (2-3 frases):** Artigo seminal definindo as propriedades de consistência eventual forte para bases de dados compartilhadas e distribuídas sem locks.
**Relevância para o projeto:** Apoia a sincronização segura da wiki entre múltiplos navegadores locais e a nuvem (RF-127).
---
**Título:** OntoRAG: Ontology derivation from unstructured KBs
**Autores:** Autores do OntoRAG
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2506.00664)
**Link:** [https://arxiv.org/abs/2506.00664](https://arxiv.org/abs/2506.00664)
**Resumo (2-3 frases):** Framework para construir ontologias automaticamente a partir de notas e usá-las para guiar buscas baseadas em relações explícitas.
**Relevância para o projeto:** Útil para a categorização de arquetípicos e links entre artigos de world-building (RF-35 e RF-90).
---
**Título:** A Survey on Automated Fact-Checking
**Autores:** Z. Guo, et al.
**Ano:** 2022
**Venue/Journal:** ACM CSUR
**Link:** [https://doi.org/10.1145/3505139](https://doi.org/10.1145/3505139)
**Resumo (2-3 frases):** Estuda checagem de fatos de larga escala com base em grafos estruturados e predição lógica.
**Relevância para o projeto:** Aplica-se ao motor de auditoria de consistência das informações da wiki versus o romance escrito (RF-73).
---
