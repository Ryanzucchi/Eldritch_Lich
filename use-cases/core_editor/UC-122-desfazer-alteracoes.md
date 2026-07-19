### Caso de Uso: Desfazer alterações

**ID:** UC-122  
**Requisito relacionado:** RF-122 (desfazer alterações)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O editor de texto está focado e o usuário realizou pelo menos uma alteração no texto na sessão atual.  
**Gatilho:** O usuário clica no botão "Desfazer" (Undo) na barra de ferramentas ou pressiona o atalho Ctrl+Z (ou Cmd+Z).  

**Fluxo principal:**
1. O usuário edita o texto e pressiona Ctrl+Z.
2. O sistema intercepta o atalho e recupera o estado anterior do editor a partir do histórico local (pilha de Undo em memória).
3. O sistema reverte a última alteração realizada.
4. O editor atualiza a renderização na tela e move o cursor para a posição correspondente.

**Fluxos alternativos:**
- *Desfazer alteração no grafo:* O usuário arrasta um nó no grafo e pressiona Ctrl+Z. O sistema desfaz a movimentação do nó e o retorna para a coordenada anterior.

**Fluxos de exceção:**
- *Pilha de desfazer vazia:* Se o usuário pressionar Ctrl+Z sem nenhuma alteração pendente de desfazer, o sistema emite um bipe sonoro sutil de erro e nenhuma alteração é feita.

**Pós-condições:** O estado do editor/grafo retorna à etapa imediatamente anterior.

**Critérios de aceite:**
- [ ] O histórico de desfazer no editor de texto deve armazenar pelo menos 100 estados da sessão atual.
- [ ] A reversão de estado deve ocorrer instantaneamente (< 50ms).

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa
