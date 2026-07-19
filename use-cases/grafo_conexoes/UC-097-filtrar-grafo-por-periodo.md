### Caso de Uso: Filtrar grafo por período

**ID:** UC-097  
**Requisito relacionado:** RF-97 (filtrar grafo por período)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A visualização em grafo está aberta e as conexões e eventos do universo possuem datas cronológicas fictícias associadas.  
**Gatilho:** O usuário ajusta o controle de linha do tempo do grafo.  

**Fluxo principal:**
1. O usuário visualiza o Grafo Geral do Universo na tela.
2. O usuário clica em "Ativar Filtro Temporal" no topo do painel.
3. O sistema exibe um controle deslizante de intervalo (Range Slider) representando a linha cronológica do universo (ex: Ano 1000 ao Ano 1050).
4. O usuário arrasta o slider para restringir o período (ex: Ano 1010 ao Ano 1020).
5. O sistema oculta todos os nós de entidades e eventos que não existiam ou não estavam ativos no intervalo de tempo selecionado, bem como as relações criadas fora deste período.
6. O grafo exibe o estado das relações especificamente no intervalo temporal definido.

**Fluxos alternativos:**
- *Animação de evolução temporal:* O usuário clica no botão "Play" e o sistema avança a linha do tempo ano a ano, mostrando as conexões surgindo e sumindo na tela de forma animada.

**Fluxos de exceção:**
- *Itens sem data definida:* Elementos e arestas sem data definida são exibidos por padrão em todos os períodos, a menos que o usuário ative a opção "Ocultar itens sem data".

**Pós-condições:** O grafo renderizado reflete as entidades e relacionamentos ativos no período selecionado.

**Critérios de aceite:**
- [ ] O range slider temporal deve possuir precisão na unidade de medida de data configurada para o calendário do projeto (ex: anos ou dias).
- [ ] O recálculo e renderização do estado do grafo ao arrastar o slider deve ser fluido, sem engasgos na tela.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
