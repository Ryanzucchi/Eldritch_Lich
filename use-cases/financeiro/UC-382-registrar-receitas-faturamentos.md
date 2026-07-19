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
