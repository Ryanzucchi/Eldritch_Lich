### Caso de Uso: Criar mapas mentais

**ID:** UC-102  
**Requisito relacionado:** RF-102 (criar mapas mentais)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui ideias ou conceitos que deseja estruturar livremente de forma radial.  
**Gatilho:** O usuário clica em "Novo Mapa Mental" no menu do projeto.  

**Fluxo principal:**
1. O usuário acessa a seção "Mapas Mentais" e clica em "Criar Mapa Mental".
2. O sistema abre um canvas infinito de desenho de nós com um nó central ativo em branco.
3. O usuário dá um duplo clique no nó central para editá-lo.
4. O usuário clica no botão "+" do nó para puxar uma ramificação lateral (nó filho).
5. O usuário digita o texto correspondente no nó filho.
6. O sistema organiza visualmente a árvore radial à medida que o usuário adiciona nós.
7. O sistema salva a estrutura de árvore do mapa mental na base de dados.

**Fluxos alternativos:**
- *Customizar estilo dos nós:* O usuário altera a cor de fundo, formato (retângulo, oval) ou tamanho da fonte de nós específicos.

**Fluxos de exceção:**
- *Perda de dados:* O sistema realiza salvamento automático no IndexedDB local a cada nó criado ou editado para evitar perda por fechamento inesperado de aba.

**Pós-condições:** O mapa mental radial é salvo e disponibilizado para visualização e edição.

**Critérios de aceite:**
- [ ] O canvas de mapa mental deve suportar atalhos de teclado (ex: 'Tab' para nó filho, 'Enter' para nó irmão).
- [ ] A renderização e organização espacial automática dos nós deve ser executada em menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Alta
