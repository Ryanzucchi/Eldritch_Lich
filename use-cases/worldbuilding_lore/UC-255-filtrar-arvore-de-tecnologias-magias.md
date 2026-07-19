### Caso de Uso: Filtrar árvore de tecnologias/magias por personagem

**ID:** UC-255  
**Requisito relacionado:** RF-255 (filtrar árvore de tecnologias/magias por personagem)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A visualização em grafo da árvore está aberta e existem personagens associados a habilidades.  
**Gatilho:** O usuário seleciona o filtro de personagem na tela da árvore.  

**Fluxo principal:**
1. O usuário visualiza o Grafo Geral da Árvore de Magia na tela.
2. O usuário clica no botão de filtro "Personagens" e seleciona um personagem (ex: "Arthur").
3. O sistema processa e esmaece (reduz opacidade para 15%) todos os nós de feitiços que "Arthur" não conhece.
4. O sistema destaca com cores vibrantes apenas a trilha de feitiços que "Arthur" domina na árvore, permitindo ver de forma clara o seu progresso de aprendizado.

**Fluxos alternativos:**
- *Comparação de personagens:* O usuário seleciona dois personagens simultaneamente, colorindo a árvore com duas cores diferentes para comparar o repertório de habilidades de ambos de forma visual.

**Fluxos de exceção:**
- *Personagem sem habilidades:* Se o personagem selecionado não conhecer nenhum nó daquela árvore, o grafo é exibido inteiramente esmaecido com um aviso explicativo.

**Pós-condições:** O grafo da árvore destaca visualmente apenas o progresso do personagem selecionado.

**Critérios de aceite:**
- [ ] O processamento do destaque visual no canvas deve durar menos de 100ms.
- [ ] O painel lateral deve listar o total de progresso percentual do personagem na árvore.

**Prioridade:** Média  
**Complexidade estimada:** Alta
