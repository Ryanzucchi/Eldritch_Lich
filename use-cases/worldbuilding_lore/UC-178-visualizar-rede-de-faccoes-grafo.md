### Caso de Uso: Visualizar rede de facções (grafo de organizações)

**ID:** UC-178  
**Requisito relacionado:** RF-178 (visualizar rede de facções)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Organizações cadastradas possuem relações de aliança, neutralidade ou guerra configuradas entre si.  
**Gatilho:** O usuário seleciona "Visualizar Grafo de Organizações" no menu.  

**Fluxo principal:**
1. O usuário abre o painel de redes e clica em "Rede de Facções".
2. O sistema consulta a tabela de relacionamentos inter-organizacionais no banco de dados.
3. O sistema renderiza na tela um grafo de nós no canvas, onde cada nó representa uma organização e cada aresta representa um tipo de aliança política ou militar.
4. O sistema usa cores nas arestas para mapear o status diplomático (Verde: Aliança, Vermelho: Hostilidade, Cinza: Neutralidade).
5. O usuário interage com o grafo aplicando zoom e clicando nos nós para abrir a descrição e o histórico de conflitos.

**Fluxos alternativos:**
- *Visualizar força de facção:* O usuário ativa a visualização de volume do nó, onde o tamanho do círculo de cada facção é proporcional ao número de membros cadastrados nela.

**Fluxos de exceção:**
- *Sem relações diplomáticas:* Se não houver relações cadastradas entre facções, o grafo exibe os nós das organizações isolados no canvas, exibindo instruções para vinculá-los.

**Pós-condições:** A rede visual de relações diplomáticas das organizações é exibida na tela.

**Critérios de aceite:**
- [ ] As arestas diplomáticas devem exibir rótulos contendo o nome do tratado ou acordo associado ao passar o cursor.
- [ ] O carregamento e física do grafo de organizações devem ser fluidos (< 1 segundo de renderização).

**Prioridade:** Média  
**Complexidade estimada:** Alta
