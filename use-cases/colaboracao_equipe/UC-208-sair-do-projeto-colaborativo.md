### Caso de Uso: Sair do projeto colaborativo

**ID:** UC-208  
**Requisito relacionado:** RF-208 (sair do projeto colaborativo)  
**Ator(es):** Usuário (Colaborador)  
**Pré-condições:** O usuário está associado a um projeto colaborativo pertencente a terceiros.  
**Gatilho:** O colaborador seleciona a opção "Sair do Projeto" no painel de controle do projeto.  

**Fluxo principal:**
1. O colaborador abre o projeto compartilhado.
2. O colaborador clica no cabeçalho de opções do projeto e seleciona "Sair do Projeto".
3. O sistema exibe uma tela de confirmação de saída definitiva.
4. O colaborador clica em "Confirmar Saída".
5. O sistema remove a entrada do colaborador correspondente na tabela de membros no banco de dados.
6. O sistema redireciona o usuário de volta ao seu Dashboard de projetos.
7. O sistema envia uma notificação para o proprietário do projeto informando sobre a saída do membro.

**Fluxos alternativos:**
- *Saída rápida:* O usuário realiza a mesma operação clicando no botão "Sair" diretamente no card do projeto compartilhado exibido no Dashboard geral.

**Fluxos de exceção:**
- *Proprietário tentar sair:* Se o Proprietário tentar clicar em "Sair do Projeto", o sistema impede e orienta a transferir a propriedade ou excluir o projeto.

**Pós-condições:** O colaborador perde o vínculo com o projeto e é redirecionado ao dashboard.

**Critérios de aceite:**
- [ ] O processo de exclusão de permissões do colaborador deve ser concluído de forma transacional.
- [ ] A transição e carregamento do dashboard principal do usuário devem demorar menos de 1 segundo.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
