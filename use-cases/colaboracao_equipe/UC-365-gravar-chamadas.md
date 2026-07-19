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
