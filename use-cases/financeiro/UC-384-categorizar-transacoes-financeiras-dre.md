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
