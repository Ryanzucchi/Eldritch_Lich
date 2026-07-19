### Caso de Uso: Visualizar histórico de alterações por colaborador

**ID:** UC-195  
**Requisito relacionado:** RF-195 (visualizar histórico de alterações por colaborador)  
**Ator(es):** Usuário (Escritor/Admin), Sistema  
**Pré-condições:** O projeto é colaborativo e possui logs de alterações registrados.  
**Gatilho:** O usuário abre o histórico de versões e ativa a visualização por colaborador.  

**Fluxo principal:**
1. O usuário abre o painel do "Histórico de Versões" do documento.
2. O usuário clica em "Filtrar por Colaborador".
3. O sistema exibe os avatares dos membros que trabalharam no documento.
4. O usuário seleciona um colaborador específico.
5. O sistema destaca na lista de histórico apenas os salvamentos efetuados por aquele colaborador.
6. No editor, o sistema colore com um tom específico as palavras inseridas ou modificadas por esse usuário na versão ativa.

**Fluxos alternativos:**
- *Relatório de contribuição:* O usuário visualiza estatísticas percentuais de contribuição no dashboard.

**Fluxos de exceção:**
- *Sem permissão:* Usuários sem acesso de escrita ou leitores simples não visualizam a identificação individual de autoria caso o projeto seja configurado como anônimo.

**Pós-condições:** O histórico segmentado de alterações e o realce de autoria por colaborador são apresentados na tela.

**Critérios de aceite:**
- [ ] O realce de cores por autor no texto deve possuir contraste suficiente para leitura confortável (WCAG AA).
- [ ] O processamento do diff por colaborador deve levar menos de 1 segundo.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
