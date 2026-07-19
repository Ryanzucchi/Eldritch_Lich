### Caso de Uso: Listar todas atividades feitas automaticamente pelo sistema

**ID:** UC-061  
**Requisito relacionado:** RF-61 (listar todas atividades feitas automaticamente pelo sistema)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O sistema realizou ações automáticas (como salvamentos, backups, sugestões de IA, extrações ou detecções) no projeto.  
**Gatilho:** O usuário abre a aba "Atividades Automáticas" ou "Log de IA/Sistema".  

**Fluxo principal:**
1. O usuário acessa a seção de configurações do projeto e clica em "Histórico de Atividades Automáticas".
2. O sistema recupera a lista de eventos gravados na tabela de logs de automação do banco de dados do projeto.
3. A interface apresenta uma tabela cronológica contendo: Data/Hora, Ação Realizada, Descrição Breve e Status do processo.
4. O usuário pode filtrar o histórico por tipo de atividade ou data.

**Fluxos alternativos:**
- *Desfazer ação automática:* Se a atividade for uma ação de escrita/organização automática da IA, o usuário pode clicar em "Desfazer" diretamente na linha do log correspondente.

**Fluxos de exceção:**
- *Sem atividades registradas:* Se for um projeto novo sem ações do sistema, o log exibe "Nenhuma atividade automática registrada".

**Pós-condições:** O usuário visualiza o relatório de todas as automações executadas em segundo plano.

**Critérios de aceite:**
- [ ] O histórico deve armazenar logs de pelo menos os últimos 30 dias de atividades do sistema.
- [ ] A listagem deve carregar de forma paginada para otimização de memória.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
