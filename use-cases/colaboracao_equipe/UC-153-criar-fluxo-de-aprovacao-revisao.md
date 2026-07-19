### Caso de Uso: Criar fluxo de aprovação/revisão entre colaboradores

**ID:** UC-153  
**Requisito relacionado:** RF-153 (criar fluxo de aprovação/revisão entre colaboradores)  
**Ator(es):** Usuários (Escritores, Revisores, Administrador)  
**Pré-condições:** O projeto possui colaboradores com diferentes papéis e o texto está ativo.  
**Gatilho:** O escritor clica em "Solicitar Revisão" no painel do editor de texto.  

**Fluxo principal:**
1. O escritor abre o documento e clica no botão "Solicitar Revisão".
2. O sistema abre um modal solicitando que ele selecione qual colaborador será o revisor e digite instruções.
3. O escritor clica em "Enviar para Revisão".
4. O sistema altera o status do texto para "Em Revisão", bloqueia a edição direta por parte do escritor, e envia uma notificação para o Revisor B.
5. O Revisor B acessa o texto, faz anotações e comentários, e no cabeçalho clica em "Aprovar Texto" ou "Rejeitar".
6. O sistema atualiza o status correspondente (ex: se aprovado, muda para "Finalizado"; se rejeitado, retorna para "Rascunho" e libera a escrita para o autor).

**Fluxos alternativos:**
- *Fluxo em múltiplos níveis:* O administrador configura uma regra em que o texto precisa de 2 aprovações distintas para ser finalizado.

**Fluxos de exceção:**
- *Revisor removido:* Se o revisor atribuído for removido da equipe com a tarefa em andamento, o sistema notifica o administrador e o autor para reatribuir a revisão.

**Pós-condições:** O status e as restrições de escrita do documento são controlados ao longo do pipeline de aprovação.

**Critérios de aceite:**
- [ ] O sistema deve reter o histórico completo de solicitações, aprovações, rejeições e datas no log do projeto.
- [ ] O bloqueio e liberação de permissão de escrita de acordo com o status de revisão devem ser controlados no backend.

**Prioridade:** Alta  
**Complexidade estimada:** Média
