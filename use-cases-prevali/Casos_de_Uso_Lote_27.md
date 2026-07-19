# Casos de Uso - Lote 27 (UC-261 a UC-270)

Este documento contém a especificação dos casos de uso de 261 a 270 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Cadastrar eventos de timeline com múltiplos finais

**ID:** UC-261  
**Requisito relacionado:** RF-261 (cadastrar eventos de timeline com múltiplos finais)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O painel de timelines do projeto está ativo.  
**Gatilho:** O usuário cria ou edita um evento cronológico de enredo ramificado.  

**Fluxo principal:**
1. O usuário abre o painel da Timeline e seleciona "Criar Evento Ramificado".
2. O sistema abre o formulário solicitando: Nome do Evento, Data e descrição do contexto gerador.
3. No final do formulário, o sistema exibe a seção "Finais Possíveis".
4. O usuário adiciona o Final 1 (expondo as consequências e desfecho).
5. O usuário clica em "Adicionar outro final" e preenche o Final 2.
6. O usuário clica em "Salvar".
7. O sistema grava o evento e seus finais vinculados no banco de dados na tabela de eventos ramificados.

**Fluxos alternativos:**
- *Vincular a timelines alternativas:* O usuário define que o Final 1 continua a história na Timeline Principal, enquanto o Final 2 cria uma nova Timeline Alternativa automaticamente.

**Fluxos de exceção:**
- *Datas inconsistentes:* Se as datas de desfecho das ramificações forem anteriores à data de início do próprio evento gerador, o sistema alerta e solicita a correção.

**Pós-condições:** O evento com opções de finais múltiplos é gravado no banco de dados.

**Critérios de aceite:**
- [ ] A interface deve exibir as opções de finais como cartões ou caminhos bifurcados na linha do tempo.
- [ ] O salvamento das ramificações deve ser feito de forma atômica no banco de dados.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Visualizar ramos alternativos na cronologia (paralelas)

**ID:** UC-262  
**Requisito relacionado:** RF-262 (visualizar ramos alternativos na cronologia)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui eventos com múltiplos finais ou timelines paralelas ativas.  
**Gatilho:** O usuário clica em "Visualização de Ramos Cronológicos" no painel da Timeline.  

**Fluxo principal:**
1. O usuário acessa a aba "Cronologias do Projeto".
2. O usuário clica em "Modo Grafo Temporal / Multiverso".
3. O sistema busca todas as timelines cadastradas e os eventos de bifurcação correspondentes.
4. O sistema renderiza na tela uma árvore de timelines paralelas, mostrando a linha do tempo principal como tronco central e as linhas alternativas saindo como ramos laterais a partir dos exatos eventos geradores de conflito.
5. O usuário visualiza as ramificações de causa e efeito do enredo de forma paralela.
6. O usuário clica em um ramo lateral para entrar e focar a navegação detalhada especificamente naquela linha alternativa.

**Fluxos alternativos:**
- *Ocultar ramos mortos:* O usuário filtra a visualização para esconder linhas temporais alternativas secundárias que não possuem capítulos de texto escritos associados.

**Fluxos de exceção:**
- *Falta de conexões de origem:* Se uma timeline paralela for criada sem evento de origem, ela é exibida flutuando separadamente na lateral como "Timeline Sem Vínculo de Origem".

**Pós-condições:** A árvore gráfica contendo a estrutura de linhas do tempo paralelas do universo é renderizada na tela.

**Critérios de aceite:**
- [ ] A representação dos caminhos deve usar linhas curvas que se bifurcam de forma visualmente nítida de acordo com os marcos cronológicos comuns.
- [ ] O tempo de cálculo do layout da árvore temporal deve ser inferior a 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Mesclar ramos alternativos na cronologia

**ID:** UC-263  
**Requisito relacionado:** RF-263 (mesclar ramos alternativos na cronologia)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem pelo menos duas timelines paralelas ativas no projeto.  
**Gatilho:** O usuário clica no botão "Mesclar Linhas do Tempo" no painel de controle do multiverso.  

**Fluxo principal:**
1. O usuário acessa a visualização de cronologias e clica em "Mesclar Ramos".
2. O sistema abre um modal solicitando selecionar a Timeline de Origem e a Timeline de Destino.
3. O usuário define o evento de convergência (onde as duas linhas temporais voltam a se encontrar).
4. O usuário confirma.
5. O sistema executa a mesclagem: une a trilha cronológica a partir do ponto de convergência e unifica as duas ramificações em uma única linha principal no banco de dados.
6. O grafo temporal passa a exibir a união dos caminhos em um nó comum.

**Fluxos alternativos:**
- *Convergência por evento inédito:* O usuário cria um evento de mesclagem do zero no ponto de fusão das timelines, unindo os personagens que estavam separados.

**Fluxos de exceção:**
- *Conflito de datas de eventos concomitantes:* Se a mesclagem gerar eventos repetidos na mesma data com detalhes diferentes, o sistema abre uma tela de conciliação de eventos para que o usuário decida qual versão manter ou se deve concatenar as descrições.

**Pós-condições:** As duas linhas temporais paralelas são integradas e unificadas a partir do ponto de convergência selecionado.

**Critérios de aceite:**
- [ ] A mesclagem de cronologias deve ser transacional.
- [ ] A visualização gráfica após o merge deve exibir os caminhos se unindo de forma suave no nó do evento de destino.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Exportar cronologia interativa em formato HTML/JS

**ID:** UC-264  
**Requisito relacionado:** RF-264 (exportar cronologia interativa em formato HTML/JS)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui eventos de timeline cadastrados.  
**Gatilho:** O usuário seleciona "Exportar Timeline Interativa (.html)" no menu de exportações do projeto.  

**Fluxo principal:**
1. O usuário acessa o menu de exportação da timeline.
2. O usuário escolhe a opção "Linha do Tempo Web Interativa (.html)".
3. O backend monta um arquivo HTML contendo a estrutura de dados dos eventos e embute um script JS leve com biblioteca de renderização de timeline.
4. O sistema gera os estilos de visualização responsivos (CSS embutido).
5. O navegador baixa o arquivo `cronologia_interativa.html`.
6. Ao abrir o arquivo em qualquer navegador local offline, o usuário visualiza e interage com a linha do tempo.

**Fluxos alternativos:**
- *Embutir em site:* O usuário exporta o trecho como código iframe pronto para embutir na sua wiki pública ou blog.

**Fluxos de exceção:**
- *Imagens hospedadas localmente:* Se os eventos contiverem fotos, o sistema embute as mídias no HTML via codificação Base64 para garantir a exibição offline do arquivo exportado.

**Pós-condições:** O arquivo HTML/JS independente da timeline interativa é gerado e baixado.

**Critérios de aceite:**
- [ ] A timeline HTML exportada deve rodar sem necessidade de conexão com a internet (autocontida).
- [ ] O tamanho do arquivo HTML resultante não deve exceder 5MB para timelines padrão.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
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

---
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

---
### Caso de Uso: Importar mapas geográficos (arquivos de imagem)

**ID:** UC-267  
**Requisito relacionado:** RF-267 (importar mapas geográficos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui arquivos de imagens de mapas em alta resolução.  
**Gatilho:** O usuário realiza o upload da imagem ao criar ou atualizar um mapa.  

**Fluxo principal:**
1. O usuário clica em "Importar Imagem do Mapa" na ficha do mapa.
2. O sistema abre a caixa de upload local.
3. O usuário seleciona o arquivo de imagem (alta resolução) e confirma.
4. O backend recebe a imagem, gera pirâmides de imagens menores (tiles/fatiamento) em formato WebP para possibilitar renderizações parciais eficientes em zoom no navegador.
5. O sistema grava os metadados da imagem de mapa no banco de dados.
6. A tela do atlas renderiza a imagem no canvas interativo.

**Fluxos alternativos:**
- *Importar de links públicos:* O usuário insere a URL direta de uma imagem hospedada externamente e o sistema faz o download e processamento automático no servidor.

**Fluxos de exceção:**
- *Arquivo não suportado:* Se o usuário tentar fazer upload de arquivos que não sejam de imagem, o sistema cancela o processo e exibe: "Formato de arquivo inválido. Formatos suportados: JPG, PNG, WEBP".

**Pós-condições:** A imagem do mapa geográfico é processada, fatiada e disponibilizada para navegação de alta performance no atlas.

**Critérios de aceite:**
- [ ] O sistema deve aceitar imagens de até 15MB de tamanho e processá-las em menos de 8 segundos no servidor.
- [ ] A renderização dos blocos do mapa (tiles) em zoom máximo deve ser de carregamento rápido e sob demanda.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Exportar mapas geográficos (imagem com pinos)

**ID:** UC-268  
**Requisito relacionado:** RF-268 (exportar mapas geográficos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O mapa geográfico possui pinos de locais e entidades configurados na tela.  
**Gatilho:** O usuário clica em "Exportar Imagem do Mapa" no painel do atlas.  

**Fluxo principal:**
1. O usuário abre o mapa geográfico e clica no botão "Exportar".
2. O usuário seleciona a opção "Exportar Imagem com Marcadores (PNG)".
3. O sistema renderiza a imagem de fundo do mapa no canvas e insere os marcadores visuais correspondentes nas coordenadas exatas.
4. O sistema gera um arquivo PNG consolidado contendo a imagem e os marcadores fundidos.
5. O navegador inicia o download automático do arquivo.

**Fluxos alternativos:**
- *Exportar PDF do Mapa:* O usuário exporta o mapa em PDF contendo uma legenda descritiva de todos os pinos no rodapé da página.

**Fluxos de exceção:**
- *Marcador fora do enquadramento:* Se o usuário estiver com zoom aplicado em uma região específica, o sistema exporta apenas a área visível ativa na tela (crop) de acordo com o enquadramento.

**Pós-condições:** A imagem do mapa geográfico consolidada com os marcadores de locais e entidades é baixada.

**Critérios de aceite:**
- [ ] Os pinos de locais e legendas na imagem exportada devem ter nitidez para leitura e impressão.
- [ ] O processamento da imagem de exportação de tamanho padrão deve demorar menos de 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Associar imagens a entidades no mapa (fotos/capas)

**ID:** UC-269  
**Requisito relacionado:** RF-269 (associar imagens a entidades no mapa)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de entidades com imagens cadastradas e pins associados no mapa.  
**Gatilho:** O usuário passa o cursor ou clica em um marcador de entidade no mapa geográfico.  

**Fluxo principal:**
1. O usuário abre o mapa geográfico e localiza o pino da entidade correspondente (ex: "Winterfell").
2. O usuário passa o cursor sobre o pino de Winterfell.
3. O sistema abre o popover de resumo.
4. O sistema busca no banco e carrega a imagem de capa cadastrada na ficha de Winterfell.
5. O popover renderiza a miniatura da imagem no topo, acompanhada do título e resumo da ficha técnica.
6. O usuário visualiza a imagem ilustrada na popover do mapa.

**Fluxos alternativos:**
- *Mudar foto a partir do mapa:* O usuário clica em "Editar Imagem" diretamente no popover flutuante do mapa, realiza o upload de nova foto e o sistema atualiza a ficha da entidade de imediato.

**Fluxos de exceção:**
- *Entidade sem imagem cadastrada:* Se a ficha não contiver imagem, o popover exibe o pino e o texto de resumo de forma compacta, omitindo o container de imagem.

**Pós-condições:** A imagem associada à entidade é exibida de forma contextualizada no popover do marcador no mapa.

**Critérios de aceite:**
- [ ] A miniatura da imagem exibida no popover deve ter proporção otimizada para caber no container do popup sem distorção.
- [ ] O tempo de carregamento da imagem de visualização no popup deve ser menor que 200ms após o clique no pino.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Visualizar galeria de imagens do projeto

**ID:** UC-270  
**Requisito relacionado:** RF-270 (visualizar galeria de imagens do projeto)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem arquivos de imagem (capas, brasões, retratos de personagens, mapas) cadastrados no projeto.  
**Gatilho:** O usuário clica na seção "Mídia" ou "Galeria" no menu lateral do projeto.  

**Fluxo principal:**
1. O usuário clica na aba "Galeria de Mídias" do projeto.
2. O sistema varre a tabela de imagens e arquivos de mídia associados a todas as fichas de entidades e mapas do projeto.
3. A interface renderiza uma grade contendo as miniaturas das imagens em ordem de data de envio.
4. O usuário interage aplicando filtros rápidos (ex: "Exibir apenas fotos de personagens" ou "Exibir apenas mapas").
5. O usuário clica em uma miniatura de foto.
6. O sistema abre a imagem em modo lightbox em alta resolução na tela, permitindo ver os metadados do arquivo e em qual ficha técnica de entidade ela está ativa.

**Fluxos alternativos:**
- *Pesquisa na Galeria:* O usuário digita o nome de uma entidade na busca da galeria. O sistema exibe apenas as imagens associadas à ficha técnica correspondente.

**Fluxos de exceção:**
- *Mídias órfãs:* Imagens carregadas na pasta de uploads que não estão vinculadas a nenhuma ficha são listadas sob a aba "Mídias Não Utilizadas", permitindo ao usuário excluí-las para liberar cota de espaço da conta.

**Pós-condições:** O painel de fotos e metadados da galeria do projeto é exibido na tela.

**Critérios de aceite:**
- [ ] O grid de galeria deve suportar paginação ou rolagem infinita (lazy loading) para otimizar desempenho de carregamento.
- [ ] A abertura da imagem no lightbox deve ocorrer em menos de 200ms.

---

## Tabela Resumo: Lote 27 (UC-261 a UC-270)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-261** | RF-261 (cadastrar cronologia de finais múltiplos) | Média | Alta |
| **UC-262** | RF-262 (visualizar ramos cronológicos paralelos) | Média | Alta |
| **UC-263** | RF-263 (mesclar ramos cronológicos) | Baixa | Alta |
| **UC-264** | RF-264 (exportar cronologia HTML/JS) | Média | Alta |
| **UC-265** | RF-265 (criar conexões entre mapas geográficos) | Alta | Média |
| **UC-266** | RF-266 (navegar entre mapas aninhados) | Alta | Média |
| **UC-267** | RF-267 (importar mapas - arquivos de imagem) | Média | Média |
| **UC-268** | RF-268 (exportar mapas com pinos) | Média | Média |
| **UC-269** | RF-269 (associar imagens a pins no mapa) | Alta | Baixa |
| **UC-270** | RF-270 (visualizar galeria de mídias) | Média | Média |
