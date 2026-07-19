### Caso de Uso: Controlar férias e ausências

**ID:** UC-305  
**Requisito relacionado:** RF-304 (controlar férias e ausências)  
**Ator(es):** Funcionário, Administrador/RH, Sistema  
**Pré-condições:** O funcionário está ativo e possui período aquisitivo de férias vencido/em andamento.  
**Gatilho:** O funcionário solicita férias ou o RH registra um atestado de ausência.  

**Fluxo principal:**
1. O funcionário acessa o painel de autoatendimento -> "Solicitar Férias".
2. O sistema exibe o saldo de dias de férias disponíveis.
3. O funcionário insere o período desejado (Data de Início e Fim) e clica em "Enviar Solicitação".
4. O sistema notifica o gestor do departamento para aprovação.
5. O gestor acessa o painel de pendências de RH e clica em "Aprovar Férias".
6. O sistema grava o status de férias aprovadas e bloqueia o registro de presença daquele período.

**Fluxos alternativos:**
- *Lançar atestado de ausência:* O gestor de RH abre a ficha do funcionário e insere uma ausência médica (anexando o comprovante) para justificar a falta sem prejuízo de salário.

**Fluxos de exceção:**
- *Saldo insuficiente:* Se o funcionário solicitar mais dias do que possui de direito no saldo, o sistema impede a submissão e avisa: "Solicitação inválida. Saldo de férias insuficiente".

**Pós-condições:** O período de férias ou a ausência justificada é gravada na agenda e no histórico do funcionário.

**Critérios de aceite:**
- [ ] O sistema deve calcular automaticamente a data limite para concessão das férias antes do vencimento do período concessivo (férias em dobro).
- [ ] A atualização do saldo de férias do funcionário após a aprovação deve ocorrer em menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
