### Caso de Uso: Mostrar quais textos serão afetados por uma alteração

**ID:** UC-071  
**Requisito relacionado:** RF-71 (mostrar quais textos serão afetados por uma alteração)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O sistema possui o grafo de dependências indexado e o usuário iniciou uma alteração em uma entidade ou evento.  
**Gatilho:** O usuário edita uma ficha de entidade ou um texto que serve de origem causal.  

**Fluxo principal:**
1. O usuário clica em "Salvar Alteração" em uma entidade/evento ou texto.
2. O sistema analisa em tempo real o escopo de impacto no grafo de causalidade.
3. O sistema exibe um modal contendo a lista de textos do projeto que contêm referências à entidade alterada em trechos posteriores à data da alteração.
4. Ao lado de cada título de texto afetado, o sistema mostra um sinalizador de gravidade (ex: "Alto Impacto: Personagem morto é citado como vivo").
5. O usuário confirma a alteração após ler a lista de impactos.

**Fluxos alternativos:**
- *Filtrar afetados:* O usuário pode clicar diretamente em qualquer item da lista de afetados para abrir o arquivo e iniciar a edição corretiva.

**Fluxos de exceção:**
- *Nenhum texto afetado:* Se a alteração não possuir dependências lógicas subsequentes nos textos cadastrados, o sistema prossegue com o salvamento direto sem exibir o aviso.

**Pós-condições:** O usuário é alertado preventivamente sobre quais arquivos e cenas necessitarão de revisão após a modificação realizada.

**Critérios de aceite:**
- [ ] A varredura de dependências deve varrer arquivos em todas as pastas do projeto.
- [ ] A lista de impacto deve ser exibida em menos de 1 segundo após o salvamento.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
