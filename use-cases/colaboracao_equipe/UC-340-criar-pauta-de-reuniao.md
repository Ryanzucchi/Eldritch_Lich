### Caso de Uso: Criar pauta de reunião

**ID:** UC-340  
**Requisito relacionado:** RF-339 (criar pauta de reunião)  
**Ator(es):** Usuário (Organizador da Reunião), Sistema  
**Pré-condições:** Coautores ou colaboradores convidados no projeto.  
**Gatilho:** O organizador cria um convite de reunião no painel de equipe.  

**Fluxo principal:**
1. O organizador acessa o módulo de "Equipe" -> "Reuniões".
2. O organizador clica em "Agendar Nova Reunião".
3. O sistema abre o formulário solicitando: Título da Reunião, Data e Horário, Local/Plataforma, Colaboradores Convidados e o campo "Pauta da Reunião".
4. O organizador digita os tópicos que serão abordados (pauta) em formato de lista Markdown.
5. O organizador clica em "Salvar e Notificar".
6. O sistema grava a reunião na tabela correspondente no banco de dados e envia convites por e-mail e notificações internas para todos os colaboradores selecionados.

**Fluxos alternativos:**
- *Vincular pauta a objetivos:* O organizador associa a pauta a um objetivo ou meta de equipe ativa (OKR), indicando que a reunião servirá para discutir o progresso da meta correspondente.

**Fluxos de exceção:**
- *Conflito de agenda:* O sistema verifica a agenda interna dos participantes convidados. Caso algum membro possua outra reunião marcada no mesmo horário, o sistema alerta o organizador sobre a pendência.

**Pós-condições:** A pauta de reunião é salva e enviada aos participantes.

**Critérios de aceite:**
- [ ] O e-mail de pauta enviado deve conter link de aceite/recusa do convite integrado à plataforma.
- [ ] A inserção no banco e disparo de e-mails de convocação em lote devem ocorrer em menos de 2 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média
