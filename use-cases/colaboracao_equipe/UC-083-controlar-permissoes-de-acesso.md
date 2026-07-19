### Caso de Uso: Controlar permissões de acesso

**ID:** UC-083  
**Requisito relacionado:** RF-83 (controlar permissões de acesso)  
**Ator(es):** Usuário (Administrador/Dono do Projeto), Sistema  
**Pré-condições:** Colaboradores já fazem parte do projeto compartilhado.  
**Gatilho:** O administrador acessa a tela de "Gestão de Colaboradores".  

**Fluxo principal:**
1. O administrador acessa o painel de controle do projeto e clica em "Membros e Permissões".
2. O sistema lista todos os usuários vinculados ao projeto com suas respectivas funções atuais.
3. O administrador clica no seletor de perfil (dropdown) ao lado do nome do colaborador "User B".
4. O administrador altera de "Leitor" para "Editor".
5. O sistema atualiza o registro de autorização na tabela de membros do banco de dados.
6. O sistema aplica o novo escopo de permissões no próximo carregamento de sessão do User B.

**Fluxos alternativos:**
- *Remover colaborador:* O administrador clica em "Remover" e o sistema remove o acesso do usuário ao projeto imediatamente.

**Fluxos de exceção:**
- *Tentar rebaixar o único Owner:* Se o administrador for o único dono do projeto e tentar alterar sua própria permissão para uma menor, o sistema impede a ação e exibe: "O projeto precisa ter pelo menos um Dono (Owner)".

**Pós-condições:** A política de acesso do colaborador é atualizada na base de dados e aplicada na interface.

**Critérios de aceite:**
- [ ] A alteração de permissão deve desautorizar chamadas de escrita na API para o usuário correspondente imediatamente após salvar.
- [ ] O painel deve registrar a ação administrativa no Log de Auditoria.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
