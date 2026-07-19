### Caso de Uso: Enviar mensagens de texto (chat)

**ID:** UC-361  
**Requisito relacionado:** RF-360 (enviar mensagens de texto (chat))  
**Ator(es):** Colaborador, Sistema  
**Pré-condições:** O colaborador está associado a um canal de chat ativo ou iniciou uma conversa direta (DM).  
**Gatilho:** O colaborador digita uma mensagem no campo de chat e pressiona Enter.  

**Fluxo principal:**
1. O colaborador abre a aba de chat do canal correspondente.
2. O colaborador digita a mensagem no input inferior da tela (ex: "Olá equipe, fiz o commit das correções").
3. O colaborador pressiona Enter ou clica no botão de envio.
4. O sistema valida que a mensagem possui conteúdo legível válido.
5. O sistema grava a mensagem na tabela correspondente e envia os dados de forma instantânea para todos os membros conectados via WebSockets.
6. A interface dos demais colaboradores conectados no canal renderiza a nova mensagem imediatamente.

**Fluxos alternativos:**
- *Mencionar usuário (@mention):* O usuário digita `@` seguido do nome do colega. O sistema exibe autocomplete de membros. Ao selecionar, insere um link visual para o perfil e dispara uma notificação push de alta prioridade para o mencionado.

**Fluxos de exceção:**
- *Queda de conexão:* Se a mensagem falhar no envio por instabilidade de rede, o sistema sinaliza a mensagem com um ícone de alerta vermelho ("Falha ao enviar") e disponibiliza a opção de reenvio.

**Pós-condições:** A mensagem é gravada no banco de dados e disponibilizada na timeline do chat.

**Critérios de aceite:**
- [ ] A velocidade de entrega de mensagens de texto corrido deve ser de no máximo 200ms entre os clientes conectados.
- [ ] A interface deve reter as últimas 100 mensagens em cache local do navegador para rolagem rápida.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
