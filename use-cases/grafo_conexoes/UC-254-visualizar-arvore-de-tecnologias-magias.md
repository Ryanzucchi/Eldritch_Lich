### Caso de Uso: Visualizar árvore de tecnologias/magias (grafo de progresso)

**ID:** UC-254  
**Requisito relacionado:** RF-254 (visualizar árvore de tecnologias/magias)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Árvore de tecnologias/magias cadastrada e estruturada.  
**Gatilho:** O usuário abre o painel "Visualizar Árvores de Conhecimento".  

**Fluxo principal:**
1. O usuário acessa o menu do atlas e seleciona "Árvores de Tecnologias / Magias".
2. O sistema exibe a listagem de árvores. O usuário escolhe a árvore desejada (ex: "Sistema de Alquimia").
3. O sistema busca no banco as tecnologias e dependências de Alquimia.
4. A interface renderiza o grafo direcionado e interativo na tela, conectando os nós com linhas e setas de dependência.
5. O usuário clica sobre o nó "Transmutação de Metais" no canvas.
6. O sistema exibe um painel lateral contendo a ficha técnica do nó, regras de aplicação e a lista de personagens e facções que possuem essa habilidade.

**Fluxos alternativos:**
- *Layout Estático:* Se a física de auto-organização dos nós do grafo engasgar na tela, o usuário clica em "Layout Estático" para desativar a física dinâmica e exibir o grafo como grade fixa.

**Fluxos de exceção:**
- *Grafo sem nós:* Se a árvore estiver vazia, exibe a notificação "Nenhuma tecnologia cadastrada nesta árvore".

**Pós-condições:** O grafo da árvore de tecnologias/magias é exibido de forma interativa.

**Critérios de aceite:**
- [ ] A renderização física dos nós deve ser executada em menos de 1 segundo utilizando aceleração de hardware leve.
- [ ] A interface deve destacar visualmente com cores diferenciadas os nós que são pré-requisitos críticos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
