### Caso de Uso: Detectar e propagar inconsistências no GMN

**ID:** UC-455  
**Requisito relacionado:** RF-194 (quadro de progresso), RF-196 (cronograma de escrita)  
**Ator(es):** Sistema, Usuário (Escritor)  
**Pré-condições:** O GMN possui nós e arestas de dependência causal salvos. O usuário está ativamente editando o manuscrito ou alterando o estado de um nó de meta ancestral.  
**Gatilho:** O estado de uma meta ancestral $v_a$ muda para `INCONSISTENTE` (devido a desvios detectados pelo editor/MMS) ou é desfeito para `PENDENTE` pelo usuário após já ter sido concluído.  

**Fluxo principal:**
1. O sistema intercepta a mudança de estado do nó ancestral $v_a$ para `INCONSISTENTE` ou `PENDENTE`.
2. O motor do grafo dispara um algoritmo de travessia (ex: Busca em Largura - BFS) a partir de $v_a$.
3. Para cada nó descendente $v_d$ que possua dependência direta ou indireta de precedência de $v_a$, o sistema altera seu estado para `INCONSISTENTE`.
4. O sistema localiza todos os cartões correspondentes a esses nós descendentes no quadro Kanban e atualiza seus badges visuais com a sinalização vermelha de inconsistência.
5. O sistema adiciona um alerta explicativo na barra lateral (sidebar) de forma silenciosa (ex: *"A alteração na Meta A impossibilitou a Meta B. Você precisa ajustar o texto ou atualizar o grafo"*).
6. O usuário visualiza o alerta na sidebar de forma não-intrusiva, sem interrupção de sua digitação ativa.

**Fluxos alternativos:**
- *Resolução de Inconsistência pelo Usuário:* O usuário clica no cartão inconsistente e seleciona "Ignorar Dependência". O sistema remove temporariamente a aresta de dependência correspondente no banco local e recalcula o estado dos descendentes, limpando as flags de inconsistência que foram resolvidas.

**Fluxos de exceção:**
- *Travamento de Grafo Grande:* Se o grafo contiver loops não detectados (devido a alguma corrupção de dados), o algoritmo limita o nível máximo de recursão para 50 iterações, cancela a travessia e loga o erro sem travar a interface do usuário.

**Pós-condições:** Todos os nós dependentes afetados têm seu status atualizado para `INCONSISTENTE` no banco local, e a sidebar de notificações reflete os alertas correspondentes de forma passiva.

**Critérios de aceite:**
- [ ] A propagação recursiva de inconsistência no grafo deve ocorrer em menos de 10ms.
- [ ] O alerta gerado deve ser exibido estritamente na barra lateral ou rodapé; nenhuma caixa de diálogo pop-up ou bloqueio de cursor de digitação é permitido.
- [ ] Caso a dependência quebrada seja reestabelecida (ex: o usuário reescreve a cena original atendendo à meta ancestral), o sistema deve limpar automaticamente o status `INCONSISTENTE` de toda a cadeia de descendentes que dependiam apenas dela.

**Prioridade:** Alta  
**Complexidade estimada:** Média
