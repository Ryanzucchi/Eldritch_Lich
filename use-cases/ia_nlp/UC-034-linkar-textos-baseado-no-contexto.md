### Caso de Uso: Linkar textos baseado no contexto

**ID:** UC-034  
**Requisito relacionado:** RF-34 (linkar textos baseado no contexto)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui múltiplos textos indexados com vetores semânticos.  
**Gatilho:** O usuário abre o painel lateral de "Documentos Relacionados" de um texto ativo.  

**Fluxo principal:**
1. O usuário abre um texto no editor.
2. O sistema envia a representação semântica do texto ativo para comparação contra os demais textos do projeto.
3. O sistema calcula a similaridade global de conteúdo e contexto entre os documentos.
4. O sistema lista na barra lateral os 5 textos com maior similaridade semântica (ex: "Capítulo 3 (85% de similaridade)", "Ficha: A Batalha de Eldoria (72% de similaridade)").
5. O usuário clica em "Vincular" em uma sugestão para criar um link de referência recíproca entre os textos.

**Fluxos alternativos:**
- *Auto-link:* O sistema vincula automaticamente na base de dados os textos que possuem mais de 80% de similaridade semântica, marcando a conexão como gerada por IA.

**Fluxos de exceção:**
- *Projetos com apenas um texto:* A barra lateral de documentos relacionados é oculta ou exibe a mensagem "Crie mais textos para ver as recomendações de conexão".

**Pós-condições:** A conexão referencial entre os documentos é estabelecida e salva no banco de dados.

**Critérios de aceite:**
- [ ] O sistema deve sugerir links bidirecionais entre os textos recomendados.
- [ ] A lista de recomendações contextuais de textos deve ser atualizada de forma assíncrona para não comprometer a digitação.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
