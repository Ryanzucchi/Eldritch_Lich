### Caso de Uso: Oferecer exportação de dados em múltiplos formatos com qualidade visual consistente (RNF)

**ID:** UC-449  
**Requisito relacionado:** RNF-Low-2 (exportação de dados em múltiplos formatos)  
**Ator(es):** Usuário (Escritor/Pesquisador), Sistema  
**Pré-condições:** Conversores e exportadores de formatos ativos no servidor.  
**Gatilho:** O usuário seleciona múltiplos formatos de exportação para baixar seu manuscrito.  

**Fluxo principal:**
1. O usuário abre as configurações de exportação de textos do projeto.
2. O usuário escolhe exportar o mesmo manuscrito em três formatos diferentes: PDF, EPUB e DOCX.
3. O usuário clica em "Iniciar Geração".
4. O backend recebe o texto e aciona os conversores utilizando templates de estilo equivalentes para cada formato de destino.
5. O sistema gera os três arquivos de forma a preservar a mesma formatação visual e estrutura (quebras de linha, imagens, notas de rodapé).
6. O sistema compacta os arquivos em formato ZIP e disponibiliza o download.

**Fluxos alternativos:**
- *Geração unitária:* O usuário seleciona exportar apenas um capítulo isolado em formato PDF.

**Fluxos de exceção:**
- *Erro de compilação em um formato:* Se o parser do formato EPUB quebrar por caracteres inválidos, o sistema suspende o arquivo EPUB, gera os PDFs e DOCX com sucesso e alerta o usuário sobre a inconsistência no arquivo EPUB.

**Pós-condições:** Os arquivos do livro formatados de forma equivalente nos múltiplos formatos selecionados são gerados e disponibilizados para download.

**Critérios de aceite:**
- [ ] A formatação de negritos, itálicos, imagens embutidas e notas de rodapé deve ser preservada em todos os formatos de exportação.
- [ ] A geração simultânea de 3 formatos para um livro de 100 páginas deve durar menos de 10 segundos no servidor.

**Prioridade:** Média  
**Complexidade estimada:** Alta
