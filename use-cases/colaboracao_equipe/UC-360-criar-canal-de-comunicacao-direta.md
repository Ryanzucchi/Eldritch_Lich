### Caso de Uso: Criar canal de comunicação direta por projeto

**ID:** UC-360  
**Requisito relacionado:** RF-359 (criar canal de comunicação direta por projeto)  
**Ator(es):** Administrador/Gestor, Sistema, Membros do Projeto  
**Pré-condições:** O projeto colaborativo está ativo e possui membros convidados.  
**Gatilho:** O gestor clica em "Criar Canal de Comunicação" nas configurações do projeto.  

**Fluxo principal:**
1. O gestor acessa as configurações do projeto e clica em "Canais de Comunicação".
2. O gestor seleciona "Novo Canal de Chat".
3. O gestor preenche o nome do canal (ex: `#geral-desenvolvimento`), define a visibilidade (Público ou Privado) e insere a descrição.
4. O gestor clica em "Criar Canal".
5. O sistema registra o canal na base de dados, inscreve automaticamente todos os membros ativos do projeto e abre a aba de chat ao vivo na barra de ferramentas.
6. Os membros começam a interagir enviando mensagens instantâneas de texto no canal via WebSocket.

**Fluxos alternativos:**
- *Integração com Slack/Discord:* Em vez do chat nativo, o gestor escolhe integrar com canal externo. O sistema gera os Webhooks necessários e sincroniza as mensagens do projeto com a ferramenta externa.

**Fluxos de exceção:**
- *Mensagens de membro removido:* Se um usuário for desativado do projeto, ele perde instantaneamente as permissões de leitura e gravação no canal, mantendo seu histórico passado registrado de forma segura.

**Pós-condições:** O canal de comunicação síncrono por projeto é estabelecido e disponibilizado para chat.

**Critérios de aceite:**
- [ ] O chat do canal deve suportar envio de anexos de mídias leves (até 5MB) e formatação de texto Markdown em tempo real.
- [ ] A velocidade de entrega de mensagens entre os membros online deve ser de no máximo 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
