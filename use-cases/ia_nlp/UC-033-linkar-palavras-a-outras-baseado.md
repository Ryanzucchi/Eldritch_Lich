### Caso de Uso: Linkar palavras a outras baseado no contexto

**ID:** UC-033  
**Requisito relacionado:** RF-33 (linkar palavras a outras baseado no contexto)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Existem termos semanticamente relacionados em diferentes textos do projeto.  
**Gatilho:** O usuário seleciona "Gerar Conexões Contextuais" ou passa o cursor sobre um termo sublinhado pelo sistema.  

**Fluxo principal:**
1. O sistema mapeia os termos de um documento e compara com termos de outros documentos do projeto usando a base de conhecimento (grafo semântico).
2. A IA identifica termos equivalentes ou relacionados contextualmente (ex: a palavra "Coroa" linkada ao termo "Monarquia").
3. O sistema cria um link contextual interativo sobre a palavra.
4. O usuário clica no link contextual e vê uma lista de palavras e trechos correlacionados com aquele termo em outros documentos.
5. O usuário clica em uma das sugestões para navegar até ela.

**Fluxos alternativos:**
- *Aceite manual:* O sistema sugere as conexões em uma barra lateral antes de transformar o texto do editor em links visíveis.

**Fluxos de exceção:**
- *Conexões irrelevantes:* Se a IA sugerir uma conexão inadequada, o usuário pode clicar em "Ignorar relação" para remover o link contextual daquela palavra específica.

**Pós-condições:** As conexões de palavras por contexto são salvas na tabela de relacionamentos do grafo do projeto.

**Critérios de aceite:**
- [ ] O sistema não deve sobrescrever links manuais inseridos pelo usuário.
- [ ] A criação de links baseados em contexto deve respeitar as desambiguações verificadas em UC-030 (sentido correto do termo).

**Prioridade:** Alta  
**Complexidade estimada:** Alta
