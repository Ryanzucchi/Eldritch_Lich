### Caso de Uso: Fixar mensagens importantes no chat

**ID:** UC-218  
**Requisito relacionado:** RF-218 (fixar mensagens importantes no chat)  
**Ator(es):** Usuário (Colaborador), Sistema  
**Pré-condições:** Mensagens de chat existem no canal ativo.  
**Gatilho:** O usuário abre o menu de contexto de uma mensagem e seleciona "Fixar Mensagem".  

**Fluxo principal:**
1. O usuário passa o cursor sobre a mensagem que deseja destacar.
2. O usuário clica no ícone de opções flutuantes e seleciona "Fixar Mensagem".
3. O sistema altera o status do atributo `fixada` para `true` no banco de dados.
4. O sistema insere a mensagem na gaveta de "Mensagens Fixadas" no cabeçalho do canal.
5. O sistema renderiza um ícone de pino ao lado da mensagem original.
6. Qualquer usuário do canal pode clicar no atalho de mensagens fixadas no topo para visualizar os termos ancorados.

**Fluxos alternativos:**
- *Desafixar mensagem:* O usuário abre a gaveta de fixados e clica em desafixar, retornando o status da mensagem ao normal.

**Fluxos de exceção:**
- *Acesso ao link excluído:* Se a mensagem fixada contiver um link para uma ficha que foi apagada, a mensagem continua fixada, mas o link de destino passa a exibir erro ao ser clicado.

**Pós-condições:** A mensagem fica ancorada na seção de referências do canal de chat correspondente.

**Critérios de aceite:**
- [ ] Clicar sobre uma mensagem fixada na gaveta deve fazer a rolagem da tela do chat focar automaticamente na posição original em que a mensagem foi enviada.
- [ ] A interface de fixação deve atualizar a tela dos membros em menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
