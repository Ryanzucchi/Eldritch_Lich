### Caso de Uso: Visualizar status de múltiplos projetos em painel consolidado

**ID:** UC-353  
**Requisito relacionado:** RF-352 (visualizar status de múltiplos projetos em painel consolidado)  
**Ator(es):** Gestor de PMO/Diretoria, Sistema  
**Pré-condições:** Múltiplos projetos ativos cadastrados no sistema.  
**Gatilho:** O gestor clica em "Dashboard Multiprojetos".  

**Fluxo principal:**
1. O gestor acessa o painel de diretoria -> "Dashboard Consolidado".
2. O sistema faz a leitura dos dados em tempo real de todos os projetos ativos, computando: percentual médio de conclusão de tarefas, indicadores de saúde, próximos marcos (milestones) e total de horas apontadas.
3. A interface renderiza o grid comparativo contendo cards dinâmicos para cada projeto com gráficos de tendência.
4. O gestor filtra a lista para ver apenas projetos sob risco (Vermelho/Crítico) para intervir nas operações.

**Fluxos alternativos:**
- *Exportar sumário executivo:* O gestor clica em "Exportar Relatório Geral" e gera um sumário executivo em PDF de 1 página contendo o status consolidado de todos os projetos ativos.

**Fluxos de exceção:**
- *Projetos recém-criados:* Projetos sem tarefas cadastradas são exibidos com o status "Sem Atividade" na lista, ocultando os gráficos de tendência temporariamente.

**Pós-condições:** O dashboard multiprojetos consolidado é gerado e atualizado em tempo real na tela.

**Critérios de aceite:**
- [ ] O carregamento inicial e agregação dos KPIs de até 30 projetos ativos no dashboard devem durar menos de 1,5 segundos.
- [ ] O painel deve atualizar automaticamente a cada 5 minutos via polling ou websockets.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
