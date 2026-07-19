# Casos de Uso - Lote 11 (UC-101 a UC-110)

Este documento contém a especificação dos casos de uso de 101 a 110 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Posicionar entidades no mapa

**ID:** UC-101  
**Requisito relacionado:** RF-101 (posicionar entidades no mapa)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O mapa geográfico está aberto e existem entidades de outros tipos (personagens, objetos, organizações) cadastradas.  
**Gatilho:** O usuário gerencia os elementos visuais sobre o mapa ativo.  

**Fluxo principal:**
1. O usuário abre o mapa geográfico e clica no modo "Posicionar Entidades".
2. O sistema exibe um painel lateral contendo a lista de entidades disponíveis no projeto.
3. O usuário seleciona e arrasta a entidade desejada até uma coordenada específica do mapa.
4. O sistema insere um marcador visual correspondente e abre um menu popover para associar uma timestamp de presença (data cronológica) para aquela entidade naquela coordenada.
5. O sistema grava a posição `(x, y)` e a data de posicionamento na base de dados.

**Fluxos alternativos:**
- *Mapear rota de viagem:* O usuário posiciona o mesmo personagem em múltiplos pontos do mapa com datas diferentes. O sistema liga esses pontos com uma linha contínua direcionada para simular a rota de viagem.

**Fluxos de exceção:**
- *Data inválida:* Se o usuário tentar posicionar a entidade com uma data de presença anterior ao seu nascimento ou criação, o sistema exibe um aviso: "Atenção: O personagem não existia nesta data".

**Pós-condições:** As entidades e seus históricos de posicionamento/movimentação no mapa são salvos.

**Critérios de aceite:**
- [ ] A interface do mapa deve permitir ocultar ou exibir entidades no mapa usando filtros de tempo ou filtros de tipo.
- [ ] O banco de dados de posições deve suportar coordenadas percentuais em relação à imagem do mapa.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Criar mapas mentais

**ID:** UC-102  
**Requisito relacionado:** RF-102 (criar mapas mentais)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui ideias ou conceitos que deseja estruturar livremente de forma radial.  
**Gatilho:** O usuário clica em "Novo Mapa Mental" no menu do projeto.  

**Fluxo principal:**
1. O usuário acessa a seção "Mapas Mentais" e clica em "Criar Mapa Mental".
2. O sistema abre um canvas infinito de desenho de nós com um nó central ativo em branco.
3. O usuário dá um duplo clique no nó central para editá-lo.
4. O usuário clica no botão "+" do nó para puxar uma ramificação lateral (nó filho).
5. O usuário digita o texto correspondente no nó filho.
6. O sistema organiza visualmente a árvore radial à medida que o usuário adiciona nós.
7. O sistema salva a estrutura de árvore do mapa mental na base de dados.

**Fluxos alternativos:**
- *Customizar estilo dos nós:* O usuário altera a cor de fundo, formato (retângulo, oval) ou tamanho da fonte de nós específicos.

**Fluxos de exceção:**
- *Perda de dados:* O sistema realiza salvamento automático no IndexedDB local a cada nó criado ou editado para evitar perda por fechamento inesperado de aba.

**Pós-condições:** O mapa mental radial é salvo e disponibilizado para visualização e edição.

**Critérios de aceite:**
- [ ] O canvas de mapa mental deve suportar atalhos de teclado (ex: 'Tab' para nó filho, 'Enter' para nó irmão).
- [ ] A renderização e organização espacial automática dos nós deve ser executada em menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Converter grafo em mapa mental

**ID:** UC-103  
**Requisito relacionado:** RF-103 (converter grafo em mapa mental)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui um grafo de conexões de entidades populado.  
**Gatilho:** O usuário seleciona a opção "Exportar como Mapa Mental" na visualização do Grafo.  

**Fluxo principal:**
1. O usuário acessa a visualização do Grafo de Entidades.
2. O usuário clica no botão "Converter em Mapa Mental".
3. O sistema abre um modal solicitando que o usuário selecione qual nó deve servir de raiz/centro do mapa mental (ex: Personagem "Arthur").
4. O sistema extrai a árvore de relacionamentos a partir do nó raiz selecionado, quebrando ciclos complexos do grafo (transformando conexões em ramificações baseando-se no caminho mais curto).
5. O sistema gera e abre o novo mapa mental radial, exibindo o nó selecionado no centro e as entidades conectadas como ramificações.

**Fluxos alternativos:**
- *Preservar transversais como links:* O sistema representa conexões que formavam ciclos no grafo original como linhas tracejadas sutis (links transversais) entre os nós no mapa mental, sem quebrar a estrutura radial.

**Fluxos de exceção:**
- *Nó isolado selecionado:* Se o usuário selecionar um nó sem conexões, o sistema informa: "Este nó não possui conexões para gerar ramificações de mapa mental".

**Pós-condições:** Um novo mapa mental radial estruturado a partir do grafo do projeto é gerado.

**Critérios de aceite:**
- [ ] O processo de conversão e layout da árvore radial deve demorar menos de 1 segundo para grafos de até 150 nós.
- [ ] O mapa mental resultante deve ser editável de forma independente, sem alterar o grafo de origem.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Converter mapa mental em grafo

**ID:** UC-104  
**Requisito relacionado:** RF-104 (converter mapa mental em grafo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um mapa mental estruturado no projeto.  
**Gatilho:** O usuário clica em "Converter em Grafo" nas opções do mapa mental aberto.  

**Fluxo principal:**
1. O usuário abre o mapa mental e seleciona a opção "Converter para Grafo de Entidades".
2. O sistema mapeia os nós do mapa mental e gera uma correspondência direta: cada nó vira um nó de entidade e cada ramificação vira uma aresta (relacionamento).
3. O sistema mescla esses novos nós e arestas no Grafo Geral do projeto, abrindo uma caixa de diálogo para que o usuário defina o tipo de entidade.
4. O usuário confirma o mapeamento.
5. O sistema atualiza o banco de dados do grafo de conhecimento.

**Fluxos alternativos:**
- *Mesclar em entidades existentes:* Se a IA detectar que um nó do mapa mental possui o mesmo nome de uma entidade que já existe no grafo geral, ela vincula os novos relacionamentos à entidade existente em vez de duplicar.

**Fluxos de exceção:**
- *Cancelamento da mesclagem:* Se o usuário clicar em "Cancelar" na revisão de tipos de entidades, o sistema aborta a conversão e mantém o grafo original intocado.

**Pós-condições:** Os nós e fluxos do mapa mental são integrados na rede do grafo de conhecimento do projeto.

**Critérios de aceite:**
- [ ] O mapeador de conversão deve apresentar uma tela de confirmação side-by-side mostrando quais nós novos serão adicionados e quais serão fundidos.
- [ ] O banco de dados do grafo deve ser atualizado de forma transacional.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerar perguntas sobre o universo

**ID:** UC-105  
**Requisito relacionado:** RF-105 (gerar perguntas sobre o universo)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui conteúdo textual e fichas de entidades cadastradas.  
**Gatilho:** O usuário abre o painel "Perguntas de Escrita" ou clica em "Testar Consistência / Gerar Perguntas por IA".  

**Fluxo principal:**
1. O sistema lê as informações estruturadas e textos do projeto.
2. A IA formula perguntas críticas de consistência ou curiosidades baseadas em trechos obscuros, implícitos ou potenciais furos no enredo.
3. O sistema exibe a lista de perguntas geradas na interface.
4. O usuário clica sobre a pergunta para respondê-la ou marcá-la como anotação pendente de escrita (TODO).

**Fluxos alternativos:**
- *Modo Quiz:* O sistema gera perguntas no estilo quiz de múltipla escolha sobre os fatos cadastrados nas fichas para testar o conhecimento de leitores ou colaboradores.

**Fluxos de exceção:**
- *Dados insuficientes:* Se o projeto possuir poucas informações escritas, o sistema notifica: "Escreva mais detalhes no projeto para que a IA possa gerar perguntas sobre o seu universo".

**Pós-condições:** Uma lista de perguntas reflexivas ou de consistência sobre o universo é apresentada ao usuário.

**Critérios de aceite:**
- [ ] O sistema de IA deve categorizar as perguntas em: "Inconsistências", "Pontas Soltas" e "Curiosidades".
- [ ] O tempo máximo de geração de uma lista com 5 perguntas deve ser menor que 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Responder perguntas sobre o universo

**ID:** UC-106  
**Requisito relacionado:** RF-106 (responder perguntas sobre o universo)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** O usuário tem uma caixa de chat com a IA ativa ou deseja obter respostas automáticas a partir de perguntas.  
**Gatilho:** O usuário digita uma pergunta no chat de assistência ou clica em "Deixar a IA responder" em uma pergunta gerada.  

**Fluxo principal:**
1. O usuário envia uma pergunta ou solicita a resposta automática a uma dúvida do enredo.
2. A IA realiza uma busca semântica em todos os textos do projeto e nas tabelas de metadados do universo.
3. A IA compõe uma resposta objetiva baseada exclusivamente nos fatos explícitos ou implícitos encontrados na base do projeto.
4. O sistema exibe a resposta na tela.

**Fluxos alternativos:**
- *Responder citando fonte:* O sistema exibe a resposta acompanhada por citações dos trechos de capítulos e fichas técnicas de onde extraiu as conclusões.

**Fluxos de exceção:**
- *Informação indisponível:* Se a informação não constar em nenhuma parte do projeto, a IA responde honestamente: "Não encontrei referências sobre o assunto nos arquivos. Deseja definir essa informação agora?".

**Pós-condições:** A resposta estruturada e contextualizada é exibida ao usuário.

**Critérios de aceite:**
- [ ] A IA não deve alucinar; a resposta deve ser derivada diretamente das fontes textuais ou fichas cadastradas no projeto.
- [ ] A latência de resposta do chatbot de lore deve ser inferior a 2,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Identificar entidades automaticamente

**ID:** UC-107  
**Requisito relacionado:** RF-107 (identificar entidades automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Um texto novo foi salvo ou colado no editor.  
**Gatilho:** Salvamento automático de um texto que possui novos parágrafos escritos.  

**Fluxo principal:**
1. O sistema dispara em background uma tarefa assíncrona de processamento de linguagem natural (NLP).
2. O pipeline de IA analisa o texto comparando substantivos próprios e padrões sintáticos com o banco de dados de entidades já existentes.
3. Se a IA identificar novos termos recorrentes com estrutura de nome de personagem, local ou organização que não estejam catalogados, ela insere as entidades na lista de "Identificadas".
4. O sistema exibe um aviso visual sutil no editor: "Detectamos novas entidades em potencial. Clique aqui para adicioná-las".

**Fluxos alternativos:**
- *Mapeamento silencioso:* O sistema cadastra as novas entidades identificadas diretamente como rascunhos no banco de dados de entidades, sob a categoria "Rascunhos de IA".

**Fluxos de exceção:**
- *Falso positivo:* O usuário clica em "Ocultar / Isso não é uma entidade" em um nome incorreto, impedindo que o termo seja identificado em análises futuras.

**Pós-condições:** Novas entidades potenciais mencionadas no texto são identificadas e preparadas para catalogação.

**Critérios de aceite:**
- [ ] O classificador de entidades (NER) deve ter precisão de pelo menos 90% para nomes próprios.
- [ ] O processamento em background deve rodar sem degradar o desempenho de digitação na thread principal da interface.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Atualizar entidades automaticamente

**ID:** UC-108  
**Requisito relacionado:** RF-108 (atualizar entidades automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto do editor relata novas informações físicas ou eventos ocorridos com entidades existentes.  
**Gatilho:** Conclusão de escrita de um texto ou salvamento manual.  

**Fluxo principal:**
1. O sistema executa uma análise semântica em background nos textos atualizados.
2. A IA identifica mudanças relatadas sobre entidades catalogadas (ex: o texto diz "Arthur perdeu sua mão esquerda").
3. A IA confronta com os dados da ficha cadastrada (onde a mão esquerda de Arthur está intacta).
4. A IA propõe a atualização automática do status da entidade (ex: adicionar "Amputação da mão esquerda" na ficha).
5. A interface exibe a sugestão de atualização na aba lateral da ficha técnica correspondente.
6. O usuário clica em "Aplicar Alteração".

**Fluxos alternativos:**
- *Auto-update silencioso:* O sistema atualiza os atributos e status diretamente na base de dados caso a permissão de atualização automática sem validação manual esteja ativa nas configurações.

**Fluxos de exceção:**
- *Rejeição manual:* O usuário rejeita a sugestão de alteração clicando em "Descartar sugestão da IA", mantendo a ficha original intacta.

**Pós-condições:** As fichas de personagens, locais e objetos são atualizadas de acordo com os eventos transcorridos no texto.

**Critérios de aceite:**
- [ ] O sistema de IA deve apresentar o trecho exato do capítulo que motivou a sugestão de atualização de metadados da entidade.
- [ ] O processamento deve rodar de forma assíncrona em background.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Fundir entidades duplicadas

**ID:** UC-109  
**Requisito relacionado:** RF-109 (fundir entidades duplicadas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem duas entidades cadastradas separadamente que representam o mesmo personagem ou objeto (ex: "Artie" e "Arthur").  
**Gatilho:** O usuário seleciona duas entidades e clica em "Fundir Entidades" ou aceita uma sugestão automática de fusão da IA.  

**Fluxo principal:**
1. O usuário seleciona a entidade "Artie" e a entidade "Arthur" na lista do diretório.
2. O usuário clica em "Fundir".
3. O sistema abre uma tela de conciliação exibindo as fichas de ambos os registros em paralelo.
4. O usuário seleciona qual nome será o principal ("Arthur") e resolve conflitos de atributos.
5. O usuário clica em "Confirmar Fusão".
6. O sistema atualiza o banco de dados: transfere todos os relacionamentos, arestas de grafos, localizações de mapa e referências de texto de "Artie" para "Arthur".
7. O registro de "Artie" é deletado permanentemente do banco de dados.

**Fluxos alternativos:**
- *Mesclagem de tags:* O sistema adiciona "Artie" como apelido/sinônimo oficial na ficha de "Arthur" para manter a rastreabilidade.

**Fluxos de exceção:**
- *Fusão de tipos diferentes:* Se o usuário tentar fundir um personagem com um local, o sistema impede a ação e exibe "Não é possível fundir entidades de categorias distintas".

**Pós-condições:** As duas entidades duplicadas são consolidadas em um único registro no banco de dados e no grafo.

**Critérios de aceite:**
- [ ] A fusão de registros deve atualizar todas as tabelas de referência e chaves estrangeiras no banco de dados de forma transacional.
- [ ] Os hyperlinks existentes nos textos que direcionavam para a entidade antiga devem ser reescritos dinamicamente.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar hyperlinks entre textos

**ID:** UC-110  
**Requisito relacionado:** RF-110 (criar hyperlinks entre textos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto de origem e o texto de destino existem no projeto.  
**Gatilho:** O usuário seleciona uma palavra ou frase no editor de texto e escolhe a opção "Inserir Hyperlink do Projeto".  

**Fluxo principal:**
1. O usuário seleciona a palavra "Muralha" no editor.
2. O usuário pressiona o atalho Ctrl+K.
3. O sistema abre uma caixa de busca de arquivos internos do projeto.
4. O usuário digita "história" e o sistema lista os arquivos correspondentes (ex: "A História da Muralha").
5. O usuário clica sobre o arquivo de destino.
6. O sistema insere um hyperlink inline no formato de link interno markdown `[[A História da Muralha|Muralha]]`.
7. A palavra passa a ser exibida como link sublinhado e clicável no editor.

**Fluxos alternativos:**
- *Navegação rápida:* O usuário clica com a tecla Ctrl pressionada em cima do hyperlink no editor e o sistema abre o arquivo linkado em um novo painel split-view ao lado.

**Fluxos de exceção:**
- *Arquivo de destino excluído:* Se o arquivo linkado for deletado do projeto, o hyperlink passa a ser exibido em vermelho com um aviso de "Link quebrado".

**Pós-condições:** O hyperlink de referência interna é estabelecido no corpo do texto.

**Critérios de aceite:**
- [ ] A criação de links deve ser compatível com a sintaxe de wiki-links (`[[nome_do_arquivo]]`) padrão de mercado.
- [ ] O hyperlink inserido deve ser indexado no banco de dados de conexões de textos.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---

## Tabela Resumo: Lote 11 (UC-101 a UC-110)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-101** | RF-101 (posicionar entidades no mapa) | Média | Alta |
| **UC-102** | RF-102 (criar mapas mentais) | Média | Alta |
| **UC-103** | RF-103 (converter grafo em mapa mental) | Baixa | Alta |
| **UC-104** | RF-104 (converter mapa mental em grafo) | Baixa | Alta |
| **UC-105** | RF-105 (gerar perguntas sobre o universo) | Média | Alta |
| **UC-106** | RF-106 (responder perguntas sobre o universo) | Alta | Alta |
| **UC-107** | RF-107 (identificar entidades automaticamente) | Alta | Alta |
| **UC-108** | RF-108 (atualizar entidades automaticamente) | Média | Alta |
| **UC-109** | RF-109 (fundir entidades duplicadas) | Alta | Média |
| **UC-110** | RF-110 (criar hyperlinks entre textos) | Alta | Baixa |
