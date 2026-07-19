### Caso de Uso: Baixar imagens individuais da galeria

**ID:** UC-274  
**Requisito relacionado:** RF-274 (baixar imagens individuais da galeria)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A imagem existe e está cadastrada na galeria de mídias do projeto.  
**Gatilho:** O usuário clica no botão "Baixar Imagem" no lightbox da galeria.  

**Fluxo principal:**
1. O usuário acessa a Galeria de Mídias e abre a imagem desejada em modo lightbox.
2. O usuário clica no botão "Baixar Original" ou "Download".
3. O sistema recupera a URL física do arquivo no servidor e força a resposta HTTP contendo os cabeçalhos de download.
4. O navegador inicia o download do arquivo diretamente para a pasta local correspondente da máquina do usuário.

**Fluxos alternativos:**
- *Salvar imagem de capa:* O usuário clica com o botão direito na foto da capa do projeto e seleciona "Salvar imagem como" nativo do navegador para download imediato.

**Fluxos de exceção:**
- *Erro de mídia:* Se a URL da imagem estiver corrompida na nuvem, o sistema alerta: "Falha no download. Arquivo de mídia indisponível".

**Pós-condições:** O arquivo físico da imagem original é baixado na máquina do usuário.

**Critérios de aceite:**
- [ ] O download deve fornecer o arquivo na mesma resolução e formato cadastrados após otimização (WebP/PNG/JPG).
- [ ] O início do download no navegador deve ser instantâneo.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
