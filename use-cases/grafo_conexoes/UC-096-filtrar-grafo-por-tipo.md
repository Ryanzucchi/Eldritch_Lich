### Caso de Uso: Filtrar grafo por tipo

**ID:** UC-096  
**Requisito relacionado:** RF-96 (filtrar grafo por tipo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A visualização em grafo está aberta.  
**Gatilho:** O usuário clica na legenda do grafo ou no painel de filtros rápidos por tipo de nó/aresta.  

**Fluxo principal:**
1. O usuário visualiza o Grafo de Entidades na tela.
2. O usuário abre o painel de filtros laterais e desmarca a caixa "Locais" e "Objetos", mantendo apenas "Personagens" ativa.
3. O sistema oculta instantaneamente do canvas todos os nós do tipo Local e Objeto, bem como as arestas que dependiam deles.
4. O canvas de visualização realiza um rearranjo físico dinâmico dos nós remanescentes (Personagens) para otimizar o espaço visual.
5. O usuário visualiza apenas a rede de personagens do universo.

**Fluxos alternativos:**
- *Filtrar por tipo de relacionamento:* O usuário filtra as arestas para exibir apenas conexões do tipo "Aliado", ocultando as linhas de "Inimigo" e parentesco.

**Fluxos de exceção:**
- *Desmarcar todos os tipos:* Se o usuário desmarcar todos os tipos, o canvas fica vazio e exibe a mensagem de aviso "Nenhum tipo de nó selecionado para exibição".

**Pós-condições:** O grafo renderiza apenas os nós e conexões correspondentes aos filtros de tipo ativos.

**Critérios de aceite:**
- [ ] A ocultação dos nós na tela deve ocorrer em menos de 100ms através da manipulação de visibilidade CSS/Canvas.
- [ ] O estado dos filtros de tipo deve ser salvo para o usuário ao fechar e reabrir a visualização do grafo na mesma sessão.

**Prioridade:** Alta  
**Complexidade estimada:** Média
