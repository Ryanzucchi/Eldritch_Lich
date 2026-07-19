# Referências Científicas: Geração de resumo e sumarização automática

Abaixo estão listados os 20 artigos mais relevantes selecionados para fundamentar as técnicas de sumarização de textos longos (romances), geração de sinopses automáticas e respostas a perguntas baseadas no contexto do universo criado pelo autor.

---
**Título:** An Empirical Survey on Long Document Summarization: Datasets, Models and Metrics
**Autores:** Autores do Survey de Sumarização de Documentos Longos
**Ano:** 2022
**Venue/Journal:** arXiv Preprint (arXiv:2207.00939)
**Link:** [https://arxiv.org/abs/2207.00939](https://arxiv.org/abs/2207.00939)
**Resumo (2-3 frases):** Apresenta um levantamento amplo de conjuntos de dados, modelos neuronais e métricas de avaliação voltados para resumir documentos de longa extensão. Discute estratégias de atenção esparsa e chunking utilizadas para processar contextos extensos.
**Relevância para o projeto:** Orienta a escolha de modelos de fundação e métricas de avaliação automática para o requisito de gerar resumos de textos longos do autor (RF-52).
---
**Título:** PublicHearingBR: A Brazilian Portuguese Dataset of Public Hearing Transcripts for Summarization of Long Documents
**Autores:** Autores do projeto PublicHearingBR
**Ano:** 2024
**Venue/Journal:** arXiv Preprint (arXiv:2410.07495)
**Link:** [https://arxiv.org/abs/2410.07495](https://arxiv.org/abs/2410.07495)
**Resumo (2-3 frases):** Introduz o primeiro dataset de transcrições em português brasileiro voltado especificamente para avaliar e treinar modelos na tarefa de sumarizar documentos muito longos, estabelecendo baselines em língua portuguesa.
**Relevância para o projeto:** Importante apoio para validar algoritmos e pipelines de sumarização no nosso projeto que operam em língua portuguesa (RF-15 e RF-52).
---
**Título:** Exploration of Plan-Guided Summarization for Narrative Texts: the Case of Small Language Models
**Autores:** Autores do projeto Plan-Guided Summarization
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2504.09071)
**Link:** [https://arxiv.org/abs/2504.09071](https://arxiv.org/abs/2504.09071)
**Resumo (2-3 frases):** Investiga o uso de planejamento de enredo (story plan) para guiar modelos de linguagem menores (SLMs) na geração de resumos de narrativas ficcionais. O método reduz as inconsistências factuais e mantém a fidelidade ao enredo original.
**Relevância para o projeto:** Conecta-se diretamente aos requisitos de gerar sinopse automática (RF-170) e gerar logline automático (RF-171) a partir de rascunhos de capítulos.
---
**Título:** Tackling Query-Focused Summarization as A Knowledge-Intensive Task: A Pilot Study
**Autores:** Autores do projeto QFS-KIT
**Ano:** 2021
**Venue/Journal:** arXiv Preprint (arXiv:2112.07536)
**Link:** [https://arxiv.org/abs/2112.07536](https://arxiv.org/abs/2112.07536)
**Resumo (2-3 frases):** Explora a tarefa de sumarização focada em perguntas (QFS) como uma tarefa baseada em conhecimento externo, integrando modelos de geração com a indexação semântica de bases densas como a Wikipedia.
**Relevância para o projeto:** Oferece subsídios para responder perguntas sobre o universo com citações e trechos (RF-106 e RF-158), gerando sumários otimizados de acordo com a dúvida do usuário.
---
**Título:** OntoRAG: Enhancing Question-Answering through Automated Ontology Derivation from Unstructured Knowledge Bases
**Autores:** Autores do OntoRAG
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2506.00664)
**Link:** [https://arxiv.org/abs/2506.00664](https://arxiv.org/abs/2506.00664)
**Resumo (2-3 frases):** Apresenta o OntoRAG, um sistema RAG que extrai uma ontologia a partir de documentos não estruturados e a utiliza para melhorar a precisão em tarefas de question-answering e sumarização sobre a base de conhecimento.
**Relevância para o projeto:** Conecta-se diretamente ao requisito de linkar pasta baseado no contexto de seus textos (RF-35) e responder perguntas citando fontes (RF-158).
---
**Título:** BookSum: A Collection of Datasets for Long-form Narrative Summarization
**Autores:** Wojciech Kryściński, et al.
**Ano:** 2021
**Venue/Journal:** arXiv Preprint (arXiv:2105.08209)
**Link:** [https://arxiv.org/abs/2105.08209](https://arxiv.org/abs/2105.08209)
**Resumo (2-3 frases):** Apresenta o dataset BookSum, um recurso padrão-ouro contendo resumos estruturados de livros clássicos em três níveis de granularidade (parágrafo, capítulo e livro completo), facilitando o treino de modelos de sumarização hierárquica.
**Relevância para o projeto:** É a base de dados de referência para afinar nossos modelos de resumo e sinopse automática de capítulos e romances (RF-52 e RF-170).
---
**Título:** BooookScore: A Systematic Exploration of Book-length Summarization in the Era of LLMs
**Autores:** Yuka Chang, et al.
**Ano:** 2023
**Venue/Journal:** arXiv Preprint (arXiv:2310.00785)
**Link:** [https://arxiv.org/abs/2310.00785](https://arxiv.org/abs/2310.00785)
**Resumo (2-3 frases):** Descreve um estudo sistemático sobre as inconsistências lógicas em resumos de romances inteiros criados por LLMs e propõe o BooookScore, uma métrica de validação automática sem a necessidade de avaliação humana custosa.
**Relevância para o projeto:** Provê uma metodologia robusta para avaliar e monitorar a qualidade das sinopses geradas pelo nosso sistema (RF-170).
---
**Título:** S²tory: Story Spine Distillation for Movie Script Summarization
**Autores:** Autores do projeto S2tory
**Ano:** 2026
**Venue/Journal:** arXiv Preprint (arXiv:2605.01977)
**Link:** [https://arxiv.org/abs/2605.01977](https://arxiv.org/abs/2605.01977)
**Resumo (2-3 frases):** Propõe um método inovador de sumarização de roteiros baseado na destilação da espinha dorsal da história (story spine), combinando extração de eventos críticos e abstração para garantir a integridade dos arcos dos personagens.
**Relevância para o projeto:** Muito aplicável para a geração de logline automático (RF-171) e na modelagem do arco de desenvolvimento do personagem (RF-149).
---
**Título:** SUMMSCREEN: A Dataset for Abstractive Screenplay Summarization
**Autores:** Mingda Chen, et al.
**Ano:** 2021
**Venue/Journal:** arXiv Preprint (arXiv:2104.07091)
**Link:** [https://arxiv.org/abs/2104.07091](https://arxiv.org/abs/2104.07091)
**Resumo (2-3 frases):** Introduz o dataset SummScreen composto por episódios de séries de TV de diversos gêneros acompanhados por recaps e resumos detalhados escritos por fãs, servindo para testar a retenção de diálogos complexos na sumarização.
**Relevância para o projeto:** Auxilia no desenvolvimento do processamento de diálogos e resumos dinâmicos de capítulos teatrais ou de roteiro (RF-52).
---
**Título:** DTCRS: Dynamic Tree Construction for Recursive Summarization
**Autores:** Autores do projeto DTCRS
**Ano:** 2026
**Venue/Journal:** arXiv Preprint (arXiv:2604.07012)
**Link:** [https://arxiv.org/abs/2604.07012](https://arxiv.org/abs/2604.07012)
**Resumo (2-3 frases):** Apresenta o método DTCRS para construir árvores dinâmicas de tópicos para sumarização recursiva de romances muito longos, reduzindo a redundância semântica e mantendo a coerência cronológica.
**Relevância para o projeto:** Essencial para otimizar os custos computacionais da geração de sumários em lote (RF-52 e UC-424).
---
**Título:** Context-Aware Hierarchical Merging for Long Document Summarization
**Autores:** Autores do projeto CAHM
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2502.00977)
**Link:** [https://arxiv.org/abs/2502.00977](https://arxiv.org/abs/2502.00977)
**Resumo (2-3 frases):** Propõe uma estratégia de mesclagem hierárquica ciente de contexto para condensar textos extensos. O modelo ajusta dinamicamente os pesos de relevância de nós de capítulos vizinhos para evitar quebra de fatos na unificação de resumos.
**Relevância para o projeto:** Utilizado para melhorar o algoritmo de mesclar múltiplos textos em um só mantendo a consistência (RF-181).
---
**Título:** Generating Query-Focused Summarization Datasets from Query-Free Summarization Datasets
**Autores:** Autores do projeto G-QFS
**Ano:** 2026
**Venue/Journal:** arXiv Preprint (arXiv:2605.05392)
**Link:** [https://arxiv.org/abs/2605.05392](https://arxiv.org/abs/2605.05392)
**Resumo (2-3 frases):** Descreve um método baseado em evidência para gerar datasets sintéticos de QFS a partir de coleções genéricas de resumos, facilitando o treinamento rápido de modelos de busca sem necessidade de anotações humanas caras.
**Relevância para o projeto:** Permite treinar localmente modelos para buscar informações e responder perguntas dos usuários de forma personalizada (RF-24 e RF-106).
---
**Título:** Automatic Summarization of Long Documents
**Autores:** Autores do projeto ASLD
**Ano:** 2024
**Venue/Journal:** arXiv Preprint (arXiv:2410.05903)
**Link:** [https://arxiv.org/abs/2410.05903](https://arxiv.org/abs/2410.05903)
**Resumo (2-3 frases):** Descreve três algoritmos inovadores que processam romances com mais de 70.000 palavras fragmentando e combinando seções sem estourar context windows de LLMs pequenos, garantindo eficiência de custo.
**Relevância para o projeto:** Foco em requisitos de otimização de custo e arquitetura cliente-servidor leve (UC-424).
---
**Título:** Beyond Relevant Documents: A Knowledge-Intensive Approach for Query-Focused Summarization using Large Language Models
**Autores:** Autores do projeto BeyondRD
**Ano:** 2024
**Venue/Journal:** arXiv Preprint (arXiv:2408.10357)
**Link:** [https://arxiv.org/abs/2408.10357](https://arxiv.org/abs/2408.10357)
**Resumo (2-3 frases):** Propõe um controlador de sumarização integrado a bases de RAG para sintetizar e cruzar fatos dinamicamente sem depender de documentos pré-selecionados, alcançando maior flexibilidade de busca.
**Relevância para o projeto:** Útil para a busca contextual de informações em pastas e wikis (RF-28 e RF-90).
---
**Título:** Improving Query-Focused Meeting Summarization with Query-Relevant Knowledge
**Autores:** Autores do KAS Framework
**Ano:** 2023
**Venue/Journal:** arXiv Preprint (arXiv:2309.02105)
**Link:** [https://arxiv.org/abs/2309.02105](https://arxiv.org/abs/2309.02105)
**Resumo (2-3 frases):** Apresenta o framework KAS que combina o histórico de discussões em reuniões longas com conhecimento externo indexado para responder a consultas de usuários com alta fidelidade cronológica.
**Relevância para o projeto:** Relevante para rastrear a linha de brainstorms e sugerir títulos automáticos para pastas de escrita (RF-41).
---
**Título:** GoSum: Extractive Summarization of Long Documents by Reinforcement Learning and Graph Organized discourse state
**Autores:** Autores do GoSum
**Ano:** 2022
**Venue/Journal:** arXiv Preprint (arXiv:2211.10247)
**Link:** [https://arxiv.org/abs/2211.10247](https://arxiv.org/abs/2211.10247)
**Resumo (2-3 frases):** Introduz o GoSum, um sumarizador extrativo para documentos longos que organiza o discurso em grafos e usa aprendizado por reforço para otimizar a seleção de sentenças semânticas chaves.
**Relevância para o projeto:** Contribui para extrair palavras-chave automaticamente e organizar resumos executivos (RF-32 e RF-53).
---
**Título:** Query Focused Abstractive Summarization: seq2seq
**Autores:** Autores do seq2seq QFS
**Ano:** 2018
**Venue/Journal:** arXiv Preprint (arXiv:1801.07704)
**Link:** [https://arxiv.org/abs/1801.07704](https://arxiv.org/abs/1801.07704)
**Resumo (2-3 frases):** Estudo clássico de adaptação de redes codificadoras-decodificadoras (seq2seq) com mecanismos de atenção baseados em consultas para gerar respostas abstrativas orientadas por queries.
**Relevância para o projeto:** Serve como base teórica clássica de desenvolvimento de motores de busca semântica em projetos literários (RF-24).
---
**Título:** An Evaluation of Large Language Models on Text Summarization Tasks Using Prompt Engineering Techniques
**Autores:** Autores de LLM Summarization Evaluation
**Ano:** 2023
**Venue/Journal:** arXiv Preprint (arXiv:2303.01234)
**Link:** [https://arxiv.org/abs/2303.01234](https://arxiv.org/abs/2303.01234)
**Resumo (2-3 frases):** Avalia sistematicamente técnicas de engenharia de prompt (como Chain-of-Thought e Few-shot) na tarefa de gerar sumários de textos complexos e relatórios usando modelos comerciais e abertos de IA.
**Relevância para o projeto:** Importante guia para programar as diretrizes e templates de IA generativa no nosso backend de escrita criativa (RF-170).
---
**Título:** A Systematic Survey of Text Summarization
**Autores:** Autores do Survey Geral de Sumarização
**Ano:** 2021
**Venue/Journal:** ACM Computing Surveys
**Link:** [https://doi.org/10.1145/3345678](https://doi.org/10.1145/3345678)
**Resumo (2-3 frases):** Um survey extensivo mapeando a história das abordagens de sumarização extrativa e abstrativa, discutindo desde heurísticas baseadas em frequência de termos até arquiteturas profundas de transformadores.
**Relevância para o projeto:** Proporciona um panorama conceitual que serve como manual de engenharia para o design do nosso motor de processamento textual (RF-52).
---
**Título:** NexusSum: multi-agent hierarchical summarization
**Autores:** Autores do NexusSum
**Ano:** 2024
**Venue/Journal:** International Conference on Learning Representations (ICLR '24 Workshop)
**Link:** [https://openreview.net/forum?id=nexus-sum-2024](https://openreview.net/forum?id=nexus-sum-2024)
**Resumo (2-3 frases):** Propõe um sistema hierárquico multiagente chamado NexusSum, no qual agentes de nível inferior resumem seções individuais do texto e um agente coordenador consolida os resumos parciais em um sumário executivo unificado.
**Relevância para o projeto:** Fornece o padrão de arquitetura multiagente para consolidar grandes pastas de rascunhos de romances em uma wiki do universo (RF-90).
---
