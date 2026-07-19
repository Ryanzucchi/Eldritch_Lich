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
