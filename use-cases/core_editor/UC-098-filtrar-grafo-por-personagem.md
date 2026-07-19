### Caso de Uso: Filtrar grafo por personagem

**ID:** UC-098  
**Requisito relacionado:** RF-98 (filtrar grafo por personagem)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A visualização em grafo está aberta.  
**Gatilho:** O usuário digita o nome de um personagem na caixa de foco ou clica em "Filtrar por esta entidade".  

**Fluxo principal:**
1. O usuário visualiza o grafo de entidades.
2. O usuário acessa a barra de pesquisa rápida do grafo e seleciona o personagem "Lorde Varis".
3. O sistema esmaece (reduz opacidade para 10%) todos os nós e arestas que não estão conectados diretamente a Varis.
4. O sistema mantém o nó de Lorde Varis e suas conexões imediatas (vizinhos de 1º grau) com 100% de brilho e destaque visual.
5. O usuário ajusta o filtro de grau para "2 graus" de separação, exibindo também os conhecidos dos conhecidos de Varis.

**Fluxos alternativos:**
- *Filtro de exclusão:* O usuário clica com o botão direito no nó de um personagem e seleciona "Ocultar do Grafo", fazendo com que ele suma temporariamente para despoluir a visualização.

**Fluxos de exceção:**
- *Personagem sem conexões:* Se o personagem selecionado for isolado, apenas ele é exibido com brilho total no canvas, e nenhuma conexão é mostrada.

**Pós-condições:** O grafo foca e destaca a rede de relacionamentos do personagem selecionado.

**Critérios de aceite:**
- [ ] A alteração do destaque e opacidade das entidades deve rodar em menos de 100ms.
- [ ] A interface deve permitir limpar o filtro com um único clique no botão "Limpar Foco".

**Prioridade:** Alta  
**Complexidade estimada:** Média
