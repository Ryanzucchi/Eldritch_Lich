### Caso de Uso: Formatar texto em formatos científicos variáveis

**ID:** UC-324  
**Requisito relacionado:** RF-323 (formatar texto em formatos cientificos variaveis)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** Manuscrito escrito e estruturado no projeto.  
**Gatilho:** O usuário clica em "Formatar Manuscrito" na aba de visualização do artigo.  

**Fluxo principal:**
1. O usuário abre o manuscrito científico e clica no painel "Formatação Avançada".
2. O sistema exibe os modelos de periódicos homologados: "Template ABNT Artigo", "Template Nature", "Template IEEE", "Template Elsevier".
3. O usuário seleciona o template desejado (ex: "Template Nature").
4. O sistema processa o documento e aplica a formatação exigida (colunas, família/tamanho de fontes, recuos, títulos, afiliações e cabeçalhos).
5. O usuário visualiza o artigo formatado na tela através de um painel de pré-visualização de PDF.

**Fluxos alternativos:**
- *Template customizado:* O usuário ajusta as diretrizes manuais de formatação (espaçamento, recuos, fontes) salvando como modelo privado da sua instituição de ensino.

**Fluxos de exceção:**
- *Tabelas muito largas:* Se o documento possuir tabelas que transbordem o layout de duas colunas do template selecionado, o sistema exibe um alerta e ajusta automaticamente a tabela para ocupar a largura total da página (bloco de coluna única) mantendo a legibilidade.

**Pós-condições:** O texto do manuscrito é formatado de acordo com as regras estruturais e visuais do periódico selecionado.

**Critérios de aceite:**
- [ ] A re-renderização da pré-visualização formatada do manuscrito na tela deve demorar menos de 4 segundos.
- [ ] O documento deve respeitar rigorosamente as margens e limites de número de páginas configurados no estilo.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
