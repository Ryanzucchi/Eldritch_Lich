### Caso de Uso: Visualizar árvore genealógica de personagens

**ID:** UC-172  
**Requisito relacionado:** RF-172 (visualizar árvore genealógica de personagens)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui personagens com vínculos familiares cadastrados.  
**Gatilho:** O usuário abre a ficha técnica de um personagem e clica em "Ver Árvore Genealógica".  

**Fluxo principal:**
1. O usuário acessa a ficha técnica de um personagem (ex: "Arthur").
2. O usuário clica na aba "Árvore Genealógica".
3. O sistema consulta as tabelas de relacionamentos familiares da base de dados.
4. A interface renderiza uma árvore genealógica gráfica com layout hierárquico (ascendentes acima, cônjuges ao lado e descendentes abaixo).
5. O usuário navega pela árvore aplicando arrasto e zoom no canvas.
6. O usuário clica no nome de qualquer membro familiar para abrir sua respectiva ficha técnica.

**Fluxos alternativos:**
- *Árvore Geral do Projeto:* O usuário clica em "Árvore Genealógica Geral" no menu e visualiza todas as dinastias do projeto simultaneamente no canvas.

**Fluxos de exceção:**
- *Nenhuma relação familiar:* Se o personagem não tiver parentes cadastrados, a tela exibe o card de Arthur isolado com a notificação: "Nenhum familiar vinculado".

**Pós-condições:** A árvore genealógica hierárquica do personagem é renderizada de forma interativa.

**Critérios de aceite:**
- [ ] O layout gráfico deve separar claramente gerações em linhas horizontais distintas.
- [ ] A renderização da árvore para uma dinastia de 30 personagens deve durar menos de 800ms.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
