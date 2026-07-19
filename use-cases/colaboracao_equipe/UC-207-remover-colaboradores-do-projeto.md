### Caso de Uso: Remover colaboradores do projeto

**ID:** UC-207  
**Requisito relacionado:** RF-207 (remover colaboradores do projeto)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O colaborador que será removido está associado ao projeto.  
**Gatilho:** O administrador clica em "Remover" no modal de gerenciamento de membros.  

**Fluxo principal:**
1. O administrador acessa a tela de membros do projeto.
2. O administrador localiza o colaborador na listagem.
3. O administrador clica no ícone de "Remover" ao lado do nome do colaborador.
4. O sistema abre uma caixa de confirmação de exclusão do membro.
5. O administrador confirma.
6. O sistema remove o registro de vínculo do colaborador na tabela de permissões de membros do banco de dados.
7. Se o colaborador estiver com o projeto aberto no momento, a interface detecta a perda de permissão e o redireciona automaticamente para o Dashboard geral.

**Fluxos alternativos:**
- *Suspender membro:* O administrador seleciona "Suspender temporariamente", mantendo o usuário na listagem mas bloqueando seu login no projeto.

**Fluxos de exceção:**
- *Remover o proprietário:* O sistema impede que qualquer administrador remova o Proprietário (Owner) do projeto, desabilitando a opção correspondente.

**Pós-condições:** O colaborador perde o acesso de leitura/escrita e é excluído da listagem de membros do projeto.

**Critérios de aceite:**
- [ ] A revogação do token de acesso do colaborador removido no servidor deve ocorrer de forma imediata.
- [ ] A tela do colaborador removido deve fechar o projeto e retornar ao dashboard em menos de 1 segundo.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
