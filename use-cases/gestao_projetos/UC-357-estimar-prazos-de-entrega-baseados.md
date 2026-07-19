### Caso de Uso: Estimar prazos de entrega baseados em performance histórica

**ID:** UC-357  
**Requisito relacionado:** RF-356 (estimar prazos de entrega baseados em performance histórica)  
**Ator(es):** Gestor do Projeto, Sistema, IA  
**Pré-condições:** O projeto possui histórico de tarefas concluídas com datas de criação e encerramento reais salvas.  
**Gatilho:** O gestor solicita estimativa de prazo para um conjunto de novas tarefas no backlog.  

**Fluxo principal:**
1. O gestor acessa o Backlog do projeto e seleciona as novas tarefas correspondentes.
2. O gestor clica em "Prever Prazo de Conclusão por IA".
3. O backend analisa o histórico de performance da equipe, avaliando o lead time médio de tarefas semelhantes concluídas anteriormente (mesma complexidade, mesmo executor).
4. A IA roda simulação estatística Monte Carlo.
5. O sistema exibe o resultado da projeção de prazo na tela (ex: "Entrega em 25/08/2026 com 85% de confiança").
6. O gestor concorda e aplica a estimativa sugerida no cronograma oficial.

**Fluxos alternativos:**
- *Preenchimento empírico:* O gestor ignora a sugestão da IA e preenche as datas finais de entrega manualmente baseado na capacidade horária da equipe.

**Fluxos de exceção:**
- *Histórico insuficiente:* Se o projeto for recém-criado e possuir menos de 10 tarefas concluídas no histórico, o sistema avisa de que a previsão estatística é imprecisa e sugere usar estimativas baseadas na velocidade global padrão da empresa.

**Pós-condições:** O prazo projetado é salvo nas metas de cronograma do projeto.

**Critérios de aceite:**
- [ ] A simulação Monte Carlo para estimativa de prazos deve rodar e apresentar o histograma de probabilidade em menos de 3 segundos na tela.
- [ ] O sistema deve exibir a margem de erro estimada da previsão na tela.

**Prioridade:** Média  
**Complexidade estimada:** Alta
