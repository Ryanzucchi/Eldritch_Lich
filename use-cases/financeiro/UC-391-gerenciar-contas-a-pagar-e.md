### Caso de Uso: Gerenciar contas a pagar e a receber

**ID:** UC-391  
**Requisito relacionado:** RF-390 (gerenciar contas a pagar e a receber)  
**Ator(es):** Operador Financeiro, Sistema  
**Pré-condições:** Lançamentos financeiros de receitas a receber e despesas a pagar efetuados.  
**Gatilho:** O operador abre a agenda de vencimentos financeiros do projeto.  

**Fluxo principal:**
1. O operador acessa "Finanças" -> "Contas a Pagar / Receber".
2. O sistema exibe um calendário e uma tabela com todas as obrigações a vencer organizadas por data de vencimento.
3. O operador seleciona a conta correspondente (ex: conta a pagar com vencimento no dia atual).
4. O operador clica em "Realizar Pagamento" e anexa o arquivo do comprovante bancário correspondente.
5. O sistema atualiza o status do título para "Pago/Liquidado", registra a data e debita o valor correspondente do saldo da conta bancária ativa conectada.
6. O operador acessa a aba "Contas a Receber" e confere as faturas de clientes ativas.

**Fluxos alternativos:**
- *Prorrogação de vencimento:* O operador seleciona "Prorrogar Vencimento", insere a nova data de vencimento e grava a alteração justificando o adiamento.

**Fluxos de exceção:**
- *Títulos atrasados:* Se a data de vencimento expirar sem a liquidação do lançamento correspondente, o sistema marca o título com a tag vermelha "Atrasada" e dispara alertas diários por e-mail.

**Pós-condições:** O status de liquidação e a data de pagamento do título de conta a pagar/receber são salvos.

**Critérios de aceite:**
- [ ] A tela de contas a pagar e a receber deve exibir a soma consolidada de valores a vencer na semana e no mês atual em destaque.
- [ ] A alteração de status e anexo de comprovantes devem durar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
