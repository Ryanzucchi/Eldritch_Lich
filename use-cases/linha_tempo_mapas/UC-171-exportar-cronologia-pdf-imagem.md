### Caso de Uso: Exportar cronologia (PDF/imagem)

**ID:** UC-171  
**Requisito relacionado:** RF-171 (exportar cronologia (PDF/imagem))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui uma timeline contendo eventos cronológicos salvos.  
**Gatilho:** O usuário clica em "Exportar Timeline" no painel da Linha do Tempo.  

**Fluxo principal:**
1. O usuário acessa a timeline do projeto.
2. O usuário clica no botão "Exportar" e escolhe o formato: "Imagem (.png)" ou "Documento (.pdf)".
3. O sistema renderiza o componente visual da timeline inteira em um elemento canvas no navegador.
4. O sistema converte o canvas para um arquivo de imagem de alta resolução (PNG) ou insere na página de um PDF estruturado.
5. O navegador inicia o download automático do arquivo.

**Fluxos alternativos:**
- *Exportar apenas intervalo:* O usuário seleciona datas de início e fim no modal de exportação, gerando o arquivo apenas com os eventos ocorridos no período delimitado.

**Fluxos de exceção:**
- *Timeline excessivamente longa:* Se a timeline contiver centenas de eventos que estouram a resolução máxima de renderização do navegador, o sistema força a conversão para PDF multi-páginas de forma automática como alternativa segura.

**Pós-condições:** O arquivo contendo a visualização gráfica da timeline é baixado pelo usuário.

**Critérios de aceite:**
- [ ] A imagem ou PDF exportado deve reter as cores das tags, linhas de conexão e fontes idênticas às exibidas na interface.
- [ ] O processamento do arquivo de exportação de até 50 eventos deve durar menos de 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média
