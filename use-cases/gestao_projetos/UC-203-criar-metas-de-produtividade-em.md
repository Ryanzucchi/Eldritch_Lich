### Caso de Uso: Criar metas de produtividade em equipe

**ID:** UC-203  
**Requisito relacionado:** RF-203 (criar metas de produtividade em equipe)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O projeto possui colaboradores vinculados e o usuário tem cargo de administração.  
**Gatilho:** O administrador acessa a tela de Metas e clica em "Nova Meta Coletiva".  

**Fluxo principal:**
1. O administrador acessa "Metas de Escrita" e clica em "Nova Meta de Equipe".
2. O sistema abre o formulário solicitando: Nome da Meta, Contribuição Alvo por membro, Data Limite, e pasta de documentos elegível.
3. O administrador preenche os dados e clica em "Criar Meta".
4. O sistema registra a meta na tabela de metas coletivas e notifica todos os colaboradores do projeto.
5. A barra de progresso da meta coletiva passa a ser exibida no dashboard do projeto para toda a equipe.

**Fluxos alternativos:**
- *Modo ranking (Leaderboard):* O administrador ativa o modo ranking, onde a meta coletiva exibe uma lista ranqueada mostrando quem contribuiu com mais palavras para o objetivo comum.

**Fluxos de exceção:**
- *Sem colaboradores ativos:* Se não houver colaboradores vinculados ao projeto, o sistema impede a criação da meta de equipe e orienta a criar uma meta individual.

**Pós-condições:** A meta coletiva é criada e notificada aos colaboradores do projeto.

**Critérios de aceite:**
- [ ] O sistema deve permitir associar pesos ou metas individuais distintas para cada membro na composição da meta coletiva.
- [ ] O salvamento e disparo de notificações devem ocorrer em menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média
