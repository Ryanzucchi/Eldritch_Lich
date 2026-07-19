# 7 CONCLUSÃO

## 7.1 Retomada da Pergunta de Pesquisa e dos Objetivos

Esta tese partiu da seguinte pergunta de pesquisa: como pipelines computacionais centrados em eventos podem modelar automaticamente a evolução psicológica, o arco emocional e as redes de interação de personagens em romances em língua portuguesa, e de que forma essas representações estruturadas podem auxiliar autores a visualizar e aprimorar o desenvolvimento narrativo de seus personagens?

A investigação demonstrou que a resposta a essa pergunta exige uma abordagem necessariamente multidimensional. Nenhuma técnica isolada — análise de sentimento, extração de redes de co-ocorrência ou mapeamento de eventos narrativos — é capaz de capturar a complexidade de um personagem literário de forma satisfatória. O framework Character Modeling Framework (CMF) proposto integra essas três dimensões em uma arquitetura coerente e modular, preenchendo uma lacuna crítica identificada na revisão sistemática de vinte trabalhos.

Os objetivos específicos foram plenamente atingidos: (1) foi conduzida uma revisão sistemática abrangente dos sistemas existentes de modelagem de personagens ficcionais; (2) as limitações específicas para o português foram identificadas e documentadas; (3) a arquitetura modular CMF foi proposta com fundamentação rigorosa na literatura; (4) métricas de avaliação específicas para o domínio foram desenvolvidas; (5) as implicações para sistemas de apoio à escrita criativa foram analisadas em detalhe.

## 7.2 Síntese dos Achados Principais

A revisão sistemática revelou que o campo da modelagem computacional de personagens literários está fragmentado entre subcomunidades que raramente dialogam entre si. Os trabalhos que analisam redes de personagens (Agarwal et al., 2013; Renard, 2024; Canário et al., 2025) raramente integram análise emocional; os que analisam arcos emocionais (Mohammad, 2013; Teodorescu; Mohammad, 2023) raramente constroem representações psicológicas estruturadas; e os que propõem perfis psicológicos (MARCUS, 2022) raramente avaliam a qualidade das representações para o domínio literário em português.

Para a língua portuguesa especificamente, a análise confirmou a quase total ausência de recursos computacionais calibrados para textos ficcionais: o Taggus (Canário et al., 2025) é o único sistema relevante disponível, cobrindo apenas a extração de redes sociais. Léxicos de emoção literária em português, corpora anotados de arcos de personagem em português e benchmarks de avaliação de modelagem de personagem em língua portuguesa são inexistentes até a data desta pesquisa.

O framework CMF demonstra viabilidade técnica para as três dimensões de modelagem em português, com a ressalva explícita de que a qualidade dos módulos de análise emocional e geração de perfil depende de recursos de treinamento ainda a serem criados. A abordagem híbrida (NRC multilíngue + BERTimbau fine-tuned) mitiga parcialmente essa limitação, mas não a elimina.

## 7.3 Contribuições desta Pesquisa

Esta tese produz as seguintes contribuições originais para o campo:

**Contribuição 1 – Framework CMF integrado:** A primeira arquitetura que integra em um único pipeline as três dimensões de modelagem de personagens (redes sociais, arcos emocionais, perfis psicológicos) com adaptação explícita para a língua portuguesa.

**Contribuição 2 – Protocolo de avaliação específico para modelagem de personagens:** Um conjunto de métricas de avaliação (precisão de nós e arestas, correlação de Pearson de arcos emocionais, cobertura de personagens secundários, precisão factual de perfis) adequadas ao domínio literário, que podem ser adotadas por pesquisas futuras para comparação sistemática.

**Contribuição 3 – Taxonomia de métodos de modelagem de personagens ficcionais:** Organização dos vinte trabalhos revisados em cinco categorias metodológicas (extração baseada em co-ocorrência, extração baseada em diálogos, análise emocional lexical, análise emocional neural, modelagem centrada em eventos), facilitando a comparação e a seleção de abordagens.

**Contribuição 4 – Identificação formal de lacunas para o português:** Documentação sistemática da ausência de recursos (léxicos de emoção literária, corpora anotados, benchmarks) para modelagem de personagens ficcionais em língua portuguesa.

## 7.4 Trabalhos Futuros

Os trabalhos futuros mais relevantes derivados desta pesquisa são:

**Curto prazo (1-2 anos):**
- Criação de um corpus anotado de arcos emocionais de personagens em romances ficcionais em português, com anotações de especialistas literários.
- Desenvolvimento do benchmark de avaliação de modelagem de personagens em português, com base no protocolo AustenAlike (2024) adaptado para obras em língua portuguesa.
- Implementação e validação experimental do CMF em romances completos em português.

**Médio prazo (2-4 anos):**
- Integração do CMF com sistemas de detecção de contradições narrativas, permitindo verificar se os estados psicológicos dos personagens são consistentes ao longo da narrativa.
- Extensão do módulo GPP para modelagem de personagens em narrativas não lineares com múltiplas perspectivas temporais.
- Desenvolvimento de interface de visualização interativa de redes de personagens e arcos emocionais para integração em sistemas web de apoio à escrita criativa.

**Longo prazo (4+ anos):**
- Avaliação empírica de usabilidade e impacto criativo do CMF com escritores reais em contexto de uso prolongado.
- Expansão do sistema para suporte a línguas além do português.
- Investigação do uso do CMF como ferramenta pedagógica para ensino de escrita criativa.

## 7.5 Considerações Finais

A modelagem computacional de personagens literários representa uma das fronteiras mais fascinantes da inteligência artificial aplicada às humanidades. Compreender automaticamente a complexidade psicológica de um personagem ficcional — suas motivações, contradições, transformações e relações — é um desafio que requer a integração de técnicas de NLP, análise de redes, psicologia cognitiva e teoria literária. O framework CMF proposto nesta tese é um passo concreto nessa direção, com potencial de impacto tanto para a pesquisa acadêmica quanto para o desenvolvimento de ferramentas que enriqueçam a prática da escrita criativa em língua portuguesa.
