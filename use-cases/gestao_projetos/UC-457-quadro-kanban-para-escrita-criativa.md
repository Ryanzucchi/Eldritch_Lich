### Caso de Uso: Quadro Kanban para Escrita Criativa

**ID:** UC-457  
**Requisito relacionado:** RF-196 (cronograma de escrita / quadro Kanban)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui capítulos, cenas e metas estruturadas.  
**Gatilho:** O usuário clica em "Quadro Kanban" no menu lateral do projeto.  

**Fluxo principal:**
1. O usuário entra na tela do painel Kanban.
2. O sistema renderiza a interface adaptada de 4 colunas:
   - *Backlog* (Ideias soltas, metas sem ordem definida).
   - *A Escrever* (Próximas cenas e metas priorizadas para redação).
   - *Escrevendo* (Metas e cenas sendo redigidas ativamente no momento).
   - *Escrito* (Metas e cenas validadas pelo MMS ou confirmadas manualmente pelo autor).
3. O usuário arrasta um cartão de tarefa entre as colunas para atualizar seu status.
4. O sistema persiste a nova posição no banco de dados local IndexedDB.

**Fluxos alternativos:**
- *Filtragem de Visão:* O usuário clica em "Filtrar" e seleciona um Personagem ou Locação da Wiki. O Kanban oculta todos os cartões de metas que não possuam tag ou relação semântica com a entidade selecionada.
- *Resolução de Desvio:* O usuário clica em um cartão marcado com o badge vermelho de *INCONSISTENTE*. O sistema exibe um menu de resolução com as opções: (a) Abrir trecho do manuscrito para reescrever a cena (ativando o StyleGuard-PT); (b) Quebrar a dependência causal no GMN.

**Fluxos de exceção:**
- *Conflito de Sincronização:* Se dois colaboradores arrastarem o mesmo cartão em direções opostas de forma quase simultânea em modo colaborativo online, o sistema usa o CRDT do Yjs para convergir o estado de forma idempotente, exibindo a posição vencedora em tempo real sem criar alertas pop-up de erro.

**Pós-condições:** O status do Kanban é atualizado localmente no IndexedDB e refletido para parceiros via sincronização CRDT (Yjs) se o modo colaborativo estiver ativo.

**Critérios de aceite:**
- [ ] O visual do quadro Kanban deve seguir as especificações de acessibilidade (WCAG), permitindo movimentar cartões por comandos de teclado e anunciando atualizações em leitores de tela.
- [ ] Filtros por personagem ou local devem atualizar a interface em menos de 10ms.
- [ ] A alteração manual de um cartão de meta do GMN para a coluna *Escrito* sem a validação automática do MMS deve requerer uma confirmação do autor, registrando que a conclusão foi manual.

**Prioridade:** Alta  
**Complexidade estimada:** Média
