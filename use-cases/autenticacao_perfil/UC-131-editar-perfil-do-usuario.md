### Caso de Uso: Editar perfil do usuário

**ID:** UC-131  
**Requisito relacionado:** RF-131 (editar perfil do usuário)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado no sistema.  
**Gatilho:** O usuário clica em "Editar Perfil" no painel de controle da sua conta.  

**Fluxo principal:**
1. O usuário acessa a tela "Meu Perfil".
2. O sistema exibe os dados cadastrais atuais (Nome, E-mail, Foto de Perfil, Biografia e fuso horário).
3. O usuário edita os campos desejados (ex: altera o Nome ou envia uma nova foto).
4. O usuário clica em "Salvar Alterações".
5. O sistema valida os campos, realiza o processamento e redimensionamento da imagem de avatar no backend, e atualiza o registro na tabela de usuários.
6. A interface atualiza o cabeçalho e exibe uma notificação de sucesso.

**Fluxos alternativos:**
- *Alterar senha:* O usuário abre a sub-aba "Segurança" para redefinir sua senha preenchendo a senha antiga e definindo a nova.

**Fluxos de exceção:**
- *E-mail duplicado:* Se o usuário tentar alterar seu e-mail para um que já está cadastrado por outra conta, o sistema impede a gravação e informa: "Este e-mail já está sendo utilizado".

**Pós-condições:** Os dados cadastrais e o avatar do usuário são atualizados na base de dados.

**Critérios de aceite:**
- [ ] O tamanho da foto de perfil deve ser limitado a no máximo 2MB e convertida em formato otimizado WebP.
- [ ] A alteração de perfil deve sincronizar dinamicamente nos cabeçalhos da interface sem necessidade de relogar.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
