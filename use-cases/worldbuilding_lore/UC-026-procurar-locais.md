### Caso de Uso: Procurar locais

**ID:** UC-026  
**Requisito relacionado:** RF-26 (procurar locais)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Locais estão catalogados no projeto (manualmente ou via NER).  
**Gatilho:** O usuário abre o seletor de locais ou busca global e digita um local.  

**Fluxo principal:**
1. O usuário abre a aba de busca ou o atlas/mapa do projeto.
2. O usuário digita o nome do local desejado (ex: "Castelo de Winterfell").
3. O sistema filtra a base de dados de locais catalogados no projeto.
4. O sistema apresenta a ficha do local e a lista de textos em que esse local é mencionado ou serve de cenário.
5. O usuário clica em uma das menções e o sistema abre o arquivo no local correspondente.

**Fluxos alternativos:**
- *Filtrar textos por cenário:* O usuário seleciona o local na lista e clica em "Ver todos os textos ambientados aqui" para filtrar a barra lateral de navegação.

**Fluxos de exceção:**
- *Nenhum resultado:* O sistema notifica a ausência de registros e sugere criar um novo ponto de local com aquele nome no diretório.

**Pós-condições:** O local e suas menções textuais são exibidos.

**Critérios de aceite:**
- [ ] O sistema deve exibir a listagem de locais em ordem alfabética ou por número de menções no texto.
- [ ] A pesquisa deve retornar resultados parciais (ex: buscar "Winter" deve retornar "Winterfell").

**Prioridade:** Média  
**Complexidade estimada:** Baixa
