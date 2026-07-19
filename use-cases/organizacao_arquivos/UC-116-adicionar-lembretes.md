### Caso de Uso: Adicionar lembretes

**ID:** UC-116  
**Requisito relacionado:** RF-116 (adicionar lembretes)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está trabalhando em um projeto e deseja agendar um lembrete.  
**Gatilho:** O usuário clica no ícone de "Lembrete" no cabeçalho ou menu de anotações.  

**Fluxo principal:**
1. O usuário clica em "Adicionar Lembrete".
2. O sistema abre um formulário solicitando: Texto do Lembrete, Data e Hora do alerta, e Grau de importância.
3. O usuário define os dados e clica em "Salvar Lembrete".
4. O sistema agenda o alerta na fila de tarefas.
5. Na data/hora configurada, o sistema dispara uma notificação visual na tela da aplicação (ou por e-mail, se configurado).

**Fluxos alternativos:**
- *Lembrete de texto:* O usuário adiciona o lembrete vinculado a um capítulo, fazendo com que a notificação futura contenha o link direto para abrir o arquivo de destino.

**Fluxos de exceção:**
- *Notificações bloqueadas:* Se o navegador bloquear as notificações em tela, o sistema exibe um aviso e envia o alerta por e-mail como fallback.

**Pós-condições:** O lembrete é agendado e a notificação correspondente é disparada no momento programado.

**Critérios de aceite:**
- [ ] A notificação interna no sistema deve persistir em uma aba de "Notificações Recentes" até que o usuário a marque como lida.
- [ ] O lembrete deve poder ser adiado (função snooze) ou cancelado.

**Prioridade:** Média  
**Complexidade estimada:** Média
