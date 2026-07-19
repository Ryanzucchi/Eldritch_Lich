### Caso de Uso: Identificar padrões recorrentes entre projetos diferentes

**ID:** UC-407  
**Requisito relacionado:** RF-402 (identificar padrões recorrentes entre projetos diferentes)  
**Ator(es):** Sistema, IA, Usuário  
**Pré-condições:** O usuário possui múltiplos projetos cadastrados em sua conta ativa.  
**Gatilho:** O usuário clica em "Análise de Portfólio de Escrita" no dashboard principal.  

**Fluxo principal:**
1. O usuário acessa a página inicial da conta e clica em "Análises Cruzadas".
2. O backend faz a leitura de todas as obras e projetos literários/de RPG do usuário.
3. A IA processa os dados analisando tropos recorrentes em todos os universos, traços de personalidades de personagens e clichês de enredo.
4. O sistema exibe o relatório de padrões detalhado na tela (ex: "Em 3 de seus 4 projetos, o protagonista possui o arquétipo de Guerreiro Solitário").
5. O usuário visualiza as métricas analíticas.

**Fluxos alternativos:**
- *Excluir projetos:* O usuário desmarca determinados projetos da busca cruzada (ex: rascunhos rápidos), focando a análise apenas em suas obras maduras.

**Fluxos de exceção:**
- *Projeto único:* Se o usuário possuir apenas um projeto cadastrado na conta, o sistema desabilita o painel de análise cruzada de padrões de escrita e informa a indisponibilidade.

**Pós-condições:** O relatório analítico contendo os padrões estruturais cruzados de projetos é gerado na tela.

**Critérios de aceite:**
- [ ] A análise global de IA deve ser processada de forma assíncrona com exibição de barra de progresso.
- [ ] O processamento deve demorar menos de 8 segundos para varredura de até 5 projetos médios.

**Prioridade:** Média  
**Complexidade estimada:** Alta
