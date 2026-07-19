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
