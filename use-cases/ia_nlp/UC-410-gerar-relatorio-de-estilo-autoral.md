### Caso de Uso: Gerar relatório de "estilo autoral" com base em todos os projetos

**ID:** UC-410  
**Requisito relacionado:** RF-405 (gerar relatório de "estilo autoral" com base em todos os projetos)  
**Ator(es):** Usuário, Sistema, IA  
**Pré-condições:** O usuário possui textos de capítulos e diálogos escritos em seus projetos.  
**Gatilho:** O usuário seleciona "Análise de Estilo de Escrita" no menu do perfil.  

**Fluxo principal:**
1. O usuário abre seu perfil de escritor e clica em "Relatório de Estilo Autoral".
2. O backend aciona o motor de análise estilométrica (stylometry) sobre os textos compilados do usuário de todos os projetos.
3. O sistema computa: vocabulário predominante, extensão média de sentenças, riqueza lexical, tons emocionais mais frequentes, uso de voz ativa/passiva e ritmo de frases.
4. O sistema gera o relatório consolidado de estilo em formato gráfico, exibindo a proximidade estilística do autor com escritores renomados e gráficos de radar de suas características de escrita.
5. O usuário visualiza o relatório e faz a exportação em PDF.

**Fluxos alternativos:**
- *Análise por gênero:* O usuário segmenta a análise de estilo autoral para focar apenas nas obras marcadas como de determinado gênero literário (ex: "Ficção Científica").

**Fluxos de exceção:**
- *Volume insuficiente:* Se o usuário possuir menos de 1.000 palavras escritas em toda a sua conta, o sistema suspende a análise alegando que a massa de dados de escrita é insuficiente para precisão estatística.

**Pós-condições:** O relatório estilométrico em PDF do estilo de escrita do autor é gerado e baixado.

**Critérios de aceite:**
- [ ] O relatório final deve ser exibido com gráficos de radar e barra com cores harmoniosas e legibilidade profissional.
- [ ] A compilação estilométrica de até 50.000 palavras deve demorar no máximo 8 segundos no servidor.

**Prioridade:** Média  
**Complexidade estimada:** Alta
