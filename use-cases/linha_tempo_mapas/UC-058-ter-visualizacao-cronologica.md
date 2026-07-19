### Caso de Uso: Ter visualização cronológica

**ID:** UC-058  
**Requisito relacionado:** RF-58 (ter visualização cronológica)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui linhas do tempo com eventos datados cadastrados.  
**Gatilho:** O usuário clica no painel "Visualização Cronológica" ou "Timeline".  

**Fluxo principal:**
1. O usuário acessa a aba "Linha do Tempo".
2. O sistema lê os eventos associados à timeline ativa, ordenando-os pela data cronológica fictícia.
3. O sistema renderiza uma linha horizontal ou vertical interativa com marcadores de tempo proporcionais.
4. O usuário rola a linha do tempo horizontalmente e visualiza os cards de eventos.
5. Clicar em um card abre um popover contendo os detalhes do evento e links de cenas associadas.

**Fluxos alternativos:**
- *Visualização em Raia:* O usuário alterna para a visualização de raias onde cada raia representa a jornada de um personagem ou local diferente ao longo da mesma timeline.

**Fluxos de exceção:**
- *Eventos sem data:* O sistema agrupa eventos sem data em um painel lateral rotulado como "Eventos sem data" permitindo que o usuário os arraste diretamente sobre a timeline.

**Pós-condições:** A linha do tempo é renderizada de forma interativa e legível na interface.

**Critérios de aceite:**
- [ ] A linha do tempo deve suportar datas fictícias personalizadas de qualquer escala (eras, anos, dias).
- [ ] O componente visual de timeline deve ser responsivo e suportar navegação por toque em dispositivos móveis.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
