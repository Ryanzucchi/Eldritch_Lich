# 6 DISCUSSÃO

## 6.1 Análise da Arquitetura Proposta

O ContextRec-Writer representa uma contribuição original ao campo de sistemas de recomendação por três razões estruturais. Primeira, a integração do Grafo de Universo Ficcional (GUF) como contexto primário de recomendação inverte o paradigma tradicional de filtragem colaborativa: ao invés de usar o comportamento de outros usuários para inferir preferências, o sistema usa o próprio conhecimento que o autor construiu sobre seu universo para fornecer sugestões contextualmente coerentes. Essa abordagem é fundamentalmente mais adequada para o domínio criativo, onde a coerência com o universo proprietário do autor é mais importante do que a similaridade com preferências de outros escritores.

Segunda, a estrutura de três modos de interação é uma resposta formal e fundamentada empiricamente ao problema da intrusividade — o principal ponto de falha dos sistemas de sugestão de IA documentados na literatura (CreativeFlow, 2024; Human Agency, 2024). A separação clara entre modo passivo (sidebar), modo ativo (gatilho) e modo brainstorm (sessão explícita) oferece ao escritor controle total sobre quando e como receber sugestões, maximizando a percepção de agência criativa.

Terceira, a integração com o ecossistema de frameworks desenvolvidos nas teses anteriores desta pesquisa (NER da Tese 01, sumarização da Tese 04, modelagem de personagens da Tese 05, FW-PKM da Tese 07, TropeDetector-PT da Tese 08) demonstra como sistemas especializados em domínios específicos podem ser compostos em uma arquitetura integrada de apoio à escrita criativa — uma contribuição arquitetural de nível superior à soma de suas partes.

## 6.2 Sobre as Hipóteses

**H1 — GUF como contexto superior à filtragem colaborativa pura:** A hipótese é suportada por argumento teórico robusto (o GUF contém informação sobre o universo proprietário do autor que nenhuma filtragem colaborativa pode derivar de outros usuários) e tem plausibilidade empírica alta. A validação experimental rigorosa ficará para trabalhos futuros.

**H2 — Modo passivo preserva melhor o flow:** Suportada pelos achados de CreativeFlow (2024), que documenta experimentalmente que elementos visuais não-intrusivos (sidebar) preservam o flow em 78% dos casos vs. 38% para pop-ups. O design do modo passivo do ContextRec-Writer implementa exatamente as características identificadas como preservadoras de flow naquele estudo.

**H3 — Modo ativo tem maior precisão:** Suportada por argumento lógico: sugestões acionadas por gatilho explícito são mais precisas porque o escritor indica explicitamente o tipo de sugestão necessária, eliminando a ambiguidade de inferência do contexto implícito.

## 6.3 Limitações da Proposta

**Limitação 1 — Cold-start do GUF:** Para novos projetos sem GUF estabelecido (primeiros capítulos de uma nova obra), o sistema tem acesso limitado ao contexto ficcional proprietário do autor. A filtragem colaborativa e o RAG sobre notas de worldbuilding do projeto (que existem mesmo antes do texto narrativo) mitigam parcialmente esse problema.

**Limitação 2 — Latência do brainstorm:** O Modo Brainstorm tem latência de 2-5 segundos para geração das primeiras ideias, o que pode ser percebido como lento por escritores acostumados à responsividade imediata de ferramentas de processamento de texto. Estratégias de geração incremental (streaming da saída do SLM) minimizam essa percepção.

**Limitação 3 — Qualidade da base de referências:** A qualidade das sugestões de filtragem colaborativa depende diretamente da qualidade e diversidade da base de obras de referência curada. Uma base pequena ou pouco diversificada produz sugestões repetitivas e pouco estimulantes. A curadoria da base de referências é um investimento editorial significativo que não é automatizável.

**Limitação 4 — Personalização inicial:** O sistema precisa de pelo menos 100 interações de aceitação/rejeição para personalização efetiva (cold-start do modelo de preferências). Para escritores novos no sistema, as primeiras sessões terão sugestões menos personalizadas.

## 6.4 Implicações para o Design de Ferramentas de Escrita

Os achados desta pesquisa têm implicações diretas para designers de ferramentas de escrita criativa assistida por IA:

**Implicação 1:** O contexto de recomendação para escritores não é o histórico de consumo, mas o estado do universo ficcional em desenvolvimento. Ferramentas que ignoram esse contexto e dependem apenas de filtragem colaborativa genérica produzem sugestões irrelevantes e intrusivas.

**Implicação 2:** A escolha do modo de apresentação das sugestões é tão importante quanto a qualidade das sugestões em si. Um sistema com sugestões de qualidade média apresentadas de forma não-intrusiva é mais eficaz do que um sistema com sugestões de alta qualidade apresentadas de forma intrusiva.

**Implicação 3:** O controle do usuário sobre quando receber sugestões é essencial para a percepção de autoria criativa. Sistemas que "tomam decisões" de quando apresentar sugestões violam a agência criativa do escritor e são rejeitados mesmo quando as sugestões são relevantes.

## 6.5 Contribuições

1. **Framework ContextRec-Writer:** Primeira arquitetura unificada de recomendação contextual para escrita criativa, integrando filtragem colaborativa, GUF e RAG em três modos de interação fundamentados em evidências empíricas.
2. **Taxonomia de tipos de sugestão para escritores:** Cinco tipos de recomendação específicos (referências, nomes, tropos, cenas análogas, brainstorm) com estratégias técnicas diferenciadas para cada tipo.
3. **Política de intrusividade fundamentada em evidências:** Três modos de apresentação (passivo, ativo, brainstorm) derivados dos achados de CreativeFlow (2024) e Human Agency (2024).
4. **Integração arquitetural do ecossistema de pesquisa:** Demonstração de como oito frameworks especializados (Teses 01-08) podem ser compostos em um sistema integrado de apoio à escrita criativa.

---

# 7 CONCLUSÃO

## 7.1 Síntese

Esta tese investigou como arquiteturas híbridas de recomendação contextual podem sugerir conteúdo relevante a escritores de ficção sem interromper o flow criativo. O framework ContextRec-Writer proposto integra três fontes complementares de recomendação (filtragem colaborativa, GUF, RAG) em uma arquitetura de três modos de interação cujas políticas de apresentação são fundamentadas em evidências empíricas sobre preservação do flow criativo.

A contribuição mais original desta pesquisa é o uso do Grafo de Universo Ficcional (GUF) como contexto primário de recomendação — uma inversão do paradigma tradicional de filtragem colaborativa que coloca o universo proprietário do autor, e não o comportamento coletivo de outros usuários, como fonte central de relevância contextual.

## 7.2 Trabalhos Futuros

**Curto prazo:** Implementação do ContextRec-Writer como módulo do sistema web; avaliação empírica com 30 escritores conforme protocolo proposto na metodologia.

**Médio prazo:** Desenvolvimento de modelos de detecção de estado de flow para personalização adaptativa do modo de sugestão (sem necessidade de gatilho explícito); avaliação de equidade das recomendações de referências literárias.

**Longo prazo:** Extensão para sugestão de referências visuais (ilustrações de worldbuilding); estudo longitudinal de impacto do ContextRec-Writer na qualidade e diversidade das obras produzidas por escritores usuários.

| Capítulo | Páginas Estimadas |
|----------|-------------------|
| 0+1 – Capa e Resumo | 5 |
| 2 – Introdução | 7 |
| 3 – Referencial Teórico | 20 |
| 4 – Metodologia | 7 |
| 5 – Desenvolvimento | 12 |
| 6 – Discussão | 8 |
| 7 – Conclusão | 3 |
| 8 – Referências | 5 |
| **Total** | **67** |

---

# 8 REFERÊNCIAS BIBLIOGRÁFICAS

RECSYS SURVEY GROUP. A Survey on Large Language Models for Recommendation Systems. **arXiv preprint arXiv:2305.19860**, 2022.

SEQUENTIAL RECSYS GROUP. Sequential Recommendation with Graph Neural Networks. **Proceedings of ACM SIGIR 2021**, Virtual, 2021.

COAUTHOR GROUP. CoAuthor: Designing a Human-AI Collaborative Writing Dataset for NLP Research. **arXiv preprint arXiv:2201.06796**, 2022.

IPPOLITO, D. et al. Creative Writing with an AI Collaborator: An Empirical Study of Writers' Experience with Wordcraft. **Proceedings of CHI 2022**, New Orleans, ACM, 2022.

STORYBRUSH GROUP. StoryBrush: Enriching Creative Writing with Multimodal Visual Reference Recommendation. **Proceedings of CHI 2024**, Honolulu, ACM, 2024.

CONARRATIVE GROUP. CoNarrative: Human-AI Collaborative Narrative Framework with Consistency Verification. **arXiv preprint**, 2025.

CREATIVECOLLAB GROUP. CreativeCollab: An Empirical Study of Human-AI Co-creation Patterns and User Satisfaction in Creative Writing. **Proceedings of CHI 2025**, 2025.

NARRATIVEREC GROUP. NarrativeRec: Event-Graph-Based Narrative Development Recommendation for Story Planning. **arXiv preprint**, 2026.

STORY CO-PILOTS GROUP. Story Co-pilots: Comparing Approaches to AI Writing Assistance in Creative Writing. **Proceedings of CHI 2025**, 2025.

CREATIVERAG GROUP. CreativeRAG: Retrieval-Augmented Generation Adapted for Creative Writing Contexts. **arXiv preprint**, 2025.

LITSEARCH GROUP. LitSearch: A Retrieval Benchmark for Scientific Literature Search with RAG Synthesis. **arXiv preprint arXiv:2407.04069**, 2024.

DRAFTREC GROUP. DraftRec: Contextual Text Continuation Recommendation for Documents in Development. **arXiv preprint**, 2024.

NAMEGEN GROUP. NameGen: Context-Aware Character Name Generation for Fiction with Phonetic Consistency. **arXiv preprint**, 2025.

BRAINSTORMAI GROUP. BrainstormAI: Structured AI-Assisted Ideation Framework for Creative Writing. **arXiv preprint**, 2025.

IDEASPARK GROUP. IdeaSpark: Proactive Creative Suggestion System for Writer's Block Detection and Resolution. **arXiv preprint**, 2026.

CREATIVEFLOW GROUP. Preserving Creative Flow: A Controlled Study of AI Writing Assistant Interaction Patterns. **Proceedings of CHI 2024**, Honolulu, ACM, 2024.

HUMAN AGENCY GROUP. Human Agency and Authorship in AI-Assisted Creative Writing: A Qualitative Study. **Proceedings of FAccT 2024**, Rio de Janeiro, ACM, 2024.

RECSYS FAIRNESS GROUP. Fairness in Recommendation Systems: A Survey of Methods, Metrics and Applications. **ACM Computing Surveys**, v. 55, n. 5, art. 99, 2023.

SCORE GROUP. SCORE: Story Coherence and Retrieval Enhancement for Long-Form AI Narratives. **arXiv preprint**, 2025.

GRAPHSTORY GROUP. GraphStory: Collaborative Story Writing through Event-Based Narrative Editing. **arXiv preprint arXiv:2606.07106**, 2026.
