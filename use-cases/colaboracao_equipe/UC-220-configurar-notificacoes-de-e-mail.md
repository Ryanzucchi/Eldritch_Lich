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
