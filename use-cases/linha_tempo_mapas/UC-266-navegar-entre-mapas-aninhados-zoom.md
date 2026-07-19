### Caso de Uso: Navegar entre mapas aninhados (zoom in/out de região)

**ID:** UC-266  
**Requisito relacionado:** RF-266 (navegar entre mapas aninhados)  
**Ator(es):** Usuário (Escritor/Leitor), Sistema  
**Pré-condições:** A conexão hierárquica entre mapas está estabelecida.  
**Gatilho:** O usuário dá duplo clique em um marcador de submapa ou utiliza o scroll de zoom.  

**Fluxo principal:**
1. O usuário visualiza o "Mapa do Mundo".
2. O usuário dá duplo clique no pino do local "Cidade de Camelot".
3. O sistema intercepta o clique, descarrega a imagem do mapa global, executa o carregamento da imagem e dos pinos do "Mapa de Camelot" e renderiza na tela de forma contínua com uma animação de transição suave de aproximação (zoom in).
4. O usuário agora interage com a visualização detalhada das ruas de Camelot.
5. Para retornar, o usuário clica no botão "Subir Nível (Zoom Out)" no topo da tela do mapa.
6. O sistema executa o fluxo inverso, recarregando o "Mapa do Mundo" com foco na região de Camelot.

**Fluxos alternativos:**
- *Navegação por lista:* O usuário abre a aba "Lista de Mapas" na lateral e clica no mapa aninhado sob a estrutura de árvore para abri-lo de imediato.

**Fluxos de exceção:**
- *Erro ao carregar a imagem do submapa:* Se o upload da imagem do submapa estiver quebrado, o sistema exibe "Imagem não localizada. Retornando ao mapa pai" e interrompe a transição.

**Pós-condições:** O sistema carrega e foca a visualização do mapa aninhado selecionado de forma responsiva.

**Critérios de aceite:**
- [ ] A transição visual de zoom-in ou zoom-out entre os níveis de mapas deve ser fluida e ocorrer em menos de 800ms.
- [ ] O sistema deve manter o histórico de navegação de mapas (breadcrumb) no topo da tela.

**Prioridade:** Alta  
**Complexidade estimada:** Média
