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
