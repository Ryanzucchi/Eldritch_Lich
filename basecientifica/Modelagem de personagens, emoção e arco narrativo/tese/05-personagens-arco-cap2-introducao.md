# 1 INTRODUÇÃO

## 1.1 Contextualização do Problema

O personagem literário é universalmente reconhecido como o elemento central da ficção narrativa. Desde Aristóteles, que na *Poética* afirmou que os personagens existem em função da ação, até as modernas teorias de narratologia estrutural (Greimas, Propp, Genette), a análise dos agentes narrativos e suas trajetórias constitui o cerne do estudo literário. Na era contemporânea, com a proliferação de romances seriados de múltiplos volumes e sagas de gênero (fantasia épica, ficção científica, romance policial), a complexidade dos universos ficcionais e o número de personagens gerenciados pelos autores atingiram dimensões sem precedente histórico.

Paralelamente, o campo do Processamento de Linguagem Natural (PLN) desenvolveu ferramentas cada vez mais sofisticadas para a análise automática de textos. Contudo, a aplicação dessas ferramentas à modelagem computacional de personagens ficcionais permanece um desafio em aberto, especialmente quando se considera a língua portuguesa e os textos ficcionais contemporâneos. Sistemas genéricos de análise de sentimento, como os baseados no léxico SentiWordNet ou em classificadores treinados em dados de redes sociais, apresentam desempenho severamente degradado quando aplicados a textos literários, onde a ironia, a ambiguidade proposital e a polissemia são recursos estilísticos fundamentais (ELKINS; CHUN, 2018; SURVEY SENTIMENT CLS, 2021).

O problema central investigado nesta tese pode ser decomposto em três dimensões interconectadas:

**Dimensão 1 – Extração de redes de personagens:** Identificar automaticamente todos os personagens de um romance, suas interações diretas e indiretas, e quantificar a intensidade e natureza dessas relações ao longo da narrativa. Trabalhos como os de Agarwal et al. (2013), que analisaram a rede social de *Alice no País das Maravilhas*, e mais recentemente o pipeline Renard (2024) e o Taggus para textos em português (Canário et al., 2025), estabeleceram abordagens metodológicas promissoras, mas com limitações específicas.

**Dimensão 2 – Modelagem de arcos emocionais:** Rastrear a trajetória emocional de personagens ao longo da narrativa, capturando como seus estados afetivos evoluem em resposta aos eventos da história. O trabalho pioneiro de Mohammad (2013), que analisou os arcos emocionais de 105 romances clássicos usando NRC Emotion Lexicon, e as extensões posteriores para contextos multilíngues (Teodorescu; Mohammad, 2023) e contextos literários especializados (Continuous Sentiment, 2025) oferecem a base metodológica para essa dimensão.

**Dimensão 3 – Modelagem do perfil psicológico estruturado:** Gerar automaticamente fichas de personagem estruturadas que capturam não apenas características físicas e biográficas, mas também traços psicológicos, motivações, conflitos internos e arcos de transformação, com base em análise do texto narrativo. O pipeline MARCUS (2022), centrado em eventos narrativos como primitivas de extração de informação sobre personagens, representa a abordagem mais avançada nessa direção.

## 1.2 Justificativa e Relevância

A relevância científica desta pesquisa sustenta-se na identificação de uma lacuna crítica na literatura de NLP aplicado à literatura: a ausência de um framework integrado que aborde as três dimensões da modelagem de personagens (redes sociais, arcos emocionais e perfis psicológicos) de forma unificada, adaptado para a língua portuguesa. Trabalhos existentes tendem a abordar cada dimensão isoladamente, dificultando a construção de sistemas completos de apoio à escrita.

A relevância prática emerge do contexto de aplicação desta pesquisa: o desenvolvimento de sistemas web de organização de histórias e brainstorm para escritores. Nesses sistemas, a capacidade de visualizar automaticamente as redes de relações entre personagens, acompanhar os arcos emocionais e gerar fichas de personagem a partir do texto escrito representa uma funcionalidade de alto valor para a prática criativa. Autores de romances longos frequentemente perdem o controle da consistência de seus personagens ao longo de centenas de páginas — um sistema de modelagem automática mitigaria esse problema significativamente.

Do ponto de vista da língua portuguesa especificamente, a escassez de recursos computacionais adaptados (léxicos de emoção, corpora anotados, pipelines calibrados) para análise literária em português constitui uma oportunidade de pesquisa com alto impacto potencial para a comunidade científica e para a indústria editorial nacional.

## 1.3 Objetivos

### 1.3.1 Objetivo Geral

Propor, desenvolver e avaliar o framework **Character Modeling Framework (CMF)**, uma arquitetura computacional modular para modelagem automática de personagens ficcionais em romances em língua portuguesa, integrando extração de redes sociais, análise de arcos emocionais e geração de perfis psicológicos estruturados.

### 1.3.2 Objetivos Específicos

1. Conduzir uma revisão sistemática da literatura sobre modelagem computacional de personagens ficcionais, análise de redes de personagens e análise de sentimento em contextos literários.
2. Identificar as principais limitações dos sistemas existentes para o processamento de textos ficcionais em língua portuguesa.
3. Propor uma arquitetura modular que integre extração de redes, modelagem emocional e geração de perfis psicológicos em um único pipeline coerente.
4. Desenvolver e adaptar métricas de avaliação específicas para a qualidade da modelagem de personagens ficcionais.
5. Analisar as implicações dos achados para o design de sistemas de apoio à escrita criativa.

## 1.4 Pergunta de Pesquisa e Hipóteses

**Pergunta de Pesquisa:** Como pipelines computacionais centrados em eventos podem modelar automaticamente a evolução psicológica, o arco emocional e as redes de interação de personagens em romances em língua portuguesa, e de que forma essas representações estruturadas podem auxiliar autores a visualizar e aprimorar o desenvolvimento narrativo de seus personagens?

**Hipótese 1:** Pipelines centrados em eventos narrativos (ação, interação, diálogo) extraem representações de personagens mais ricas e precisas do que abordagens baseadas exclusivamente em análise de sentimento de sentenças isoladas.

**Hipótese 2:** A integração das três dimensões de modelagem (redes sociais, arcos emocionais, perfis psicológicos) em um framework unificado produz representações mais completas e úteis para autores do que a análise isolada de cada dimensão.

**Hipótese 3:** É possível adaptar sistemas desenvolvidos para o inglês (como o MARCUS e o GraphLit) para o português com degradação de desempenho aceitável, usando técnicas de transferência de aprendizado multilíngue.

## 1.5 Delimitação do Escopo

O foco desta tese recai sobre romances ficcionais em prosa escritos originalmente em língua portuguesa (brasileiro e europeu), ou disponíveis em tradução de alta qualidade. Textos de outros gêneros (poesia, teatro, crônica) estão fora do escopo. O processamento de obras em outros idiomas é considerado apenas na revisão de trabalhos relacionados. Aspectos de design de interface do sistema de visualização são brevemente discutidos, mas a avaliação de usabilidade com usuários reais está além do escopo desta pesquisa.

## 1.6 Estrutura do Documento

A tese está organizada em oito capítulos. Os Capítulos 3 e 4 detalham o referencial teórico e a metodologia. O Capítulo 5 descreve o framework CMF proposto. O Capítulo 6 apresenta a discussão dos resultados. O Capítulo 7 traz as conclusões.

