### Caso de Uso: Vincular tarefas/sprints a objetivos estratégicos

**ID:** UC-347  
**Requisito relacionado:** RF-346 (vincular tarefas/sprints a objetivos estratégicos)  
**Ator(es):** Gestor/Líder de Equipe, Sistema  
**Pré-condições:** OKRs cadastradas e tarefas ou sprints existentes no backlog.  
**Gatilho:** O gestor edita uma tarefa ou configura o escopo de uma Sprint.  

**Fluxo principal:**
1. O gestor acessa o quadro Kanban do projeto e seleciona a tarefa desejada.
2. O gestor clica no menu de propriedades da tarefa e localiza a opção "Objetivos Estratégicos (OKR)".
3. O sistema exibe a lista de KRs ativas.
4. O gestor seleciona a KR correspondente.
5. O gestor clica em "Vincular".
6. O sistema grava a relação na tabela correspondente.
7. O card da tarefa exibe o selo com o código da KR, e o painel estratégico passa a listar a tarefa como iniciativa operacional de apoio ao objetivo.

**Fluxos alternativos:**
- *Vincular Sprint completa:* O gestor associa a Sprint inteira a um Objetivo. O progresso de conclusão das tarefas daquela sprint atualiza proporcionalmente a barra de progresso do objetivo estratégico.

**Fluxos de exceção:**
- *OKR concluída:* Se a OKR correspondente já estiver arquivada ou vencida, o sistema impede novos vínculos de tarefas operacionais ativas.

**Pós-condições:** O vínculo referencial entre a tarefa/sprint operacional e o KR estratégico é salvo na base de dados.

**Critérios de aceite:**
- [ ] O progresso percentual da KR deve ser recalculado no banco toda vez que uma tarefa vinculada a ela for concluída.
- [ ] A gravação do vínculo deve demorar menos de 150ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
