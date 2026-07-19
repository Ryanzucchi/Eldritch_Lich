### Caso de Uso: Gerenciar riscos de projetos

**ID:** UC-358  
**Requisito relacionado:** RF-357 (gerenciar riscos de projetos)  
**Ator(es):** Gestor do Projeto, Sistema  
**Pré-condições:** Projeto de desenvolvimento ativo.  
**Gatilho:** O gestor clica em "Novo Risco" na matriz de riscos do projeto.  

**Fluxo principal:**
1. O gestor acessa o painel do projeto -> "Matriz de Riscos".
2. O gestor clica no botão "Identificar Risco".
3. O sistema abre o formulário de cadastro solicitando: Descrição do Risco, Categoria (técnico, financeiro), Probabilidade (Baixa, Média, Alta) e Impacto (Baixo, Médio, Alto).
4. O gestor insere os dados correspondentes.
5. O sistema calcula automaticamente o nível de criticidade do risco (Probabilidade x Impacto) e o posiciona na Matriz de Calor de Riscos visual da tela (gráfico 3x3).
6. O gestor clica em "Salvar Risco".
7. O risco é gravado na tabela correspondente do banco de dados.

**Fluxos alternativos:**
- *Vincular a tarefas:* O gestor vincula o risco identificado a uma tarefa específica do quadro Kanban para alertar o executor sobre os perigos daquela atividade.

**Fluxos de exceção:**
- *Campos obrigatórios vazios:* O sistema exige o preenchimento da probabilidade e do impacto antes de salvar para possibilitar o cálculo matemático de criticidade.

**Pós-condições:** O risco de projeto é registrado e plotado na matriz visual de controle de riscos.

**Critérios de aceite:**
- [ ] A matriz visual 3x3 deve destacar em vermelho brilhante os riscos de criticidade "Alta/Crítica".
- [ ] A gravação e o cálculo de posicionamento no gráfico devem durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
