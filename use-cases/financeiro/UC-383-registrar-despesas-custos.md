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
