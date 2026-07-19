### Caso de Uso: Auto subpastear algo

**ID:** UC-019  
**Requisito relacionado:** RF-19 (auto subpastear algo)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui múltiplos textos na raiz ou soltos e uma estrutura de pastas principal.  
**Gatilho:** O usuário seleciona múltiplos textos soltos e clica no botão "Auto Subpastear" no painel de controle do projeto.  

**Fluxo principal:**
1. O usuário aciona a funcionalidade "Auto Subpastear" para um grupo de arquivos selecionados.
2. O sistema envia os metadados, títulos e conteúdo resumido dos arquivos selecionados para a IA em background.
3. A IA agrupa os arquivos por similaridade temática, cronologia ou tipo de conteúdo (ex: capítulos da mesma saga, fichas de personagens de um mesmo local).
4. O sistema sugere a criação de subpastas temáticas com as distribuições de arquivos propostas.
5. O usuário visualiza o mapa de movimentação sugerido e clica em "Confirmar Organização".
6. O sistema cria as subpastas sugeridas e move os respectivos arquivos para dentro delas no banco de dados.

**Fluxos alternativos:**
- *Ajuste manual da proposta:* Antes de confirmar, o usuário pode arrastar itens na tela de visualização para ajustar o destino final proposto.

**Fluxos de exceção:**
- *Falta de dados contextuais suficientes:* Se os textos forem muito curtos ou sem similaridade, o sistema aborta e informa: "Não foi possível agrupar os arquivos de forma inteligente devido à falta de similaridade textual evidente".

**Pós-condições:** Os textos são organizados em novas subpastas criadas dinamicamente com base nas semelhanças detectadas.

**Critérios de aceite:**
- [ ] O algoritmo de agrupamento deve utilizar embeddings semânticos para calcular a similaridade entre os documentos.
- [ ] A estrutura original dos arquivos só deve ser modificada após a confirmação expressa do usuário na tela de preview.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta
