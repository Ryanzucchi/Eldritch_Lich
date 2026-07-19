# Casos de Uso - Lote 22 (UC-211 a UC-220)

Este documento contém a especificação dos casos de uso de 211 a 220 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Visualizar lista de colaboradores online no projeto

**ID:** UC-211  
**Requisito relacionado:** RF-211 (visualizar lista de colaboradores online no projeto)  
**Ator(es):** Usuário (Colaborador), Sistema  
**Pré-condições:** O projeto possui compartilhamento ativo e o usuário está com o projeto aberto.  
**Gatilho:** Entrada de novos usuários no espaço de trabalho ou abertura do painel de equipe.  

**Fluxo principal:**
1. O usuário abre o projeto.
2. O sistema estabelece conexão WebSocket com o servidor de presença.
3. No canto superior direito da barra global, o sistema exibe os avatares dos usuários online no momento (com ponto indicador verde).
4. O usuário passa o mouse sobre o avatar para ler o nome e o status (ex: "Colaborador B - Ativo").
5. Quando um colaborador fecha o projeto ou desconecta, o sistema detecta a desconexão e remove seu avatar da listagem em tempo real.

**Fluxos alternativos:**
- *Modo Invisível:* O usuário configura seu status para "Invisível" nas preferências do perfil. O sistema oculta seu avatar dos demais colaboradores mesmo com o projeto aberto.

**Fluxos de exceção:**
- *Instabilidade de conexão:* Se o WebSocket cair, o sistema esmaece a lista de online e tenta restabelecer o sinal em background de forma silenciosa.

**Pós-condições:** A lista atualizada de colaboradores ativos em tempo real é exibida no cabeçalho da interface.

**Critérios de aceite:**
- [ ] A entrada ou saída de um usuário deve ser refletida na tela dos demais em até 500ms.
- [ ] O painel deve suportar até 20 avatares online simultaneamente, agrupando excedentes sob um rótulo "+X".

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Bloquear edições em arquivos específicos (concorrente)

**ID:** UC-212  
**Requisito relacionado:** RF-212 (bloquear edições em arquivos específicos (concorrente))  
**Ator(es):** Usuário (Colaborador), Sistema  
**Pré-condições:** O projeto possui edição colaborativa habilitada.  
**Gatilho:** O usuário abre um documento para escrita ou o administrador bloqueia manualmente o arquivo.  

**Fluxo principal:**
1. O Colaborador A abre o arquivo "Capítulo 7" no editor.
2. O sistema envia um sinal de bloqueio temporário de escrita (Exclusive Write Lock) para o servidor.
3. O Colaborador B tenta abrir o mesmo arquivo.
4. O sistema abre o arquivo na tela do Colaborador B em modo leitura (read-only) e exibe um alerta: "Arquivo bloqueado para edições por: Colaborador A".
5. O editor desativa a digitação para o Colaborador B.
6. Quando o Colaborador A fecha o arquivo ou fica inativo por mais de 10 minutos, o sistema revoga o bloqueio e libera o arquivo para escrita.

**Fluxos alternativos:**
- *Bloqueio Permanente de Revisão:* O administrador altera o status do texto para "Finalizado", travando a escrita para todos os colaboradores por padrão.

**Fluxos de exceção:**
- *Perda de conexão do detentor do lock:* Se o Colaborador A desconectar abruptamente, o servidor mantém o lock por 2 minutos e depois o libera automaticamente (heartbeat timeout).

**Pós-condições:** O arquivo fica protegido contra escritas concorrentes sobrepostas de múltiplos editores.

**Critérios de aceite:**
- [ ] O lock exclusivo deve ser gerenciado em base de memória rápida do servidor (ex: Redis) para evitar condições de corrida.
- [ ] O tempo de resposta ao solicitar ou revogar um lock deve ser menor que 150ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Visualizar quem está editando qual arquivo/campo (cursor)

**ID:** UC-213  
**Requisito relacionado:** RF-213 (visualizar quem está editando qual arquivo/campo (cursor))  
**Ator(es):** Usuário (Colaborador), Sistema  
**Pré-condições:** Múltiplos colaboradores estão com o mesmo documento aberto e editando em tempo real.  
**Gatilho:** Movimentação do cursor ou digitação de texto por parte de um dos colaboradores.  

**Fluxo principal:**
1. O Colaborador A está com o cursor posicionado na linha 15 do capítulo aberto.
2. O sistema captura a posição do cursor (índice de caractere no editor) do Colaborador A e envia em tempo real via WebSocket.
3. O Colaborador B visualiza um cursor flutuante colorido (ex: roxo) posicionado na linha 15 do seu próprio editor, contendo uma tag com o nome "Colaborador A" flutuando acima.
4. À medida que o Colaborador A digita ou move o cursor, as alterações de posição são sincronizadas na tela do Colaborador B.

**Fluxos alternativos:**
- *Visualizar foco na árvore:* A árvore lateral exibe uma miniatura do avatar do Colaborador A ao lado do nome do arquivo na listagem, indicando de forma macro que ele está com aquele documento aberto no momento.

**Fluxos de exceção:**
- *Latência alta:* Se a conexão do usuário ficar lenta, a movimentação do cursor é atualizada com interpolação suave na tela do outro usuário para evitar saltos.

**Pós-condições:** As coordenadas dos cursores ativos dos colaboradores online são renderizadas na tela de forma síncrona.

**Critérios de aceite:**
- [ ] A posição dos cursores deve se adaptar dinamicamente ao redimensionamento de fontes ou layouts de tela diferentes.
- [ ] O envio de eventos de cursor deve ter taxa limitada (throttling) a no máximo 10 mensagens por segundo para poupar banda.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Enviar mensagens de chat internas no projeto

**ID:** UC-214  
**Requisito relacionado:** RF-214 (enviar mensagens de chat internas no projeto)  
**Ator(es):** Usuário (Colaborador), Sistema  
**Pré-condições:** O projeto é colaborativo e o painel de chat lateral está aberto.  
**Gatilho:** O usuário digita uma mensagem e clica em enviar.  

**Fluxo principal:**
1. O usuário clica no ícone "Chat da Equipe" na barra lateral de ferramentas.
2. O sistema exibe a interface de mensagens com a listagem de conversas recentes.
3. O usuário digita a mensagem (ex: "Pessoal, terminei as correções do Capítulo 1") na caixa de texto.
4. O usuário clica em "Enviar" ou pressiona Enter.
5. O sistema salva a mensagem no banco de dados e transmite via WebSocket para todos os colaboradores do projeto.
6. A mensagem é exibida instantaneamente na caixa de chat de todas as telas dos colaboradores online.

**Fluxos alternativos:**
- *Enviar anexo:* O usuário clica no clipe de papel e seleciona uma imagem ou arquivo de texto do projeto para anexar no chat.

**Fluxos de exceção:**
- *Sem conexão de rede:* Se o usuário tentar enviar uma mensagem offline, a interface exibe a mensagem em cinza com um ícone de exclamação vermelho indicando "Não enviada. Sem conexão".

**Pós-condições:** A mensagem é registrada no banco de dados e distribuída aos colaboradores online no projeto.

**Critérios de aceite:**
- [ ] A entrega da mensagem no chat de usuários online deve levar menos de 200ms.
- [ ] O chat deve suportar formatação Markdown básica.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar canais de chat por assunto/pasta

**ID:** UC-215  
**Requisito relacionado:** RF-215 (criar canais de chat por assunto/pasta)  
**Ator(es):** Usuário (Colaborador/Admin), Sistema  
**Pré-condições:** O painel de chat do projeto está ativo.  
**Gatilho:** O usuário clica em "Criar Novo Canal" na seção de chat.  

**Fluxo principal:**
1. O usuário abre o chat lateral e clica no botão "+" ao lado de "Canais".
2. O sistema abre um modal solicitando o nome do canal e descrição.
3. O usuário insere os dados e clica em "Confirmar".
4. O sistema cria o canal de chat isolado na base de dados.
5. O novo canal aparece na lista lateral do chat para todos os colaboradores do projeto.
6. Ao clicar no canal, os membros acessam a thread de conversas exclusiva sobre o assunto delimitado.

**Fluxos alternativos:**
- *Canal automático de pasta:* O sistema cria de forma automática um canal de chat privado para cada pasta de capítulos principal criada no diretório, agrupando as discussões daquela divisão.

**Fluxos de exceção:**
- *Sem permissão:* Se um colaborador for bloqueado em uma pasta, ele perde o acesso visual e de interação no canal de chat privado correspondente àquela pasta.

**Pós-condições:** O canal de chat temático é inicializado no projeto.

**Critérios de aceite:**
- [ ] O canal de chat deve permitir silenciar notificações individuais para o usuário.
- [ ] A criação de canais de chat deve atualizar as telas dos colaboradores em tempo real.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Arquivar mensagens do chat

**ID:** UC-216  
**Requisito relacionado:** RF-216 (arquivar mensagens do chat)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** Existem mensagens de chat cadastradas na base de dados.  
**Gatilho:** O administrador solicita o arquivamento de um canal ou histórico de conversações antigas.  

**Fluxo principal:**
1. O administrador acessa as configurações de chat do canal correspondente.
2. O administrador clica na opção "Arquivar Conversas".
3. O sistema abre um modal solicitando o critério temporal (ex: arquivar mensagens com mais de 30 dias).
4. O administrador seleciona e clica em "Confirmar Arquivamento".
5. O sistema atualiza o status das mensagens filtradas para `arquivada = true` na base de dados.
6. As mensagens desaparecem da barra de chat ativa e ficam acessíveis apenas na aba "Arquivo de Mensagens" para consulta histórica e auditoria.

**Fluxos alternativos:**
- *Arquivar canal completo:* O administrador arquiva o canal inteiro. O canal é fechado para novos envios e movido para a pasta de canais arquivados.

**Fluxos de exceção:**
- *Desarquivar canal:* O administrador acessa a lista de arquivados e clica em "Reativar Canal", retornando-o para a aba ativa de chat.

**Pós-condições:** As mensagens de chat são removidas da linha de visualização diária e movidas para a base de arquivo.

**Critérios de aceite:**
- [ ] O arquivamento de mensagens em lote não deve impactar o desempenho da rede de chat ativa.
- [ ] A interface deve carregar as mensagens arquivadas em modo somente leitura.

**Prioridade:** Baixa  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Limpar histórico de chat

**ID:** UC-217  
**Requisito relacionado:** RF-217 (limpar histórico de chat)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** Mensagens de chat cadastradas no canal de conversa selecionado.  
**Gatilho:** O administrador clica em "Limpar Histórico" nas opções do chat.  

**Fluxo principal:**
1. O administrador acessa as configurações do canal de chat.
2. O administrador clica na opção "Limpar Histórico do Canal".
3. O sistema exibe um modal de segurança com um alerta crítico solicitando confirmação.
4. O administrador clica em "Sim, Apagar Tudo".
5. O sistema executa a deleção física de todas as mensagens vinculadas àquele canal na base de dados.
6. O sistema transmite um sinal WebSocket limpando a tela de chat de todos os usuários online.

**Fluxos alternativos:**
- *Limpeza individual:* O usuário comum limpa o histórico da conversa privada na sua própria tela. O sistema limpa apenas localmente sem apagar as mensagens no banco para o outro participante da conversa.

**Fluxos de exceção:**
- *Falta de autorização:* Se um colaborador comum tentar limpar as mensagens de um canal público, o sistema impede a ação e oculta a opção nas configurações do canal.

**Pós-condições:** As mensagens do canal são deletadas fisicamente do banco de dados e da tela dos usuários.

**Critérios de aceite:**
- [ ] A limpeza física de dados de canais globais deve exigir confirmação de senha do administrador.
- [ ] A limpeza deve ser concluída no banco em menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Fixar mensagens importantes no chat

**ID:** UC-218  
**Requisito relacionado:** RF-218 (fixar mensagens importantes no chat)  
**Ator(es):** Usuário (Colaborador), Sistema  
**Pré-condições:** Mensagens de chat existem no canal ativo.  
**Gatilho:** O usuário abre o menu de contexto de uma mensagem e seleciona "Fixar Mensagem".  

**Fluxo principal:**
1. O usuário passa o cursor sobre a mensagem que deseja destacar.
2. O usuário clica no ícone de opções flutuantes e seleciona "Fixar Mensagem".
3. O sistema altera o status do atributo `fixada` para `true` no banco de dados.
4. O sistema insere a mensagem na gaveta de "Mensagens Fixadas" no cabeçalho do canal.
5. O sistema renderiza um ícone de pino ao lado da mensagem original.
6. Qualquer usuário do canal pode clicar no atalho de mensagens fixadas no topo para visualizar os termos ancorados.

**Fluxos alternativos:**
- *Desafixar mensagem:* O usuário abre a gaveta de fixados e clica em desafixar, retornando o status da mensagem ao normal.

**Fluxos de exceção:**
- *Acesso ao link excluído:* Se a mensagem fixada contiver um link para uma ficha que foi apagada, a mensagem continua fixada, mas o link de destino passa a exibir erro ao ser clicado.

**Pós-condições:** A mensagem fica ancorada na seção de referências do canal de chat correspondente.

**Critérios de aceite:**
- [ ] Clicar sobre uma mensagem fixada na gaveta deve fazer a rolagem da tela do chat focar automaticamente na posição original em que a mensagem foi enviada.
- [ ] A interface de fixação deve atualizar a tela dos membros em menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Notificar sobre novas mensagens no chat

**ID:** UC-219  
**Requisito relacionado:** RF-219 (notificar sobre novas mensagens no chat)  
**Ator(es):** Sistema, Usuário (Colaborador)  
**Pré-condições:** O usuário faz parte do projeto colaborativo e o chat está fechado na sua tela.  
**Gatilho:** Envio de uma nova mensagem no chat por parte de outro colaborador.  

**Fluxo principal:**
1. O Colaborador A envia uma mensagem no chat do projeto.
2. O sistema detecta a chegada da mensagem.
3. Se o Colaborador B estiver com o projeto aberto mas com a aba de chat recolhida, o sistema incrementa um badge vermelho no ícone de chat.
4. O sistema toca um aviso sonoro discreto de mensagem recebida se a opção de áudio estiver ativa nas preferências.
5. Se o Colaborador B estiver com o navegador minimizado, o sistema dispara uma notificação push desktop contendo o trecho da mensagem.

**Fluxos alternativos:**
- *Notificação apenas para menções:* O usuário configura a conta para ser notificado por push apenas em caso de menção direta ao seu nome (@Nome).

**Fluxos de exceção:**
- *Mensagem própria:* O sistema ignora o alerta de notificação sonora e o badge visual para o usuário que enviou a própria mensagem.

**Pós-condições:** Os badges e alertas de novas mensagens de chat pendentes são exibidos ao destinatário.

**Critérios de aceite:**
- [ ] O badge numérico indicador deve atualizar instantaneamente ao ler a mensagem ou abrir o painel correspondente.
- [ ] O tempo de processamento do alerta local deve ser inferior a 100ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Configurar notificações de e-mail (frequência)

**ID:** UC-220  
**Requisito relacionado:** RF-220 (configurar notificações de e-mail)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado e possui uma conta de e-mail válida.  
**Gatilho:** O usuário acessa "Configurações de Conta" -> "Notificações".  

**Fluxo principal:**
1. O usuário abre a seção de preferências de notificações no seu painel de configurações.
2. O sistema exibe o formulário com opções de frequência de envio de e-mails de resumos de alteração do projeto:
   - "Imediato": Enviar e-mail a cada comentário ou menção recebida.
   - "Resumo Diário": Enviar um único e-mail consolidando todas as alterações do dia.
   - "Resumo Semanal": Enviar um e-mail consolidado todas as semanas.
   - "Desativado": Não enviar e-mails de resumos de atividade.
3. O usuário escolhe a opção "Resumo Diário" e clica em "Salvar Preferências".
4. O sistema grava a preferência na tabela de perfil do usuário.
5. O sistema agenda no servidor a rotina diária (cron job) para preparar e enviar os relatórios agregados específicos daquele usuário.

**Fluxos alternativos:**
- *Configurações por projeto:* O usuário define frequências diferentes para cada projeto que participa (ex: e-mail imediato para o Projeto A e e-mail desativado para o Projeto B).

**Fluxos de exceção:**
- *Falha no agendamento:* Se o servidor falhar ao atualizar a agenda de e-mails, o sistema aborta e exibe uma notificação de falha orientando o usuário a tentar novamente.

**Pós-condições:** A preferência de periodicidade de notificação por e-mail é persistida no perfil do usuário.

**Critérios de aceite:**
- [ ] O cron job de e-mails diários deve enviar os informativos agrupados com layout HTML responsivo e amigável.
- [ ] O salvamento das preferências no banco deve ocorrer em até 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---

## Tabela Resumo: Lote 22 (UC-211 a UC-220)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-211** | RF-211 (visualizar lista de colaboradores...) | Alta | Média |
| **UC-212** | RF-212 (bloquear edições concorrentes) | Alta | Média |
| **UC-213** | RF-213 (visualizar cursor de edição...) | Alta | Alta |
| **UC-214** | RF-214 (enviar mensagens no chat) | Alta | Média |
| **UC-215** | RF-215 (criar canais de chat por assunto) | Média | Média |
| **UC-216** | RF-216 (arquivar mensagens do chat) | Baixa | Baixa |
| **UC-217** | RF-217 (limpar histórico de chat) | Média | Baixa |
| **UC-218** | RF-218 (fixar mensagens no chat) | Média | Baixa |
| **UC-219** | RF-219 (notificar sobre novas mensagens) | Alta | Baixa |
| **UC-220** | RF-220 (configurar notificações de e-mail) | Média | Média |
