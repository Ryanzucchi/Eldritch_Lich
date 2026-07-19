### Caso de Uso: Moderar salas de reunião (mutar, expulsar, etc.)

**ID:** UC-369  
**Requisito relacionado:** RF-368 (moderar salas de reunião)  
**Ator(es):** Moderador/Organizador, Ouvintes, Sistema  
**Pré-condições:** Sala de reunião virtual ativa e conectada com múltiplos membros. O ator possui privilégios de moderador.  
**Gatilho:** O moderador executa uma ação de controle sobre um participante no painel.  

**Fluxo principal:**
1. O moderador abre a lista de participantes conectados na chamada de vídeo.
2. O moderador identifica um participante com ruído de fundo ou microfone aberto acidentalmente.
3. O moderador passa o mouse sobre o nome do participante correspondente e clica em "Mutar Participante".
4. O sistema envia uma sinalização via WebSocket para o cliente do usuário mutado, forçando o fechamento do seu dispositivo de microfone de forma remota.
5. O ícone de status de som do participante é alterado para mutado na chamada global.

**Fluxos alternativos:**
- *Expulsar da chamada:* O moderador clica em "Expulsar Participante". O sistema desconecta a sessão WebRTC do usuário de imediato e o redireciona de volta para a tela inicial, bloqueando temporariamente sua re-entrada na sala.

**Fluxos de exceção:**
- *Queda de conexão do moderador:* Se o moderador perder a conexão de rede no meio da reunião, o sistema elege o segundo participante mais antigo como moderador provisório para garantir a integridade da sala.

**Pós-condições:** As ações de moderação (mutar, bloquear vídeo, expulsar) são processadas, modificando o estado ativo da chamada.

**Critérios de aceite:**
- [ ] A latência de execução de ações de moderação deve ser de no máximo 100ms após o clique do moderador.
- [ ] A notificação visual de moderação deve ser exibida na tela do participante afetado.

**Prioridade:** Média  
**Complexidade estimada:** Média
