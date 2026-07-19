### Caso de Uso: Visualizar disponibilidade de membros da equipe

**ID:** UC-379  
**Requisito relacionado:** RF-378 (visualizar disponibilidade de membros da equipe)  
**Ator(es):** Organizador da Reunião, Sistema  
**Pré-condições:** Agendas individuais e alocações de trabalho dos membros da equipe salvas no sistema.  
**Gatilho:** O organizador adiciona participantes no modal de agendamento de reuniões.  

**Fluxo principal:**
1. O organizador abre a tela de agendamento de eventos e seleciona os convidados correspondentes.
2. O organizador clica em "Verificar Disponibilidade (Encontrar Horário)".
3. O sistema analisa em tempo real as agendas e calendários individuais (inclusive as integrações do Google Calendar) dos convidados para o dia selecionado.
4. A interface renderiza o gráfico de "Linha do Tempo de Ocupação", exibindo faixas de horários ocupados em cinza e os blocos de horários livres comuns em verde.
5. O organizador clica sobre o bloco livre comum sugerido e o sistema define o horário da reunião de forma automática.

**Fluxos alternativos:**
- *Sugerir horários automáticos:* O organizador clica em "Sugerir Horários". O sistema calcula matematicamente as melhores janelas de folga em comum no horário comercial e apresenta como opções rápidas.

**Fluxos de exceção:**
- *Sem horários livres em comum:* Se os participantes estiverem com 100% de ocupação no dia, o sistema avisa na tela e impede o agendamento direto sem alteração de data.

**Pós-condições:** O horário otimizado e viável de reunião é verificado e selecionado.

**Critérios de aceite:**
- [ ] A varredura de dados de agendas de até 5 convidados para exibição do gráfico de disponibilidade deve durar menos de 800ms.
- [ ] A visualização deve ocultar os títulos de compromissos particulares dos membros por motivos de privacidade de agenda.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
