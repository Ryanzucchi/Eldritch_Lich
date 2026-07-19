### Caso de Uso: Analisar ritmo/pacing do texto

**ID:** UC-145  
**Requisito relacionado:** RF-145 (analisar ritmo/pacing do texto)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto do capítulo está escrito.  
**Gatilho:** O usuário solicita a "Análise de Ritmo (Pacing)".  

**Fluxo principal:**
1. O usuário abre o menu de ferramentas estilísticas e clica em "Análise de Ritmo".
2. O sistema envia o texto para processamento de métricas.
3. A IA calcula a densidade de orações (tamanho de frases), proporção de verbos de ação contra verbos estáticos, e diálogos contra trechos descritivos.
4. O sistema gera um gráfico de ondas na interface representando a variação de ritmo ao longo do texto (ritmo rápido vs lento).
5. O usuário navega pelo gráfico para identificar trechos que possam estar cansativos ou rápidos demais.

**Fluxos alternativos:**
- *Sugestões de pacing:* O sistema sugere onde inserir quebras de frases para acelerar uma cena lenta ou onde detalhar mais para desacelerar.

**Fluxos de exceção:**
- *Estrutura de frases atípica:* Em poesias, o sistema avisa que as métricas padrão de ritmo de prosa podem não se aplicar adequadamente.

**Pós-condições:** O mapa gráfico do ritmo narrativo do texto é exibido para o usuário.

**Critérios de aceite:**
- [ ] O gráfico de pacing deve correlacionar os pontos do eixo X diretamente com a barra de rolagem e parágrafos correspondentes no editor.
- [ ] O tempo de cálculo e renderização da onda de ritmo de um arquivo de 5.000 palavras deve ser de no máximo 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
