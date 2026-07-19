# 5 DESENVOLVIMENTO E PROPOSTA TÉCNICA: CHARACTER MODELING FRAMEWORK (CMF)

## 5.1 Visão Geral da Arquitetura CMF

O **Character Modeling Framework (CMF)** é uma arquitetura de processamento de texto narrativo em três camadas integradas, projetada especificamente para romances ficcionais em língua portuguesa. Seu desenvolvimento fundamenta-se nas lacunas identificadas na revisão sistemática: a ausência de integração entre redes de personagens, arcos emocionais e perfis psicológicos em um único sistema, e a ausência de ferramentas calibradas para o português literário.

A arquitetura do CMF é representada como um pipeline com entrada de texto narrativo e múltiplas saídas estruturadas: grafo de rede de personagens (formato JSON/GraphML), curvas de arco emocional por personagem (formato CSV/SVG), e fichas de personagem estruturadas (formato Markdown/JSON).

## 5.2 Módulo 1 – Extração de Redes Sociais de Personagens (ERS)

### 5.2.1 Identificação de Personagens

O módulo ERS inicia com a identificação de todos os personagens do romance utilizando o pipeline de NER literário para português proposto em teses paralelas desta pesquisa (fundamentado no PPORTAL_ner de Silva e Moro, 2024, e no Taggus de Canário et al., 2025). O NER literário fornece não apenas os tokens de nomes próprios, mas também seus aliases, apelidos e formas pronominais vinculadas por resolução de correferência.

Cada personagem identificado recebe um **nó** no grafo de rede com os seguintes atributos iniciais:
- `id`: identificador único (nome canônico)
- `aliases`: lista de formas de referência alternativas
- `first_mention`: capítulo e parágrafo da primeira menção
- `mention_count`: frequência total de menções
- `entity_type`: PER (pessoa), LOC (localização), ORG (organização)

### 5.2.2 Extração de Interações

Dois tipos de interação são extraídos:

**Interação por co-ocorrência:** Dois personagens são considerados em interação se são mencionados dentro de uma janela de *W* palavras (default W=150). A intensidade da aresta é proporcional à frequência de co-ocorrência normalizada pela frequência individual dos personagens. Essa abordagem segue a metodologia do Mining Character Networks (2016) e do City of Millions (2025).

**Interação por diálogo:** Quando dois personagens participam de uma troca de diálogos (identificada por marcadores conversacionais e aspas), uma aresta de interação dialógica é criada com peso superior à co-ocorrência, refletindo a maior proximidade narrativa implícita em uma conversa direta (DialogueRelation, 2025).

### 5.2.3 Dinamismo Temporal do Grafo

O grafo de rede de personagens é construído de forma incremental e temporal: a cada capítulo processado, o estado do grafo é salvo como um snapshot. Isso permite visualizar não apenas a rede estática final, mas sua evolução ao longo da narrativa — revelando como alianças se formam, conflitos emergem e personagens ganham ou perdem centralidade (GraphLit, 2026).

As métricas topológicas calculadas para cada personagem incluem:
- **Centralidade de grau (degree centrality):** mede a quantidade de interações diretas.
- **Centralidade de intermediação (betweenness centrality):** mede o papel do personagem como intermediário entre grupos.
- **Coeficiente de agrupamento (clustering coefficient):** mede a densidade do grupo social ao redor do personagem.

Essas métricas correlacionam-se empiricamente com papéis narrativos: protagonistas têm alta centralidade de grau, personagens-pivô têm alta intermediação, e grupos sociais coesos têm alto coeficiente de agrupamento (Network Analysis French Literature, 2024; Genre Classification, 2017).

## 5.3 Módulo 2 – Modelagem de Arco Emocional Contínuo (AAE)

### 5.3.1 Representação da Emoção

O módulo AAE representa o estado emocional de cada personagem em uma escala bidimensional: **valência** (positivo-negativo) e **excitação** (ativado-desativado), seguindo o modelo circumplex de Russell, amplamente adotado na análise computacional de emoções literárias (Survey Sentiment CLS, 2021; Mohammad, 2013).

Para cada cena ou parágrafo em que um personagem é mencionado, o AAE extrai o estado emocional associado usando uma combinação de:

1. **NRC Emotion Lexicon multilíngue (pt):** Léxico de palavras associadas a oito emoções básicas (alegria, tristeza, raiva, medo, nojo, surpresa, antecipação, confiança), adaptado para português com técnicas de tradução-alinhamento (Teodorescu; Mohammad, 2023).

2. **Modelo de sentimento contínuo fine-tuned:** Um modelo baseado no BERTimbau-large, ajustado em corpus de textos literários com anotações de valência e excitação, produzindo scores contínuos em vez de categorias discretas (Continuous Sentiment, 2025).

3. **Detector de ironia literária:** Um classificador específico para detectar construções irônicas e sarcásticas que revertem a polaridade superficial do texto — essencial em obras de humor literário e romances de costumes (Elkins; Chun, 2018).

### 5.3.2 Geração das Curvas de Arco Emocional

Para cada personagem, o AAE gera uma curva de valência emocional ao longo do romance, normalizada pelo número de capítulos. A curva é visualizável como um gráfico de linha interativo, permitindo ao autor identificar picos e vales dramáticos e compará-los com a estrutura de eventos da narrativa.

Padrões típicos de arco emocional identificados por Mohammad (2013) — como o arco de Rags to Riches (início negativo, progressão positiva), Man in a Hole (queda e recuperação) e Icarus (ascensão e queda) — são detectados automaticamente por uma função de correspondência de forma de curva implementada no AAE, fornecendo ao autor uma classificação do arco de cada personagem segundo esses arquétipos narrativos.

### 5.3.3 Comparação de Arcos entre Personagens

Uma funcionalidade inovadora do AAE é a comparação interativa de arcos emocionais entre múltiplos personagens: o sistema gera visualizações sobrepostas dos arcos de protagonista e antagonista, revelando padrões de espelhamento, convergência e divergência emocional que caracterizam a dinâmica dramática da obra (Öhman; Rossi, 2024).

## 5.4 Módulo 3 – Geração de Perfil Psicológico Estruturado (GPP)

### 5.4.1 Extração de Atributos via Eventos Narrativos

Seguindo a abordagem do pipeline MARCUS (2022), o módulo GPP extrai eventos narrativos associados a cada personagem: ações realizadas (o personagem como agente), estados sofridos (o personagem como paciente) e transformações de estado (mudanças nos atributos do personagem). Esses eventos são classificados em categorias funcionais:

- **Eventos de ação física:** movimentos, confrontos, deslocamentos.
- **Eventos de fala e pensamento:** o que o personagem diz, pensa e sente explicitamente.
- **Eventos de relação:** encontros, separações, traições, reconciliações.
- **Eventos de transformação:** nascimento, morte, metamorfose, revelação.

### 5.4.2 Geração da Ficha Estruturada de Personagem

Com base nos eventos extraídos e nas métricas do grafo de rede, o GPP gera automaticamente uma ficha de personagem com os seguintes campos:

**Perfil Básico:** Nome canônico, aliases, gênero, faixa etária, papel narrativo (protagonista, antagonista, coadjuvante), grupo social de pertencimento.

**Atributos Psicológicos:** Traços dominantes de personalidade (derivados da frequência de tipos de ação), motivações principais (derivadas dos objetivos perseguidos nos eventos), conflitos internos (derivados de contradições nos padrões de comportamento).

**Evolução ao Longo da Narrativa:** Arco de transformação (tipo de arco detectado pelo AAE), eventos-chave que marcam pontos de virada, capítulo de primeira e última menção significativa.

**Rede de Relações:** Lista de relacionamentos com outros personagens, classificados por tipo (familiar, romântico, profissional, conflitivo) e polaridade.

O GPP é implementado como um sistema template-based com completação por LLM local: o template estruturado é preenchido com os atributos extraídos automaticamente pelos módulos ERS e AAE, e um SLM (Small Language Model) local é utilizado para gerar descrições em linguagem natural dos traços e motivações identificados, seguindo o princípio de privacidade por design.

## 5.5 Visualização Interativa

O CMF inclui um módulo de visualização baseado em tecnologias web (D3.js + Sigma.js) que oferece as seguintes visualizações:

**Grafo de rede interativo:** Nós dimensionados por centralidade, coloridos por grupo social, com animação temporal que mostra a evolução da rede capítulo a capítulo. Inspirado nas diretrizes de visualização de grafos do GuidelineExplorer (IEEE TVCG) *apud* pesquisa de grafos de conhecimento.

**Curvas de arco emocional:** Gráfico de linha interativo com seleção múltipla de personagens para comparação simultânea.

**Ficha de personagem expandível:** Interface card-based com os campos da ficha estruturada, editável pelo autor para complementar as informações automaticamente extraídas.

## 5.6 Trade-offs e Limitações da Implementação

**Precisão vs. Cobertura:** O módulo ERS alcança alta precisão na extração de interações de personagens protagonistas, mas apresenta recall inferior para personagens com frequência de menção abaixo de 10 ocorrências. A calibração do limiar de extração entre cobertura e precisão é configurável pelo usuário.

**Resolução Temporal vs. Custo Computacional:** A construção de snapshots do grafo por capítulo permite análise temporal granular, mas aumenta o custo computacional e de armazenamento proporcionalmente ao número de capítulos.

**Qualidade dos Perfis vs. Disponibilidade de Dados:** A riqueza dos perfis psicológicos gerados pelo GPP depende diretamente da frequência e variedade de eventos associados ao personagem no texto. Para personagens com poucas cenas, os perfis tendem a ser superficiais.

