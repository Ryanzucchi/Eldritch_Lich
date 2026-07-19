### Caso de Uso: Visualizar eventos no mapa geográfico

**ID:** UC-168  
**Requisito relacionado:** RF-168 (visualizar eventos no mapa geográfico)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O mapa geográfico interativo está criado e possui locais associados a eventos de cronologia.  
**Gatilho:** O usuário acessa a "Visualização de Eventos no Mapa" no atlas.  

**Fluxo principal:**
1. O usuário abre o mapa geográfico do projeto.
2. O usuário clica em "Exibir Camada de Eventos".
3. O sistema exibe uma barra de controle temporal (Time Slider) no rodapé e renderiza marcadores nos locais que possuem eventos de timeline associados.
4. O usuário arrasta o controle do Time Slider.
5. À medida que o tempo avança no slider, pinos de eventos acendem ou desaparecem nos locais correspondentes do mapa.
6. O usuário clica sobre o pino de evento ativo no mapa para abrir um popover com o resumo do evento cronológico.

**Fluxos alternativos:**
- *Modo história animado:* O usuário clica em "Play" e o mapa passa automaticamente as datas da timeline, animando o surgimento das ocorrências no mapa.

**Fluxos de exceção:**
- *Eventos sem locais:* Eventos da timeline sem localizações são omitidos do mapa, mas listados em um painel lateral auxiliar.

**Pós-condições:** O usuário visualiza espacialmente os acontecimentos cronológicos ocorridos no mapa ao longo do tempo.

**Critérios de aceite:**
- [ ] O marcador do evento no mapa deve possuir um ícone semântico correspondente ao tipo do evento.
- [ ] A animação do avanço de tempo e atualização de pinos no mapa deve rodar em tempo real de forma fluida.

**Prioridade:** Média  
**Complexidade estimada:** Alta
