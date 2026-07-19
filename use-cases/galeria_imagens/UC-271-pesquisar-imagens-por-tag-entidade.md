### Caso de Uso: Pesquisar imagens por tag/entidade

**ID:** UC-271  
**Requisito relacionado:** RF-271 (pesquisar imagens por tag/entidade)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem imagens registradas com tags ou associadas a fichas de entidades.  
**Gatilho:** O usuário digita um termo na caixa de buscas da Galeria de Mídias.  

**Fluxo principal:**
1. O usuário acessa a galeria e clica no campo de pesquisa.
2. O usuário digita o termo correspondente (ex: nome de um personagem ou tag "brasão").
3. O sistema realiza a busca nas colunas de metadados e tabelas de relacionamento.
4. O sistema filtra e atualiza a grade em tempo real, exibindo apenas as imagens vinculadas ao personagem pesquisado ou marcadas com a tag correspondente.
5. O usuário visualiza as correspondências.

**Fluxos alternativos:**
- *Filtro por extensão:* O usuário filtra simultaneamente pela extensão do arquivo (ex: exibir apenas arquivos de extensão .svg).

**Fluxos de exceção:**
- *Sem resultados:* Se não houver mídias associadas à pesquisa, o sistema exibe "Nenhuma imagem correspondente encontrada".

**Pós-condições:** A grade da galeria exibe apenas as imagens filtradas de acordo com as chaves selecionadas.

**Critérios de aceite:**
- [ ] A busca deve cruzar referências de nomes oficiais de entidades cadastrados.
- [ ] O tempo de resposta do filtro deve ser menor que 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
