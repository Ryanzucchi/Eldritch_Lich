### Caso de Uso: Criar conexões entre mapas geográficos (mapas aninhados/regiões)

**ID:** UC-265  
**Requisito relacionado:** RF-265 (criar conexões entre mapas geográficos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Pelo menos dois mapas geográficos independentes estão criados no atlas (ex: "Mapa do Mundo" e "Mapa de Camelot").  
**Gatilho:** O usuário edita a ficha de um local e o conecta a um mapa detalhado.  

**Fluxo principal:**
1. O usuário abre o "Mapa do Mundo" no atlas.
2. O usuário clica com o botão direito sobre o marcador "Cidade de Camelot" posicionado no mapa e seleciona "Vincular a Submapa".
3. O sistema abre a lista de mapas disponíveis no projeto.
4. O usuário seleciona o "Mapa de Camelot" (que exibe as ruas internas) e clica em salvar.
5. O sistema grava o relacionamento de aninhamento no banco de dados na tabela de ligações entre mapas.
6. O pino de Camelot no mapa geral passa a exibir um ícone visual sutil indicando submapa ativo.

**Fluxos alternativos:**
- *Conexão bidirecional:* O sistema insere automaticamente uma referência de "Mapa Pai" na tela do submapa de Camelot, facilitando a navegação de retorno.

**Fluxos de exceção:**
- *Vínculo recursivo circular:* Se o usuário tentar aninhar o "Mapa do Mundo" dentro de Camelot (que já está dentro do Mundo), o sistema bloqueia a ação e avisa: "Não é possível criar conexões circulares entre mapas".

**Pós-condições:** O marcador geográfico é vinculado logicamente ao submapa regional correspondente.

**Critérios de aceite:**
- [ ] O banco de dados deve manter integridade referencial indexada sobre a hierarquia de mapas.
- [ ] O pino correspondente no mapa deve exibir o status de link de região de forma nítida.

**Prioridade:** Alta  
**Complexidade estimada:** Média
