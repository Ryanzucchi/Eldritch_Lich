### Caso de Uso: Rebaixar permissão de colaborador para leitor

**ID:** UC-209  
**Requisito relacionado:** RF-209 (rebaixar permissão de colaborador para leitor)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O colaborador possui cargo de edição ativo (Editor) no projeto.  
**Gatilho:** O administrador ajusta as permissões de membros no painel administrativo.  

**Fluxo principal:**
1. O administrador acessa a tela de membros do projeto.
2. O administrador localiza o colaborador desejado.
3. O administrador clica no seletor de permissão ao lado do nome e seleciona "Leitor" (Viewer).
4. O administrador clica em "Salvar Alterações".
5. O sistema atualiza o cargo na tabela de membros no banco de dados.
6. Se o colaborador rebaixado estiver online editando algum documento, o sistema bloqueia instantaneamente sua permissão de digitação na thread ativa e exibe a notificação de alteração de permissão.

**Fluxos alternativos:**
- *Expiração de acesso:* O administrador configura uma data de expiração para o acesso de escrita, fazendo com que o sistema rebaixe a conta do usuário para leitor de forma automática na data programada.

**Fluxos de exceção:**
- *Rebaixar proprietário:* O sistema impede o rebaixamento de cargo do proprietário do projeto por qualquer administrador.

**Pós-condições:** O cargo do colaborador é atualizado para "Leitor" limitando seu acesso no projeto a modo de leitura.

**Critérios de aceite:**
- [ ] A alteração do nível de permissão deve ser propagada aos endpoints de API do backend de imediato, negando requisições de salvamento.
- [ ] A atualização visual da interface de edição do usuário afetado deve ocorrer em até 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
