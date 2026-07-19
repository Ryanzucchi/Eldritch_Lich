### Caso de Uso: Criar mapa de conhecimento pessoal (zettelkasten)

**ID:** UC-327  
**Requisito relacionado:** RF-326 (criar mapa de conhecimento pessoal)  
**Ator(es):** Usuário (Pesquisador/Escritor), Sistema  
**Pré-condições:** Notas atômicas e links bidirecionais cadastrados no projeto.  
**Gatilho:** O usuário clica na seção "Visualização de Gráfico" na barra lateral de notas.  

**Fluxo principal:**
1. O usuário acessa o menu lateral e clica em "Mapa de Conhecimento (Gráfico)".
2. O sistema busca todas as notas atômicas e suas conexões bidirecionais.
3. A interface renderiza na tela um gráfico bidimensional interativo (Force-directed Graph), onde cada nota é representada por um nó e os relacionamentos por linhas.
4. O usuário visualiza o aglomerado de ideias e as notas mais influentes (com tamanho de círculos maiores).
5. O usuário clica sobre uma nota e o sistema exibe seu conteúdo em janela popover de visualização rápida.

**Fluxos alternativos:**
- *Filtragem no gráfico:* O usuário usa a barra de pesquisa do gráfico para filtrar por tag ou termo, destacando no canvas apenas os nós que contêm a busca correspondente.

**Fluxos de exceção:**
- *Notas órfãs:* Notas que não possuem conexões são exibidas flutuando nas bordas do gráfico, permitindo ao usuário identificá-las para criar novos vínculos de ideias.

**Pós-condições:** O grafo interativo do mapa de conhecimento pessoal é renderizado de forma dinâmica.

**Critérios de aceite:**
- [ ] A renderização física das notas deve suportar aceleração de hardware leve para garantir navegação fluida em grafos com mais de 500 notas.
- [ ] O mapa do gráfico deve atualizar de imediato ao criar novas notas ou conexões.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
