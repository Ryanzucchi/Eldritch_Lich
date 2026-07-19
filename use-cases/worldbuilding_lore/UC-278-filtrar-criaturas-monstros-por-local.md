### Caso de Uso: Filtrar criaturas/monstros por local (habitat)

**ID:** UC-278  
**Requisito relacionado:** RF-278 (filtrar criaturas/monstros por local)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de criaturas com habitats associados configuradas.  
**Gatilho:** O usuário filtra a listagem de diretório de criaturas por local.  

**Fluxo principal:**
1. O usuário acessa a listagem do "Bestiário" na barra lateral.
2. O usuário clica no seletor de filtros e seleciona a opção "Habitats / Locais".
3. O usuário seleciona o local desejado.
4. O sistema processa e oculta da lista todas as criaturas que não tenham o local correspondente marcado como habitat.
5. O usuário visualiza apenas a lista de animais e monstros nativos daquela região.

**Fluxos alternativos:**
- *Filtro no atlas:* O usuário clica em "Exibir Fauna" na visualização do atlas e filtra para exibir apenas pinos de criaturas agressivas no mapa geográfico.

**Fluxos de exceção:**
- *Sem fauna:* Se o local selecionado não possuir espécies associadas, a listagem exibe "Nenhuma criatura registrada neste habitat".

**Pós-condições:** O diretório de criaturas exibe apenas as espécies correspondentes ao filtro de local selecionado.

**Critérios de aceite:**
- [ ] O processamento do filtro de criaturas deve demorar menos de 100ms.
- [ ] A interface deve fornecer um botão claro de limpar filtros com um clique.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
