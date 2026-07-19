### Caso de Uso: Definir objetivos (OKRs) por time ou projeto

**ID:** UC-346  
**Requisito relacionado:** RF-345 (definir objetivos (OKRs) por time ou projeto)  
**Ator(es):** Gestor/Diretor, Sistema  
**Pré-condições:** O projeto ou departamento correspondente está ativo no sistema.  
**Gatilho:** O gestor clica em "Adicionar Objetivo (OKR)" no painel estratégico.  

**Fluxo principal:**
1. O gestor acessa o painel "Planejamento Estratégico" -> "OKRs".
2. O gestor clica em "Novo Objetivo".
3. O sistema abre o formulário solicitando: Título do Objetivo, Time/Projeto Responsável, Período de Validade (ex: "Q3 2026") e descrição qualitativa do impacto esperado.
4. Após salvar o Objetivo, o gestor clica em "Adicionar Key Result (KR)".
5. O gestor insere: Nome do KR, Valor Inicial, Valor Alvo e Tipo de Unidade.
6. O gestor clica em "Salvar OKR".
7. O sistema grava a estrutura estratégica de OKR no banco de dados.

**Fluxos alternativos:**
- *OKR individual:* O gestor atribui o objetivo diretamente a um colaborador específico para fins de avaliação individual.

**Fluxos de exceção:**
- *Valores iguais:* Se o gestor tentar definir uma KR em que o valor inicial e o alvo sejam idênticos, o sistema impede a gravação e solicita valores de progresso mensuráveis distintos.

**Pós-condições:** O Objetivo (OKR) e seus respectivos Key Results são gravados no banco de dados do projeto.

**Critérios de aceite:**
- [ ] O painel estratégico deve exibir gráficos visuais de progresso de cada OKR em tempo real.
- [ ] O tempo total de salvamento do objetivo deve ser de no máximo 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
