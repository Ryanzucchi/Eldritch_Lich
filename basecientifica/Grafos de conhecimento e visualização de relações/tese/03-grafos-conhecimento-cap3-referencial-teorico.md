# 2 REFERENCIAL TEÓRICO

A fundamentação teórica desta tese aborda os pilares tecnológicos e conceituais necessários para a modelagem dinâmica de universos ficcionais, unindo os domínios de Processamento de Linguagem Natural, Representação do Conhecimento e Visualização de Dados.

## 2.1 Fundamentos: Grafos de Conhecimento, TKGs e Ontologias Literárias

Os Grafos de Conhecimento (KGs - *Knowledge Graphs*) representam o mundo real através de redes estruturadas de informações, compostas por entidades (nós) e suas relações (arestas) num formato de triplas (*sujeito, predicado, objeto*). No contexto das Humanidades Digitais, ontologias foram adaptadas para estruturar conhecimento da literatura mundial. Um marco deste domínio é o *World Literature Knowledge Graph* (WLKG, 2023), que propõe um esquema multilíngue focado em capturar as entidades literárias essenciais em trabalhos canônicos e suas ligações intertextuais. Outro esforço representativo é o projeto *Universal Resource of World Literature* (URW-KG, 2024), que fornece um vasto repositório interligado para pesquisadores, evidenciando que as bases de conhecimento abertas podem organizar narrativas globais e personagens de forma extensível. 

No entanto, o universo narrativo em si exige uma dimensão que os KGs estáticos não comportam: o tempo. Consequentemente, Grafos de Conhecimento Temporais (TKGs) tornam-se primordiais. Um TKG estende as triplas tradicionais adicionando um componente de tempo ou evento, formando quádruplas do tipo *(sujeito, predicado, objeto, timestamp)* (CHEN et al., 2024). Essa representação cronológica permite que uma relação entre dois personagens — por exemplo, "A é inimigo de B" — possua início, fim e evolução para "A é aliado de B", fundamentando assim um raciocínio lógico correto na dimensão da linha temporal de um livro.

## 2.2 Estado da Arte em Computação Narrativa e Evolutiva

As abordagens mais recentes da Inteligência Artificial visam não apenas entender, mas planejar narrativas usando grafos.

### 2.2.1 Modelagem e Extração de Enredos
O projeto *Narrative World Model* (NARRATIVE WORLD MODEL CONSORTIUM, 2026) introduziu a ideia de uma "memória baseada em narratologia" para auxiliar escritores, codificando os pilares de uma estória (cenários, propósitos, regras mágicas). Expandindo a criação em si, a arquitetura PLOTTER (2026) propôs o raciocínio fundamentado em grafos para o planejamento além do texto, utilizando as estruturas interconectadas para assegurar a coesão a longo prazo, superando as janelas de contexto limitadas de Modelos de Linguagem de Grande Escala. Do ponto de vista conceitual, o modelo *Story-Theme-Obstacle* (2025) incorpora a teoria literária (conflitos, clímax) ao grafo, amarrando cada nó a uma função narrativa explícita.

Na vertente de construção de grafos (*KG Construction*), KnoBuilder (2025) propôs o uso de LLMs-Agents autônomos para orquestrar a extração de dados brutos e formatá-los em ontologias consistentes. Isso converge com a revisão extensiva de KG Scoping Review (2026), que determinou que a construção assistida por LLM minimiza erros estruturais, desde que guiada por um esquema rigoroso (*human-in-the-loop*). Abordando relações textuais densas, a metodologia CTiKG (2026) foca na extração conjunta de entidades e relações sensível ao contexto, um avanço sobre as abordagens sequenciais. Essa ideia de unificação no processo extrativo também foi validada experimentalmente por Chen et al. (2025) no processamento end-to-end de grafos.

### 2.2.2 Coerência e Colaboração
Mapear eventos não é suficiente; é preciso garantir coerência e colaboração. A plataforma GraphStory (2026) revelou que a edição orientada a eventos através de grafos melhora a redação colaborativa, fornecendo a múltiplos autores um estado compartilhado do mundo. Da mesma forma, SCORE (2025) enfatizou o aprimoramento da coerência narrativa (Story Coherence) mediante mecanismos de *retrieval*, permitindo buscas precisas no grafo narrativo para prever ou corrigir furos de roteiro (*plot holes*). Tiddi et al. (2024) demonstraram empiricamente como transitar "de nós para narrativas" é o diferencial no auxílio criativo.

### 2.2.3 Raciocínio Lógico e Dinâmica Temporal
Entender a dinâmica evolutiva de um TKG é um campo desafiador de *Machine Learning*. O modelo Know-Evolve (TRIVEDI et al., 2017) foi pioneiro no uso de processos de pontos temporais (*point processes*) e raciocínio profundo para prever links em grafos dinâmicos. Mais recentemente, o modelo Evolutionary Knowledge (2020) focou na representação (EKG) em romances longos, modelando a mutação das características de uma persona à medida que ela interage com a trama.

Dois avanços cruciais no raciocínio em TKGs são o TPAR (CHEN et al., 2024) e o RLEE (LIU et al., 2025). O TPAR propõe um modelo unificado de raciocínio em grafos de conhecimento temporais que avalia vizinhanças cronológicas. Já o RLEE foca especificamente no Raciocínio Lógico de Relações, abstraindo as regras (ex: $Amigo(A, B) \land Amigo(B, C) \rightarrow Conhecido(A, C)$) e aplicando-as ao eixo do tempo. O Knowledge Enhanced Graph Inference Network (HAN & WANG, 2024) reforça esta abordagem usando *Graph Neural Networks* aumentadas por regras ontológicas. No âmbito da simulação e autonomia narrativa, MAGE (2026) introduziu Multi-Agentes evolutivos cujos estados mentais coevoluem em sincronia com o KG do mundo ficcional, promovendo narrativas emergentes.

## 2.3 Visualização de Grafos: Usabilidade Cognitiva

Embora os *backends* algorítmicos (Inferência, Multi-agentes) solucionem o raciocínio lógico, um sistema para escritores é dependente da interface humano-computador. 

A Visualização de Informação em Grafos enfrenta o desafio do "hairball effect" (emaranhado visual). O trabalho GuidelineExplorer (2025) consolidou diretrizes rigorosas para diagramas de *node-link* (nós e enlaces), enfatizando a necessidade de minimizar cruzamentos de arestas e maximizar a clareza da simetria das estruturas. Em paralelo, a avaliação empírica das percepções visuais conduzida pelo Graph Usability Group (2026) revelou que usuários respondem de maneira adversa à densidade, demandando filtros visuais temporais e semânticos estritos para compreenderem ontologias narrativas complexas. Assim, layouts dinâmicos direcionados por força (force-directed) devem ser atrelados a deslizadores de tempo, permitindo "viajar" pelas versões do universo ficcional.

## 2.4 Tabela Comparativa das Abordagens Analisadas

A fim de compilar as lacunas e frentes de pesquisa, a tabela abaixo classifica as 20 fontes utilizadas de acordo com seus domínios de contribuição.

| Referência | Foco Principal | Contribuição Tecnológica/Conceitual para a Tese |
| :--- | :--- | :--- |
| Narrative World Model Consortium (2026) | Narratologia | Memória contextual baseada em regras narrativas. |
| Story-Theme-Obstacle (2025) | Estrutura Narrativa | Geração baseada em conflito e temática literária via KGs. |
| WLKG (2023) | Ontologia | Base estática global para entidades literárias. |
| PLOTTER (2026) | Planejamento em Grafos | Raciocínio grafos-baseado para estruturação de longo prazo. |
| Evolutionary Knowledge (2020) | Dinâmica de Personagens| Representação da evolução comportamental em KGs narrativos. |
| MAGE (2026) | Agentes e Grafos | Coevolução KG-agente, modelando narrativas mutáveis. |
| Chen et al. (2024 - TPAR) | Inferência TKG | Raciocínio unificado em relações que mudam no tempo. |
| Liu et al. (2025 - RLEE) | Lógica e Regras TKG | Validação lógica temporal entre entidades. |
| KnoBuilder (2025) | LLM-Agent | Automação na montagem autônoma de ontologias estruturadas. |
| GuidelineExplorer (2025) | UX em Node-Link | Regras paramétricas para mitigar a densidade visual. |
| Tiddi et al. (2024) | Escrita Criativa e KG | Passagem do modelo semântico puramente técnico à UX criativa. |
| KG Scoping Review (2026) | Revisão de Literatura | Avaliação do panorama LLM na construção e precisão do KG. |
| Graph Usability Group (2026)| Experiência de Usuário | Avaliação empírica do que causa sobrecarga visual em grafos. |
| SCORE (2025) | Recuperação Narrativa | Mecanismos de busca orientados a evitar *plot holes*. |
| GraphStory (2026) | *Worldbuilding* Colaborativo| Gestão de autoria compartilhada via *event-based graphs*. |
| CTiKG (2026) | Extração de Contexto | Extração conjunta otimizada, vinculada ao contexto local. |
| Trivedi et al. (2017) | Previsão Temporal | Modelagem matemática pioneira (Know-Evolve) para TKGs. |
| Chen et al. (2025) | Engenharia de Extração | Modelos integrados de ponta a ponta (Entity-Relation). |
| Han & Wang (2024) | Inferência Semântica | Redes para dedução lógica a partir de regras conhecidas. |
| URW-KG (2024) | Ontologia Universal | Esquema em larga escala focado em literatura do mundo real. |

## 2.5 Lacunas, Taxonomia e Justificativa da Abordagem Proposta

Baseado na tabela comparativa, observa-se uma taxonomia clara: (1) Obras focadas na constituição semântica pura (WLKG, URW-KG); (2) Pesquisas algorítmicas de TKGs com foco em exatidão matemática (TPAR, RLEE, Know-Evolve); (3) Ferramentas focadas na interface de usuário (GuidelineExplorer, Graph Usability Group); e (4) Sistemas prototipados para geração automatizada e suporte LLM (PLOTTER, SCORE, MAGE, KnoBuilder).

A principal lacuna da literatura é a **fragmentação**. Enquanto a comunidade de *Semantic Web* constrói ontologias exaustivas (URW-KG), faltam-lhes os mecanismos dinâmicos aplicáveis à "escrita em progresso". O modelo proposto nesta tese, o **Fictional Universe Knowledge Graph (FUKG)**, visa suprir essa lacuna estabelecendo uma arquitetura "ponte": ele consome as melhores práticas de inferência temporal (CHEN et al., 2024) e aplica-as diretamente a uma interface de usabilidade validada (GRAPH USABILITY GROUP, 2026), tendo como núcleo a ontologia narrativa proposta pelo modelo NWM (NARRATIVE WORLD MODEL CONSORTIUM, 2026). Essa fusão fundamenta não um sistema gerador de texto autônomo, mas uma "base de cérebro" interativa e cronologicamente coesa (SCORE, 2025) para suportar as decisões lógicas de autores humanos durante o *brainstorm* de desenvolvimento literário complexo.
