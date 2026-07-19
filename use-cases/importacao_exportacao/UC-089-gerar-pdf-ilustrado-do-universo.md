### Caso de Uso: Gerar PDF ilustrado do universo

**ID:** UC-089  
**Requisito relacionado:** RF-89 (gerar PDF ilustrado do universo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui textos, imagens de capa de pastas, de textos e fichas de personagens estruturadas.  
**Gatilho:** O usuário acessa "Exportar" -> "PDF Ilustrado do Universo".  

**Fluxo principal:**
1. O usuário seleciona o escopo de exportação e um estilo visual de layout (ex: "Livro de Regras").
2. O usuário clica em "Compilar PDF".
3. O backend envia uma requisição para a fila de renderização.
4. O motor de renderização constrói um HTML formatado com quebras de página, sumário dinâmico, números de páginas e cabeçalhos.
5. O sistema incorpora as imagens de capa das pastas como separadores de seções de página inteira e as imagens dos textos ao lado de suas descrições.
6. O sistema gera o PDF consolidado de alta resolução e inicia o download.

**Fluxos alternativos:**
- *Download assíncrono:* Para PDFs muito grandes (mais de 100 páginas), o sistema envia o processo para segundo plano e avisa ao usuário contendo o link de download assim que concluído.

**Fluxos de exceção:**
- *Imagens corrompidas:* Se o renderizador encontrar links de imagens quebrados, ele substitui a imagem por um placeholder de moldura cinza para não interromper a compilação do arquivo.

**Pós-condições:** O PDF ilustrado e formatado com a enciclopédia do universo do usuário é gerado e baixado.

**Critérios de aceite:**
- [ ] O PDF deve conter um índice/sumário dinâmico com numeração de páginas correspondente gerada automaticamente.
- [ ] A exportação de um documento ilustrado com 50 páginas e 20 imagens deve demorar menos de 15 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
