### Caso de Uso: Alertar sobre desvios orçamentários

**ID:** UC-390  
**Requisito relacionado:** RF-389 (alertar sobre desvios orçamentários)  
**Ator(es):** Sistema, Gestor do Projeto, Controller Financeiro  
**Pré-condições:** Orçamento limite configurado e despesas correntes registradas.  
**Gatilho:** O lançamento de uma nova despesa ultrapassa o percentual de alerta limite do orçamento configurado.  

**Fluxo principal:**
1. O gestor ou colaborador cadastra uma nova despesa no centro de custo do projeto.
2. O backend grava a despesa e recalcula o total de custos acumulados do projeto naquela categoria.
3. O sistema compara o valor acumulado com o limite de orçamento planejado cadastrado para o centro de custo.
4. O sistema detecta que o consumo de custos superou o gatilho padrão de alerta configurado (ex: superou 80% do budget).
5. O sistema gera de imediato uma notificação de alerta crítico de desvio orçamentário no dashboard do gestor.
6. O sistema dispara e-mail de notificação de alerta para o controller financeiro do projeto.

**Fluxos alternativos:**
- *Estouro de 100% de budget:* Se a despesa exceder o limite total do projeto, o sistema bloqueia novos lançamentos de despesas de forma preventiva até que um aditivo de verba seja inserido.

**Fluxos de exceção:**
- *Exclusão de despesas:* Se a despesa causadora do alerta for removida, o sistema limpa a notificação de desvio orçamentário do dashboard de forma dinâmica no próximo recálculo.

**Pós-condições:** O alerta visual de controle de consumo de budget é gravado e enviado aos gestores responsáveis.

**Critérios de aceite:**
- [ ] Os gatilhos percentuais de alertas de budget (ex: avisar em 80%, 90% e 100%) devem ser parametrizáveis nas configurações do projeto.
- [ ] O recálculo e disparo das notificações devem ocorrer em menos de 1 segundo após a gravação da despesa.

**Prioridade:** Alta  
**Complexidade estimada:** Média
