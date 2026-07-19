### Caso de Uso: Integrar financeiro com contas bancárias (via API / Open Finance)

**ID:** UC-387  
**Requisito relacionado:** RF-386 (integrar financeiro com contas bancárias (via API/Open Finance))  
**Ator(es):** Administrador/Controller Financeiro, Sistema, API Bancária  
**Pré-condições:** Conta bancária corporativa ativa em banco parceiro da integração.  
**Gatilho:** O administrador clica em "Conectar Conta Bancária" nas integrações.  

**Fluxo principal:**
1. O administrador acessa "Finanças" -> "Contas Bancárias" -> "Conectar Nova Conta".
2. O administrador seleciona o banco corporativo na lista.
3. O sistema redireciona o usuário para o fluxo de autenticação e consentimento de Open Finance do banco selecionado.
4. O administrador autentica e autoriza o compartilhamento de saldos e extratos.
5. O sistema obtém as credenciais de acesso seguro (access tokens) e salva criptografados no banco de dados.
6. O sistema agenda um job recorrente em background (cron) para sincronizar o extrato da conta bancária.

**Fluxos alternativos:**
- *Conexão manual por OFX:* O usuário realiza o upload manual de arquivos de extrato .ofx obtidos no home banking, e o sistema realiza o processamento dos lançamentos da mesma forma.

**Fluxos de exceção:**
- *Consentimento expirado:* Se a autorização expirar do lado do banco, o sistema interrompe a sincronização de extratos e exibe alerta solicitando renovação de login do Open Finance.

**Pós-condições:** A conexão bancária de extrato é estabelecida, iniciando a importação automática das transações.

**Critérios de aceite:**
- [ ] A sincronização automática do extrato bancário diário via API Open Finance deve rodar de madrugada de forma silenciosa.
- [ ] Todas as chaves e credenciais bancárias devem ser armazenadas com criptografia simétrica de alta segurança (AES-256).

**Prioridade:** Alta  
**Complexidade estimada:** Alta
