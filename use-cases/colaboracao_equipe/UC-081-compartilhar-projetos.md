### Caso de Uso: Compartilhar projetos

**ID:** UC-081  
**Requisito relacionado:** RF-81 (compartilhar projetos)  
**Ator(es):** Usuário (Dono do Projeto), Sistema  
**Pré-condições:** O projeto existe na nuvem e o usuário é o dono ("Owner").  
**Gatilho:** O usuário clica em "Compartilhar Projeto" no cabeçalho ou menu do projeto.  

**Fluxo principal:**
1. O usuário abre o modal de compartilhamento do projeto.
2. O usuário digita o e-mail do colaborador desejado.
3. O usuário seleciona a permissão inicial ("Leitor", "Editor" ou "Administrador").
4. O usuário clica em "Adicionar Colaborador".
5. O sistema registra o convite no banco de dados e envia um e-mail de convite com um link de aceitação.
6. O colaborador aparece listado no modal com o status "Pendente".

**Fluxos alternativos:**
- *Compartilhamento via link público:* O usuário ativa a opção "Qualquer pessoa com o link pode visualizar", gerando uma URL pública criptografada para acesso de leitura.

**Fluxos de exceção:**
- *E-mail de destinatário inválido:* Se o usuário digitar um e-mail com formato inválido, o sistema impede o envio e exibe: "Formato de e-mail inválido".

**Pós-condições:** O convite de compartilhamento é registrado e a permissão é concedida assim que aceito.

**Critérios de aceite:**
- [ ] Convites pendentes devem expirar automaticamente após 7 dias se não forem aceitos.
- [ ] A alteração do estado de compartilhamento deve refletir no painel de controle do projeto em menos de 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
