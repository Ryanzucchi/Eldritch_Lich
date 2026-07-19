### Caso de Uso: Colar imagens em textos

**ID:** UC-065  
**Requisito relacionado:** RF-65 (colar imagens em textos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O editor de texto está focado e o usuário tem uma imagem em sua área de transferência (Clipboard).  
**Gatilho:** O usuário pressiona o atalho Ctrl+V (ou Cmd+V) com o editor focado.  

**Fluxo principal:**
1. O usuário pressiona Ctrl+V no editor de texto tendo uma imagem no clipboard.
2. O sistema intercepta o evento de colagem (Clipboard API) e extrai o arquivo binário da imagem.
3. O sistema envia a imagem de forma assíncrona para o servidor de armazenamento de mídia (S3/Cloud Storage) e exibe um indicador de progresso ("Carregando imagem...") no editor.
4. O servidor salva a imagem, gera um link permanente e retorna para a interface.
5. O editor substitui o indicador de upload pela tag de imagem (`<img>`) renderizando-a inline no parágrafo de destino.

**Fluxos alternativos:**
- *Inserir imagem offline:* Se o usuário estiver offline, a imagem é codificada em Base64 e salva temporariamente no banco IndexedDB local até a sincronização.

**Fluxos de exceção:**
- *Tamanho da imagem excedido:* Se a imagem for maior que o limite permitido (ex: 8MB), o sistema cancela o envio e exibe: "Erro: A imagem excede o tamanho máximo de 8MB".

**Pós-condições:** A imagem é exibida no editor de texto e armazenada no servidor de mídia.

**Critérios de aceite:**
- [ ] O sistema deve aceitar arquivos nos formatos comuns: `.png`, `.jpg`, `.jpeg`, `.webp` e `.gif`.
- [ ] O upload da imagem colada deve ser assíncrono, sem congelar a tela do usuário.

**Prioridade:** Alta  
**Complexidade estimada:** Média
