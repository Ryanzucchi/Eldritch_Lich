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
