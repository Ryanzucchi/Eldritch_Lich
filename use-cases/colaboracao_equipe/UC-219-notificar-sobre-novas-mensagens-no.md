### Caso de Uso: Notificar sobre novas mensagens no chat

**ID:** UC-219  
**Requisito relacionado:** RF-219 (notificar sobre novas mensagens no chat)  
**Ator(es):** Sistema, Usuário (Colaborador)  
**Pré-condições:** O usuário faz parte do projeto colaborativo e o chat está fechado na sua tela.  
**Gatilho:** Envio de uma nova mensagem no chat por parte de outro colaborador.  

**Fluxo principal:**
1. O Colaborador A envia uma mensagem no chat do projeto.
2. O sistema detecta a chegada da mensagem.
3. Se o Colaborador B estiver com o projeto aberto mas com a aba de chat recolhida, o sistema incrementa um badge vermelho no ícone de chat.
4. O sistema toca um aviso sonoro discreto de mensagem recebida se a opção de áudio estiver ativa nas preferências.
5. Se o Colaborador B estiver com o navegador minimizado, o sistema dispara uma notificação push desktop contendo o trecho da mensagem.

**Fluxos alternativos:**
- *Notificação apenas para menções:* O usuário configura a conta para ser notificado por push apenas em caso de menção direta ao seu nome (@Nome).

**Fluxos de exceção:**
- *Mensagem própria:* O sistema ignora o alerta de notificação sonora e o badge visual para o usuário que enviou a própria mensagem.

**Pós-condições:** Os badges e alertas de novas mensagens de chat pendentes são exibidos ao destinatário.

**Critérios de aceite:**
- [ ] O badge numérico indicador deve atualizar instantaneamente ao ler a mensagem ou abrir o painel correspondente.
- [ ] O tempo de processamento do alerta local deve ser inferior a 100ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
