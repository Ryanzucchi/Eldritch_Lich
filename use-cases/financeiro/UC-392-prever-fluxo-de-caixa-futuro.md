### Caso de Uso: Prever fluxo de caixa futuro

**ID:** UC-392  
**Requisito relacionado:** RF-391 (prever fluxo de caixa futuro)  
**Ator(es):** Controller Financeiro, Sistema, IA  
**Pré-condições:** Histórico de lançamentos financeiros de fluxo de caixa e previsões de mercado ativas.  
**Gatilho:** O controller solicita a estimativa preditiva do saldo de caixa para os próximos períodos.  

**Fluxo principal:**
1. O controller acessa "Finanças" -> "Previsão de Fluxo de Caixa (Forecast)".
2. O controller seleciona a abrangência temporal da projeção (ex: "Próximos 6 meses").
3. O backend aciona o modelo preditivo que analisa o histórico de entradas e saídas, inadimplência e vencimentos futuros agendados.
4. A IA projeta três curvas de saldo futuro correspondentes a cenários distintos: Cenário Otimista, Realista e Pessimista.
5. A interface plota o gráfico de linhas multicores com as faixas de confiança da projeção.

**Fluxos alternativos:**
- *Simular contratação:* O controller insere uma simulação de despesa futura (ex: contratação de funcionários). O sistema recalcula as projeções em tempo real e exibe o impacto na curva de saldo de caixa futuro.

**Fluxos de exceção:**
- *Histórico curto:* Se o projeto possuir menos de 3 meses de lançamentos reais, o sistema limita as previsões estatísticas puramente aos lançamentos futuros agendados de contas a pagar e receber, emitindo alerta sobre precisão reduzida.

**Pós-condições:** A simulação preditiva das curvas de saldo de caixa futuro é exibida na tela.

**Critérios de aceite:**
- [ ] A simulação preditiva de 6 meses deve ser processada em menos de 2 segundos.
- [ ] O gráfico deve permitir habilitar ou desabilitar os cenários clicando nas legendas.

**Prioridade:** Média  
**Complexidade estimada:** Alta
