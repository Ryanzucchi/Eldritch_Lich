### Caso de Uso: Relacionar locais ao mapa

**ID:** UC-100  
**Requisito relacionado:** RF-100 (relacionar locais ao mapa)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Um mapa geográfico interativo (UC-099) e fichas técnicas de locais cadastrados existem no projeto.  
**Gatilho:** O usuário abre o mapa no atlas do projeto.  

**Fluxo principal:**
1. O usuário acessa a aba "Mapas" e abre um mapa existente.
2. O sistema apresenta uma lista de locais cadastrados no projeto que ainda não estão marcados no mapa em um painel flutuante lateral.
3. O usuário arrasta o local "Cidade de Winterfell" da lista lateral e o solta em cima das coordenadas específicas na imagem do mapa.
4. O sistema abre um popover para selecionar o tipo de marcador visual (ícone de castelo, pino colorido, brasão).
5. O usuário seleciona e confirma.
6. O sistema grava as coordenadas `(x, y)` do pino no banco de dados vinculando o local ao mapa.
7. O pino interativo de Winterfell passa a ser exibido no mapa.

**Fluxos alternativos:**
- *Criar local direto no mapa:* O usuário dá um duplo clique em uma coordenada vazia do mapa e o sistema abre o modal "Cadastrar Novo Local nesta Posição", gerando a ficha correspondente automaticamente após o preenchimento dos dados.

**Fluxos de exceção:**
- *Arrastar local já posicionado:* Se o usuário arrastar um local que já possui pino no mapa, o sistema reposiciona o pino existente para a nova coordenada e atualiza o banco de dados.

**Pós-condições:** Os locais ficam espacialmente mapeados e acessíveis através de pinos interativos no mapa geográfico.

**Critérios de aceite:**
- [ ] Clicar sobre o pino do local no mapa deve abrir um popover contendo resumo da ficha do local, imagem e botão de redirecionamento para a ficha completa.
- [ ] As posições dos marcadores devem ser salvas de forma responsiva utilizando coordenadas percentuais em relação às dimensões originais da imagem.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
