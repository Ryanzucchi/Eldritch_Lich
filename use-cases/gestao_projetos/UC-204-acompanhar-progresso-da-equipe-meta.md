### Caso de Uso: Acompanhar progresso da equipe (meta coletiva)

**ID:** UC-204  
**Requisito relacionado:** RF-204 (acompanhar progresso da equipe (meta coletiva))  
**Ator(es):** Usuários (Colaboradores), Sistema  
**Pré-condições:** O projeto possui uma meta coletiva ativa cadastrada.  
**Gatilho:** Edições de texto realizadas por qualquer membro participante são salvas no banco.  

**Fluxo principal:**
1. O Colaborador A escreve 300 palavras no capítulo correspondente e o documento é salvo.
2. O sistema detecta o evento de escrita, calcula as palavras adicionadas e atualiza o total consolidado da meta coletiva no banco de dados.
3. Ao acessar a aba de metas, qualquer membro da equipe visualiza a barra de progresso coletiva atualizada.
4. Abaixo da barra de progresso geral, o sistema exibe gráficos circulares de progresso individual mostrando a fatia de entrega de cada colaborador.

**Fluxos alternativos:**
- *Alerta de conclusão:* Quando a meta coletiva atinge 90% de conclusão, o sistema envia uma notificação em tempo real na tela de todos os colaboradores online.

**Fluxos de exceção:**
- *Descarte de edições:* Se um administrador excluir um arquivo de capítulo contendo palavras que faziam parte da meta, o sistema subtrai o volume de palavras correspondente do total acumulado da meta.

**Pós-condições:** O painel de progresso coletivo reflete as contribuições consolidadas em tempo real.

**Critérios de aceite:**
- [ ] O cálculo do progresso da equipe deve deduzir edições redundantes ou exclusões de texto de forma precisa.
- [ ] A interface deve recarregar os dados de progresso coletivo em menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
