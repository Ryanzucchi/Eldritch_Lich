### Caso de Uso: Vincular decisões de reunião a tarefas geradas

**ID:** UC-342  
**Requisito relacionado:** RF-341 (vincular decisões de reunião a tarefas geradas)  
**Ator(es):** Organizador da Reunião, Sistema  
**Pré-condições:** Ata de reunião sendo redigida e tarefas do projeto cadastradas.  
**Gatilho:** O organizador clica em "Gerar Tarefa a partir deste Item" na tela da ata.  

**Fluxo principal:**
1. O organizador edita a ata de reunião e destaca a decisão correspondente.
2. O organizador clica no botão "Criar Tarefa Vinculada" ao lado do item destacado.
3. O sistema abre a modal de criação rápida de tarefas, preenchendo o título da tarefa com o texto da decisão.
4. O organizador atribui o executor, prazo de entrega e confirma.
5. O sistema grava o relacionamento e insere o link da tarefa na ata, exibindo uma tag contendo ID e status do item (ex: `[TASK-84: Em aberto]`).

**Fluxos alternativos:**
- *Vincular a tarefa existente:* O organizador digita a chave `#` e seleciona uma tarefa preexistente para ligar àquela decisão.

**Fluxos de exceção:**
- *Tarefa excluída:* Se a tarefa criada for deletada posteriormente, a tag correspondente na ata muda para "Tarefa Excluída", mantendo o histórico descritivo da ata intacto.

**Pós-condições:** O link referencial entre a decisão documentada na ata e a tarefa operacional do backlog é salvo na base de dados.

**Critérios de aceite:**
- [ ] A tag da tarefa inserida na ata deve atualizar dinamicamente seu status visual conforme o andamento da tarefa.
- [ ] O tempo total de salvamento da associação deve ser de no máximo 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
