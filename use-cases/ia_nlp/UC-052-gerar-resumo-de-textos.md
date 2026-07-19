### Caso de Uso: Gerar resumo de textos

**ID:** UC-052  
**Requisito relacionado:** RF-52 (gerar resumo de textos)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto do documento possui conteúdo no editor.  
**Gatilho:** O usuário clica em "Gerar Resumo" na aba de assistência ou no menu do documento.  

**Fluxo principal:**
1. O usuário seleciona o tamanho do resumo desejado (curto, médio, longo).
2. O sistema envia o texto do documento para a IA de sumarização.
3. A IA lê e gera um resumo estruturado contendo os acontecimentos principais do capítulo ou cena.
4. O sistema exibe o resumo gerado em um modal ou aba dedicada.
5. O usuário revisa o resumo e clica em "Salvar nos metadados do documento" para arquivá-lo como sinopse daquele texto.

**Fluxos alternativos:**
- *Resumo de pasta:* O usuário solicita o resumo de uma pasta inteira. O sistema lê os resumos de todos os arquivos contidos na pasta e gera um resumo consolidado do arco correspondente.

**Fluxos de exceção:**
- *Texto excessivamente curto:* Se o texto possuir menos de 100 palavras, o sistema avisa que o texto já é curto e não gera o resumo.

**Pós-condições:** O resumo gerado é salvo nas propriedades do documento/pasta.

**Critérios de aceite:**
- [ ] O resumo deve preservar nomes de entidades principais (personagens e locais chave).
- [ ] O processamento e geração de um resumo para um texto de 3.000 palavras devem demorar menos de 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média
