# CAPÍTULO 2 - INTRODUÇÃO

## 2.1 Contextualização

A literatura e a escrita criativa contemporânea, especialmente em gêneros como ficção especulativa e romances épicos, demandam a construção de universos ficcionais vastos e complexos (EVOLUTIONARY KNOWLEDGE, 2020). Tais universos, ou *worldbuilding*, englobam ecossistemas detalhados onde interagem múltiplas personagens, facções, locais geográficos e eventos ao longo de linhas temporais intrincadas. A complexidade dessas criações muitas vezes sobrecarrega a capacidade cognitiva humana do autor, exigindo ferramentas de organização que vão além de anotações textuais lineares e bases de dados tradicionais (STORY-THEME-OBSTACLE, 2025).

Na área das Humanidades Digitais, a intersecção entre a teoria literária e a computação tem propiciado novos paradigmas. A introdução de modelos semânticos formais, como o *World Literature Knowledge Graph* (WLKG, 2023), tem sido fundamental para mapear as inter-relações em obras canônicas. No entanto, quando aplicados ao processo criativo iterativo de um autor, tais modelos estáticos mostram-se insuficientes. Universos ficcionais não são estáticos; eles são temporais e evolutivos (TRIVEDI et al., 2017). As características de uma entidade (por exemplo, os atributos de um personagem, as alianças de uma facção) modificam-se ao longo da progressão narrativa, necessitando de uma representação dinâmica fundamentada em Grafos de Conhecimento Temporais (TKGs). 

Adicionalmente, compreender visualmente essas relações é um desafio à parte. Representações densas em grafos frequentemente geram ruído visual e sobrecarga cognitiva, prejudicando a utilidade da ferramenta de apoio (GUIDELINEEXPLORER, 2025; GRAPH USABILITY GROUP, 2026). Portanto, a contextualização deste trabalho situa-se na interseção entre a modelagem de Grafos de Conhecimento, o Raciocínio Temporal, a Narratologia Computacional e a Visualização de Informação.

## 2.2 Justificativa

O desenvolvimento de um sistema capaz de atuar como "memória do escritor" ancorada em princípios de narratologia é uma demanda crescente na área (NARRATIVE WORLD MODEL CONSORTIUM, 2026). As abordagens contemporâneas muitas vezes tratam o texto de forma isolada, ignorando a infraestrutura lógica (PLOTTER, 2026). Grafos de Conhecimento oferecem um formato estruturado que pode ser consumido por algoritmos de verificação lógica (LIU et al., 2025) e Modelos de Linguagem de Larga Escala (LLMs) (KNOBUILDER, 2025).

A justificativa para o uso de TKGs reside na sua capacidade de mapear a "evolução" dos fatos da narrativa. Eventos alteram o estado do mundo, o que pode ser abstraído como grafos que se transformam ao longo do tempo (CHEN et al., 2024). Isso permite detectar inconsistências, como um personagem estar em dois lugares simultaneamente ou interagir com um objeto antes de sua criação (TIDDI et al., 2024). 

Além disso, esta tese atende a uma demanda prática imediata: fundamentar o desenvolvimento de um sistema web de organização de arquivos, histórias e *brainstorming*. Para que tal sistema seja viável e útil, as metodologias de extração de relacionamentos, armazenamento temporal e visualização intuitiva devem ser unificadas em uma arquitetura consistente, um escopo raramente contemplado integralmente na literatura existente, que muitas vezes separa a extração textual da visualização end-user (KG SCOPING REVIEW, 2026).

## 2.3 Objetivos

### 2.3.1 Objetivo Geral
Investigar e propor um modelo formal baseado em Grafos de Conhecimento Temporais e Evolutivos para representar dinamicamente universos ficcionais complexos, integrando capacidades de raciocínio lógico, detecção de inconsistências narrativas e diretrizes de visualização interativa em um sistema de apoio à escrita criativa.

### 2.3.2 Objetivos Específicos
- **Analisar** o estado da arte em ontologias narrativas e modelos de grafos temporais aplicados à literatura (WLKG, URW-KG, NWM).
- **Projetar** uma arquitetura ontológica (Fictional Universe Knowledge Graph - FUKG) que suporte evolução temporal de entidades, relações e eventos em narrativas em construção.
- **Delinear** mecanismos de inferência e raciocínio lógico (baseados nos trabalhos de CHEN et al., 2024 e LIU et al., 2025) aplicados à manutenção de coerência temporal e espacial.
- **Estabelecer** diretrizes de usabilidade e visualização interativa de nós e enlaces, filtrados por linha do tempo, adequados à cognição humana na estruturação narrativa, sustentado por heurísticas de percepção gráfica.

## 2.4 Pergunta de Pesquisa e Hipóteses

**Pergunta de Pesquisa:**
*Como grafos de conhecimento temporais e evolutivos podem representar adequadamente a dinâmica de universos ficcionais complexos — incluindo personagens, relações, eventos e linhas do tempo — de modo a suportar raciocínio lógico, detecção de inconsistências e visualização interativa em sistemas de apoio à escrita criativa?*

**Hipótese Principal:**
A aplicação de um esquema de Grafo de Conhecimento Temporal, acoplado a regras de raciocínio lógico derivadas de ontologias literárias, permite não apenas a representação não-linear de eventos e entidades ficcionais, mas também possibilita a identificação computacional de anacronismos e inconsistências.

**Hipóteses Secundárias:**
1. Abordagens de extração de conhecimento focadas em contexto evolutivo (CTIKG, 2026) são essenciais para manter a fidelidade do grafo ao estado mental do autor.
2. Interfaces baseadas em diagramas de nós e enlaces orientados ao tempo mitigam a sobrecarga cognitiva (GRAPH USABILITY GROUP, 2026) durante o planejamento *worldbuilding* se combinadas com filtragens temporais.

## 2.5 Delimitação e Estrutura do Trabalho

Esta pesquisa se concentra nos modelos teóricos de estruturação e manipulação da informação gráfica (ontologias, raciocínio lógico temporal e regras de layout/visualização). O foco se mantém sobre como as tecnologias (Grafos Temporais, Inferência, Multi-Agentes) resolvem o problema do *worldbuilding* para o autor.

A tese está estruturada da seguinte forma:
- **Capítulo 2:** (A presente seção) introduz o contexto, justificativas e os objetivos da pesquisa.
- **Capítulo 3 (Referencial Teórico):** Aprofunda os conceitos de Grafos de Conhecimento (TKGs), revisa sistematicamente os vinte trabalhos base da literatura, abrangendo a extração, inferência e visualização.
- **Capítulo 4 (Metodologia):** Descreve a adoção da *Design Science Research* e o delineamento do protocolo estrutural para o artefato proposto.
- **Capítulo 5 (Desenvolvimento):** Apresenta o modelo FUKG (Fictional Universe Knowledge Graph), sua ontologia temporal, motores de raciocínio espacial/temporal e estratégias de layout baseadas nas diretrizes exploradas.
- **Capítulo 6 (Discussão):** Analisa criticamente a proposta perante as lacunas evidenciadas na teoria e os desafios práticos de implementação (trade-offs).
- **Capítulo 7 (Conclusão):** Sintetiza as respostas obtidas e indica o futuro do sistema web a ser desenvolvido a partir destes fundamentos.
