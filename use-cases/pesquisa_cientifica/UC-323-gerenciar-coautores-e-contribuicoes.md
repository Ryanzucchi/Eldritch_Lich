### Caso de Uso: Gerenciar coautores e contribuições

**ID:** UC-323  
**Requisito relacionado:** RF-322 (gerenciar coautores e contribuições)  
**Ator(es):** Administrador/Autor Principal, Coautores, Sistema  
**Pré-condições:** O projeto colaborativo possui múltiplos membros cadastrados.  
**Gatilho:** O autor principal distribui as responsabilidades de coautoria.  

**Fluxo principal:**
1. O autor principal acessa as configurações do projeto e clica em "Membros e Contribuições".
2. O sistema exibe a lista de coautores convidados.
3. O autor principal clica em "Editar Contribuições" ao lado do nome do coautor correspondente.
4. O sistema abre a lista de papéis sob a taxonomia CRediT (Conceituação, Análise de Dados, Escrita do Manuscrito, Revisão e Edição).
5. O autor principal seleciona os papéis correspondentes e define a participação do membro.
6. O autor principal clica em "Salvar".
7. O sistema grava a taxonomia de contribuições no banco de dados.

**Fluxos alternativos:**
- *Relatório de autoria:* O autor principal clica em "Gerar Declaração de Autoria", gerando um relatório em PDF contendo o detalhamento de contribuições de cada membro sob os padrões de periódicos científicos.

**Fluxos de exceção:**
- *Remover autoria master:* O autor principal não pode remover a própria atribuição de autoria master sem transferir a propriedade do projeto previamente.

**Pós-condições:** O registro detalhado de contribuições de coautoria sob taxonomia CRediT é armazenado.

**Critérios de aceite:**
- [ ] O sistema deve permitir associar múltiplos papéis CRediT para o mesmo coautor de forma simples.
- [ ] A geração da declaração de autoria deve demorar menos de 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
