### Caso de Uso: Excluir conta de usuário (LGPD/GDPR)

**ID:** UC-236  
**Requisito relacionado:** RF-236 (excluir conta de usuário)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado no sistema.  
**Gatilho:** O usuário clica em "Excluir Minha Conta Permanentemente" nas configurações de perfil.  

**Fluxo principal:**
1. O usuário acessa as configurações avançadas de sua conta.
2. O usuário clica na opção "Excluir Conta".
3. O sistema exibe um aviso informando que a ação excluirá permanentemente todos os projetos pessoais, textos e metadados.
4. O usuário deve digitar a palavra "EXCLUIR" e sua senha de acesso para confirmação.
5. O usuário confirma.
6. O sistema executa a deleção física em cascata de todos os dados do usuário nas tabelas e remove o registro do perfil do banco.
7. O sistema limpa as credenciais de login locais (cookies/storage) e redireciona o usuário para a tela inicial.

**Fluxos alternativos:**
- *Anonimização em projetos de terceiros:* Se o usuário participava de projetos colaborativos de terceiros, suas mensagens e modificações permanecem visíveis, mas seu nome é substituído por um identificador genérico (ex: "Usuário Excluído") para fins de manter a consistência do enredo.

**Fluxos de exceção:**
- *Proprietário de projetos ativos com colaboradores:* Se o usuário for dono de projetos compartilhados com outros membros, o sistema impede a exclusão direta e orienta a transferir a propriedade ou excluir esses projetos antes de deletar a conta.

**Pós-condições:** Todas as informações cadastrais e dados pessoais do usuário são deletados fisicamente dos servidores da plataforma.

**Critérios de aceite:**
- [ ] O processo de exclusão de dados em cascata deve garantir que nenhuma imagem de mídia do usuário permaneça órfã no bucket de armazenamento em nuvem.
- [ ] A exclusão física deve ser definitiva e irreversível.

**Prioridade:** Crítica  
**Complexidade estimada:** Alta
