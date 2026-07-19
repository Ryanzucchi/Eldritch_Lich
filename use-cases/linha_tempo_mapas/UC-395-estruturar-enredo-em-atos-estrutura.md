### Caso de Uso: Estruturar enredo em atos (estrutura de 3 atos, etc.)

**ID:** UC-395  
**Requisito relacionado:** RF-394 (estruturar enredo em atos)  
**Ator(es):** Usuário (Escritor/Roteirista), Sistema  
**Pré-condições:** Projeto literário ou de roteiro ativo.  
**Gatilho:** O usuário acessa a aba de arquitetura da história.  

**Fluxo principal:**
1. O usuário abre o painel "Estrutura do Enredo".
2. O usuário seleciona o modelo de estrutura desejado (ex: "Estrutura clássica de 3 Atos").
3. O sistema cria visualmente na tela três seções verticais correspondentes (Ato I: Apresentação, Ato II: Confrontação, Ato III: Resolução).
4. O usuário arrasta os cards de cenas do projeto e solta nas respectivas caixas dos Atos correspondentes.
5. O usuário clica em "Salvar Estrutura".
6. O sistema grava a estrutura lógica e a ordem das cenas no banco de dados.

**Fluxos alternativos:**
- *Linha do tempo:* O usuário prefere preencher a ordem linear da história em uma linha do tempo horizontal gráfica, e o sistema distribui as cenas nos blocos de atos de forma paralela em background.

**Fluxos de exceção:**
- *Cenas desalocadas:* Cenas criadas que não foram associadas a nenhum ato são listadas em uma coluna lateral específica no painel para que o escritor as organize posteriormente.

**Pós-condições:** A divisão e alocação de cenas ao longo da estrutura de atos são salvas e persistidas.

**Critérios de aceite:**
- [ ] A interface de arrastar e soltar cenas entre os atos deve apresentar animação fluida (acima de 60fps) e visualização de resumos curtos dos cards.
- [ ] A gravação e o recálculo da ordem das cenas devem durar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
