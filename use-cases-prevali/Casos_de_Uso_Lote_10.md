# Casos de Uso - Lote 10 (UC-091 a UC-100)

Este documento contém a especificação dos casos de uso de 91 a 100 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Gerar documentação automaticamente

**ID:** UC-091  
**Requisito relacionado:** RF-91 (gerar documentação automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui dados de entidades, relacionamentos e cronologia inseridos.  
**Gatilho:** O usuário seleciona "Gerar Documentação Técnica" ou "Manual do Universo".  

**Fluxo principal:**
1. O usuário abre o painel de exportação e seleciona "Documentação do Universo".
2. O sistema extrai e estrutura todos os metadados de entidades, cronologias e grafos do projeto.
3. A IA processa e formata as informações em um documento técnico estruturado por seções (ex: "1. Glossário de Entidades", "2. Linha do Tempo Consolidada", "3. Regras e Relações do Universo").
4. O sistema gera a documentação no formato Markdown (.md) ou HTML.
5. A interface disponibiliza o arquivo gerado para visualização no editor ou download imediato.

**Fluxos alternativos:**
- *Exportação via API:* O usuário solicita a documentação em formato estruturado JSON via API pública para integração com sistemas externos.

**Fluxos de exceção:**
- *Dados insuficientes:* Se não houver entidades ou textos cadastrados no projeto, o sistema exibe "Documentação vazia. Insira entidades para gerar a documentação automática".

**Pós-condições:** A documentação estruturada do universo é gerada e salva na raiz do projeto ou baixada.

**Critérios de aceite:**
- [ ] A documentação deve organizar as entidades por categoria (Personagens, Locais, Objetos, Organizações) em ordem alfabética.
- [ ] O processamento do documento deve demorar menos de 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Padronizar nomes automaticamente

**ID:** UC-092  
**Requisito relacionado:** RF-92 (padronizar nomes automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Fichas de entidades com nomes oficiais cadastrados no projeto.  
**Gatilho:** O usuário clica em "Padronizar Nomes" no menu de ferramentas ou ativa a correção automática na escrita.  

**Fluxo principal:**
1. O sistema varre o texto aberto buscando menções a entidades com variações de grafia próximas ou apelidos não cadastrados (ex: no texto aparece "Jose" ou "Ze" e o nome oficial na ficha é "José").
2. A IA identifica as variações com base na similaridade fonética, semântica e contextual.
3. O sistema apresenta um painel contendo a lista de substituições sugeridas (ex: "Substituir 'Jose' por 'José' em 14 ocorrências", "Substituir 'Ze' por 'José' em 5 ocorrências").
4. O usuário seleciona quais substituições deseja realizar.
5. O usuário clica em "Aplicar Padronização".
6. O sistema executa um "Buscar e Substituir" global nos textos do projeto, atualizando as grafias para o padrão correto da ficha de entidade.

**Fluxos alternativos:**
- *Padronização automática na digitação:* O corretor ortográfico sugere e substitui a grafia incorreta do nome do personagem em tempo real assim que o usuário termina de digitar o termo.

**Fluxos de exceção:**
- *Ambiguidade de homônimos:* Se existirem dois personagens com grafias parecidas e a IA não puder determinar qual é o pretendido, ela exibe as opções e pede que o usuário selecione caso a caso.

**Pós-condições:** Os textos do projeto passam a usar a nomenclatura uniforme de acordo com o catálogo oficial de entidades.

**Critérios de aceite:**
- [ ] A padronização não deve alterar nomes contidos dentro de citações de hyperlinks externos ou marcas de código.
- [ ] O sistema de substituição em lote deve ser transacional.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Visualizar estatísticas do projeto

**ID:** UC-093  
**Requisito relacionado:** RF-93 (visualizar estatísticas do projeto)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui textos escritos e histórico de atividade.  
**Gatilho:** O usuário clica no botão "Estatísticas" ou "Dashboard do Projeto".  

**Fluxo principal:**
1. O usuário acessa a aba "Estatísticas".
2. O sistema calcula métricas agregadas do projeto: total de palavras escritas, total de caracteres, quantidade de pastas, número de textos, quantidade de entidades catalogadas, e média de palavras por capítulo.
3. O sistema renderiza na tela um dashboard com gráficos de linha de progresso de escrita diária, gráfico de pizza de distribuição de entidades por tipo, e cards de status.
4. O usuário interage com o gráfico aplicando filtros por período de tempo (semana, mês, ano).

**Fluxos alternativos:**
- *Estimativa de tempo de leitura:* O dashboard apresenta a estatística do tempo de leitura total estimado para todo o projeto.

**Fluxos de exceção:**
- *Projeto vazio:* Se o projeto não contiver dados, a interface exibe "Nenhuma estatística disponível ainda. Comece a escrever para popular os gráficos".

**Pós-condições:** O usuário visualiza o relatório analítico do progresso e dimensões do projeto.

**Critérios de aceite:**
- [ ] Os gráficos estatísticos devem ser gerados em menos de 1 segundo utilizando bibliotecas leves.
- [ ] A contagem das estatísticas agregadas deve ser atualizada em background após cada evento de salvamento de arquivo.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Visualizar entidades mais conectadas

**ID:** UC-094  
**Requisito relacionado:** RF-94 (visualizar entidades mais conectadas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui entidades com conexões registradas no grafo.  
**Gatilho:** O usuário acessa "Análise do Grafo" -> "Entidades Mais Conectadas".  

**Fluxo principal:**
1. O usuário clica em "Visualizar Estatísticas do Grafo" no painel de ferramentas.
2. O sistema calcula a centralidade de grau (número de arestas diretas) de cada nó de entidade na base de dados.
3. O sistema gera uma lista ordenada decrescente das entidades com maior número de vínculos no projeto.
4. A interface exibe a lista em formato de gráfico de barras lateral ou destaca os nós correspondentes no canvas do grafo aumentando seu diâmetro proporcionalmente ao número de conexões.
5. O usuário clica sobre o nome de uma entidade na lista para visualizá-la no grafo.

**Fluxos alternativos:**
- *Centralidade de intermediação:* O usuário opta por ordenar por centralidade de intermediação (*betweenness centrality*) para identificar personagens que conectam núcleos diferentes da história.

**Fluxos de exceção:**
- *Grafo sem arestas:* Se não houver relações catalogadas entre entidades, a lista é apresentada vazia com a notificação "Registre relacionamentos entre entidades para mapear conexões".

**Pós-condições:** A relevância de conectividade das entidades do universo é exibida.

**Critérios de aceite:**
- [ ] O diâmetro do nó no grafo visual deve mudar dinamicamente conforme a métrica de centralidade selecionada.
- [ ] O cálculo das métricas de centralidade de grau de 500 nós deve levar menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Visualizar textos mais relacionados

**ID:** UC-095  
**Requisito relacionado:** RF-95 (visualizar textos mais relacionados)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem textos no projeto que possuem hyperlinks mútuos, tags compartilhadas ou alta similaridade semântica.  
**Gatilho:** O usuário seleciona a opção "Ver Matriz de Relação entre Textos".  

**Fluxo principal:**
1. O usuário acessa a tela de estatísticas textuais do projeto.
2. O sistema varre os textos e calcula o peso de correlação de cada par de arquivos (co-ocorrência de entidades, hyperlinks de referência e similaridade vetorial).
3. O sistema renderiza na tela uma Matriz de Adjacência de Relações (Heatmap) ou uma lista ordenada dos pares de textos com maior conexão semântica.
4. O usuário passa o cursor sobre uma célula da matriz para visualizar a porcentagem e o motivo da conexão (ex: "Capítulo 1 e Capítulo 2 compartilham 8 personagens e 3 tags").

**Fluxos alternativos:**
- *Grafo de arquivos:* O usuário visualiza os arquivos como nós de um grafo, onde a espessura da linha entre os nós representa o nível de correlação entre eles.

**Fluxos de exceção:**
- *Textos sem relações:* Se os arquivos forem completamente independentes e sem similaridade, a matriz exibe valores zerados em todas as células.

**Pós-condições:** O mapeamento de afinidade textual do projeto é exibido na interface.

**Critérios de aceite:**
- [ ] O heatmap deve usar gradientes de cor para indicar intensidade de relacionamento.
- [ ] O cálculo de similaridade e preenchimento da matriz para 50 arquivos deve ser processado em menos de 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Filtrar grafo por tipo

**ID:** UC-096  
**Requisito relacionado:** RF-96 (filtrar grafo por tipo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A visualização em grafo está aberta.  
**Gatilho:** O usuário clica na legenda do grafo ou no painel de filtros rápidos por tipo de nó/aresta.  

**Fluxo principal:**
1. O usuário visualiza o Grafo de Entidades na tela.
2. O usuário abre o painel de filtros laterais e desmarca a caixa "Locais" e "Objetos", mantendo apenas "Personagens" ativa.
3. O sistema oculta instantaneamente do canvas todos os nós do tipo Local e Objeto, bem como as arestas que dependiam deles.
4. O canvas de visualização realiza um rearranjo físico dinâmico dos nós remanescentes (Personagens) para otimizar o espaço visual.
5. O usuário visualiza apenas a rede de personagens do universo.

**Fluxos alternativos:**
- *Filtrar por tipo de relacionamento:* O usuário filtra as arestas para exibir apenas conexões do tipo "Aliado", ocultando as linhas de "Inimigo" e parentesco.

**Fluxos de exceção:**
- *Desmarcar todos os tipos:* Se o usuário desmarcar todos os tipos, o canvas fica vazio e exibe a mensagem de aviso "Nenhum tipo de nó selecionado para exibição".

**Pós-condições:** O grafo renderiza apenas os nós e conexões correspondentes aos filtros de tipo ativos.

**Critérios de aceite:**
- [ ] A ocultação dos nós na tela deve ocorrer em menos de 100ms através da manipulação de visibilidade CSS/Canvas.
- [ ] O estado dos filtros de tipo deve ser salvo para o usuário ao fechar e reabrir a visualização do grafo na mesma sessão.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Filtrar grafo por período

**ID:** UC-097  
**Requisito relacionado:** RF-97 (filtrar grafo por período)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A visualização em grafo está aberta e as conexões e eventos do universo possuem datas cronológicas fictícias associadas.  
**Gatilho:** O usuário ajusta o controle de linha do tempo do grafo.  

**Fluxo principal:**
1. O usuário visualiza o Grafo Geral do Universo na tela.
2. O usuário clica em "Ativar Filtro Temporal" no topo do painel.
3. O sistema exibe um controle deslizante de intervalo (Range Slider) representando a linha cronológica do universo (ex: Ano 1000 ao Ano 1050).
4. O usuário arrasta o slider para restringir o período (ex: Ano 1010 ao Ano 1020).
5. O sistema oculta todos os nós de entidades e eventos que não existiam ou não estavam ativos no intervalo de tempo selecionado, bem como as relações criadas fora deste período.
6. O grafo exibe o estado das relações especificamente no intervalo temporal definido.

**Fluxos alternativos:**
- *Animação de evolução temporal:* O usuário clica no botão "Play" e o sistema avança a linha do tempo ano a ano, mostrando as conexões surgindo e sumindo na tela de forma animada.

**Fluxos de exceção:**
- *Itens sem data definida:* Elementos e arestas sem data definida são exibidos por padrão em todos os períodos, a menos que o usuário ative a opção "Ocultar itens sem data".

**Pós-condições:** O grafo renderizado reflete as entidades e relacionamentos ativos no período selecionado.

**Critérios de aceite:**
- [ ] O range slider temporal deve possuir precisão na unidade de medida de data configurada para o calendário do projeto (ex: anos ou dias).
- [ ] O recálculo e renderização do estado do grafo ao arrastar o slider deve ser fluido, sem engasgos na tela.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Filtrar grafo por personagem

**ID:** UC-098  
**Requisito relacionado:** RF-98 (filtrar grafo por personagem)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A visualização em grafo está aberta.  
**Gatilho:** O usuário digita o nome de um personagem na caixa de foco ou clica em "Filtrar por esta entidade".  

**Fluxo principal:**
1. O usuário visualiza o grafo de entidades.
2. O usuário acessa a barra de pesquisa rápida do grafo e seleciona o personagem "Lorde Varis".
3. O sistema esmaece (reduz opacidade para 10%) todos os nós e arestas que não estão conectados diretamente a Varis.
4. O sistema mantém o nó de Lorde Varis e suas conexões imediatas (vizinhos de 1º grau) com 100% de brilho e destaque visual.
5. O usuário ajusta o filtro de grau para "2 graus" de separação, exibindo também os conhecidos dos conhecidos de Varis.

**Fluxos alternativos:**
- *Filtro de exclusão:* O usuário clica com o botão direito no nó de um personagem e seleciona "Ocultar do Grafo", fazendo com que ele suma temporariamente para despoluir a visualização.

**Fluxos de exceção:**
- *Personagem sem conexões:* Se o personagem selecionado for isolado, apenas ele é exibido com brilho total no canvas, e nenhuma conexão é mostrada.

**Pós-condições:** O grafo foca e destaca a rede de relacionamentos do personagem selecionado.

**Critérios de aceite:**
- [ ] A alteração do destaque e opacidade das entidades deve rodar em menos de 100ms.
- [ ] A interface deve permitir limpar o filtro com um único clique no botão "Limpar Foco".

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar mapas geográficos

**ID:** UC-099  
**Requisito relacionado:** RF-99 (criar mapas geográficos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui arquivos de mapas locais ou deseja gerar um grid de mapa a partir do sistema.  
**Gatilho:** O usuário clica em "Novo Mapa Geográfico" na barra lateral de navegação ou aba do atlas do projeto.  

**Fluxo principal:**
1. O usuário clica na opção "Criar Mapa".
2. O sistema abre uma tela modal solicitando o upload de uma imagem do mapa do universo (.png, .jpg ou .webp) e informações de escala (pixels por quilômetro fictício).
3. O usuário seleciona o arquivo da imagem e confirma o upload.
4. O sistema salva a imagem no servidor, inicializa a tela de visualização interativa do atlas e renderiza o mapa sobre um grid plano navegável.
5. O usuário visualiza o mapa geográfico e pode arrastar e dar zoom na imagem.

**Fluxos alternativos:**
- *Gerar mapa em branco:* Se o usuário não tiver uma imagem, ele cria um mapa quadriculado em branco utilizando grids simples do próprio sistema para posicionar pontos de referência.

**Fluxos de exceção:**
- *Imagem de mapa excessiva:* Se a imagem exceder 20MB, o sistema trunca o upload e solicita que o usuário otimize a imagem ou a envie em formato comprimido (.webp).

**Pós-condições:** O mapa geográfico interativo do projeto é criado e disponibilizado no atlas.

**Critérios de aceite:**
- [ ] O atlas interativo deve rodar de forma fluida no navegador, suportando zoom com a roda do mouse e pan ao arrastar.
- [ ] O mapa deve possuir uma régua interativa de medição de distâncias baseada na escala configurada.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
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

---

## Tabela Resumo: Lote 10 (UC-091 a UC-100)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-091** | RF-91 (gerar documentação automaticamente) | Média | Média |
| **UC-092** | RF-92 (padronizar nomes automaticamente) | Média | Média |
| **UC-093** | RF-93 (visualizar estatísticas do projeto) | Média | Média |
| **UC-094** | RF-94 (visualizar entidades mais conectadas) | Média | Alta |
| **UC-095** | RF-95 (visualizar textos mais relacionados) | Média | Alta |
| **UC-096** | RF-96 (filtrar grafo por tipo) | Alta | Média |
| **UC-097** | RF-97 (filtrar grafo por período) | Alta | Alta |
| **UC-098** | RF-98 (filtrar grafo por personagem) | Alta | Média |
| **UC-099** | RF-99 (criar mapas geográficos) | Média | Alta |
| **UC-100** | RF-100 (relacionar locais ao mapa) | Alta | Alta |
