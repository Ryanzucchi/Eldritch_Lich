### Caso de Uso: Limitar tentativas de login para evitar ataques de força bruta (RNF)

**ID:** UC-422  
**Requisito relacionado:** RNF-Critical-9 (limitar tentativas de login)  
**Ator(es):** Sistema (Serviço de Segurança)  
**Pré-condições:** Contador de tentativas de login falhas configurado na base ou cache do servidor.  
**Gatilho:** Um usuário ou bot tenta realizar login com credenciais incorretas consecutivamente.  

**Fluxo principal:**
1. O cliente tenta fazer login fornecendo credenciais incorretas.
2. O sistema valida a falha, armazena no cache a tentativa falha associando-a ao IP/conta e incrementa o contador.
3. O cliente realiza mais 4 tentativas seguidas incorretas em um curto intervalo de tempo (totalizando 5 falhas).
4. Ao tentar a 6ª vez, o sistema detecta que o limite máximo de tolerância a falhas foi atingido.
5. O sistema bloqueia temporariamente novas tentativas de login para aquela conta e para aquele IP de origem por um período de resfriamento.
6. Novas tentativas de login realizadas no período de bloqueio são rejeitadas de imediato, retornando erro HTTP 429 Too Many Requests.

**Fluxos alternativos:**
- *Desbloqueio de senha:* O usuário realiza a recuperação de senha por e-mail de forma segura, efetuando a troca, e o sistema limpa os registros de falha do IP correspondente no cache instantaneamente.

**Fluxos de exceção:**
- *Ataques globais:* Se o sistema detectar picos atípicos de erros de login generalizados em toda a plataforma, ativa de forma automática o CAPTCHA obrigatório na tela inicial para todos os usuários.

**Pós-condições:** O IP e a conta temporariamente bloqueados são impedidos de realizar novas tentativas até o fim do período de timeout.

**Critérios de aceite:**
- [ ] O limite de bloqueio deve ser de no máximo 5 tentativas falhas consecutivas em um intervalo de 5 minutos.
- [ ] O tempo de expiração do bloqueio temporário da conta/IP deve ser de exatamente 15 minutos.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
