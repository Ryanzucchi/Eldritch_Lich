### Caso de Uso: Entitular textos e pastas

**ID:** UC-040  
**Requisito relacionado:** RF-40 (entitular textos e pastas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Um texto ou pasta está selecionado na árvore de arquivos.  
**Gatilho:** O usuário clica em "Renomear", dá um duplo clique sobre o título, ou altera o título no topo do editor de texto.  

**Fluxo principal:**
1. O usuário seleciona uma pasta ou texto e clica em "Renomear" no menu de opções.
2. O sistema ativa um campo de texto editável sobre o nome do item na árvore lateral.
3. O usuário digita o novo título (ex: "Capítulo I - O Retorno") e pressiona Enter.
4. O sistema valida o novo nome e envia uma requisição de atualização para a API do backend.
5. A API persiste o novo título no banco de dados e retorna a confirmação.
6. A árvore lateral é atualizada com o novo nome.

**Fluxos alternativos:**
- *Alteração no editor:* Se for um texto, o usuário pode digitar o título diretamente no campo de cabeçalho no topo da tela do editor de texto, sincronizando o nome automaticamente com a barra lateral.

**Fluxos de exceção:**
- *Nome inválido ou vazio:* Se o usuário deixar o nome em branco, o sistema impede a gravação, mantém o nome anterior e exibe um alerta sutil: "O nome não pode ficar em branco".

**Pós-condições:** O texto ou pasta é atualizado com o novo nome no banco de dados e na interface.

**Critérios de aceite:**
- [ ] O sistema deve remover automaticamente espaços em branco extras no início e fim do título fornecido pelo usuário.
- [ ] Caracteres especiais válidos e pontuações devem ser aceitos como parte dos títulos.
- [ ] O tamanho do título deve ser limitado a no máximo 150 caracteres.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa
