# 4 METODOLOGIA

## 4.1 Paradigma de Pesquisa

Esta tese adota a **Design Science Research (DSR)** como paradigma principal, combinada com revisão sistemática segundo o protocolo PRISMA. A abordagem DSR é justificada pela natureza construtiva da pesquisa: o artefato central é o framework TropeDetector-PT, cujo valor científico reside tanto na originalidade da proposta quanto na demonstração de sua utilidade prática para escritores.

## 4.2 Protocolo de Revisão Sistemática

**Critérios de inclusão:**
- Estudos sobre detecção de tropos, análise de padrões narrativos ou ontologias narrativas computacionais.
- Publicados entre 2013 (ano da formalização do TVTropes como recurso científico) e 2026.
- Apresentam método reproduzível ou dataset de avaliação.

**Critérios de exclusão:**
- Estudos puramente teóricos sem aplicação computacional.
- Trabalhos sobre análise de narrativas não ficcionais (notícias, relatórios) sem conexão com tropos ficcionais.
- Estudos sem acesso ao texto completo.

Vinte estudos foram selecionados, cobrindo: ontologias e taxonomias (5), detecção computacional (6), análise de gêneros específicos (4), análise crítica (3) e benchmarks (2).

## 4.3 Construção da Ontologia PT-500

A ontologia PT-500 é um recurso original desta tese: uma seleção de 500 tropos canônicos do TVTropes traduzidos, adaptados e exemplificados para a ficção especulativa em língua portuguesa.

**Critérios de seleção dos 500 tropos:**
1. Presença em pelo menos 5% dos romances do corpus de ficção especulativa em inglês (base: TVTropes statistics).
2. Aplicabilidade a pelo menos uma das subcategorias: Character Tropes, Plot Tropes, Setting Tropes.
3. Instâncias identificáveis em obras ficcionais brasileiras ou portuguesas disponíveis.

**Processo de tradução e adaptação:**
- Tradução automática das descrições de tropos (GPT-4o) seguida de revisão por pós-graduandos em Letras bilíngues.
- Adição de pelo menos 2 exemplos de obras ficcionais em português para cada tropo.
- Validação por painel de 3 especialistas em teoria literária e ficção especulativa.

**Hierarquia da ontologia PT-500:**
- Nível 1: Supercategoria (Character, Plot, Setting, Theme) — 4 categorias
- Nível 2: Categoria (Protagonist, Antagonist, Mentor, Romance, Adventure, Mystery...) — 32 categorias
- Nível 3: Subcategoria (Chosen One, Anti-Hero, Mentor Death, Love Triangle...) — 150 subcategorias
- Nível 4: Tropo específico — 500 tropos com descrição, exemplos e marcadores textuais típicos

## 4.4 Pipeline TropeDetector-PT: Estágio 1 — Detecção Local

O Estágio 1 usa um classificador fine-tuned para detectar candidatos a tropos em nível de capítulo:

**Modelo base:** BERTimbau-large (BERT pré-treinado em português com 335M parâmetros), com camada de classificação multi-label (cada tropo é uma classe binária independente).

**Dados de treinamento:** Os dados de treinamento são construídos por:
- Tradução do TropesInWild (Rodriguez Vidal et al., 2023) para português via tradução automática revisada.
- Exemplos positivos extraídos do TVTropes (snippets de texto em inglês traduzidos + exemplos em português).
- Exemplos negativos por amostragem aleatória de trechos de obras que não apresentam os tropos em questão.

**Estratégia de fine-tuning:** Para 500 classes simultâneas, o treinamento usa Binary Cross-Entropy loss com class weights inversamente proporcionais à frequência de cada tropo no corpus de treinamento, para mitigar o desbalanceamento severo (tropos raros têm muito menos exemplos positivos).

**Saída do Estágio 1:** Para cada capítulo do romance, uma lista de tropos candidatos com scores de confiança. Apenas candidatos com score > threshold (default 0,3) avançam ao Estágio 2.

## 4.5 Pipeline TropeDetector-PT: Estágio 2 — Verificação Global por LLM

O Estágio 2 usa um LLM local (Phi-3.5-mini-instruct ou Qwen2.5-7B) com a seguinte estratégia de few-shot prompting:

**Contexto fornecido ao LLM:**
1. Descrição completa do tropo candidato (da ontologia PT-500).
2. Exemplos canônicos do tropo (2-3 exemplos de outras obras, em português).
3. Trecho do capítulo onde o candidato foi detectado (janela de ±500 palavras ao redor da instância).
4. Resumo global dos capítulos anteriores e do estado dos personagens (gerado pelo módulo de sumarização).

**Prompt estruturado:**
```
Você é um especialista em teoria narrativa e literatura especulativa.
Analise se o tropo "{nome_do_tropo}" está presente no seguinte trecho,
considerando o contexto narrativo global da obra.
Definição do tropo: {definição_PT500}
Exemplos em outras obras: {exemplos}
Contexto da obra até aqui: {resumo_global}
Trecho analisado: {trecho}
Responda com: SIM (presente), NÃO (ausente), ou VARIANTE (subversão/desconstrução).
Explique brevemente sua decisão.
```

**Saída do Estágio 2:** Para cada candidato verificado, uma classificação ternária (presente / ausente / variante) com justificativa textual.

## 4.6 Critérios de Avaliação

- **Precision, Recall e F1-score por tropo:** Calculados sobre o corpus de avaliação (obras com anotações humanas de tropos).
- **Macro-F1:** Média não ponderada do F1 de todos os 500 tropos — trata todos os tropos igualmente independente da frequência.
- **Micro-F1:** F1 ponderado pela frequência de cada tropo — privilegia tropos mais comuns.
- **Taxa de detecção de variantes (subversões):** Recall específico para instâncias classificadas como VARIANTE.
- **Latência de processamento:** Tempo total por capítulo (Estágio 1 + Estágio 2 para candidatos confirmados).

# 5 DESENVOLVIMENTO DO FRAMEWORK TROPEDETECTOR-PT

## 5.1 Visão Geral do Sistema

O TropeDetector-PT processa romances de ficção especulativa em língua portuguesa e retorna, para cada obra processada:
1. **Lista de tropos detectados** com capítulos de ocorrência, score de confiança e classificação (presente/variante).
2. **Relatório de padrões:** Distribuição de tropos por categoria (Character, Plot, Setting, Theme), com comparação a distribuições típicas do gênero literário.
3. **Mapa de co-ocorrências:** Quais tropos tendem a aparecer juntos na obra, comparado com correlações típicas (ex.: Fantasy Tropes Analysis, 2025).
4. **Sugestões de exploração:** Quais tropos tipicamente esperados para o gênero estão ausentes (possível oportunidade de subversão deliberada ou lacuna narrativa).

## 5.2 Componentes de Suporte

**Módulo de Sumarização Narrativa:** Integrado com o framework HNS-PT (Tese 04 desta pesquisa), fornece ao Estágio 2 do TropeDetector-PT um resumo do estado narrativo global da obra até o capítulo analisado, incluindo estado dos personagens, eventos-chave e arcos emocionais ativos.

**Módulo de Detecção de Gênero:** Classifica o gênero literário da obra (fantasia épica, ficção científica hard SF, romance policial, etc.) para calibrar os thresholds e as expectativas de distribuição de tropos. Obras de fantasia épica são avaliadas com distribuições de referência da análise de Fantasy Tropes (2025); obras de ficção científica, com as de Narrative Patterns in SF (2024).

**Módulo de Análise de Representatividade:** Implementa as análises de Tropes as Harmful Stereotypes (2024) para identificar tropos com implicações de representação (gênero, raça, orientação sexual), fornecendo alertas ao escritor quando tropos potencialmente problemáticos são detectados.

## 5.3 Interface de Feedback para Escritores

O TropeDetector-PT integra-se ao sistema web de organização de escrita como um painel analítico de "DNA Narrativo" da obra, exibindo:

**Painel de Tropos Detectados:** Lista categorizada dos tropos identificados, com links para a definição do TVTropes e exemplos em outras obras, permitindo ao escritor entender o contexto canônico de cada tropo.

**Mapa Radar de Gênero:** Gráfico radar comparando a distribuição de tropos da obra com a distribuição típica do gênero declarado, revelando onde a obra está alinhada ou se distancia das convenções de gênero.

**Alerta de Subversão:** Quando o Estágio 2 classifica uma instância como VARIANTE (subversão/desconstrução), o sistema destaca a instância e a classifica como "Subversão Criativa" — feedback positivo para escritores que deliberadamente manipulam convenções.

**Sugestão Proativa:** Com base nos tropos detectados, o sistema sugere tropos relacionados que tipicamente co-ocorrem (com base nos dados de co-ocorrência de Fantasy Tropes Analysis, 2025), que podem ser explorados ou deliberadamente evitados pelo autor.

## 5.4 Trade-offs e Limitações Técnicas

**Trade-off 1 — Cobertura vs. Precisão:** O uso de 500 tropos (vs. os 30.000 do TVTropes completo) sacrifica cobertura em troca de qualidade de detecção. Para os 500 tropos selecionados, os dados de treinamento são suficientes para fine-tuning razoável; para os tropos restantes, o sistema recorre exclusivamente ao Estágio 2 (LLM zero-shot), com precisão inferior.

**Trade-off 2 — Latência vs. Precisão:** O Estágio 2 (verificação por LLM) adiciona latência significativa (3-10 segundos por candidato verificado em CPU). Para romances com muitos candidatos (capítulos ricos em tropos), o processamento completo pode levar dezenas de minutos. Uma estratégia de verificação lazy (somente sob demanda do usuário) mitiga esse custo.

**Trade-off 3 — Localidade vs. Qualidade:** O uso de LLMs locais no Estágio 2 é inferior em raciocínio abstrato aos modelos proprietários. GPT-4o, por exemplo, detectaria tropos de alta abstração com maior precisão — mas ao custo de enviar o texto ficcional a uma API externa, incompatível com os requisitos de privacidade do sistema.
