### Caso de Uso: Alternar entre projetos

**ID:** UC-118  
**Requisito relacionado:** RF-118 (alternar entre projetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui mais de um projeto criado em sua conta.  
**Gatilho:** O usuário clica no dropdown de projetos ativos na barra de cabeçalho global.  

**Fluxo principal:**
1. O usuário clica no seletor de projetos (dropdown) no topo esquerdo do cabeçalho.
2. O sistema lista todos os projetos ativos vinculados à conta do usuário.
3. O usuário clica no "Projeto B".
4. O sistema descarrega o estado do projeto atual, carrega os metadados do "Projeto B" e renderiza a nova árvore de pastas e arquivos lateral.
5. A URL do navegador é atualizada contendo o ID do novo projeto ativo.

**Fluxos alternativos:**
- *Alternar via Dashboard:* O usuário clica em "Sair do projeto" para retornar ao painel central de sua conta, onde clica sobre o card do Projeto B para abri-lo.

**Fluxos de exceção:**
- *Projeto de destino excluído:* Se o projeto de destino tiver sido excluído por outro administrador concorrentemente, o sistema exibe "Projeto não encontrado. Retornando ao Dashboard" e atualiza a tela.

**Pós-condições:** O espaço de trabalho é recarregado exibindo os dados exclusivos do novo projeto focado.

**Critérios de aceite:**
- [ ] O tempo total de transição de tela e carregamento de dados do novo projeto selecionado deve ser inferior a 1,5 segundos.
- [ ] O sistema deve salvar o ID do último projeto ativo no localStorage para abri-lo no próximo carregamento.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa
