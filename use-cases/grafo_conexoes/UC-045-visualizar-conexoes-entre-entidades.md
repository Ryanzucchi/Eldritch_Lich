### Caso de Uso: Visualizar conexões entre entidades

**ID:** UC-045  
**Requisito relacionado:** RF-45 (visualizar conexões entre entidades)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem entidades cadastradas e conectadas no projeto.  
**Gatilho:** O usuário clica na aba "Grafo de Entidades" ou seleciona "Ver Conexões" na ficha de uma entidade.  

**Fluxo principal:**
1. O usuário acessa a tela do Grafo de Entidades.
2. O sistema lê todas as entidades (nós) e seus relacionamentos (arestas) no banco de dados.
3. O sistema renderiza um canvas 2D/3D interativo utilizando uma biblioteca gráfica (ex: D3.js) com algoritmo de layout direcionado por forças.
4. O usuário visualiza as entidades representadas como círculos (com ícones/fotos) e as conexões representadas como linhas rotuladas conectando os círculos.
5. O usuário interage com o gráfico (zoom, pan, arrasta nós).

**Fluxos alternativos:**
- *Foco em entidade específica:* O usuário clica em "Isolar Entidade" na ficha de um personagem, fazendo com que o grafo exiba apenas aquela entidade e suas conexões diretas (grafo de 1 grau de separação).

**Fluxos de exceção:**
- *Excesso de nós:* Se o projeto tiver mais de 500 entidades, o sistema inicializa o grafo com as conexões principais colapsadas e exibe um alerta sugerindo aplicar filtros para melhor desempenho.

**Pós-condições:** A representação interativa das conexões do universo é apresentada na tela.

**Critérios de aceite:**
- [ ] A renderização inicial do grafo deve ser concluída em menos de 1,5 segundos para projetos de até 200 entidades.
- [ ] O canvas de visualização deve suportar interações de zoom e movimentação dos nós.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
