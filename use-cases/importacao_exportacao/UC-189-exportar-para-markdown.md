### Caso de Uso: Exportar para Markdown

**ID:** UC-189  
**Requisito relacionado:** RF-189 (exportar para Markdown)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto a ser exportado existe e possui conteúdo.  
**Gatilho:** O usuário clica em "Exportar como Markdown" nas opções do editor.  

**Fluxo principal:**
1. O usuário abre o capítulo e clica em "Exportar".
2. O usuário escolhe o formato "Markdown (.md)".
3. O sistema converte a formatação do editor para sintaxe Markdown correspondente.
4. O sistema monta o arquivo de texto bruto com a extensão `.md`.
5. O navegador inicia o download do arquivo de forma automática.

**Fluxos alternativos:**
- *Preservar Wiki-links:* O usuário ativa a flag de exportação de wiki-links, convertendo links internos do projeto no formato `[[Nome do Arquivo]]`.

**Fluxos de exceção:**
- *Tabelas complexas:* O sistema converte tabelas do texto para o formato de tabelas GFM (GitHub Flavored Markdown).

**Pós-condições:** O arquivo em texto puro estruturado em Markdown (.md) é gerado e baixado.

**Critérios de aceite:**
- [ ] O arquivo exportado deve utilizar codificação UTF-8 para reter acentuações e caracteres especiais da língua portuguesa.
- [ ] A conversão e download devem demorar menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
