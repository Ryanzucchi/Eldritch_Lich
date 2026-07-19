### Caso de Uso: Recuperar senha

**ID:** UC-130  
**Requisito relacionado:** RF-130 (recuperar senha)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui uma conta cadastrada com um e-mail válido no sistema.  
**Gatilho:** O usuário clica em "Esqueci minha senha" na tela de login.  

**Fluxo principal:**
1. O usuário clica no link "Esqueci minha senha".
2. O sistema abre a tela de redefinição de senha solicitando o e-mail cadastrado.
3. O usuário digita o e-mail e clica em "Enviar link de recuperação".
4. O sistema gera um token de recuperação de uso único (com prazo de expiração de 1 hora) e grava no banco de dados.
5. O sistema envia um e-mail contendo o link de redefinição.
6. O usuário abre o e-mail, clica no link, insere a nova senha e clica em "Salvar Nova Senha".
7. O sistema valida a integridade e expiração do token, hashes a nova senha e atualiza o registro do usuário.
8. O token é invalidado e uma mensagem de sucesso é exibida orientando a realizar o login com a nova senha.

**Fluxos alternativos:**
- *E-mail não cadastrado:* Se o e-mail inserido não existir na base de dados, por motivos de segurança, o sistema exibe a mesma mensagem de sucesso de envio.

**Fluxos de exceção:**
- *Token expirado:* Se o usuário clicar no link após 1 hora da solicitação, o sistema exibe a mensagem "Link de recuperação expirado" e bloqueia o formulário.

**Pós-condições:** A senha do usuário é atualizada de forma segura na base de dados.

**Critérios de aceite:**
- [ ] O link de redefinição deve ser de uso único (deve expirar imediatamente após a primeira redefinição).
- [ ] A senha antiga deve ser invalidada assim que a nova for gravada.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
