# 2 REFERENCIAL TEÓRICO E REVISÃO SISTEMÁTICA DE LITERATURA

## 2.1 Fundamentos Conceituais da Sumarização Automática

### 2.1.1 Definição e Histórico

A sumarização automática de texto constitui uma das tarefas mais fundamentais do Processamento de Linguagem Natural (PLN), definida como o processo de redução computacional de um ou mais documentos textuais, preservando as informações mais relevantes segundo um determinado critério de relevância. Conforme expõem os autores do levantamento sistemático sobre sumarização de documentos longos (2022), a área evoluiu significativamente desde as primeiras abordagens baseadas em frequência de termos nos anos 1950, passando pelos modelos estatísticos da virada do século XXI, até as arquiteturas neurais profundas contemporâneas baseadas em Transformers.

A distinção clássica na área opõe dois paradigmas fundamentais:

**Sumarização extrativa:** Seleciona e agrupa sentenças ou trechos do documento original, sem gerar novo texto. As abordagens pioneiras baseavam-se em heurísticas de frequência de palavras-chave, posição da sentença no texto e redundância semântica. O modelo GoSum, proposto pelos autores do projeto de mesmo nome (2022), representa uma instância moderna desse paradigma, utilizando grafos de discurso organizados por tópicos e aprendizado por reforço para selecionar sentenças semanticamente chave em documentos longos.

**Sumarização abstrativa:** Gera novo texto condensado, potencialmente com formulações não presentes no original. Modelos sequência-a-sequência (seq2seq) com mecanismos de atenção, como o trabalho pioneiro de Query Focused Abstractive Summarization (2018), estabeleceram as bases para essa abordagem ao adaptarem redes codificadoras-decodificadoras com atenção orientada por consultas para a geração de respostas abstrativas. A chegada dos Transformers e, posteriormente, dos LLMs, transformou radicalmente o campo, viabilizando resumos de qualidade próxima à humana.

### 2.1.2 O Desafio de Documentos Longos

A sumarização de documentos de grande extensão — como romances literários, que frequentemente ultrapassam 100.000 palavras — impõe desafios técnicos específicos que não são adequadamente abordados pelos modelos treinados em corpora de artigos noticiosos ou acadêmicos. O levantamento empírico sobre sumarização de documentos longos (2022) identifica três categorias principais de desafios:

1. **Limitação de janela de contexto:** Modelos Transformer convencionais apresentam limite de tokens processados simultaneamente (geralmente 512 a 4.096 tokens), o que torna inviável o processamento direto de romances.
2. **Degradação de coerência:** Ao fragmentar o texto em blocos e resumi-los independentemente, os sistemas tendem a perder fatos cruciais sobre personagens e eventos, gerando inconsistências.
3. **Fidelidade factual:** Em narrativas ficcionais, o sistema deve preservar os fatos do universo ficcional criado pelo autor, e não do mundo real — tarefa para a qual os modelos não foram explicitamente treinados.

O framework BooookScore, proposto por Chang et al. (2023), aborda justamente o problema de avaliação de qualidade de resumos em escala de livro inteiro, demonstrando que os LLMs contemporâneos cometem um número significativo de inconsistências factuais ao resumir romances inteiros, mesmo os mais avançados.

### 2.1.3 Sumarização Orientada a Consultas (Query-Focused Summarization)

A sumarização focada em consultas (QFS) representa uma extensão relevante da sumarização genérica, na qual um sistema gera um resumo especificamente orientado para responder a uma pergunta ou necessidade informacional do usuário. O trabalho de Tackling Query-Focused Summarization as a Knowledge-Intensive Task (2021) estabeleceu uma conexão conceitual importante entre QFS e sistemas de recuperação de informação baseados em conhecimento externo, demonstrando que a integração de bases de conhecimento estruturadas melhora significativamente a fidelidade e relevância dos resumos gerados.

No contexto de sistemas de apoio à escrita criativa, a QFS adquire uma dimensão especial: o autor pode necessitar de resumos que respondam a perguntas específicas sobre seu próprio universo ficcional ("quais eventos levaram à morte do personagem X?" ou "como evoluiu a relação entre A e B ao longo dos capítulos?"), exigindo uma arquitetura que combine recuperação semântica e geração orientada.

## 2.2 Estado da Arte: Modelos e Abordagens

### 2.2.1 Sumarização Hierárquica

A estratégia hierárquica tornou-se a abordagem dominante para sumarização de textos muito longos. Em sua forma mais básica, o texto é fragmentado em seções (parágrafos ou capítulos), cada seção é resumida individualmente e os resumos intermediários são então combinados em um resumo final de nível superior.

O framework DTCRS (Dynamic Tree Construction for Recursive Summarization), proposto em 2026, representa uma evolução dessa abordagem ao construir dinamicamente árvores de tópicos hierárquicas adaptadas ao conteúdo específico do documento. Diferente das abordagens de fragmentação fixa, o DTCRS ajusta a granularidade dos nós da árvore com base na complexidade semântica local, reduzindo a redundância e mantendo a coerência cronológica em documentos muito longos.

Complementarmente, o framework CAHM (Context-Aware Hierarchical Merging), desenvolvido em 2025, aborda o problema da fusão de resumos intermediários com uma estratégia de mesclagem ciente de contexto. O modelo ajusta dinamicamente os pesos de relevância de nós de capítulos vizinhos, levando em conta as dependências semânticas entre seções ao unificar os resumos parciais, o que evita a perda de fatos cruciais que ocorre quando as seções são tratadas independentemente.

### 2.2.2 Sumarização Multiagente

O framework NexusSum (2024) introduziu uma abordagem inovadora baseada em múltiplos agentes para sumarização hierárquica: agentes especializados de nível inferior processam seções individuais do texto, enquanto um agente coordenador de nível superior consolida os resumos parciais em um sumário executivo unificado. Essa arquitetura multiagente permite paralelização do processamento, o que é crítico para documentos de grande extensão, e facilita a especialização de diferentes agentes para diferentes tipos de conteúdo (diálogos, descrições de cenário, narração de eventos).

### 2.2.3 Sumarização de Narrativas e Roteiros

Além da sumarização de documentos gerais, pesquisas específicas têm abordado o processamento de narrativas ficcionais estruturadas. O dataset BookSum (Kryściński et al., 2021) representa um marco nessa direção, fornecendo resumos estruturados de livros clássicos em três níveis de granularidade (parágrafo, capítulo e livro completo), o que permite o treinamento de modelos de sumarização hierárquica especificamente calibrados para prosa ficcional.

O framework S²tory (2026) aborda o desafio da sumarização de roteiros cinematográficos através de um método inovador de destilação da espinha dorsal narrativa (story spine distillation). O sistema identifica e extrai os eventos críticos do roteiro, combinando técnicas de sumarização extrativa e abstrativa para gerar loglines concisas que preservam os arcos dos personagens e a estrutura dramática da história.

O dataset SUMMSCREEN (Chen et al., 2021) contribuiu com um corpus de sumarização de roteiros de séries televisivas, incluindo episódios de múltiplos gêneros acompanhados de recaps escritos por fãs, abordando especificamente o desafio da retenção de informações de diálogos complexos na geração de resumos.

### 2.2.4 Sumarização em Língua Portuguesa

A investigação de sistemas de sumarização especificamente para a língua portuguesa apresenta um estado de arte consideravelmente menos desenvolvido em comparação ao inglês. O dataset PublicHearingBR (2024) representa uma iniciativa relevante nessa direção, introduzindo o primeiro corpus de transcrições em português brasileiro voltado especificamente para avaliar modelos na tarefa de sumarizar documentos muito longos.

O trabalho de exploração de sumarização guiada por plano narrativo para textos ficcionais com modelos de linguagem menores (Small Language Models), publicado em 2025, investiga especificamente o uso de planejamento de enredo (story plan) para guiar SLMs na geração de resumos de narrativas ficcionais, com relevância direta para processamento de textos em português sem dependência de modelos proprietários de grande escala.

### 2.2.5 RAG e Sumarização Baseada em Conhecimento

O framework OntoRAG (2025) conecta a sumarização automática com a recuperação aumentada por geração (RAG), propondo um sistema que extrai uma ontologia a partir de documentos não estruturados e a utiliza para melhorar a precisão em tarefas de question-answering e sumarização sobre a base de conhecimento. Essa abordagem é particularmente relevante para universos ficcionais, nos quais as relações entre entidades (personagens, locais, eventos) formam uma ontologia implícita que precisa ser descoberta e utilizada para orientar a sumarização.

O trabalho Beyond Relevant Documents (2024) estende essa perspectiva ao propor um controlador de sumarização integrado a bases RAG que sintetiza e cruza fatos dinamicamente sem depender de documentos pré-selecionados, permitindo maior flexibilidade de busca em grandes coleções textuais.

O framework ASLD (Automatic Summarization of Long Documents), publicado em 2024, descreve três algoritmos inovadores que processam romances com mais de 70.000 palavras fragmentando e combinando seções sem estourar as janelas de contexto de LLMs menores, com foco na garantia de eficiência de custo computacional.

## 2.3 Tabela Comparativa dos Trabalhos Revisados

A tabela a seguir apresenta uma análise comparativa dos 20 trabalhos incluídos na revisão sistemática, organizados por autor/projeto, ano de publicação, método principal, dataset utilizado, principais resultados reportados e limitações identificadas.

| # | Autor/Projeto | Ano | Método | Dataset | Resultado Principal | Limitação Principal |
|---|---------------|-----|--------|---------|--------------------|--------------------|
| 1 | Survey Sumarização | 2022 | Revisão sistemática | Múltiplos | Panorama completo de datasets, modelos e métricas | Não propõe modelo próprio; foco em inglês |
| 2 | PublicHearingBR | 2024 | Fine-tuning em PT-BR | Audiências Públicas BR | Baseline para PT-BR | Domínio jornalístico/institucional, não ficcional |
| 3 | Plan-Guided Summ. | 2025 | Planejamento narrativo + SLM | Narrativas ficcionais | Redução de inconsistências factuais | Avaliado apenas em inglês; SLMs ainda inferiores a LLMs |
| 4 | QFS-KIT | 2021 | RAG + QFS | Wikipedia + QFS benchmarks | Melhora QFS via conhecimento externo | Não avaliado em ficção; dependência de bases externas |
| 5 | OntoRAG | 2025 | Ontologia + RAG | Documentos não estruturados | Precisão superior em QA e sumarização | Complexidade de extração da ontologia em domínios novos |
| 6 | Kryściński et al. | 2021 | Dataset + baselines | BookSum (livros clássicos, 3 níveis) | Benchmark hierárquico para ficção | Apenas literatura em inglês; obras em domínio público |
| 7 | Chang et al. | 2023 | Avaliação de LLMs + BooookScore | Romances completos | LLMs cometem erros factuais significativos | Métrica automática ainda imperfeita |
| 8 | S²tory | 2026 | Story spine distillation | Roteiros cinematográficos | Melhor preservação de arcos de personagem | Específico para roteiros; não generaliza para prosa |
| 9 | Chen et al. | 2021 | Seq2seq abstrativo | SUMMSCREEN (séries de TV) | Bom desempenho em diálogos complexos | Série televisiva ≠ romance; longas dependências |
| 10 | DTCRS | 2026 | Árvore dinâmica recursiva | Documentos longos | Redução de redundância e melhor coerência | Custo computacional alto; calibração da granularidade |
| 11 | CAHM | 2025 | Mesclagem hierárquica contextual | Documentos longos | Evita perda de fatos na fusão de resumos | Sensível à qualidade dos resumos intermediários |
| 12 | G-QFS | 2026 | Geração sintética de QFS | Datasets QFS genéricos | Treinamento de QFS sem anotação humana | Qualidade dos dados sintéticos variável |
| 13 | ASLD | 2024 | 3 algoritmos de fragmentação | Romances 70k+ palavras | Eficiência computacional para romances longos | Ainda não avaliado em PT-BR |
| 14 | BeyondRD | 2024 | RAG dinâmico para QFS | Múltiplos domínios | Maior flexibilidade sem documentos pré-selecionados | Latência elevada; custo de inferência |
| 15 | KAS Framework | 2023 | QFS com conhecimento externo | Reuniões longas | Alta fidelidade cronológica nas respostas | Domínio de reuniões; generalização limitada |
| 16 | GoSum | 2022 | RL + grafo de discurso | Documentos longos | Extração de sentenças-chave otimizada | Abordagem extrativa; não gera novo texto |
| 17 | seq2seq QFS | 2018 | seq2seq + atenção orientada | Benchmarks QFS | Base teórica para sumarização abstrativa com query | Modelo pioneiro; desempenho inferior a abordagens modernas |
| 18 | LLM Summ. Eval. | 2023 | Engenharia de prompt (CoT, few-shot) | Textos complexos | Melhora com prompt técnico | Dependência de modelos comerciais |
| 19 | Survey Geral | 2021 | Revisão sistemática histórica | Histórico da área | Panorama completo extrativo/abstrativo | Anterior aos LLMs modernos; desatualizado |
| 20 | NexusSum | 2024 | Multiagente hierárquico | Grandes coleções textuais | Paralelização; coordenação eficiente | Overhead de coordenação entre agentes |

## 2.4 Análise Crítica e Lacunas Identificadas

A análise comparativa dos trabalhos revisados permite identificar as seguintes lacunas críticas na literatura atual:

**Lacuna 1 – Ausência de corpus literário ficcional em língua portuguesa:** A grande maioria dos sistemas revisados foi desenvolvida e avaliada em língua inglesa. O único dataset em português identificado (PublicHearingBR, 2024) é de domínio jornalístico/institucional, não ficcional. Não existe, até a data desta revisão, um corpus de sumarização hierárquica de romances ficcionais em português.

**Lacuna 2 – Fidelidade factual em universos ficcionais:** Os sistemas revisados avaliam a fidelidade dos resumos em relação ao mundo real (verificação factual) ou ao conteúdo geral do documento, mas não especificamente à consistência interna do universo ficcional criado pelo autor. Um sistema que atribua incorretamente um evento a um personagem errado pode ser tecnicamente correto em relação ao texto, mas estar violando a lógica interna do universo ficcional.

**Lacuna 3 – Integração de sumarização com grafos de estados de entidades:** Nenhum dos sistemas revisados integra explicitamente a sumarização hierárquica com um grafo dinâmico de estados de entidades (personagens, locais, objetos) que permita rastrear a evolução dos fatos ao longo da narrativa. Essa integração seria fundamental para detectar inconsistências nos resumos gerados.

**Lacuna 4 – Granularidade multi-nível orientada ao autor:** Os sistemas existentes operam com granularidades fixas (parágrafo, capítulo, livro). Autores de escrita criativa frequentemente necessitam de resumos em granularidades variáveis e personalizadas (cena, subcapítulo, arco narrativo), o que não é suportado pelos sistemas atual.

**Lacuna 5 – Operação offline e privacidade:** Os sistemas de maior desempenho (BooookScore, ASLD, BeyondRD) dependem de LLMs proprietários (GPT-4, Claude) via APIs, o que inviabiliza seu uso em contextos de escrita criativa onde a privacidade do manuscrito inédito é essencial.

## 2.5 Taxonomia dos Métodos de Sumarização para Narrativas Longas

Com base na análise da literatura, propõe-se a seguinte taxonomia dos métodos de sumarização aplicáveis a narrativas ficcionais longas:

**Categoria A – Métodos Extrativos Baseados em Grafos**
- Subcategoria A.1: Grafos de discurso com RL (GoSum, 2022)
- Subcategoria A.2: Árvores hierárquicas dinâmicas (DTCRS, 2026)

**Categoria B – Métodos Abstrativos Baseados em Seq2Seq/Transformers**
- Subcategoria B.1: QFS com atenção orientada a consultas (seq2seq QFS, 2018; QFS-KIT, 2021)
- Subcategoria B.2: Sumarização guiada por plano narrativo (Plan-Guided, 2025)
- Subcategoria B.3: Destilação de espinha dorsal narrativa (S²tory, 2026)

**Categoria C – Métodos Híbridos Hierárquicos**
- Subcategoria C.1: Hierarquia fixa + fusão contextual (CAHM, 2025)
- Subcategoria C.2: Hierarquia multiagente (NexusSum, 2024)

**Categoria D – Métodos RAG-Aumentados**
- Subcategoria D.1: RAG com ontologia extraída (OntoRAG, 2025)
- Subcategoria D.2: RAG dinâmico sem documentos pré-selecionados (BeyondRD, 2024)

**Categoria E – Métodos de Avaliação e Benchmarking**
- Subcategoria E.1: Corpora de sumarização literária (BookSum, SUMMSCREEN)
- Subcategoria E.2: Métricas automáticas de consistência (BooookScore)

