### Caso de Uso: Excluir textos

**ID:** UC-005  
**Requisito relacionado:** RF-5 (excluir textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto a ser excluído existe no projeto e o usuário tem permissões para editá-lo.  
**Gatilho:** O usuário clica com o botão direito no texto na barra lateral e seleciona "Excluir", ou usa o botão "Excluir" no menu do documento.  

**Fluxo principal:**
1. O usuário seleciona a opção "Excluir" correspondente a um texto do projeto.
2. O sistema apresenta um modal de confirmação: "Deseja mover '[Título]' para a Lixeira?".
3. O usuário clica em "Mover para Lixeira".
4. O sistema altera o status do texto no banco de dados para `deletado = true` e preenche a timestamp `deletado_em`.
5. O texto é ocultado da lista principal da árvore de arquivos.
6. Uma mensagem curta é exibida confirmando a operação.

**Fluxos alternativos:**
- *Cancelamento:* Se o usuário clicar em "Cancelar" ou fechar o modal, a ação é abortada e nenhuma alteração é feita.

**Fluxos de exceção:**
- *Erro de permissão:* Se o usuário tiver permissão de apenas "Leitor", o botão "Excluir" é exibido desabilitado (ou oculto). Qualquer chamada direta ao endpoint de exclusão retorna HTTP 403 Forbidden.

**Pós-condições:** O texto é marcado como deletado logicamente no banco de dados e movido para a pasta virtual da Lixeira do projeto.

**Critérios de aceite:**
- [ ] O sistema não deve excluir fisicamente o texto imediatamente; ele deve passar por uma lixeira (soft-delete).
- [ ] O modal de confirmação deve exibir claramente o título do arquivo que será excluído.
- [ ] O arquivo excluído deve sumir da listagem e navegação principal do projeto imediatamente.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
