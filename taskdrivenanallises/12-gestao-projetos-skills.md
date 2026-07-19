# Proposta de Skills — Gestão de projetos e task-driven development

Abaixo estão especificadas as skills técnicas extraídas da Tese 12 e de sua base científica correspondente, focadas no planejamento e produtividade de autoria orientada a tarefas.

---

## Skill: `modelagem-de-grafo-de-metas-narrativas-gmn`

**Temática de origem:** Gestão de projetos e task-driven development (Tese 12)
**Objetivo:** Modelar matematicamente a estrutura de dependências causais do enredo de romances usando Grafos Direcionados Acíclicos (DAGs) para prevenção ativa de furos de roteiro.
**Quando usar (triggers):** No design da arquitetura de planejamento de histórias (outliners), modelagem de dados de enredo e criação de validadores lógicos.
**Fundamentação científica:** Narrative Task Graphs (2026), Collaborative Plot Graphs (2024), Graph-Based Outline Refinement (2026).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Estruturação do Grafo:** Definir o GMN como um grafo direcionado $G = (V, E)$, onde $V$ representa metas lógicas (ex: "Apresentar a pista $X$") e $E$ representa arestas de dependência causal (ex: meta $B$ depende de $A$).
2. **Propagação de Inconsistências:** Implementar regras recursivas de travessia do grafo: se um nó pai $A$ for removido ou editado de forma a quebrar sua veracidade, propagar automaticamente a flag `Inconsistente` a todos os nós filhos descendentes diretos e indiretos em $Descendants(A)$.
3. **Validação Causal na Conclusão:** Bloquear a mudança de status de uma meta $B$ para `Concluído` se qualquer nó pai $A \in Parent(B)$ permanecer com o status `Pendente` ou `Inconsistente`.
4. **Detecção de Ciclos Causa-Efeito:** Rodar algoritmos de detecção de ciclo (ex: Algoritmo de Kahn) antes de registrar novas arestas desenhadas pelo usuário, impedindo paradoxos temporais e loops infinitos no outline.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Paradoxos de Dependência Circular:** Permitir a criação de dependências mútuas (A depende de B, que depende de A) gera travamento no cálculo de dependências e loops de validação infinitos. O editor de planejamento do enredo deve rodar uma verificação de aciclicidade (DAG check) síncrona a cada nova aresta desenhada (Narrative Task Graphs, 2026).

**Métricas de sucesso sugeridas:**
- Tempo de execução para checagem e propagação de estados no grafo (alvo $< 5\text{ms}$).

**Requisito(s) do projeto relacionado(s):** RF-194 (quadro de progresso), RF-195 (recomendar afazeres).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `mapeamento-semantico-de-progresso-textual-local`

**Temática de origem:** Gestão de projetos e task-driven development (Tese 12)
**Objetivo:** Rastrear a conclusão de tarefas narrativas em background pela análise semântica do texto livre digitado pelo romancista.
**Quando usar (triggers):** Conclusão de parágrafos no editor e atualização de progresso no painel Kanban.
**Fundamentação científica:** Plot Event Extraction (2025), Narrative Goal Tracking (2025), Event-Centric Story Generation (2024).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Representação de Metas em Vetores:** Computar e armazenar embeddings das descrições das metas ativas do GMN em um banco de dados vetorial de borda (ex: SQLite-VSS/RAGdb).
2. **Embeddings de Parágrafo:** Vetorizar o parágrafo escrito recentemente pelo autor utilizando um encoder de texto local em background.
3. **Filtragem por Distância de Cosseno:** Executar a similaridade de cosseno do vetor do parágrafo contra os vetores das metas pendentes daquela cena.
4. **Validação por LLM Crítico:** Se a similaridade ultrapassar o limiar de $0.82$, enviar o parágrafo e a meta para um LLM local de classificação zero-shot para confirmar se a meta foi concretamente descrita (evitando registrar citações passivas ou planejamentos verbais dos personagens).
5. **Automação de Kanban:** Atualizar o status do cartão de tarefa no Kanban correspondente de forma silenciosa e criar um hiperlink associando a tarefa concluída à linha exata do texto no manuscrito.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Falsos Positivos por Discussão Passiva:** Classificar metas como concluídas apenas por similaridade vetorial de palavras-chave (ex: o personagem diz *"Temos que encontrar a chave"* e o sistema marca a tarefa *"Apresentar chave"* como feita). A validação final baseada em prompt zero-shot do LLM local é essencial para confirmar a ação real da cena (Narrative Goal Tracking, 2025).

**Métricas de sucesso sugeridas:**
- Acurácia geral de detecção automática de conclusão de metas (alvo $\ge 85\%$).

**Requisito(s) do projeto relacionado(s):** RF-108 (atualizar wiki), RF-194 (quadro de progresso).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `design-de-quadro-kanban-para-escrita-criativa`

**Temática de origem:** Gestão de projetos e task-driven development (Tese 12)
**Objetivo:** Adaptar interfaces ágeis de acompanhamento de tarefas (Scrum/Kanban) para a ergonomia mental e fluxo de foco de romancistas e coautores.
**Quando usar (triggers):** Design de painéis de produtividade, desenvolvimento de dashboards de progresso e interfaces de coautoria.
**Fundamentação científica:** Cognitive Writing Process (2024), StoryPlanner (2024), Cognitive Load in AI Writing (2025), Creative Task Planning (2026).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Layout Simples de 4 Colunas:** Projetar colunas Kanban intuitivas: *Backlog* (ideias), *A Escrever* (próximos capítulos/cenas), *Escrevendo* (cena atual), *Escrito* (cenas completas).
2. **Visualização por Personagem/Locação:** Incorporar filtros que destaquem as metas por personagem ou por locação ativa (ex: ver todas as tarefas pendentes de *Mariana* na *Biblioteca*).
3. **Sinalização Visual Não Intrusiva:** Exibir badges discretos de status nas tarefas (Cinza para pendente, Verde para concluída automaticamente por NLP, Vermelho para inconsistente com dependências quebradas).
4. **Resolução de Desvios na UI:** Fornecer opções em cartões inconsistentes: (a) reescrever trecho (ativando o StyleGuard-PT); ou (b) quebrar a dependência e reorganizar as arestas de dependência no GMN.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Interrupção de Fluxo de Foco (Flow Interruption):** Forçar alertas pop-ups intrusivos na tela quando uma inconsistência é detectada interrompe a escrita. Toda sinalização de desvio estrutural deve ser inserida silenciosamente na sidebar, permitindo ao autor tratar a falha no momento ideal de pausa sem interrupções ativas (Cognitive Load in AI Writing, 2025).

**Métricas de sucesso sugeridas:**
- Score de usabilidade medido via escala SUS (alvo $\ge 80$).

**Requisito(s) do projeto relacionado(s):** RF-196 (cronograma de escrita).

**Nível de maturidade da técnica:** Consolidada.
