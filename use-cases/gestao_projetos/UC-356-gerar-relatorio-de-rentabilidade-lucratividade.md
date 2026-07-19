### Caso de Uso: Gerar relatório de rentabilidade/lucratividade de projetos

**ID:** UC-356  
**Requisito relacionado:** RF-355 (gerar relatório de rentabilidade/lucratividade de projetos)  
**Ator(es):** Controller Financeiro, Diretor, Sistema  
**Pré-condições:** Custos do projeto e faturamentos/receitas (valores de contratos de clientes) registrados no sistema.  
**Gatilho:** O analista clica em "Gerar DRE / Lucratividade" no painel de portfólio.  

**Fluxo principal:**
1. O analista acessa "Finanças Corporativas" -> "Rentabilidade".
2. O analista seleciona o projeto desejado na listagem.
3. O sistema busca a receita total do projeto (faturamentos emitidos/contratados) e subtrai todos os custos e despesas incorridos correspondentes.
4. O sistema calcula: Lucro Bruto, Margem de Lucro (Lucro / Receita * 100) e Retorno sobre Investimento (ROI).
5. A tela renderiza a tabela no padrão de Demonstrativo do Resultado do Exercício (DRE) simplificado do projeto.
6. O analista exporta o relatório em formato PDF ou planilha XLS.

**Fluxos alternativos:**
- *Comparativo de rentabilidade:* O sistema gera um gráfico de dispersão comparando a margem de lucro de todos os projetos ativos do portfólio de forma consolidada.

**Fluxos de exceção:**
- *Projetos internos (sem receita):* Se o projeto for de infraestrutura interna, o sistema calcula apenas os custos brutas, e a rentabilidade é marcada como "Projeto de Custo Interno / Sem Receita Direta".

**Pós-condições:** O relatório DRE de rentabilidade e lucro do projeto é exportado e baixado pelo analista.

**Critérios de aceite:**
- [ ] O relatório em PDF deve conter de forma explícita a quebra de despesas de pessoal e operacionais em tabelas legíveis.
- [ ] A consolidação de lucros e perdas de um projeto médio deve demorar menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média
