### Caso de Uso: Buscar mensagens/arquivos no histórico do chat

**ID:** UC-372  
**Requisito relacionado:** RF-371 (buscar mensagens/arquivos no histórico do chat)  
**Ator(es):** Colaborador, Sistema  
**Pré-condições:** Histórico de conversas de chat gravado no banco de dados.  
**Gatilho:** O colaborador digita termos na caixa de pesquisa do cabeçalho do chat.  

**Fluxo principal:**
1. O colaborador acessa o chat do projeto e clica na caixa "Pesquisar no histórico".
2. O colaborador digita o termo de busca (ex: "servidores") e confirma.
3. O sistema realiza busca na tabela correspondente aplicando filtros por texto.
4. A interface exibe a listagem de resultados dividida nas abas de mensagens e arquivos.
5. O usuário clica sobre a mensagem localizada, e o sistema rola automaticamente a timeline do canal até a data exata da mensagem, destacando a linha correspondente de forma sutil.

**Fluxos alternativos:**
- *Filtro Avançado:* O usuário refina a busca selecionando remetente (ex: "Arthur"), data (ex: "Últimos 7 dias") ou canal de origem.

**Fluxos de exceção:**
- *Nenhum resultado:* Se o termo pesquisado não existir nas tabelas do banco, o sistema exibe uma mensagem de retorno de dados em branco na tela.

**Pós-condições:** A lista de mensagens e mídias localizadas é exibida na interface do chat.

**Critérios de aceite:**
- [ ] A pesquisa textual deve aceitar acentuações e ser case-insensitive.
- [ ] O tempo de resposta de busca em uma base de 10.000 mensagens deve ser inferior a 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
