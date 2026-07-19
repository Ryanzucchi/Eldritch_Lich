# 4 METODOLOGIA

## 4.1 Paradigma de Pesquisa

Esta tese adota a **Design Science Research (DSR)** como abordagem metodológica central, por estar voltada para a criação de um artefato técnico — o framework CMF — com o objetivo de resolver um problema prático claramente identificado na literatura: a ausência de um sistema integrado de modelagem de personagens ficcionais para a língua portuguesa. A DSR foi complementada por uma revisão sistemática de literatura seguindo o protocolo PRISMA, conforme detalhado na seção 3.

A validade científica da DSR exige que o artefato produzido seja (a) útil para o problema que se propõe resolver, (b) construído com rigor metodológico e (c) avaliado em relação a critérios de desempenho claramente definidos. Esta tese satisfaz essas três condições: o CMF é projetado para resolver o problema de modelagem integrada de personagens ficcionais em português; é construído com base rigorosa na literatura de NLP e análise de redes; e é avaliado em relação a critérios de precisão, cobertura e utilidade para autores.

## 4.2 Protocolo de Revisão Sistemática

### 4.2.1 Critérios de Inclusão
- Estudos sobre extração automática de redes de personagens, análise de arcos emocionais ou modelagem psicológica de personagens ficcionais.
- Publicados entre 2013 e 2026 (com exceção de trabalhos seminais anteriores).
- Apresentam avaliação experimental ou proposta metodológica concreta.

### 4.2.2 Critérios de Exclusão
- Estudos exclusivamente sobre análise de sentimento em domínios não literários (redes sociais, notícias).
- Trabalhos sem metodologia reproduzível ou sem acesso ao texto completo.
- Estudos sobre audiovisual sem conexão com técnicas aplicáveis a texto narrativo.

### 4.2.3 Processo de Seleção
Vinte estudos foram selecionados cobrindo as três dimensões de modelagem de personagens: redes (6 trabalhos), emoção (8 trabalhos) e perfil psicológico (6 trabalhos).

## 4.3 Framework de Modelagem: Character Modeling Framework (CMF)

O CMF é concebido como uma arquitetura modular de três camadas analíticas interconectadas. Sua concepção integra as abordagens mais bem-sucedidas identificadas na revisão sistemática:

**Camada 1 – Extração de Redes Sociais (ERS):** Baseada na abordagem modular do Renard (2024) e na adaptação para português do Taggus (Canário et al., 2025), esta camada constrói grafos dinâmicos de interação entre personagens.

**Camada 2 – Análise de Arco Emocional (AAE):** Combinando o NRC Emotion Lexicon multilíngue (Teodorescu; Mohammad, 2023) com modelos neurais de sentimento contínuo (Continuous Sentiment, 2025), esta camada rastreia a trajetória emocional de cada personagem ao longo da narrativa.

**Camada 3 – Geração de Perfil Psicológico (GPP):** Inspirada na abordagem centrada em eventos do MARCUS (2022) e no template de caracterização do ArcANE (2026), esta camada gera fichas estruturadas de personagem com atributos psicológicos derivados do texto.

## 4.4 Critérios de Avaliação

**Avaliação das Redes de Personagens:**
- Precision, recall e F1-score para identificação de nós (personagens) e arestas (interações).
- Correlação de Spearman entre centralidade de grau calculada pelo CMF e rankings humanos de importância de personagens.

**Avaliação dos Arcos Emocionais:**
- Correlação de Pearson entre os arcos calculados pelo CMF e julgamentos de especialistas literários em uma amostra de capítulos.
- Cobertura de personagens secundários: percentual de personagens com 5 ou menos menções no texto para os quais o sistema gera um arco emocional.

**Avaliação dos Perfis Psicológicos:**
- Avaliação qualitativa por escritores: relevância e completude dos perfis gerados em relação ao texto de origem.
- Precisão factual: percentual de afirmações nos perfis que são diretamente verificáveis no texto.

## 4.5 Corpus de Validação

O CMF será avaliado em um corpus de romances ficcionais em língua portuguesa composto por:
- 5 romances de domínio público em português europeu (Eça de Queirós, Camilo Castelo Branco).
- 5 romances contemporâneos em português brasileiro de diferentes gêneros (fantasia, policial, romance).
- 2 romances fornecidos por escritores participantes do sistema de apoio à escrita (corpus privado, com consentimento informado).

