# Casos de Uso - Lote 35 (UC-341 a UC-350)

Este documento contém a especificação dos casos de uso de 341 a 350 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Registrar ata de reunião

**ID:** UC-341  
**Requisito relacionado:** RF-340 (registrar ata de reunião)  
**Ator(es):** Secretário/Organizador, Sistema  
**Pré-condições:** Reunião agendada e pauta ativa cadastrada.  
**Gatilho:** O organizador clica em "Iniciar Gravação da Ata" durante ou após a reunião.  

**Fluxo principal:**
1. O organizador acessa a reunião correspondente na aba de reuniões de equipe.
2. O organizador clica em "Registrar Ata".
3. O sistema abre o editor de ata contendo a pauta original na lateral para referência rápida.
4. O organizador redige as decisões tomadas, tópicos discutidos e notas gerais da reunião.
5. O organizador clica em "Salvar Ata".
6. O sistema grava a ata na tabela correspondente do banco de dados, enviando e-mail de fechamento da ata para todos os convidados.

**Fluxos alternativos:**
- *Transcrição automática de áudio:* O organizador carrega um arquivo de áudio da reunião em formato MP3. O sistema roda transcrição por IA (Speech-to-text), gerando um rascunho de texto completo para revisão rápida do organizador.

**Fluxos de exceção:**
- *Edição concorrente:* Se dois organizadores tentarem digitar na ata simultaneamente, o sistema ativa o modo de edição colaborativa em tempo real com cursores ativos para evitar sobrescritas.

**Pós-condições:** O documento de ata de reunião é gravado de forma definitiva e associado à pauta correspondente.

**Critérios de aceite:**
- [ ] A ata de reunião deve suportar vinculação de referências de documentos e códigos de tarefas citadas.
- [ ] O envio do e-mail de fechamento deve ocorrer de forma automática em menos de 1 minuto após o salvamento.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Vincular decisões de reunião a tarefas geradas

**ID:** UC-342  
**Requisito relacionado:** RF-341 (vincular decisões de reunião a tarefas geradas)  
**Ator(es):** Organizador da Reunião, Sistema  
**Pré-condições:** Ata de reunião sendo redigida e tarefas do projeto cadastradas.  
**Gatilho:** O organizador clica em "Gerar Tarefa a partir deste Item" na tela da ata.  

**Fluxo principal:**
1. O organizador edita a ata de reunião e destaca a decisão correspondente.
2. O organizador clica no botão "Criar Tarefa Vinculada" ao lado do item destacado.
3. O sistema abre a modal de criação rápida de tarefas, preenchendo o título da tarefa com o texto da decisão.
4. O organizador atribui o executor, prazo de entrega e confirma.
5. O sistema grava o relacionamento e insere o link da tarefa na ata, exibindo uma tag contendo ID e status do item (ex: `[TASK-84: Em aberto]`).

**Fluxos alternativos:**
- *Vincular a tarefa existente:* O organizador digita a chave `#` e seleciona uma tarefa preexistente para ligar àquela decisão.

**Fluxos de exceção:**
- *Tarefa excluída:* Se a tarefa criada for deletada posteriormente, a tag correspondente na ata muda para "Tarefa Excluída", mantendo o histórico descritivo da ata intacto.

**Pós-condições:** O link referencial entre a decisão documentada na ata e a tarefa operacional do backlog é salvo na base de dados.

**Critérios de aceite:**
- [ ] A tag da tarefa inserida na ata deve atualizar dinamicamente seu status visual conforme o andamento da tarefa.
- [ ] O tempo total de salvamento da associação deve ser de no máximo 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Registrar participantes e responsabilidades definidas

**ID:** UC-343  
**Requisito relacionado:** RF-342 (registrar participantes e responsabilidades definidas)  
**Ator(es):** Organizador/Secretário, Sistema  
**Pré-condições:** Reunião ativa e colaboradores convidados.  
**Gatilho:** O organizador gerencia o painel de presença e papéis na pauta/ata da reunião.  

**Fluxo principal:**
1. O organizador abre a reunião de equipe.
2. O organizador acessa a aba "Presença e Atribuições".
3. O sistema lista os convidados. O organizador marca caixas de seleção indicando quem compareceu (Presença).
4. Ao lado de cada participante presente, o organizador seleciona sua responsabilidade oficial naquela reunião (Dropdown: Apresentador, Ouvinte, Secretário, Decisor).
5. O organizador clica em "Salvar Presenças".
6. O sistema atualiza a tabela de participantes no banco de dados e adiciona a ata ao histórico profissional dos membros presentes.

**Fluxos alternativos:**
- *Presença automática:* Se a reunião for realizada via videoconferência integrada do próprio sistema, a presença é computada e preenchida de forma automática baseado nos logs de presença da chamada.

**Fluxos de exceção:**
- *Participante externo:* Se um convidado externo participar, o gestor de RH pode cadastrá-lo inserindo apenas nome e e-mail no painel de convidados.

**Pós-condições:** O registro detalhado de presenças e papéis de responsabilidade da reunião é gravado no banco de dados.

**Critérios de aceite:**
- [ ] A listagem de atas no histórico do funcionário deve indexar as responsabilidades exatas desempenhadas em cada reunião.
- [ ] A atualização do status de presença no banco de dados deve levar menos de 150ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Rastrear pendências (action items) até conclusão

**ID:** UC-344  
**Requisito relacionado:** RF-343 (rastrear pendências até conclusão)  
**Ator(es):** Colaborador (Responsável), Gestor, Sistema  
**Pré-condições:** Pendências (action items) vinculadas a reuniões cadastradas.  
**Gatilho:** O usuário acessa o painel de "Minhas Pendências" no dashboard.  

**Fluxo principal:**
1. O colaborador acessa seu painel pessoal de tarefas.
2. O sistema busca no banco e exibe na aba correspondente todas as pendências de reuniões atribuídas a ele.
3. O colaborador seleciona o item desejado e clica em "Iniciar Trabalho".
4. O sistema altera o status da pendência para "Em Andamento".
5. Após concluir a tarefa correspondente, o colaborador clica na caixa de verificação de conclusão da pendência e confirma.
6. O sistema atualiza o status para "Concluído" no banco de dados e notifica o gestor da reunião de que a pendência foi sanada.

**Fluxos alternativos:**
- *Alerta de prazo:* Se a pendência ultrapassar o prazo estipulado na pauta de reunião sem conclusão, o sistema envia um e-mail de alerta para o colaborador e pinta o card da pendência em vermelho.

**Fluxos de exceção:**
- *Membro inativo:* Se o responsável pelo action item for desligado do sistema, o sistema altera o status da pendência para "Pendente de Atribuição" e alerta o gestor da reunião para reatribuí-la.

**Pós-condições:** O status de andamento e conclusão do action item é salvo no banco de dados.

**Critérios de aceite:**
- [ ] O sistema de rastreamento deve permitir filtros rápidos por data de vencimento e por prioridade.
- [ ] A atualização de status da pendência na base deve durar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Gerar resumo automático de reunião

**ID:** UC-345  
**Requisito relacionado:** RF-344 (gerar resumo automático de reunião)  
**Ator(es):** Sistema, IA, Usuário (Organizador)  
**Pré-condições:** A ata de reunião possui texto cadastrado ou áudio transcrito.  
**Gatilho:** O organizador clica em "Gerar Resumo por IA" na tela de fechamento de ata.  

**Fluxo principal:**
1. O organizador acessa a ata de reunião concluída.
2. O organizador clica em "Gerar Resumo por IA".
3. O backend envia o texto da ata e da pauta para a inteligência artificial da plataforma.
4. A IA processa o texto estruturando-o em tópicos: Resumo Executivo, Decisões Tomadas e Próximos Passos.
5. O sistema apresenta a proposta de resumo na tela para validação do organizador.
6. O organizador clica em "Aprovar e Publicar".
7. O sistema salva o resumo e envia o informativo por e-mail para todos os membros convidados e gestores de departamento.

**Fluxos alternativos:**
- *Disparo automático:* O sistema gera e envia o resumo por IA automaticamente 1 hora após o encerramento da chamada online, dispensando intervenção humana do organizador.

**Fluxos de exceção:**
- *Dados insuficientes:* Se a ata possuir menos de 10 palavras digitadas, o sistema suspende a análise por IA e exibe o alerta: "Dados insuficientes para gerar resumo automático. Digite detalhes da reunião na ata".

**Pós-condições:** O resumo gerado pela IA é anexado à ata de reunião e enviado por e-mail.

**Critérios de aceite:**
- [ ] O resumo de IA deve conter no máximo 300 palavras para garantir legibilidade executiva rápida.
- [ ] O processamento e retorno da IA de resumo devem demorar menos de 4 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Definir objetivos (OKRs) por time ou projeto

**ID:** UC-346  
**Requisito relacionado:** RF-345 (definir objetivos (OKRs) por time ou projeto)  
**Ator(es):** Gestor/Diretor, Sistema  
**Pré-condições:** O projeto ou departamento correspondente está ativo no sistema.  
**Gatilho:** O gestor clica em "Adicionar Objetivo (OKR)" no painel estratégico.  

**Fluxo principal:**
1. O gestor acessa o painel "Planejamento Estratégico" -> "OKRs".
2. O gestor clica em "Novo Objetivo".
3. O sistema abre o formulário solicitando: Título do Objetivo, Time/Projeto Responsável, Período de Validade (ex: "Q3 2026") e descrição qualitativa do impacto esperado.
4. Após salvar o Objetivo, o gestor clica em "Adicionar Key Result (KR)".
5. O gestor insere: Nome do KR, Valor Inicial, Valor Alvo e Tipo de Unidade.
6. O gestor clica em "Salvar OKR".
7. O sistema grava a estrutura estratégica de OKR no banco de dados.

**Fluxos alternativos:**
- *OKR individual:* O gestor atribui o objetivo diretamente a um colaborador específico para fins de avaliação individual.

**Fluxos de exceção:**
- *Valores iguais:* Se o gestor tentar definir uma KR em que o valor inicial e o alvo sejam idênticos, o sistema impede a gravação e solicita valores de progresso mensuráveis distintos.

**Pós-condições:** O Objetivo (OKR) e seus respectivos Key Results são gravados no banco de dados do projeto.

**Critérios de aceite:**
- [ ] O painel estratégico deve exibir gráficos visuais de progresso de cada OKR em tempo real.
- [ ] O tempo total de salvamento do objetivo deve ser de no máximo 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Vincular tarefas/sprints a objetivos estratégicos

**ID:** UC-347  
**Requisito relacionado:** RF-346 (vincular tarefas/sprints a objetivos estratégicos)  
**Ator(es):** Gestor/Líder de Equipe, Sistema  
**Pré-condições:** OKRs cadastradas e tarefas ou sprints existentes no backlog.  
**Gatilho:** O gestor edita uma tarefa ou configura o escopo de uma Sprint.  

**Fluxo principal:**
1. O gestor acessa o quadro Kanban do projeto e seleciona a tarefa desejada.
2. O gestor clica no menu de propriedades da tarefa e localiza a opção "Objetivos Estratégicos (OKR)".
3. O sistema exibe a lista de KRs ativas.
4. O gestor seleciona a KR correspondente.
5. O gestor clica em "Vincular".
6. O sistema grava a relação na tabela correspondente.
7. O card da tarefa exibe o selo com o código da KR, e o painel estratégico passa a listar a tarefa como iniciativa operacional de apoio ao objetivo.

**Fluxos alternativos:**
- *Vincular Sprint completa:* O gestor associa a Sprint inteira a um Objetivo. O progresso de conclusão das tarefas daquela sprint atualiza proporcionalmente a barra de progresso do objetivo estratégico.

**Fluxos de exceção:**
- *OKR concluída:* Se a OKR correspondente já estiver arquivada ou vencida, o sistema impede novos vínculos de tarefas operacionais ativas.

**Pós-condições:** O vínculo referencial entre a tarefa/sprint operacional e o KR estratégico é salvo na base de dados.

**Critérios de aceite:**
- [ ] O progresso percentual da KR deve ser recalculado no banco toda vez que uma tarefa vinculada a ela for concluída.
- [ ] A gravação do vínculo deve demorar menos de 150ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Acompanhar progresso de metas ao longo do tempo

**ID:** UC-348  
**Requisito relacionado:** RF-347 (acompanhar progresso de metas ao longo do tempo)  
**Ator(es):** Gestor, Colaboradores, Sistema  
**Pré-condições:** Objetivos e KRs cadastrados com vínculos a tarefas de apoio.  
**Gatilho:** O usuário acessa o painel "Acompanhamento de Metas".  

**Fluxo principal:**
1. O gestor abre a aba de OKRs estratégicas do projeto.
2. O sistema busca no banco as KRs ativas e calcula o progresso atualizado de cada uma com base no percentual de conclusão das tarefas associadas.
3. A interface apresenta o painel contendo: gráfico de tendência (progresso planejado vs realizado), status da OKR (No Prazo, Atrasado, Crítico) e projeção estimada de atingimento da meta.
4. O gestor analisa quais metas estão em atraso para tomar decisões de alocação de equipe.

**Fluxos alternativos:**
- *Exportar gráficos:* O gestor exporta os gráficos de progresso em formato de imagem (PNG) para incluir em apresentações ou relatórios.

**Fluxos de exceção:**
- *Ausência de atividade:* Se a KR possuir tarefas associadas mas nenhuma alteração de status tiver ocorrido no período, o gráfico exibe progresso estagnado com um alerta de inatividade.

**Pós-condições:** Os relatórios analíticos de andamento das metas temporais são calculados e exibidos na tela.

**Critérios de aceite:**
- [ ] A re-renderização dos gráficos e relatórios estatísticos de metas estratégicas deve demorar menos de 1 segundo.
- [ ] Os gráficos devem ser responsivos adaptando-se a telas de múltiplos tamanhos.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Gerar relatório de atingimento de metas

**ID:** UC-349  
**Requisito relacionado:** RF-348 (gerar relatório de atingimento de metas)  
**Ator(es):** Gestor, Sistema  
**Pré-condições:** Período de validade da OKR encerrado.  
**Gatilho:** O gestor seleciona "Gerar Relatório de Fechamento" no painel estratégico.  

**Fluxo principal:**
1. O gestor acessa o painel de OKRs e escolhe a opção "Relatórios de Fechamento de Metas".
2. O gestor seleciona o período correspondente (ex: "Q3 2026") e clica em "Gerar Relatório".
3. O backend consolida todos os dados históricos de KRs do período, calculando a nota final de atingimento de cada KR (escala de 0.0 a 1.0) e a nota consolidada do Objetivo.
4. O sistema gera um documento de relatório estruturado contendo: Resumo executivo, Metas Atingidas, Iniciativas operacionais realizadas e a nota ponderada total.
5. O gestor exporta o relatório em formato PDF ou gera um link de compartilhamento.

**Fluxos alternativos:**
- *Performance Individual:* O sistema gera o relatório focado na performance do colaborador, cruzando os objetivos individuais atingidos com suas avaliações de desempenho.

**Fluxos de exceção:**
- *Período sem OKRs:* Se não houver objetivos definidos para o período selecionado, o sistema avisa na tela e impede a exportação do documento.

**Pós-condições:** O relatório consolidado em PDF do atingimento de metas do período é gerado e baixado.

**Critérios de aceite:**
- [ ] O processamento e formatação do PDF final de metas devem demorar menos de 3 segundos no servidor.
- [ ] O relatório deve conter tabelas limpas e gráficos legíveis.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Revisar metas periodicamente (check-in)

**ID:** UC-350  
**Requisito relacionado:** RF-349 (revisar metas periodicamente (check-in))  
**Ator(es):** Colaborador (Responsável pela KR), Gestor, Sistema  
**Pré-condições:** OKRs cadastradas com responsáveis associados.  
**Gatilho:** Abertura do período semanal de check-in de metas do projeto.  

**Fluxo principal:**
1. O colaborador responsável pela KR recebe a notificação de lembrete semanal de check-in.
2. O colaborador clica na notificação e acessa o formulário de check-in.
3. O sistema exibe o valor anterior registrado da KR.
4. O colaborador insere o novo valor medido, escreve a nota de progresso e confirma.
5. O colaborador clica em "Salvar Check-in".
6. O sistema grava o check-in no banco de dados e atualiza de imediato o progresso consolidado da KR na tela do gestor.

**Fluxos alternativos:**
- *Check-in automático:* Se a KR estiver conectada a uma métrica automatizada do sistema (ex: número de builds bem-sucedidos), a plataforma coleta os dados e faz o check-in do novo valor de forma automática.

**Fluxos de exceção:**
- *Validação de limites:* Se o colaborador preencher por engano um valor que signifique regressão fora do limite aceitável de dados, o sistema solicita confirmação do valor digitado antes de fechar o registro.

**Pós-condições:** O novo marco semanal de progresso da KR é salvo na linha do tempo histórica de check-ins de objetivos.

**Critérios de aceite:**
- [ ] A interface deve listar a linha do tempo de todos os comentários e marcações de check-in efetuados.
- [ ] A gravação do check-in na base de dados deve durar menos de 200ms.

---

## Tabela Resumo: Lote 35 (UC-341 a UC-350)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-341** | RF-340 (registrar ata de reunião) | Alta | Média |
| **UC-342** | RF-341 (vincular decisões a tarefas) | Alta | Média |
| **UC-343** | RF-342 (registrar participantes da reunião) | Média | Baixa |
| **UC-344** | RF-343 (rastrear pendências até conclusão) | Alta | Média |
| **UC-345** | RF-344 (gerar resumo automático de reunião) | Média | Média |
| **UC-346** | RF-345 (definir objetivos OKRs por time) | Alta | Média |
| **UC-347** | RF-346 (vincular tarefas/sprints a OKRs) | Alta | Média |
| **UC-348** | RF-347 (acompanhar progresso de metas) | Alta | Média |
| **UC-349** | RF-348 (gerar relatório de metas) | Média | Média |
| **UC-350** | RF-349 (revisar metas check-in) | Alta | Média |
