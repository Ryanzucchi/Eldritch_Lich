# Casos de Uso - Lote 31 (UC-301 a UC-310)

Este documento contém a especificação dos casos de uso de 301 a 310 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Cadastrar funcionários

**ID:** UC-301  
**Requisito relacionado:** RF-300 (cadastrar funcionários)  
**Ator(es):** Administrador/RH, Sistema  
**Pré-condições:** O ator possui permissões administrativas de gerenciamento de pessoal.  
**Gatilho:** O gestor clica em "Adicionar Funcionário" no módulo de RH do sistema.  

**Fluxo principal:**
1. O gestor acessa o módulo de "Gestão de Pessoas" -> "Funcionários".
2. O gestor clica no botão "Cadastrar Novo Funcionário".
3. O sistema abre o formulário solicitando: Dados Pessoais (Nome, CPF, Data de Nascimento), Dados de Contato (E-mail, Telefone), Cargo Inicial, Departamento, Data de Admissão e Salário Base.
4. O gestor preenche os dados obrigatórios e clica em "Salvar Cadastro".
5. O sistema valida os dados do formulário e insere o registro na tabela de funcionários.
6. A interface exibe a confirmação: "Funcionário cadastrado com sucesso".

**Fluxos alternativos:**
- *Cadastrar a partir de convite:* O gestor insere apenas o e-mail do colaborador. O sistema envia um convite eletrônico por e-mail e o próprio funcionário preenche seus dados pessoais, necessitando apenas da aprovação final do gestor.

**Fluxos de exceção:**
- *CPF duplicado:* Se o CPF fornecido já constar em outro cadastro ativo no sistema, a gravação é bloqueada e exibe o alerta: "Erro: Já existe um funcionário cadastrado com este CPF".

**Pós-condições:** A ficha cadastral do funcionário é salva e armazenada no banco de dados.

**Critérios de aceite:**
- [ ] O CPF deve ser validado pelo algoritmo padrão de dígitos verificadores antes do salvamento.
- [ ] O tempo de processamento do cadastro deve ser inferior a 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Gerenciar cargos e níveis salariais

**ID:** UC-302  
**Requisito relacionado:** RF-301 (gerenciar cargos e níveis salariais)  
**Ator(es):** Administrador/RH, Sistema  
**Pré-condições:** Módulo de RH ativo e cargos preexistentes criados.  
**Gatilho:** O gestor altera a estrutura salarial ou cria um novo cargo.  

**Fluxo principal:**
1. O gestor acessa "Gestão de Pessoas" -> "Cargos e Salários".
2. O gestor visualiza a grade contendo a estrutura de Cargos e suas respectivas Faixas Salariais (Piso e Teto).
3. O gestor clica em "Criar Novo Cargo" ou em "Editar Cargo" em uma linha existente.
4. O gestor atualiza o nome do cargo, atribui o nível hierárquico e define os novos valores mínimos e máximos da remuneração.
5. O gestor clica em "Salvar Alterações".
6. O sistema atualiza a tabela de cargos e valida se a alteração afeta algum funcionário ativo fora do novo limite salarial.

**Fluxos alternativos:**
- *Promoção de funcionário:* O gestor edita a ficha de um funcionário específico, seleciona o novo cargo e o sistema sugere automaticamente o salário médio da nova faixa configurada.

**Fluxos de exceção:**
- *Faixa inválida:* Se o gestor tentar definir uma faixa salarial em que o piso seja maior que o teto, o sistema barra a ação e exibe: "O valor de piso não pode ser superior ao teto salarial".

**Pós-condições:** A tabela de cargos e faixas salariais é atualizada na base de dados.

**Critérios de aceite:**
- [ ] A interface deve permitir visualizar a hierarquia de cargos em formato de organograma ou tabela comparativa.
- [ ] A gravação e consistência dos cargos devem durar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Calcular folha de pagamento

**ID:** UC-303  
**Requisito relacionado:** RF-302 (calcular folha de pagamento)  
**Ator(es):** Administrador/RH, Sistema  
**Pré-condições:** Existem funcionários cadastrados com salários definidos e o período da folha está em aberto.  
**Gatilho:** O gestor clica em "Calcular Folha de Pagamento" no fechamento do mês.  

**Fluxo principal:**
1. O gestor acessa o painel do "Financeiro/DP" -> "Folha de Pagamento".
2. O gestor seleciona o mês e ano de competência (ex: "Julho/2026").
3. O gestor clica em "Calcular Folha".
4. O sistema busca todos os funcionários ativos daquele período.
5. Para cada funcionário, o sistema calcula: Salário Base, proventos (horas extras, adicionais), descontos (faltas, atrasos) e os impostos trabalhistas correspondentes (INSS, FGTS, IRRF).
6. O sistema monta a tabela de resumo contendo o valor bruto e líquido a pagar por funcionário e o total consolidado da empresa.
7. O gestor revisa os valores e clica em "Aprovar Folha".
8. O sistema atualiza o status do período para "Calculado" e gera as contas a pagar no módulo financeiro.

**Fluxos alternativos:**
- *Cálculo proporcional:* Se o funcionário foi admitido ou desligado no meio do mês, o sistema calcula o salário proporcional aos dias trabalhados naquele período.

**Fluxos de exceção:**
- *Período já fechado:* Se o gestor tentar recalcular uma folha de um período marcado como "Pago/Fechado", o sistema bloqueia e avisa: "Não é possível recalcular folha de período encerrado".

**Pós-condições:** A folha de pagamento do período é calculada, aprovada e salva na base de dados.

**Critérios de aceite:**
- [ ] O cálculo matemático deve seguir as fórmulas vigentes de impostos sem arredondamentos incorretos.
- [ ] O cálculo em lote para 50 funcionários deve ser processado em menos de 3 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerenciar benefícios (vale, plano de saúde, etc.)

**ID:** UC-304  
**Requisito relacionado:** RF-303 (gerenciar benefícios)  
**Ator(es):** Administrador/RH, Sistema  
**Pré-condições:** Funcionários cadastrados no sistema.  
**Gatilho:** O gestor de RH cadastra ou atribui um benefício corporativo a um funcionário.  

**Fluxo principal:**
1. O gestor acessa "Gestão de Pessoas" -> "Benefícios".
2. O gestor clica em "Novo Benefício" para cadastrar um serviço, definindo o valor mensal e a porcentagem de coparticipação/desconto em folha.
3. Após criar o benefício, o gestor clica em "Atribuir a Funcionário".
4. O gestor escolhe o colaborador na listagem de membros e associa o benefício cadastrado.
5. O gestor confirma a associação.
6. O sistema grava a relação na base de dados e inclui o respectivo desconto na folha de pagamento subsequente do colaborador.

**Fluxos alternativos:**
- *Atribuição coletiva:* O gestor associa o benefício a todos os funcionários de um determinado departamento de uma só vez por meio de filtros de lote.

**Fluxos de exceção:**
- *Desconto excede limite:* Se a soma de descontos de benefícios ultrapassar o limite legal do salário líquido do colaborador, o sistema alerta o gestor e impede a gravação até que a porcentagem de desconto seja reajustada.

**Pós-condições:** Os benefícios corporativos são cadastrados e vinculados às fichas dos funcionários para desconto automático.

**Critérios de aceite:**
- [ ] A interface deve permitir listar os benefícios ativos e o valor total mensal custeado pela empresa.
- [ ] A gravação no banco de dados deve ocorrer em até 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Controlar férias e ausências

**ID:** UC-305  
**Requisito relacionado:** RF-304 (controlar férias e ausências)  
**Ator(es):** Funcionário, Administrador/RH, Sistema  
**Pré-condições:** O funcionário está ativo e possui período aquisitivo de férias vencido/em andamento.  
**Gatilho:** O funcionário solicita férias ou o RH registra um atestado de ausência.  

**Fluxo principal:**
1. O funcionário acessa o painel de autoatendimento -> "Solicitar Férias".
2. O sistema exibe o saldo de dias de férias disponíveis.
3. O funcionário insere o período desejado (Data de Início e Fim) e clica em "Enviar Solicitação".
4. O sistema notifica o gestor do departamento para aprovação.
5. O gestor acessa o painel de pendências de RH e clica em "Aprovar Férias".
6. O sistema grava o status de férias aprovadas e bloqueia o registro de presença daquele período.

**Fluxos alternativos:**
- *Lançar atestado de ausência:* O gestor de RH abre a ficha do funcionário e insere uma ausência médica (anexando o comprovante) para justificar a falta sem prejuízo de salário.

**Fluxos de exceção:**
- *Saldo insuficiente:* Se o funcionário solicitar mais dias do que possui de direito no saldo, o sistema impede a submissão e avisa: "Solicitação inválida. Saldo de férias insuficiente".

**Pós-condições:** O período de férias ou a ausência justificada é gravada na agenda e no histórico do funcionário.

**Critérios de aceite:**
- [ ] O sistema deve calcular automaticamente a data limite para concessão das férias antes do vencimento do período concessivo (férias em dobro).
- [ ] A atualização do saldo de férias do funcionário após a aprovação deve ocorrer em menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Registrar ponto/horas trabalhadas

**ID:** UC-306  
**Requisito relacionado:** RF-305 (registrar ponto/horas trabalhadas)  
**Ator(es):** Funcionário, Sistema  
**Pré-condições:** O funcionário está logado no sistema em seu dispositivo de trabalho.  
**Gatilho:** O funcionário clica em "Registrar Ponto".  

**Fluxo principal:**
1. O funcionário abre o dashboard inicial do sistema.
2. O funcionário clica no botão "Registrar Ponto".
3. O sistema captura a data e o horário oficial do servidor da aplicação e a geolocalização.
4. O sistema grava a batida na tabela de pontos do banco.
5. O sistema exibe a mensagem de confirmação do registro correspondente.
6. No final do expediente, o funcionário realiza o mesmo processo para a saída, e o sistema calcula a jornada diária realizada.

**Fluxos alternativos:**
- *Solicitação de Ajuste:* O funcionário solicita ajuste de ponto preenchendo justificativa por escrito caso esqueça de bater. O ajuste segue para aprovação do gestor de RH.

**Fluxos de exceção:**
- *Registro duplicado:* Se o funcionário tentar registrar o ponto duas vezes em menos de 2 minutos por erro, o sistema exibe "Batida duplicada detectada" e impede a gravação repetida.

**Pós-condições:** O registro de presença e jornada de trabalho é salvo de forma definitiva.

**Critérios de aceite:**
- [ ] O horário do registro de ponto deve ser blindado contra adulterações de fuso horário do dispositivo do cliente.
- [ ] A consulta do espelho de ponto mensal pelo funcionário deve carregar em menos de 500ms.

**Prioridade:** Crítica  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerenciar processo de admissão

**ID:** UC-307  
**Requisito relacionado:** RF-306 (gerenciar processo de admissão)  
**Ator(es):** Administrador/RH, Candidato, Sistema  
**Pré-condições:** Vaga aprovada e candidato selecionado para admissão.  
**Gatilho:** O gestor inicia o fluxo de "Admissão Digital" para o candidato aprovado.  

**Fluxo principal:**
1. O gestor do RH acessa a vaga correspondente e clica em "Contratar" na ficha do candidato.
2. O gestor preenche a oferta de contratação e clica em "Iniciar Admissão".
3. O sistema envia um e-mail com link exclusivo para o candidato acessar o portal de admissão.
4. O candidato faz login e realiza o upload dos documentos obrigatórios (RG, CTPS, etc.) e preenche seus dados bancários.
5. O candidato envia os dados.
6. O gestor de RH recebe a notificação, audita os documentos enviados e clica em "Aprovar Admissão".
7. O sistema cria automaticamente a conta de colaborador do novo funcionário.

**Fluxos alternativos:**
- *Admissão manual:* O gestor de RH digita e anexa toda a documentação na ficha de forma direta, pulando a etapa de preenchimento do candidato externo.

**Fluxos de exceção:**
- *Documento inválido:* O gestor recusa o documento e escreve uma justificativa. O sistema reabre o campo para o candidato reenviar a imagem correspondente.

**Pós-condições:** Os documentos de admissão são aprovados e a ficha do candidato é promovida a funcionário ativo no sistema.

**Critérios de aceite:**
- [ ] O link enviado ao candidato deve expirar em 15 dias após o envio.
- [ ] Os arquivos de documentos enviados devem ser salvos de forma protegida e privada no bucket de mídias do sistema.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Gerenciar processo de desligamento

**ID:** UC-308  
**Requisito relacionado:** RF-307 (gerenciar processo de desligamento)  
**Ator(es):** Administrador/RH, Sistema  
**Pré-condições:** O funcionário a ser desligado está cadastrado no sistema com status ativo.  
**Gatilho:** O gestor de RH inicia o processo de desligamento de um colaborador.  

**Fluxo principal:**
1. O gestor de RH abre a ficha de um funcionário.
2. O gestor clica na opção "Iniciar Desligamento".
3. O gestor seleciona o Tipo de Desligamento, insere a Data e define se haverá aviso prévio trabalhado ou indenizado.
4. O gestor clica em "Calcular Rescisão".
5. O sistema faz o cálculo estimado das verbas rescisórias (saldo de salário, férias proporcionais, 13º proporcional).
6. O gestor aprova os valores e clica em "Efetivar Desligamento".
7. O sistema altera o status do colaborador para "Desativado", bloqueia imediatamente todas as suas credenciais de login e gera a guia de pagamento rescisório.

**Fluxos alternativos:**
- *Desligamento programado:* O gestor agenda o desligamento para uma data futura, e o sistema agenda o bloqueio de acessos em background para o dia definido.

**Fluxos de exceção:**
- *Único administrador:* Se o gestor tentar desligar o único usuário administrador master da plataforma, o sistema bloqueia e exige que outro administrador master seja cadastrado e ativado antes do desligamento.

**Pós-condições:** O funcionário é desligado, suas credenciais de login são invalidadas e os valores de rescisão são calculados.

**Critérios de aceite:**
- [ ] O bloqueio de credenciais e tokens do funcionário demitido deve ser instantâneo e total na API de autenticação.
- [ ] O cálculo rescisório deve seguir os parâmetros da legislação trabalhista brasileira.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Avaliar desempenho de funcionários

**ID:** UC-309  
**Requisito relacionado:** RF-308 (avaliar desempenho de funcionários)  
**Ator(es):** Administrador/Gestor, Funcionário, Sistema  
**Pré-condições:** O funcionário está cadastrado e ativo no sistema.  
**Gatilho:** O RH inicia o ciclo de avaliação de desempenho periódico.  

**Fluxo principal:**
1. O gestor acessa o painel de RH -> "Avaliações de Desempenho".
2. O gestor clica em "Nova Avaliação" e seleciona o modelo de questionário.
3. O gestor escolhe os participantes: o avaliado e os avaliadores (autoavaliação, gestor e pares).
4. Os avaliadores acessam o portal de RH e respondem aos questionários de competências atribuindo notas e feedbacks.
5. O sistema compila as notas de todas as respostas recebidas.
6. O sistema gera um relatório radar de competências contendo pontos fortes e oportunidades de desenvolvimento.
7. O gestor revisa os resultados com o funcionário e clica em "Concluir Avaliação".

**Fluxos alternativos:**
- *Avaliação por Metas:* O sistema busca o percentual de cumprimento de metas individuais do funcionário e insere a nota de metas automaticamente no relatório final de desempenho.

**Fluxos de exceção:**
- *Avaliador ausente/inativo:* Se um dos avaliadores for desligado antes de preencher o questionário, o gestor de RH o remove da lista para possibilitar o encerramento do relatório.

**Pós-condições:** O relatório consolidado de avaliação de desempenho do colaborador é persistido na base de dados.

**Critérios de aceite:**
- [ ] O sistema deve manter sigilo nas notas individuais dos pares avaliadores (exibir apenas médias agregadas).
- [ ] O relatório deve conter gráficos visuais legíveis de fácil interpretação.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Emitir holerite/contracheque

**ID:** UC-310  
**Requisito relacionado:** RF-309 (emitir holerite/contracheque)  
**Ator(es):** Sistema, Funcionário, Administrador/RH  
**Pré-condições:** A folha de pagamento do período correspondente está calculada e aprovada.  
**Gatilho:** A folha de pagamento é liberada pelo gestor para consulta.  

**Fluxo principal:**
1. O gestor do RH clica em "Liberar Holerites aos Funcionários" na tela de fechamento de folha.
2. O sistema gera um arquivo PDF individual para cada funcionário contendo: cabeçalho corporativo, descrição detalhada de proventos/descontos e bases de INSS/FGTS.
3. O sistema disponibiliza o PDF na área de autoatendimento do funcionário.
4. O funcionário correspondente é notificado por e-mail e push de que o holerite do período está disponível.
5. O funcionário acessa seu painel, visualiza o demonstrativo e clica em "Baixar PDF".
6. O navegador inicia o download do arquivo de contracheque.

**Fluxos alternativos:**
- *Assinatura digital:* O funcionário clica em "Dar Ciente" e assina digitalmente o recebimento do holerite na própria plataforma.

**Fluxos de exceção:**
- *Folha pendente:* O sistema impede a emissão de holerites individuais de um período cujo status não esteja marcado como "Fechado/Aprovado".

**Pós-condições:** O holerite individual em formato PDF é gerado, disponibilizado e baixado pelo funcionário.

**Critérios de aceite:**
- [ ] O PDF do holerite deve atender aos padrões legais de layout de recibo de pagamento salarial.
- [ ] A notificação por e-mail e liberação devem ser processadas em background de forma assíncrona.

---

## Tabela Resumo: Lote 31 (UC-301 a UC-310)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-301** | RF-300 (cadastrar funcionários) | Alta | Baixa |
| **UC-302** | RF-301 (gerenciar cargos e níveis salariais) | Alta | Média |
| **UC-303** | RF-302 (calcular folha de pagamento) | Alta | Alta |
| **UC-304** | RF-303 (gerenciar benefícios) | Média | Média |
| **UC-305** | RF-304 (controlar férias e ausências) | Alta | Média |
| **UC-306** | RF-305 (registrar ponto/horas trabalhadas) | Crítica | Alta |
| **UC-307** | RF-306 (gerenciar processo de admissão) | Média | Média |
| **UC-308** | RF-307 (gerenciar processo de desligamento) | Alta | Média |
| **UC-309** | RF-308 (avaliar desempenho de funcionários) | Média | Média |
| **UC-310** | RF-309 (emitir holerite/contracheque) | Alta | Média |
