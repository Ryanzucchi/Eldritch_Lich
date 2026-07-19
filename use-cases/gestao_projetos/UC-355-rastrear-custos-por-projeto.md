### Caso de Uso: Rastrear custos por projeto

**ID:** UC-355  
**Requisito relacionado:** RF-354 (rastrear custos por projeto)  
**Ator(es):** Gestor do Projeto, Controller Financeiro, Sistema  
**Pré-condições:** Parâmetros de custos (salários de colaboradores alocados, licenças, infraestrutura) configurados.  
**Gatilho:** O gestor acessa o painel financeiro de controle de despesas do projeto.  

**Fluxo principal:**
1. O gestor abre o menu lateral "Finanças do Projeto" -> "Fluxo de Custos".
2. O sistema coleta de forma integrada os custos de mão de obra (salários proporcionais calculados a partir das alocações e horas trabalhadas), despesas fixas (servidores, licenças) e despesas variáveis pontuais (viagens, consultorias).
3. O sistema calcula a soma agregada dos custos incorridos até o momento.
4. A interface exibe o comparativo gráfico de Orçado (Budget) versus Realizado (Actual Cost).
5. O gestor analisa e fecha a conciliação mensal de custos do projeto.

**Fluxos alternativos:**
- *Lançar despesa manual:* O gestor clica em "Nova Despesa", anexa o comprovante fiscal correspondente e digita a classificação de custos para rateio manual.

**Fluxos de exceção:**
- *Sem orçamento definido:* Se o projeto não possuir um orçamento de limite definido, o gráfico exibe apenas os custos acumulados em barras brutas sem a meta limite comparativa.

**Pós-condições:** O acumulador de despesas financeiras do projeto é atualizado e persistido na base de dados.

**Critérios de aceite:**
- [ ] O cálculo do custo de horas de funcionários deve cruzar os dados exatos de presença do ponto e de faixas salariais cadastradas no DP.
- [ ] A renderização financeira e cálculos de rateio de despesas devem durar menos de 800ms.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
