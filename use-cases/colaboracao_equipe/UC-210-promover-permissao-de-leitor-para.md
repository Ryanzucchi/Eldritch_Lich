### Caso de Uso: Promover permissão de leitor para colaborador

**ID:** UC-210  
**Requisito relacionado:** RF-210 (promover permissão de leitor para colaborador)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O usuário possui papel de "Leitor" ativo no projeto.  
**Gatilho:** O administrador eleva o acesso do usuário no painel de membros.  

**Fluxo principal:**
1. O administrador acessa o painel de gerenciamento de membros.
2. O administrador localiza o usuário correspondente.
3. O administrador clica no seletor de cargos e altera o papel para "Colaborador".
4. O administrador clica em "Salvar".
5. O sistema grava a alteração no banco de dados.
6. O sistema atualiza a sessão do leitor promovido, liberando a digitação no editor de textos e a criação de pastas no projeto.
7. O usuário promovido recebe uma notificação visual na tela indicando a liberação de edição.

**Fluxos alternativos:**
- *Promover a Administrador:* O proprietário promove um colaborador para "Administrador", dando a ele permissão de gerenciar outros membros, exceto o proprietário.

**Fluxos de exceção:**
- *Erro ao propagar permissão:* Se o WebSocket falhar no envio, o usuário continua em modo leitura até reabrir o projeto ou recarregar a página, forçando a leitura da nova permissão da API.

**Pós-condições:** O usuário passa a ter privilégios de escrita e edição no projeto.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a data e o ID do administrador responsável pela promoção nos logs de auditoria.
- [ ] O desbloqueio de escrita na tela do colaborador promovido deve ocorrer de forma fluida.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
