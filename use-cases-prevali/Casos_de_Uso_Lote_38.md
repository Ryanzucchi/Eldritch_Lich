# Casos de Uso - Lote 38 (UC-371 a UC-380)

Este documento contém a especificação dos casos de uso de 371 a 380 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Gerenciar permissões de acesso a arquivos

**ID:** UC-371  
**Requisito relacionado:** RF-370 (gerenciar permissões de acesso a arquivos)  
**Ator(es):** Proprietário/Gestor do Arquivo, Colaboradores, Sistema  
**Pré-condições:** O arquivo está carregado no sistema ou compartilhado em canais.  
**Gatilho:** O proprietário clica em "Permissões de Acesso" no menu do arquivo.  

**Fluxo principal:**
1. O usuário abre o painel de propriedades de um arquivo.
2. O usuário clica em "Gerenciar Acessos".
3. O sistema abre o modal contendo a lista de acessos individuais e o link público de compartilhamento.
4. O usuário adiciona o e-mail do colaborador e define sua permissão (Visualizador, Editor, Administrador).
5. O usuário altera o nível de acesso geral da URL do link de compartilhamento (ex: Qualquer pessoa com link pode visualizar).
6. O usuário clica em "Salvar Permissões".
7. O sistema grava as regras na tabela correspondente do banco de dados.

**Fluxos alternativos:**
- *Herança de permissões:* Se o arquivo for movido para uma pasta restrita, ele herda automaticamente as regras de controle de acesso da pasta pai, revogando privilégios de membros comuns de forma automática.

**Fluxos de exceção:**
- *Remover o próprio acesso:* O proprietário do arquivo é impedido de remover suas próprias permissões administrativas do arquivo antes de atribuir outro usuário como proprietário master.

**Pós-condições:** As novas regras de permissões são aplicadas, bloqueando acessos não autorizados de imediato.

**Critérios de aceite:**
- [ ] A validação de tokens e sessões ao carregar arquivos protegidos via API de mídia deve demorar menos de 100ms.
- [ ] A interface deve listar os logs das últimas alterações de permissões efetuadas no arquivo.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Buscar mensagens/arquivos no histórico do chat

**ID:** UC-372  
**Requisito relacionado:** RF-371 (buscar mensagens/arquivos no histórico do chat)  
**Ator(es):** Colaborador, Sistema  
**Pré-condições:** Histórico de conversas de chat gravado no banco de dados.  
**Gatilho:** O colaborador digita termos na caixa de pesquisa do cabeçalho do chat.  

**Fluxo principal:**
1. O colaborador acessa o chat do projeto e clica na caixa "Pesquisar no histórico".
2. O colaborador digita o termo de busca (ex: "servidores") e confirma.
3. O sistema realiza busca na tabela correspondente aplicando filtros por texto.
4. A interface exibe a listagem de resultados dividida nas abas de mensagens e arquivos.
5. O usuário clica sobre a mensagem localizada, e o sistema rola automaticamente a timeline do canal até a data exata da mensagem, destacando a linha correspondente de forma sutil.

**Fluxos alternativos:**
- *Filtro Avançado:* O usuário refina a busca selecionando remetente (ex: "Arthur"), data (ex: "Últimos 7 dias") ou canal de origem.

**Fluxos de exceção:**
- *Nenhum resultado:* Se o termo pesquisado não existir nas tabelas do banco, o sistema exibe uma mensagem de retorno de dados em branco na tela.

**Pós-condições:** A lista de mensagens e mídias localizadas é exibida na interface do chat.

**Critérios de aceite:**
- [ ] A pesquisa textual deve aceitar acentuações e ser case-insensitive.
- [ ] O tempo de resposta de busca em uma base de 10.000 mensagens deve ser inferior a 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar canais de anúncio (apenas administradores postam)

**ID:** UC-373  
**Requisito relacionado:** RF-372 (criar canais de anúncio)  
**Ator(es):** Administrador, Colaboradores, Sistema  
**Pré-condições:** Painel de canais ativo e usuário com permissões de administrador.  
**Gatilho:** O administrador cria um canal e ativa a chave de canal de anúncios.  

**Fluxo principal:**
1. O administrador clica em "Criar Canal" nas configurações de comunicação do projeto.
2. O administrador preenche as informações e ativa a chave "Canal de Anúncios (Apenas Admins Postam)".
3. O administrador clica em "Salvar".
4. O sistema cria o canal gravando as restrições na tabela do banco de dados.
5. Na interface de escrita dos colaboradores comuns do canal, a caixa de digitação inferior é substituída pela mensagem: "Apenas administradores podem enviar mensagens neste canal".
6. O administrador posta um aviso no canal correspondente.

**Fluxos alternativos:**
- *Interações por reações:* O administrador permite que os colaboradores comuns interajam exclusivamente por meio de reações de emojis nas mensagens, mantendo a restrição de escrita de texto.

**Fluxos de exceção:**
- *Envio direto via API:* Se a API receber uma tentativa de requisição de envio de mensagens no canal de anúncios por um token sem papel de administrador, o backend bloqueia emitindo erro 403 Forbidden.

**Pós-condições:** O canal de anúncios restrito é ativado e disponibilizado no sistema.

**Critérios de aceite:**
- [ ] O canal de anúncios deve exibir um distintivo visual de megafone ao lado do nome na lista de canais.
- [ ] O bloqueio de escrita na interface de colaboradores comuns deve ser instantâneo.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Integrar chat com tarefas e sprints

**ID:** UC-374  
**Requisito relacionado:** RF-373 (integrar chat com tarefas e sprints)  
**Ator(es):** Colaborador, Sistema  
**Pré-condições:** Módulos de chat e Kanban de tarefas ativos no mesmo projeto.  
**Gatilho:** O colaborador digita a referência de uma tarefa ou comando no chat.  

**Fluxo principal:**
1. O colaborador acessa o canal de chat correspondente.
2. Ele digita a referência contendo o ID da tarefa (ex: "Trabalhando na #TASK-105 agora") e envia.
3. O sistema reconhece a expressão e insere automaticamente um link interativo contendo o título da tarefa e seu status atual.
4. Ao passar o mouse sobre a tag gerada, o sistema exibe popover rápido contendo detalhes, responsável e prazo.

**Fluxos alternativos:**
- *Criação rápida por comandos:* O usuário digita `/todo Nova Tarefa` na caixa de chat. O chatbot integrado intercepta o comando e insere a nova tarefa diretamente no backlog Kanban do projeto.

**Fluxos de exceção:**
- *ID inválido:* Se o usuário digitar um ID de tarefa que não existe na base de dados, o sistema renderiza como texto comum sem converter em link ativo.

**Pós-condições:** O link dinâmico interativo entre a conversa do chat e a entidade de tarefa do backlog é exibido na tela.

**Critérios de aceite:**
- [ ] A renderização de metadados do popover ao passar o mouse deve carregar em menos de 200ms.
- [ ] O bot de comandos do chat (/todo, /task) deve reconhecer parâmetros de responsável e data limite.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Receber notificações de atualização de tarefas no chat

**ID:** UC-375  
**Requisito relacionado:** RF-374 (receber notificações de atualização de tarefas no chat)  
**Ator(es):** Sistema, Integrantes do Canal, Colaborador (Executor)  
**Pré-condições:** Canal de chat ativo configurado para receber notificações do Kanban do projeto.  
**Gatilho:** Uma tarefa sofre alteração de status ou responsável no quadro Kanban.  

**Fluxo principal:**
1. O colaborador correspondente move a tarefa para a coluna "Concluído" no Kanban.
2. O backend intercepta o evento de alteração de status da tarefa.
3. O sistema formata uma mensagem de notificação rica detalhando o autor, a alteração e o título do item.
4. O sistema insere a mensagem gerada pelo bot de integração no feed do canal de chat configurado.
5. Os membros do canal visualizam a atualização instantaneamente no chat.

**Fluxos alternativos:**
- *Notificação de estouro de prazo:* Se a data limite de uma tarefa expirar sem entrega, o sistema posta automaticamente um alerta no chat notificando os gestores do projeto.

**Fluxos de exceção:**
- *Canal inativo/excluído:* Se o canal configurado para logs for removido, o sistema desativa a publicação de eventos em background e redireciona os logs gerais para o painel de notificações pessoal de cada membro.

**Pós-condições:** A notificação da atividade é publicada na timeline do chat de equipe.

**Critérios de aceite:**
- [ ] A publicação do log de notificação no chat deve ocorrer em menos de 500ms após a movimentação da tarefa no Kanban.
- [ ] A notificação de atualização deve agrupar alterações semelhantes do mesmo período para evitar spam de mensagens no chat.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Gerenciar calendário de equipe

**ID:** UC-376  
**Requisito relacionado:** RF-375 (gerenciar calendário de equipe)  
**Ator(es):** Gestor/Líder de Equipe, Colaboradores, Sistema  
**Pré-condições:** Projeto configurado com múltiplos integrantes associados.  
**Gatilho:** O gestor acessa o painel de Calendário Coletivo do projeto.  

**Fluxo principal:**
1. O gestor abre a aba "Calendário de Equipe".
2. O sistema exibe o calendário em formato de grade mensal unificando as agendas de todos os membros do time.
3. O gestor visualiza os eventos gerais agendados, prazos de sprints e férias da equipe.
4. O gestor clica em "Configurações do Calendário" e cria uma nova agenda temática dedicada (ex: "Lançamentos").
5. O gestor seleciona a cor da agenda correspondente e clica em salvar.
6. O sistema atualiza a visualização do calendário aplicando as camadas de cores nos respectivos eventos.

**Fluxos alternativos:**
- *Filtros de calendário:* O colaborador oculta agendas específicas do painel de controle lateral para visualizar apenas reuniões de sua área.

**Fluxos de exceção:**
- *Offline:* O calendário armazena dados em cache local do navegador caso falte internet, permitindo visualizações seguras sem conexão.

**Pós-condições:** O calendário corporativo compartilhado é atualizado e configurado na tela.

**Critérios de aceite:**
- [ ] O carregamento inicial do calendário contendo até 100 eventos semanais da equipe deve durar menos de 500ms.
- [ ] O calendário deve permitir arrastar e soltar eventos para remarcação rápida de datas.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Agendar reuniões e eventos no calendário

**ID:** UC-377  
**Requisito relacionado:** RF-376 (agendar reuniões e eventos no calendário)  
**Ator(es):** Organizador/Colaborador, Convidados, Sistema  
**Pré-condições:** Calendário ativo no projeto.  
**Gatilho:** O organizador clica sobre um bloco de hora livre no calendário.  

**Fluxo principal:**
1. O organizador acessa a grade do Calendário e clica no dia e horário desejado.
2. O sistema abre a janela de agendamento de eventos.
3. O organizador preenche o título, a descrição, seleciona a sala de reunião virtual correspondente e escolhe os membros participantes a convidar.
4. O organizador clica em "Confirmar Agendamento".
5. O sistema grava o evento no banco de dados e renderiza o bloco colorido na grade do calendário.
6. O sistema despacha convites automáticos de e-mail para todos os convidados.

**Fluxos alternativos:**
- *Agendamento recorrente:* O organizador configura a repetição do evento (ex: "Semanal"). O sistema replica o evento nas datas correspondentes ao longo do período selecionado.

**Fluxos de exceção:**
- *Agendamento retroativo:* Se o organizador tentar agendar um evento em uma data passada, o sistema exibe alerta de erro e impede a conclusão da ação.

**Pós-condições:** O evento de reunião é salvo na agenda do projeto e disponibilizado no calendário dos convidados.

**Critérios de aceite:**
- [ ] Os convidados devem receber notificações internas com opções rápidas de confirmar ou recusar participação.
- [ ] A atualização física do evento na grade gráfica do calendário deve levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Integrar calendário com ferramentas externas (Google Calendar, Outlook)

**ID:** UC-378  
**Requisito relacionado:** RF-377 (integrar calendário com ferramentas externas)  
**Ator(es):** Colaborador, Sistema  
**Pré-condições:** O usuário possui conta ativa em plataforma externa de calendário.  
**Gatilho:** O colaborador acessa "Integrações" e clica em "Sincronizar com Google Calendar".  

**Fluxo principal:**
1. O colaborador acessa as configurações de perfil pessoal -> "Conexões e Integrações".
2. O colaborador clica no botão "Integrar com Google Calendar".
3. O sistema redireciona o usuário para a tela de autenticação OAuth2 segura externa.
4. O colaborador realiza o login e aceita as permissões de acesso ao calendário.
5. O sistema grava os tokens de integração de forma criptografada na base de dados.
6. O sistema executa o sincronizador em background, baixando os eventos externos da Google e enviando os compromissos da plataforma para o Google Calendar.

**Fluxos alternativos:**
- *Exportação via iCal:* O usuário copia o link do feed iCal privado gerado pela plataforma e o insere nas configurações do Outlook, habilitando a sincronização unidirecional de leitura sem login direto.

**Fluxos de exceção:**
- *Token revogado:* Se o usuário revogar a autorização externamente, o sistema desativa a sincronização automática e exibe uma notificação de alerta desconectado.

**Pós-condições:** A sincronização bidirecional de eventos entre as plataformas está ativa e conectada.

**Critérios de aceite:**
- [ ] A sincronização de novos eventos de calendário deve ocorrer em background a cada 15 minutos de forma automática.
- [ ] Os dados de chaves de API e tokens de usuários devem ser blindados sob criptografia padrão de banco.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Visualizar disponibilidade de membros da equipe

**ID:** UC-379  
**Requisito relacionado:** RF-378 (visualizar disponibilidade de membros da equipe)  
**Ator(es):** Organizador da Reunião, Sistema  
**Pré-condições:** Agendas individuais e alocações de trabalho dos membros da equipe salvas no sistema.  
**Gatilho:** O organizador adiciona participantes no modal de agendamento de reuniões.  

**Fluxo principal:**
1. O organizador abre a tela de agendamento de eventos e seleciona os convidados correspondentes.
2. O organizador clica em "Verificar Disponibilidade (Encontrar Horário)".
3. O sistema analisa em tempo real as agendas e calendários individuais (inclusive as integrações do Google Calendar) dos convidados para o dia selecionado.
4. A interface renderiza o gráfico de "Linha do Tempo de Ocupação", exibindo faixas de horários ocupados em cinza e os blocos de horários livres comuns em verde.
5. O organizador clica sobre o bloco livre comum sugerido e o sistema define o horário da reunião de forma automática.

**Fluxos alternativos:**
- *Sugerir horários automáticos:* O organizador clica em "Sugerir Horários". O sistema calcula matematicamente as melhores janelas de folga em comum no horário comercial e apresenta como opções rápidas.

**Fluxos de exceção:**
- *Sem horários livres em comum:* Se os participantes estiverem com 100% de ocupação no dia, o sistema avisa na tela e impede o agendamento direto sem alteração de data.

**Pós-condições:** O horário otimizado e viável de reunião é verificado e selecionado.

**Critérios de aceite:**
- [ ] A varredura de dados de agendas de até 5 convidados para exibição do gráfico de disponibilidade deve durar menos de 800ms.
- [ ] A visualização deve ocultar os títulos de compromissos particulares dos membros por motivos de privacidade de agenda.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Sincronizar fusos horários de membros da equipe

**ID:** UC-380  
**Requisito relacionado:** RF-379 (sincronizar fusos horários de membros da equipe)  
**Ator(es):** Sistema, Membros da Equipe  
**Pré-condições:** O sistema possui cadastrado o fuso horário oficial na ficha de cada colaborador.  
**Gatilho:** O sistema carrega datas de eventos ou prazos para usuários em diferentes fusos horários.  

**Fluxo principal:**
1. O colaborador A (baseado em Brasília - GMT-3) visualiza em sua tela a reunião agendada para às "14:00 (GMT-3)".
2. O colaborador B (baseado em Londres - GMT+1) acessa a mesma reunião do mesmo projeto.
3. O sistema lê as configurações de fuso horário local do colaborador B.
4. O sistema converte automaticamente a timestamp UTC do banco de dados e exibe para o colaborador B o evento agendado para às "18:00 (GMT+1)".
5. Ambos visualizam a reunião em seus respectivos horários locais sem inconsistências de agenda.

**Fluxos alternativos:**
- *Alteração manual:* O usuário altera manualmente seu fuso horário nas configurações de perfil. O sistema re-renderiza todas as tarefas e compromissos para a nova faixa horária selecionada de imediato.

**Fluxos de exceção:**
- *Sem dados do navegador:* Se o cliente não expuser dados de fuso válidos e não possuir configuração de perfil preenchida, o sistema assume o fuso horário padrão do servidor (UTC).

**Pós-condições:** Todas as datas e horas da aplicação são convertidas e exibidas de acordo com o fuso local do usuário.

**Critérios de aceite:**
- [ ] A gravação de todas as datas no banco de dados deve ocorrer estritamente em formato UTC (ISO 8601).
- [ ] O recálculo de fusos horários na renderização do calendário deve ser imperceptível ao usuário final (< 50ms).

---

## Tabela Resumo: Lote 38 (UC-371 a UC-380)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-371** | RF-370 (gerenciar permissões de acesso a arquivos) | Crítica | Média |
| **UC-372** | RF-371 (buscar mensagens/arquivos no chat) | Alta | Média |
| **UC-373** | RF-372 (criar canais de anúncio restritos) | Média | Média |
| **UC-374** | RF-373 (integrar chat com tarefas e sprints) | Média | Alta |
| **UC-375** | RF-374 (notificações de Kanban no chat) | Média | Média |
| **UC-376** | RF-375 (gerenciar calendário de equipe) | Alta | Média |
| **UC-377** | RF-376 (agendar reuniões no calendário) | Alta | Média |
| **UC-378** | RF-377 (integrar calendário com Google/Outlook) | Média | Alta |
| **UC-379** | RF-378 (visualizar disponibilidade de membros) | Alta | Alta |
| **UC-380** | RF-379 (sincronizar fusos horários do time) | Alta | Média |
