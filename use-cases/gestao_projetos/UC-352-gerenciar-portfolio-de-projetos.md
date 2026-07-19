### Caso de Uso: Gerenciar portfólio de projetos

**ID:** UC-352  
**Requisito relacionado:** RF-351 (gerenciar portfólio de projetos)  
**Ator(es):** Diretor/Gestor de Portfólio, Sistema  
**Pré-condições:** O gestor possui permissão administrativa master.  
**Gatilho:** O gestor acessa a aba "Portfólio de Projetos" para criar ou gerenciar agrupamentos estratégicos.  

**Fluxo principal:**
1. O gestor de portfólio acessa as "Configurações Corporativas" -> "Portfólio de Projetos".
2. O gestor clica em "Criar Novo Portfólio".
3. O gestor preenche a descrição, metas financeiras globais e insere o orçamento total disponível.
4. O gestor seleciona da listagem quais projetos ativos do sistema pertencerão a esse portfólio.
5. O gestor clica em "Salvar Portfólio".
6. O sistema agrupa os projetos, cria o relacionamento na base de dados e exibe o painel de KPIs globais do portfólio.

**Fluxos alternativos:**
- *Remanejamento de projeto:* O gestor edita as propriedades de um projeto específico, alterando a atribuição de portfólio, recalculando os orçamentos históricos instantaneamente.

**Fluxos de exceção:**
- *Estouro de orçamento global:* Se os orçamentos dos projetos individuais associados excederem o orçamento teto do portfólio, o sistema avisa o gestor, permitindo salvar, mas marcando o portfólio com status de "Orçamento Estourado".

**Pós-condições:** O portfólio de projetos é criado e indexado na base de dados.

**Critérios de aceite:**
- [ ] A interface de portfólio deve permitir visualizar a listagem com barra de progresso do consumo de orçamento geral.
- [ ] A gravação no banco de dados deve levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
