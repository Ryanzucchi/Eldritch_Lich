### Caso de Uso: Agendar reuniões e eventos no calendário

**ID:** UC-377  
**Requisito relacionado:** RF-376 (agendar reuniões e eventos no calendário)  
**Ator(es):** Organizador/Colaborador, Convidados, Sistema  
**Pré-condições:** Calendário ativo no projeto.  
**Gatilho:** O organizador clica sobre um bloco de hora livre no calendário.  

**Fluxo principal:**
1. O organizador acessa a grade do Calendário e clica no dia e horário desejado.
2. O sistema abre a janela de agendamento de eventos.
3. O organizador preenche o título, a descrição, seleciona a sala de reunião virtual correspondente e escolhe os membros participantes a convidar.
4. O organizador clica em "Confirmar Agendamento".
5. O sistema grava o evento no banco de dados e renderiza o bloco colorido na grade do calendário.
6. O sistema despacha convites automáticos de e-mail para todos os convidados.

**Fluxos alternativos:**
- *Agendamento recorrente:* O organizador configura a repetição do evento (ex: "Semanal"). O sistema replica o evento nas datas correspondentes ao longo do período selecionado.

**Fluxos de exceção:**
- *Agendamento retroativo:* Se o organizador tentar agendar um evento em uma data passada, o sistema exibe alerta de erro e impede a conclusão da ação.

**Pós-condições:** O evento de reunião é salvo na agenda do projeto e disponibilizado no calendário dos convidados.

**Critérios de aceite:**
- [ ] Os convidados devem receber notificações internas com opções rápidas de confirmar ou recusar participação.
- [ ] A atualização física do evento na grade gráfica do calendário deve levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
