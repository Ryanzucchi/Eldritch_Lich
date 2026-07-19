### Caso de Uso: Exportar para HTML

**ID:** UC-188  
**Requisito relacionado:** RF-188 (exportar para HTML)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto a ser exportado existe no projeto.  
**Gatilho:** O usuário clica em "Exportar como HTML" no painel de exportações do editor.  

**Fluxo principal:**
1. O usuário abre o capítulo e clica em "Exportar".
2. O usuário seleciona a opção "Página Web (.html)".
3. O sistema converte a estrutura do editor de rich-text para marcação HTML limpa contendo as tags semânticas.
4. O sistema gera um arquivo contendo os cabeçalhos HTML5 adequados e o CSS inline embutido.
5. O navegador inicia o download do arquivo `.html`.

**Fluxos alternativos:**
- *Exportar site estático:* O usuário exporta a pasta inteira. O sistema gera uma árvore contendo múltiplos arquivos HTML interligados por links funcionais.

**Fluxos de exceção:**
- *Mídias locais:* Se o texto contiver imagens anexadas localmente, o sistema as converte e as embute diretamente no HTML usando Base64.

**Pós-condições:** O arquivo HTML independente com o texto formatado é baixado pelo usuário.

**Critérios de aceite:**
- [ ] O código HTML gerado deve passar nas validações básicas de sintaxe HTML5.
- [ ] O tempo total de compilação da página estática deve ser menor que 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
