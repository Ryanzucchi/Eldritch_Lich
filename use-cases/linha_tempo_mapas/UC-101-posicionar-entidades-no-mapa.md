### Caso de Uso: Posicionar entidades no mapa

**ID:** UC-101  
**Requisito relacionado:** RF-101 (posicionar entidades no mapa)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O mapa geográfico está aberto e existem entidades de outros tipos (personagens, objetos, organizações) cadastradas.  
**Gatilho:** O usuário gerencia os elementos visuais sobre o mapa ativo.  

**Fluxo principal:**
1. O usuário abre o mapa geográfico e clica no modo "Posicionar Entidades".
2. O sistema exibe um painel lateral contendo a lista de entidades disponíveis no projeto.
3. O usuário seleciona e arrasta a entidade desejada até uma coordenada específica do mapa.
4. O sistema insere um marcador visual correspondente e abre um menu popover para associar uma timestamp de presença (data cronológica) para aquela entidade naquela coordenada.
5. O sistema grava a posição `(x, y)` e a data de posicionamento na base de dados.

**Fluxos alternativos:**
- *Mapear rota de viagem:* O usuário posiciona o mesmo personagem em múltiplos pontos do mapa com datas diferentes. O sistema liga esses pontos com uma linha contínua direcionada para simular a rota de viagem.

**Fluxos de exceção:**
- *Data inválida:* Se o usuário tentar posicionar a entidade com uma data de presença anterior ao seu nascimento ou criação, o sistema exibe um aviso: "Atenção: O personagem não existia nesta data".

**Pós-condições:** As entidades e seus históricos de posicionamento/movimentação no mapa são salvos.

**Critérios de aceite:**
- [ ] A interface do mapa deve permitir ocultar ou exibir entidades no mapa usando filtros de tempo ou filtros de tipo.
- [ ] O banco de dados de posições deve suportar coordenadas percentuais em relação à imagem do mapa.

**Prioridade:** Média  
**Complexidade estimada:** Alta
