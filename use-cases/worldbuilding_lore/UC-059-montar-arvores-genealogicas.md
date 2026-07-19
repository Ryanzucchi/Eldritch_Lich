### Caso de Uso: Montar árvores genealógicas

**ID:** UC-059  
**Requisito relacionado:** RF-59 (montar árvores genealógicas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens cadastrados na base de entidades do projeto.  
**Gatilho:** O usuário clica em "Montar Árvore Genealógica" na aba de personagens ou ferramentas.  

**Fluxo principal:**
1. O usuário acessa a tela de "Árvores Genealógicas".
2. O usuário clica em "Nova Árvore" e define um título (ex: "Dinastia Targaryen").
3. O sistema abre um canvas de árvore genealógica vazio.
4. O usuário arrasta personagens cadastrados do painel lateral para o canvas.
5. O usuário desenha conexões de parentesco entre eles clicando nos nós e selecionando a relação (ex: "Cônjuge", "Filho de").
6. O sistema renderiza a árvore estruturada com layouts genealógicos automáticos.

**Fluxos alternativos:**
- *Remover de árvore:* O usuário clica em um nó e seleciona "Remover da árvore", apenas retirando-o da visualização específica sem excluí-lo da base de personagens.

**Fluxos de exceção:**
- *Relações biológicas impossíveis:* Se o usuário tentar definir um personagem como filho de si mesmo ou criar ciclos impossíveis, o sistema exibe "Relação genealógica inválida detectada" e bloqueia a conexão.

**Pós-condições:** A árvore genealógica é gerada e salva nas propriedades do projeto.

**Critérios de aceite:**
- [ ] O layout genealógico deve ser gerado automaticamente pela interface para manter o alinhamento visual correto dos níveis de gerações.
- [ ] A árvore genealógica deve ser exportável como imagem (.png ou .svg).

**Prioridade:** Média  
**Complexidade estimada:** Alta
