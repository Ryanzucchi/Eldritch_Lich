### Caso de Uso: Filtrar itens/objetos por local (tesouro/depósito)

**ID:** UC-285  
**Requisito relacionado:** RF-285 (filtrar itens/objetos por local)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de itens com localizações cadastradas configuradas.  
**Gatilho:** O usuário filtra a listagem de itens por local.  

**Fluxo principal:**
1. O usuário acessa a listagem geral de "Itens e Objetos" na barra lateral.
2. O usuário clica no seletor de filtros e seleciona a opção "Localização / Depósito".
3. O usuário escolhe o local correspondente (ex: "Sala do Tesouro").
4. O sistema filtra e exibe apenas os itens que estão armazenados ou localizados na "Sala do Tesouro".
5. O usuário visualiza o acervo de itens do local selecionado.

**Fluxos alternativos:**
- *Filtrar no mapa:* O usuário clica em "Exibir Itens" na visualização do atlas, destacando os ícones de objetos e baús no mapa geográfico.

**Fluxos de exceção:**
- *Local sem itens:* Se não houver itens cadastrados na localidade, a listagem exibe "Nenhum item localizado nesta área".

**Pós-condições:** A listagem exibe apenas os itens correspondentes ao filtro de local selecionado.

**Critérios de aceite:**
- [ ] O tempo de processamento do filtro de itens por local deve ser menor que 100ms.
- [ ] A interface deve permitir limpar o filtro com um único clique.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
