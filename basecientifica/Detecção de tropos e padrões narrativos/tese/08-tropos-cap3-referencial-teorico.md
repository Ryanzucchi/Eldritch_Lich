# 3 REFERENCIAL TEÓRICO E REVISÃO SISTEMÁTICA DE LITERATURA

## 3.1 Fundamentos da Narratologia e dos Tropos

### 3.1.1 Narratologia Estrutural e Teoria dos Padrões

A narratologia como disciplina científica formal tem suas raízes nos estudos formalistas russos do início do século XX. Vladimir Propp, em sua *Morfologia do Conto* (1928), identificou 31 funções narrativas recorrentes nos contos populares russos e sete esferas de ação (personagens-tipo como herói, doador, antagonista), estabelecendo a primeira taxonomia formal de padrões narrativos. Essa taxonomia fundacional influencia diretamente as ontologias computacionais de tropos contemporâneas.

Posteriormente, Algirdas Julien Greimas propôs o modelo actancial (seis actantes: sujeito, objeto, destinador, destinatário, adjuvante, oponente) como uma generalização formal mais abstrata da taxonomia de Propp, aplicável a textos de qualquer gênero e cultura. O trabalho de García-Sánchez et al. (2020) sobre TVTropes como representação de conhecimento narrativo conecta explicitamente essas tradições teóricas clássicas às ontologias computacionais modernas.

### 3.1.2 O TVTropes como Ontologia Narrativa

O TVTropes (https://tvtropes.org) é uma wiki colaborativa iniciada em 2004 que cataloga convenções narrativas recorrentes em obras de múltiplas mídias. Apesar de sua origem não acadêmica, o TVTropes tornou-se uma fonte de dados de referência amplamente utilizada na narratologia computacional por três razões: (1) cobertura sem precedentes — mais de 30.000 tropos descritos; (2) exemplificação concreta — cada tropo tem múltiplos exemplos de obras específicas que funcionam como dados de treinamento; (3) hierarquia de categorização — os tropos são organizados em supercategorias (Character Tropes, Plot Tropes, Setting Tropes, etc.) que facilitam a análise estrutural.

O trabalho de García-Sánchez et al. (2020) analisa sistematicamente o TVTropes como recurso de conhecimento narrativo, avaliando sua cobertura, consistência e potencial de integração com recursos linguísticos formais. García-Sánchez et al. (2022) estende essa análise com uma proposta de alinhamento do TVTropes com WordNet e FrameNet, permitindo o uso de recursos linguísticos existentes para inferência de tropos.

O dataset SemEval-2025 Task 11 (Framing Narratives) representa a iniciativa mais recente de criar um recurso de avaliação padronizado para análise de tropos e enquadramentos narrativos em contexto multilíngue, com relevância direta para o desenvolvimento de sistemas para o português.

### 3.1.3 Detecção Computacional de Tropos

**LitBank-Tropes:** Extensão do corpus LitBank (Bamman et al., 2019) com anotações de tropos para 100 romances clássicos em inglês. Embora de escopo limitado (100 obras, apenas inglês), o LitBank-Tropes fornece o único corpus de avaliação de referência para detecção de tropos em literatura de longa extensão disponível na literatura.

**TropesInWild (Rodriguez Vidal et al., 2023):** Dataset de detecção de tropos em texto "in the wild" — snippets de texto coletados de múltiplas fontes (fanfiction, reviews, sinopses) com anotação de tropos do TVTropes. O TropesInWild demonstra que a detecção de tropos em texto não estruturado é significativamente mais difícil do que em sinopses estruturadas, com F1-scores médios abaixo de 0,50 mesmo com modelos fine-tuned.

**AllTheRobotsEtAl (García-Sánchez et al., 2022):** Sistema de detecção de tropos baseado em alinhamento de embeddings entre descrições de tropos e trechos de texto. Embora promissor em termos de cobertura de tropos, o sistema apresenta precisão baixa em tropos de alta abstração semântica.

**StoryAnalyzer:** Framework de análise de estrutura narrativa que detecta padrões de enredo (início, tensão crescente, clímax, resolução) com base em análise de arcos emocionais e de ações de personagens, fornecendo um contexto estrutural que melhora a detecção de tropos posicionais (tropos que ocorrem em pontos específicos da narrativa).

**PLOTTER (2026):** Framework de planejamento narrativo baseado em grafos que modela explicitamente estruturas de enredo como sequências de eventos causalmente encadeados. O PLOTTER oferece uma representação de enredo que facilita a detecção de tropos estruturais (como o "Three-Act Structure" ou o "Hero's Journey").

### 3.1.4 Análise de Padrões em Gêneros Específicos

**Narrative Patterns in SF (2024):** Survey sobre padrões narrativos recorrentes na ficção científica, identificando convenções específicas do gênero (First Contact, Dystopia, Time Travel paradoxes) que representam subclasses de tropos canônicos com especificidade de domínio.

**Genre-Specific Clichés (2025):** Análise computacional de clichês narrativos em romances de gênero (romance, thriller, fantasia), demonstrando que a frequência e distribuição de tropos específicos é um preditor confiável do gênero literário — e que a subversão deliberada de tropos esperados é um marcador de qualidade literária em crítica especializada.

**Fantasy Tropes Analysis (2025):** Survey das convenções narrativas mais frequentes na fantasia épica, com análise de co-ocorrência entre tropos e identificação de "pacotes de tropos" que tipicamente aparecem juntos (ex.: "Chosen One" + "Ancient Prophecy" + "Mentor Death" co-ocorrem em mais de 60% dos romances de fantasia épica analisados).

### 3.1.5 Análise de Plot Holes e Convenções Subvertidas

**FlawedFictions (Ahuja et al., 2025):** Dataset de detecção de "plot holes" em ficção, onde a ausência ou subversão de tropos esperados gera incoerências narrativas. O FlawedFictions é relevante para o contexto desta tese por demonstrar que tropos não são apenas convenções estéticas, mas expectativas narrativas cuja violação tem consequências de coerência.

**Surprising Turns (2025):** Framework de análise de plot twists que detecta reversões de expectativas narrativas — que frequentemente correspondem a desconstruções deliberadas de tropos.

**Narrative Surprisal (2024):** Proposta de métrica de "surpresa narrativa" baseada em modelos de linguagem, que quantifica o quão inesperado é um evento narrativo dado o contexto precedente, correlacionando-se com a subversão de tropos.

### 3.1.6 Análise Crítica e Perspectivas Alternativas

**Tropes as Harmful Stereotypes (2024):** Análise crítica de tropos como vetores de estereótipos prejudiciais (o Magical Negro, o Exotic Foreigner, o Bury Your Gays), argumentando que a detecção automática de tropos tem aplicação importante para análise de representatividade e inclusão em ficção.

**Framing Narratives Survey (2025):** Survey sobre enquadramentos narrativos (narrative framing) em textos de múltiplos domínios, conectando a análise de tropos com a análise de viés e perspectiva narrativa.

**Bias in Narrative AI (2026):** Análise de viés em sistemas de IA para análise e geração de narrativas, com implicações para a construção responsável de sistemas de detecção de tropos.

## 3.2 Tabela Comparativa dos Trabalhos Revisados

| # | Autor/Projeto | Ano | Abordagem | Dataset | Métrica Principal | Limitação |
|---|---------------|-----|-----------|---------|------------------|-----------|
| 1 | García-Sánchez et al. (TVTropes KR) | 2020 | Análise ontológica | TVTropes | Cobertura de tropos | Não detecta; apenas analisa |
| 2 | García-Sánchez et al. (Alinhamento) | 2022 | Embeddings + alinhamento | TVTropes + WordNet | Precisão@10 | Baixa precisão em tropos abstratos |
| 3 | Rodriguez Vidal et al. (TropesInWild) | 2023 | Fine-tuning BERT | TropesInWild | F1 médio ~0.45 | Corpus pequeno; inglês apenas |
| 4 | LitBank-Tropes Group | 2022 | Anotação + classificação | LitBank estendido | F1 por tropo | 100 obras; inglês clássico |
| 5 | SemEval-2025 Task 11 | 2025 | Benchmark multilíngue | Framing Narratives | Macro F1 | Foco em framing, não tropos |
| 6 | StoryAnalyzer Group | 2024 | Análise estrutural | Múltiplos gêneros | Acc. estrutura | Tropos implícitos não detectados |
| 7 | PLOTTER Group | 2026 | Grafos de eventos | Ficção planejada | Coerência de enredo | Não detecta tropos diretamente |
| 8 | AllTheRobotsEtAl | 2022 | Embedding matching | TVTropes snippets | Precisão@5 | Alta cobertura, baixa precisão |
| 9 | Narrative Patterns in SF | 2024 | Survey qualitativo | Ficção científica | N/A (survey) | Não computacional |
| 10 | Genre-Specific Clichés | 2025 | Freq. estatística | Múltiplos gêneros | Correlação gênero-tropo | Análise de frequência, não detecção |
| 11 | Fantasy Tropes Analysis | 2025 | Co-ocorrência + clustering | Fantasia épica | Coeficiente de co-ocorrência | Análise descritiva, não preditiva |
| 12 | FlawedFictions | 2025 | Dataset + LLM | Ficção em inglês | F1 detecção plot holes | Inglês; não distingue tropos |
| 13 | Surprising Turns | 2025 | LLM zero-shot | Múltiplos | Acc. detecção twist | Cobertura limitada de tropos |
| 14 | Narrative Surprisal | 2024 | Perplexidade LLM | Ficção geral | Correlação humana | Proxy indireto de tropos |
| 15 | Tropes as Stereotypes | 2024 | Análise crítica | Corpus diverso | Métricas de representação | Não automatizado |
| 16 | Framing Narratives Survey | 2025 | Survey | Múltiplos domínios | N/A (survey) | Foco em framing, não tropos |
| 17 | Bias in Narrative AI | 2026 | Análise de viés | Sistemas de NLP | Métricas de equidade | Não detecta tropos diretamente |
| 18 | Propp Ontology Group | 2021 | Ontologia formal | Contos populares | Cobertura de funções | Restrito a contos; 31 funções |
| 19 | GreimActants Group | 2023 | Actantes + NLP | Romances | Precisão actantes | Alta abstração; difícil anotação |
| 20 | Narrative AI Fairness | 2025 | Avaliação de fairness | Geração narrativa | Fairness metrics | Geração, não detecção |

## 3.3 Análise Crítica e Lacunas

**Lacuna 1 — Detecção de tropos em português:** Nenhum sistema revisado foi desenvolvido ou avaliado para textos ficcionais em língua portuguesa. A transposição direta de sistemas em inglês via tradução automática é inadequada, pois muitos tropos têm instâncias culturalmente específicas no contexto da ficção lusófona.

**Lacuna 2 — Tropos de alta abstração semântica:** Os sistemas existentes alcançam performance aceitável apenas para tropos com manifestações textuais relativamente diretas. Tropos de alta abstração (que dependem de compreensão da sequência narrativa global) permanecem com F1 inferior a 0,40.

**Lacuna 3 — Integração de contexto global:** Os sistemas de classificação local (por chunk ou sentença) não aproveitam o contexto narrativo global do romance para resolver ambiguidades na detecção de tropos. Um sistema que "lê" o romance inteiro antes de decidir se um tropo está presente teria performance superior.

**Lacuna 4 — Subversão e desconstrução de tropos:** Os sistemas revisados detectam tropos positivamente (presença), mas não têm capacidade de detectar subversões e desconstruções — instâncias em que o texto deliberadamente viola a expectativa do tropo para criar efeito narrativo.

## 3.4 Taxonomia dos Métodos de Detecção de Tropos

**Categoria A — Baseados em correspondência de embeddings:** Comparam embeddings de descrições de tropos com embeddings de trechos do texto. Alta cobertura, baixa precisão para tropos abstratos. (AllTheRobotsEtAl, 2022)

**Categoria B — Classificação fine-tuned por tropo:** Um classificador binário específico para cada tropo. Alta precisão para tropos com dados suficientes, mas inviável para os 30.000 tropos do TVTropes. (TropesInWild, Rodriguez Vidal et al., 2023)

**Categoria C — Prompting de LLM (zero-shot/few-shot):** Uso de LLMs com descrições de tropos como contexto. Cobertura total do TVTropes, mas qualidade variável dependendo do modelo e da especificidade do tropo. (Surprising Turns, 2025)

**Categoria D — Análise estrutural de enredo:** Detecta padrões na estrutura do enredo (posição, causalidade, arcos emocionais) que correlacionam com tropos estruturais. (StoryAnalyzer, PLOTTER)

**Categoria E — Híbrida (local + global):** Combina classificação local com verificação global por LLM usando contexto narrativo expandido. Abordagem proposta nesta tese (TropeDetector-PT).
