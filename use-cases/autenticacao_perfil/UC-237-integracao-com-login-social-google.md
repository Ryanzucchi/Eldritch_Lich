### Caso de Uso: Integração com login social (Google, Apple, Facebook)

**ID:** UC-237  
**Requisito relacionado:** RF-237 (integração com login social)  
**Ator(es):** Usuário (Escritor/Visitante), Sistema, Servidor OAuth2  
**Pré-condições:** O usuário acessa a página de autenticação e possui conta ativa no provedor social selecionado.  
**Gatilho:** O usuário clica em "Entrar com o Google" na tela de login.  

**Fluxo principal:**
1. O usuário clica no botão "Entrar com o Google".
2. O sistema inicializa a requisição OAuth2 e redireciona o navegador para o endpoint de autorização do Google.
3. O usuário insere as credenciais e autoriza o compartilhamento de perfil básico (Nome, E-mail e Foto).
4. O Google redireciona o navegador de volta para a aplicação com o token de validação.
5. O backend valida a assinatura do token do Google (JWT) e verifica se o e-mail já existe na base de dados.
6. Se o e-mail já existir, o sistema vincula a credencial à conta existente e inicia a sessão (login).
7. Se o e-mail não existir, o sistema cria um novo registro de usuário preenchendo os dados vindos do Google e ativa a conta.
8. O usuário é redirecionado ao Dashboard de projetos.

**Fluxos alternativos:**
- *Login com a Apple:* O usuário realiza o mesmo fluxo selecionando "Entrar com a Apple", validando a identidade no ecossistema correspondente.

**Fluxos de exceção:**
- *E-mail não verificado:* Se o provedor indicar que o e-mail não foi verificado na plataforma de origem, o sistema exige uma validação manual por e-mail antes de liberar o vínculo.

**Pós-condições:** O usuário é autenticado na plataforma por meio de suas credenciais do provedor externo.

**Critérios de aceite:**
- [ ] O fluxo de login social deve ser integrado de forma segura sem expor credenciais ou chaves de API do backend.
- [ ] O tempo total de redirecionamento e login após retorno do provedor deve ser inferior a 1,5 segundos.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
