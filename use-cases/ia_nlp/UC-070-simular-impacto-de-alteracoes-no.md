### Caso de Uso: Simular impacto de alterações no universo

**ID:** UC-070  
**Requisito relacionado:** RF-70 (simular impacto de alterações no universo)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui entidades, relacionamentos e textos mapeados em um grafo de conhecimento complexo.  
**Gatilho:** O usuário propõe uma alteração de entidade ou evento em uma ferramenta de simulação ("Sandbox de Causalidade").  

**Fluxo principal:**
1. O usuário acessa a aba "Simular Alteração".
2. O usuário propõe uma mudança hipotética (ex: "Se o Personagem John morrer na Batalha do Moinho, em vez de sobreviver").
3. O sistema mapeia todas as dependências diretas e indiretas de John no grafo (textos, eventos futuros, filhos, locais que governa).
4. A IA analisa os impactos causais da alteração no fluxo da história de forma lógica.
5. O sistema exibe um relatório estruturado de efeitos em cadeia (ex: "A Batalha do Forte será afetada porque John não estará lá para comandar", "O herdeiro James deixará de existir").
6. O usuário visualiza o mapa de impactos com nós e conexões piscando em vermelho na tela.

**Fluxos alternativos:**
- *Simulação de atributos:* O usuário altera o alinhamento de um reino ("neutro" para "guerra") e a IA estima o impacto de hostilidade em todos os locais e personagens pertencentes ao reino.

**Fluxos de exceção:**
- *Grafo sem conexões suficientes:* Se o projeto possuir pouca interconexão mapeada, a simulação retorna "Conexões insuficientes para traçar impactos lógicos no universo".

**Pós-condições:** O relatório detalhado de causa-efeito hipotético é apresentado ao usuário em tela de diagnóstico.

**Critérios de aceite:**
- [ ] O sistema deve rastrear dependências de até 4 graus de separação lógica no grafo de causalidade.
- [ ] A simulação deve ser executada em um ambiente sandbox, sem alterar nenhum dado real do projeto, a menos que o usuário solicite explicitamente "Promover alterações".

**Prioridade:** Média  
**Complexidade estimada:** Alta
