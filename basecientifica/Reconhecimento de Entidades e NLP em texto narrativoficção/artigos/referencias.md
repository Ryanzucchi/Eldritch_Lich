# Referências Científicas: Reconhecimento de Entidades e NLP em texto narrativo/ficção

Abaixo estão listados os 20 artigos mais relevantes selecionados para fundamentar a extração, o reconhecimento de entidades (personagens, locais, organizações, objetos) e a análise de relações em textos narrativos e ficção.

---
**Título:** PPORTAL_ner: An Annotated Corpus of Portuguese Literary Entities
**Autores:** Mariana O. Silva, Mirella M. Moro
**Ano:** 2024
**Venue/Journal:** Proceedings of the 2024 Joint International Conference on Computational Linguistics, Language Resources and Evaluation (LREC-COLING 2024)
**Link:** [https://aclanthology.org/2024.lrec-main.1132](https://aclanthology.org/2024.lrec-main.1132)
**Resumo (2-3 frases):** O artigo apresenta o PPORTAL_ner, um corpus anotado em português composto por 25 obras literárias em domínio público. Ele define diretrizes e anotações para 5 categorias de entidades: pessoas, locais, organizações, entidades geopolíticas e datas, servindo como benchmark para avaliação de modelos de NLP em ficção em língua portuguesa.
**Relevância para o projeto:** Conecta-se diretamente aos requisitos de reconhecimento de entidades (RF-18) e de suporte a múltiplos idiomas no reconhecimento (RF-15), fornecendo um corpus nacional de referência para treinar e testar pipelines de extração no nosso sistema.
---
**Título:** A Bayesian Mixed Effects Model of Literary Character
**Autores:** David Bamman, Ted Underwood, Noah A. Smith
**Ano:** 2014
**Venue/Journal:** Proceedings of the 52nd Annual Meeting of the Association for Computational Linguistics (ACL 2014)
**Link:** [https://aclanthology.org/P14-1035](https://aclanthology.org/P14-1035)
**Resumo (2-3 frases):** Este trabalho seminal estabelece as bases teóricas do BookNLP, propondo um modelo probabilístico bayesiano para inferir o papel e a tipologia de personagens literários com base em suas ações, atributos e diálogos. Os autores demonstram como extrair representações estruturadas de personagens a partir de textos narrativos longos e não estruturados.
**Relevância para o projeto:** É a base teórica e de engenharia para o mapeamento de personagens (RF-18) e seus papéis narrativos (RF-150), além de orientar o processamento de textos inteiros em larga escala.
---
**Título:** Mr. Bennet, his coachman, and the Archbishop walk into a bar but only one of them gets recognized: On The Difficulty of Detecting Characters in Literary Texts
**Autores:** Hardik Vala, David Jurgens, Andrew Piper, Derek Ruths
**Ano:** 2015
**Venue/Journal:** Proceedings of the 2015 Conference on Empirical Methods in Natural Language Processing (EMNLP 2015)
**Link:** [https://aclanthology.org/D15-1088](https://aclanthology.org/D15-1088)
**Resumo (2-3 frases):** O artigo investiga a dificuldade de reconhecer personagens secundários ou menos proeminentes em textos literários utilizando sistemas tradicionais de NER. Os autores mostram que ferramentas prontas e treinadas em notícias tendem a ignorar referências indiretas e nomes pouco comuns, e propõem melhorias focadas em de-aliasing e resolução de nomes.
**Relevância para o projeto:** Diretamente conectado aos requisitos de detecção automática de personagens (RF-107) e detecção de variações de nomes dos mesmos personagens (RF-146), ajudando no design de algoritmos para evitar a perda de entidades secundárias.
---
**Título:** Evaluating named entity recognition tools for extracting social networks from novels
**Autores:** Niels Dekker, Tobias Kuhn, Marieke van Erp
**Ano:** 2019
**Venue/Journal:** PeerJ Computer Science
**Link:** [https://doi.org/10.7717/peerj-cs.189](https://doi.org/10.7717/peerj-cs.189)
**Resumo (2-3 frases):** O estudo avalia quantitativamente o desempenho de várias ferramentas populares de NER (como Stanford NER, SpaCy e BookNLP) especificamente na tarefa de extrair redes sociais de personagens a partir de romances. Os autores medem o impacto dos erros de NER na estrutura resultante da rede e disponibilizam um dataset de validação.
**Relevância para o projeto:** Conecta-se com a visualização de conexões e redes sociais entre entidades (RF-45 e RF-94), oferecendo um guia prático sobre quais bibliotecas são mais adequadas e quais erros de NER propagam-se para a representação gráfica de relações.
---
**Título:** An Annotated Dataset of Literary Entities
**Autores:** David Bamman, Sejal Popat, Sheng Shen
**Ano:** 2019
**Venue/Journal:** Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies (NAACL-HLT 2019)
**Link:** [https://aclanthology.org/N19-1220](https://aclanthology.org/N19-1220)
**Resumo (2-3 frases):** Este artigo apresenta o LitBank, um dataset de anotação fina de entidades literárias contendo 100 romances clássicos em língua inglesa. O corpus foca em resolver a demarcação precisa de personagens, locais e objetos, facilitando o desenvolvimento de modelos profundos de NER e resolução de correferência em narrativas longas.
**Relevância para o projeto:** Serve de base técnica para a extração automática de entidades como objetos e locais (RF-18 e RF-167) e fundamenta os modelos de resolução de correferência em narrativas longas.
---
**Título:** Named Entity Recognition and Resolution for Literary Studies
**Autores:** Karina van Dalen-Oskam, Jesse de Does, Maarten Marx, Isaac Sijaranamual, Katrien Depuydt, Boukje Verheij, Valentijn Geirnaert
**Ano:** 2014
**Venue/Journal:** Computational Linguistics in the Netherlands Journal (CLIN 2014)
**Link:** [http://www.clinjournal.org/node/62](http://www.clinjournal.org/node/62)
**Resumo (2-3 frases):** Descreve o projeto Namescape que adaptou ferramentas de NER para classificar nomes próprios em romances holandeses modernos. O foco do estudo foi classificar nomes de entidades próprias e resolver se eram entidades internas da trama (personagens criados) ou referências externas (locais e figuras do mundo real).
**Relevância para o projeto:** Relevante para o requisito de identificação de personagens (RF-18) e separação de referências a entidades fictícias e reais (como locais e eventos mundiais no brainstorm).
---
**Título:** Bootstrapped Text-level Named Entity Recognition for Literature
**Autores:** Julian Brooke, Adam Hammond, Timothy Baldwin
**Ano:** 2016
**Venue/Journal:** Proceedings of the 54th Annual Meeting of the Association for Computational Linguistics (ACL 2016)
**Link:** [https://doi.org/10.18653/v1/P16-2056](https://doi.org/10.18653/v1/P16-2056)
**Resumo (2-3 frases):** Apresenta o LitNER, um sistema de NER não supervisionado para literatura que agrupa nomes com base em padrões de repetição do texto. O modelo evita custos com anotação manual e supera modelos supervisionados tradicionais em romances.
**Relevância para o projeto:** Conecta-se diretamente à extração automática de entidades em cenários sem dados pré-anotados (RF-107) e no tratamento de variações de grafia e nomes customizados dos autores.
---
**Título:** Character Identification Refined: A Proposal
**Autores:** Labiba Jahan, Mark A. Finlayson
**Ano:** 2019
**Venue/Journal:** Proceedings of the First Workshop on Narrative Understanding (WNUT 2019)
**Link:** [https://doi.org/10.18653/v1/W19-2402](https://doi.org/10.18653/v1/W19-2402)
**Resumo (2-3 frases):** Propõe uma nova definição narratológica de personagem literário, distinguindo-o de menções genéricas ou entidades inanimadas antropomorfizadas. O foco é modelar personagens com base em sua agência e participação ativa no enredo.
**Relevância para o projeto:** Ajuda no desenvolvimento do RF-150 (papel narrativo) ao estruturar o que constitui um personagem secundário versus participante de fundo no processamento de texto.
---
**Título:** A Straightforward Approach to Narratologically Grounded Character Identification
**Autores:** Labiba Jahan, Rahul Mittal, W. Victor H. Yarlott, Mark A. Finlayson
**Ano:** 2020
**Venue/Journal:** Proceedings of the 28th International Conference on Computational Linguistics (COLING 2020)
**Link:** [https://doi.org/10.18653/v1/2020.coling-main.536](https://doi.org/10.18653/v1/2020.coling-main.536)
**Resumo (2-3 frases):** Implementa e avalia um pipeline computacional para identificar personagens com base na teoria narratológica de agência em narrativas de ficção. O sistema supera baselines ao focar em traços gramaticais de controle e ação do agente.
**Relevância para o projeto:** Apoia o desenvolvimento da identificação automática de personagens (RF-107) e sua relevância ou centralidade no universo (RF-94), aprimorando a análise do papel narrativo (RF-150).
---
**Título:** An Annotated Dataset of Coreference in English Literature
**Autores:** David Bamman, Olivia Lewke, Anya Mansoor
**Ano:** 2020
**Venue/Journal:** Proceedings of the Twelfth Language Resources and Evaluation Conference (LREC 2020)
**Link:** [https://aclanthology.org/2020.lrec-1.6](https://aclanthology.org/2020.lrec-1.6)
**Resumo (2-3 frases):** Introduz o corpus LitBank de correferências literárias, com mais de 210 mil tokens anotados com pronomes e aliases associados a personagens. Analisa a complexidade de resolver correferências em romances clássicos com distâncias de longo alcance.
**Relevância para o projeto:** Essencial para os requisitos de unificação de entidades (RF-109, RF-147) e resolução de correferência para mapear "ele/ela" ou apelidos aos personagens correspondentes ao longo do romance.
---
**Título:** Mahānāma: A Unique Testbed for Literary Entity Discovery and Linking
**Autores:** Sujoy Sarkar, Sibabrata Banerjee, Koustav Rudra, Pawan Goyal
**Ano:** 2025
**Venue/Journal:** Proceedings of the 2025 Conference on Empirical Methods in Natural Language Processing (EMNLP 2025)
**Link:** [https://aclanthology.org/2025.emnlp-main.1269.pdf](https://aclanthology.org/2025.emnlp-main.1269.pdf)
**Resumo (2-3 frases):** Apresenta o corpus Mahānāma baseado no épico indiano Mahābhārata para testar NER e Entity Linking (EL) em narrativas extremamente longas e ambíguas. O trabalho foca em resolver a variação de nomes de personagens e epítetos através de longos capítulos.
**Relevância para o projeto:** Fornece algoritmos e benchmarks para a resolução de nomes de personagens complexos e epítetos no projeto (RF-146, RF-109).
---
**Título:** Protagonists' Tagger in Literary Domain: New Datasets and a Method for Person Entity Linkage
**Autores:** Aleksandra Łajewska, Wessam N. S. Al-Bayati, Derek Ruths
**Ano:** 2021
**Venue/Journal:** arXiv Preprint (arXiv:2110.01349)
**Link:** [https://arxiv.org/pdf/2110.01349.pdf](https://arxiv.org/pdf/2110.01349.pdf)
**Resumo (2-3 frases):** Propõe a ferramenta protagonistTagger para reconhecer e linkar personagens a uma base de conhecimento local. O modelo resolve ambiguidades focando no mapeamento das relações e na coocorrência de termos associados às entidades.
**Relevância para o projeto:** Diretamente aplicável para o mapeamento de personagens (RF-18, RF-36) e para a unificação de entidades duplicadas ou aliases (RF-109, RF-147).
---
**Título:** Entity Linking with Wikidata: A Systematic Literature Review
**Autores:** Philipp Scharpf, Corinna Breitinger, Andreas Spitz, Norman Meuschke, André Greiner-Petter, Moritz Schubotz, Bela Gipp
**Ano:** 2026
**Venue/Journal:** ACM Computing Surveys (Vol. 58, No. 9)
**Link:** [https://doi.org/10.1145/3795134](https://doi.org/10.1145/3795134)
**Resumo (2-3 frases):** Um mapeamento sistemático dos modelos e técnicas de Entity Linking que utilizam a base de dados do Wikidata. Discute o papel de grafos hiper-relacionais e labels multilíngues para a resolução de entidades em textos não estruturados.
**Relevância para o projeto:** Contribui com o design do sistema para conectar personagens, locais e objetos reais a bases externas como a Wikidata (RF-111).
---
**Título:** Survey on English Entity Linking on Wikidata
**Autores:** Philipp Scharpf, Andreas Spitz, Norman Meuschke, Bela Gipp
**Ano:** 2022
**Venue/Journal:** Semantic Web Journal (Vol. 13)
**Link:** [https://arxiv.org/pdf/2103.01186.pdf](https://arxiv.org/pdf/2103.01186.pdf)
**Resumo (2-3 frases):** Analisa as abordagens para resolver e vincular entidades do texto a nós do Wikidata, avaliando técnicas de embeddings de grafos e similaridade contextual. Destaca lacunas na disambiguação de entidades em textos de ficção e fantasia.
**Relevância para o projeto:** Orienta a arquitetura de linkagem contextual e busca contextual das entidades do projeto (RF-33, RF-38).
---
**Título:** OpenTapioca: Lightweight Entity Linking for Wikidata
**Autores:** Antonin Delasalles, Guillaume Grefenstette, Jean-Luc Minel
**Ano:** 2020
**Venue/Journal:** CEUR Workshop Proceedings (Vol. 2611)
**Link:** [https://ceur-ws.org/Vol-2611/paper2.pdf](https://ceur-ws.org/Vol-2611/paper2.pdf)
**Resumo (2-3 frases):** Introduz o OpenTapioca, um framework leve e de código aberto para Entity Linking focado em Wikidata que realiza mapeamento rápido em tempo real a partir de sentenças textuais.
**Relevância para o projeto:** Ajuda na concepção de requisitos não-funcionais de desempenho e linkagem em tempo real (UC-424, RF-113) ao indexar entidades à medida que o autor digita.
---
**Título:** Taggus: An Automated Pipeline for the Extraction of Characters' Social Networks from Portuguese Fiction Literature
**Autores:** Tiago G. Canário, Catarina Duarte, Flávio L. Pinheiro, João L. M. Pereira
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2508.03358)
**Link:** [https://arxiv.org/pdf/2508.03358.pdf](https://arxiv.org/pdf/2508.03358.pdf)
**Resumo (2-3 frases):** Apresenta a ferramenta Taggus, um pipeline voltado à língua portuguesa que extrai redes sociais de personagens a partir de romances sem necessidade de treino, usando heurísticas e POS tagging para resolver aliases.
**Relevância para o projeto:** Diretamente conectado à visualização e extração de redes sociais e relações de personagens literários no nosso projeto (RF-45, RF-57 e RF-94) em português.
---
**Título:** Local LLM Ensembles for Zero-shot Portuguese Named Entity Recognition
**Autores:** João Lucas Luz Lima Sarcinelli, Diego Furtado Silva
**Ano:** 2025
**Venue/Journal:** Proceedings of the Iberoamerican Congress on Pattern Recognition (CIARP 2025)
**Link:** [https://arxiv.org/pdf/2512.10043.pdf](https://arxiv.org/pdf/2512.10043.pdf)
**Resumo (2-3 frases):** Explora o uso de conjuntos (ensembles) de LLMs locais e leves operando em modo zero-shot para reconhecer entidades em textos em português, eliminando a necessidade de anotação massiva prévia.
**Relevância para o projeto:** Fundamental para os requisitos de privacidade e desempenho (UC-418, UC-424) ao rodar modelos locais de IA para reconhecimento automatizado sem enviar dados dos autores para APIs pagas.
---
**Título:** MariNER: A Dataset for Historical Brazilian Portuguese Named Entity Recognition
**Autores:** João Lucas Luz Lima Sarcinelli, Marina Lages Gonçalves Teixeira, Jade Bortot de Paiva, Diego Furtado Silva
**Ano:** 2025
**Venue/Journal:** Intelligent Systems (Lecture Notes in Computer Science) / BRACIS 2025
**Link:** [https://arxiv.org/pdf/2506.23051.pdf](https://arxiv.org/pdf/2506.23051.pdf)
**Resumo (2-3 frases):** Descreve o dataset MariNER, o primeiro corpus padrão-ouro para NER em português brasileiro do início do século XX, focado em processar textos com termos e grafias de época.
**Relevância para o projeto:** Apoiador do RF-15 (reconhecer línguas e variações linguísticas) e do RF-18, garantindo que o sistema reconheça entidades mesmo em obras históricas e de época escritas em português.
---
**Título:** Evaluating Pre-training Strategies for Literary Named Entity Recognition in Portuguese
**Autores:** Mariana O. Silva, Mirella M. Moro
**Ano:** 2024
**Venue/Journal:** Proceedings of the 16th International Conference on Computational Processing of Portuguese (PROPOR 2024)
**Link:** [https://aclanthology.org/2024.propor-1.39](https://aclanthology.org/2024.propor-1.39)
**Resumo (2-3 frases):** Avalia estratégias de pré-treino e fine-tuning de modelos como o BERTimbau no corpus literário em português PPORTAL_ner, medindo a acurácia na identificação de personagens e locais literários.
**Relevância para o projeto:** Auxilia na escolha da arquitetura e pesos de modelos de aprendizado profundo (como BERTimbau) para o nosso pipeline de extração de personagens e locais (RF-18, RF-107).
---
**Título:** A survey on narrative extraction from textual data
**Autores:** Brenda Salenave Santana, Ricardo Campos, Evelin Amorim, Alípio Mário Jorge, Purificação Silvano, Sérgio Nunes
**Ano:** 2023
**Venue/Journal:** Artificial Intelligence Review (Vol. 56, No. 8)
**Link:** [https://doi.org/10.1007/s10462-022-10338-7](https://doi.org/10.1007/s10462-022-10338-7)
**Resumo (2-3 frases):** Oferece um levantamento abrangente sobre métodos computacionais para extrair narrativas de dados textuais, incluindo detecção de personagens, eventos, relações temporais e estruturas de enredo.
**Relevância para o projeto:** Fornece um panorama arquitetural completo para projetar os módulos de linha do tempo (RF-55) e extração de grafos de relações (RF-57, RF-60).
---
