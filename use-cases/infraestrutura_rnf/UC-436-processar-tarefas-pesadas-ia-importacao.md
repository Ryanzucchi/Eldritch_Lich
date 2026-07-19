### Caso de Uso: Processar tarefas pesadas (IA, importação em lote) de forma assíncrona sem travar a interface (RNF)

**ID:** UC-436  
**Requisito relacionado:** RNF-High-12 (processar tarefas pesadas assincronamente)  
**Ator(es):** Sistema (Fila de Tarefas / Workers em Background)  
**Pré-condições:** Infraestrutura de fila de mensagens e processos workers de segundo plano ativos.  
**Gatilho:** O usuário solicita uma ação de alto custo computacional na interface.  

**Fluxo principal:**
1. O usuário clica em "Importar Planilha de Funcionários (CSV)" contendo centenas de registros.
2. O backend recebe o arquivo, coloca a tarefa de importação em uma Fila de Processamento em Background e responde instantaneamente ao cliente confirmando o recebimento da planilha.
3. A interface do usuário é liberada de imediato na tela, permitindo que ele continue navegando e usando a plataforma normalmente.
4. Um processo Worker em background consome a tarefa da fila de forma isolada, processando os dados em segundo plano.
5. Ao concluir, o Worker envia uma notificação push via WebSocket para a interface do usuário correspondente informando a conclusão.

**Fluxos alternativos:**
- *Cancelamento:* O usuário acessa a tela de status de processamento e clica em "Cancelar Importação". O sistema interrompe o worker correspondente e limpa os registros parciais inseridos para integridade.

**Fluxos de exceção:**
- *Queda do Worker:* Se o processo do worker morrer durante a execução de uma tarefa, a tarefa permanece na fila marcada com falha, permitindo que outro worker a execute a partir do último checkpoint.

**Pós-condições:** O processamento pesado é executado de forma assíncrona sem gerar travamento de interface ou lentidão nas requisições normais da API.

**Critérios de aceite:**
- [ ] A resposta da API confirmando a inserção da tarefa na fila para o cliente deve durar menos de 200ms.
- [ ] O processamento em background não deve elevar o consumo de CPU da máquina da API principal acima de 40% (isolamento de processos de CPU).

**Prioridade:** Alta  
**Complexidade estimada:** Alta
