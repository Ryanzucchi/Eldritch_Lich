### Caso de Uso: Organizar textos por categorias

**ID:** UC-014  
**Requisito relacionado:** RF-14 (organizar textos por categorias)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O usuário tem textos criados e deseja classificá-los sob categorias temáticas gerais.  
**Gatilho:** O usuário acessa a barra lateral de controle de categorias ou o painel de propriedades do texto.  

**Fluxo principal:**
1. O usuário abre as configurações do projeto ou propriedades do texto e escolhe "Definir Categoria".
2. O sistema exibe as categorias padrão e customizadas do projeto (ex: Rascunho, Lore, Worldbuilding).
3. O usuário seleciona uma categoria ou cria uma nova categoria atribuindo um nome e uma cor correspondente.
4. O sistema grava a associação no banco de dados.
5. O painel do texto exibe o indicador de categoria com a cor associada.

**Fluxos alternativos:**
- *Filtro por categoria:* O usuário clica em uma categoria na listagem geral e o sistema exibe apenas os textos pertencentes a ela.

**Fluxos de exceção:**
- *Duplicidade de categoria:* Se o usuário tentar criar uma categoria com um nome que já existe no projeto, o sistema impede e exibe: "Uma categoria com este nome já existe".

**Pós-condições:** O texto fica classificado sob uma categoria específica, facilitando a filtragem global.

**Critérios de aceite:**
- [ ] Cada texto deve pertencer a no máximo uma categoria principal.
- [ ] O sistema deve permitir que o usuário gerencie (crie, edite a cor ou exclua) a lista global de categorias do projeto.
- [ ] Ao deletar uma categoria, os textos a ela associados devem voltar para o estado "Sem categoria" sem serem excluídos.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
