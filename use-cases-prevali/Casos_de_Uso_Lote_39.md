# Casos de Uso - Lote 39 (UC-381 a UC-390)

Este documento contém a especificação dos casos de uso de 381 a 390 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Gerenciar orçamento financeiro do projeto

**ID:** UC-381  
**Requisito relacionado:** RF-380 (gerenciar orçamento financeiro do projeto)  
**Ator(es):** Gestor do Projeto, Controller Financeiro, Sistema  
**Pré-condições:** O projeto está ativo no sistema.  
**Gatilho:** O gestor inicia o planejamento financeiro anual/semestral do projeto.  

**Fluxo principal:**
1. O gestor acessa o painel "Finanças" -> "Orçamentação (Budget)".
2. O gestor clica em "Definir Orçamento de Referência".
3. O sistema abre o formulário solicitando: Orçamento Total Estimado, Período de Vigência e divisão por centro de custo (mão de obra, infraestrutura, marketing, reserva).
4. O gestor preenche a divisão de recursos financeiros e clica em "Salvar Orçamento".
5. O sistema grava as informações e estabelece a linha de base (baseline) orçamentária do projeto.

**Fluxos alternativos:**
- *Revisão orçamentária:* No meio do projeto, o gestor edita os centros de custo para realocar recursos, e o sistema registra uma nova versão do orçamento de controle para fins de auditoria.

**Fluxos de exceção:**
- *Valores inválidos:* Se o gestor preencher valores negativos nos limites totais de orçamento ativo, o sistema bloqueia o salvamento e solicita a correção.

**Pós-condições:** O orçamento de referência do projeto é definido e persistido na base de dados.

**Critérios de aceite:**
- [ ] A interface deve exibir gráfico de rosca (donut chart) com o rateio percentual por centro de custo.
- [ ] A gravação do orçamento de referência deve levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Registrar receitas/faturamentos

**ID:** UC-382  
**Requisito relacionado:** RF-381 (registrar receitas/faturamentos)  
**Ator(es):** Faturamento/Financeiro, Sistema  
**Pré-condições:** Contrato comercial com cliente associado ao projeto.  
**Gatilho:** A empresa conclui uma etapa (milestone) faturável do projeto.  

**Fluxo principal:**
1. O operador financeiro acessa "Finanças" -> "Receitas".
2. O operador clica em "Registrar Faturamento".
3. O sistema abre o formulário solicitando: Cliente Destino, Descrição do Faturamento, Valor da Receita, Data de Vencimento e Categoria de Entrada.
4. O operador digita os dados e anexa o contrato comercial correspondente.
5. O operador clica em "Salvar Receita".
6. O sistema insere a transação na tabela de lançamentos financeiros com o status "A Receber" e agenda o envio de lembrete de cobrança automática por e-mail para o cliente.

**Fluxos alternativos:**
- *Lançamento recorrente:* Se a receita for recorrente, o gestor configura o faturamento com periodicidade de repetição (ex: mensal), gerando os lançamentos de receitas automáticas para o período selecionado.

**Fluxos de exceção:**
- *Receita sem cliente:* O sistema impede o salvamento de receitas externas se não houver um cliente registrado na base de dados do projeto.

**Pós-condições:** A receita a receber é registrada no fluxo financeiro do projeto.

**Critérios de aceite:**
- [ ] O sistema de receitas deve permitir filtros rápidos por status (A receber, Pago, Atrasado).
- [ ] A inserção da receita no banco deve durar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Registrar despesas/custos

**ID:** UC-383  
**Requisito relacionado:** RF-382 (registrar despesas/custos)  
**Ator(es):** Colaborador (solicitante de reembolso/compras), Financeiro, Sistema  
**Pré-condições:** Fornecedores ou políticas de reembolsos cadastradas.  
**Gatilho:** O colaborador realiza uma compra necessária para o projeto ou solicita reembolso.  

**Fluxo principal:**
1. O colaborador acessa "Finanças" -> "Lançar Despesa".
2. O colaborador digita a descrição, seleciona o projeto, insere o valor e anexa a imagem da nota fiscal/recibo.
3. O colaborador envia para aprovação.
4. O gestor do projeto recebe o alerta, analisa os dados e anexo e clica em "Aprovar Despesa".
5. O sistema grava o lançamento de saída na tabela de transações com o status "A Pagar".
6. O módulo financeiro realiza o pagamento e atualiza o status para "Pago".

**Fluxos alternativos:**
- *Rateio de custos:* O gestor insere uma despesa geral e divide o custo proporcionalmente entre múltiplos projetos por meio do seletor de rateio (ex: 50% Projeto A e 50% Projeto B).

**Fluxos de exceção:**
- *Comprovante ausente:* Se o colaborador não anexar a imagem do recibo de despesa, o sistema avisa de que o comprovante é obrigatório e bloqueia a submissão.

**Pós-condições:** O registro de custo é aprovado e gravado no fluxo financeiro de despesas do projeto.

**Critérios de aceite:**
- [ ] A interface do financeiro deve permitir o upload rápido de notas fiscais e recibos digitalizados (PDF, JPG, PNG).
- [ ] A velocidade de salvamento e notificação do fluxo de aprovação de despesas deve ser inferior a 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Categorizar transações financeiras (DRE)

**ID:** UC-384  
**Requisito relacionado:** RF-383 (categorizar transações financeiras (DRE))  
**Ator(es):** Controller Financeiro, Sistema  
**Pré-condições:** Receitas e despesas registradas no banco. Plano de contas cadastrado.  
**Gatilho:** O controller concilia ou cadastra uma nova transação financeira.  

**Fluxo principal:**
1. O controller abre a listagem de transações financeiras pendentes de classificação.
2. O controller clica em "Categorizar" na linha do lançamento correspondente.
3. O sistema abre a caixa de autocomplete listando o Plano de Contas estruturado (ex: Receita Operacional, Despesas de Pessoal, Custos de Infraestrutura).
4. O controller seleciona a categoria apropriada e clica em "Salvar Categorização".
5. O sistema atualiza a transação gravando a categoria correspondente no banco de dados.

**Fluxos alternativos:**
- *Regras de auto-categorização:* O controller configura uma regra (ex: "Se fornecedor contém 'AWS', categorizar como Custos de Infraestrutura"). O sistema aplica a regra em background para todos os lançamentos correspondentes automaticamente.

**Fluxos de exceção:**
- *Categoria removida:* Se uma categoria do plano de contas for removida, as transações associadas a ela no passado são mantidas com a marca da categoria antiga histórica, mas sinalizadas para revisão.

**Pós-condições:** A transação financeira é categorizada sob a estrutura correta do plano de contas.

**Critérios de aceite:**
- [ ] O motor de regras de auto-categorização deve rodar instantaneamente ao importar novos extratos de transações.
- [ ] A atualização do vínculo de categoria deve demorar menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Fluxo de caixa do projeto

**ID:** UC-385  
**Requisito relacionado:** RF-384 (fluxo de caixa do projeto)  
**Ator(es):** Gestor do Projeto, Controller Financeiro, Sistema  
**Pré-condições:** Transações financeiras com status de data de pagamento/recebimento real salvas.  
**Gatilho:** O gestor abre o painel de fluxo de caixa para análise de liquidez.  

**Fluxo principal:**
1. O gestor acessa o painel "Finanças" -> "Fluxo de Caixa".
2. O gestor seleciona o período de análise (ex: mensal) e a visualização (Diária ou Semanal).
3. O sistema busca todas as transações financeiras liquidadas (Pagas / Recebidas) do período correspondente.
4. O sistema compila a estrutura de fluxo de caixa: Saldo Inicial, Entradas, Saídas, Saldo Operacional e Saldo Final Acumulado.
5. A interface exibe a tabela estruturada e o gráfico de variação diária de caixa com projeção de saldo.
6. O gestor analisa a liquidez do projeto para os meses subsequentes.

**Fluxos alternativos:**
- *Fluxo projetado:* O gestor ativa a chave "Incluir Projeções". O sistema adiciona ao gráfico as receitas "A Receber" e despesas "A Pagar" pendentes com datas futuras, gerando a curva de previsão de saldo para os próximos 3 meses.

**Fluxos de exceção:**
- *Transações não liquidadas:* Transações sem data de pagamento ou recebimento preenchidas são ignoradas no regime de caixa para evitar distorções de saldo real.

**Pós-condições:** O relatório de fluxo de caixa do projeto é renderizado na tela de forma visual.

**Critérios de aceite:**
- [ ] O gráfico de fluxo de caixa projetado deve recalcular dinamicamente de forma imediata ao alternar filtros de datas.
- [ ] A velocidade de processamento do fluxo de caixa mensal com até 1.000 lançamentos deve ser de no máximo 1 segundo.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Emitir notas fiscais automaticamente

**ID:** UC-386  
**Requisito relacionado:** RF-385 (emitir notas fiscais automaticamente)  
**Ator(es):** Sistema, Gateway de Notas Fiscais (API Municipal/Federal), Financeiro  
**Pré-condições:** Dados cadastrais das partes corretos, certificado digital ativo e receita paga.  
**Gatilho:** Uma receita de faturamento de milestone muda para o status "Pago".  

**Fluxo principal:**
1. O cliente realiza o pagamento e o sistema altera o status da receita correspondente para "Pago".
2. O backend dispara o job de emissão de nota fiscal em background de forma automática.
3. O sistema formata a payload da Nota Fiscal contendo dados fiscais das partes, descrição de serviços, valores e alíquotas de impostos.
4. O sistema assina a payload com o certificado digital corporativo e envia via API para a receita.
5. O sistema recebe de retorno o XML e PDF da nota fiscal emitida.
6. O sistema anexa o PDF na receita correspondente e envia por e-mail para o cliente automaticamente.

**Fluxos alternativos:**
- *Emissão manual:* O operador financeiro abre a receita correspondente na tela e clica em "Emitir Nota Fiscal" de forma direta.

**Fluxos de exceção:**
- *Instabilidade do servidor externo:* Se o servidor de validação governamental estiver indisponível, o sistema marca a nota como "Falha na Transmissão - Aguardando Reenvio" e agenda novas tentativas de transmissão automáticas periódicas em background.

**Pós-condições:** A nota fiscal de serviço é emitida na prefeitura correspondente e anexada à transação da receita.

**Critérios de aceite:**
- [ ] O envio do e-mail ao cliente contendo o link da nota e o PDF deve ocorrer em no máximo 5 minutos após a emissão.
- [ ] O armazenamento do arquivo XML de cada nota deve ser garantido por no mínimo 5 anos por obrigatoriedade fiscal.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Integrar financeiro com contas bancárias (via API / Open Finance)

**ID:** UC-387  
**Requisito relacionado:** RF-386 (integrar financeiro com contas bancárias (via API/Open Finance))  
**Ator(es):** Administrador/Controller Financeiro, Sistema, API Bancária  
**Pré-condições:** Conta bancária corporativa ativa em banco parceiro da integração.  
**Gatilho:** O administrador clica em "Conectar Conta Bancária" nas integrações.  

**Fluxo principal:**
1. O administrador acessa "Finanças" -> "Contas Bancárias" -> "Conectar Nova Conta".
2. O administrador seleciona o banco corporativo na lista.
3. O sistema redireciona o usuário para o fluxo de autenticação e consentimento de Open Finance do banco selecionado.
4. O administrador autentica e autoriza o compartilhamento de saldos e extratos.
5. O sistema obtém as credenciais de acesso seguro (access tokens) e salva criptografados no banco de dados.
6. O sistema agenda um job recorrente em background (cron) para sincronizar o extrato da conta bancária.

**Fluxos alternativos:**
- *Conexão manual por OFX:* O usuário realiza o upload manual de arquivos de extrato .ofx obtidos no home banking, e o sistema realiza o processamento dos lançamentos da mesma forma.

**Fluxos de exceção:**
- *Consentimento expirado:* Se a autorização expirar do lado do banco, o sistema interrompe a sincronização de extratos e exibe alerta solicitando renovação de login do Open Finance.

**Pós-condições:** A conexão bancária de extrato é estabelecida, iniciando a importação automática das transações.

**Critérios de aceite:**
- [ ] A sincronização automática do extrato bancário diário via API Open Finance deve rodar de madrugada de forma silenciosa.
- [ ] Todas as chaves e credenciais bancárias devem ser armazenadas com criptografia simétrica de alta segurança (AES-256).

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Reconciliação bancária automática

**ID:** UC-388  
**Requisito relacionado:** RF-387 (reconciliação bancária automática)  
**Ator(es):** Sistema, Controller Financeiro  
**Pré-condições:** Lançamentos financeiros internos cadastrados e extrato bancário importado.  
**Gatilho:** O sistema finaliza a importação automática do extrato bancário.  

**Fluxo principal:**
1. O sistema abre o painel de "Reconciliação Bancária".
2. O sistema lê as transações do extrato e busca correspondência na tabela de lançamentos internos, cruzando valor exato, proximidade de data e CPF/CNPJ de contraparte.
3. Para cada transação com correspondência exata, o sistema executa a conciliação automática, alterando o status da transação interna para "Reconciliada".
4. O sistema apresenta o painel exibindo o percentual de conciliações efetuadas de forma automática.
5. Transações sem correspondência exata são exibidas lado a lado na interface para conciliação manual do operador.

**Fluxos alternativos:**
- *Lançamento rápido na conciliação:* O operador identifica uma tarifa bancária sem lançamento correspondente interno e clica em "Criar Lançamento Rápido" na própria tela de reconciliação.

**Fluxos de exceção:**
- *Duplicidade:* Se houver dois lançamentos internos idênticos para a mesma entrada de extrato, o sistema não realiza conciliação automática, apresentando os itens ao operador para resolução manual.

**Pós-condições:** O status dos lançamentos financeiros conciliados é alterado no banco de dados.

**Critérios de aceite:**
- [ ] O algoritmo de correspondência lógica deve priorizar o cruzamento de CPF/CNPJ e valores exatos para evitar conciliações errôneas.
- [ ] A reconciliação em lote de 100 linhas de extrato bancário deve ocorrer em menos de 1,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerar relatórios financeiros (DRE, Balanço, etc.)

**ID:** UC-389  
**Requisito relacionado:** RF-388 (gerar relatórios financeiros (DRE, Balanço, etc.))  
**Ator(es):** Controller Financeiro, Diretor, Sistema  
**Pré-condições:** Transações financeiras devidamente categorizadas no plano de contas.  
**Gatilho:** O analista clica em "Gerar Relatório DRE" ou "Balanço Patrimonial".  

**Fluxo principal:**
1. O analista acessa o painel de "Relatórios Financeiros".
2. O analista seleciona o tipo de relatório "DRE" e o período de apuração (ex: "Ano de 2026").
3. O backend busca todas as transações financeiras liquidadas do período, agrupando os valores conforme a árvore do plano de contas.
4. O sistema calcula a dedução progressiva: Receita -> Deduções -> Margem Bruta -> Despesas -> Lucro Líquido do Exercício.
5. A interface exibe a tabela estruturada de DRE com representatividade vertical e gráficos de margem.
6. O analista clica em "Exportar em PDF" e o arquivo correspondente é baixado pelo navegador.

**Fluxos alternativos:**
- *Balanço Patrimonial:* O analista seleciona "Balanço Patrimonial". O sistema busca o saldo consolidado de ativos e passivos estruturando o relatório em Ativo, Passivo e Patrimônio Líquido.

**Fluxos de exceção:**
- *Itens sem categoria:* Se houver lançamentos sem classificação de categoria no período selecionado, o sistema avisa na tela e insere uma linha de pendência vermelha indicando DRE incompleta.

**Pós-condições:** O relatório financeiro estruturado (DRE/Balanço) em formato PDF é gerado e baixado.

**Critérios de aceite:**
- [ ] O relatório financeiro deve seguir os padrões e nomenclaturas da contabilidade formal corporativa.
- [ ] O processamento e renderização do PDF financeiro completo com gráficos de margem devem durar menos de 3 segundos no servidor.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Alertar sobre desvios orçamentários

**ID:** UC-390  
**Requisito relacionado:** RF-389 (alertar sobre desvios orçamentários)  
**Ator(es):** Sistema, Gestor do Projeto, Controller Financeiro  
**Pré-condições:** Orçamento limite configurado e despesas correntes registradas.  
**Gatilho:** O lançamento de uma nova despesa ultrapassa o percentual de alerta limite do orçamento configurado.  

**Fluxo principal:**
1. O gestor ou colaborador cadastra uma nova despesa no centro de custo do projeto.
2. O backend grava a despesa e recalcula o total de custos acumulados do projeto naquela categoria.
3. O sistema compara o valor acumulado com o limite de orçamento planejado cadastrado para o centro de custo.
4. O sistema detecta que o consumo de custos superou o gatilho padrão de alerta configurado (ex: superou 80% do budget).
5. O sistema gera de imediato uma notificação de alerta crítico de desvio orçamentário no dashboard do gestor.
6. O sistema dispara e-mail de notificação de alerta para o controller financeiro do projeto.

**Fluxos alternativos:**
- *Estouro de 100% de budget:* Se a despesa exceder o limite total do projeto, o sistema bloqueia novos lançamentos de despesas de forma preventiva até que um aditivo de verba seja inserido.

**Fluxos de exceção:**
- *Exclusão de despesas:* Se a despesa causadora do alerta for removida, o sistema limpa a notificação de desvio orçamentário do dashboard de forma dinâmica no próximo recálculo.

**Pós-condições:** O alerta visual de controle de consumo de budget é gravado e enviado aos gestores responsáveis.

**Critérios de aceite:**
- [ ] Os gatilhos percentuais de alertas de budget (ex: avisar em 80%, 90% e 100%) devem ser parametrizáveis nas configurações do projeto.
- [ ] O recálculo e disparo das notificações devem ocorrer em menos de 1 segundo após a gravação da despesa.

---

## Tabela Resumo: Lote 39 (UC-381 a UC-390)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-381** | RF-380 (gerenciar orçamento do projeto) | Alta | Média |
| **UC-382** | RF-381 (registrar receitas/faturamentos) | Alta | Baixa |
| **UC-383** | RF-382 (registrar despesas/custos) | Alta | Média |
| **UC-384** | RF-383 (categorizar transações DRE) | Média | Média |
| **UC-385** | RF-384 (fluxo de caixa do projeto) | Alta | Alta |
| **UC-386** | RF-385 (emitir notas fiscais automaticamente) | Alta | Alta |
| **UC-387** | RF-386 (integrar contas via Open Finance) | Alta | Alta |
| **UC-388** | RF-387 (reconciliação bancária automática) | Alta | Alta |
| **UC-389** | RF-388 (gerar relatórios financeiros) | Alta | Alta |
| **UC-390** | RF-389 (alertar desvios orçamentários) | Alta | Média |
