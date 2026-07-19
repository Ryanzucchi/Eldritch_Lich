### Caso de Uso: Exportar textos em formato PDF

**ID:** UC-161  
**Requisito relacionado:** RF-161 (exportar textos em formato PDF)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto a ser exportado existe e possui conteúdo.  
**Gatilho:** O usuário clica em "Exportar para PDF" nas opções do editor ou pasta.  

**Fluxo principal:**
1. O usuário abre um capítulo ou seleciona uma pasta de capítulos e escolhe "Exportar como PDF".
2. O sistema exibe um modal de configurações de exportação de PDF (margens, numeração, fonte, tamanho do papel e quebras de página).
3. O usuário ajusta as configurações e clica em "Gerar PDF".
4. O backend renderiza o texto em HTML e converte o stream para PDF utilizando bibliotecas de conversão.
5. O sistema inicia o download automático do arquivo `.pdf`.

**Fluxos alternativos:**
- *Exportar manuscrito completo:* O usuário seleciona a pasta raiz de textos e o sistema monta um único PDF consolidando todos os capítulos na sequência hierárquica.

**Fluxos de exceção:**
- *Mídia corrompida:* Se o texto contiver imagens que falharem no carregamento no servidor durante o render, o sistema as ignora e avisa o usuário de que o PDF foi gerado sem as respectivas mídias.

**Pós-condições:** O arquivo PDF com a formatação e paginação selecionadas é baixado pelo usuário.

**Critérios de aceite:**
- [ ] O PDF exportado deve reter cabeçalhos, rodapés e numeração sequencial configurados pelo usuário.
- [ ] A exportação de um capítulo de até 3.000 palavras deve demorar menos de 3 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média
