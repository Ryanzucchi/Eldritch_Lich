### Caso de Uso: Transferir propriedade do projeto

**ID:** UC-206  
**Requisito relacionado:** RF-206 (transferir propriedade do projeto)  
**Ator(es):** Usuário (Proprietário/Owner do Projeto), Sistema  
**Pré-condições:** O projeto possui outros colaboradores com contas ativas e o usuário é o proprietário atual.  
**Gatilho:** O proprietário seleciona a opção "Transferir Propriedade" nas configurações do projeto.  

**Fluxo principal:**
1. O proprietário acessa as configurações avançadas do projeto.
2. O proprietário clica em "Transferir Propriedade do Projeto".
3. O sistema exibe a lista de colaboradores ativos habilitados para receber a transferência.
4. O proprietário seleciona o colaborador de destino.
5. O sistema solicita que o proprietário digite sua senha de acesso atual por razões de segurança.
6. O proprietário insere a senha e clica em "Confirmar Transferência Definitiva".
7. O sistema valida a senha, altera o ID do proprietário na tabela de projetos e rebaixa a permissão do proprietário antigo para o nível "Administrador".
8. O sistema envia uma notificação para o novo proprietário informando sobre a transferência.

**Fluxos alternativos:**
- *Aceite requerido:* O sistema exige uma etapa de confirmação do novo proprietário aceitando a propriedade antes de efetuar a migração no banco de dados.

**Fluxos de exceção:**
- *Senha incorreta:* Se o proprietário digitar a senha incorretamente, o sistema bloqueia a transação e exibe: "Senha de segurança incorreta. Ação cancelada".

**Pós-condições:** O novo usuário é gravado como proprietário definitivo do projeto no banco de dados.

**Critérios de aceite:**
- [ ] A transferência de propriedade deve ser uma ação transacional e irreversível pelo proprietário anterior.
- [ ] O processo de autenticação e validação de segurança deve durar menos de 1,5 segundos.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
