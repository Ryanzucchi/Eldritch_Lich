### Caso de Uso: Registrar metodologia de pesquisa

**ID:** UC-322  
**Requisito relacionado:** RF-321 (registrar metodologia de pesquisa)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** O usuário está com a ficha do projeto científico ativa.  
**Gatilho:** O usuário edita a seção de metodologia do projeto.  

**Fluxo principal:**
1. O usuário acessa a seção "Módulo Científico" -> "Metodologia".
2. O usuário clica em "Registrar Nova Metodologia".
3. O sistema abre o formulário solicitando: Tipo de Pesquisa (qualitativa, quantitativa, experimental), Descrição dos Métodos, Amostragem, Coleta de Dados e Técnicas de Análise.
4. O usuário preenche as informações estruturadas.
5. O usuário clica em "Salvar".
6. O sistema grava os dados de metodologia no banco de dados.
7. A metodologia passa a constar na ficha do projeto, indexando os experimentos associados.

**Fluxos alternativos:**
- *Modelos de metodologia:* O usuário carrega um template padrão de metodologia correspondente ao seu nicho (ex: Ensaio Clínico) e preenche as informações específicas.

**Fluxos de exceção:**
- *Metodologia sem classificação:* O sistema exige a seleção do tipo de pesquisa antes de gravar para fins de categorização e filtros.

**Pós-condições:** A ficha de metodologia científica é armazenada no banco de dados do projeto.

**Critérios de aceite:**
- [ ] O campo de descrição deve aceitar formatação rica Markdown e inserção de fórmulas matemáticas.
- [ ] A inserção no banco de dados deve ser de no máximo 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
