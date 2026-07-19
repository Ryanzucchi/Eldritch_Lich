### Caso de Uso: Calcular folha de pagamento

**ID:** UC-303  
**Requisito relacionado:** RF-302 (calcular folha de pagamento)  
**Ator(es):** Administrador/RH, Sistema  
**Pré-condições:** Existem funcionários cadastrados com salários definidos e o período da folha está em aberto.  
**Gatilho:** O gestor clica em "Calcular Folha de Pagamento" no fechamento do mês.  

**Fluxo principal:**
1. O gestor acessa o painel do "Financeiro/DP" -> "Folha de Pagamento".
2. O gestor seleciona o mês e ano de competência (ex: "Julho/2026").
3. O gestor clica em "Calcular Folha".
4. O sistema busca todos os funcionários ativos daquele período.
5. Para cada funcionário, o sistema calcula: Salário Base, proventos (horas extras, adicionais), descontos (faltas, atrasos) e os impostos trabalhistas correspondentes (INSS, FGTS, IRRF).
6. O sistema monta a tabela de resumo contendo o valor bruto e líquido a pagar por funcionário e o total consolidado da empresa.
7. O gestor revisa os valores e clica em "Aprovar Folha".
8. O sistema atualiza o status do período para "Calculado" e gera as contas a pagar no módulo financeiro.

**Fluxos alternativos:**
- *Cálculo proporcional:* Se o funcionário foi admitido ou desligado no meio do mês, o sistema calcula o salário proporcional aos dias trabalhados naquele período.

**Fluxos de exceção:**
- *Período já fechado:* Se o gestor tentar recalcular uma folha de um período marcado como "Pago/Fechado", o sistema bloqueia e avisa: "Não é possível recalcular folha de período encerrado".

**Pós-condições:** A folha de pagamento do período é calculada, aprovada e salva na base de dados.

**Critérios de aceite:**
- [ ] O cálculo matemático deve seguir as fórmulas vigentes de impostos sem arredondamentos incorretos.
- [ ] O cálculo em lote para 50 funcionários deve ser processado em menos de 3 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
