### Caso de Uso: Associar eventos da cronologia a locais específicos

**ID:** UC-167  
**Requisito relacionado:** RF-167 (associar eventos da cronologia a locais específicos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de locais cadastrados e eventos de timeline existentes.  
**Gatilho:** O usuário edita as propriedades de um evento da timeline.  

**Fluxo principal:**
1. O usuário abre o formulário de edição de um evento na timeline.
2. O usuário clica no campo "Local do Evento".
3. O sistema abre uma caixa de pesquisa autocomplete listando os locais cadastrados no projeto.
4. O usuário digita o nome e seleciona o local correspondente.
5. O usuário clica em "Salvar".
6. O sistema atualiza o atributo `local_id` do evento no banco de dados.
7. O card do evento na timeline passa a exibir uma tag clicável do local.

**Fluxos alternativos:**
- *Navegação reversa:* O usuário abre a ficha técnica de um local e visualiza a listagem cronológica de todos os eventos da timeline que ocorreram ali.

**Fluxos de exceção:**
- *Local excluído:* Se o local associado for excluído do projeto, o evento da timeline remove a tag associada automaticamente, mantendo o registro do evento consistente.

**Pós-condições:** O evento cronológico é vinculado à coordenada lógica da ficha de local correspondente.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a chave estrangeira de relacionamento de forma indexada.
- [ ] A tag do local no card da timeline deve abrir a ficha do local correspondente em um painel split-view ao ser clicada.

**Prioridade:** Alta  
**Complexidade estimada:** Média
