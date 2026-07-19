### Caso de Uso: Converter mapa mental em grafo

**ID:** UC-104  
**Requisito relacionado:** RF-104 (converter mapa mental em grafo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um mapa mental estruturado no projeto.  
**Gatilho:** O usuário clica em "Converter em Grafo" nas opções do mapa mental aberto.  

**Fluxo principal:**
1. O usuário abre o mapa mental e seleciona a opção "Converter para Grafo de Entidades".
2. O sistema mapeia os nós do mapa mental e gera uma correspondência direta: cada nó vira um nó de entidade e cada ramificação vira uma aresta (relacionamento).
3. O sistema mescla esses novos nós e arestas no Grafo Geral do projeto, abrindo uma caixa de diálogo para que o usuário defina o tipo de entidade.
4. O usuário confirma o mapeamento.
5. O sistema atualiza o banco de dados do grafo de conhecimento.

**Fluxos alternativos:**
- *Mesclar em entidades existentes:* Se a IA detectar que um nó do mapa mental possui o mesmo nome de uma entidade que já existe no grafo geral, ela vincula os novos relacionamentos à entidade existente em vez de duplicar.

**Fluxos de exceção:**
- *Cancelamento da mesclagem:* Se o usuário clicar em "Cancelar" na revisão de tipos de entidades, o sistema aborta a conversão e mantém o grafo original intocado.

**Pós-condições:** Os nós e fluxos do mapa mental são integrados na rede do grafo de conhecimento do projeto.

**Critérios de aceite:**
- [ ] O mapeador de conversão deve apresentar uma tela de confirmação side-by-side mostrando quais nós novos serão adicionados e quais serão fundidos.
- [ ] O banco de dados do grafo deve ser atualizado de forma transacional.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta
