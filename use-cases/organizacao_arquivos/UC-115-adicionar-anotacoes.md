### Caso de Uso: Adicionar anotações

**ID:** UC-115  
**Requisito relacionado:** RF-115 (adicionar anotações)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O projeto ou um texto específico está aberto.  
**Gatilho:** O usuário abre o painel lateral de "Anotações" do projeto ou documento.  

**Fluxo principal:**
1. O usuário clica na aba "Anotações Gerais" do painel lateral.
2. O sistema exibe um editor de rascunhos simples separado do fluxo principal de capítulos.
3. O usuário digita notas rápidas, ideias de brainstorm ou links temporários.
4. O sistema salva as anotações automaticamente ao detectar inatividade na escrita.

**Fluxos alternativos:**
- *Anotação do projeto:* O usuário alterna para a aba "Anotações do Projeto" para registrar notas globais do universo fictício.

**Fluxos de exceção:**
- *Sem internet:* O sistema mantém as anotações gravadas no armazenamento local e executa a sincronização assim que reestabelecido o sinal de rede.

**Pós-condições:** A anotação rápida fica persistida nas propriedades do documento/projeto.

**Critérios de aceite:**
- [ ] O editor de anotações deve aceitar formatação Markdown básica (negrito, itálico, listas).
- [ ] O salvamento deve ser assíncrono com latência de resposta < 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
