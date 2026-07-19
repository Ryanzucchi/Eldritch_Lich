### Caso de Uso: Notificar usuários sobre alterações relevantes

**ID:** UC-134  
**Requisito relacionado:** RF-134 (notificar usuários sobre alterações relevantes)  
**Ator(es):** Sistema, Usuário (Destinatário)  
**Pré-condições:** O usuário está cadastrado no projeto e possui preferências de notificação ativas.  
**Gatilho:** Ocorre um evento relevante no projeto (ex: comentário resolvido, nova contradição grave detectada ou alteração no status de um evento).  

**Fluxo principal:**
1. O sistema detecta o evento relevante (ex: o Colaborador A resolveu um comentário em que o Colaborador B foi mencionado).
2. O sistema gera um registro de notificação contendo o remetente, destinatário, tipo do evento e mensagem.
3. Se o destinatário estiver online no sistema (WebSocket ativo), a notificação é exibida em tempo real como um banner no canto da tela.
4. Se o usuário estiver offline, a notificação é mantida no banco de dados com status de não lida e exibida no painel de notificações na próxima sessão.

**Fluxos alternativos:**
- *E-mail:* De acordo com as preferências do perfil, o sistema envia adicionalmente um e-mail transacional relatando o resumo das atividades.

**Fluxos de exceção:**
- *Falha de envio do e-mail:* O sistema registra a falha na tabela de logs de e-mails, mas mantém a notificação interna intacta na conta do usuário.

**Pós-condições:** A notificação é registrada e entregue ao usuário destinatário.

**Critérios de aceite:**
- [ ] O envio do toast em tempo real para usuários online deve ocorrer em até 500ms após o evento gerador.
- [ ] A interface do painel de notificações deve permitir "Marcar todas como lidas" com um único clique.

**Prioridade:** Alta  
**Complexidade estimada:** Média
