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

**Prioridade:** Alta  
**Complexidade estimada:** Média
