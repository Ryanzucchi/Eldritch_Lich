### Caso de Uso: Buscar no sumário interativo

**ID:** UC-249  
**Requisito relacionado:** RF-249 (buscar no sumário interativo)  
**Ator(es):** Usuário (Escritor/Leitor), Sistema  
**Pré-condições:** O sumário interativo de conteúdos está aberto.  
**Gatilho:** O usuário digita uma palavra na barra de buscas do sumário.  

**Fluxo principal:**
1. O usuário abre o sumário do livro e clica na barra de busca do sumário.
2. O usuário digita o termo de busca.
3. O sistema analisa os cabeçalhos listados e oculta da lista todos os títulos que não contenham o termo de busca correspondente.
4. O usuário visualiza apenas os capítulos ou subtítulos que contêm a palavra buscada.
5. O usuário clica no item e o editor rola até a cena correspondente.

**Fluxos alternativos:**
- *Limpar busca:* O usuário clica no "X" da barra de busca do sumário, restaurando de imediato a listagem completa.

**Fluxos de exceção:**
- *Nenhum cabeçalho localizado:* Se nenhum título corresponder ao termo digitado, a listagem exibe "Nenhum título encontrado".

**Pós-condições:** Os títulos filtrados de acordo com a pesquisa são exibidos no painel do sumário.

**Critérios de aceite:**
- [ ] O filtro de busca do sumário deve processar em tempo real de forma instantânea (< 50ms).
- [ ] A busca deve ser insensível a maiúsculas, minúsculas e acentuações.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
