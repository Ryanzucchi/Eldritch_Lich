# 4 METODOLOGIA CIENTÍFICA E PROTOCOLO EXPERIMENTAL

## 4.1 Método de Pesquisa (DSR)

Esta tese utiliza a metodologia de **Design Science Research (DSR)** como orientadora do ciclo de vida da pesquisa. O principal objetivo é o design, a especificação formal, a implementação de software e a validação do framework de produtividade e gestão **TaskWriter-PT**.

## 4.2 Definição Formal do Grafo de Metas Narrativas (GMN)

O planejamento estrutural de um romance sob o framework TaskWriter-PT é representado matematicamente como um Grafo de Metas Narrativas (GMN), definido como um grafo direcionado acíclico (DAG) enriquecido:
$$G = (V, E, W)$$
onde:
*   $V$ é o conjunto de nós de meta narrativa $v_i$. Cada nó $v_i$ possui um estado $S(v_i) \in \{PENDENTE, EM\_ANDAMENTO, CONCLUIDO, INCONSISTENTE\}$.
*   $E$ é o conjunto de arestas direcionadas $(v_i, v_j)$ que representam restrições de precedência causal e temporal (a meta $v_i$ deve ser concluída antes que $v_j$ possa ser iniciada).
*   $W$ é o conjunto de metadados associados a cada nó (definição da meta, personagens exigidos, locais de ocorrência, threshold de semelhança semântica de conclusão $\tau_i$, e trechos textuais associados).

A propagação de estado no grafo obedece a regras de dependência estritas. Se o estado de um nó ancestral $v_a$ é alterado pelo autor para *INCONSISTENTE* devido a um desvio na escrita, todos os nós descendentes $v_d$ que possuam dependência causal direta $(v_a, v_d) \in E$ mudam automaticamente de estado para *INCONSISTENTE*, alertando o escritor sobre a necessidade de correção de enredo nas cenas posteriores.

## 4.3 Protocolo de Avaliação Empírica com Escritores Humanos

A validação prática do framework TaskWriter-PT foi conduzida por meio de um estudo experimental controlado com 45 participantes de diferentes perfis:

### 4.3.1 Seleção dos Participantes
*   **Escritores Iniciantes (20 participantes):** Indivíduos com interesse em escrita que nunca publicaram ou concluíram um manuscrito longo.
*   **Escritores Intermediários (15 participantes):** Escritores com manuscritos curtos concluídos ou romances incompletos.
*   **Escritores Profissionais (10 participantes):** Autores com pelo menos 1 romance publicado e experiência comercial na área.

### 4.3.2 Desenho do Experimento (Crossover Study)
Os 45 participantes foram divididos em dois grupos e submetidos a duas tarefas de escrita de 90 minutos de duração cada:
*   **Tarefa A (Controle):** Redação de um capítulo de romance utilizando um editor de texto tradicional (Markdown simples com outline em documento separado).
*   **Tarefa B (Experimental):** Redação de um capítulo utilizando a interface TaskWriter-PT (editor de texto com GMN dinâmico visível na sidebar e assistente inteligente ativo).

A fim de mitigar efeitos de aprendizado e cansaço, a ordem das tarefas foi contrabalançada entre os participantes (Grupo 1 realizou Tarefa A depois B; Grupo 2 realizou Tarefa B depois A).

### 4.3.3 Coleta de Dados e Métricas
1.  **Velocidade de Escrita ($V_{escrita}$):** Total de palavras geradas divididas pelo tempo ativo de escrita (palavras/hora).
2.  **Frequência de Bloqueio Criativo ($F_{bloqueio}$):** Frequência de pausas silenciosas de digitação superiores a 60 segundos durante a redação.
3.  **Duração Média de Bloqueio ($D_{bloqueio}$):** Tempo médio das pausas identificadas de bloqueio criativo.
4.  **Percepção de Usabilidade e Flow:** Questionário System Usability Scale (SUS) aplicado após a sessão experimental, acompanhado por questionário de Likert focado em medir o impacto percebido na criatividade e na sensação de autoria (agência literária).
