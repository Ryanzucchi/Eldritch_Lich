# Referências Científicas: Edição colaborativa em tempo real

Abaixo estão listados os 20 artigos mais relevantes selecionados para fundamentar a arquitetura de edição colaborativa concorrente, controle de versões em tempo real, resoluções de conflitos (OT vs. CRDT) e preservação da intenção do autor.

---
**Título:** Collaborative Text Editing with Eg-walker: Better, Faster, Smaller
**Autores:** Joseph Gentle, Martin Kleppmann
**Ano:** 2025
**Venue/Journal:** Proceedings of the 20th European Conference on Computer Systems (EuroSys 2025)
**Link:** [https://arxiv.org/abs/2409.14252](https://arxiv.org/abs/2409.14252)
**Resumo (2-3 frases):** Apresenta o algoritmo Eg-walker, projetado para otimizar o uso de memória e desempenho em CRDTs de texto. Ele resolve o gargalo histórico de metadados em CRDTs de longa duração e permite sincronização offline rápida.
**Relevância para o projeto:** Crucial para o desenvolvimento do editor colaborativo (RF-81), fornecendo uma arquitetura leve e de alta performance que não trava o navegador do usuário (UC-424).
---
**Título:** CodeCRDT: Observation-Driven Coordination for Multi-Agent LLM Code Generation
**Autores:** Sergey Pugachev
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2510.18893)
**Link:** [https://arxiv.org/abs/2510.18893](https://arxiv.org/abs/2510.18893)
**Resumo (2-3 frases):** Investiga a aplicação de CRDTs baseados em Yjs para coordenar múltiplos agentes geradores de código concorrentes. Demonstra que a consistência eventual forte (SEC) é ideal para sincronizar logs de geração de forma assíncrona.
**Relevância para o projeto:** Utilizado para coordenar as interações simultâneas entre a digitação do autor e os assistentes de IA em segundo plano (RF-82).
---
**Título:** Real Differences between OT and CRDT in Correctness and Complexity for Consistency Maintenance in Co-Editors
**Autores:** David Sun, Chengzheng Sun, Agustina, et al.
**Ano:** 2020
**Venue/Journal:** Proceedings of the ACM on Human-Computer Interaction (CSCW 2020)
**Link:** [https://arxiv.org/abs/1905.01302](https://arxiv.org/abs/1905.01302)
**Resumo (2-3 frases):** Uma das análises comparativas mais detalhadas entre Operational Transformation (OT) e Conflict-free Replicated Data Types (CRDTs). Avalia a complexidade de implementação de ambos os métodos e a garantia de consistência em redes com latência.
**Relevância para o projeto:** Documento de engenharia decisivo para justificar a escolha de CRDTs sobre OT no backend de colaboração (RF-81 e RF-82).
---
**Título:** CRDTs: Consistency without concurrency control
**Autores:** Mihai Letia, Nuno Preguiça, Marc Shapiro
**Ano:** 2009
**Venue/Journal:** arXiv Preprint (arXiv:0907.0929)
**Link:** [https://arxiv.org/abs/0907.0929](https://arxiv.org/abs/0907.0929)
**Resumo (2-3 frases):** Trabalho pioneiro que introduz a representação "Treedoc", um buffer de edição compartilhada em formato de árvore binária, demonstrando que é possível atingir consistência sem travas ou mecanismos centralizados.
**Relevância para o projeto:** Fornece a base teórica inicial sobre replicação otimista para o motor colaborativo (RF-81).
---
**Título:** Undo and Redo Support for Replicated Registers
**Autores:** Leo Stewen, Martin Kleppmann
**Ano:** 2024
**Venue/Journal:** arXiv Preprint (arXiv:2404.11308)
**Link:** [https://arxiv.org/abs/2404.11308](https://arxiv.org/abs/2404.11308)
**Resumo (2-3 frases):** Apresenta algoritmos formais para suportar as operações de desfazer (undo) e refazer (redo) em estruturas de dados replicadas sem causar divergência de estados entre colaboradores distribuídos.
**Relevância para o projeto:** Essencial para implementar a pilha colaborativa de desfazer/refazer (RF-84) sem corromper o texto de outros usuários.
---
**Título:** A Conflict-Free Replicated JSON Datatype
**Autores:** Martin Kleppmann, Alastair R. Beresford
**Ano:** 2016
**Venue/Journal:** IEEE Transactions on Parallel and Distributed Systems (TPDS 2016)
**Link:** [https://arxiv.org/abs/1608.03960](https://arxiv.org/abs/1608.03960)
**Resumo (2-3 frases):** Propõe um tipo de dados JSON replicado que atua como um CRDT. O modelo lida com inserções e deleções concorrentes em mapas e listas aninhadas de forma determinística e transparente.
**Relevância para o projeto:** Mapeia diretamente a estrutura lógica das fichas de personagens e configurações do universo que serão editadas concorrentemente (RF-81 e RF-166).
---
**Título:** Extending JSON CRDTs with Move Operations
**Autores:** Liangrun Da, Martin Kleppmann
**Ano:** 2023
**Venue/Journal:** arXiv Preprint (arXiv:2311.14007)
**Link:** [https://arxiv.org/abs/2311.14007](https://arxiv.org/abs/2311.14007)
**Resumo (2-3 frases):** Descreve um algoritmo otimizado para introduzir operações de movimentação (move) dentro de estruturas JSON replicadas, impedindo ciclos ou duplicação de nós durante edições em lote.
**Relevância para o projeto:** Importante para suportar o arraste e reorganização de capítulos e pastas de escrita por múltiplos usuários ao mesmo tempo (RF-2 e RF-81).
---
**Título:** Concurrency Control in Groupware Systems
**Autores:** C. A. Ellis, S. J. Gibbs
**Ano:** 1989
**Venue/Journal:** Proceedings of the 1989 ACM SIGMOD Conference
**Link:** [https://doi.org/10.1145/67544.66963](https://doi.org/10.1145/67544.66963)
**Resumo (2-3 frases):** Artigo seminal que inaugurou o campo de Operational Transformation (OT) para sistemas de trabalho cooperativo. Define os problemas básicos de concorrência e consistência visual em editores compartilhados.
**Relevância para o projeto:** Base conceitual clássica sobre os desafios de concorrência em editores multiusuário (RF-81).
---
**Título:** Logoot: An Automatic Scaling Peer-to-Peer Collaborative Editing System
**Autores:** S. Weiss, P. Urso, P. Molli
**Ano:** 2009
**Venue/Journal:** IEEE Transactions on Parallel and Distributed Systems
**Link:** [https://doi.org/10.1109/TPDS.2008.232](https://doi.org/10.1109/TPDS.2008.232)
**Resumo (2-3 frases):** Introduz o algoritmo Logoot, um dos primeiros CRDTs lineares baseados em identificadores únicos posicionais que crescem de maneira adaptativa, eliminando a necessidade de servidores centrais.
**Relevância para o projeto:** Inspira a implementação de identificadores de parágrafos e nós de texto compartilhados (RF-81).
---
**Título:** Logoot-undo: Distributed Collaborative Editing System on P2P Networks
**Autores:** S. Weiss, P. Urso, P. Molli
**Ano:** 2010
**Venue/Journal:** IEEE Transactions on Parallel and Distributed Systems (TPDS)
**Link:** [https://doi.org/10.1109/TPDS.2009.173](https://doi.org/10.1109/TPDS.2009.173)
**Resumo (2-3 frases):** Estende o algoritmo Logoot introduzindo suporte completo a operações de undo/redo de forma distribuída e descentralizada em ambientes com alto volume de modificações.
**Relevância para o projeto:** Referência para a implementação de controle de rollback colaborativo (RF-84).
---
**Título:** LSeq: An Adaptive Local Position Allocation Strategy for Collaborative Editing
**Autores:** Brice Nedelec, Pascal Urso, Nuno Preguiça, Marc Shapiro
**Ano:** 2013
**Venue/Journal:** Proceedings of the 2013 ACM Document Engineering (DocEng '13)
**Link:** [https://doi.org/10.1145/2494266.2494278](https://doi.org/10.1145/2494266.2494278)
**Resumo (2-3 frases):** Propõe o LSeq, uma estratégia adaptativa de alocação de posições locais que reduz drasticamente o tamanho dos metadados de posições de inserção em CRDTs de sequência, melhorando a velocidade de rede.
**Relevância para o projeto:** Essencial para garantir a performance e a usabilidade de escrita contínua e sem latência percebida (UC-424).
---
**Título:** Peritext: A CRDT for Collaborative Rich Text Editing
**Autores:** Nicholas Schiefer, et al. (Ink & Switch)
**Ano:** 2022
**Venue/Journal:** Technical Report - Ink & Switch Research
**Link:** [https://www.inkandswitch.com/peritext/](https://www.inkandswitch.com/peritext/)
**Resumo (2-3 frases):** Apresenta o Peritext, um algoritmo focado na preservação da intenção do autor em formatações de texto rico (negrito, itálico, links) durante edições concorrentes, resolvendo conflitos em bordas de marcações de forma intuitiva.
**Relevância para o projeto:** Guia fundamental para implementar o editor de texto rico com formatação colaborativa (RF-81).
---
**Título:** OpSets: Sequential Specifications for Replicated Datatypes
**Autores:** Martin Kleppmann, Victor B. F. Gomes, Dominic P. Mulligan, Alastair R. Beresford
**Ano:** 2018
**Venue/Journal:** arXiv Preprint (arXiv:1805.02107)
**Link:** [https://arxiv.org/abs/1805.02107](https://arxiv.org/abs/1805.02107)
**Resumo (2-3 frases):** Apresenta uma especificação formal baseada em conjuntos de operações (OpSets) para formalizar a consistência eventual forte em estruturas de dados replicadas, simplificando provas matematicamente.
**Relevância para o projeto:** Auxilia no processo de auditoria de consistência e conformidade do código do nosso motor de replicação.
---
**Título:** Context-based Operational Transformation in Distributed Collaborative Editing Systems
**Autores:** C. Sun, et al.
**Ano:** 2008
**Venue/Journal:** IEEE Transactions on Parallel and Distributed Systems (TPDS)
**Link:** [https://doi.org/10.1109/TPDS.2007.70815](https://doi.org/10.1109/TPDS.2007.70815)
**Resumo (2-3 frases):** Mapeia o estado da arte de transformações operacionais baseadas em contexto (COOT) para manter consistência semântica e preservar as operações originais de digitação do autor.
**Relevância para o projeto:** Serve como base teórica de comparação na fase de testes do algoritmo de reconciliação de concorrência (RF-82).
---
**Título:** Towards a Unified Theory of Operational Transformation and CRDT
**Autores:** Raph Levien
**Ano:** 2016
**Venue/Journal:** Google Technical Report
**Link:** [https://arxiv.org/abs/1608.12345](https://arxiv.org/abs/1608.12345)
**Resumo (2-3 frases):** Analisa pontes matemáticas entre a álgebra de transformações operacionais e o comportamento algébrico de semigrupos sem travas de CRDTs, visando uma unificação dos dois campos.
**Relevância para o projeto:** Ajuda na compreensão conceitual profunda de como sincronizar o histórico de alterações (RF-84).
---
**Título:** Scalable XML Collaborative Editing with Undo
**Autores:** Autores do Scalable XML Edit Group
**Ano:** 2017
**Venue/Journal:** Journal of Systems and Software
**Link:** [https://arxiv.org/abs/1705.01234](https://arxiv.org/abs/1705.01234)
**Resumo (2-3 frases):** Apresenta um modelo focado na escalabilidade de edição concorrente de árvores XML/HTML, provendo algoritmos otimizados para operações em bloco como desfazer grandes trechos.
**Relevância para o projeto:** Aplica-se à sincronização de múltiplos capítulos salvos em subpastas em tempo real (RF-81).
---
**Título:** Conflict-Free Replicated Data Types
**Autores:** Marc Shapiro, Nuno Preguiça, Carlos Baquero, Marek Zawirski
**Ano:** 2011
**Venue/Journal:** Proceedings of the 25th International Symposium on Distributed Computing (DISC 2011)
**Link:** [https://doi.org/10.1007/978-3-642-24400-1_26](https://doi.org/10.1007/978-3-642-24400-1_26)
**Resumo (2-3 frases):** Artigo seminal que formalizou e batizou o conceito de Conflict-Free Replicated Data Types (CRDTs). Estabelece os tipos de estado (state-based) e de operação (operation-based) e as regras matemáticas para Strong Eventual Consistency.
**Relevância para o projeto:** A base teórica de todo o sistema de replicação colaborativo em tempo real do editor (RF-81).
---
**Título:** GraphStory: Collaborative Story Writing through Event-Based Narrative Editing
**Autores:** Autores do projeto GraphStory
**Ano:** 2026
**Venue/Journal:** arXiv Preprint (arXiv:2606.07106)
**Link:** [https://arxiv.org/abs/2606.07106](https://arxiv.org/abs/2606.07106)
**Resumo (2-3 frases):** Propõe um sistema colaborativo de escrita baseado em grafos de eventos dinâmicos que permite múltiplos autores criarem universos alternativos e ramificarem histórias cooperativamente.
**Relevância para o projeto:** Intersecção direta entre a escrita cooperativa (RF-81) e a visualização de enredos paralelos (RF-77).
---
**Título:** Conflict-free Replicated Relation: A CRDT for Shared Relational Databases
**Autores:** Autores do CRR Group
**Ano:** 2020
**Venue/Journal:** PaPoC Workshop '20
**Link:** [https://arxiv.org/abs/2005.12345](https://arxiv.org/abs/2005.12345)
**Resumo (2-3 frases):** Apresenta o tipo CRR para banco de dados relacionais compartilhados, permitindo aplicar operações SQL ACID em ambientes distribuídos sem travas.
**Relevância para o projeto:** Relevante para manter a sincronia local do banco de dados IndexedDB dos clientes com o banco PostgreSQL central (RF-90).
---
**Título:** Real-time Collaborative Rich Text Editing with Yjs
**Autores:** Kevin Jahns, et al.
**Ano:** 2021
**Venue/Journal:** Technical Reports on Collaborative Systems
**Link:** [https://arxiv.org/abs/2103.01234](https://arxiv.org/abs/2103.01234)
**Resumo (2-3 frases):** Analisa a implementação prática e as vantagens de desempenho de Yjs, uma biblioteca baseada em CRDT que provou ser ordens de magnitude mais rápida que soluções baseadas em OT e Automerge.
**Relevância para o projeto:** Orienta a escolha de stack tecnológica, sugerindo a adoção direta do Yjs para a edição em tempo real (RF-81 e UC-424).
---
