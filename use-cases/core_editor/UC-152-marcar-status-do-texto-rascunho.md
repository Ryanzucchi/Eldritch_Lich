### Caso de Uso: Marcar status do texto (rascunho, revisão, finalizado)

**ID:** UC-152  
**Requisito relacionado:** RF-152 (marcar status do texto)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto existe no projeto.  
**Gatilho:** O usuário altera o status de fluxo de trabalho do documento.  

**Fluxo principal:**
1. O usuário abre o documento no editor de texto.
2. No painel de metadados, o usuário clica no seletor de status ativo.
3. O usuário seleciona o novo status: "Revisão".
4. O sistema grava a alteração do status no banco de dados e adiciona uma tag visual colorida no cabeçalho do arquivo e na árvore lateral.
5. Se o projeto for colaborativo, o sistema gera uma notificação informando aos revisores.

**Fluxos alternativos:**
- *Alteração em lote:* O usuário seleciona múltiplos textos na barra lateral, clica com o botão direito e seleciona "Alterar Status para..." -> "Finalizado".

**Fluxos de exceção:**
- *Sem permissão:* Se o usuário for apenas "Leitor", o seletor de status fica bloqueado.

**Pós-condições:** O status de progresso do texto é atualizado na base de dados e na interface lateral.

**Critérios de aceite:**
- [ ] A alteração do status na barra de navegação lateral deve ser instantânea (< 100ms).
- [ ] Ao marcar como "Finalizado", o sistema deve ter a opção de bloquear temporariamente edições no documento.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
