### Caso de Uso: Gerar sugestões de conexão

**ID:** UC-054  
**Requisito relacionado:** RF-54 (gerar sugestões de conexão)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Existem textos e entidades cadastrados no projeto que possuem menções ou temas similares implicitamente.  
**Gatilho:** O usuário abre o painel "Sugestões de Relacionamento" do projeto.  

**Fluxo principal:**
1. O sistema varre o grafo de conhecimento e os textos do projeto em background.
2. A IA analisa relações implícitas não registradas (ex: menções indiretas como "a filha de Aldric" e a personagem "Clara" ser filha de Aldric na ficha técnica).
3. O sistema apresenta uma lista de conexões sugeridas rotuladas com a justificativa (ex: "Sugerido: Conectar Personagem Clara à ficha de Aldric").
4. O usuário clica em "Aprovar Conexão" para consolidar a aresta no grafo.

**Fluxos alternativos:**
- *Ignorar em massa:* O usuário seleciona múltiplos itens sugeridos e clica em "Ignorar Sugestões".

**Fluxos de exceção:**
- *Falta de conexões:* Se o grafo do projeto já estiver altamente mapeado e não houver sugestões válidas com score de confiança relevante, a interface exibe "Nenhuma nova sugestão de conexão identificada".

**Pós-condições:** As novas conexões selecionadas são gravadas no banco de dados de relacionamentos.

**Critérios de aceite:**
- [ ] Cada sugestão de conexão gerada pela IA deve vir acompanhada da justificativa contextual correspondente.
- [ ] O cálculo das sugestões deve ser processado em fila em background (job assíncrono).

**Prioridade:** Alta  
**Complexidade estimada:** Alta
