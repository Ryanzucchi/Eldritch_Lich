### Caso de Uso: Reorganizar capítulos arrastando no sumário

**ID:** UC-248  
**Requisito relacionado:** RF-248 (reorganizar capítulos arrastando no sumário)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O sumário do livro contendo os capítulos e partes organizados está aberto.  
**Gatilho:** O usuário arrasta um item de capítulo para outra posição na lista do sumário consolidado.  

**Fluxo principal:**
1. O usuário visualiza o Sumário do Livro.
2. O usuário clica e segura o capítulo correspondente na lista do sumário lateral.
3. O usuário arrasta o item para cima ou para baixo, soltando-o na posição desejada.
4. O sistema reposiciona o arquivo para a nova posição no banco de dados e altera a ordenação física das pastas no diretório.
5. A árvore lateral de arquivos é atualizada instantaneamente refletindo a nova sequência.

**Fluxos alternativos:**
- *Arrastar títulos internos:* O usuário arrasta um subtítulo dentro do sumário de um único documento. O sistema move a totalidade do bloco de texto pertencente ao cabeçalho original para a nova posição correspondente dentro do arquivo.

**Fluxos de exceção:**
- *Soltura inválida:* Se o usuário soltar o item fora do container da lista, o sistema cancela a operação e retorna o item à posição original de ordenação de forma segura.

**Pós-condições:** A ordem física dos capítulos do livro é atualizada na base de dados e na interface lateral.

**Critérios de aceite:**
- [ ] O arrasto de capítulos no sumário deve possuir animação visual fluida do tipo Drag-and-Drop.
- [ ] A atualização de ordenação no banco de dados após a soltura do item deve durar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
