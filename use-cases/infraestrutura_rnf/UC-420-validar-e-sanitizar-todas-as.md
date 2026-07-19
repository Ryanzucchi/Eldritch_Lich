### Caso de Uso: Validar e sanitizar todas as entradas para evitar injeção de código (SQL Injection, XSS) (RNF)

**ID:** UC-420  
**Requisito relacionado:** RNF-Critical-7 (validar e sanitizar entradas contra injeção de código)  
**Ator(es):** Sistema (Backend/Frontend)  
**Pré-condições:** Filtros de sanitização de inputs e ORM configurados no backend.  
**Gatilho:** Um usuário mal-intencionado envia parâmetros de entrada contendo scripts maliciosos.  

**Fluxo principal:**
1. O usuário mal-intencionado preenche um campo de entrada de formulário da aplicação digitando payloads de injeção SQL (ex: `' OR 1=1 --`) ou tags de XSS (ex: `<script>alert('hack')</script>`).
2. O usuário clica em enviar os dados.
3. O backend recebe a payload e intercepta no validador de entradas (Schema Validator).
4. O sistema limpa as tags HTML maliciosas, convertendo caracteres especiais em entidades de texto seguras, e usa consultas parametrizadas do ORM para gravação no banco de dados.
5. A payload é salva de forma inofensiva na base de dados como puro texto corrido.
6. A interface renderiza o texto de forma segura nas telas dos usuários, impedindo execuções de scripts ou vazamentos de banco.

**Fluxos alternativos:**
- *Filtro WAF:* O Web Application Firewall na borda da rede analisa a payload da requisição HTTP e bloqueia a chamada antes que chegue à API da aplicação se detectar padrões comuns de ataques conhecidos.

**Fluxos de exceção:**
- *Erro de formato:* Se o usuário tentar enviar textos em um campo restrito para tipos numéricos (ex: idade), o sistema rejeita a transação antes de rodar a query e retorna erro HTTP 400.

**Pós-condições:** A entrada contendo a tentativa de injeção de código é sanitizada, armazenada de forma segura e inofensiva.

**Critérios de aceite:**
- [ ] Nenhuma entrada de dados vinda do cliente deve ser enviada diretamente em queries de banco cruas (raw queries) sem parametrização.
- [ ] O tempo gasto na sanitização de dados de inputs normais de formulário deve ser inferior a 20ms.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
