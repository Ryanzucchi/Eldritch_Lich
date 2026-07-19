### Caso de Uso: Realizar chamadas de áudio

**ID:** UC-363  
**Requisito relacionado:** RF-362 (realizar chamadas de áudio)  
**Ator(es):** Colaborador A (Iniciador), Colaborador B (Receptor), Sistema  
**Pré-condições:** Ambos os colaboradores estão online na plataforma com dispositivos de áudio ativados.  
**Gatilho:** O Colaborador A clica em "Iniciar Chamada de Voz" na conversa privada com o Colaborador B.  

**Fluxo principal:**
1. O Colaborador A abre a DM do Colaborador B e clica no ícone de telefone.
2. O sistema inicializa a sinalização WebRTC em background e exibe a tela de discagem.
3. O Colaborador B recebe uma notificação instantânea com som de chamada e botões de atender e recusar.
4. O Colaborador B clica em "Atender".
5. O sistema estabelece uma conexão P2P direta por WebRTC de streaming de áudio.
6. Ambos os colaboradores conversam por voz em tempo real.
7. O Colaborador A desliga e a chamada é encerrada de forma limpa.

**Fluxos alternativos:**
- *Chamada em Canal de Voz:* Os membros entram em uma sala de voz aberta clicando em "Entrar na Sala". O sistema conecta o streaming de áudio de todos os participantes que estiverem na sala simultaneamente.

**Fluxos de exceção:**
- *Sem resposta:* Se o receptor não atender após 30 segundos, o sistema desliga a discagem automática e registra a chamada de voz como "Chamada perdida" no histórico do chat.

**Pós-condições:** A chamada WebRTC é conectada, permitindo o tráfego de streaming de voz em tempo real.

**Critérios de aceite:**
- [ ] A latência de transmissão de áudio em rede de banda larga estável deve ser de no máximo 150ms.
- [ ] O sistema deve implementar algoritmos de cancelamento de eco e supressão de ruído de fundo ativos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
