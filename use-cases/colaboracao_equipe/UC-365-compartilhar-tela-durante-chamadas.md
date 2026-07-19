### Caso de Uso: Compartilhar tela durante chamadas

**ID:** UC-365  
**Requisito relacionado:** RF-364 (compartilhar tela durante chamadas)  
**Ator(es):** Apresentador (Colaborador na chamada), Sistema, Ouvintes  
**Pré-condições:** Chamada WebRTC de voz/vídeo ativa e conectada.  
**Gatilho:** O apresentador clica no botão "Compartilhar Tela" no painel da chamada.  

**Fluxo principal:**
1. Durante a chamada de vídeo, o apresentador clica no ícone "Compartilhar Tela".
2. O navegador exibe a janela padrão do sistema operacional solicitando a seleção da janela ou tela cheia a ser transmitida.
3. O apresentador seleciona a opção correspondente e confirma.
4. O sistema captura o stream visual do display por meio da API de captura de tela do navegador.
5. O sistema desvia o stream de câmera e transmite o stream da tela capturada para a conexão WebRTC ativa.
6. Os demais ouvintes na chamada visualizam a tela do apresentador renderizada no espaço principal da videochamada.

**Fluxos alternativos:**
- *Compartilhar guia específica:* O usuário escolhe transmitir apenas uma guia específica do navegador para fins de privacidade de sua área de trabalho.

**Fluxos de exceção:**
- *Cancelamento da permissão:* Se o usuário recusar o popover de seleção de janela do navegador, o sistema cancela o processo de compartilhamento de tela e restaura a transmissão padrão de sua câmera sem interrupções.

**Pós-condições:** O sinal visual da tela selecionada é transmitido aos demais integrantes conectados na chamada.

**Critérios de aceite:**
- [ ] A renderização da tela compartilhada deve ser otimizada para legibilidade de textos pequenos.
- [ ] O delay visual entre a ação física do apresentador e a exibição para os ouvintes deve ser inferior a 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
