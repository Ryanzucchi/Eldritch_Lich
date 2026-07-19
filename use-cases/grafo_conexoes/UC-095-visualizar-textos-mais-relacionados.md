### Caso de Uso: Visualizar textos mais relacionados

**ID:** UC-095  
**Requisito relacionado:** RF-95 (visualizar textos mais relacionados)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem textos no projeto que possuem hyperlinks mútuos, tags compartilhadas ou alta similaridade semântica.  
**Gatilho:** O usuário seleciona a opção "Ver Matriz de Relação entre Textos".  

**Fluxo principal:**
1. O usuário acessa a tela de estatísticas textuais do projeto.
2. O sistema varre os textos e calcula o peso de correlação de cada par de arquivos (co-ocorrência de entidades, hyperlinks de referência e similaridade vetorial).
3. O sistema renderiza na tela uma Matriz de Adjacência de Relações (Heatmap) ou uma lista ordenada dos pares de textos com maior conexão semântica.
4. O usuário passa o cursor sobre uma célula da matriz para visualizar a porcentagem e o motivo da conexão (ex: "Capítulo 1 e Capítulo 2 compartilham 8 personagens e 3 tags").

**Fluxos alternativos:**
- *Grafo de arquivos:* O usuário visualiza os arquivos como nós de um grafo, onde a espessura da linha entre os nós representa o nível de correlação entre eles.

**Fluxos de exceção:**
- *Textos sem relações:* Se os arquivos forem completamente independentes e sem similaridade, a matriz exibe valores zerados em todas as células.

**Pós-condições:** O mapeamento de afinidade textual do projeto é exibido na interface.

**Critérios de aceite:**
- [ ] O heatmap deve usar gradientes de cor para indicar intensidade de relacionamento.
- [ ] O cálculo de similaridade e preenchimento da matriz para 50 arquivos deve ser processado em menos de 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
