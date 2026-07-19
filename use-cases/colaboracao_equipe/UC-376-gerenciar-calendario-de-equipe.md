### Caso de Uso: Gerenciar calendário de equipe

**ID:** UC-376  
**Requisito relacionado:** RF-375 (gerenciar calendário de equipe)  
**Ator(es):** Gestor/Líder de Equipe, Colaboradores, Sistema  
**Pré-condições:** Projeto configurado com múltiplos integrantes associados.  
**Gatilho:** O gestor acessa o painel de Calendário Coletivo do projeto.  

**Fluxo principal:**
1. O gestor abre a aba "Calendário de Equipe".
2. O sistema exibe o calendário em formato de grade mensal unificando as agendas de todos os membros do time.
3. O gestor visualiza os eventos gerais agendados, prazos de sprints e férias da equipe.
4. O gestor clica em "Configurações do Calendário" e cria uma nova agenda temática dedicada (ex: "Lançamentos").
5. O gestor seleciona a cor da agenda correspondente e clica em salvar.
6. O sistema atualiza a visualização do calendário aplicando as camadas de cores nos respectivos eventos.

**Fluxos alternativos:**
- *Filtros de calendário:* O colaborador oculta agendas específicas do painel de controle lateral para visualizar apenas reuniões de sua área.

**Fluxos de exceção:**
- *Offline:* O calendário armazena dados em cache local do navegador caso falte internet, permitindo visualizações seguras sem conexão.

**Pós-condições:** O calendário corporativo compartilhado é atualizado e configurado na tela.

**Critérios de aceite:**
- [ ] O carregamento inicial do calendário contendo até 100 eventos semanais da equipe deve durar menos de 500ms.
- [ ] O calendário deve permitir arrastar e soltar eventos para remarcação rápida de datas.

**Prioridade:** Alta  
**Complexidade estimada:** Média
