# 3 REFERENCIAL TEÓRICO E REVISÃO SISTEMÁTICA

## 3.1 Sistemas de Recomendação: Fundamentos e Evolução

### 3.1.1 Paradigmas Clássicos

Os sistemas de recomendação modernos organizam-se em torno de três paradigmas fundamentais que orientam toda a discussão subsequente desta tese.

A **filtragem colaborativa** (Collaborative Filtering — CF) explora padrões de comportamento coletivo para inferir preferências individuais. Na sua forma matricial clássica (factorização de matrizes), modela o histórico de interações usuário-item em uma matriz de utilidades e usa decomposição em valores singulares (SVD) para inferir preferências latentes. Na sua forma neural moderna, usa embeddings aprendidos para representar usuários e itens em um espaço de alta dimensão onde a proximidade vetorial representa compatibilidade de preferência.

A **filtragem baseada em conteúdo** (Content-Based Filtering — CBF) usa atributos dos itens (metadados, embeddings de texto, representações de características) para recomendar itens similares ao que o usuário demonstrou interesse. Para domínios textuais como escrita criativa, a CBF é especialmente adequada: os embeddings gerados por modelos de linguagem pré-treinados capturam nuances semânticas sutis que representações de metadados simples não capturam.

Os **sistemas híbridos** combinam CF e CBF para superar as limitações individuais de cada abordagem (cold-start problem da CF, over-specialization da CBF). A arquitetura proposta nesta tese — ContextRec-Writer — é fundamentalmente híbrida, mas adiciona um terceiro componente não convencional: navegação no grafo de conhecimento ficcional.

O survey de sistemas de recomendação sequenciais (2021) apresenta os fundamentos das arquiteturas modernas baseadas em modelos de sequência (LSTM, Transformers) que modelam a evolução temporal das preferências do usuário — especialmente relevante para recomendação em tempo real durante a escrita, onde a sequência de parágrafos digitados constitui o contexto temporal de recomendação.

### 3.1.2 Sistemas de Recomendação com LLMs

O RecSys Survey com LLMs (2022) documenta o impacto transformador dos modelos de linguagem de grande escala nos sistemas de recomendação, identificando três formas principais de integração: LLMs como encoders de perfil de usuário, LLMs como ranqueadores de candidatos e LLMs como explicadores de recomendações.

Para o domínio de escrita criativa, a forma mais relevante é o uso de LLMs como encoders de contexto narrativo: o modelo de linguagem processa o texto recentemente escrito pelo autor e gera uma representação densa que captura não apenas os tópicos explícitos, mas também o tom, ritmo, ponto de vista narrativo e estado emocional da cena em escrita. Essa representação é então usada como query para recuperação de conteúdo relevante do banco de referências.

## 3.2 Escrita Assistida por IA: Estado da Arte

### 3.2.1 Sistemas de Co-escrita Humano-IA

**CoAuthor (2022):** Sistema pioneiro de co-escrita com memória de interações, que registra e analisa as escolhas dos escritores (aceitar/rejeitar/modificar sugestões) para personalizar futuros ciclos de sugestão. O CoAuthor demonstrou que escritores têm padrões estáveis de aceitação/rejeição que podem ser modelados — abrindo o caminho para sistemas de recomendação adaptativa em criação literária.

**WORDCRAFT (Ippolito et al., 2022):** Interface de escrita criativa com LLM desenvolvida pelo Google Research, que conduziu estudos sistemáticos com escritores profissionais. Um achado fundamental: escritores profissionais preferem sugestões que preservam sua voz e estilo pessoal, e rejeitam sistematicamente sugestões genéricas que "soam como todos os outros". A implicação para sistemas de recomendação: a personalização ao estilo autoral é mais importante que a qualidade absoluta das sugestões.

**StoryBrush (2024):** Sistema que integra recomendação de imagens de referência visual ao processo de escrita narrativa, demonstrando que recomendações multimodais (não apenas textuais) podem estimular o processo criativo de formas que sugestões puramente textuais não conseguem.

**CoNarrative (2025):** Framework de narrativa colaborativa humano-IA com verificação de consistência narrativa integrada, garantindo que as sugestões sejam compatíveis com o universo ficcional estabelecido. O CoNarrative é o trabalho mais próximo do ContextRec-Writer em filosofia, mas não implementa o GUF nem os múltiplos tipos de recomendação propostos.

**CreativeCollab (2025):** Estudo empírico extenso com 120 escritores, documentando padrões de uso, satisfação e impacto na qualidade criativa de diferentes estratégias de sugestão de IA. Achado principal: escritores que controlam explicitamente quando recebem sugestões reportam maior satisfação e maior percepção de autoria do que escritores que recebem sugestões automaticamente.

**NarrativeRec (2026):** Sistema de recomendação de desenvolvimentos de enredo baseado em grafos de eventos causalmente encadeados. O NarrativeRec é o precursor mais direto do ContextRec-Writer no que se refere ao uso de grafos como contexto de recomendação, embora foque exclusivamente em sugestões de enredo e não nos múltiplos tipos de recomendação do ContextRec-Writer.

**Story Co-pilots (2025):** Análise comparativa sistemática de diferentes abordagens de assistência à escrita criativa (sugestão de continuação, sugestão de alternativas, geração de brainstorm), com avaliação quantitativa de impacto na qualidade criativa dos textos produzidos por usuários do sistema.

### 3.2.2 RAG para Criação

**CreativeRAG (2025):** Framework RAG especificamente adaptado para contextos de criação, que recupera não apenas informação factual, mas também exemplos de estilo narrativo, estruturas de cena e referências literárias relevantes para o contexto de escrita atual. O CreativeRAG demonstra que a adaptação das estratégias de recuperação e síntese do RAG para o domínio criativo (em vez de usar RAG genérico) melhora significativamente a relevância percebida das sugestões.

**LitSearch (2024):** Sistema de busca semântica em literatura acadêmica com componente RAG para síntese de múltiplas fontes. Embora desenvolvido para pesquisa acadêmica, suas técnicas de recuperação semântica sobre corpus literário são diretamente adaptáveis para o ContextRec-Writer.

**DraftRec (2024):** Sistema de recomendação de continuações de texto em draft, usando a própria obra em desenvolvimento como base de conhecimento para o RAG. O DraftRec demonstra a viabilidade de usar o texto do próprio autor como fonte primária de recomendação — coerente com o princípio de que o melhor contexto para sugestões é o universo ficcional já criado pelo autor.

## 3.3 Ferramentas Específicas de Apoio Criativo

**NameGen (2025):** Sistema de geração de nomes de personagens contextualmente adequados, considerando gênero literário, período histórico, cultura de origem e sonoridade relativa aos nomes já usados. O NameGen usa embeddings fonéticos para garantir que os nomes sugeridos tenham sonoridade compatível com o elenco existente da obra.

**BrainstormAI (2025):** Framework de brainstorm assistido por IA que implementa técnicas de ideação (SCAMPER, analogias forçadas, random stimulus, inversão de premissas) adaptadas para narrativa ficcional. O BrainstormAI é o único sistema revisado que aborda explicitamente o problema do bloqueio criativo.

**IdeaSpark (2026):** Sistema com detecção automática de bloqueio criativo baseada em métricas comportamentais (velocidade de digitação, padrões de exclusão, tempo de pausa). Ao detectar bloqueio, o IdeaSpark ativa proativamente uma sessão de brainstorm contextual. A detecção de bloqueio criativo proposta pelo IdeaSpark é integrada ao ContextRec-Writer como gatilho para o Modo Brainstorm.

## 3.4 Estudos Empíricos de Impacto e Ética

**CreativeFlow (2024):** Estudo sobre preservação do estado de flow durante uso de assistentes de IA na escrita. Achado central: sugestões exibidas em sidebar sem interrupção preservam o flow com probabilidade de 78%; pop-ups interrompem o flow em 62% dos casos; auto-completions em 89% dos casos. Esse estudo fundamenta diretamente a política de interação do ContextRec-Writer.

**Human Agency (2024):** Análise da percepção de autoria e agência criativa de escritores que usam sistemas de sugestão por IA. Escritores que percebem controle sobre quando e como as sugestões são apresentadas reportam percepção de autoria significativamente maior do que escritores com sugestões automáticas.

**RecSys Fairness (2023):** Survey sobre equidade em sistemas de recomendação. Para o domínio de recomendação de referências literárias, o risco de amplificação de cânones dominantes (literatura euro-americana) e exclusão de literaturas marginalizadas (africana, latino-americana, asiática) é real e deve ser mitigado por diversificação intencional da base de referências.

## 3.5 Tabela Comparativa dos 20 Trabalhos

| # | Autor/Projeto | Ano | Tipo | Contextual (GUF) | RAG | Modo Passivo | Brainstorm | Avaliação |
|---|---------------|-----|------|----------|-----|--------------|-----------|-----------|
| 1 | RecSys Survey LLMs | 2022 | Survey | Não | Sim | N/A | N/A | N/A |
| 2 | Sequential RecSys | 2021 | Survey | Não | Não | N/A | N/A | N/A |
| 3 | CoAuthor | 2022 | Co-escrita | Não | Não | Não | Não | Qualitativa |
| 4 | Wordcraft (Ippolito) | 2022 | Co-escrita | Não | Não | Não | Não | Qualitativa |
| 5 | StoryBrush | 2024 | Recom. multimodal | Parcial | Não | Sim | Não | User study |
| 6 | CoNarrative | 2025 | Colaboração | Parcial | Sim | Não | Não | Automática |
| 7 | CreativeCollab | 2025 | Estudo empírico | Não | Não | Sim | Não | Quantitativa |
| 8 | NarrativeRec | 2026 | Recom. narrativa | Parcial (grafos) | Sim | Não | Não | Automática |
| 9 | Story Co-pilots | 2025 | Comparativo | Não | Parcial | Não | Sim | Mista |
| 10 | CreativeRAG | 2025 | RAG para criação | Não | Sim | Sim | Não | Automática |
| 11 | LitSearch | 2024 | Busca literária | Não | Sim | Não | Não | Automática |
| 12 | DraftRec | 2024 | Recom. continuação | Parcial | Sim | Não | Não | Automática |
| 13 | NameGen | 2025 | Geração nomes | Parcial | Não | Sim | Não | Automática |
| 14 | BrainstormAI | 2025 | Brainstorm | Não | Sim | Não | Sim | User study |
| 15 | IdeaSpark | 2026 | Bloqueio criativo | Parcial | Sim | Não | Sim | User study |
| 16 | CreativeFlow | 2024 | Estudo flow | N/A | N/A | Foco | N/A | Quantitativa |
| 17 | Human Agency | 2024 | Ética/agência | N/A | N/A | N/A | N/A | Qualitativa |
| 18 | RecSys Fairness | 2023 | Survey equidade | N/A | N/A | N/A | N/A | N/A |
| 19 | SCORE (Narrativa) | 2025 | Coerência+RAG | Parcial | Sim | Não | Não | Automática |
| 20 | GraphStory | 2026 | Edição por eventos | Parcial | Sim | Não | Não | Automática |

## 3.6 Análise Crítica e Lacunas

A análise da tabela comparativa revela três lacunas estruturais na literatura:

**Lacuna 1 — Ausência do GUF como contexto de recomendação:** Nenhum sistema usa o grafo de conhecimento do próprio universo ficcional do autor como contexto central de recomendação. Os sistemas existentes usam contexto de enredo (NarrativeRec), contexto do rascunho atual (DraftRec) ou contexto de obras de referência (CreativeRAG), mas não o GUF — que representa o conhecimento mais preciso sobre o universo específico do autor.

**Lacuna 2 — Ausência de arquitetura unificada multi-tipo:** Nenhum sistema integra múltiplos tipos de recomendação (referências, nomes, tropos, cenas análogas, brainstorm) em uma arquitetura unificada. Os sistemas existentes são especializados em um único tipo.

**Lacuna 3 — Trade-off intrusividade vs. precisão não formalizado:** Embora CreativeFlow (2024) e Human Agency (2024) documentem empiricamente o impacto da intrusividade, nenhum sistema técnico incorpora formalmente esse conhecimento em sua arquitetura de apresentação.

O ContextRec-Writer endereça todas as três lacunas identificadas.
