### Caso de Uso: Exportar textos em formato EPUB

**ID:** UC-162  
**Requisito relacionado:** RF-162 (exportar textos em formato EPUB)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto ou pasta selecionada existe no projeto.  
**Gatilho:** O usuário clica em "Exportar para EPUB" no menu de exportação.  

**Fluxo principal:**
1. O usuário seleciona "Exportar como EPUB (eBook)" no menu de exportação.
2. O sistema abre um formulário solicitando metadados do eBook: Título, Nome do Autor, Gênero e Imagem de Capa.
3. O usuário preenche as informações, envia a capa e clica em "Gerar EPUB".
4. O backend agrupa os capítulos e gera o arquivo estruturado compactado no padrão EPUB.
5. O sistema inicia o download automático do arquivo `.epub`.

**Fluxos alternativos:**
- *Layout fluido:* O sistema gera o EPUB com layout flexível que se adapta a leitores de diversos tamanhos de e-reader.

**Fluxos de exceção:**
- *Capítulos sem título:* Se houver capítulos sem nome, o sistema atribui títulos temporários estruturados (ex: "Capítulo X") na tabela de conteúdos (TOC).

**Pós-condições:** O arquivo digital EPUB compatível com leitores digitais é gerado e baixado.

**Critérios de aceite:**
- [ ] O EPUB gerado deve passar com sucesso no validador oficial `epubcheck`.
- [ ] O arquivo gerado deve conter o Sumário interativo funcional (TOC).

**Prioridade:** Alta  
**Complexidade estimada:** Alta
