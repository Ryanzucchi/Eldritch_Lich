### Caso de Uso: Gerar relatório de atingimento de metas

**ID:** UC-349  
**Requisito relacionado:** RF-348 (gerar relatório de atingimento de metas)  
**Ator(es):** Gestor, Sistema  
**Pré-condições:** Período de validade da OKR encerrado.  
**Gatilho:** O gestor seleciona "Gerar Relatório de Fechamento" no painel estratégico.  

**Fluxo principal:**
1. O gestor acessa o painel de OKRs e escolhe a opção "Relatórios de Fechamento de Metas".
2. O gestor seleciona o período correspondente (ex: "Q3 2026") e clica em "Gerar Relatório".
3. O backend consolida todos os dados históricos de KRs do período, calculando a nota final de atingimento de cada KR (escala de 0.0 a 1.0) e a nota consolidada do Objetivo.
4. O sistema gera um documento de relatório estruturado contendo: Resumo executivo, Metas Atingidas, Iniciativas operacionais realizadas e a nota ponderada total.
5. O gestor exporta o relatório em formato PDF ou gera um link de compartilhamento.

**Fluxos alternativos:**
- *Performance Individual:* O sistema gera o relatório focado na performance do colaborador, cruzando os objetivos individuais atingidos com suas avaliações de desempenho.

**Fluxos de exceção:**
- *Período sem OKRs:* Se não houver objetivos definidos para o período selecionado, o sistema avisa na tela e impede a exportação do documento.

**Pós-condições:** O relatório consolidado em PDF do atingimento de metas do período é gerado e baixado.

**Critérios de aceite:**
- [ ] O processamento e formatação do PDF final de metas devem demorar menos de 3 segundos no servidor.
- [ ] O relatório deve conter tabelas limpas e gráficos legíveis.

**Prioridade:** Média  
**Complexidade estimada:** Média
