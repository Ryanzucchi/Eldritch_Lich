### Caso de Uso: Gerenciar orçamento financeiro do projeto

**ID:** UC-381  
**Requisito relacionado:** RF-380 (gerenciar orçamento financeiro do projeto)  
**Ator(es):** Gestor do Projeto, Controller Financeiro, Sistema  
**Pré-condições:** O projeto está ativo no sistema.  
**Gatilho:** O gestor inicia o planejamento financeiro anual/semestral do projeto.  

**Fluxo principal:**
1. O gestor acessa o painel "Finanças" -> "Orçamentação (Budget)".
2. O gestor clica em "Definir Orçamento de Referência".
3. O sistema abre o formulário solicitando: Orçamento Total Estimado, Período de Vigência e divisão por centro de custo (mão de obra, infraestrutura, marketing, reserva).
4. O gestor preenche a divisão de recursos financeiros e clica em "Salvar Orçamento".
5. O sistema grava as informações e estabelece a linha de base (baseline) orçamentária do projeto.

**Fluxos alternativos:**
- *Revisão orçamentária:* No meio do projeto, o gestor edita os centros de custo para realocar recursos, e o sistema registra uma nova versão do orçamento de controle para fins de auditoria.

**Fluxos de exceção:**
- *Valores inválidos:* Se o gestor preencher valores negativos nos limites totais de orçamento ativo, o sistema bloqueia o salvamento e solicita a correção.

**Pós-condições:** O orçamento de referência do projeto é definido e persistido na base de dados.

**Critérios de aceite:**
- [ ] A interface deve exibir gráfico de rosca (donut chart) com o rateio percentual por centro de custo.
- [ ] A gravação do orçamento de referência deve levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
