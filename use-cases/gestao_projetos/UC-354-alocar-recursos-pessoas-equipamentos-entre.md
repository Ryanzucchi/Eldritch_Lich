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
