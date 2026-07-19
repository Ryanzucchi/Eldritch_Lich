### Caso de Uso: Autenticar todas as requisições sensíveis via token seguro (RNF)

**ID:** UC-421  
**Requisito relacionado:** RNF-Critical-8 (autenticar requisições via token seguro)  
**Ator(es):** Sistema (API / Gateway de Autenticação)  
**Pré-condições:** Mecanismo de autenticação JWT estruturado com chaves criptográficas secretas ativas no servidor.  
**Gatilho:** O cliente envia uma requisição para um endpoint de API privado.  

**Fluxo principal:**
1. O cliente faz a chamada de rede anexando o token JWT no cabeçalho HTTP `Authorization: Bearer <token>`.
2. O gateway de API intercepta a requisição e valida a assinatura criptográfica do token usando a chave secreta correspondente.
3. O sistema verifica se o token está dentro da data de validade (validação do campo `exp`).
4. O sistema extrai os metadados do token (User ID, Tenant ID e escopos).
5. Se o token for válido e possuir o escopo de autorização correspondente ao endpoint solicitado, a requisição é autorizada e processada pelo backend.

**Fluxos alternativos:**
- *Renovação automática:* O token de acesso curto (ex: expiração de 15 minutos) expira. O cliente envia silenciosamente uma chamada com o refresh token seguro, gerando um novo JWT de acesso ativo sem desconectar o usuário.

**Fluxos de exceção:**
- *Token inválido:* Se a assinatura do token for inválida ou estiver expirada, a API bloqueia a requisição de imediato, retornando o código HTTP 401 Unauthorized de segurança.

**Pós-condições:** A requisição é autenticada e as informações do usuário são validadas de forma segura na API.

**Critérios de aceite:**
- [ ] O processo de validação de assinatura e integridade do token JWT na API deve demorar menos de 10ms por chamada.
- [ ] Os tokens revogados de sessões encerradas devem ser invalidados de imediato no banco/cache.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
