### Caso de Uso: Criar sumário personalizado

**ID:** UC-250  
**Requisito relacionado:** RF-250 (criar sumário personalizado)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Capítulos e documentos de texto cadastrados no projeto.  
**Gatilho:** O usuário seleciona "Novo Sumário Personalizado" nas opções da aba de sumários.  

**Fluxo principal:**
1. O usuário acessa a seção de sumários e clica em "Criar Sumário Personalizado".
2. O sistema abre um painel de montagem em branco.
3. O usuário seleciona quais capítulos e em qual sequência deseja incluir no sumário personalizado.
4. O usuário clica em "Salvar Sumário".
5. O sistema grava o sumário personalizado e sua ordem de itens no banco de dados.
6. O usuário passa a ter acesso a este sumário customizado para navegação rápida.

**Fluxos alternativos:**
- *Exportar sumário personalizado:* O usuário escolhe exportar o manuscrito baseado no sumário personalizado configurado.

**Fluxos de exceção:**
- *Arquivo excluído:* Se um capítulo pertencente ao sumário personalizado for apagado do projeto, o sumário mantém sua ordenação, exibindo um rótulo indicando arquivo inexistente para o respectivo item.

**Pós-condições:** O sumário com configuração personalizada é gravado e disponibilizado para visualização e exportação.

**Critérios de aceite:**
- [ ] A interface do criador de sumário customizado deve permitir selecionar arquivos clicando em caixas de seleção de forma simples.
- [ ] A gravação do sumário customizado no banco deve demorar menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
