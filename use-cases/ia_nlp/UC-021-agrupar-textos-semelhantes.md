### Caso de Uso: Agrupar textos semelhantes

**ID:** UC-021  
**Requisito relacionado:** RF-21 (agrupar textos semelhantes)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui múltiplos textos salvos.  
**Gatilho:** O usuário solicita o agrupamento de textos por semelhança semântica na aba de ferramentas.  

**Fluxo principal:**
1. O usuário acessa o menu de ferramentas do projeto e clica em "Agrupar Textos Semelhantes".
2. O sistema extrai o conteúdo de todos os textos ativos e gera vetores de embedding para cada um.
3. O sistema aplica um algoritmo de agrupamento (clustering, como K-Means ou DBSCAN) baseado na similaridade de cosseno entre os vetores.
4. O sistema apresenta os grupos sugeridos em um painel interativo (ex: "Grupo A: Magia e Feitiçaria", "Grupo B: Revolução Industrial").
5. O usuário seleciona quais grupos deseja consolidar em pastas ou marcar com tags em lote.
6. O usuário clica em "Aplicar Agrupamento".

**Fluxos alternativos:**
- *Ajuste de sensibilidade:* O usuário pode ajustar um slider de "Sensibilidade/Rigidez" para tornar os grupos mais amplos ou mais estritos antes de reprocessar.

**Fluxos de exceção:**
- *Textos insuficientes:* Se houver menos de 3 textos no projeto, o sistema cancela a operação e exibe: "Número insuficiente de textos para realizar agrupamento semântico (mínimo de 3 textos)".

**Pós-condições:** Os textos são categorizados, movidos ou tagueados de acordo com os grupos aceitos pelo usuário.

**Critérios de aceite:**
- [ ] O algoritmo deve processar e agrupar 100 textos em menos de 5 segundos.
- [ ] Os agrupamentos gerados devem possuir títulos sugeridos pela IA que reflitam o tema comum do grupo.

**Prioridade:** Média  
**Complexidade estimada:** Alta
