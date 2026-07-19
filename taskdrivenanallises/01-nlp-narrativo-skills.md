# Proposta de Skills — Reconhecimento de Entidades e NLP em texto narrativo/ficção

Abaixo estão especificadas as skills técnicas extraídas da Tese 01 e de sua base científica correspondente, com diretrizes acionáveis para o time de engenharia e agentes de IA implementarem o processamento de linguagem natural do sistema.

---

## Skill: `deteccao-entidades-literarias-portugues`

**Temática de origem:** Reconhecimento de Entidades e NLP em texto narrativo/ficção (Tese 01)
**Objetivo:** Extrair entidades literárias básicas (pessoas, locais, organizações) de textos ficcionais em português de forma rápida, eficiente em memória VRAM e com execução completamente local.
**Quando usar (triggers):** Importação de manuscritos, atualização de capítulos no editor de texto, ou criação/atualização de fichas de personagens.
**Fundamentação científica:** Silva & Moro (2024 - PPORTAL_ner), Sarcinelli et al. (2025 - MariNER), Silva & Moro (2024 - Evaluating Pre-training).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Tokenização e Codificação:** Utilizar o vocabulário do BERTimbau-large para tokenizar o texto de entrada em blocos de até 512 tokens.
2. **Inferência por Fine-Tuning:** Passar as sentenças pelo modelo BERTimbau ajustado no corpus PPORTAL_ner para classificar os tokens sob o esquema IOB2 em 5 categorias (priorizando `PESSOA` e `LOCAL`).
3. **Filtragem de Confiança:** Reter entidades detectadas cuja probabilidade (camada softmax) seja superior a 70%.
4. **Adaptação Histórica e de Época:** Para textos identificados como romances de época ou com termos arcaicos do português do início do século XX, carregar os pesos e mapeamentos adicionais do MariNER para capturar epítetos e grafias em desuso.
5. **Redução de Carga:** Chamar esse classificador leve na CPU ou em pouca memória de GPU (exige ~1.4 GB de VRAM), evitando a ativação de LLMs mais custosos para a extração primária.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Erro de Domínio Noticioso:** Não usar modelos NER genéricos treinados apenas em textos jornalísticos (como SpaCy padrão ou Stanford NER não adaptado), pois ignoram personagens secundários ou confundem nomes de fantasias/aliases com palavras comuns (Dekker et al., 2019; Vala et al., 2015).

**Métricas de sucesso sugeridas:**
- F1-Score na categoria `PESSOA` em dados de teste literários (alvo $\ge 85\%$).
- Tempo de processamento médio (alvo < 200ms por página de 500 palavras em CPU local).

**Requisito(s) do projeto relacionado(s):** RF-18 (reconhecimento de entidades), RF-15 (suporte multilíngue no NER), RF-107 (identificação automática).

**Nível de maturidade da técnica:** Consolidada.

---

## Skill: `resolucao-correferencia-e-aliases-literarios`

**Temática de origem:** Reconhecimento de Entidades e NLP em texto narrativo/ficção (Tese 01)
**Objetivo:** Agrupar variações de nomes (aliases), epítetos e referências pronominais (ele, ela, seu) de volta à entidade canônica do personagem correspondente, resolvendo a coesão do elenco.
**Quando usar (triggers):** Geração da rede social de personagens, unificação de fichas de personagens no banco de dados e atualização de outlines de cenas.
**Fundamentação científica:** Vala et al. (2015 - Mr. Bennet, coachman), Bamman, Lewke & Mansoor (2020 - LitBank Coreference), Jahan et al. (2020 - Narratologically Grounded Character Identification), Canário et al. (2025 - Taggus).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Identificação de Aliases Parciais:** Mapear menções parciais ou referências relacionais ("o velho cocheiro", "Sra. Silva", "Maria") extraídas pelo NER.
2. **Busca Retroativa de Candidatos:** Para cada pronome ou alias parcial encontrado, varrer as últimas 5 a 10 sentenças anteriores no texto (janela móvel) buscando entidades já estabelecidas na mesma cena.
3. **Análise de Agência Narratológica:** Utilizar dependências gramaticais para identificar se a entidade tem papel de agente principal ("sujeito" do verbo principal) para pontuar sua relevância (heurística de Jahan et al., 2020).
4. **Agrupamento por Similaridade de Contexto:** Aplicar algoritmos de distância de strings (ex: Jaro-Winkler e distância de edição de nomes) e frequência de coocorrência de termos ao redor (heurísticas de de-aliasing do Taggus) para unificar variantes em um único ID de personagem canônico.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Perda de Referências Distantes:** Modelos tradicionais de resolução de correferência treinados em notícias falham em resolver correferências de longa distância típicas de romances (Bamman et al., 2020). É necessário guiar o desmembramento por meio da rede local de coocorrência (heurística do Taggus).

**Métricas de sucesso sugeridas:**
- F1-Score de agrupamento de aliases (alvo $\ge 75\%$).
- Precisão de resolução de correferências pronominais.

**Requisito(s) do projeto relacionado(s):** RF-109 (unificação de entidades), RF-146 (detecção de variações de nomes), RF-147 (aliases).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `entity-linking-wikidata-local`

**Temática de origem:** Reconhecimento de Entidades e NLP em texto narrativo/ficção (Tese 01)
**Objetivo:** Conectar entidades do mundo real (como locais geográficos e figuras históricas mencionadas no livro) ao Wikidata, criando ao mesmo tempo uma ontologia dinâmica em memória para os personagens fictícios inventados pelo autor.
**Quando usar (triggers):** Enriquecimento de outlines históricos, validação de fatos reais do brainstorm, ou sugestões de referências geográficas reais para o autor.
**Fundamentação científica:** Delasalles et al. (2020 - OpenTapioca), Scharpf et al. (2022 - Survey Wikidata), Sarkar et al. (2025 - Mahānāma).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Classificação Ficcional vs. Factual:** Separar as entidades candidatas entre locais/figuras globais conhecidas e elementos puramente ficcionais do livro (utilizando o elenco do banco de dados local do autor como filtro inicial).
2. **Mapeamento de Entidades Reais:** Enviar as entidades reais para um motor local baseado nos princípios do OpenTapioca (sistema leve de linkagem a grafos) para associar as menções textuais a IDs permanentes do Wikidata (QIDs).
3. **Ontologia em Memória (On-the-fly):** Para as entidades ficcionais descartadas na etapa 2, criar e atualizar um grafo local temporário (intra-documento) para gerenciar o conhecimento do universo ficcional do autor.
4. **Desambiguação por Tópico Contextual:** Utilizar o vetor de tópicos de contexto dos parágrafos adjacentes para resolver ambiguidades (ex: distinguir a cidade histórica de "Roma" da personagem fictícia chamada "Roma").

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Sobre-associação a Bases de Dados Externas:** Evitar que o sistema tente linkar à força personagens criados pelo autor a nós homônimos da base do Wikidata, gerando links incorretos (Scharpf et al., 2022). O pipeline deve filtrar as entidades fictícias criadas de forma proativa.

**Métricas de sucesso sugeridas:**
- Precision@5 de Entity Linking para entidades factuais (alvo $\ge 80\%$).
- Latência de busca no grafo local (alvo < 500ms).

**Requisito(s) do projeto relacionado(s):** RF-111 (Wikidata), RF-113 (busca contextual), RF-33 (links para referências).

**Nível de maturidade da técnica:** Emergente/Experimental.
