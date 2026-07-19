### Caso de Uso: Duplicar textos

**ID:** UC-006  
**Requisito relacionado:** RF-6 (duplicar textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto de origem existe no projeto e o usuário tem permissão de escrita.  
**Gatilho:** O usuário seleciona a opção "Duplicar" no menu de opções do texto.  

**Fluxo principal:**
1. O usuário clica com o botão direito em um texto na árvore lateral ou abre as opções do documento aberto e escolhe "Duplicar".
2. O sistema lê o título, conteúdo, categorias, tags e metadados do texto original.
3. O sistema cria um novo registro de texto no banco de dados com uma nova chave primária (ID).
4. O título da nova cópia é preenchido com o padrão `[Título Original] (Cópia)`.
5. O sistema insere a cópia na mesma pasta e posição logo abaixo do texto de origem na árvore de arquivos.
6. O sistema exibe um toast de sucesso indicando a criação do documento.

**Fluxos alternativos:**
- *Duplicações sucessivas:* Caso o nome gerado já exista, o sistema incrementa sequencialmente, ex: `[Título Original] (Cópia 2)`.

**Fluxos de exceção:**
- *Limite de armazenamento:* Caso o usuário atinja o limite do seu plano para quantidade de textos ou armazenamento, a operação é rejeitada com uma mensagem clara orientando o upgrade de plano.

**Pós-condições:** Um novo texto com conteúdo idêntico ao original é gerado e disponibilizado para edição no projeto.

**Critérios de aceite:**
- [ ] O texto duplicado deve copiar fielmente todo o conteúdo do editor, metadados (tags, categorias) e vinculações.
- [ ] O histórico de versões do documento original não deve ser migrado para o novo documento duplicado.
- [ ] A criação do novo registro deve ocorrer em menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
