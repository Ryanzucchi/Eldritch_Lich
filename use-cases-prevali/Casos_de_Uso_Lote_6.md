# Casos de Uso - Lote 6 (UC-051 a UC-060)

Este documento contém a especificação dos casos de uso de 51 a 60 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Reconhecer contradições entre eventos

**ID:** UC-051  
**Requisito relacionado:** RF-51 (reconhecer contradições entre eventos)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui eventos cadastrados na base de dados e textos que relatam esses eventos.  
**Gatilho:** Análise contínua do texto do editor ou solicitação de verificação lógica pelo usuário.  

**Fluxo principal:**
1. A IA lê o texto e identifica descrições que relatam o andamento, consequências ou participantes de um evento cadastrado.
2. A IA confronta as descrições com os metadados do evento no banco de dados (ex: a base diz que o evento "A Batalha do Moinho" terminou com a "vitória dos rebeldes" e que o personagem "John morreu" nela, mas o texto relata: "Após a vitória das forças imperiais na Batalha do Moinho, John retornou para casa").
3. A IA identifica as contradições (desfecho incorreto e personagem morto reaparecendo).
4. O sistema marca o trecho do texto com um sublinhado vermelho e exibe a justificativa do conflito no tooltip informativo.

**Fluxos alternativos:**
- *Retcon automático:* O usuário clica em "Atualizar Evento com esta versão" para mudar os metadados do evento na linha do tempo baseado no novo texto do capítulo.

**Fluxos de exceção:**
- *Universos alternativos:* Se a contradição ocorrer devido a ramificações temporárias ativas, o sistema contextualiza e não sinaliza como erro caso os eventos ocorram em linhas temporais paralelas diferentes.

**Pós-condições:** Contradições lógicas e factuais sobre eventos históricos do universo são apresentadas.

**Critérios de aceite:**
- [ ] A IA deve analisar inconsistências de: vencedor/desfecho do evento, personagens participantes, e localização do evento.
- [ ] O relatório de inconsistência deve apontar claramente qual o fato gravado na cronologia e qual o trecho em contradição.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerar resumo de textos

**ID:** UC-052  
**Requisito relacionado:** RF-52 (gerar resumo de textos)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto do documento possui conteúdo no editor.  
**Gatilho:** O usuário clica em "Gerar Resumo" na aba de assistência ou no menu do documento.  

**Fluxo principal:**
1. O usuário seleciona o tamanho do resumo desejado (curto, médio, longo).
2. O sistema envia o texto do documento para a IA de sumarização.
3. A IA lê e gera um resumo estruturado contendo os acontecimentos principais do capítulo ou cena.
4. O sistema exibe o resumo gerado em um modal ou aba dedicada.
5. O usuário revisa o resumo e clica em "Salvar nos metadados do documento" para arquivá-lo como sinopse daquele texto.

**Fluxos alternativos:**
- *Resumo de pasta:* O usuário solicita o resumo de uma pasta inteira. O sistema lê os resumos de todos os arquivos contidos na pasta e gera um resumo consolidado do arco correspondente.

**Fluxos de exceção:**
- *Texto excessivamente curto:* Se o texto possuir menos de 100 palavras, o sistema avisa que o texto já é curto e não gera o resumo.

**Pós-condições:** O resumo gerado é salvo nas propriedades do documento/pasta.

**Critérios de aceite:**
- [ ] O resumo deve preservar nomes de entidades principais (personagens e locais chave).
- [ ] O processamento e geração de um resumo para um texto de 3.000 palavras devem demorar menos de 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Gerar palavras-chave automaticamente

**ID:** UC-053  
**Requisito relacionado:** RF-53 (gerar palavras-chave automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O documento possui conteúdo textual escrito.  
**Gatilho:** Salvamento do texto ou acionamento pelo usuário nas ferramentas de metadados.  

**Fluxo principal:**
1. O sistema consome o texto mais recente do documento.
2. A IA identifica e pontua os termos mais relevantes com base em algoritmos de NLP.
3. O sistema atualiza automaticamente o campo "Palavras-chave geradas por IA" nas propriedades do arquivo.
4. O usuário visualiza as sugestões de palavras-chave como tags sugeridas no rodapé do documento e pode aceitá-las com um clique.

**Fluxos alternativos:**
- *Auto-tags:* O sistema adiciona automaticamente as palavras-chave com maior score de relevância diretamente como tags do projeto.

**Fluxos de exceção:**
- *Falha de conexão:* O sistema aguarda até a próxima conexão estável para tentar gerar e preencher as palavras-chave.

**Pós-condições:** Palavras-chave semânticas são geradas e sugeridas nas propriedades do documento.

**Critérios de aceite:**
- [ ] A lista de palavras-chave sugeridas não deve conter duplicatas nem stopwords comuns.
- [ ] A geração automática das palavras-chave deve ser executada de forma assíncrona com latência total < 1,5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Gerar sugestões de conexão

**ID:** UC-054  
**Requisito relacionado:** RF-54 (gerar sugestões de conexão)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Existem textos e entidades cadastrados no projeto que possuem menções ou temas similares implicitamente.  
**Gatilho:** O usuário abre o painel "Sugestões de Relacionamento" do projeto.  

**Fluxo principal:**
1. O sistema varre o grafo de conhecimento e os textos do projeto em background.
2. A IA analisa relações implícitas não registradas (ex: menções indiretas como "a filha de Aldric" e a personagem "Clara" ser filha de Aldric na ficha técnica).
3. O sistema apresenta uma lista de conexões sugeridas rotuladas com a justificativa (ex: "Sugerido: Conectar Personagem Clara à ficha de Aldric").
4. O usuário clica em "Aprovar Conexão" para consolidar a aresta no grafo.

**Fluxos alternativos:**
- *Ignorar em massa:* O usuário seleciona múltiplos itens sugeridos e clica em "Ignorar Sugestões".

**Fluxos de exceção:**
- *Falta de conexões:* Se o grafo do projeto já estiver altamente mapeado e não houver sugestões válidas com score de confiança relevante, a interface exibe "Nenhuma nova sugestão de conexão identificada".

**Pós-condições:** As novas conexões selecionadas são gravadas no banco de dados de relacionamentos.

**Critérios de aceite:**
- [ ] Cada sugestão de conexão gerada pela IA deve vir acompanhada da justificativa contextual correspondente.
- [ ] O cálculo das sugestões deve ser processado em fila em background (job assíncrono).

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Criar linha do tempo

**ID:** UC-055  
**Requisito relacionado:** RF-55 (criar linha do tempo)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O usuário possui um projeto aberto e permissões de escrita.  
**Gatilho:** O usuário clica no botão "Criar Nova Linha do Tempo" ou acessa o módulo de cronologia.  

**Fluxo principal:**
1. O usuário clica na opção "Criar Linha do Tempo" no painel de ferramentas.
2. O sistema abre um formulário solicitando: Nome da Linha do Tempo, Descrição e Tipo de Calendário (padrão Gregoriano ou Calendário Customizado).
3. O usuário insere as informações e clica em "Criar".
4. O sistema cria um novo registro de timeline no banco de dados e abre a visualização da linha do tempo vazia.

**Fluxos alternativos:**
- *Duplicar Linha do Tempo:* O usuário clica em "Duplicar" em uma timeline existente para criar uma versão alternativa dela (útil para universos paralelos).

**Fluxos de exceção:**
- *Nome vazio:* Se o usuário tentar criar sem nomear, o sistema exibe "O campo Nome é obrigatório" e mantém o modal de criação aberto.

**Pós-condições:** A nova linha do tempo é cadastrada na base de dados e exibida na interface.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a data de criação, autor e permissões de acesso da timeline.
- [ ] O sistema deve permitir a criação de múltiplas linhas do tempo independentes no mesmo projeto.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Relacionar eventos na linha do tempo

**ID:** UC-056  
**Requisito relacionado:** RF-56 (relacionar eventos na linha do tempo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A linha do tempo selecionada possui pelo menos dois eventos cadastrados.  
**Gatilho:** O usuário gerencia os eventos no painel de timeline.  

**Fluxo principal:**
1. O usuário abre a visualização interativa da linha do tempo.
2. O usuário clica sobre um evento "Evento A" e seleciona "Vincular a...".
3. O usuário arrasta uma linha até outro evento "Evento B" ou seleciona-o a partir de uma lista.
4. O usuário define a relação temporal/lógica entre eles (ex: "Precursor de", "Ocorre simultaneamente a", "Consequência de").
5. O sistema grava o relacionamento temporal no banco de dados e exibe a conexão gráfica na linha do tempo.

**Fluxos alternativos:**
- *Ordenação automática:* Se o usuário alterar a data fictícia de um evento relacionado, o sistema reordena visualmente os eventos na timeline preservando os links de causa-efeito definidos.

**Fluxos de exceção:**
- *Inconsistência cronológica:* Se o usuário vinculou B como consequência de A, mas alterar a data de B para antes de A, o sistema avisa sobre o conflito cronológico mas permite salvar.

**Pós-condições:** Os eventos na linha do tempo ficam vinculados lógica e cronologicamente na base de dados.

**Critérios de aceite:**
- [ ] O sistema deve exibir as conexões causais diretamente na interface visual da timeline.
- [ ] A alteração do relacionamento deve ser sincronizada instantaneamente no banco de dados (< 500ms).

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Ter visualização em grafo

**ID:** UC-057  
**Requisito relacionado:** RF-57 (ter visualização em grafo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui documentos, tags, pastas e entidades cadastradas e interconectadas.  
**Gatilho:** O usuário clica na aba "Visualizar Grafo" no menu do projeto.  

**Fluxo principal:**
1. O usuário clica em "Visualizar Grafo" no painel principal.
2. O sistema lê todos os nós do projeto (pastas, arquivos, entidades) e suas arestas (relações, links, tags comuns).
3. O sistema renderiza o Grafo Geral do Universo no canvas, onde cada tipo de nó possui uma cor e ícone diferente.
4. O usuário interage com o grafo, aplicando zoom, arrastando nós e filtrando elementos.

**Fluxos alternativos:**
- *Navegar pelo Grafo:* O usuário dá um duplo clique em um nó do grafo e o sistema abre o arquivo correspondente para edição imediata.

**Fluxos de exceção:**
- *Falha de renderização do Canvas:* Se o navegador não suportar WebGL ou Canvas 2D acelerado por hardware, o sistema reverte para uma árvore hierárquica textual convencional e exibe um aviso.

**Pós-condições:** O grafo global do projeto é exibido de forma interativa e navegável na interface do usuário.

**Critérios de aceite:**
- [ ] A renderização e simulação física do grafo devem rodar a pelo menos 30 FPS no navegador em projetos de até 300 nós.
- [ ] O grafo deve possuir uma barra de busca rápida para localizar e focar em nós específicos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
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

---
### Caso de Uso: Montar árvores genealógicas

**ID:** UC-059  
**Requisito relacionado:** RF-59 (montar árvores genealógicas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens cadastrados na base de entidades do projeto.  
**Gatilho:** O usuário clica em "Montar Árvore Genealógica" na aba de personagens ou ferramentas.  

**Fluxo principal:**
1. O usuário acessa a tela de "Árvores Genealógicas".
2. O usuário clica em "Nova Árvore" e define um título (ex: "Dinastia Targaryen").
3. O sistema abre um canvas de árvore genealógica vazio.
4. O usuário arrasta personagens cadastrados do painel lateral para o canvas.
5. O usuário desenha conexões de parentesco entre eles clicando nos nós e selecionando a relação (ex: "Cônjuge", "Filho de").
6. O sistema renderiza a árvore estruturada com layouts genealógicos automáticos.

**Fluxos alternativos:**
- *Remover de árvore:* O usuário clica em um nó e seleciona "Remover da árvore", apenas retirando-o da visualização específica sem excluí-lo da base de personagens.

**Fluxos de exceção:**
- *Relações biológicas impossíveis:* Se o usuário tentar definir um personagem como filho de si mesmo ou criar ciclos impossíveis, o sistema exibe "Relação genealógica inválida detectada" e bloqueia a conexão.

**Pós-condições:** A árvore genealógica é gerada e salva nas propriedades do projeto.

**Critérios de aceite:**
- [ ] O layout genealógico deve ser gerado automaticamente pela interface para manter o alinhamento visual correto dos níveis de gerações.
- [ ] A árvore genealógica deve ser exportável como imagem (.png ou .svg).

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Auto montar árvores genealógicas baseados no texto

**ID:** UC-060  
**Requisito relacionado:** RF-60 (auto montar árvores genealógicas baseados no texto)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Existem textos no projeto que mencionam relações familiares entre os personagens.  
**Gatilho:** O usuário seleciona "Auto-montar Árvore" a partir de um texto ou projeto.  

**Fluxo principal:**
1. O usuário clica em "Gerar Árvore Genealógica por IA" na aba de ferramentas.
2. A IA varre o texto dos capítulos selecionados em busca de declarações de parentesco (ex: "Arthur, filho de Uther").
3. A IA compila a tabela de relações de parentesco extraídas.
4. O sistema gera uma árvore genealógica visual de rascunho com os graus de parentesco identificados.
5. O sistema exibe um painel lado a lado mostrando a árvore proposta e as justificativas textuais.
6. O usuário clica em "Confirmar e Salvar Árvore".

**Fluxos alternativos:**
- *Atualizar existente:* A IA detecta novas menções de parentesco ao longo da escrita e sugere adições em uma árvore genealógica já existente.

**Fluxos de exceção:**
- *Conflitos de parentesco:* Se diferentes trechos de texto contarem versões conflitantes, a IA exibe as alternativas com os respectivos trechos e solicita que o usuário resolva manualmente.

**Pós-condições:** A árvore genealógica é estruturada e gravada de forma automatizada.

**Critérios de aceite:**
- [ ] O sistema de IA deve justificar cada aresta de parentesco criada referenciando o arquivo e a linha de origem.
- [ ] O tempo total de análise para a montagem de árvore genealógica em um romance com até 50 mil palavras deve ser de no máximo 10 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---

## Tabela Resumo: Lote 6 (UC-051 a UC-060)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-051** | RF-51 (reconhecer contradições entre eventos) | Alta | Alta |
| **UC-052** | RF-52 (gerar resumo de textos) | Média | Média |
| **UC-053** | RF-53 (gerar palavras-chave automaticamente) | Média | Média |
| **UC-054** | RF-54 (gerar sugestões de conexão) | Alta | Alta |
| **UC-055** | RF-55 (criar linha do tempo) | Alta | Média |
| **UC-056** | RF-56 (relacionar eventos na linha do tempo) | Alta | Média |
| **UC-057** | RF-57 (ter visualização em grafo) | Alta | Alta |
| **UC-058** | RF-58 (ter visualização cronológica) | Alta | Alta |
| **UC-059** | RF-59 (montar árvores genealógicas) | Média | Alta |
| **UC-060** | RF-60 (auto montar árvores genealógicas...) | Média | Alta |
