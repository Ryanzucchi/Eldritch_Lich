### Caso de Uso: Procurar palavras

**ID:** UC-022  
**Requisito relacionado:** RF-22 (procurar palavras)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário tem o projeto aberto.  
**Gatilho:** O usuário clica no atalho Ctrl+F (ou na barra de busca global).  

**Fluxo principal:**
1. O usuário clica no campo de busca ou pressiona Ctrl+F.
2. O usuário digita uma palavra específica (ex: "espada").
3. O sistema varre o banco de dados indexado de textos do projeto procurando ocorrências literais exatas.
4. O sistema exibe uma lista de resultados contendo o nome do arquivo, a linha e um trecho do contexto onde a palavra aparece.
5. O usuário clica em um resultado e o sistema abre o arquivo no editor, rolando e destacando a palavra pesquisada.

**Fluxos alternativos:**
- *Busca case-sensitive:* O usuário marca a opção "Diferenciar maiúsculas de minúsculas" no painel de busca para restringir os resultados.

**Fluxos de exceção:**
- *Nenhum resultado encontrado:* O sistema apresenta uma mensagem discreta "Nenhuma ocorrência encontrada para '[palavra]'" e limpa os destaques na interface.

**Pós-condições:** As palavras correspondentes são listadas e destacadas na interface para o usuário.

**Critérios de aceite:**
- [ ] A busca em projetos de até 1 milhão de palavras deve ser concluída em menos de 200ms usando índices de texto invertido.
- [ ] O destaque visual (highlight) no editor de texto deve ser aplicado em todas as ocorrências simultaneamente.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa
