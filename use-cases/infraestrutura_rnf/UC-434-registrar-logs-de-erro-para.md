### Caso de Uso: Registrar logs de erro para diagnóstico rápido de falhas (RNF)

**ID:** UC-434  
**Requisito relacionado:** RNF-High-10 (registrar logs de erro)  
**Ator(es):** Sistema (Serviço de Log), Engenharia / DevOps  
**Pré-condições:** Framework de logging configurado e integrado a um console de agregação de logs.  
**Gatilho:** Ocorre um erro não tratado ou exceção de execução no backend ou frontend.  

**Fluxo principal:**
1. Ocorre uma exceção ou falha inesperada durante o processamento de uma requisição de usuário.
2. O backend captura a exceção na classe global de tratamento de erros (Exception Handler).
3. O sistema formata de forma automática o log do erro contendo: timestamp UTC, nível de criticidade (ERROR, CRITICAL), stack trace detalhado do erro, ID do usuário, endpoint chamado e payload da chamada.
4. O sistema grava o log no agregador centralizado de logs (ex: Sentry/Datadog) e exibe uma mensagem amigável para o usuário final.
5. A equipe de engenharia visualiza o erro agrupado no console do agregador para correção imediata.

**Fluxos alternativos:**
- *Auditoria de acessos:* O sistema registra logs informativos (INFO) de ações administrativas e transações financeiras críticas para fins de auditoria interna e conformidade de RH.

**Fluxos de exceção:**
- *Agregador offline:* Se o serviço remoto do agregador de logs estiver instável ou offline, o sistema grava os logs localmente em arquivos de texto de emergência (`error.log`) na máquina do servidor para evitar a perda de diagnóstico de falhas.

**Pós-condições:** O log descritivo do erro é capturado, formatado e persistido de forma segura para fins de depuração.

**Critérios de aceite:**
- [ ] Os logs não devem conter de forma alguma dados sensíveis brutos (como senhas brutas ou cartões de crédito) que violem regras de compliance de dados (sanitização de logs ativa).
- [ ] O disparo de gravação do log de erro não deve degradar a velocidade de entrega de erro do cliente (< 50ms).

**Prioridade:** Alta  
**Complexidade estimada:** Média
