### Caso de Uso: Compactar imagens automaticamente no upload (otimização)

**ID:** UC-273  
**Requisito relacionado:** RF-273 (compactar imagens automaticamente no upload)  
**Ator(es):** Sistema  
**Pré-condições:** O usuário iniciou o upload de um arquivo de imagem de alta resolução.  
**Gatilho:** Envio do arquivo de imagem à API de uploads do backend.  

**Fluxo principal:**
1. O usuário seleciona uma imagem pesada para carregar no perfil ou ficha técnica.
2. O backend recebe o arquivo na pasta temporária.
3. O sistema aciona um pipeline de compressão de imagem em background.
4. O script de otimização converte a imagem para o formato WebP, limita as dimensões máximas de largura/altura mantendo a proporção, e aplica compressão de qualidade imperceptível ao olho humano.
5. A imagem final comprimida e otimizada é salva na nuvem de armazenamento e vinculada à ficha do usuário.

**Fluxos alternativos:**
- *Gerar miniaturas:* O sistema gera adicionalmente uma cópia miniatura em resolução baixa para ser usada como avatar em cabeçalhos sem sobrecarregar a banda de rede.

**Fluxos de exceção:**
- *Arquivos vetoriais/gifs:* Se o arquivo for um vetor (.svg) ou animação (.gif), o sistema ignora a compressão e salva o arquivo original intacto para não corromper o formato.

**Pós-condições:** A imagem otimizada e convertida em WebP é armazenada no servidor.

**Critérios de aceite:**
- [ ] A taxa de redução média de tamanho de arquivos JPG/PNG convertidos em WebP deve ser de pelo menos 60%.
- [ ] O processamento e compressão da imagem devem demorar menos de 1,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média
