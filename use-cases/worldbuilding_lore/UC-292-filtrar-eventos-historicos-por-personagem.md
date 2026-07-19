### Caso de Uso: Filtrar eventos históricos por personagem (biografia histórica)

**ID:** UC-292  
**Requisito relacionado:** RF-292 (filtrar eventos históricos por personagem)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos históricos com participantes cadastrados configurados.  
**Gatilho:** O usuário abre o filtro de biografia do personagem na linha do tempo.  

**Fluxo principal:**
1. O usuário acessa a listagem geral de "Eventos Históricos" ou a aba "Timeline".
2. O usuário seleciona o filtro "Participantes / Personagens".
3. O usuário seleciona o personagem correspondente (ex: "Arthur").
4. O sistema filtra a linha do tempo e exibe exclusivamente os acontecimentos históricos nos quais Arthur esteve envolvido.
5. O usuário lê sequencialmente os marcos biográficos do personagem selecionado.

**Fluxos alternativos:**
- *Gerar Relatório de Biografia:* O usuário clica em "Exportar Biografia", compilando todos os resumos dos eventos filtrados em um arquivo de texto estruturado.

**Fluxos de exceção:**
- *Sem participação:* Se o personagem selecionado não possuir eventos históricos linkados, a listagem é limpa exibindo "Nenhum evento histórico associado à biografia deste personagem".

**Pós-condições:** A timeline ou lista de eventos exibe apenas as ocorrências com a participação do personagem filtrado.

**Critérios de aceite:**
- [ ] O processamento do filtro biográfico na timeline deve durar menos de 100ms.
- [ ] Os eventos devem ser listados em ordem cronológica estrita.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
