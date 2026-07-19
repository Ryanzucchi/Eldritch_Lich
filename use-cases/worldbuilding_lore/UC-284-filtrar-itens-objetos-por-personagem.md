### Caso de Uso: Filtrar itens/objetos por personagem (inventário pessoal)

**ID:** UC-284  
**Requisito relacionado:** RF-284 (filtrar itens/objetos por personagem)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de itens com possuidores cadastrados configuradas.  
**Gatilho:** O usuário filtra a listagem geral de inventário de itens por personagem.  

**Fluxo principal:**
1. O usuário acessa a listagem geral de "Itens e Objetos" na barra lateral.
2. O usuário clica no seletor de filtros e seleciona a opção "Possuidores / Personagens".
3. O usuário seleciona o personagem desejado (ex: "Arthur").
4. O sistema filtra a lista de itens, exibindo na tela apenas os objetos que pertencem ou estão sob posse de "Arthur".
5. O usuário visualiza o inventário pessoal do personagem selecionado.

**Fluxos alternativos:**
- *Filtrar por itens não associados:* O usuário seleciona "Sem Proprietário" para listar apenas itens livres ou sem dono cadastrado na história.

**Fluxos de exceção:**
- *Personagem sem posses:* Se o personagem selecionado não possuir itens, a listagem exibe "Inventário vazio".

**Pós-condições:** A interface exibe apenas os itens pertencentes ao personagem selecionado no filtro.

**Critérios de aceite:**
- [ ] O filtro de itens por personagem deve demorar menos de 100ms.
- [ ] A lista filtrada deve indicar o status de posse (ex: "Equipado" ou "Guardado").

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
