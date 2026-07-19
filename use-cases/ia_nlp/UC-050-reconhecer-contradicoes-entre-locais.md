### Caso de Uso: Reconhecer contradições entre locais

**ID:** UC-050  
**Requisito relacionado:** RF-50 (reconhecer contradições entre locais)  
**Ator(es):** Sistema, IA  
**Pré-condições:** As fichas de locais com dados geográficos estão cadastradas no projeto.  
**Gatilho:** Análise contínua ou sob demanda do texto do capítulo.  

**Fluxo principal:**
1. A IA lê o texto em busca de descrições geográficas de cenários ou movimentações entre locais.
2. A IA cruza com as definições cadastradas de geografia (ex: a ficha diz que "Cidade X fica a leste de Cidade Y", mas o texto relata: "Eles cavalgaram em direção ao pôr do sol [oeste], saindo de Cidade Y para chegar em Cidade X").
3. A IA aponta que cavalgar em direção ao pôr do sol para ir de Y para X contradiz a localização leste da Cidade X.
4. O sistema marca o trecho do texto com um alerta visual e exibe a justificativa geográfica.

**Fluxos alternativos:**
- *Ver no Mapa:* O usuário clica em "Exibir no Mapa" no balão e o sistema abre o atlas interativo mostrando as rotas conflitantes em vermelho.

**Fluxos de exceção:**
- *Transporte mágico:* Se o universo contiver portais mágicos ou métodos de transporte extraordinários, o usuário pode desativar alertas de tempo de viagem incompatíveis.

**Pós-condições:** Alertas de incoerência espacial e geográfica são apresentados para revisão.

**Critérios de aceite:**
- [ ] A IA deve identificar contradições em relação a: pontos cardeais de deslocamento, clima incompatível cadastrado no local, e distâncias/tempos de viagem impossíveis para meios comuns de transporte.
- [ ] A taxa de acertos em testes de consistência geográfica deve ser de pelo menos 80%.

**Prioridade:** Média  
**Complexidade estimada:** Alta
