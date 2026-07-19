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
