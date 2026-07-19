### Caso de Uso: Exportar textos

**ID:** UC-008  
**Requisito relacionado:** RF-8 (exportar textos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto a ser exportado existe no projeto e possui conteúdo.  
**Gatilho:** O usuário clica em "Exportar" no menu de opções do texto.  

**Fluxo principal:**
1. O usuário acessa o menu de contexto do texto e seleciona "Exportar".
2. O sistema exibe um modal para seleção do formato de exportação (.txt, .md, .docx, .pdf) e preferências de estilo (margem, tamanho de fonte).
3. O usuário escolhe o formato desejado (ex: Markdown) e confirma a exportação.
4. O sistema gera dinamicamente o arquivo com o conteúdo do editor, aplicando o template selecionado.
5. O sistema inicia o download automático do arquivo no navegador do usuário com o nome `[titulo_do_texto].[extensao]`.

**Fluxos alternativos:**
- *Exportar todo o projeto:* O usuário seleciona exportar a partir da raiz do projeto, gerando um arquivo consolidado ou um pacote ZIP com a estrutura de pastas e arquivos preservados.

**Fluxos de exceção:**
- *Falha de renderização do PDF:* O sistema de geração de PDF atinge timeout ou apresenta falha de memória. O sistema cancela o processo, notifica o usuário ("Não foi possível exportar em PDF. Tente os formatos .md ou .txt") e registra o log de erro.

**Pós-condições:** O arquivo com o conteúdo do editor é baixado na máquina do usuário sem alterações na base de dados.

**Critérios de aceite:**
- [ ] A exportação para Markdown deve preservar tags html sanitizadas ou manter a marcação padrão de sintaxe (Markdown puro).
- [ ] A exportação em PDF deve manter a quebra de páginas correta e margens padrões do padrão A4.
- [ ] O download deve iniciar de forma automática e assíncrona, sem recarregar a interface web.

**Prioridade:** Alta  
**Complexidade estimada:** Média
