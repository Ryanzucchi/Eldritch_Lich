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
