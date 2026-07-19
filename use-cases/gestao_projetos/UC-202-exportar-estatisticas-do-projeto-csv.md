### Caso de Uso: Exportar estatísticas do projeto (CSV/PDF)

**ID:** UC-202  
**Requisito relacionado:** RF-202 (exportar estatísticas do projeto (CSV/PDF))  
**Ator(es):** Usuário (Escritor/Admin), Sistema  
**Pré-condições:** O projeto possui dados estatísticos acumulados no dashboard.  
**Gatilho:** O usuário clica no botão "Exportar Relatório" no Dashboard de estatísticas.  

**Fluxo principal:**
1. O usuário acessa o painel de estatísticas.
2. O usuário clica em "Exportar Métricas" e seleciona o formato: "Relatório Consolidado (PDF)" ou "Dados Brutos (CSV)".
3. O usuário seleciona a opção "Relatório Consolidado (PDF)" e clica em confirmar.
4. O sistema gera a formatação de tabelas e insere os gráficos renderizados em imagem no arquivo PDF.
5. O navegador inicia o download automático do arquivo.

**Fluxos alternativos:**
- *Exportação CSV:* O usuário escolhe CSV. O sistema compila os logs de palavras por dia e distribuição de entidades em colunas tabuladas prontas para uso no Excel.

**Fluxos de exceção:**
- *Dados nulos:* Se o projeto não possuir registros de escrita ou dados, o sistema emite um alerta e desabilita a exportação.

**Pós-condições:** O relatório consolidado de métricas e produtividade do projeto é gerado e baixado.

**Critérios de aceite:**
- [ ] O arquivo PDF gerado deve possuir formatação profissional com capas e sumários explicativos.
- [ ] O processamento do PDF estatístico deve demorar menos de 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média
