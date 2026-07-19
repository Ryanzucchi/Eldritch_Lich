### Caso de Uso: Sincronizar fusos horários de membros da equipe

**ID:** UC-380  
**Requisito relacionado:** RF-379 (sincronizar fusos horários de membros da equipe)  
**Ator(es):** Sistema, Membros da Equipe  
**Pré-condições:** O sistema possui cadastrado o fuso horário oficial na ficha de cada colaborador.  
**Gatilho:** O sistema carrega datas de eventos ou prazos para usuários em diferentes fusos horários.  

**Fluxo principal:**
1. O colaborador A (baseado em Brasília - GMT-3) visualiza em sua tela a reunião agendada para às "14:00 (GMT-3)".
2. O colaborador B (baseado em Londres - GMT+1) acessa a mesma reunião do mesmo projeto.
3. O sistema lê as configurações de fuso horário local do colaborador B.
4. O sistema converte automaticamente a timestamp UTC do banco de dados e exibe para o colaborador B o evento agendado para às "18:00 (GMT+1)".
5. Ambos visualizam a reunião em seus respectivos horários locais sem inconsistências de agenda.

**Fluxos alternativos:**
- *Alteração manual:* O usuário altera manualmente seu fuso horário nas configurações de perfil. O sistema re-renderiza todas as tarefas e compromissos para a nova faixa horária selecionada de imediato.

**Fluxos de exceção:**
- *Sem dados do navegador:* Se o cliente não expuser dados de fuso válidos e não possuir configuração de perfil preenchida, o sistema assume o fuso horário padrão do servidor (UTC).

**Pós-condições:** Todas as datas e horas da aplicação são convertidas e exibidas de acordo com o fuso local do usuário.

**Critérios de aceite:**
- [ ] A gravação de todas as datas no banco de dados deve ocorrer estritamente em formato UTC (ISO 8601).
- [ ] O recálculo de fusos horários na renderização do calendário deve ser imperceptível ao usuário final (< 50ms).

**Prioridade:** Alta  
**Complexidade estimada:** Média
