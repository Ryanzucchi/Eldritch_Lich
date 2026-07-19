### Caso de Uso: Exportar textos em docx / criar notas atômicas (uma ideia por nota)

**ID:** UC-325  
**Requisito relacionado:** RF-324 (exportar textos em docx / criar notas atômicas)  
**Ator(es):** Usuário (Escritor/Pesquisador), Sistema  
**Pré-condições:** O usuário está editando textos no projeto.  
**Gatilho:** O usuário clica em "Exportar em DOCX" ou seleciona "Criar Nota Atômica" na barra de brainstorm.  

**Fluxo principal (Criação de Nota Atômica):**
1. O usuário clica em "Nova Nota Atômica" no caderno de ideias do projeto.
2. O sistema abre um editor minimalista solicitando o título (ideia central) e corpo da nota (deve ser conciso, focado em uma única ideia).
3. O usuário insere a ideia central e adiciona tags de conceito.
4. O usuário clica em "Salvar".
5. O sistema grava o registro com identificador UID único e permanente no banco de dados.

**Fluxo principal (Exportação em DOCX):**
1. O usuário abre o texto e clica no botão de exportação selecionando o formato DOCX.
2. O sistema processa o arquivo formatando cabeçalhos e parágrafos de forma compatível com arquivos .docx.
3. O download do arquivo Word é iniciado de forma automática pelo navegador.

**Fluxos alternativos:**
- *Converter seleção em nota atômica:* Ao editar um texto longo, o usuário seleciona um parágrafo, clica com o botão direito e escolhe "Extrair para Nota Atômica". O sistema cria a nota atômica vinculada e insere uma referência no texto original.

**Fluxos de exceção:**
- *Texto excessivamente longo na nota:* Se o usuário tentar digitar mais de 300 palavras na nota atômica, o sistema exibe um aviso sutil sobre a importância da atomicidade, recomendando criar subnotas se necessário.

**Pós-condições:** A nota atômica com UID exclusivo é persistida no banco ou o arquivo Word correspondente é exportado.

**Critérios de aceite:**
- [ ] A exportação em Word deve reter cabeçalhos H1, H2, H3 e notas de rodapé de forma nativa e compatível com editores de texto tradicionais.
- [ ] O salvamento da nota atômica deve demorar menos de 100ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
