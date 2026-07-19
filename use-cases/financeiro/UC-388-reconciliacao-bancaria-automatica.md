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
