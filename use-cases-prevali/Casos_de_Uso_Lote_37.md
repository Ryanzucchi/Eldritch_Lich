# Casos de Uso - Lote 37 (UC-361 a UC-370)

Este documento contém a especificação dos casos de uso de 361 a 370 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Enviar mensagens de texto (chat)

**ID:** UC-361  
**Requisito relacionado:** RF-360 (enviar mensagens de texto (chat))  
**Ator(es):** Colaborador, Sistema  
**Pré-condições:** O colaborador está associado a um canal de chat ativo ou iniciou uma conversa direta (DM).  
**Gatilho:** O colaborador digita uma mensagem no campo de chat e pressiona Enter.  

**Fluxo principal:**
1. O colaborador abre a aba de chat do canal correspondente.
2. O colaborador digita a mensagem no input inferior da tela (ex: "Olá equipe, fiz o commit das correções").
3. O colaborador pressiona Enter ou clica no botão de envio.
4. O sistema valida que a mensagem possui conteúdo legível válido.
5. O sistema grava a mensagem na tabela correspondente e envia os dados de forma instantânea para todos os membros conectados via WebSockets.
6. A interface dos demais colaboradores conectados no canal renderiza a nova mensagem imediatamente.

**Fluxos alternativos:**
- *Mencionar usuário (@mention):* O usuário digita `@` seguido do nome do colega. O sistema exibe autocomplete de membros. Ao selecionar, insere um link visual para o perfil e dispara uma notificação push de alta prioridade para o mencionado.

**Fluxos de exceção:**
- *Queda de conexão:* Se a mensagem falhar no envio por instabilidade de rede, o sistema sinaliza a mensagem com um ícone de alerta vermelho ("Falha ao enviar") e disponibiliza a opção de reenvio.

**Pós-condições:** A mensagem é gravada no banco de dados e disponibilizada na timeline do chat.

**Critérios de aceite:**
- [ ] A velocidade de entrega de mensagens de texto corrido deve ser de no máximo 200ms entre os clientes conectados.
- [ ] A interface deve reter as últimas 100 mensagens em cache local do navegador para rolagem rápida.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Enviar mensagens de voz

**ID:** UC-362  
**Requisito relacionado:** RF-361 (enviar mensagens de voz)  
**Ator(es):** Colaborador, Sistema  
**Pré-condições:** Canal de chat ativo e permissão de microfone concedida nas configurações do navegador.  
**Gatilho:** O colaborador mantém pressionado o botão do microfone na área de texto do chat.  

**Fluxo principal:**
1. O colaborador clica e segura o ícone de microfone no chat.
2. O sistema ativa a API de áudio do navegador e inicia a captação do som ambiente.
3. O colaborador fala sua mensagem.
4. Ao soltar o botão, o sistema finaliza a captação, converte o áudio bruto para um arquivo comprimido (formato OGG ou MP3) e inicia o upload em background.
5. O backend grava o arquivo de áudio no bucket de mídia, insere a referência no banco e notifica o canal do chat.
6. A interface dos destinatários exibe o player contendo a forma de onda do som e botões de reprodução.

**Fluxos alternativos:**
- *Cancelar gravação:* Durante a fala, o colaborador arrasta o cursor para o lado esquerdo (ícone da lixeira). O sistema descarta a gravação de áudio em andamento sem realizar upload.

**Fluxos de exceção:**
- *Permissão negada:* Se o navegador não possuir permissões de captura de voz, o sistema interrompe a ação exibindo o aviso: "Acesso ao microfone negado".

**Pós-condições:** O arquivo da mensagem de voz é armazenado no bucket de mídias e listado na timeline do chat.

**Critérios de aceite:**
- [ ] A compressão do áudio deve manter a taxa de bits adequada para voz sem gerar arquivos gigantescos (tamanho médio de 1MB por minuto de fala).
- [ ] O player integrado deve permitir aceleração de velocidade de reprodução (1.5x e 2x).

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
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

---
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

---
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

---
### Caso de Uso: Gravar chamadas

**ID:** UC-365  
**Requisito relacionado:** RF-365 (gravar chamadas)  
**Ator(es):** Organizador da Chamada, Sistema  
**Pré-condições:** Chamada online ativa e conectada.  
**Gatilho:** O organizador clica em "Iniciar Gravação" na interface da chamada.  

**Fluxo principal:**
1. Durante a reunião por vídeo, o organizador clica em "Gravar Reunião".
2. O sistema emite um alerta sonoro e visual para todos os participantes indicando o início da gravação.
3. O backend aciona o servidor de gravação de mídia de WebRTC para salvar e mesclar os fluxos de áudio e vídeo em andamento.
4. Ao término da reunião ou ao clicar em "Parar Gravação", o sistema encerra o arquivo de captura.
5. O backend codifica o arquivo final no formato MP4, calcula o hash de integridade e salva de forma protegida no bucket de gravação da conta, vinculando à ata da reunião.

**Fluxos alternativos:**
- *Gravar apenas áudio:* O organizador opta por salvar apenas a gravação das falas no formato MP3 para economizar cota de armazenamento em nuvem.

**Fluxos de exceção:**
- *Estouro de cota:* Se o armazenamento corporativo atingir o limite máximo, o sistema suspende a gravação do arquivo e alerta: "Gravação suspensa. Sem espaço disponível no servidor".

**Pós-condições:** O arquivo MP4/MP3 da reunião gravada é gerado e disponibilizado para download e visualização.

**Critérios de aceite:**
- [ ] O processamento e conversão final do vídeo gravado para disponibilização na ata devem durar menos de 10 minutos após o término da chamada.
- [ ] A gravação de vídeo deve reter com clareza a resolução do compartilhamento de tela quando ativo.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Transcrever chamadas gravadas automaticamente

**ID:** UC-367  
**Requisito relacionado:** RF-366 (transcrever chamadas gravadas automaticamente)  
**Ator(es):** Sistema, IA, Colaboradores  
**Pré-condições:** A gravação da chamada está concluída e o arquivo de áudio/vídeo correspondente está disponível no bucket.  
**Gatilho:** O sistema detecta a finalização do upload do arquivo de gravação.  

**Fluxo principal:**
1. O backend detecta a inserção do arquivo de áudio no bucket de gravação.
2. O sistema inicia o processamento assíncrono de transcrição automática por IA com identificação de oradores (diarização).
3. A IA converte o áudio em texto estruturado com marcas de tempo e nomes de quem fala.
4. Ao concluir, o sistema insere o texto bruto da transcrição no campo de transcrições da ata da reunião.
5. O sistema notifica os organizadores de que a transcrição está pronta para revisão.

**Fluxos alternativos:**
- *Tradução automática:* O usuário clica em "Traduzir Transcrição", e a IA gera uma versão paralela do texto traduzida em outros idiomas cadastrados.

**Fluxos de exceção:**
- *Qualidade péssima de áudio:* Se o sinal de áudio estiver muito ruidoso, a IA destaca trechos problemáticos com marcações de `[Incompreensível]` para revisão manual do organizador.

**Pós-condições:** A transcrição estruturada e com tags de minutagem é salva no banco de dados e anexada à ata.

**Critérios de aceite:**
- [ ] A acurácia média de transcrição (Word Error Rate - WER) de áudios limpos em português deve ser inferior a 12%.
- [ ] O processamento de transcrição de uma chamada de 1 hora deve ser concluído em no máximo 5 minutos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Criar salas de reunião virtuais

**ID:** UC-368  
**Requisito relacionado:** RF-367 (criar salas de reunião virtuais)  
**Ator(es):** Usuário (Organizador), Sistema  
**Pré-condições:** Projeto ativo e usuários colaboradores cadastrados.  
**Gatilho:** O usuário clica em "Criar Nova Sala de Reunião" no painel de equipe.  

**Fluxo principal:**
1. O usuário acessa o painel de "Comunicação" -> "Salas Virtuais".
2. O usuário clica em "Nova Sala de Videoconferência".
3. O sistema abre o formulário solicitando: Nome da Sala, Tipo (Sala Permanente, Agendada) e Limite de Participantes.
4. O usuário preenche as configurações e clica em "Salvar".
5. O sistema registra a sala na base de dados, gerando um link de acesso exclusivo e permanente (ex: `https://plataforma.com/meet/sala-de-ideias-1`).
6. O usuário copia e compartilha o link com colaboradores ou participantes externos.

**Fluxos alternativos:**
- *Sala protegida:* O organizador ativa a chave "Proteger com Senha" e digita uma senha. Os convidados só conseguem ingressar após preencher a senha de segurança correspondente.

**Fluxos de exceção:**
- *Sala lotada:* Se o número de membros conectados exceder o limite de participantes configurado para a sala, a entrada de novos membros é bloqueada exibindo a mensagem "Esta sala está cheia no momento".

**Pós-condições:** A sala de reunião virtual permanente é gerada na base de dados do projeto.

**Critérios de aceite:**
- [ ] A URL da sala gerada deve ser curta e de fácil compartilhamento.
- [ ] A criação da sala e geração do link no banco de dados devem ocorrer em menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
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

---
### Caso de Uso: Compartilhar arquivos no chat

**ID:** UC-370  
**Requisito relacionado:** RF-369 (compartilhar arquivos no chat)  
**Ator(es):** Colaborador (Remetente), Destinatários, Sistema  
**Pré-condições:** O colaborador está em uma conversa de chat ativa.  
**Gatilho:** O colaborador arrasta um arquivo local e solta na caixa de mensagem ou clica em "Anexar Arquivo".  

**Fluxo principal:**
1. O colaborador clica no botão de anexo ("+") ao lado da caixa de mensagens do chat.
2. O sistema abre a janela de seleção de arquivos. O usuário escolhe o arquivo local correspondente e confirma.
3. O sistema exibe a barra de progresso do upload do arquivo no campo de digitação do chat.
4. O backend recebe o arquivo, valida o formato e tamanho, e salva no bucket de armazenamento corporativo.
5. O sistema grava o link na tabela de mensagens de chat correspondente e envia para todos os destinatários no canal.
6. A interface dos destinatários renderiza o card do arquivo com o botão clicável de download e ícone indicativo do formato.

**Fluxos alternativos:**
- *Prévia de Imagem:* Se o arquivo compartilhado for uma imagem, o sistema renderiza uma miniatura diretamente no feed do chat, permitindo visualização em tela cheia ao clicar sobre ela.

**Fluxos de exceção:**
- *Extensão proibida:* Se o usuário tentar enviar arquivos executáveis perigosos (ex: `.exe`, `.bat`), o sistema interrompe o envio por motivos de segurança corporativa exibindo: "Extensão de arquivo proibida".

**Pós-condições:** O arquivo é carregado no storage e anexado de forma definitiva à timeline do chat.

**Critérios de aceite:**
- [ ] O upload de arquivos de até 10MB em conexões estáveis de banda larga deve durar menos de 3 segundos.
- [ ] O link de download gerado no chat deve possuir parâmetros de expiração seguros para evitar vazamentos de informações.

---

## Tabela Resumo: Lote 37 (UC-361 a UC-370)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-361** | RF-360 (enviar mensagens de texto chat) | Crítica | Média |
| **UC-362** | RF-361 (enviar mensagens de voz) | Média | Alta |
| **UC-363** | RF-362 (realizar chamadas de áudio) | Alta | Alta |
| **UC-364** | RF-363 (realizar chamadas de vídeo) | Alta | Alta |
| **UC-365** | RF-364 (compartilhar tela em chamadas) | Alta | Alta |
| **UC-366** | RF-365 (gravar chamadas) | Média | Alta |
| **UC-367** | RF-366 (transcrever chamadas gravadas...) | Média | Alta |
| **UC-368** | RF-367 (criar salas de reunião virtuais) | Alta | Média |
| **UC-369** | RF-368 (moderar salas de reunião) | Média | Média |
| **UC-370** | RF-369 (compartilhar arquivos no chat) | Alta | Média |
