### Caso de Uso: Gerar relatórios financeiros (DRE, Balanço, etc.)

**ID:** UC-389  
**Requisito relacionado:** RF-388 (gerar relatórios financeiros (DRE, Balanço, etc.))  
**Ator(es):** Controller Financeiro, Diretor, Sistema  
**Pré-condições:** Transações financeiras devidamente categorizadas no plano de contas.  
**Gatilho:** O analista clica em "Gerar Relatório DRE" ou "Balanço Patrimonial".  

**Fluxo principal:**
1. O analista acessa o painel de "Relatórios Financeiros".
2. O analista seleciona o tipo de relatório "DRE" e o período de apuração (ex: "Ano de 2026").
3. O backend busca todas as transações financeiras liquidadas do período, agrupando os valores conforme a árvore do plano de contas.
4. O sistema calcula a dedução progressiva: Receita -> Deduções -> Margem Bruta -> Despesas -> Lucro Líquido do Exercício.
5. A interface exibe a tabela estruturada de DRE com representatividade vertical e gráficos de margem.
6. O analista clica em "Exportar em PDF" e o arquivo correspondente é baixado pelo navegador.

**Fluxos alternativos:**
- *Balanço Patrimonial:* O analista seleciona "Balanço Patrimonial". O sistema busca o saldo consolidado de ativos e passivos estruturando o relatório em Ativo, Passivo e Patrimônio Líquido.

**Fluxos de exceção:**
- *Itens sem categoria:* Se houver lançamentos sem classificação de categoria no período selecionado, o sistema avisa na tela e insere uma linha de pendência vermelha indicando DRE incompleta.

**Pós-condições:** O relatório financeiro estruturado (DRE/Balanço) em formato PDF é gerado e baixado.

**Critérios de aceite:**
- [ ] O relatório financeiro deve seguir os padrões e nomenclaturas da contabilidade formal corporativa.
- [ ] O processamento e renderização do PDF financeiro completo com gráficos de margem devem durar menos de 3 segundos no servidor.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
