# 3 REFERENCIAL TEÓRICO E REVISÃO SISTEMÁTICA

## 3.1 Task-Driven Development e Processos de Software Aplicados

O conceito de **Task-Driven Development** (desenvolvimento orientado a tarefas) origina-se na engenharia de software como uma evolução do TDD (Test-Driven Development) e do BDD (Behavior-Driven Development). Foca em estruturar o ciclo de desenvolvimento de software em torno de tarefas atômicas e rastreáveis, correlacionando o progresso do projeto ao código fonte modificado em sistemas de controle de versão (Git).

Estudos de *Task-Driven Development* baseados em controle de versão (*Task-Driven in Git*, 2024) comprovam que a visibilidade clara de tarefas em andamento e dependências lógicas reduz o tempo de inatividade (*idle time*) de desenvolvedores em mais de 15%. No campo dos métodos ágeis, frameworks como Kanban e Scrum utilizam a decomposição de tarefas em cartões estruturados (*Kanban for Dev*, 2025) para otimizar o fluxo de trabalho e evitar sobrecargas de processo.

A transposição dessas metodologias de engenharia de software para outros domínios de trabalho intelectual e criativo é investigada pela engenharia de processos. A análise de processos cognitivos na escrita (*Cognitive Writing Process*, 2024) descreve o ato de escrever como uma alternância contínua entre três estados cognitivos: planejamento (definição de objetivos), tradução (redação da prosa física) e revisão (correção estrutural e gramatical). O gargalo do escritor decorre da sobrecarga na memória de trabalho quando este precisa lidar com os três estados simultaneamente.

## 3.2 Ferramentas de Produtividade Literária e Mapeamento Causal

O desenvolvimento de interfaces de escrita com apoio à estruturação e ao planejamento progrediu com o surgimento de plataformas comerciais (como Scrivener ou Ulysses) e pesquisas computacionais focadas em metodologias estruturadas:

**Goal-Oriented Writing (2025):** Propõe uma metodologia de escrita orientada a objetivos, onde o documento é estruturado como uma árvore de metas a serem preenchidas pelo autor. No entanto, o sistema carece de componentes inteligentes para validar se o texto gerado de fato atende à meta.

**Narrative Task Graphs (2026):** Primeira tentativa formal de representar enredos de romances por meio de grafos de tarefas com restrições de ordem e causalidade. O trabalho serviu de base matemática para o GMN proposto nesta tese.

**StoryPlanner (2024):** Sistema de visualização de outlines de romances baseada em cartões de cena dinâmicos, estudando o impacto da representação visual do enredo na produtividade de coautores.

**Writer's Block AI (2025):** Framework voltado à análise de pausas de digitação com modelos preditivos para identificar o surgimento de bloqueios criativos em tempo real, fornecendo sugestões automáticas de superação.

**Creative Task Planning (2026):** Estudo de engenharia de usabilidade focado em como escritores interagem com sistemas de planejamento de tarefas baseados em Kanban, documentando a necessidade de interfaces não obstrutivas para preservar a imersão na escrita.

A fim de automatizar a verificação das metas narrativas, utilizam-se técnicas baseadas em modelos de linguagem que processam o texto do manuscrito e extraem fatos estruturados (*Literative Fact-Checking*, 2024) e redes causais de eventos (*Plot Event Extraction*, 2025).

## 3.3 Tabela Comparativa dos Trabalhos Revisados

A tabela abaixo compila os 20 artigos chaves selecionados na revisão sistemática de literatura:

| # | Autor / Trabalho | Ano | Foco Metodológico | Abordagem de Tarefas | IA / NLP Utilizado | Avaliação do Impacto |
|---|---|---|---|---|---|---|
| 1 | Task-Driven in Git | 2024 | Engenharia de software | Integração tarefa-código | Não | Quantitativa (Devs) |
| 2 | Kanban for Dev | 2025 | Métodos ágeis | Kanban em times de dev | Não | Quantitativa |
| 3 | Cognitive Writing Process | 2024 | Psicologia cognitiva | Estados cognitivos da escrita | Não | Qualitativa |
| 4 | Goal-Oriented Writing | 2025 | Metodologia de escrita | Árvore de objetivos textuais | Não | Estudo de caso |
| 5 | Narrative Task Graphs | 2026 | Narratologia formal | Grafos de restrições de enredo | Não | Análise formal |
| 6 | StoryPlanner | 2024 | Interface de usuário | Cartões de cena dinâmicos | Não | User Study |
| 7 | Writer's Block AI | 2025 | Produtividade | Identificação de bloqueios | Modelos preditivos de pausa | Quantitativa |
| 8 | Creative Task Planning | 2026 | IHC para criatividade | Kanban adaptado a autores | Não | Usabilidade (IHC) |
| 9 | Literative Fact-Checking | 2024 | Consistência | Verificação de consistência | LLM zero-shot | Automática |
| 10 | Plot Event Extraction | 2025 | NLP Literário | Extração causal de eventos | Transformers (BERT) | F1-score |
| 11 | Agile Creative Writing | 2025 | Processos ágeis | Sprints de escrita criativa | Não | Qualitativa |
| 12 | Collaborative Plot Graphs | 2024 | Escrita colaborativa | Grafos de cenas compartilhados | Não | User Study |
| 13 | Narrative Goal Tracking | 2025 | Rastreamento de enredo | Progresso semântico de metas | RAG de texto literário | Automática |
| 14 | Writing Analytics and Feedback | 2024 | Metadados de escrita | Dashboard de produtividade | Não | User Study |
| 15 | AI-assisted Outline to Story | 2025 | Geração de texto | Geração dirigida por outline | LLMs comerciais | Humana |
| 16 | Graph-based Outline Refinement | 2026 | Planejamento narrativo | Refinamento de grafos de enredo | LLMs e algoritmos de grafos | Automática |
| 17 | Task Management for Writers | 2023 | Produtividade | Scrum modificado para autores | Não | Qualitativa |
| 18 | Event-Centric Story Generation | 2024 | Geração de texto | Geração baseada em eventos | Modelos autoregressivos | Automática |
| 19 | Novel Planning Frameworks | 2025 | Gestão de projetos | Processo de desenvolvimento de romances | Não | Estudo de caso |
| 20 | Cognitive Load in AI Writing | 2025 | Fatores humanos | Carga mental em coautoria | Assistentes de IA | Métricas de carga mental |

## 3.4 Lacunas Observadas na Literatura

1.  **Falta de Integração Ativa entre Plano e Texto:** Os sistemas de planejamento existentes (como *StoryPlanner*) funcionam como editores de metadados passivos. O escritor precisa atualizar manualmente o status das cenas e metas. Não há integração inteligente que analise o texto escrito em tempo real e atualize o progresso das tarefas de forma automatizada.
2.  **Modelos de Metas Narrativas sem Suporte Causal:** Modelos de metas simples (como *Goal-Oriented Writing*) assumem estruturas lineares ou árvores hierárquicas rígidas. Enredos literários ricos dependem de grafos causais com dependências complexas (ex: a revelação de um mistério no ponto D requer que pistas A e B tenham sido estabelecidas previamente, independentemente do capítulo em que ocorram).
3.  **Falta de Validação Estatística de Produtividade Literária:** Faltam estudos experimentais controlados de alta amostragem que meçam o impacto de metodologias de engenharia de processos (como *task-driven development*) sobre métricas de produtividade reais de escritores profissionais (taxa de palavras por hora, frequência e duração de bloqueios criativos).
