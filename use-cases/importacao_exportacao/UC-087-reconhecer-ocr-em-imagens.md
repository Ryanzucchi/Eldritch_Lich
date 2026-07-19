### Caso de Uso: Reconhecer OCR em imagens

**ID:** UC-087  
**Requisito relacionado:** RF-87 (reconhecer OCR em imagens)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O usuário realizou o upload de uma imagem que contém caracteres textuais.  
**Gatilho:** O usuário clica em "Reconhecer Texto (OCR)" sobre a imagem carregada na galeria.  

**Fluxo principal:**
1. O sistema envia a imagem para o serviço de OCR no backend.
2. O motor de OCR processa os padrões visuais da imagem para identificar letras e números.
3. O sistema mapeia os blocos de texto identificados na imagem.
4. O sistema apresenta o resultado em uma janela modal exibindo a imagem de um lado e o texto extraído do outro.

**Fluxos alternativos:**
- *OCR automático no upload:* Se a configuração de OCR automático estiver ligada, o sistema extrai o texto invisivelmente no momento do upload.

**Fluxos de exceção:**
- *Imagem sem texto legível:* Se o motor de OCR retornar nenhuma letra identificada, o sistema notifica: "Nenhum texto legível foi detectado nesta imagem".

**Pós-condições:** O texto presente na imagem é reconhecido e preparado para extração física.

**Critérios de aceite:**
- [ ] O sistema de OCR deve suportar reconhecimento em língua portuguesa, incluindo acentuações.
- [ ] O processamento de imagens de até 4K de resolução deve demorar no máximo 5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
