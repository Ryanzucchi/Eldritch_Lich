### Caso de Uso: Converter grafo em mapa mental

**ID:** UC-103  
**Requisito relacionado:** RF-103 (converter grafo em mapa mental)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui um grafo de conexões de entidades populado.  
**Gatilho:** O usuário seleciona a opção "Exportar como Mapa Mental" na visualização do Grafo.  

**Fluxo principal:**
1. O usuário acessa a visualização do Grafo de Entidades.
2. O usuário clica no botão "Converter em Mapa Mental".
3. O sistema abre um modal solicitando que o usuário selecione qual nó deve servir de raiz/centro do mapa mental (ex: Personagem "Arthur").
4. O sistema extrai a árvore de relacionamentos a partir do nó raiz selecionado, quebrando ciclos complexos do grafo (transformando conexões em ramificações baseando-se no caminho mais curto).
5. O sistema gera e abre o novo mapa mental radial, exibindo o nó selecionado no centro e as entidades conectadas como ramificações.

**Fluxos alternativos:**
- *Preservar transversais como links:* O sistema representa conexões que formavam ciclos no grafo original como linhas tracejadas sutis (links transversais) entre os nós no mapa mental, sem quebrar a estrutura radial.

**Fluxos de exceção:**
- *Nó isolado selecionado:* Se o usuário selecionar um nó sem conexões, o sistema informa: "Este nó não possui conexões para gerar ramificações de mapa mental".

**Pós-condições:** Um novo mapa mental radial estruturado a partir do grafo do projeto é gerado.

**Critérios de aceite:**
- [ ] O processo de conversão e layout da árvore radial deve demorar menos de 1 segundo para grafos de até 150 nós.
- [ ] O mapa mental resultante deve ser editável de forma independente, sem alterar o grafo de origem.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta
