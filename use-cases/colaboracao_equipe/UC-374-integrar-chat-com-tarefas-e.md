### Caso de Uso: Integrar chat com tarefas e sprints

**ID:** UC-374  
**Requisito relacionado:** RF-373 (integrar chat com tarefas e sprints)  
**Ator(es):** Colaborador, Sistema  
**Pré-condições:** Módulos de chat e Kanban de tarefas ativos no mesmo projeto.  
**Gatilho:** O colaborador digita a referência de uma tarefa ou comando no chat.  

**Fluxo principal:**
1. O colaborador acessa o canal de chat correspondente.
2. Ele digita a referência contendo o ID da tarefa (ex: "Trabalhando na #TASK-105 agora") e envia.
3. O sistema reconhece a expressão e insere automaticamente um link interativo contendo o título da tarefa e seu status atual.
4. Ao passar o mouse sobre a tag gerada, o sistema exibe popover rápido contendo detalhes, responsável e prazo.

**Fluxos alternativos:**
- *Criação rápida por comandos:* O usuário digita `/todo Nova Tarefa` na caixa de chat. O chatbot integrado intercepta o comando e insere a nova tarefa diretamente no backlog Kanban do projeto.

**Fluxos de exceção:**
- *ID inválido:* Se o usuário digitar um ID de tarefa que não existe na base de dados, o sistema renderiza como texto comum sem converter em link ativo.

**Pós-condições:** O link dinâmico interativo entre a conversa do chat e a entidade de tarefa do backlog é exibido na tela.

**Critérios de aceite:**
- [ ] A renderização de metadados do popover ao passar o mouse deve carregar em menos de 200ms.
- [ ] O bot de comandos do chat (/todo, /task) deve reconhecer parâmetros de responsável e data limite.

**Prioridade:** Média  
**Complexidade estimada:** Alta
