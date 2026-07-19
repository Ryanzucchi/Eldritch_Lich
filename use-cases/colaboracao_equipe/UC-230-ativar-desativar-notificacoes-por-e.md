### Caso de Uso: Ativar/desativar notificações por e-mail no perfil

**ID:** UC-230  
**Requisito relacionado:** RF-230 (ativar/desativar notificações por e-mail no perfil)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado no sistema.  
**Gatilho:** O usuário interage com a chave de desativação geral de notificações.  

**Fluxo principal:**
1. O usuário acessa a aba "Configurações" -> "Notificações".
2. O usuário localiza o interruptor "Receber e-mails transacionais (Comentários e Menções)".
3. O usuário clica para desativar a chave (status muda para false).
4. O usuário clica em "Salvar".
5. O sistema grava a preferência na tabela de perfil do usuário.
6. O sistema passa a bloquear qualquer enfileiramento ou disparo de e-mails com destino à conta do usuário.

**Fluxos alternativos:**
- *Desativar e-mails de marketing:* O usuário opta por desativar e-mails de newsletter/marketing nas preferências, mantendo apenas os e-mails transacionais críticos de equipe e segurança.

**Fluxos de exceção:**
- *Falha de sincronização:* O sistema valida a requisição e mantém as chaves locais desativas mesmo em caso de falha de rede temporária (sincronizando em lote posterior).

**Pós-condições:** A preferência de desativação de notificações por e-mail é salva na base de dados.

**Critérios de aceite:**
- [ ] A interface deve fornecer controle granular por tipo de evento.
- [ ] A gravação das preferências no banco deve ocorrer em até 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
