# Casos de Uso - Lote 33 (UC-321 a UC-330)

Este documento contém a especificação dos casos de uso de 321 a 330 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Exportar conteúdo para LaTeX

**ID:** UC-321  
**Requisito relacionado:** RF-320 (exportar conteúdo para LaTeX)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** O projeto acadêmico possui textos, fórmulas e referências bibliográficas cadastradas.  
**Gatilho:** O usuário seleciona "Exportar para LaTeX (.tex)" no menu de exportações do projeto.  

**Fluxo principal:**
1. O usuário acessa o menu de exportação de textos acadêmicos.
2. O usuário seleciona a opção "Formato LaTeX (.tex)".
3. O usuário configura as opções de preâmbulo (classe do documento: article, report, book).
4. O usuário clica em "Exportar".
5. O backend processa o texto estruturado da aplicação, convertendo a formatação rica para tags LaTeX (ex: negrito vira `\textbf{}`), fórmulas matemáticas para blocos matemáticos (`$math$`) e referências para comandos `\cite{}`.
6. O sistema empacota o arquivo `.tex` e o arquivo de referências `.bib` em um arquivo compactado `.zip` e inicia o download.

**Fluxos alternativos:**
- *Exportação via Overleaf API:* O usuário clica em "Enviar para Overleaf", que carrega e abre o projeto diretamente no editor online Overleaf parceiro via integração de API.

**Fluxos de exceção:**
- *Caracteres especiais:* O parser limpa e escapa de forma automática caracteres especiais do LaTeX (como `%`, `_`, `&`, `#`) contidos no texto corrido para evitar que o arquivo final apresente erros de compilação.

**Pós-condições:** O arquivo compactado contendo o código-fonte LaTeX (.tex) e a base de bibliografia (.bib) é gerado e baixado.

**Critérios de aceite:**
- [ ] O código LaTeX gerado deve ser compilável sem erros em compiladores padrão (como pdfLaTeX).
- [ ] O tempo total de geração do ZIP de exportação deve ser de no máximo 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Registrar metodologia de pesquisa

**ID:** UC-322  
**Requisito relacionado:** RF-321 (registrar metodologia de pesquisa)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** O usuário está com a ficha do projeto científico ativa.  
**Gatilho:** O usuário edita a seção de metodologia do projeto.  

**Fluxo principal:**
1. O usuário acessa a seção "Módulo Científico" -> "Metodologia".
2. O usuário clica em "Registrar Nova Metodologia".
3. O sistema abre o formulário solicitando: Tipo de Pesquisa (qualitativa, quantitativa, experimental), Descrição dos Métodos, Amostragem, Coleta de Dados e Técnicas de Análise.
4. O usuário preenche as informações estruturadas.
5. O usuário clica em "Salvar".
6. O sistema grava os dados de metodologia no banco de dados.
7. A metodologia passa a constar na ficha do projeto, indexando os experimentos associados.

**Fluxos alternativos:**
- *Modelos de metodologia:* O usuário carrega um template padrão de metodologia correspondente ao seu nicho (ex: Ensaio Clínico) e preenche as informações específicas.

**Fluxos de exceção:**
- *Metodologia sem classificação:* O sistema exige a seleção do tipo de pesquisa antes de gravar para fins de categorização e filtros.

**Pós-condições:** A ficha de metodologia científica é armazenada no banco de dados do projeto.

**Critérios de aceite:**
- [ ] O campo de descrição deve aceitar formatação rica Markdown e inserção de fórmulas matemáticas.
- [ ] A inserção no banco de dados deve ser de no máximo 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Gerenciar coautores e contribuições

**ID:** UC-323  
**Requisito relacionado:** RF-322 (gerenciar coautores e contribuições)  
**Ator(es):** Administrador/Autor Principal, Coautores, Sistema  
**Pré-condições:** O projeto colaborativo possui múltiplos membros cadastrados.  
**Gatilho:** O autor principal distribui as responsabilidades de coautoria.  

**Fluxo principal:**
1. O autor principal acessa as configurações do projeto e clica em "Membros e Contribuições".
2. O sistema exibe a lista de coautores convidados.
3. O autor principal clica em "Editar Contribuições" ao lado do nome do coautor correspondente.
4. O sistema abre a lista de papéis sob a taxonomia CRediT (Conceituação, Análise de Dados, Escrita do Manuscrito, Revisão e Edição).
5. O autor principal seleciona os papéis correspondentes e define a participação do membro.
6. O autor principal clica em "Salvar".
7. O sistema grava a taxonomia de contribuições no banco de dados.

**Fluxos alternativos:**
- *Relatório de autoria:* O autor principal clica em "Gerar Declaração de Autoria", gerando um relatório em PDF contendo o detalhamento de contribuições de cada membro sob os padrões de periódicos científicos.

**Fluxos de exceção:**
- *Remover autoria master:* O autor principal não pode remover a própria atribuição de autoria master sem transferir a propriedade do projeto previamente.

**Pós-condições:** O registro detalhado de contribuições de coautoria sob taxonomia CRediT é armazenado.

**Critérios de aceite:**
- [ ] O sistema deve permitir associar múltiplos papéis CRediT para o mesmo coautor de forma simples.
- [ ] A geração da declaração de autoria deve demorar menos de 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Formatar texto em formatos científicos variáveis

**ID:** UC-324  
**Requisito relacionado:** RF-323 (formatar texto em formatos cientificos variaveis)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** Manuscrito escrito e estruturado no projeto.  
**Gatilho:** O usuário clica em "Formatar Manuscrito" na aba de visualização do artigo.  

**Fluxo principal:**
1. O usuário abre o manuscrito científico e clica no painel "Formatação Avançada".
2. O sistema exibe os modelos de periódicos homologados: "Template ABNT Artigo", "Template Nature", "Template IEEE", "Template Elsevier".
3. O usuário seleciona o template desejado (ex: "Template Nature").
4. O sistema processa o documento e aplica a formatação exigida (colunas, família/tamanho de fontes, recuos, títulos, afiliações e cabeçalhos).
5. O usuário visualiza o artigo formatado na tela através de um painel de pré-visualização de PDF.

**Fluxos alternativos:**
- *Template customizado:* O usuário ajusta as diretrizes manuais de formatação (espaçamento, recuos, fontes) salvando como modelo privado da sua instituição de ensino.

**Fluxos de exceção:**
- *Tabelas muito largas:* Se o documento possuir tabelas que transbordem o layout de duas colunas do template selecionado, o sistema exibe um alerta e ajusta automaticamente a tabela para ocupar a largura total da página (bloco de coluna única) mantendo a legibilidade.

**Pós-condições:** O texto do manuscrito é formatado de acordo com as regras estruturais e visuais do periódico selecionado.

**Critérios de aceite:**
- [ ] A re-renderização da pré-visualização formatada do manuscrito na tela deve demorar menos de 4 segundos.
- [ ] O documento deve respeitar rigorosamente as margens e limites de número de páginas configurados no estilo.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Exportar textos em docx / criar notas atômicas (uma ideia por nota)

**ID:** UC-325  
**Requisito relacionado:** RF-324 (exportar textos em docx / criar notas atômicas)  
**Ator(es):** Usuário (Escritor/Pesquisador), Sistema  
**Pré-condições:** O usuário está editando textos no projeto.  
**Gatilho:** O usuário clica em "Exportar em DOCX" ou seleciona "Criar Nota Atômica" na barra de brainstorm.  

**Fluxo principal (Criação de Nota Atômica):**
1. O usuário clica em "Nova Nota Atômica" no caderno de ideias do projeto.
2. O sistema abre um editor minimalista solicitando o título (ideia central) e corpo da nota (deve ser conciso, focado em uma única ideia).
3. O usuário insere a ideia central e adiciona tags de conceito.
4. O usuário clica em "Salvar".
5. O sistema grava o registro com identificador UID único e permanente no banco de dados.

**Fluxo principal (Exportação em DOCX):**
1. O usuário abre o texto e clica no botão de exportação selecionando o formato DOCX.
2. O sistema processa o arquivo formatando cabeçalhos e parágrafos de forma compatível com arquivos .docx.
3. O download do arquivo Word é iniciado de forma automática pelo navegador.

**Fluxos alternativos:**
- *Converter seleção em nota atômica:* Ao editar um texto longo, o usuário seleciona um parágrafo, clica com o botão direito e escolhe "Extrair para Nota Atômica". O sistema cria a nota atômica vinculada e insere uma referência no texto original.

**Fluxos de exceção:**
- *Texto excessivamente longo na nota:* Se o usuário tentar digitar mais de 300 palavras na nota atômica, o sistema exibe um aviso sutil sobre a importância da atomicidade, recomendando criar subnotas se necessário.

**Pós-condições:** A nota atômica com UID exclusivo é persistida no banco ou o arquivo Word correspondente é exportado.

**Critérios de aceite:**
- [ ] A exportação em Word deve reter cabeçalhos H1, H2, H3 e notas de rodapé de forma nativa e compatível com editores de texto tradicionais.
- [ ] O salvamento da nota atômica deve demorar menos de 100ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Linkar notas bidirecionalmente

**ID:** UC-326  
**Requisito relacionado:** RF-325 (linkar notas bidirecionalmente)  
**Ator(es):** Usuário (Escritor/Pesquisador), Sistema  
**Pré-condições:** Existem pelo menos duas notas atômicas criadas.  
**Gatilho:** O usuário insere um link interno em uma nota usando a sintaxe de colchetes duplos `[[`.  

**Fluxo principal:**
1. O usuário abre a nota de origem (ex: "Nota A").
2. No corpo da nota, o usuário insere a referência no formato `[[Nota B]]`.
3. O sistema reconhece o link dinamicamente. Ao salvar, grava no banco de dados a relação direcionada de A para B.
4. O sistema insere de forma automática a referência inversa de "Mencionada em: [[Nota A]]" no painel de Backlinks no rodapé da "Nota B".
5. O usuário abre a Nota B e visualiza o link de retorno ativo para navegação bidirecional rápida.

**Fluxos alternativos:**
- *Remoção de link:* O usuário apaga a referência no texto da Nota A. O sistema remove a relação correspondente no banco e o backlink desaparece da Nota B.

**Fluxos de exceção:**
- *Link para nota inexistente:* Se o usuário digitar um link para uma nota inexistente, o link fica em cinza. Se o usuário clicar nele, o sistema abre o modal de criação rápida criando um novo documento com o título digitado e vinculando ambos.

**Pós-condições:** O link bidirecional é estabelecido no banco de dados do projeto.

**Critérios de aceite:**
- [ ] O painel de backlinks de qualquer nota deve listar o título e o trecho de contexto em que o link foi citado.
- [ ] A indexação e atualização bidirecional de conexões devem levar menos de 150ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar mapa de conhecimento pessoal (zettelkasten)

**ID:** UC-327  
**Requisito relacionado:** RF-326 (criar mapa de conhecimento pessoal)  
**Ator(es):** Usuário (Pesquisador/Escritor), Sistema  
**Pré-condições:** Notas atômicas e links bidirecionais cadastrados no projeto.  
**Gatilho:** O usuário clica na seção "Visualização de Gráfico" na barra lateral de notas.  

**Fluxo principal:**
1. O usuário acessa o menu lateral e clica em "Mapa de Conhecimento (Gráfico)".
2. O sistema busca todas as notas atômicas e suas conexões bidirecionais.
3. A interface renderiza na tela um gráfico bidimensional interativo (Force-directed Graph), onde cada nota é representada por um nó e os relacionamentos por linhas.
4. O usuário visualiza o aglomerado de ideias e as notas mais influentes (com tamanho de círculos maiores).
5. O usuário clica sobre uma nota e o sistema exibe seu conteúdo em janela popover de visualização rápida.

**Fluxos alternativos:**
- *Filtragem no gráfico:* O usuário usa a barra de pesquisa do gráfico para filtrar por tag ou termo, destacando no canvas apenas os nós que contêm a busca correspondente.

**Fluxos de exceção:**
- *Notas órfãs:* Notas que não possuem conexões são exibidas flutuando nas bordas do gráfico, permitindo ao usuário identificá-las para criar novos vínculos de ideias.

**Pós-condições:** O grafo interativo do mapa de conhecimento pessoal é renderizado de forma dinâmica.

**Critérios de aceite:**
- [ ] A renderização física das notas deve suportar aceleração de hardware leve para garantir navegação fluida em grafos com mais de 500 notas.
- [ ] O mapa do gráfico deve atualizar de imediato ao criar novas notas ou conexões.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Revisar notas periodicamente (spaced repetition)

**ID:** UC-328  
**Requisito relacionado:** RF-327 (revisar notas periodicamente)  
**Ator(es):** Usuário (Pesquisador/Escritor), Sistema  
**Pré-condições:** Notas atômicas salvas no banco de dados.  
**Gatilho:** O usuário acessa o painel "Revisão Espaçada" ou o sistema gera a fila de revisão do dia.  

**Fluxo principal:**
1. O usuário abre o módulo de revisão de notas.
2. O sistema analisa as datas de revisões anteriores de cada nota e monta a fila de cartões do dia utilizando algoritmo de repetição espaçada (ex: SM-2).
3. O sistema exibe o cartão da primeira nota agendada.
4. O usuário lê e estuda a nota na tela.
5. O usuário clica em um botão de feedback correspondente ao seu nível de recordação (Fácil, Médio, Difícil, Esqueci).
6. O sistema recalcula a nova data de agendamento (afastando o período conforme a facilidade) e grava no banco.
7. O sistema remove o cartão resolvido da lista e carrega a próxima nota.

**Fluxos alternativos:**
- *Revisão temática:* O usuário filtra a revisão para focar apenas em cartões contendo uma tag específica (ex: "física").

**Fluxos de exceção:**
- *Fila de revisão zerada:* Se o usuário já tiver revisado todas as notas agendadas do dia, o sistema exibe a mensagem de parabenização e a fila em branco.

**Pós-condições:** As novas datas de revisão espaçada são gravadas nas respectivas notas atômicas.

**Critérios de aceite:**
- [ ] O cálculo do novo intervalo de revisão deve seguir de forma correta as fórmulas do algoritmo SM-2.
- [ ] O processamento e avanço de cartões devem ser imediatos (< 100ms).

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Capturar conteúdo da web rapidamente (web clipper)

**ID:** UC-329  
**Requisito relacionado:** RF-328 (capturar conteúdo da web rapidamente)  
**Ator(es):** Usuário (Pesquisador/Escritor), Extensão do Navegador (Web Clipper), Sistema  
**Pré-condições:** O usuário instalou a extensão oficial da plataforma e está autenticado nela.  
**Gatilho:** O usuário clica no ícone da extensão ao ler uma página externa na internet.  

**Fluxo principal:**
1. O usuário lê um artigo de internet e clica no ícone da extensão "Web Clipper".
2. A extensão abre solicitando o tipo de captura (ex: Página Completa, Texto Selecionado, Apenas Link).
3. O usuário seleciona "Texto Selecionado" (após marcar um trecho do artigo).
4. O usuário seleciona o projeto de destino e as tags correspondentes na extensão.
5. O usuário clica em "Salvar".
6. A extensão envia os dados limpos via API rest para o servidor da plataforma.
7. O sistema cria uma nota temporária no Inbox contendo o texto, a URL da fonte e os metadados.

**Fluxos alternativos:**
- *Capturar Imagem:* O usuário clica com o botão direito sobre uma imagem na web, seleciona a opção da extensão de enviar para o projeto, e a imagem é gravada diretamente na galeria de mídias correspondente.

**Fluxos de exceção:**
- *Sessão expirada na extensão:* Se a extensão não se comunicar com o servidor por falta de login válido, o popover exibe o botão de autenticação direcionando o usuário para fazer login.

**Pós-condições:** A nota contendo o recorte de conteúdo web capturado é criada no inbox do projeto.

**Critérios de aceite:**
- [ ] O parser do Web Clipper deve limpar menus e scripts externos, capturando apenas o conteúdo legível de forma estruturada.
- [ ] A requisição de envio de dados do clipper para o servidor deve demorar menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Transformar notas soltas em nota permanente

**ID:** UC-330  
**Requisito relacionado:** RF-329 (transformar notas soltas em nota permanente)  
**Ator(es):** Usuário (Pesquisador/Escritor), Sistema  
**Pré-condições:** Notas soltas (anotações rápidas/capturas de clipper) presentes no Inbox do projeto.  
**Gatilho:** O usuário clica em "Converter em Nota Permanente" na visualização do rascunho.  

**Fluxo principal:**
1. O usuário acessa a pasta "Inbox / Rascunhos rápidos" do seu projeto.
2. O usuário abre a nota temporária de rascunho correspondente.
3. O usuário clica no botão "Transformar em Nota Permanente".
4. O sistema abre a janela de edição para a reescrita do conteúdo sob a perspectiva de nota de estudo madura.
5. O usuário edita a redação, vincula a uma categoria do projeto e cria links bidirecionais.
6. O usuário clica em "Salvar".
7. O sistema move o arquivo da pasta temporária para o diretório de notas permanente e altera seu status de controle no banco.

**Fluxos alternativos:**
- *Fusão de rascunhos:* O usuário seleciona múltiplos rascunhos rápidos no Inbox e clica em "Fundir em Nota Permanente", concatenando seus conteúdos em um novo arquivo unificado.

**Fluxos de exceção:**
- *Título obrigatório:* O sistema impede o salvamento caso o usuário não preencha um título novo para a nota permanente.

**Pós-condições:** O status de controle do documento é alterado para permanente e a nota é arquivada na árvore de diretórios oficial.

**Critérios de aceite:**
- [ ] A nota permanente resultante deve herdar as tags e backlinks dos rascunhos rápidos de origem.
- [ ] A conversão e movimentação de pastas na base de dados devem durar menos de 200ms.

---

## Tabela Resumo: Lote 33 (UC-321 a UC-330)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-321** | RF-320 (exportar conteúdo para LaTeX) | Média | Média |
| **UC-322** | RF-321 (registrar metodologia de pesquisa) | Média | Baixa |
| **UC-323** | RF-322 (gerenciar coautores e contribuições) | Alta | Média |
| **UC-324** | RF-323 (formatar texto em formatos variáveis) | Alta | Alta |
| **UC-325** | RF-324 (exportar em docx / criar notas atômicas) | Alta | Média |
| **UC-326** | RF-325 (linkar notas bidirecionalmente) | Alta | Média |
| **UC-327** | RF-326 (criar mapa de conhecimento pessoal) | Alta | Alta |
| **UC-328** | RF-327 (revisar notas periodicamente) | Média | Média |
| **UC-329** | RF-328 (capturar conteúdo web via clipper) | Média | Média |
| **UC-330** | RF-329 (transformar notas soltas em permanente) | Média | Baixa |
