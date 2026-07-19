### Caso de Uso: Rastrear pendências (action items) até conclusão

**ID:** UC-344  
**Requisito relacionado:** RF-343 (rastrear pendências até conclusão)  
**Ator(es):** Colaborador (Responsável), Gestor, Sistema  
**Pré-condições:** Pendências (action items) vinculadas a reuniões cadastradas.  
**Gatilho:** O usuário acessa o painel de "Minhas Pendências" no dashboard.  

**Fluxo principal:**
1. O colaborador acessa seu painel pessoal de tarefas.
2. O sistema busca no banco e exibe na aba correspondente todas as pendências de reuniões atribuídas a ele.
3. O colaborador seleciona o item desejado e clica em "Iniciar Trabalho".
4. O sistema altera o status da pendência para "Em Andamento".
5. Após concluir a tarefa correspondente, o colaborador clica na caixa de verificação de conclusão da pendência e confirma.
6. O sistema atualiza o status para "Concluído" no banco de dados e notifica o gestor da reunião de que a pendência foi sanada.

**Fluxos alternativos:**
- *Alerta de prazo:* Se a pendência ultrapassar o prazo estipulado na pauta de reunião sem conclusão, o sistema envia um e-mail de alerta para o colaborador e pinta o card da pendência em vermelho.

**Fluxos de exceção:**
- *Membro inativo:* Se o responsável pelo action item for desligado do sistema, o sistema altera o status da pendência para "Pendente de Atribuição" e alerta o gestor da reunião para reatribuí-la.

**Pós-condições:** O status de andamento e conclusão do action item é salvo no banco de dados.

**Critérios de aceite:**
- [ ] O sistema de rastreamento deve permitir filtros rápidos por data de vencimento e por prioridade.
- [ ] A atualização de status da pendência na base deve durar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
