### Caso de Uso: Vincular notas de pesquisa a fontes

**ID:** UC-317  
**Requisito relacionado:** RF-316 (vincular notas de pesquisa a fontes)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** Notas de pesquisa (anotações livres/rascunhos) e referências bibliográficas cadastradas.  
**Gatilho:** O usuário edita uma nota de pesquisa acadêmica.  

**Fluxo principal:**
1. O usuário abre uma nota contendo anotações ou insights livres.
2. O usuário clica no botão "Vincular a Referência Científica".
3. O sistema abre um autocomplete listando as referências da biblioteca do projeto.
4. O usuário seleciona a referência correspondente e confirma.
5. O sistema grava o relacionamento na base de dados.
6. A nota passa a exibir no cabeçalho o card clicável da referência científica selecionada como sua base teórica.

**Fluxos alternativos:**
- *Nota a partir da fonte:* O usuário abre a página da referência do artigo e clica em "Criar Nota de Estudo Vinculada", inicializando um documento em branco já indexado àquela fonte de dados.

**Fluxos de exceção:**
- *Fonte excluída:* Se a referência de origem for excluída do projeto, a nota de estudo correspondente permanece intacta no caderno do usuário, mas a indicação de fonte vinculada é desfeita.

**Pós-condições:** O link lógico entre a nota de rascunho de pesquisa e a referência acadêmica correspondente é salvo.

**Critérios de aceite:**
- [ ] A interface da nota de pesquisa deve exibir o status clicável e metadados rápidos da fonte ao passar o mouse.
- [ ] A gravação do vínculo deve durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
