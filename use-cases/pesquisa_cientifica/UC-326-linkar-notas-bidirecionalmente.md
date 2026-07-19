### Caso de Uso: Linkar notas bidirecionalmente

**ID:** UC-326  
**Requisito relacionado:** RF-325 (linkar notas bidirecionalmente)  
**Ator(es):** Usuário (Escritor/Pesquisador), Sistema  
**Pré-condições:** Existem pelo menos duas notas atômicas criadas.  
**Gatilho:** O usuário insere um link interno em uma nota usando a sintaxe de colchetes duplos `[[`.  

**Fluxo principal:**
1. O usuário abre a nota de origem (ex: "Nota A").
2. No corpo da nota, o usuário insere a referência no formato `[[Nota B]]`.
3. O sistema reconhece o link dinamicamente. Ao salvar, grava no banco de dados a relação direcionada de A para B.
4. O sistema insere de forma automática a referência inversa de "Mencionada em: [[Nota A]]" no painel de Backlinks no rodapé da "Nota B".
5. O usuário abre a Nota B e visualiza o link de retorno ativo para navegação bidirecional rápida.

**Fluxos alternativos:**
- *Remoção de link:* O usuário apaga a referência no texto da Nota A. O sistema remove a relação correspondente no banco e o backlink desaparece da Nota B.

**Fluxos de exceção:**
- *Link para nota inexistente:* Se o usuário digitar um link para uma nota inexistente, o link fica em cinza. Se o usuário clicar nele, o sistema abre o modal de criação rápida criando um novo documento com o título digitado e vinculando ambos.

**Pós-condições:** O link bidirecional é estabelecido no banco de dados do projeto.

**Critérios de aceite:**
- [ ] O painel de backlinks de qualquer nota deve listar o título e o trecho de contexto em que o link foi citado.
- [ ] A indexação e atualização bidirecional de conexões devem levar menos de 150ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
