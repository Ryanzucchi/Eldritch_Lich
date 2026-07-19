### Caso de Uso: Editar textos

**ID:** UC-002  
**Requisito relacionado:** RF-2 (editar textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto a ser editado já existe no projeto aberto e o usuário possui permissão de escrita.  
**Gatilho:** O usuário clica em um texto existente no painel lateral de navegação ou busca por ele.  

**Fluxo principal:**
1. O usuário seleciona o texto desejado na árvore de arquivos lateral.
2. O sistema carrega o conteúdo atual do texto e o renderiza no editor de texto.
3. O usuário posiciona o cursor no editor e realiza alterações (inserção, deleção ou modificação de texto).
4. O sistema atualiza o conteúdo em tempo real na interface do usuário.

**Fluxos alternativos:**
- *Visualização sem permissão de escrita:* Se o usuário tiver papel de apenas "Leitor", o sistema desabilita o cursor e a entrada de texto no editor, exibindo apenas o modo leitura.

**Fluxos de exceção:**
- *Documento bloqueado:* Se o documento estiver sendo editado de forma exclusiva por outro usuário (com bloqueio ativo), o sistema exibe um banner informativo de "Documento em edição por [Usuário]" e bloqueia a escrita, abrindo-o apenas para leitura.

**Pós-condições:** O texto editado reflete as modificações realizadas na interface do usuário.

**Critérios de aceite:**
- [ ] Ao clicar no texto, a interface do editor deve carregar o conteúdo em menos de 1 segundo para arquivos de até 100 mil palavras.
- [ ] O usuário deve ser capaz de selecionar, copiar, cortar e colar trechos de texto usando atalhos de teclado padrão (Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A).
- [ ] O histórico local de edição deve suportar desfazer (Undo) pelo menos as últimas 50 ações da sessão atual.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa
