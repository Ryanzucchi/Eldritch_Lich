### Caso de Uso: Convidar colaboradores por link

**ID:** UC-135  
**Requisito relacionado:** RF-135 (convidar colaboradores por link)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O projeto está salvo na nuvem e o usuário tem permissão de administração.  
**Gatilho:** O usuário clica em "Gerar Link de Convite" no modal de membros.  

**Fluxo principal:**
1. O administrador acessa a aba de membros do projeto.
2. O administrador clica em "Gerar Link de Acesso Rápido".
3. O sistema gera um token criptográfico associado ao projeto com perfil de permissão pré-definido e data de expiração.
4. O sistema exibe a URL de convite com um botão "Copiar".
5. O administrador compartilha o link com o novo colaborador.
6. O novo colaborador clica no link, realiza o login/cadastro e é inserido automaticamente na lista de membros do projeto.

**Fluxos alternativos:**
- *Revogar link:* O administrador clica em "Revogar Link de Convite", invalidando o token no banco de dados e impedindo novos acessos por meio dele.

**Fluxos de exceção:**
- *Link expirado:* Se um convidado clicar no link após a data de expiração, o sistema exibe "Este link de convite expirou" e impede a associação.

**Pós-condições:** O colaborador é adicionado ao projeto através da validação bem-sucedida do link de convite.

**Critérios de aceite:**
- [ ] O administrador deve conseguir definir se o link de convite expira em 24 horas, 7 dias ou nunca.
- [ ] O link de convite deve ser criptografado para evitar ataques de força bruta.

**Prioridade:** Média  
**Complexidade estimada:** Média
