# 3 METODOLOGIA

O presente estudo possui natureza aplicada e objetivo descritivo-exploratório. Para sistematizar o desenvolvimento da arquitetura capaz de representar universos ficcionais de maneira evolutiva e estruturada, adotou-se o paradigma *Design Science Research* (DSR), alinhado a um rigoroso delineamento de revisão sistemática para consolidação da literatura.

## 3.1 Design Science Research (DSR)

A *Design Science Research* é um paradigma epistemológico cujo núcleo é o planejamento, construção e validação de artefatos que visem resolver um problema prático identificado. Neste trabalho, o "problema prático" consiste na dificuldade de gestão cognitiva de lógicas temporais complexas em universos ficcionais em desenvolvimento (*worldbuilding*), por parte de escritores. O "artefato proposto" é o *Fictional Universe Knowledge Graph* (FUKG), um modelo formal e conceitual de processamento, inferência e visualização.

O ciclo metodológico seguiu as seguintes etapas:
1. **Identificação e Conscientização do Problema:** Levantamento da dor dos criadores literários no controle do volume informacional e anacronismos (suportado por NARRATIVE WORLD MODEL CONSORTIUM, 2026).
2. **Sugestão de Solução:** Idealização de um esquema de Grafo de Conhecimento Temporal (TKG), integrado a motores lógicos, motivado pelo arcabouço tecnológico demonstrado em trabalhos como Know-Evolve (TRIVEDI et al., 2017).
3. **Desenvolvimento:** Design detalhado da ontologia (eventos, sujeitos e linhas de tempo), e das estratégias algorítmicas de raciocínio.
4. **Avaliação:** Proposição de critérios de eficácia estrutural, validando o modelo perante cenários fictícios complexos.
5. **Conclusão:** Síntese final com o delineamento das especificações prontas para futura implementação de *software*.

## 3.2 Triagem Literária e Protocolo PRISMA

A fim de garantir solidez teórica na etapa de "Sugestão" da DSR, a delimitação do Estado da Arte obedeceu parcialmente a princípios inspirados no protocolo PRISMA (*Preferred Reporting Items for Systematic Reviews and Meta-Analyses*). Para o escopo final desta tese, foi filtrado um corpo fechado de 20 literaturas-chave de alta relevância (A1 e A2, publicados em veículos como ISWC, ACL, COLING e arXiv de vanguarda 2024-2026). 

O protocolo estabeleceu que a extração de literatura devia concentrar-se em: (A) Algoritmos de inferência e construção (KnoBuilder, 2025; CTIKG, 2026); (B) Teorias Literárias Computacionais (PLOTTER, 2026; STORY-THEME-OBSTACLE, 2025); (C) Interfaces Visuais (GuidelineExplorer, 2025).

## 3.3 Framework Conceitual: Grafo Ficcional Temporal (FUKG)

O modelo metodológico do FUKG (*Fictional Universe Knowledge Graph*) propõe três camadas de processamento:
1. **Camada de Ingestão e Ontologia:** Padroniza entidades (Locais, Pessoas, Facções, Conceitos Mágicos/Científicos) e define sua taxonomia baseada nas diretrizes do WLKG (2023) e URW-KG (2024).
2. **Camada Lógica-Temporal:** Define o grafo não estaticamente, mas na forma de quádruplas $E = (s, p, o, [t_i, t_f])$, onde cada evento cria uma variação no grafo. A modelagem segue premissas de raciocínio lógico em grafos temporais extraídas de CHEN et al. (2024 - TPAR) e RLEE (LIU et al., 2025).
3. **Camada de Apresentação e Interação:** Formulação do design visual baseada em heurísticas de usabilidade (GRAPH USABILITY GROUP, 2026). Esta camada especifica como o grafo será renderizado usando simulações de forças (*force-directed graphs*) mitigadas por filtragem cronológica.

## 3.4 Critérios de Avaliação

A consistência e validade da metodologia e do modelo proposto (FUKG) foram analisadas através dos seguintes critérios de viabilidade teórica:
- **Expressividade Ontológica:** Capacidade do modelo de cobrir a riqueza de atributos observada em narrativas longas, em paridade com a ferramenta EKG (EVOLUTIONARY KNOWLEDGE, 2020).
- **Tratamento de Contradições:** O modelo deve suportar a identificação de violações espaço-temporais (por exemplo, Personagem X estar alocado a uma Coordenada Y num tempo T, e a uma Coordenada Z intransponível no mesmo T). Esta métrica afere o desempenho da camada lógica em comparação à coerência fornecida por SCORE (2025).
- **Escalabilidade Cognitiva:** Baseado nas diretrizes de GuidelineExplorer (2025), o artefato visual não deve requerer a visualização simultânea de mais de $N$ nós para a compreensão de um microevento, comprovando a utilidade da abordagem de fatia de tempo.
