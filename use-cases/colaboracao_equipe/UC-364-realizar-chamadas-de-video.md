### Caso de Uso: Realizar chamadas de vídeo

**ID:** UC-364  
**Requisito relacionado:** RF-363 (realizar chamadas de vídeo)  
**Ator(es):** Colaborador A, Colaborador B, Sistema  
**Pré-condições:** Navegador com acesso permitido à câmera e ao microfone em ambos os dispositivos.  
**Gatilho:** O Colaborador A clica em "Iniciar Chamada de Vídeo" na conversa com B.  

**Fluxo principal:**
1. O Colaborador A abre o painel de chat de B e clica no ícone de filmadora.
2. O sistema abre a prévia local de câmera do Colaborador A e envia sinalização de chamada de vídeo para B.
3. O Colaborador B visualiza a chamada recebida e clica em "Atender com Vídeo".
4. O sistema estabelece a conexão WebRTC ativando a transmissão de streams de áudio e vídeo de ambas as partes.
5. A interface exibe a imagem em tela cheia do interlocutor e a miniatura local da própria câmera no canto da tela.
6. Ambos os colaboradores conversam por vídeo ao vivo.

**Fluxos alternativos:**
- *Desativar câmera:* O usuário clica no botão "Desativar Vídeo". O sistema para de enviar o stream de vídeo, mantendo apenas a transmissão de áudio ativa de forma contínua.

**Fluxos de exceção:**
- *Dispositivo ausente:* Se o sistema não detectar câmera conectada na máquina do iniciador, impede a chamada e avisa: "Câmera não detectada. Tente iniciar uma chamada puramente de voz".

**Pós-condições:** O streaming de vídeo e áudio em tempo real é estabelecido entre os colaboradores.

**Critérios de aceite:**
- [ ] O stream de vídeo deve se ajustar dinamicamente em termos de resolução (bitrate adaptativo) conforme a qualidade da internet (de 360p a 1080p).
- [ ] A taxa de quadros de vídeo deve se manter em 30fps em conexões de banda larga estáveis.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
