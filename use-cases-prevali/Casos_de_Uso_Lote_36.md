# Casos de Uso - Lote 36 (UC-351 a UC-360)

Este documento contém a especificação dos casos de uso de 351 a 360 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Integrar metas com avaliação de desempenho

**ID:** UC-351  
**Requisito relacionado:** RF-350 (integrar metas com avaliação de desempenho)  
**Ator(es):** Administrador/RH, Gestor, Sistema  
**Pré-condições:** Avaliação de desempenho e metas individuais configuradas para o mesmo período de avaliação.  
**Gatilho:** O RH inicia o cálculo final do ciclo de avaliação de desempenho.  

**Fluxo principal:**
1. O gestor acessa o painel de RH -> "Avaliação de Desempenho" -> "Ciclos de Avaliação".
2. O gestor abre a ficha de avaliação do funcionário.
3. O sistema calcula a nota média das avaliações qualitativas de competências (autoavaliação, pares, gestor).
4. O sistema busca automaticamente o índice de atingimento das KRs e OKRs atribuídos ao funcionário naquele período.
5. O sistema combina ambos os fatores aplicando os pesos parametrizados (ex: 60% qualitativo, 40% quantitativo de metas).
6. O sistema exibe o resultado ponderado unificado no relatório final de performance.
7. O gestor de RH salva e aprova a nota consolidada.

**Fluxos alternativos:**
- *Cálculo de bônus salarial:* O sistema usa a nota de atingimento integrado para sugerir uma comissão ou bônus proporcional para lançamento automático na folha de pagamento seguinte.

**Fluxos de exceção:**
- *Colaborador sem metas:* Se o colaborador não possuir metas individuais associadas no período, a avaliação qualitativa assume 100% do peso, gerando um aviso explicativo no cabeçalho do relatório.

**Pós-condições:** A nota de performance integrada (metas + competências) é salva na tabela de avaliações do funcionário.

**Critérios de aceite:**
- [ ] A fórmula de integração e os pesos devem ser customizáveis pelo gestor de RH antes do início do ciclo.
- [ ] O processamento e cálculo da nota integrada devem durar menos de 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Gerenciar portfólio de projetos

**ID:** UC-352  
**Requisito relacionado:** RF-351 (gerenciar portfólio de projetos)  
**Ator(es):** Diretor/Gestor de Portfólio, Sistema  
**Pré-condições:** O gestor possui permissão administrativa master.  
**Gatilho:** O gestor acessa a aba "Portfólio de Projetos" para criar ou gerenciar agrupamentos estratégicos.  

**Fluxo principal:**
1. O gestor de portfólio acessa as "Configurações Corporativas" -> "Portfólio de Projetos".
2. O gestor clica em "Criar Novo Portfólio".
3. O gestor preenche a descrição, metas financeiras globais e insere o orçamento total disponível.
4. O gestor seleciona da listagem quais projetos ativos do sistema pertencerão a esse portfólio.
5. O gestor clica em "Salvar Portfólio".
6. O sistema agrupa os projetos, cria o relacionamento na base de dados e exibe o painel de KPIs globais do portfólio.

**Fluxos alternativos:**
- *Remanejamento de projeto:* O gestor edita as propriedades de um projeto específico, alterando a atribuição de portfólio, recalculando os orçamentos históricos instantaneamente.

**Fluxos de exceção:**
- *Estouro de orçamento global:* Se os orçamentos dos projetos individuais associados excederem o orçamento teto do portfólio, o sistema avisa o gestor, permitindo salvar, mas marcando o portfólio com status de "Orçamento Estourado".

**Pós-condições:** O portfólio de projetos é criado e indexado na base de dados.

**Critérios de aceite:**
- [ ] A interface de portfólio deve permitir visualizar a listagem com barra de progresso do consumo de orçamento geral.
- [ ] A gravação no banco de dados deve levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Visualizar status de múltiplos projetos em painel consolidado

**ID:** UC-353  
**Requisito relacionado:** RF-352 (visualizar status de múltiplos projetos em painel consolidado)  
**Ator(es):** Gestor de PMO/Diretoria, Sistema  
**Pré-condições:** Múltiplos projetos ativos cadastrados no sistema.  
**Gatilho:** O gestor clica em "Dashboard Multiprojetos".  

**Fluxo principal:**
1. O gestor acessa o painel de diretoria -> "Dashboard Consolidado".
2. O sistema faz a leitura dos dados em tempo real de todos os projetos ativos, computando: percentual médio de conclusão de tarefas, indicadores de saúde, próximos marcos (milestones) e total de horas apontadas.
3. A interface renderiza o grid comparativo contendo cards dinâmicos para cada projeto com gráficos de tendência.
4. O gestor filtra a lista para ver apenas projetos sob risco (Vermelho/Crítico) para intervir nas operações.

**Fluxos alternativos:**
- *Exportar sumário executivo:* O gestor clica em "Exportar Relatório Geral" e gera um sumário executivo em PDF de 1 página contendo o status consolidado de todos os projetos ativos.

**Fluxos de exceção:**
- *Projetos recém-criados:* Projetos sem tarefas cadastradas são exibidos com o status "Sem Atividade" na lista, ocultando os gráficos de tendência temporariamente.

**Pós-condições:** O dashboard multiprojetos consolidado é gerado e atualizado em tempo real na tela.

**Critérios de aceite:**
- [ ] O carregamento inicial e agregação dos KPIs de até 30 projetos ativos no dashboard devem durar menos de 1,5 segundos.
- [ ] O painel deve atualizar automaticamente a cada 5 minutos via polling ou websockets.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Alocar recursos (pessoas/equipamentos) entre projetos

**ID:** UC-354  
**Requisito relacionado:** RF-353 (alocar recursos entre projetos)  
**Ator(es):** Gestor de Recursos/Líder de Equipe, Sistema  
**Pré-condições:** Funcionários ativos e projetos cadastrados.  
**Gatilho:** O gestor acessa a matriz de alocação de recursos da empresa.  

**Fluxo principal:**
1. O gestor abre o painel "Recursos" -> "Alocação de Capacidade".
2. O sistema exibe uma grade contendo os nomes dos colaboradores na linha vertical e o cronograma na linha horizontal, indicando o percentual de ocupação atual de cada um.
3. O gestor seleciona o funcionário correspondente.
4. O gestor clica em "Adicionar Alocação", escolhe o projeto de destino, define o percentual de alocação (ex: `40%`) e o período de vigência.
5. O gestor confirma a alocação.
6. O sistema valida as capacidades e grava o registro na tabela de alocações.
7. A grade de capacidade do colaborador atualiza para refletir a nova jornada agregada.

**Fluxos alternativos:**
- *Alocação de equipamentos:* O gestor segue o mesmo fluxo para alocar infraestruturas caras ou licenças de software dedicadas entre projetos, rateando os custos correspondentes na contabilidade.

**Fluxos de exceção:**
- *Sobrecarga de recurso (Over-allocation):* Se o gestor tentar alocar um colaborador acima de 100% de sua capacidade semanal de trabalho, o sistema emite um alerta de sobrejornada, exigindo confirmação explícita ou bloqueando a gravação.

**Pós-condições:** A alocação percentual de tempo e recursos do colaborador é atualizada no banco de dados.

**Critérios de aceite:**
- [ ] A matriz de alocação deve utilizar cores intuitivas (verde para capacidade ok, amarelo para ocioso e vermelho para sobrecarregado).
- [ ] A inserção e recálculo da grade de capacidade devem durar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Rastrear custos por projeto

**ID:** UC-355  
**Requisito relacionado:** RF-354 (rastrear custos por projeto)  
**Ator(es):** Gestor do Projeto, Controller Financeiro, Sistema  
**Pré-condições:** Parâmetros de custos (salários de colaboradores alocados, licenças, infraestrutura) configurados.  
**Gatilho:** O gestor acessa o painel financeiro de controle de despesas do projeto.  

**Fluxo principal:**
1. O gestor abre o menu lateral "Finanças do Projeto" -> "Fluxo de Custos".
2. O sistema coleta de forma integrada os custos de mão de obra (salários proporcionais calculados a partir das alocações e horas trabalhadas), despesas fixas (servidores, licenças) e despesas variáveis pontuais (viagens, consultorias).
3. O sistema calcula a soma agregada dos custos incorridos até o momento.
4. A interface exibe o comparativo gráfico de Orçado (Budget) versus Realizado (Actual Cost).
5. O gestor analisa e fecha a conciliação mensal de custos do projeto.

**Fluxos alternativos:**
- *Lançar despesa manual:* O gestor clica em "Nova Despesa", anexa o comprovante fiscal correspondente e digita a classificação de custos para rateio manual.

**Fluxos de exceção:**
- *Sem orçamento definido:* Se o projeto não possuir um orçamento de limite definido, o gráfico exibe apenas os custos acumulados em barras brutas sem a meta limite comparativa.

**Pós-condições:** O acumulador de despesas financeiras do projeto é atualizado e persistido na base de dados.

**Critérios de aceite:**
- [ ] O cálculo do custo de horas de funcionários deve cruzar os dados exatos de presença do ponto e de faixas salariais cadastradas no DP.
- [ ] A renderização financeira e cálculos de rateio de despesas devem durar menos de 800ms.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerar relatório de rentabilidade/lucratividade de projetos

**ID:** UC-356  
**Requisito relacionado:** RF-355 (gerar relatório de rentabilidade/lucratividade de projetos)  
**Ator(es):** Controller Financeiro, Diretor, Sistema  
**Pré-condições:** Custos do projeto e faturamentos/receitas (valores de contratos de clientes) registrados no sistema.  
**Gatilho:** O analista clica em "Gerar DRE / Lucratividade" no painel de portfólio.  

**Fluxo principal:**
1. O analista acessa "Finanças Corporativas" -> "Rentabilidade".
2. O analista seleciona o projeto desejado na listagem.
3. O sistema busca a receita total do projeto (faturamentos emitidos/contratados) e subtrai todos os custos e despesas incorridos correspondentes.
4. O sistema calcula: Lucro Bruto, Margem de Lucro (Lucro / Receita * 100) e Retorno sobre Investimento (ROI).
5. A tela renderiza a tabela no padrão de Demonstrativo do Resultado do Exercício (DRE) simplificado do projeto.
6. O analista exporta o relatório em formato PDF ou planilha XLS.

**Fluxos alternativos:**
- *Comparativo de rentabilidade:* O sistema gera um gráfico de dispersão comparando a margem de lucro de todos os projetos ativos do portfólio de forma consolidada.

**Fluxos de exceção:**
- *Projetos internos (sem receita):* Se o projeto for de infraestrutura interna, o sistema calcula apenas os custos brutas, e a rentabilidade é marcada como "Projeto de Custo Interno / Sem Receita Direta".

**Pós-condições:** O relatório DRE de rentabilidade e lucro do projeto é exportado e baixado pelo analista.

**Critérios de aceite:**
- [ ] O relatório em PDF deve conter de forma explícita a quebra de despesas de pessoal e operacionais em tabelas legíveis.
- [ ] A consolidação de lucros e perdas de um projeto médio deve demorar menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Estimar prazos de entrega baseados em performance histórica

**ID:** UC-357  
**Requisito relacionado:** RF-356 (estimar prazos de entrega baseados em performance histórica)  
**Ator(es):** Gestor do Projeto, Sistema, IA  
**Pré-condições:** O projeto possui histórico de tarefas concluídas com datas de criação e encerramento reais salvas.  
**Gatilho:** O gestor solicita estimativa de prazo para um conjunto de novas tarefas no backlog.  

**Fluxo principal:**
1. O gestor acessa o Backlog do projeto e seleciona as novas tarefas correspondentes.
2. O gestor clica em "Prever Prazo de Conclusão por IA".
3. O backend analisa o histórico de performance da equipe, avaliando o lead time médio de tarefas semelhantes concluídas anteriormente (mesma complexidade, mesmo executor).
4. A IA roda simulação estatística Monte Carlo.
5. O sistema exibe o resultado da projeção de prazo na tela (ex: "Entrega em 25/08/2026 com 85% de confiança").
6. O gestor concorda e aplica a estimativa sugerida no cronograma oficial.

**Fluxos alternativos:**
- *Preenchimento empírico:* O gestor ignora a sugestão da IA e preenche as datas finais de entrega manualmente baseado na capacidade horária da equipe.

**Fluxos de exceção:**
- *Histórico insuficiente:* Se o projeto for recém-criado e possuir menos de 10 tarefas concluídas no histórico, o sistema avisa de que a previsão estatística é imprecisa e sugere usar estimativas baseadas na velocidade global padrão da empresa.

**Pós-condições:** O prazo projetado é salvo nas metas de cronograma do projeto.

**Critérios de aceite:**
- [ ] A simulação Monte Carlo para estimativa de prazos deve rodar e apresentar o histograma de probabilidade em menos de 3 segundos na tela.
- [ ] O sistema deve exibir a margem de erro estimada da previsão na tela.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerenciar riscos de projetos

**ID:** UC-358  
**Requisito relacionado:** RF-357 (gerenciar riscos de projetos)  
**Ator(es):** Gestor do Projeto, Sistema  
**Pré-condições:** Projeto de desenvolvimento ativo.  
**Gatilho:** O gestor clica em "Novo Risco" na matriz de riscos do projeto.  

**Fluxo principal:**
1. O gestor acessa o painel do projeto -> "Matriz de Riscos".
2. O gestor clica no botão "Identificar Risco".
3. O sistema abre o formulário de cadastro solicitando: Descrição do Risco, Categoria (técnico, financeiro), Probabilidade (Baixa, Média, Alta) e Impacto (Baixo, Médio, Alto).
4. O gestor insere os dados correspondentes.
5. O sistema calcula automaticamente o nível de criticidade do risco (Probabilidade x Impacto) e o posiciona na Matriz de Calor de Riscos visual da tela (gráfico 3x3).
6. O gestor clica em "Salvar Risco".
7. O risco é gravado na tabela correspondente do banco de dados.

**Fluxos alternativos:**
- *Vincular a tarefas:* O gestor vincula o risco identificado a uma tarefa específica do quadro Kanban para alertar o executor sobre os perigos daquela atividade.

**Fluxos de exceção:**
- *Campos obrigatórios vazios:* O sistema exige o preenchimento da probabilidade e do impacto antes de salvar para possibilitar o cálculo matemático de criticidade.

**Pós-condições:** O risco de projeto é registrado e plotado na matriz visual de controle de riscos.

**Critérios de aceite:**
- [ ] A matriz visual 3x3 deve destacar em vermelho brilhante os riscos de criticidade "Alta/Crítica".
- [ ] A gravação e o cálculo de posicionamento no gráfico devem durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Mitigar riscos cadastrados

**ID:** UC-359  
**Requisito relacionado:** RF-358 (mitigar riscos cadastrados)  
**Ator(es):** Gestor do Projeto, Sistema  
**Pré-condições:** Riscos de projetos identificados e cadastrados.  
**Gatilho:** O gestor detalha as ações de contingência para os riscos.  

**Fluxo principal:**
1. O gestor abre a "Matriz de Riscos" e clica no risco cadastrado correspondente.
2. O gestor seleciona a aba "Plano de Mitigação".
3. O gestor preenche a Ação Preventiva (para reduzir probabilidade) e a Ação de Contingência (caso o risco ocorra).
4. O gestor atribui um colaborador responsável pela execução do plano e define a data limite de monitoramento.
5. O gestor clica em "Salvar Plano".
6. O sistema atualiza o status do risco para "Mitigado / Monitorado" e anexa o plano ao histórico do risco.

**Fluxos alternativos:**
- *Disparar plano de contingência:* O risco ocorre. O gestor clica em "Ativar Plano de Contingência". O sistema dispara notificações urgentes para todos os envolvidos detalhando as ações imediatas.

**Fluxos de exceção:**
- *Responsável inválido:* Se o responsável associado for desativado do sistema, o gestor recebe alerta solicitando atualização do encarregado de mitigação do risco.

**Pós-condições:** O plano de mitigação estruturado é gravado no banco de dados e vinculado ao respectivo risco.

**Critérios de aceite:**
- [ ] A ficha técnica do risco deve exibir de forma clara o histórico de mitigação e ações adotadas com data e hora.
- [ ] O salvamento do plano deve demorar menos de 150ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar canal de comunicação direta por projeto

**ID:** UC-360  
**Requisito relacionado:** RF-359 (criar canal de comunicação direta por projeto)  
**Ator(es):** Administrador/Gestor, Sistema, Membros do Projeto  
**Pré-condições:** O projeto colaborativo está ativo e possui membros convidados.  
**Gatilho:** O gestor clica em "Criar Canal de Comunicação" nas configurações do projeto.  

**Fluxo principal:**
1. O gestor acessa as configurações do projeto e clica em "Canais de Comunicação".
2. O gestor seleciona "Novo Canal de Chat".
3. O gestor preenche o nome do canal (ex: `#geral-desenvolvimento`), define a visibilidade (Público ou Privado) e insere a descrição.
4. O gestor clica em "Criar Canal".
5. O sistema registra o canal na base de dados, inscreve automaticamente todos os membros ativos do projeto e abre a aba de chat ao vivo na barra de ferramentas.
6. Os membros começam a interagir enviando mensagens instantâneas de texto no canal via WebSocket.

**Fluxos alternativos:**
- *Integração com Slack/Discord:* Em vez do chat nativo, o gestor escolhe integrar com canal externo. O sistema gera os Webhooks necessários e sincroniza as mensagens do projeto com a ferramenta externa.

**Fluxos de exceção:**
- *Mensagens de membro removido:* Se um usuário for desativado do projeto, ele perde instantaneamente as permissões de leitura e gravação no canal, mantendo seu histórico passado registrado de forma segura.

**Pós-condições:** O canal de comunicação síncrono por projeto é estabelecido e disponibilizado para chat.

**Critérios de aceite:**
- [ ] O chat do canal deve suportar envio de anexos de mídias leves (até 5MB) e formatação de texto Markdown em tempo real.
- [ ] A velocidade de entrega de mensagens entre os membros online deve ser de no máximo 200ms.

---

## Tabela Resumo: Lote 36 (UC-351 a UC-360)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-351** | RF-350 (integrar metas com desempenho) | Média | Média |
| **UC-352** | RF-351 (gerenciar portfólio de projetos) | Alta | Média |
| **UC-353** | RF-352 (painel consolidado multiprojetos) | Alta | Alta |
| **UC-354** | RF-353 (alocar recursos entre projetos) | Alta | Alta |
| **UC-355** | RF-354 (rastrear custos por projeto) | Alta | Alta |
| **UC-356** | RF-355 (relatório de lucratividade de projetos) | Média | Média |
| **UC-357** | RF-356 (estimar prazos por performance histórica) | Média | Alta |
| **UC-358** | RF-357 (gerenciar riscos de projetos) | Média | Média |
| **UC-359** | RF-358 (mitigar riscos cadastrados) | Média | Média |
| **UC-360** | RF-359 (criar canal de comunicação direta) | Alta | Alta |
