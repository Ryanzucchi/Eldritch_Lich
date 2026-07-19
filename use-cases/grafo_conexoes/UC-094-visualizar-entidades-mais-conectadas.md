### Caso de Uso: Visualizar entidades mais conectadas

**ID:** UC-094  
**Requisito relacionado:** RF-94 (visualizar entidades mais conectadas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui entidades com conexões registradas no grafo.  
**Gatilho:** O usuário acessa "Análise do Grafo" -> "Entidades Mais Conectadas".  

**Fluxo principal:**
1. O usuário clica em "Visualizar Estatísticas do Grafo" no painel de ferramentas.
2. O sistema calcula a centralidade de grau (número de arestas diretas) de cada nó de entidade na base de dados.
3. O sistema gera uma lista ordenada decrescente das entidades com maior número de vínculos no projeto.
4. A interface exibe a lista em formato de gráfico de barras lateral ou destaca os nós correspondentes no canvas do grafo aumentando seu diâmetro proporcionalmente ao número de conexões.
5. O usuário clica sobre o nome de uma entidade na lista para visualizá-la no grafo.

**Fluxos alternativos:**
- *Centralidade de intermediação:* O usuário opta por ordenar por centralidade de intermediação (*betweenness centrality*) para identificar personagens que conectam núcleos diferentes da história.

**Fluxos de exceção:**
- *Grafo sem arestas:* Se não houver relações catalogadas entre entidades, a lista é apresentada vazia com a notificação "Registre relacionamentos entre entidades para mapear conexões".

**Pós-condições:** A relevância de conectividade das entidades do universo é exibida.

**Critérios de aceite:**
- [ ] O diâmetro do nó no grafo visual deve mudar dinamicamente conforme a métrica de centralidade selecionada.
- [ ] O cálculo das métricas de centralidade de grau de 500 nós deve levar menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Alta
