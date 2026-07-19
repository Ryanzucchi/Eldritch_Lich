### Caso de Uso: Cadastrar e autenticar usuários

**ID:** UC-129  
**Requisito relacionado:** RF-129 (cadastrar e autenticar usuários)  
**Ator(es):** Usuário (Visitante/Escritor), Sistema  
**Pré-condições:** O usuário não está autenticado e acessa a página de login/cadastro.  
**Gatilho:** O usuário preenche o formulário de cadastro ou de login e envia.  

**Fluxo principal:**
1. O usuário acessa a página inicial e clica em "Cadastrar-se".
2. O usuário preenche: Nome, E-mail, Senha e confirmação de senha.
3. O usuário clica em "Registrar".
4. O sistema criptografa a senha e cria a conta do usuário com status de e-mail "não verificado".
5. O sistema envia um e-mail de ativação e redireciona o usuário para a tela de login.
6. Para se autenticar, o usuário preenche o e-mail e senha cadastrados e clica em "Entrar".
7. O sistema valida as credenciais no backend, gera um token de sessão seguro (JWT) e o armazena nos cookies seguros.
8. O sistema redireciona o usuário autenticado para seu Dashboard de projetos.

**Fluxos alternativos:**
- *Login social:* O usuário clica em "Entrar com o Google". O fluxo é redirecionado para a autenticação OAuth2 do Google e retorna com o login efetuado.

**Fluxos de exceção:**
- *Credenciais incorretas:* Se o e-mail ou a senha estiverem incorretos, o sistema apresenta a mensagem de erro: "E-mail ou senha incorretos".

**Pós-condições:** O usuário é autenticado, recebe o token de acesso e acessa a área protegida do sistema.

**Critérios de aceite:**
- [ ] O sistema não deve transmitir senhas em texto puro na rede (exigir protocolo HTTPS).
- [ ] A autenticação de usuário e verificação de token na API devem demorar menos de 1 segundo.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
