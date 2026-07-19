### Caso de Uso: Documentar níveis/fases do jogo

**ID:** UC-336  
**Requisito relacionado:** RF-335 (documentar níveis/fases do jogo)  
**Ator(es):** Usuário (Game Designer/Level Designer), Sistema  
**Pré-condições:** O usuário está na seção de GDD do projeto.  
**Gatilho:** O usuário clica em "Novo Nível / Fase" no menu de level design.  

**Fluxo principal:**
1. O usuário acessa "GDD" -> "Design de Níveis".
2. O usuário clica em "Criar Nova Fase".
3. O sistema abre a ficha técnica de level design solicitando: Nome da Fase, Objetivo Principal, Duração Estimada, Lista de Inimigos Presentes, Lista de Itens a Coletar e descrição do fluxo de navegação do jogador.
4. O usuário preenche as informações estruturadas da fase.
5. O usuário faz o upload da imagem do mapa de design da fase (layout/planta baixa).
6. O usuário clica em "Salvar".
7. O sistema grava o nível na tabela correspondente no banco.
8. A fase é incluída no sumário do projeto de Game Design.

**Fluxos alternativos:**
- *Mapear pontos na planta baixa:* O usuário clica sobre a imagem do mapa da fase e adiciona pins marcando o ponto de início (Spawn), posições de baús e chefões, idêntico ao processo do atlas geográfico.

**Fluxos de exceção:**
- *Erro de upload do mapa:* Se a imagem do mapa da fase falhar no upload, o sistema permite salvar a ficha puramente textual, indicando a pendência visual.

**Pós-condições:** A ficha técnica estruturada e o layout visual do nível são salvos na base de dados do projeto.

**Critérios de aceite:**
- [ ] A ficha de nível de jogo deve cruzar dados de inventário de itens e bestiário para autocomplete de itens e inimigos presentes.
- [ ] O salvamento da fase no banco de dados deve levar menos de 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
