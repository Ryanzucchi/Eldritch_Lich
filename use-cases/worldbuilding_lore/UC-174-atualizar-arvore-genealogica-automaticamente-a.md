### Caso de Uso: Atualizar árvore genealógica automaticamente a partir de relações

**ID:** UC-174  
**Requisito relacionado:** RF-174 (atualizar árvore genealógica automaticamente a partir de relações)  
**Ator(es):** Sistema  
**Pré-condições:** Um relacionamento de parentesco foi adicionado ou removido pelo usuário.  
**Gatilho:** Confirmação da gravação de uma nova relação na tabela de parentesco.  

**Fluxo principal:**
1. O backend confirma a inserção de uma nova linha de parentesco (ex: "Arthur é cônjuge de Guinevere").
2. O sistema dispara em background um script de reconstrução do grafo da árvore familiar.
3. O sistema recalcula o encadeamento de relacionamentos indiretos (ex: deduz que se Uther é pai de Arthur e Arthur é pai de Galahad, então Uther é avô de Galahad).
4. O sistema gera a nova estrutura JSON hierárquica atualizada.
5. Ao abrir o painel de árvore genealógica, o usuário visualiza os novos ramos familiares perfeitamente integrados, sem necessidade de desenhar nós manualmente.

**Fluxos alternativos:**
- *Remover nó:* O usuário deleta um vínculo de parentesco e a árvore reconstrói-se automaticamente, afastando os nós e ajustando a descendência direta.

**Fluxos de exceção:**
- *Grafos cíclicos:* Em mundos de fantasia com árvores genealógicas complexas ou cruzamento de dinastias parentes, o algoritmo utiliza detecção de ciclos para evitar travamentos, renderizando linhas de conexão transversais.

**Pós-condições:** O grafo hierárquico da árvore genealógica é regenerado e indexado na base de dados.

**Critérios de aceite:**
- [ ] A atualização do modelo lógico da árvore genealógica deve ser concluída no banco de dados de forma síncrona com a gravação do parentesco.
- [ ] A re-renderização da árvore na tela do usuário deve levar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
