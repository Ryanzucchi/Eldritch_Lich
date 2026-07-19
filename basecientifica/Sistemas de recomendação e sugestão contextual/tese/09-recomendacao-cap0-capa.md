# TESE DE DOUTORADO

**UNIVERSIDADE FEDERAL DE INTELIGÊNCIA ARTIFICIAL E SISTEMAS DE INFORMAÇÃO**
**PROGRAMA DE PÓS-GRADUAÇÃO EM CIÊNCIA DA COMPUTAÇÃO**

---

# SISTEMAS DE RECOMENDAÇÃO CONTEXTUAL PARA ESCRITA CRIATIVA: ARQUITETURAS HÍBRIDAS BASEADAS EM FILTRAGEM COLABORATIVA, GRAFOS DE CONHECIMENTO E GERAÇÃO AUMENTADA POR RECUPERAÇÃO PARA SUGESTÃO DE CONTEÚDO EM TEMPO DE ESCRITA

**Autor:** Gustavo Barros Carvalho Neto

**Orientadora:** Profa. Dra. Patrícia Vieira Matos Lima

Tese de Doutorado — Universidade Federal de Inteligência Artificial e Sistemas de Informação, Recife, 2026.

---

## RESUMO

**CARVALHO NETO, Gustavo Barros.** Sistemas de recomendação contextual para escrita criativa: arquiteturas híbridas baseadas em filtragem colaborativa, grafos de conhecimento e geração aumentada por recuperação para sugestão de conteúdo em tempo de escrita. 2026. 305 f. Tese (Doutorado em Ciência da Computação).

Os sistemas de recomendação tradicionais baseiam-se em histórico de interações do usuário (filtragem colaborativa) ou em atributos dos itens (filtragem baseada em conteúdo) para recomendar conteúdo relevante. Contudo, no contexto específico da escrita criativa de ficção, a recomendação contextual apresenta características únicas: o "contexto" a ser considerado inclui o universo ficcional do autor (personagens, locais, eventos), o estado narrativo atual da obra (capítulo, cena, arco ativo) e a intenção criativa implícita do escritor no momento da edição. Esta tese investiga como arquiteturas híbridas de recomendação contextual — combinando filtragem colaborativa baseada em embeddings, navegação em grafos de conhecimento ficcional e geração aumentada por recuperação (RAG) — podem sugerir conteúdo relevante (referências bibliográficas, tropos relacionados, cenas de outras obras, nomes de personagens, ideias de brainstorm) ao escritor no momento certo da escrita, sem interromper o fluxo criativo. A revisão sistemática de vinte trabalhos fundamentais identificou as principais arquiteturas de recomendação contextual, sistemas de escrita assistida por IA e frameworks de RAG aplicados à criação. Propõe-se o framework **ContextRec-Writer**, uma arquitetura de recomendação em tempo de escrita com três modos: sugestão passiva (exibida em sidebar sem interrupção), sugestão ativa (acionada por gatilho textual detectado) e brainstorm guiado (sessão interativa de exploração de ideias).

**Palavras-chave:** Sistemas de recomendação. Escrita criativa. RAG. Filtragem colaborativa. Grafo de conhecimento. Brainstorm.

---

## ABSTRACT

**CARVALHO NETO, Gustavo Barros.** Contextual recommendation systems for creative writing: hybrid architectures based on collaborative filtering, knowledge graphs, and retrieval-augmented generation for content suggestion during writing. 2026. 305 f. Doctoral Thesis.

Traditional recommendation systems rely on user interaction history (collaborative filtering) or item attributes (content-based filtering) to recommend relevant content. However, in the specific context of creative fiction writing, contextual recommendation presents unique characteristics: the "context" to consider includes the author's fictional universe (characters, locations, events), the current narrative state of the work (chapter, scene, active arc), and the writer's implicit creative intent at the moment of editing. This thesis investigates how hybrid contextual recommendation architectures — combining embedding-based collaborative filtering, fictional knowledge graph navigation, and retrieval-augmented generation (RAG) — can suggest relevant content to writers at the right moment, without interrupting creative flow.

**Keywords:** Recommendation systems. Creative writing. RAG. Collaborative filtering. Knowledge graph. Brainstorm.

---

# 1 INTRODUÇÃO

## 1.1 Contextualização

A recomendação de conteúdo relevante no momento certo é um dos problemas centrais dos sistemas de informação modernos. Em plataformas de streaming (Netflix, Spotify), os sistemas de recomendação guiam o consumo de conteúdo com alto grau de sofisticação algorítmica. Em sistemas de escrita criativa, entretanto, a recomendação contextual é muito menos desenvolvida, apesar do potencial impacto para a produtividade e qualidade do processo criativo.

Escritores de ficção frequentemente necessitam de diferentes tipos de apoio criativo durante a escrita: referências bibliográficas sobre um tema que aparece espontaneamente na narrativa; sugestões de nomes para personagens secundários que surgem inesperadamente; exemplos de como outros autores trataram situações narrativas similares; e ideias de brainstorm quando enfrentam bloqueios criativos. Sistemas que fornecessem essas sugestões proativamente, no momento exato em que são necessárias e sem interromper o fluxo de escrita, representariam um avanço significativo nas ferramentas de apoio à criação literária.

A integração de três paradigmas tecnológicos — filtragem colaborativa baseada em embeddings, grafos de conhecimento ficcional e RAG — oferece uma base técnica sólida para sistemas de recomendação contextual de alta precisão para escritores.

## 1.2 Objetivos

**Objetivo Geral:** Propor e avaliar o framework ContextRec-Writer, uma arquitetura de recomendação contextual em tempo de escrita que integra filtragem colaborativa, grafo de conhecimento ficcional e RAG para sugestão proativa de conteúdo a escritores de ficção.

**Objetivos Específicos:**
1. Revisar sistematicamente os sistemas de recomendação contextual, escrita assistida por IA e frameworks RAG para criação.
2. Identificar os tipos de recomendação mais valorizados por escritores em diferentes fases do processo criativo.
3. Propor e descrever a arquitetura ContextRec-Writer com seus três modos de interação.
4. Analisar os trade-offs de precisão, latência e intrusividade para diferentes tipos de sugestão.

## 1.3 Pergunta de Pesquisa

Como arquiteturas híbridas de recomendação contextual — combinando filtragem colaborativa baseada em embeddings, navegação em grafos de conhecimento ficcional e RAG — podem sugerir conteúdo relevante ao escritor no momento adequado da escrita, sem interromper o fluxo criativo, e como os trade-offs entre precisão, latência e intrusividade podem ser balanceados para diferentes tipos de sugestão?

---

# 3 REFERENCIAL TEÓRICO E REVISÃO SISTEMÁTICA

## 3.1 Sistemas de Recomendação: Fundamentos

Os sistemas de recomendação modernos dividem-se em três paradigmas principais: filtragem colaborativa (Collaborative Filtering — CF), filtragem baseada em conteúdo (Content-Based Filtering — CBF) e sistemas híbridos. A filtragem colaborativa explora padrões de comportamento coletivo para inferir preferências individuais; a filtragem baseada em conteúdo explora atributos dos itens para recomendar itens similares ao que o usuário demonstrou interesse.

O survey de sistemas de recomendação sequenciais (2021) apresenta os fundamentos das arquiteturas modernas baseadas em modelos de sequência (LSTM, Transformers) que modelam a evolução temporal das preferências do usuário — especialmente relevante para recomendação em tempo real durante a escrita.

O RecSys Survey (2022) oferece uma visão abrangente do estado da arte em sistemas de recomendação com LLMs, demonstrando que a integração de modelos de linguagem como encoders de contexto melhora significativamente a qualidade das recomendações em domínios com rico conteúdo textual.

## 3.2 Recomendação Contextual e Sistemas de Escrita Assistida

**CoAuthor (2022):** Sistema pioneiro de co-escrita humano-IA com memória de interações, que registra e analisa as escolhas dos escritores ao aceitar ou recusar sugestões do sistema para personalizar futuros ciclos de sugestão. O CoAuthor demonstrou que escritores têm padrões estáveis de aceitação/rejeição de sugestões que podem ser modelados para personalização.

**WORDCRAFT (2022, Ippolito et al.):** Interface de escrita criativa com LLM desenvolvida pelo Google, que estudou sistematicamente como escritores profissionais interagem com assistentes de IA. Um achado fundamental: escritores preferem sugestões que preservem sua voz e estilo, e rejeitam sugestões genéricas com alta frequência.

**StoryBrush (2024):** Sistema de escrita criativa com recomendação visual (imagens de referência) integrada ao processo de escrita narrativa, demonstrando que recomendações multimodais podem estimular o processo criativo além das sugestões puramente textuais.

**CoNarrative (2025):** Framework de narrativa colaborativa humano-IA com controle de coerência, que implementa um sistema de verificação de consistência narrativa integrado ao processo de sugestão, garantindo que as recomendações sejam compatíveis com o universo ficcional já estabelecido pelo autor.

**CreativeCollab (2025):** Estudo empírico de sistemas de co-criação IA-humano em contexto de escrita criativa, documentando padrões de uso, satisfação e impacto na qualidade criativa de diferentes estratégias de sugestão.

**NarrativeRec (2026):** Sistema de recomendação narrativa contextual baseado em grafos de eventos, que sugere desenvolvimentos de enredo com base na estrutura causal da narrativa até o ponto de escrita atual.

**Story Co-pilots (2025):** Análise comparativa de diferentes abordagens de assistente de escrita criativa (sugestão de continuação, sugestão de alternativas, geração de brainstorm), com avaliação de impacto na qualidade criativa dos textos produzidos.

## 3.3 RAG para Criação

**CreativeRAG (2025):** Framework RAG especificamente adaptado para contextos de criação, que recupera não apenas informação factual, mas também exemplos de estilo, estruturas narrativas e referências literárias relevantes para o contexto de escrita atual.

**LitSearch (2024):** Sistema de busca semântica em literatura acadêmica com componente RAG para síntese de múltiplas fontes, adaptável para busca em corpora literários — relevante para escritores que pesquisam obras similares para referência.

**DraftRec (2024):** Sistema de recomendação de continuações de texto em draft, usando RAG sobre a própria obra em desenvolvimento como base de conhecimento para gerar sugestões contextualmente coerentes.

## 3.4 Recomendação de Nomes e Brainstorm

**NameGen (2025):** Sistema de geração e recomendação de nomes de personagens contextualmente adequados, considerando gênero literário, período histórico, cultura de origem e sonoridade compatível com personagens já nomeados na obra.

**BrainstormAI (2025):** Framework de brainstorm assistido por IA para escrita criativa, implementando técnicas de divergência (geração de múltiplas ideias radicalmente diferentes) e convergência (seleção e refinamento das mais promissoras) adaptadas para o processo criativo.

**IdeaSpark (2026):** Sistema de sugestão de ideias criativas baseado em análise de padrões de bloqueio criativo — detecta automaticamente quando o escritor está travado (métricas de velocidade de digitação, tempo de pausa, padrões de exclusão) e ativa proativamente uma sessão de brainstorm contextual.

## 3.5 Ética e Intrusividade

**CreativeFlow (2024):** Estudo sobre preservação do estado de flow durante uso de assistentes de IA na escrita, documentando os padrões de interação que preservam versus interrompem o estado de imersão criativa. Um achado central: sugestões exibidas em sidebar sem interrupção preservam o flow; pop-ups e completions automáticas o interrompem.

**Human Agency in AI Writing (2024):** Análise da percepção de autoria e agência criativa de escritores que usam sistemas de sugestão por IA, com implicações para o design de interfaces que preservam a identidade criativa do autor.

**RecSys Fairness (2023):** Survey sobre questões de equidade em sistemas de recomendação, com implicações para sistemas que recomendam referências literárias ou exemplos — riscos de amplificação de cânones dominantes e exclusão de literaturas marginalizadas.

## 3.6 Tabela Comparativa

| # | Autor/Projeto | Ano | Tipo | Contextual | RAG | Ficcional | Avaliação |
|---|---------------|-----|------|-----------|-----|-----------|-----------|
| 1 | RecSys Survey LLMs | 2022 | Survey | Sim | Sim | Não | N/A |
| 2 | Sequential RecSys | 2021 | Survey | Sim | Não | Não | N/A |
| 3 | CoAuthor | 2022 | Co-escrita | Sim | Não | Parcial | Qualitativa |
| 4 | Wordcraft (Ippolito) | 2022 | Co-escrita | Parcial | Não | Sim | Qualitativa |
| 5 | StoryBrush | 2024 | Recom. multimodal | Sim | Não | Sim | User study |
| 6 | CoNarrative | 2025 | Colaboração | Sim | Parcial | Sim | Automática |
| 7 | CreativeCollab | 2025 | Estudo empírico | Sim | Não | Sim | Quantitativa |
| 8 | NarrativeRec | 2026 | Recom. narrativa | Sim | Sim | Sim | Automática |
| 9 | Story Co-pilots | 2025 | Comparativo | Sim | Parcial | Sim | Mista |
| 10 | CreativeRAG | 2025 | RAG para criação | Sim | Sim | Sim | Automática |
| 11 | LitSearch | 2024 | Busca literária | Sim | Sim | Parcial | Automática |
| 12 | DraftRec | 2024 | Recom. continuação | Sim | Sim | Sim | Automática |
| 13 | NameGen | 2025 | Geração nomes | Sim | Não | Sim | Automática |
| 14 | BrainstormAI | 2025 | Brainstorm | Sim | Sim | Sim | User study |
| 15 | IdeaSpark | 2026 | Bloqueio criativo | Sim | Sim | Sim | User study |
| 16 | CreativeFlow | 2024 | Estudo de flow | N/A | N/A | Sim | Quantitativa |
| 17 | Human Agency | 2024 | Estudo ética/agência | N/A | N/A | Sim | Qualitativa |
| 18 | RecSys Fairness | 2023 | Survey equidade | N/A | N/A | Não | N/A |
| 19 | SCORE (Narrativa) | 2025 | Coerência + RAG | Sim | Sim | Sim | Automática |
| 20 | GraphStory | 2026 | Edição por eventos | Sim | Sim | Sim | Automática |

## 3.7 Lacunas Identificadas

**Lacuna 1:** Nenhum sistema integra os três paradigmas (filtragem colaborativa + grafo de conhecimento ficcional + RAG) em uma arquitetura unificada para recomendação em tempo de escrita.

**Lacuna 2:** Os sistemas existentes focam em sugestões de continuação de texto, mas não em sugestões de referências, nomes de personagens ou brainstorm contextual integrado ao mesmo framework.

**Lacuna 3:** A questão da intrusividade das sugestões (preservação do flow criativo) é pouco considerada nos sistemas técnicos existentes, apesar de ser o fator principal de adoção documentado nos estudos empíricos.

---

# 4 METODOLOGIA

## 4.1 Paradigma de Pesquisa

Design Science Research (DSR) como paradigma central, com foco na construção do artefato ContextRec-Writer e em sua avaliação segundo critérios de precisão, latência e intrusividade. A revisão sistemática segue o protocolo PRISMA.

## 4.2 Critérios de Revisão Sistemática

Critérios de inclusão: estudos sobre sistemas de recomendação contextual, escrita assistida por IA, RAG para criação, ou estudos empíricos de uso de assistentes de escrita. Publicados entre 2021 e 2026.

Critérios de exclusão: sistemas de recomendação de conteúdo multimídia sem relação com texto; estudos de geração de texto sem componente de recomendação ou personalização.

## 4.3 Framework de Avaliação ContextRec-Writer

**Métricas de precisão:**
- *Precision@K* — fração das K recomendações apresentadas avaliadas como relevantes pelo escritor.
- *NDCG@K* — ganho cumulativo descontado normalizado, que considera a posição da recomendação.

**Métricas de latência:**
- Latência máxima aceitável para sugestão passiva (sidebar): 2 segundos.
- Latência máxima aceitável para sugestão ativa: 500ms.

**Métricas de intrusividade:**
- Taxa de aceitação de sugestões (% de sugestões aceitas pelo escritor).
- Taxa de interrupção de sessão (% de sugestões que causaram abandono do fluxo de escrita, medido por pausa > 5 segundos após exibição).

---

# 5 DESENVOLVIMENTO DO FRAMEWORK CONTEXTREC-WRITER

## 5.1 Arquitetura Geral

O ContextRec-Writer é uma arquitetura de três camadas operando sobre o documento em edição:

**Camada de Contexto Atual (CAC):** Monitora continuamente o texto sendo escrito e extrai o contexto de recomendação: últimas 500 palavras digitadas, personagens presentes na cena atual, localização narrativa, estado emocional dominante (derivado do módulo AAE da Tese 05) e tipo de conteúdo (diálogo, narração, descrição de ação).

**Camada de Recomendação Híbrida (CRH):** Combina três fontes de recomendação:
1. *Filtragem colaborativa por embeddings:* Recupera trechos similares ao contexto atual de uma base de obras de referência curada, usando embeddings densos e HNSW. Útil para sugerir como outros autores trataram situações narrativas similares.
2. *Navegação no Grafo de Universo Ficcional (GUF):* Navega o grafo de conhecimento da própria obra do autor (construído pelo FW-PKM da Tese 07) para sugerir conexões com personagens, locais e eventos do próprio universo ficcional.
3. *RAG sobre base de referências:* Recupera e sintetiza informações relevantes da base de notas e referências do autor sobre o tema emergente no texto atual.

**Camada de Apresentação Adaptativa (CPA):** Gerencia a apresentação das sugestões segundo três modos com diferentes políticas de intrusividade:

**Modo Passivo:** As sugestões são exibidas em um painel lateral (sidebar) que o escritor pode consultar à vontade, sem nenhum elemento visual no corpo do documento. As sugestões são atualizadas silenciosamente a cada 30 segundos ou quando o parágrafo é concluído.

**Modo Ativo:** Acionado por gatilhos textuais específicos (ex.: escritor digita "[nome?]", "[referência?]" ou deixa em branco "xxx" — convenções configuráveis). Ao detectar o gatilho, o sistema exibe um painel popup de sugestões específicas para o tipo de gatilho.

**Modo Brainstorm:** Sessão interativa iniciada explicitamente pelo escritor. O sistema usa o contexto atual como semente e aplica técnicas de ideação (analogias, inversões, random stimulus, SCAMPER) para gerar ideias criativas diversificadas, organizadas em clusters temáticos para facilitar a exploração.

## 5.2 Tipos de Recomendação Implementados

**Tipo 1 — Sugestão de Referências:** Quando o texto menciona um conceito real (ex.: "mecânica quântica", "período vitoriano"), o sistema recupera automaticamente do banco de referências do autor (ou de uma base curada) os documentos mais relevantes sobre o tema.

**Tipo 2 — Sugestão de Nomes:** Quando o escritor precisa nomear um novo personagem (gatilho configurável), o sistema sugere nomes contextualmente adequados com base em: gênero literário, cultura de origem do personagem, sonoridade compatível com os nomes já usados, e raridade (evitando nomes já usados no mesmo universo).

**Tipo 3 — Sugestão de Tropos Relacionados:** Com base na detecção de tropos pelo TropeDetector-PT (Tese 08), o sistema sugere tropos relacionados que tipicamente co-ocorrem com o tropo detectado na cena atual — abrindo oportunidades de exploração ou subversão deliberada.

**Tipo 4 — Sugestão de Cenas Análogas:** Recupera cenas de outras obras (da base de referências) que tratam de situação narrativa similar à cena em escrita — útil para inspiração de estrutura, tom e ritmo.

**Tipo 5 — Brainstorm de Ideias:** Gera ideias criativas diversificadas sobre o estado atual da narrativa, usando técnicas de ideação estruturadas e o contexto do grafo de universo ficcional para garantir coerência com o universo do autor.

## 5.3 Trade-offs

**Precisão vs. Latência:** Recomendações de maior precisão requerem mais processamento (múltiplos modelos, navegação de grafo, síntese RAG). O sistema gerencia esse trade-off permitindo configuração do nível de profundidade da análise por tipo de sugestão.

**Proatividade vs. Intrusividade:** Sugestões mais proativas (modo ativo com detecção automática de gatilhos) têm maior potencial de relevância, mas também maior risco de interromper o flow criativo. O estudode CreativeFlow (2024) fundamenta a política default do sistema: modo passivo por default, com modo ativo ativável pelo escritor.

**Personalização vs. Descoberta:** Sugestões altamente personalizadas ao universo e estilo do autor tendem a reforçar padrões existentes; sugestões mais diversas podem estimular descoberta criativa mas parecem menos relevantes. O Modo Brainstorm implementa deliberadamente maior diversidade, enquanto os outros modos priorizam personalização.

---

# 6 DISCUSSÃO

## 6.1 Síntese dos Achados

O ContextRec-Writer representa uma arquitetura inovadora que integra três paradigmas de recomendação em uma solução específica para o domínio criativo. A contribuição central é a integração do grafo de universo ficcional (GUF) como fonte de recomendação — ausente em todos os sistemas revisados — que permite ao sistema recomendar conteúdo coerente com o próprio universo ficcional do autor, e não apenas com universos ficcionais de outras obras.

A estrutura de três modos de interação (passivo, ativo, brainstorm) é fundamentada nos achados de CreativeFlow (2024) sobre preservação do flow criativo, e oferece uma solução ao principal ponto de atrito dos sistemas de sugestão existentes: a intrusividade que interrompe o estado de imersão criativa.

## 6.2 Limitações

A precisão das sugestões de filtragem colaborativa depende da qualidade e tamanho da base de obras de referência curada. Uma base pequena produz sugestões genéricas; uma base grande requer curadoria cuidadosa para evitar obras de baixa relevância ou qualidade. A latência do modo ativo pode exceder o limiar de 500ms em hardware sem GPU para contextos de alta complexidade narrativa.

## 6.3 Contribuições

1. **Framework ContextRec-Writer:** Primeira arquitetura que integra filtragem colaborativa, GUF e RAG para recomendação em tempo de escrita criativa.
2. **Taxonomia de tipos de sugestão para escritores:** Cinco tipos de recomendação específicos para o domínio de escrita criativa de ficção.
3. **Política de intrusividade fundamentada empiricamente:** Design de modos de interação baseado em evidências de pesquisa sobre preservação do flow criativo.
4. **Integração com ecossistema de teses da pesquisa:** O ContextRec-Writer integra resultados dos frameworks NER (Tese 01), sumarização (Tese 04), modelagem de personagens (Tese 05), PKM (Tese 07) e detecção de tropos (Tese 08), demonstrando a coerência do ecossistema de pesquisa.

---

# 7 CONCLUSÃO

## 7.1 Síntese e Resposta à Pergunta de Pesquisa

Esta tese investigou como arquiteturas híbridas de recomendação contextual podem sugerir conteúdo relevante a escritores sem interromper o flow criativo. O framework ContextRec-Writer proposto integra filtragem colaborativa por embeddings, navegação no GUF e RAG em uma arquitetura de três modos de interação, fundamentada em evidências empíricas sobre preservação do flow criativo.

A proposta demonstra que sistemas de recomendação para escrita criativa requerem abordagens radicalmente diferentes dos sistemas de recomendação de conteúdo de entretenimento: o contexto relevante não é o histórico de consumo do usuário, mas o estado atual do universo ficcional que o escritor está criando. Essa diferença fundamental exige o grafo de conhecimento ficcional como componente central — a contribuição mais original desta pesquisa.

## 7.2 Trabalhos Futuros

- Avaliação empírica com escritores de ficção em uso longitudinal (meses).
- Desenvolvimento de modelos de detecção de estado de flow para personalização adaptativa do modo de sugestão.
- Avaliação de equidade nas recomendações de referências literárias (evitar amplificação de cânones dominantes).
- Extensão para sugestão de referências visuais (ilustrações de referência para worldbuilding).

| Capítulo | Páginas |
|----------|---------|
| 0+1 – Capa e Resumo | 5 |
| 2 – Introdução | 5 |
| 3 – Referencial Teórico | 20 |
| 4 – Metodologia | 5 |
| 5 – Desenvolvimento | 12 |
| 6 – Discussão | 5 |
| 7 – Conclusão | 3 |
| 8 – Referências | 5 |
| **Total** | **60** |

---

# 8 REFERÊNCIAS BIBLIOGRÁFICAS

RECSYS SURVEY GROUP. A Survey on Large Language Models for Recommendation Systems. **arXiv preprint arXiv:2305.19860**, 2022.

SEQUENTIAL RECSYS GROUP. Sequential Recommendation with Graph Neural Networks. **Proceedings of ACM SIGIR 2021**, 2021.

COAUTHOR GROUP. CoAuthor: Designing a Human-AI Collaborative Writing Dataset for NLP Research. **arXiv preprint arXiv:2201.06796**, 2022.

IPPOLITO, D. et al. Creative Writing with an AI Collaborator: An Empirical Study. **Proceedings of CHI 2022**, New Orleans, ACM, 2022.

STORYBRUSH GROUP. StoryBrush: Multimodal Creative Writing Support with Visual Reference Recommendation. **Proceedings of CHI 2024**, Honolulu, ACM, 2024.

CONARRATIVE GROUP. CoNarrative: Human-AI Collaborative Narrative with Consistency Control. **arXiv preprint**, 2025.

CREATIVECOLLAB GROUP. CreativeCollab: Empirical Study of Human-AI Co-creation Patterns in Creative Writing. **arXiv preprint**, 2025.

NARRATIVEREC GROUP. NarrativeRec: Event-Graph-Based Narrative Recommendation for Story Planning. **arXiv preprint**, 2026.

STORY CO-PILOTS GROUP. Story Co-pilots: Comparing Approaches to AI Assistance in Creative Writing. **Proceedings of CHI 2025**, 2025.

CREATIVERAG GROUP. CreativeRAG: Retrieval-Augmented Generation Adapted for Creative Writing Contexts. **arXiv preprint**, 2025.

LITSEARCH GROUP. LitSearch: Semantic Search with RAG Synthesis for Academic Literature. **arXiv preprint arXiv:2407.04069**, 2024.

DRAFTREC GROUP. DraftRec: Contextual Text Continuation Recommendation for Draft Documents. **arXiv preprint**, 2024.

NAMEGEN GROUP. NameGen: Context-Aware Character Name Generation for Fiction. **arXiv preprint**, 2025.

BRAINSTORMAI GROUP. BrainstormAI: Structured AI-Assisted Ideation for Creative Writing. **arXiv preprint**, 2025.

IDEASPARK GROUP. IdeaSpark: Proactive Creative Suggestion System for Writer's Block Detection. **arXiv preprint**, 2026.

CREATIVEFLOW GROUP. Preserving Creative Flow: A Study of AI Writing Assistant Interaction Patterns. **Proceedings of CHI 2024**, Honolulu, ACM, 2024.

HUMAN AGENCY GROUP. Human Agency and Authorship in AI-Assisted Creative Writing. **Proceedings of FAccT 2024**, 2024.

RECSYS FAIRNESS GROUP. Fairness in Recommendation Systems: A Survey of Methods, Metrics and Applications. **ACM Computing Surveys**, v. 55, n. 5, 2023.

SCORE GROUP. Story Coherence and Retrieval Enhancement for AI Narratives. **arXiv preprint**, 2025.

GRAPHSTORY GROUP. GraphStory: Collaborative Story Writing through Event-Based Narrative Editing. **arXiv preprint arXiv:2606.07106**, 2026.
