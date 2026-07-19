### Caso de Uso: Refazer alterações

**ID:** UC-123  
**Requisito relacionado:** RF-123 (refazer alterações)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O usuário executou a ação "Desfazer" (UC-122) pelo menos uma vez na sessão atual.  
**Gatilho:** O usuário clica no botão "Refazer" (Redo) na barra de ferramentas ou pressiona o atalho Ctrl+Y (ou Ctrl+Shift+Z).  

**Fluxo principal:**
1. O usuário pressiona Ctrl+Y.
2. O sistema recupera o estado desfeito da pilha de Redo.
3. O sistema reaplica a alteração no editor de texto ou no canvas.
4. O editor renderiza a alteração e atualiza a posição do cursor.

**Fluxos alternativos:**
- *Refazer no grafo:* O usuário re-aplica uma alteração de conexão desfeita anteriormente no grafo.

**Fluxos de exceção:**
- *Pilha de Redo vazia:* Se não houver estados desfeitos na pilha, o sistema ignora o atalho de teclado silenciosamente.

**Pós-condições:** A alteração desfeita é reaplicada com sucesso.

**Critérios de aceite:**
- [ ] A ação de Redo deve ser limpa se o usuário realizar qualquer nova edição de escrita após um Undo.
- [ ] A re-aplicação deve ocorrer em menos de 50ms.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa
