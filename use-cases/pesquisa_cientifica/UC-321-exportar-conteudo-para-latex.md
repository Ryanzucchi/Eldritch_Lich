### Caso de Uso: Exportar conteúdo para LaTeX

**ID:** UC-321  
**Requisito relacionado:** RF-320 (exportar conteúdo para LaTeX)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** O projeto acadêmico possui textos, fórmulas e referências bibliográficas cadastradas.  
**Gatilho:** O usuário seleciona "Exportar para LaTeX (.tex)" no menu de exportações do projeto.  

**Fluxo principal:**
1. O usuário acessa o menu de exportação de textos acadêmicos.
2. O usuário seleciona a opção "Formato LaTeX (.tex)".
3. O usuário configura as opções de preâmbulo (classe do documento: article, report, book).
4. O usuário clica em "Exportar".
5. O backend processa o texto estruturado da aplicação, convertendo a formatação rica para tags LaTeX (ex: negrito vira `\textbf{}`), fórmulas matemáticas para blocos matemáticos (`$math$`) e referências para comandos `\cite{}`.
6. O sistema empacota o arquivo `.tex` e o arquivo de referências `.bib` em um arquivo compactado `.zip` e inicia o download.

**Fluxos alternativos:**
- *Exportação via Overleaf API:* O usuário clica em "Enviar para Overleaf", que carrega e abre o projeto diretamente no editor online Overleaf parceiro via integração de API.

**Fluxos de exceção:**
- *Caracteres especiais:* O parser limpa e escapa de forma automática caracteres especiais do LaTeX (como `%`, `_`, `&`, `#`) contidos no texto corrido para evitar que o arquivo final apresente erros de compilação.

**Pós-condições:** O arquivo compactado contendo o código-fonte LaTeX (.tex) e a base de bibliografia (.bib) é gerado e baixado.

**Critérios de aceite:**
- [ ] O código LaTeX gerado deve ser compilável sem erros em compiladores padrão (como pdfLaTeX).
- [ ] O tempo total de geração do ZIP de exportação deve ser de no máximo 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média
