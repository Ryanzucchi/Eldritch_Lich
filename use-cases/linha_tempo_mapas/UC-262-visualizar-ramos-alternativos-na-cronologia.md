### Caso de Uso: Visualizar ramos alternativos na cronologia (paralelas)

**ID:** UC-262  
**Requisito relacionado:** RF-262 (visualizar ramos alternativos na cronologia)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui eventos com múltiplos finais ou timelines paralelas ativas.  
**Gatilho:** O usuário clica em "Visualização de Ramos Cronológicos" no painel da Timeline.  

**Fluxo principal:**
1. O usuário acessa a aba "Cronologias do Projeto".
2. O usuário clica em "Modo Grafo Temporal / Multiverso".
3. O sistema busca todas as timelines cadastradas e os eventos de bifurcação correspondentes.
4. O sistema renderiza na tela uma árvore de timelines paralelas, mostrando a linha do tempo principal como tronco central e as linhas alternativas saindo como ramos laterais a partir dos exatos eventos geradores de conflito.
5. O usuário visualiza as ramificações de causa e efeito do enredo de forma paralela.
6. O usuário clica em um ramo lateral para entrar e focar a navegação detalhada especificamente naquela linha alternativa.

**Fluxos alternativos:**
- *Ocultar ramos mortos:* O usuário filtra a visualização para esconder linhas temporais alternativas secundárias que não possuem capítulos de texto escritos associados.

**Fluxos de exceção:**
- *Falta de conexões de origem:* Se uma timeline paralela for criada sem evento de origem, ela é exibida flutuando separadamente na lateral como "Timeline Sem Vínculo de Origem".

**Pós-condições:** A árvore gráfica contendo a estrutura de linhas do tempo paralelas do universo é renderizada na tela.

**Critérios de aceite:**
- [ ] A representação dos caminhos deve usar linhas curvas que se bifurcam de forma visualmente nítida de acordo com os marcos cronológicos comuns.
- [ ] O tempo de cálculo do layout da árvore temporal deve ser inferior a 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Alta
