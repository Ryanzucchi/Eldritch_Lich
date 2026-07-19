### Caso de Uso: Filtrar eventos por personagem

**ID:** UC-169  
**Requisito relacionado:** RF-169 (filtrar eventos por personagem)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos da timeline possuem personagens associados.  
**Gatilho:** O usuário interage com o filtro de personagens na timeline.  

**Fluxo principal:**
1. O usuário visualiza o painel da Timeline do projeto.
2. O usuário abre o filtro "Personagens" e seleciona um personagem (ex: "Arthur").
3. O sistema oculta da tela todos os eventos de timeline nos quais o personagem selecionado não é citado ou participante.
4. O sistema exibe apenas a sequência cronológica dos eventos relacionados a "Arthur".
5. A interface exibe a confirmação de filtro ativo.

**Fluxos alternativos:**
- *Filtro múltiplo:* O usuário seleciona dois personagens com a regra "E / Interseção" ativa, exibindo apenas eventos com a presença conjunta de ambos.

**Fluxos de exceção:**
- *Nenhum evento correspondente:* Se o personagem não tiver participado de eventos cronológicos, a timeline exibe a mensagem: "Nenhum evento cadastrado para este personagem".

**Pós-condições:** A linha do tempo renderiza apenas os eventos nos quais o personagem selecionado atua.

**Critérios de aceite:**
- [ ] O filtro deve processar a ocultação e reorganização dos cards na timeline em menos de 100ms.
- [ ] A interface deve fornecer um botão claro de "Limpar Filtro".

**Prioridade:** Alta  
**Complexidade estimada:** Média
