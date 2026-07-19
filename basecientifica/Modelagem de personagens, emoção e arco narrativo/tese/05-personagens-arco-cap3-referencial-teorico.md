# 3 REFERENCIAL TEÓRICO E REVISÃO SISTEMÁTICA DE LITERATURA

## 3.1 Fundamentos Conceituais

### 3.1.1 Teoria Narrativa e a Noção de Personagem

A teoria narratológica oferece o arcabouço conceitual fundamental para a modelagem computacional de personagens. A morfologia das funções de Propp (1928) estabeleceu pela primeira vez uma taxonomia formal dos papéis de personagens em narrativas populares (herói, antagonista, doador, auxiliar), que influenciou diretamente a criação de bancos de dados como o TVTropes e estudos computacionais mais recentes (Survey Sentiment CLS, 2021). A gramática actancial de Greimas, por sua vez, propôs um modelo semiótico mais abstrato com seis actantes (sujeito, objeto, destinador, destinatário, adjuvante, oponente), base para análises estruturais de enredos complexos.

No campo da crítica psicológica literária, a noção de **arco de personagem** (character arc) refere-se à transformação interior que um personagem sofre ao longo da narrativa, especialmente em resposta aos conflitos e eventos da história. Essa transformação pode ser positiva (o protagonista supera seus limites), negativa (deterioração psicológica) ou cíclica (personagem retorna ao estado inicial). A representação computacional de arcos de personagem exige, portanto, uma modelagem temporal da evolução do estado interno do personagem, não apenas de suas ações externas.

### 3.1.2 Análise de Redes em Literatura

A análise de redes complexas aplicada à literatura representa uma das mais férteis interseções entre humanidades e ciências exatas nas últimas décadas. O trabalho de Agarwal et al. (2013), ao extrair automaticamente a rede social de personagens de *Alice no País das Maravilhas*, demonstrou pela primeira vez a viabilidade de construir grafos de interação de personagens a partir de marcadores conversacionais e de co-ocorrência. Essa abordagem foi refinada em trabalhos subsequentes, como a análise de grafos de personagens em novels franceses (Network Analysis French Literature, 2024) e a análise de grafos em quadrinhos complexos (Graphic Novel Complex Networks, 2022).

O pipeline Renard (2024) representa o estado da arte em modularidade para extração de redes de personagens: sua arquitetura dividida em módulos independentes de NER, correferência e quantificação de interações permite que cada componente seja substituído ou atualizado independentemente, facilitando a adaptação para novas línguas e gêneros. O City of Millions (2025), ao mapear redes literárias de personagens em escala muito grande, demonstrou que técnicas de análise de redes podem revelar padrões socioestruturais sistemáticos em literaturas de diferentes culturas.

Para a língua portuguesa especificamente, o pipeline Taggus (Canário et al., 2025) representa a primeira ferramenta completa de extração de redes sociais de personagens a partir de texto ficcional em português, combinando NER, rastreamento de correferência e construção de grafos de co-ocorrência e interação.

### 3.1.3 Análise de Sentimento e Emoção em Literatura

A análise de sentimento em textos literários apresenta desafios únicos em relação a outros domínios. Os léxicos de emoção desenvolvidos para redes sociais ou textos jornalísticos capturaram um vocabulário emocional explícito e direto, inadequado para a riqueza expressiva da prosa literária, onde a emoção é frequentemente transmitida por metáforas, alusões e recursos de estilo (Survey Sentiment CLS, 2021).

O trabalho pioneiro de Mohammad (2013), utilizando o NRC Emotion Lexicon para rastrear arcos emocionais em 105 romances clássicos do Projeto Gutenberg, demonstrou que diferentes gêneros literários (aventura, romance, ficção científica) exibem perfis de arco emocional estatisticamente distintos. O método de Elkins e Chun (2018), ao analisar um romance experimental sem enredo convencional (*The Pale King*, de David Foster Wallace) com técnicas de análise de sentimento, demonstrou que mesmo romances não-convencionais exibem estruturas emocionais detectáveis computacionalmente, embora diferentes das narrativas convencionais.

O trabalho de Teodorescu e Mohammad (2023) estendeu a análise de arcos emocionais para contextos multilíngues, avaliando a robustez das técnicas de análise emocional em literaturas de diferentes línguas e culturas, fornecendo insights relevantes para a adaptação ao português. O framework Continuous Sentiment (2025) avança ainda mais ao propor uma escala de sentimento contínua de alta resolução temporal para contextos literários e multilíngues, superando as limitações das abordagens binárias (positivo/negativo) ou de categorias discretas de emoção.

### 3.1.4 Modelagem de Arcos de Personagem com Abordagens Centradas em Eventos

O pipeline MARCUS (2022) representa uma abordagem inovadora e conceitualmente distinta das anteriores: ao invés de analisar o sentimento de sentenças ou a co-ocorrência de personagens, o MARCUS extrai eventos narrativos — ações (alguém fez algo), estados (alguém estava em algum estado), e mudanças (algo mudou) — e os associa aos agentes que deles participam. Essa abordagem centrada em eventos permite reconstruir computacionalmente a trajetória de ações e transformações de cada personagem ao longo da narrativa com muito maior granularidade psicológica.

O benchmark AustenAlike (2024) contribuiu com uma metodologia de avaliação sistemática da qualidade de representações computacionais de personagens ficcionais, comparando representações geradas por diferentes sistemas contra análises literárias humanas de personagens de Jane Austen.

O sistema ArcANE Benchmark (2026), ao avaliar se agentes LLM que incorporam papéis de personagens mantêm a consistência psicológica ao longo de interações longas, fornece insights sobre a dificuldade de modelar a coerência psicológica de personagens.

### 3.1.5 Redes de Personagens em Escala e Gênero Literário

O trabalho de Genre Classification (2017) demonstrou que a estrutura topológica das redes de personagens apresenta correlações significativas com o gênero literário da obra, abrindo a possibilidade de classificação automática de gênero com base em características de rede, sem necessidade de análise de conteúdo temático.

O trabalho de Mining Character Networks (2016) propôs um dos primeiros sistemas completos de mineração e modelagem de redes de personagens a partir de obras em inglês, fornecendo métricas topológicas como centralidade de grau, intermediação e fechamento para caracterizar o papel de cada personagem na estrutura social narrativa.

O sistema GraphLit (2026), ao propor representações dinâmicas de redes de personagens enriquecidas com embeddings textuais, supera as limitações das abordagens puramente topológicas ao integrar informação semântica sobre a natureza das relações entre personagens. O trabalho de Balestri e Pescatore (2025), ao aplicar pipeline multiagente para extração de arcos de personagens em séries televisivas serializadas, demonstra a viabilidade de escalar as técnicas de modelagem para narrativas complexas multi-episódio.

## 3.2 Tabela Comparativa dos Trabalhos Revisados

| # | Autor/Projeto | Ano | Dimensão | Método Principal | Dataset | Resultado Principal | Limitação |
|---|---------------|-----|----------|-----------------|---------|--------------------|-----------| 
| 1 | Balestri & Pescatore | 2025 | Arcos | Pipeline multiagente | Séries TV | Extração escalável de arcos | Foco em audiovisual, não prosa |
| 2 | AustenAlike | 2024 | Perfil | Avaliação sistemática | Romances Austen | Benchmark para qualidade de representação | Escopo restrito a Austen |
| 3 | Teodorescu & Mohammad | 2023 | Emocional | NRC multilíngue | Múltiplos idiomas | Generalização de arcos emocionais | Resolução temporal limitada |
| 4 | MARCUS | 2022 | Psicológico | Eventos narrativos | Romances ingleses | Alta granularidade psicológica | Apenas inglês; custo computacional |
| 5 | DialogueRelation | 2025 | Relações | Diálogos + NLP | Romances modernos | Relações multidimensionais de personagens | Dependência de diálogos explícitos |
| 6 | City of Millions | 2025 | Redes | Análise em escala | Corpus massivo | Padrões socioestruturais literários | Riqueza individual limitada |
| 7 | Continuous Sentiment | 2025 | Emocional | Escala contínua | Múltiplos gêneros | Alta resolução temporal emocional | Validação em PT ainda ausente |
| 8 | Elkins & Chun | 2018 | Emocional | Análise de sentimento | 1 romance experimental | Estrutura emocional em obras não-convencionais | n=1; generalização limitada |
| 9 | Mohammad | 2013 | Emocional | NRC Emotion Lexicon | 105 romances Gutenberg | Arcos emocionais por gênero literário | Obras antigas; PT não coberto |
| 10 | Öhman & Rossi | 2024 | Emocional | Qualitativo + computacional | Romances finlandeses | Complementaridade quali-quanti | Finlandês; generalização incerta |
| 11 | ArcANE | 2026 | Arcos | LLM como agente | Benchmarks de personagem | Consistência de personagem em LLMs | Avaliação de agentes, não de texto |
| 12 | GraphLit | 2026 | Redes | Grafos dinâmicos + embeddings | Romances modernos | Redes enriquecidas semântica e dinamicamente | Custo computacional elevado |
| 13 | Network Analysis | 2024 | Redes | Teoria de redes + teoria do enredo | Literatura francesa | Revisão de cânone com técnicas de rede | Apenas literatura francesa |
| 14 | Renard | 2024 | Redes | Pipeline modular | Múltiplos romances | Alta modularidade e adaptabilidade | Performance inferior a abordagens end-to-end |
| 15 | Mining Character | 2016 | Redes | Mineração de dados | Obras inglesas | Sistema completo de extração | Desatualizado; pre-deep learning |
| 16 | Survey Sentiment | 2021 | Emocional | Survey | Literatura de estudos | Panorama completo da área | Anterior a LLMs modernos |
| 17 | Genre Classification | 2017 | Redes | Análise topológica | Múltiplos gêneros | Correlação rede-gênero literário | Análise estática; não temporal |
| 18 | Graphic Novel | 2022 | Redes | Redes complexas | Thorgal (quadrinho) | Análise detalhada de obra específica | n=1; não generalizável |
| 19 | Taggus | 2025 | Redes | Pipeline PT | Ficção portuguesa | Primeira ferramenta completa para PT | Avaliado em corpus pequeno |
| 20 | Agarwal et al. | 2013 | Redes | Co-ocorrência + diálogos | Alice no País das Maravilhas | Pioneiro na extração de redes de personagens | n=1; pré-deep learning |

## 3.3 Análise Crítica e Lacunas Identificadas

**Lacuna 1 – Integração das três dimensões de modelagem:** Nenhum trabalho revisado aborda de forma unificada as três dimensões (redes sociais, arcos emocionais, perfis psicológicos). Os sistemas existentes são mono-dimensionais, o que limita a completude das representações de personagens geradas.

**Lacuna 2 – Ausência de recursos para o português:** Com exceção do Taggus (2025), que aborda apenas a extração de redes sociais, nenhum sistema relevante foi desenvolvido ou avaliado especificamente para textos ficcionais em língua portuguesa. Léxicos de emoção literária em português são praticamente inexistentes.

**Lacuna 3 – Modelagem de personagens secundários:** Os sistemas existentes tendem a capturar bem os personagens protagonistas, mas apresentam desempenho degradado para personagens secundários com menor frequência de menção no texto — precisamente os personagens sobre os quais os autores mais frequentemente perdem o controle de consistência.

**Lacuna 4 – Resolução temporal fina de arcos emocionais:** A maioria dos sistemas de análise de arcos emocionais opera em granularidade de capítulo ou de segmentos fixos de 100 palavras (Mohammad, 2013). A modelagem de variações emocionais intra-cena, relevante para análise dramática detalhada, é raramente abordada.

## 3.4 Taxonomia dos Métodos

**Categoria A – Extração de Redes de Personagens**
- A.1: Baseados em co-ocorrência (janela de palavras)
- A.2: Baseados em interação dialógica
- A.3: Baseados em eventos narrativos (MARCUS)
- A.4: Grafos dinâmicos com embeddings (GraphLit)

**Categoria B – Análise de Arcos Emocionais**
- B.1: Léxico de emoção (Mohammad 2013, NRC Emotion Lexicon)
- B.2: Modelos de sequência (LSTM, Transformers) fine-tuned em domínio literário
- B.3: Escala contínua de alta resolução (Continuous Sentiment, 2025)

**Categoria C – Perfis Psicológicos**
- C.1: Template-based (preenchimento de ficha estruturada)
- C.2: Centrado em eventos (MARCUS)
- C.3: LLM como agente de personagem (ArcANE)

