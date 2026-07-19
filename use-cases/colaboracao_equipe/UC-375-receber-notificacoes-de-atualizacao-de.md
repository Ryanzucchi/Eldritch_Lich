### Caso de Uso: Receber notificações de atualização de tarefas no chat

**ID:** UC-375  
**Requisito relacionado:** RF-374 (receber notificações de atualização de tarefas no chat)  
**Ator(es):** Sistema, Integrantes do Canal, Colaborador (Executor)  
**Pré-condições:** Canal de chat ativo configurado para receber notificações do Kanban do projeto.  
**Gatilho:** Uma tarefa sofre alteração de status ou responsável no quadro Kanban.  

**Fluxo principal:**
1. O colaborador correspondente move a tarefa para a coluna "Concluído" no Kanban.
2. O backend intercepta o evento de alteração de status da tarefa.
3. O sistema formata uma mensagem de notificação rica detalhando o autor, a alteração e o título do item.
4. O sistema insere a mensagem gerada pelo bot de integração no feed do canal de chat configurado.
5. Os membros do canal visualizam a atualização instantaneamente no chat.

**Fluxos alternativos:**
- *Notificação de estouro de prazo:* Se a data limite de uma tarefa expirar sem entrega, o sistema posta automaticamente um alerta no chat notificando os gestores do projeto.

**Fluxos de exceção:**
- *Canal inativo/excluído:* Se o canal configurado para logs for removido, o sistema desativa a publicação de eventos em background e redireciona os logs gerais para o painel de notificações pessoal de cada membro.

**Pós-condições:** A notificação da atividade é publicada na timeline do chat de equipe.

**Critérios de aceite:**
- [ ] A publicação do log de notificação no chat deve ocorrer em menos de 500ms após a movimentação da tarefa no Kanban.
- [ ] A notificação de atualização deve agrupar alterações semelhantes do mesmo período para evitar spam de mensagens no chat.

**Prioridade:** Média  
**Complexidade estimada:** Média
