### Caso de Uso: Visualizar tensão/ritmo dramático da história (gráfico)

**ID:** UC-398  
**Requisito relacionado:** RF-397 (visualizar tensão/ritmo dramático da história)  
**Ator(es):** Usuário (Escritor/Roteirista), Sistema  
**Pré-condições:** Cenas cadastradas e alocadas na ordem cronológica de leitura da história.  
**Gatilho:** O usuário acessa o painel de visualização de "Ritmo Dramático" do projeto.  

**Fluxo principal:**
1. O usuário abre o painel "Ritmo e Tensão".
2. O sistema busca todas as cenas ordenadas da história.
3. Para cada cena, o sistema lê o nível de tensão (escala de 1 a 10) que o usuário preencheu nas propriedades.
4. O sistema renderiza na tela um gráfico de linha interativo contendo a sequência de cenas no eixo X e o nível de tensão dramática no eixo Y (1=Calmaria, 10=Clímax).
5. O usuário visualiza as cristas de onda de tensão (confrontos) e vales (diálogos e calmaria).
6. O usuário clica em qualquer nó do gráfico de linha para abrir a cena correspondente no editor lateral.

**Fluxos alternativos:**
- *Cálculo por IA:* O usuário clica em "Análise de Sentimento por IA". A IA calcula automaticamente o score de tensão e plota uma curva computacional na tela para comparação analítica com a curva manual.

**Fluxos de exceção:**
- *Cenas sem valor:* O sistema assume valor padrão de tensão de nível 5 para as cenas em branco, exibindo uma linha tracejada e sinalizando para o preenchimento.

**Pós-condições:** A curva gráfica de andamento do ritmo e tensão da narrativa é exibida na tela.

**Critérios de aceite:**
- [ ] O gráfico de ritmo dramático deve se adaptar de imediato a alterações de ordem de cenas efetuadas pelo usuário na linha do tempo.
- [ ] O cálculo semântico de tensão por IA para até 30 cenas deve demorar menos de 5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
