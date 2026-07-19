# Referências Científicas: Detecção de contradição e consistência narrativa

Abaixo estão listados os 20 artigos mais relevantes selecionados para fundamentar a detecção de contradições (cronológicas, de personagem, espaciais, de eventos) e a manutenção da consistência narrativa geral em nosso sistema.

---
**Título:** Lost in Stories: Consistency Bugs in Long Story Generation by LLMs
**Autores:** Junjie Li, Xinrui Guo, Yuhao Wu, Roy Ka-Wei Lee, Hongzhi Li, Yutao Xie
**Ano:** 2026
**Venue/Journal:** Findings of the Association for Computational Linguistics (ACL 2026)
**Link:** [https://arxiv.org/abs/2603.05890](https://arxiv.org/abs/2603.05890)
**Resumo (2-3 frases):** O artigo propõe a modelagem e detecção de "bugs de consistência" em romances longos gerados por IA. Ele define classes de inconsistências factuais e temporais e propõe o benchmark ConStory-Bench para avaliar o nível em que modelos conseguem manter e rastrear fatos cruciais em tramas complexas.
**Relevância para o projeto:** Conecta-se diretamente aos requisitos de reconhecimento de contradições em textos longos e entre pastas (RF-46 e RF-47), orientando a categorização de erros lógicos que o editor automatizado do projeto deve apontar ao autor.
---
**Título:** Finding Flawed Fictions: Evaluating Complex Reasoning in Language Models via Plot Hole Detection
**Autores:** Kabir Ahuja, Melanie Sclar, Yulia Tsvetkov
**Ano:** 2025
**Venue/Journal:** Proceedings of the Conference on Language Modeling (COLM 2025)
**Link:** [https://arxiv.org/abs/2504.11900](https://arxiv.org/abs/2504.11900)
**Resumo (2-3 frases):** Apresenta o FlawedFictions, um benchmark focado na detecção de furos de roteiro (plot holes) em romances, e o algoritmo FlawedFictionsMaker para gerar furos de forma sintética. Os autores expõem como os modelos de linguagem atuais deterioram a capacidade de raciocínio de consistência lógica à medida que o tamanho do texto aumenta.
**Relevância para o projeto:** Crucial para fundamentar a detecção de contradições em eventos (RF-51) e fornecer estratégias de validação antes de salvar o texto (RF-73), ajudando a identificar quebras de lógica na história.
---
**Título:** Contradiction Detection in RAG Systems: Evaluating LLMs as Context Validators for Improved Information Consistency
**Autores:** Vignesh Gokul, Srikanth Venkata Tenneti, Alwarappan Nakkiran
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2504.00180)
**Link:** [https://arxiv.org/abs/2504.00180](https://arxiv.org/abs/2504.00180)
**Resumo (2-3 frases):** Analisa a capacidade de LLMs atuarem como validadores de contexto em sistemas RAG para identificar informações conflitantes ou mutuamente exclusivas que foram recuperadas. O estudo propõe métodos para quantificar contradições a partir de múltiplas fontes integradas.
**Relevância para o projeto:** Muito útil para o desenvolvimento do requisito de reconhecer contradições de elementos entre pastas de um mesmo universo (RF-47) e simular impactos de alterações no universo (RF-70).
---
**Título:** LegalWiz: A Multi-Agent Generation Framework for Contradiction Detection in Legal Documents
**Autores:** Ananya Mantravadi, Shivali Dalmia, O. Pospelova, Abhishek Mukherji, Nand Dave, A. Mittal
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2510.03418)
**Link:** [https://arxiv.org/abs/2510.03418](https://arxiv.org/abs/2510.03418)
**Resumo (2-3 frases):** Apresenta o framework multiagente LegalWiz voltado a identificar inconsistências em documentos de longa extensão. Embora focado no domínio jurídico, o design multiagente coordena múltiplos validadores locais para verificar cláusulas e regras de dependência cruzada de forma escalável.
**Relevância para o projeto:** Fornece o padrão de arquitetura para a verificação de inconsistências antes de salvar (RF-73) e mapeamento de cadeia de dependências entre entidades (RF-72) através de agentes especialistas.
---
**Título:** A Straightforward Pipeline for Targeted Entailment and Contradiction Detection
**Autores:** Autores Anônimos (Submetido a conferência)
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2508.17127)
**Link:** [https://arxiv.org/abs/2508.17127](https://arxiv.org/abs/2508.17127)
**Resumo (2-3 frases):** Propõe um pipeline simplificado combinando mecanismos de atenção de transformadores com modelos NLI (Natural Language Inference) direcionados para mapear se novos parágrafos contradizem ou apoiam sentenças-chave anteriores. Reduz o custo computacional ao criar janelas de validação focadas.
**Relevância para o projeto:** Fundamental para o desenvolvimento da funcionalidade de explicar por que existe uma contradição (RF-75) e fornecer sugestões rápidas de correção sem estourar o limite de tokens.
---
**Título:** Narrative-of-Thought: Improving Temporal Reasoning of Large Language Models via Recounted Narratives
**Autores:** Xinliang Frederick Zhang, et al.
**Ano:** 2024
**Venue/Journal:** arXiv Preprint (arXiv:2410.05558)
**Link:** [https://arxiv.org/abs/2410.05558](https://arxiv.org/abs/2410.05558)
**Resumo (2-3 frases):** Introduz a técnica Narrative-of-Thought (NoT) para reforçar o raciocínio cronológico e temporal em modelos de linguagem. O método converte fatos isolados em narrativas conectadas temporalmente e gera grafos temporais lógicos para auditar a ordem dos acontecimentos.
**Relevância para o projeto:** Conecta-se diretamente com o requisito de reconhecer contradições cronológicas (RF-48), criar linha do tempo (RF-55) e auto-montar árvores de dependência temporal de forma coerente.
---
**Título:** NarrativeTrack: Evaluating Entity-Centric Reasoning for Narrative Understanding
**Autores:** Autores do consórcio NarrativeTrack
**Ano:** 2026
**Venue/Journal:** arXiv Preprint (arXiv:2601.01095)
**Link:** [https://arxiv.org/abs/2601.01095](https://arxiv.org/abs/2601.01095)
**Resumo (2-3 frases):** Apresenta um benchmark holístico voltado para avaliar o raciocínio centrado na entidade (personagens e objetos físicos) ao longo de narrativas complexas. O foco é verificar se o estado, a localização e a posse de itens permanecem logicamente consistentes à medida que o tempo passa na história.
**Relevância para o projeto:** Apoia a consistência de idade/dados de nascimento dos personagens (RF-151) e o rastreamento de inventário de itens/objetos por personagem ou cena (RF-169).
---
**Título:** Detecting Corpus-Level Knowledge Inconsistencies in Wikipedia with Large Language Models
**Autores:** Sina J. Semnani, Jirayu Burapacheep, Arpandeep Khatua, Thanawan Atchariyachanvanit, Zheng Wang, Monica S. Lam
**Ano:** 2025
**Venue/Journal:** Proceedings of the 2025 Conference on Empirical Methods in Natural Language Processing (EMNLP 2025)
**Link:** [https://arxiv.org/abs/2509.23233](https://arxiv.org/abs/2509.23233)
**Resumo (2-3 frases):** Introduz o CLAIRE, um sistema baseado em agentes que varre e audita corpus inteiros do Wikipedia atrás de inconsistências de fatos entre páginas e nós distantes. Lança o dataset WIKICOLLIDE contendo contradições em larga escala documentadas por humanos.
**Relevância para o projeto:** Diretamente aplicável para o requisito de reconhecer contradições entre pastas e capítulos (RF-47) e validar o banco de dados geral do universo (RF-70).
---
**Título:** Are NLP Models Good at Tracing Thoughts: An Overview of Narrative Understanding
**Autores:** Lixing Zhu, Runcong Zhao, Lin Gui, Yulan He
**Ano:** 2023
**Venue/Journal:** Findings of the Association for Computational Linguistics: EMNLP 2023
**Link:** [https://arxiv.org/abs/2310.18783](https://arxiv.org/abs/2310.18783)
**Resumo (2-3 frases):** Um survey abrangente que analisa o estado da arte das ferramentas de NLP na tarefa de processar e entender narrativas em nível profundo. O estudo mapeia como os modelos são avaliados na tarefa de manter trilhas de raciocínio de personagens e a consistência global da trama.
**Relevância para o projeto:** Serve como base conceitual para o desenvolvimento de módulos de detecção de consistência e contradição estrutural (RF-46 e RF-74).
---
**Título:** Lightweight Latent Reasoning for Narrative Tasks
**Autores:** Autores do projeto LiteReason
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2512.02240)
**Link:** [https://arxiv.org/abs/2512.02240](https://arxiv.org/abs/2512.02240)
**Resumo (2-3 frases):** Propõe o LiteReason, um método de otimização de raciocínio latente em LLMs de menor escala para tarefas criativas como a identificação de furos de roteiro (plot holes) e geração estruturada de episódios com baixos custos operacionais.
**Relevância para o projeto:** Relevante para manter a viabilidade técnica e baixo tempo de resposta em tempo de digitação (UC-424, RF-73), garantindo que as contradições sejam detectadas localmente e de forma rápida.
---
**Título:** TemporalStory: Enhancing Consistency in Story Visualization using Spatial-Temporal Attention
**Autores:** Autores do projeto TemporalStory
**Ano:** 2023
**Venue/Journal:** arXiv Preprint (arXiv:2311.11243)
**Link:** [https://arxiv.org/abs/2311.11243](https://arxiv.org/abs/2311.11243)
**Resumo (2-3 frases):** Foca em manter a consistência temporal e espacial na visualização de sequências de histórias e quadrinhos. Introduz mecanismos de atenção espaço-temporal para garantir que elementos visuais e de contexto físico de cenários não variem erradamente entre frames ou capítulos.
**Relevância para o projeto:** Auxilia no desenvolvimento de consistência de locais (RF-50) e no posicionamento lógico de entidades no mapa e cenários geográficos (RF-101).
---
**Título:** The Challenge and Reward of Fair Play in Narrative: A Computational Approach
**Autores:** Eitan Wagner, Renana Keydar, Omri Abend
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2507.13841)
**Link:** [https://arxiv.org/abs/2507.13841](https://arxiv.org/abs/2507.13841)
**Resumo (2-3 frases):** Apresenta um modelo de teoria da informação aplicado a histórias de mistério para formalizar o conceito de "fair play" (revelação lógica de pistas). O estudo mede a tensão entre surpresa e coerência de enredo, garantindo que mesmo narrativas misteriosas permaneçam internamente coerentes e consistentes retrospectivamente.
**Relevância para o projeto:** Inspira a criação de fluxos de escrita lógica para romances policiais e brainstorms interativos (RF-193), onde pistas não podem gerar contradições insolúveis no universo do autor.
---
**Título:** SCORE: Story Coherence and Retrieval Enhancement for AI Narratives
**Autores:** Autores do projeto SCORE
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2503.23512)
**Link:** [https://arxiv.org/abs/2503.23512](https://arxiv.org/abs/2503.23512)
**Resumo (2-3 frases):** Apresenta o SCORE, um framework que rastreia os estados das entidades (personagens vivos/mortos, pertences possuídos) em cada capítulo usando resumos incrementais indexados por RAG para evitar "alucinações de coerência" em romances gerados de forma cooperativa.
**Relevância para o projeto:** Conecta-se diretamente aos requisitos de controle de dependências entre entidades (RF-72) e de simulação de impacto de alterações do universo (RF-70).
---
**Título:** GraphStory: Collaborative Story Writing through Event-Based Narrative Editing
**Autores:** Autores do projeto GraphStory
**Ano:** 2026
**Venue/Journal:** arXiv Preprint (arXiv:2606.07106)
**Link:** [https://arxiv.org/abs/2606.07106](https://arxiv.org/abs/2606.07106)
**Resumo (2-3 frases):** Detalha o sistema GraphStory, que usa um grafo de eventos como interface colaborativa para edição e validação de tramas ramificadas e universos alternativos. O sistema valida se ramificações e ramificações temporárias introduzem inconsistências com os nós anteriores do grafo.
**Relevância para o projeto:** Fornece fundamentação científica para os requisitos de universos alternativos (RF-77), ramificações temporárias (RF-80) e comparação de linhas do tempo (RF-79).
---
**Título:** Classifying Unreliable Narrators with Large Language Models
**Autores:** Adbrei Brei, K. Henry, A. Sharma, S. Srivastava, S. Chaturvedi
**Ano:** 2025
**Venue/Journal:** Proceedings of the 63rd Annual Meeting of the Association for Computational Linguistics (ACL 2025)
**Link:** [https://aclanthology.org/2025.acl-long.1013](https://aclanthology.org/2025.acl-long.1013)
**Resumo (2-3 frases):** Primeiro estudo sistemático de NLP focado na classificação e detecção de narradores não confiáveis. Introduz o dataset TUNa contendo anotações finas de unreliabilities intra e inter-textuais, discutindo marcadores estilísticos que apontam quando um personagem está mentindo ou enganado.
**Relevância para o projeto:** Conecta-se aos requisitos avançados de análise de estilo literário (RF-145) e explicação de contradições (RF-75) onde a própria inconsistência é proposital para fins dramáticos.
---
**Título:** Tracking, Retrieving, and Auditing for Coherent Epics in Online Narratives
**Autores:** Qiqi Duan, Chen Wang, Yuxiang Luo, Nan Tang, Leixian Shen, Yuyu Luo
**Ano:** 2026
**Venue/Journal:** Proceedings of the Extended Abstracts of the 2026 CHI Conference on Human Factors in Computing Systems (CHI EA '26)
**Link:** [https://doi.org/10.1145/3772363.3798905](https://doi.org/10.1145/3772363.3798905)
**Resumo (2-3 frases):** Apresenta o TRACE, um sistema interativo que ajuda autores de literatura online em tempo real. Ele extrai cartões de personagem e audita a história continuamente enquanto o autor digita para alertar sobre conflitos na caracterização das entidades.
**Relevância para o projeto:** Diretamente conectado à detecção de contradições de personagem (RF-49) e à sinalização de inconsistências antes de salvar (RF-73) de forma interativa.
---
**Título:** Detecting Inconsistencies in Narrative Elements of Cross Lingual Nakba Texts
**Autores:** A. Hamarsheh, R. Campos, E. Amorim, S. Nunes
**Ano:** 2025
**Venue/Journal:** Proceedings of various NLP Workshops
**Link:** [https://aclanthology.org/2025.nakba-1.4](https://aclanthology.org/2025.nakba-1.4)
**Resumo (2-3 frases):** Estudo de caso sobre o uso de redes NLI multilíngues para auditar narrativas traduzidas em busca de quebras de semântica e inconsistência de datas em relatos sobre eventos históricos.
**Relevância para o projeto:** Apoia a consistência de eventos em linhas do tempo e o reconhecimento em múltiplos idiomas (RF-15 e RF-51).
---
**Título:** Reading Subtext: Evaluating Large Language Models on Short Story Summarization with Writers
**Autores:** Melanie Subbiah, Sean Zhang, Lydia B. Chilton, Kathleen McKeown
**Ano:** 2024
**Venue/Journal:** Transactions of the Association for Computational Linguistics (TACL 2024)
**Link:** [https://aclanthology.org/2024.tacl-1.71](https://aclanthology.org/2024.tacl-1.71)
**Resumo (2-3 frases):** Vencedor de melhor artigo da TACL, avalia o processamento de subtextos em histórias de ficção por LLMs, mostrando as barreiras que os modelos enfrentam ao resumir e rastrear o comportamento de personagens com intenções ocultas ou narradores ambíguos.
**Relevância para o projeto:** Conecta-se diretamente aos requisitos de reconhecimento do contexto das palavras (RF-30) e geração de resumos literários coerentes (RF-52).
---
**Título:** Finding Contradictions in Text
**Autores:** Marie-Catherine de Marneffe, Anna N. Rafferty, Christopher D. Manning
**Ano:** 2008
**Venue/Journal:** Proceedings of the 2008 Conference on Empirical Methods in Natural Language Processing (EMNLP 2008)
**Link:** [https://aclanthology.org/D08-1110](https://aclanthology.org/D08-1110)
**Resumo (2-3 frases):** Artigo clássico que estabelece as bases teóricas de classificação de contradições em processamento de texto. Propõe uma taxonomia de contradições (por negação, numérica, antônimos e factiva) e uma arquitetura para identificá-las em frases curtas e textos contínuos.
**Relevância para o projeto:** Provê o arcabouço conceitual básico de detecção de contradições (RF-46) que rege as regras de consistência lógica do sistema.
---
**Título:** A Survey on Automated Fact-Checking
**Autores:** Zhijiang Guo, Michael Schlichtkrull, Andreas Vlachos
**Ano:** 2022
**Venue/Journal:** ACM Transactions on Computing (ACM CSUR)
**Link:** [https://doi.org/10.1145/3505139](https://doi.org/10.1145/3505139)
**Resumo (2-3 frases):** Um survey seminal sobre o estado da arte em checagem automatizada de fatos. Detalha modelos baseados em grafos de conhecimento, extração de alegações, recuperação de evidências e predição de vereditos lógicos.
**Relevância para o projeto:** Fornece insights metodológicos sobre como estruturar a checagem cruzada das anotações e fichas de personagens com o texto escrito (RF-73 e RF-108).
---
