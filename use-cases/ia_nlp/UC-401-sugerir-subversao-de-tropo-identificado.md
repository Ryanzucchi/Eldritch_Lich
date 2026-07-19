### Caso de Uso: Sugerir subversão de tropo identificado

**ID:** UC-401  
**Requisito relacionado:** RF-396 (sugerir subversão de tropo identificado)  
**Ator(es):** Sistema, IA, Usuário (Escritor)  
**Pré-condições:** Cenas ou manuscritos contendo tropos (clichês literários) identificados.  
**Gatilho:** O usuário clica em "Subverter Tropos" no painel de tropos da cena.  

**Fluxo principal:**
1. O usuário acessa a aba de tropos de uma cena correspondente.
2. O usuário seleciona o clichê literário detectado (ex: "O Mentor Sábio que morre no final").
3. O usuário clica no botão "Sugerir Subversão".
4. O backend aciona a IA, que analisa a narrativa e gera 3 sugestões de quebra e subversão do clichê selecionado.
5. O sistema apresenta as sugestões na tela junto com análises do provável impacto dramático na história.
6. O usuário seleciona uma das ideias e a grava como nota de rascunho de enredo no projeto.

**Fluxos alternativos:**
- *Filtros de tom:* O usuário opta por filtrar as sugestões de subversões por tom (cômicas, trágicas, irônicas) no modal de configurações de IA.

**Fluxos de exceção:**
- *Falta de contexto:* Se a cena possuir poucas descrições e falas, a IA alerta sobre a escassez de dados, recomendando complementar o texto antes de tentar gerar subversões ricas.

**Pós-condições:** As ideias de subversão sugeridas são armazenadas nas notas do projeto.

**Critérios de aceite:**
- [ ] O processamento e geração de subversões pela IA devem durar menos de 4 segundos.
- [ ] A interface deve destacar de forma clara e visual as opções de quebras sugeridas.

**Prioridade:** Média  
**Complexidade estimada:** Média
