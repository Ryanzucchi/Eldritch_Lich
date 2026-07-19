### Caso de Uso: Enviar notificações por e-mail (comentários/menções)

**ID:** UC-229  
**Requisito relacionado:** RF-229 (enviar notificações por e-mail (comentários/menções))  
**Ator(es):** Sistema, Usuário (Destinatário)  
**Pré-condições:** O usuário destinatário possui e-mail cadastrado e ativou as notificações de menção em seu perfil.  
**Gatilho:** Outro colaborador responde ao comentário do usuário ou o menciona no projeto.  

**Fluxo principal:**
1. O Colaborador A escreve um comentário contendo uma menção a outro membro.
2. O sistema identifica a menção, localiza a conta do destinatário e checa se suas preferências de e-mail estão configuradas para envio imediato.
3. O sistema cria um e-mail com layout contendo: Nome do remetente, Foto do remetente, Trecho da mensagem, Nome do projeto, e Link de redirecionamento rápido.
4. O sistema enfileira o e-mail no servidor de e-mails transacionais da aplicação.
5. O e-mail é enviado e chega na caixa de entrada do usuário.

**Fluxos alternativos:**
- *Resumos periódicos:* Se o usuário configurou para resumos diários, o sistema apenas enfileira o log para a rotina do cron job enviar no horário agendado.

**Fluxos de exceção:**
- *Destinatário online:* Se o destinatário estiver online no projeto no exato momento e visualizar a notificação em tela, o sistema suspende o e-mail imediato para evitar spam.

**Pós-condições:** O e-mail notificando o usuário é gerado e despachado.

**Critérios de aceite:**
- [ ] O e-mail transacional deve ser enviado em até 2 minutos após o evento de menção/comentário.
- [ ] O e-mail deve conter o link de redirecionamento que abre o documento focado no comentário exato.

**Prioridade:** Alta  
**Complexidade estimada:** Média
