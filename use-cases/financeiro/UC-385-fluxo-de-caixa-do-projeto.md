### Caso de Uso: Fluxo de caixa do projeto

**ID:** UC-385  
**Requisito relacionado:** RF-384 (fluxo de caixa do projeto)  
**Ator(es):** Gestor do Projeto, Controller Financeiro, Sistema  
**Pré-condições:** Transações financeiras com status de data de pagamento/recebimento real salvas.  
**Gatilho:** O gestor abre o painel de fluxo de caixa para análise de liquidez.  

**Fluxo principal:**
1. O gestor acessa o painel "Finanças" -> "Fluxo de Caixa".
2. O gestor seleciona o período de análise (ex: mensal) e a visualização (Diária ou Semanal).
3. O sistema busca todas as transações financeiras liquidadas (Pagas / Recebidas) do período correspondente.
4. O sistema compila a estrutura de fluxo de caixa: Saldo Inicial, Entradas, Saídas, Saldo Operacional e Saldo Final Acumulado.
5. A interface exibe a tabela estruturada e o gráfico de variação diária de caixa com projeção de saldo.
6. O gestor analisa a liquidez do projeto para os meses subsequentes.

**Fluxos alternativos:**
- *Fluxo projetado:* O gestor ativa a chave "Incluir Projeções". O sistema adiciona ao gráfico as receitas "A Receber" e despesas "A Pagar" pendentes com datas futuras, gerando a curva de previsão de saldo para os próximos 3 meses.

**Fluxos de exceção:**
- *Transações não liquidadas:* Transações sem data de pagamento ou recebimento preenchidas são ignoradas no regime de caixa para evitar distorções de saldo real.

**Pós-condições:** O relatório de fluxo de caixa do projeto é renderizado na tela de forma visual.

**Critérios de aceite:**
- [ ] O gráfico de fluxo de caixa projetado deve recalcular dinamicamente de forma imediata ao alternar filtros de datas.
- [ ] A velocidade de processamento do fluxo de caixa mensal com até 1.000 lançamentos deve ser de no máximo 1 segundo.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
