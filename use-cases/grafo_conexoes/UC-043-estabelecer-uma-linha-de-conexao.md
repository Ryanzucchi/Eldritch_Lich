### Caso de Uso: Estabelecer uma linha de conexão entre duas palavras ou pastas

**ID:** UC-043  
**Requisito relacionado:** RF-43 (estabelecer uma linha de conexão entre duas palavras ou pastas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Os dois itens de origem e destino (palavras/textos ou pastas) existem no projeto.  
**Gatilho:** O usuário aciona a ferramenta de "Conexão Manual" no painel lateral ou no editor.  

**Fluxo principal:**
1. O usuário seleciona um termo no editor (ou uma pasta na barra lateral) e clica em "Conectar a...".
2. O usuário escolhe o segundo item (uma palavra em outro texto ou outra pasta).
3. O sistema registra a conexão direcional entre os IDs dos dois objetos no banco de dados.
4. Na aba de conexões do projeto, o sistema desenha uma linha conectando os dois elementos no painel gráfico correspondente.

**Fluxos alternativos:**
- *Conexão por drag-and-drop no Grafo:* O usuário abre a visualização em grafo, clica na borda de um nó (palavra/pasta) e arrasta um vetor até outro nó, criando a linha de conexão visualmente.

**Fluxos de exceção:**
- *Tentar conectar item a si mesmo:* O sistema impede a operação de auto-conexão e exibe "Não é possível conectar um elemento a si mesmo".

**Pós-condições:** A conexão lógica é estabelecida no banco de dados e renderizada visualmente na interface.

**Critérios de aceite:**
- [ ] O relacionamento deve persistir na tabela de adjacência do grafo de conhecimento.
- [ ] A exclusão de um dos elementos conectados deve remover automaticamente a linha de conexão correspondente no banco de dados (cascading delete).

**Prioridade:** Alta  
**Complexidade estimada:** Média
