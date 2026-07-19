### Caso de Uso: Otimizar uso de armazenamento (compressão de imagens, textos) (RNF)

**ID:** UC-452  
**Requisito relacionado:** RNF-Low-5 (otimização e compressão de armazenamento)  
**Ator(es):** Sistema, Backend (Módulo de Compressão)  
**Pré-condições:** Utilitários de compressão e redimensionamento de imagens (ex: Sharp) e dados configurados no servidor.  
**Gatilho:** O usuário realiza upload de imagens pesadas ou salva grandes volumes de texto.  

**Fluxo principal:**
1. O usuário realiza o upload de um arquivo de imagem pesado para a galeria de mídias.
2. O backend recebe o arquivo correspondente na rota de uploads.
3. O sistema direciona o arquivo para o processador de imagens Sharp.
4. O processador comprime, otimiza e converte o arquivo para formatos modernos de alta eficiência (ex: WebP/AVIF), reduzindo o tamanho de armazenamento.
5. O sistema grava o arquivo comprimido no bucket de mídias correspondente e atualiza os links no banco de dados.

**Fluxos alternativos:**
- *Compressão de dados do banco:* O sistema comprime periodicamente logs de texto e históricos de versões inativas do banco de dados utilizando algoritmos sem perda de dados (Brotli/Gzip) para poupar espaço em disco.

**Fluxos de exceção:**
- *Arquivo corrompido:* Se a imagem enviada estiver danificada ou em formato inválido que impeça o processamento, o sistema cancela o upload e informa o erro na tela.

**Pós-condições:** O arquivo compactado e otimizado é armazenado no bucket de mídias, economizando espaço em disco.

**Critérios de aceite:**
- [ ] O tamanho do arquivo de imagem comprimida em formato WebP deve ser de no mínimo 60% menor em relação à imagem crua original.
- [ ] O processamento e conversão de uma imagem de 10MB devem demorar menos de 1,5 segundos no servidor.

**Prioridade:** Média  
**Complexidade estimada:** Média
