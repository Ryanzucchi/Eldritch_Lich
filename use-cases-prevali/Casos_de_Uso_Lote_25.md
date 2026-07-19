# Casos de Uso - Lote 25 (UC-241 a UC-250)

Este documento contém a especificação dos casos de uso de 241 a 250 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Suporte a atalhos de teclado para leitores de tela

**ID:** UC-241  
**Requisito relacionado:** RF-241 (suporte a atalhos de teclado para leitores de tela)  
**Ator(es):** Usuário (Escritor com deficiência visual), Sistema  
**Pré-condições:** O leitor de tela está ativo e o usuário está com o aplicativo aberto.  
**Gatilho:** O usuário aciona atalhos de navegação de acessibilidade.  

**Fluxo principal:**
1. O usuário pressiona a combinação de teclas de acessibilidade (ex: `Alt+Ctrl+S` para ir ao sumário ou `Alt+Ctrl+E` para focar na escrita do editor).
2. O sistema intercepta o evento e move o foco de foco do HTML para a seção de destino correspondente.
3. O sistema atualiza os atributos ARIA na região focada para forçar o leitor de tela a anunciar a nova seção e as instruções locais.

**Fluxos alternativos:**
- *Listar atalhos por voz:* O usuário aciona o atalho `Alt+Ctrl+H` e o sistema abre um popup contendo o guia de atalhos e ativa leituras sequenciais automáticas.

**Fluxos de exceção:**
- *Colisão de atalho:* Se a combinação configurada colidir com atalhos nativos críticos do leitor de tela do usuário, o sistema permite o uso de teclas modificadoras secundárias.

**Pós-condições:** O foco de navegação da interface é movido e anunciado pelo leitor de tela.

**Critérios de aceite:**
- [ ] O sistema de foco de teclado deve seguir as regras de conformidade ARIA.
- [ ] A alteração do foco de teclado deve durar menos de 50ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Contraste ajustável (acessibilidade)

**ID:** UC-242  
**Requisito relacionado:** RF-242 (contraste ajustável)  
**Ator(es):** Usuário (Escritor com baixa visão), Sistema  
**Pré-condições:** A aplicação está aberta na tela.  
**Gatilho:** O usuário clica no seletor de "Ajuste de Contraste" no painel de acessibilidade.  

**Fluxo principal:**
1. O usuário clica no menu de acessibilidade no cabeçalho ou rodapé.
2. O sistema exibe opções de contraste: "Contraste Padrão", "Alto Contraste Escuro" (texto amarelo em fundo preto), "Alto Contraste Claro" (texto preto em fundo branco).
3. O usuário seleciona "Alto Contraste Escuro".
4. O sistema aplica uma classe CSS de alto contraste global no `<body>`, forçando a substituição de todas as cores de fundo para preto e de todos os textos para amarelo ou branco, removendo sombras e gradientes decorativos.
5. A interface passa a ser exibida nas cores de alta visibilidade selecionadas.

**Fluxos alternativos:**
- *Inversão de Cores:* O usuário ativa a chave "Inverter Cores" para aplicar um filtro CSS rápido de inversão global (`filter: invert(1)`) como recurso de acessibilidade.

**Fluxos de exceção:**
- *Imagens ilegíveis:* No modo de alto contraste, o sistema mantém as imagens originais intactas, mas adiciona bordas de alto relevo ao seu redor para separá-las claramente do fundo.

**Pós-condições:** As novas cores de alto contraste são aplicadas em toda a interface do usuário.

**Critérios de aceite:**
- [ ] O modo de alto contraste deve atender ou superar as métricas de contraste mínimo da especificação WCAG 2.1 nível AAA.
- [ ] A transição e repintura da tela devem ocorrer em menos de 100ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Aumentar/diminuir tamanho da fonte (acessibilidade)

**ID:** UC-243  
**Requisito relacionado:** RF-243 (aumentar/diminuir tamanho da fonte)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A interface da aplicação está ativa.  
**Gatilho:** O usuário clica nos botões "A+" ou "A-" no painel de acessibilidade ou usa os atalhos correspondentes.  

**Fluxo principal:**
1. O usuário abre as configurações visuais ou clica nos controles "A+" (Aumentar Fonte) e "A-" (Diminuir Fonte) na barra de ferramentas.
2. O usuário clica três vezes no botão "A+".
3. O sistema lê o fator de escala de fonte ativo e o incrementa em etapas (chegando a 130%).
4. O sistema altera o tamanho da fonte base na folha de estilos global do elemento HTML principal.
5. Toda a tipografia da interface se expande proporcionalmente mantendo a coerência do layout.

**Fluxos alternativos:**
- *Ajuste exclusivo do editor:* O usuário ajusta o tamanho da fonte apenas para a área de escrita do capítulo de texto, mantendo as barras de menus e arquivos na escala padrão.

**Fluxos de exceção:**
- *Layout quebrado:* Se o usuário aumentar o tamanho da fonte a níveis extremos, o sistema ativa barras de rolagem horizontais automáticas em painéis flexíveis para evitar que os textos fiquem ocultos de forma inacessível.

**Pós-condições:** A escala do tamanho das fontes da interface é atualizada.

**Critérios de aceite:**
- [ ] O sistema deve suportar redimensionamento de fonte de até 200% sem perda de funcionalidades.
- [ ] A re-renderização tipográfica da tela deve ser imediata (< 50ms).

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Alternar fonte do editor (serifada/sem serifa/mono)

**ID:** UC-244  
**Requisito relacionado:** RF-244 (alternar fonte do editor)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O editor de texto está aberto.  
**Gatilho:** O usuário escolhe a família de fontes no menu de visualização do editor.  

**Fluxo principal:**
1. O usuário abre as configurações visuais do editor de texto.
2. O sistema exibe as opções de famílias tipográficas homologadas: "Serifada", "Sem Serifa" e "Monoespaçada".
3. O usuário seleciona a opção "Monoespaçada".
4. O sistema atualiza a variável CSS de tipografia do editor de texto.
5. O texto do capítulo passa a ser renderizado na fonte selecionada.

**Fluxos alternativos:**
- *Instalar fontes locais:* O usuário digita o nome de uma fonte do sistema operacional instalada em seu computador no campo personalizado do menu para utilizá-la.

**Fluxos de exceção:**
- *Fonte indisponível:* Se a fonte local digitada pelo usuário não estiver instalada, o sistema reverte para o fallback padrão do grupo selecionado.

**Pós-condições:** A família tipográfica do editor é atualizada conforme a seleção do usuário.

**Critérios de aceite:**
- [ ] A alteração tipográfica deve afetar apenas a visualização de digitação no editor, sem alterar a formatação do arquivo gravada no banco ou na exportação.
- [ ] O tempo de transição tipográfica na tela deve ser menor que 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Habilitar modo tela cheia no modo leitura

**ID:** UC-245  
**Requisito relacionado:** RF-245 (habilitar modo tela cheia no modo leitura)  
**Ator(es):** Usuário (Leitor/Escritor)  
**Pré-condições:** O texto do capítulo está carregado no Modo Leitura.  
**Gatilho:** O usuário clica no botão "Tela Cheia do Modo Leitura" ou pressiona a tecla F11.  

**Fluxo principal:**
1. O usuário visualiza o texto no Modo Leitura.
2. O usuário clica no ícone de "Maximizar" no cabeçalho ou barra flutuante de leitura.
3. O sistema aciona o modo de tela cheia do navegador (via Fullscreen API) para o painel de leitura.
4. A página do livro expande-se ocupando 100% da tela física, ocultando abas do navegador e barras de tarefas.
5. O usuário realiza a leitura sem interrupções visuais externas.

**Fluxos alternativos:**
- *Paginação por teclado:* No modo leitura em tela cheia, o usuário utiliza as setas esquerda e direita do teclado para passar as páginas de texto lateralmente, simulando a leitura física.

**Fluxos de exceção:**
- *Bloqueio de tela cheia:* Em dispositivos móveis onde o navegador impede a tela cheia automática, o sistema maximiza os elementos visuais internos cobrindo a totalidade da janela visível (viewport).

**Pós-condições:** O Modo Leitura é apresentado em tela cheia no monitor do usuário.

**Critérios de aceite:**
- [ ] Pressionar 'Esc' deve fechar o modo de tela cheia imediatamente, retornando à visualização de leitura normal.
- [ ] A transição e paginação lateral devem rodar de forma fluida.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Visualizar sumário interativo do texto (tabela de conteúdos)

**ID:** UC-246  
**Requisito relacionado:** RF-246 (visualizar sumário interativo do texto)  
**Ator(es):** Usuário (Escritor/Leitor), Sistema  
**Pré-condições:** O texto do documento possui subtítulos estruturados com formatações de títulos (H1, H2, H3) no editor.  
**Gatilho:** O usuário clica no botão "Sumário / Outline" no editor ou painel lateral.  

**Fluxo principal:**
1. O usuário abre o painel lateral do sumário interativo do documento.
2. O sistema varre o corpo do texto ativo localizando tags de cabeçalho.
3. O sistema monta uma lista hierárquica e recuada baseada no nível dos títulos.
4. O usuário clica sobre o item correspondente ao subtítulo desejado no sumário.
5. O sistema faz a rolagem vertical do editor de texto principal, posicionando o subtítulo selecionado no topo da visualização.

**Fluxos alternativos:**
- *Sumário do projeto:* O usuário abre a aba "Sumário do Livro" na barra lateral e visualiza toda a sequência de títulos de capítulos e seções organizadas de forma consolidada.

**Fluxos de exceção:**
- *Texto sem cabeçalhos:* Se o documento for corrido e não contiver nenhum título, o painel do sumário exibe "Sumário vazio. Adicione cabeçalhos ao texto".

**Pós-condições:** A lista estruturada de títulos do documento é exibida com rolagem rápida funcional.

**Critérios de aceite:**
- [ ] A seleção do item do sumário deve mover o cursor do editor de texto diretamente para o início do cabeçalho correspondente.
- [ ] A varredura de cabeçalhos e montagem do sumário de um arquivo de 10.000 palavras devem durar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Gerar sumário automaticamente a partir de títulos

**ID:** UC-247  
**Requisito relacionado:** RF-247 (gerar sumário automaticamente a partir de títulos)  
**Ator(es):** Sistema  
**Pré-condições:** O usuário edita o texto e insere ou remove cabeçalhos.  
**Gatilho:** Inatividade pós-digitação (debounce de 2 segundos) no editor de texto.  

**Fluxo principal:**
1. O usuário digita no editor e insere um cabeçalho formatando-o como Título.
2. O sistema detecta a alteração no esquema do documento.
3. Em background, o listener do editor atualiza a árvore lógica de cabeçalhos.
4. O sistema regenera o sumário lateral de forma automática, adicionando o novo item na listagem sem necessidade de checagem manual.

**Fluxos alternativos:**
- *Remoção automática:* O usuário apaga o cabeçalho do editor. O sistema detecta a deleção e remove o respectivo item do sumário lateral instantaneamente.

**Fluxos de exceção:**
- *Títulos duplicados:* Se houver dois títulos idênticos no mesmo texto, o sistema os exibe separadamente no sumário indexando-os com suas respectivas coordenadas físicas distintas.

**Pós-condições:** O sumário é atualizado dinamicamente refletindo a estrutura de títulos no texto.

**Critérios de aceite:**
- [ ] O processamento em background da árvore de cabeçalhos não deve causar lentidão ou lag de digitação no editor.
- [ ] A atualização do sumário na tela ao digitar deve demorar menos de 100ms após o período de debounce.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Reorganizar capítulos arrastando no sumário

**ID:** UC-248  
**Requisito relacionado:** RF-248 (reorganizar capítulos arrastando no sumário)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O sumário do livro contendo os capítulos e partes organizados está aberto.  
**Gatilho:** O usuário arrasta um item de capítulo para outra posição na lista do sumário consolidado.  

**Fluxo principal:**
1. O usuário visualiza o Sumário do Livro.
2. O usuário clica e segura o capítulo correspondente na lista do sumário lateral.
3. O usuário arrasta o item para cima ou para baixo, soltando-o na posição desejada.
4. O sistema reposiciona o arquivo para a nova posição no banco de dados e altera a ordenação física das pastas no diretório.
5. A árvore lateral de arquivos é atualizada instantaneamente refletindo a nova sequência.

**Fluxos alternativos:**
- *Arrastar títulos internos:* O usuário arrasta um subtítulo dentro do sumário de um único documento. O sistema move a totalidade do bloco de texto pertencente ao cabeçalho original para a nova posição correspondente dentro do arquivo.

**Fluxos de exceção:**
- *Soltura inválida:* Se o usuário soltar o item fora do container da lista, o sistema cancela a operação e retorna o item à posição original de ordenação de forma segura.

**Pós-condições:** A ordem física dos capítulos do livro é atualizada na base de dados e na interface lateral.

**Critérios de aceite:**
- [ ] O arrasto de capítulos no sumário deve possuir animação visual fluida do tipo Drag-and-Drop.
- [ ] A atualização de ordenação no banco de dados após a soltura do item deve durar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Buscar no sumário interativo

**ID:** UC-249  
**Requisito relacionado:** RF-249 (buscar no sumário interativo)  
**Ator(es):** Usuário (Escritor/Leitor), Sistema  
**Pré-condições:** O sumário interativo de conteúdos está aberto.  
**Gatilho:** O usuário digita uma palavra na barra de buscas do sumário.  

**Fluxo principal:**
1. O usuário abre o sumário do livro e clica na barra de busca do sumário.
2. O usuário digita o termo de busca.
3. O sistema analisa os cabeçalhos listados e oculta da lista todos os títulos que não contenham o termo de busca correspondente.
4. O usuário visualiza apenas os capítulos ou subtítulos que contêm a palavra buscada.
5. O usuário clica no item e o editor rola até a cena correspondente.

**Fluxos alternativos:**
- *Limpar busca:* O usuário clica no "X" da barra de busca do sumário, restaurando de imediato a listagem completa.

**Fluxos de exceção:**
- *Nenhum cabeçalho localizado:* Se nenhum título corresponder ao termo digitado, a listagem exibe "Nenhum título encontrado".

**Pós-condições:** Os títulos filtrados de acordo com a pesquisa são exibidos no painel do sumário.

**Critérios de aceite:**
- [ ] O filtro de busca do sumário deve processar em tempo real de forma instantânea (< 50ms).
- [ ] A busca deve ser insensível a maiúsculas, minúsculas e acentuações.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Criar sumário personalizado

**ID:** UC-250  
**Requisito relacionado:** RF-250 (criar sumário personalizado)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Capítulos e documentos de texto cadastrados no projeto.  
**Gatilho:** O usuário seleciona "Novo Sumário Personalizado" nas opções da aba de sumários.  

**Fluxo principal:**
1. O usuário acessa a seção de sumários e clica em "Criar Sumário Personalizado".
2. O sistema abre um painel de montagem em branco.
3. O usuário seleciona quais capítulos e em qual sequência deseja incluir no sumário personalizado.
4. O usuário clica em "Salvar Sumário".
5. O sistema grava o sumário personalizado e sua ordem de itens no banco de dados.
6. O usuário passa a ter acesso a este sumário customizado para navegação rápida.

**Fluxos alternativos:**
- *Exportar sumário personalizado:* O usuário escolhe exportar o manuscrito baseado no sumário personalizado configurado.

**Fluxos de exceção:**
- *Arquivo excluído:* Se um capítulo pertencente ao sumário personalizado for apagado do projeto, o sumário mantém sua ordenação, exibindo um rótulo indicando arquivo inexistente para o respectivo item.

**Pós-condições:** O sumário com configuração personalizada é gravado e disponibilizado para visualização e exportação.

**Critérios de aceite:**
- [ ] A interface do criador de sumário customizado deve permitir selecionar arquivos clicando em caixas de seleção de forma simples.
- [ ] A gravação do sumário customizado no banco deve demorar menos de 500ms.

---

## Tabela Resumo: Lote 25 (UC-241 a UC-250)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-241** | RF-241 (atalhos de teclado para leitores...) | Alta | Média |
| **UC-242** | RF-242 (contraste ajustável acessibilidade) | Alta | Baixa |
| **UC-243** | RF-243 (aumentar/diminuir tamanho da fonte) | Alta | Baixa |
| **UC-244** | RF-244 (alternar fonte do editor) | Média | Baixa |
| **UC-245** | RF-245 (modo tela cheia no modo leitura) | Média | Baixa |
| **UC-246** | RF-246 (visualizar sumário interativo) | Alta | Média |
| **UC-247** | RF-247 (gerar sumário automaticamente) | Alta | Baixa |
| **UC-248** | RF-248 (reorganizar capítulos arrastando) | Alta | Alta |
| **UC-249** | RF-249 (buscar no sumário interativo) | Média | Baixa |
| **UC-250** | RF-250 (criar sumário personalizado) | Média | Média |
