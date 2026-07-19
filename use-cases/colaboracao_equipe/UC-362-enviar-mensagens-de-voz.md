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
