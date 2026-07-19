### Caso de Uso: Autenticação em dois fatores (2FA)

**ID:** UC-231  
**Requisito relacionado:** RF-231 (autenticação em dois fatores (2FA))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado e deseja aumentar a segurança da sua conta.  
**Gatilho:** O usuário acessa "Configurações" -> "Segurança" -> "Ativar Autenticação em Duas Etapas".  

**Fluxo principal:**
1. O usuário clica em "Configurar 2FA (App Autenticador)".
2. O sistema gera uma chave secreta exclusiva (seed TOTP) e exibe na tela no formato de código de texto e um QR Code correspondente.
3. O usuário abre o aplicativo autenticador no smartphone (ex: Google Authenticator) e escaneia o QR Code.
4. O aplicativo do usuário passa a gerar tokens temporários de 6 dígitos baseados em tempo.
5. O usuário insere o token de 6 dígitos ativo no campo de validação da plataforma e clica em "Ativar 2FA".
6. O sistema valida o token contra a chave secreta e ativa o status 2FA como ativo no banco de dados.
7. O sistema gera e exibe uma lista de 10 códigos de backup de uso único para recuperação, orientando o usuário a salvá-los.

**Fluxos alternativos:**
- *Verificação no Login:* Ao fazer login futuramente, após validar e-mail e senha, o sistema redireciona para a tela de segundo fator, onde o usuário deve preencher o token de 6 dígitos gerado no app para concluir o acesso.

**Fluxos de exceção:**
- *Token inválido:* Se o usuário preencher um token incorreto ou expirado, o sistema impede a ativação e exibe: "Código inválido. Tente novamente".

**Pós-condições:** A autenticação em duas etapas é ativada para a conta e exigida em logins subsequentes.

**Critérios de aceite:**
- [ ] A chave secreta 2FA deve ser armazenada com criptografia reversível forte no banco de dados para possibilitar verificação.
- [ ] Os códigos de backup de uso único devem ser hashed no banco de forma inalterável.

**Prioridade:** Alta  
**Complexidade estimada:** Média
