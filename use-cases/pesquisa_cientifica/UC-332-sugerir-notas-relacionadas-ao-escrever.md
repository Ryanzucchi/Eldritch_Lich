### Caso de Uso: Sugerir notas relacionadas ao escrever

**ID:** UC-332  
**Requisito relacionado:** RF-331 (sugerir notas relacionadas ao escrever)  
**Ator(es):** Sistema, IA, Usuário (Escritor/Pesquisador)  
**Pré-condições:** Notas de pesquisa cadastradas e o editor de texto está ativo.  
**Gatilho:** O usuário digita no editor de texto (com debounce de 3 segundos).  

**Fluxo principal:**
1. O usuário digita no editor o parágrafo (ex: "A dilatação do tempo ocorre em campos gravitacionais...").
2. Após a pausa de digitação, o sistema dispara a análise semântica em background.
3. A IA lê o trecho escrito, extrai conceitos-chaves e realiza uma busca por similaridade semântica na base de notas do projeto.
4. O sistema exibe um painel lateral flutuante sutil contendo miniaturas de notas correspondentes (ex: "Nota: Buracos Negros", "Nota: Relatividade").
5. O usuário clica na sugestão para abrir a nota ao lado ou clica em "Linkar" para inserir a referência bidirecional correspondente no texto ativo.

**Fluxos alternativos:**
- *Desativar sugestões:* O usuário desmarca a chave "Sugestões de Notas por IA" na barra de ferramentas do editor para focar na escrita livre sem popups.

**Fluxos de exceção:**
- *Banco de vetores offline:* Se a indexação de vetores do projeto falhar por falta de recursos do servidor, a busca se converte em busca textual exata por palavras-chaves, mantendo as recomendações básicas.

**Pós-condições:** O painel de sugestões de notas relacionadas é atualizado na interface com base no texto ativo digitado.

**Critérios de aceite:**
- [ ] A busca semântica em background não deve causar nenhum atraso ou lag na digitação do editor.
- [ ] O tempo total de processamento semântico e recomendação das notas na tela deve ser de no máximo 1,5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
