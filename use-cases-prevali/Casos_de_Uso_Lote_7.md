# Casos de Uso - Lote 7 (UC-061 a UC-070)

Este documento contém a especificação dos casos de uso de 61 a 70 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Listar todas atividades feitas automaticamente pelo sistema

**ID:** UC-061  
**Requisito relacionado:** RF-61 (listar todas atividades feitas automaticamente pelo sistema)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O sistema realizou ações automáticas (como salvamentos, backups, sugestões de IA, extrações ou detecções) no projeto.  
**Gatilho:** O usuário abre a aba "Atividades Automáticas" ou "Log de IA/Sistema".  

**Fluxo principal:**
1. O usuário acessa a seção de configurações do projeto e clica em "Histórico de Atividades Automáticas".
2. O sistema recupera a lista de eventos gravados na tabela de logs de automação do banco de dados do projeto.
3. A interface apresenta uma tabela cronológica contendo: Data/Hora, Ação Realizada, Descrição Breve e Status do processo.
4. O usuário pode filtrar o histórico por tipo de atividade ou data.

**Fluxos alternativos:**
- *Desfazer ação automática:* Se a atividade for uma ação de escrita/organização automática da IA, o usuário pode clicar em "Desfazer" diretamente na linha do log correspondente.

**Fluxos de exceção:**
- *Sem atividades registradas:* Se for um projeto novo sem ações do sistema, o log exibe "Nenhuma atividade automática registrada".

**Pós-condições:** O usuário visualiza o relatório de todas as automações executadas em segundo plano.

**Critérios de aceite:**
- [ ] O histórico deve armazenar logs de pelo menos os últimos 30 dias de atividades do sistema.
- [ ] A listagem deve carregar de forma paginada para otimização de memória.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Poder desenhar entre o texto

**ID:** UC-062  
**Requisito relacionado:** RF-62 (poder desenhar entre o texto)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está editando um texto e possui um dispositivo de entrada compatível (mouse, trackpad ou caneta digital).  
**Gatilho:** O usuário clica na ferramenta "Desenho Livre" na barra de formatação do editor.  

**Fluxo principal:**
1. O usuário clica no ícone de "Desenhar entre o texto" no editor.
2. O sistema insere um canvas transparente inline entre os parágrafos atuais do texto, abrindo uma barra de ferramentas de desenho (lápis, borracha, espessura e cores).
3. O usuário desenha livremente sobre a área do canvas.
4. O usuário clica em "Concluir Desenho".
5. O sistema desativa as ferramentas de desenho, rasteriza o traço vetorial e salva a imagem gerada associada àquela posição do editor.

**Fluxos alternativos:**
- *Edição de desenho existente:* O usuário dá um duplo clique sobre o desenho inline para reabrir as ferramentas de edição vetorial e alterar os traços.

**Fluxos de exceção:**
- *Redimensionamento de tela:* O desenho é salvo em formato vetorial SVG responsivo para se adaptar corretamente a diferentes larguras de tela do editor sem truncar.

**Pós-condições:** O desenho é incorporado e persistido de forma inline no documento de texto.

**Critérios de aceite:**
- [ ] A inserção e uso do canvas de desenho não devem afetar a rolagem ou a performance de digitação do editor de texto.
- [ ] O desenho deve ser renderizado e salvo de forma vetorial (SVG) para evitar perda de resolução.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Ter opções de fonte

**ID:** UC-063  
**Requisito relacionado:** RF-63 (ter opções de fonte)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O editor de texto está aberto.  
**Gatilho:** O usuário seleciona um trecho de texto e clica no seletor de fontes na barra de ferramentas.  

**Fluxo principal:**
1. O usuário seleciona um trecho ou coloca o cursor em um parágrafo.
2. O usuário abre o seletor drop-down de fontes (exibe fontes como Times New Roman, Arial, Courier Prime, Atkinson Hyperlegible).
3. O usuário seleciona a fonte desejada.
4. O sistema aplica a estilização CSS no editor e atualiza o esquema estruturado do documento com o tipo da fonte no respectivo bloco.

**Fluxos alternativos:**
- *Mudar fonte padrão do projeto:* O usuário muda a fonte padrão nas configurações do editor, fazendo com que todo o texto do projeto que não possua estilização manual mude para a nova fonte.

**Fluxos de exceção:**
- *Fonte externa indisponível:* Se uma fonte carregada via web falhar ao baixar devido a problemas de rede, o editor reverte para uma fonte fallback segura correspondente (serif/sans-serif).

**Pós-condições:** O texto do editor é renderizado com a fonte selecionada.

**Critérios de aceite:**
- [ ] O seletor de fontes deve incluir fontes otimizadas para leitura (ex: Atkinson Hyperlegible) e escrita literária padrão.
- [ ] A alteração de fonte deve ser renderizada em menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Exportar como zip com todas pastas textos e conexões

**ID:** UC-064  
**Requisito relacionado:** RF-64 (exportar como zip com todas pastas textos e conexões)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui pastas, textos e dados de conexão de entidades cadastrados.  
**Gatilho:** O usuário seleciona a opção "Exportar Projeto Consolidado (.zip)" no menu do sistema.  

**Fluxo principal:**
1. O usuário clica em "Exportar como ZIP".
2. O sistema inicia o empacotamento em segundo plano.
3. O backend recria a árvore física de diretórios (pastas e subpastas) do usuário.
4. O sistema grava cada documento de texto no formato selecionado (.md ou .txt) dentro de sua pasta correspondente.
5. O sistema gera um arquivo JSON de configuração (ex: `conexoes.json`) contendo todas as arestas de conexões de entidades, metadados e linha do tempo.
6. O sistema compacta todos os arquivos em um arquivo ZIP.
7. O navegador do usuário inicia o download automático do arquivo `[nome_do_projeto]_export.zip`.

**Fluxos alternativos:**
- *Exportar anexos:* O usuário opta por incluir ou não imagens anexadas aos textos e capas no pacote ZIP.

**Fluxos de exceção:**
- *Estouro de memória no servidor:* Em projetos massivos com muitas imagens, se o servidor falhar ao compactar, o sistema cancela a tarefa e exibe "Erro ao exportar. Tente realizar a exportação sem os arquivos de mídia".

**Pós-condições:** O arquivo compactado com a estrutura completa e dados de conexão é baixado na máquina do usuário.

**Critérios de aceite:**
- [ ] A estrutura de pastas no arquivo ZIP baixado deve replicar exatamente a hierarquia de pastas da árvore lateral do projeto.
- [ ] O arquivo `conexoes.json` incluído deve manter a consistência com IDs mapeados nos arquivos do projeto.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Colar imagens em textos

**ID:** UC-065  
**Requisito relacionado:** RF-65 (colar imagens em textos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O editor de texto está focado e o usuário tem uma imagem em sua área de transferência (Clipboard).  
**Gatilho:** O usuário pressiona o atalho Ctrl+V (ou Cmd+V) com o editor focado.  

**Fluxo principal:**
1. O usuário pressiona Ctrl+V no editor de texto tendo uma imagem no clipboard.
2. O sistema intercepta o evento de colagem (Clipboard API) e extrai o arquivo binário da imagem.
3. O sistema envia a imagem de forma assíncrona para o servidor de armazenamento de mídia (S3/Cloud Storage) e exibe um indicador de progresso ("Carregando imagem...") no editor.
4. O servidor salva a imagem, gera um link permanente e retorna para a interface.
5. O editor substitui o indicador de upload pela tag de imagem (`<img>`) renderizando-a inline no parágrafo de destino.

**Fluxos alternativos:**
- *Inserir imagem offline:* Se o usuário estiver offline, a imagem é codificada em Base64 e salva temporariamente no banco IndexedDB local até a sincronização.

**Fluxos de exceção:**
- *Tamanho da imagem excedido:* Se a imagem for maior que o limite permitido (ex: 8MB), o sistema cancela o envio e exibe: "Erro: A imagem excede o tamanho máximo de 8MB".

**Pós-condições:** A imagem é exibida no editor de texto e armazenada no servidor de mídia.

**Critérios de aceite:**
- [ ] O sistema deve aceitar arquivos nos formatos comuns: `.png`, `.jpg`, `.jpeg`, `.webp` e `.gif`.
- [ ] O upload da imagem colada deve ser assíncrono, sem congelar a tela do usuário.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Desenhar a capa das pastas

**ID:** UC-066  
**Requisito relacionado:** RF-66 (desenhar a capa das pastas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui pastas no projeto e acessa as propriedades de uma pasta.  
**Gatilho:** O usuário seleciona "Editar Capa da Pasta" -> "Desenhar Capa".  

**Fluxo principal:**
1. O usuário abre o painel de edição visual da pasta.
2. O usuário clica na área da capa e seleciona a opção "Desenhar".
3. O sistema abre um canvas/editor de ilustrações simples (ferramentas de pintura, formas geométricas, texto e cores).
4. O usuário cria o desenho da capa e clica em "Salvar Capa".
5. O sistema rasteriza e otimiza a imagem em formato comprimido (.webp) e associa como imagem de capa (`capa_url`) da pasta.
6. A árvore lateral ou a visualização em grade exibe o desenho criado como capa da pasta.

**Fluxos alternativos:**
- *Desenhar sobre template:* O usuário escolhe um template de fundo fornecido pelo sistema e desenhar elementos adicionais por cima dele.

**Fluxos de exceção:**
- *Falha ao persistir a capa:* Se houver erro de upload no bucket de mídia, o sistema reverte para o estado da capa anterior e exibe um erro amigável.

**Pós-condições:** A capa da pasta é atualizada com o desenho rasterizado.

**Critérios de aceite:**
- [ ] A ferramenta de desenho deve oferecer pelo menos pincel, linhas, retângulos, círculos e balde de tinta.
- [ ] O arquivo final salvo no servidor deve ser comprimido de forma a não exceder 500KB.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Colocar imagens como capa de pastas

**ID:** UC-067  
**Requisito relacionado:** RF-67 (colocar imagens como capa de pastas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Uma pasta existe e o usuário possui um arquivo de imagem local.  
**Gatilho:** O usuário escolhe "Definir Capa da Pasta" -> "Upload de Imagem".  

**Fluxo principal:**
1. O usuário clica com o botão direito na pasta e seleciona "Definir Imagem de Capa".
2. O sistema abre o diálogo de seleção de arquivo local.
3. O usuário seleciona o arquivo de imagem (.png, .jpg) e confirma.
4. O sistema executa o upload do arquivo para o servidor de arquivos, gerando versões em miniatura (thumbnail) e resolução padrão.
5. O sistema vincula o endereço da imagem ao atributo de capa da pasta no banco de dados.
6. A miniatura da imagem passa a ser exibida como ícone ou plano de fundo da pasta na interface de exibição.

**Fluxos alternativos:**
- *Arrastar imagem:* O usuário arrasta uma imagem de seu computador e a solta diretamente em cima do ícone da pasta na interface.

**Fluxos de exceção:**
- *Upload rejeitado:* Se o arquivo for corrompido ou de formato não suportado, o sistema cancela a operação e alerta o usuário.

**Pós-condições:** A pasta passa a usar a imagem enviada como sua representação visual de capa.

**Critérios de aceite:**
- [ ] O sistema deve redimensionar e cortar automaticamente a imagem enviada para proporções quadradas (1:1) ou de capa (3:4) recomendadas.
- [ ] A renderização da miniatura na árvore de arquivos deve levar menos de 200ms após o carregamento inicial.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Colocar imagens como capa de textos

**ID:** UC-068  
**Requisito relacionado:** RF-68 (colocar imagens como capa de textos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Um texto existe e o usuário possui uma imagem local.  
**Gatilho:** O usuário seleciona "Definir Capa do Documento" no editor do texto ou painel lateral de metadados.  

**Fluxo principal:**
1. O usuário abre o texto no editor e clica em "Adicionar Capa".
2. O sistema abre o diálogo do sistema operacional para carregar a imagem.
3. O usuário seleciona a imagem e confirma.
4. O sistema realiza o upload do arquivo para o bucket de armazenamento e associa o link gerado à propriedade `capa_url` do documento.
5. O topo do editor de texto passa a exibir a imagem de capa em formato banner estilizado.

**Fluxos alternativos:**
- *Remover capa:* O usuário clica no botão "Remover Capa" no topo do banner para desassociar a imagem.

**Fluxos de exceção:**
- *Erro de upload:* Caso ocorra perda de conexão no upload, o sistema mantém o estado anterior do documento e exibe o alerta "Falha no envio da imagem de capa".

**Pós-condições:** O texto tem uma imagem associada como capa e exibida no cabeçalho do editor.

**Critérios de aceite:**
- [ ] O banner de capa no editor de texto deve ser responsivo e redimensionar dinamicamente sem distorcer a imagem (object-fit).
- [ ] O tamanho do upload da imagem deve ser limitado a 5MB.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Colocar imagens e texto como capa de pastas e texto

**ID:** UC-069  
**Requisito relacionado:** RF-69 (colocar imagens e texto como capa de pastas e texto)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Pastas ou textos criados no projeto.  
**Gatilho:** O usuário acessa a opção de personalização visual avançada da capa da pasta ou texto.  

**Fluxo principal:**
1. O usuário abre o editor de capa avançado para um arquivo ou pasta.
2. O sistema apresenta opções para: Fazer upload de uma imagem de fundo, escolher a cor de overlay, digitar um texto de título customizado e selecionar a tipografia.
3. O usuário insere a imagem de fundo, digita o texto sobreposto e formata a tipografia.
4. O sistema compõe e renderiza a visualização em tempo real.
5. O usuário confirma o salvamento.
6. O sistema processa a composição em um único arquivo de imagem comprimido (ou salva os dados de estilo para renderização dinâmica) e o define como a capa definitiva.

**Fluxos alternativos:**
- *Posicionamento de texto:* O usuário arrasta o bloco de texto sobre a imagem de capa para escolher a melhor posição (esquerda, centro, direita, etc.).

**Fluxos de exceção:**
- *Imagem falha ao carregar:* O sistema utiliza uma cor sólida de fundo padrão e exibe apenas o texto formatado para não quebrar a exibição do card.

**Pós-condições:** A capa customizada com imagem e texto sobreposto é gerada e associada ao item correspondente.

**Critérios de aceite:**
- [ ] A sobreposição de texto deve garantir legibilidade automática aplicando sombras ou filtros de escurecimento (backdrop overlay) na imagem de fundo.
- [ ] A composição gerada deve ser consistente em todas as telas de visualização.

**Prioridade:** Baixa  
**Complexidade estimada:** Média  

---
### Caso de Uso: Simular impacto de alterações no universo

**ID:** UC-070  
**Requisito relacionado:** RF-70 (simular impacto de alterações no universo)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui entidades, relacionamentos e textos mapeados em um grafo de conhecimento complexo.  
**Gatilho:** O usuário propõe uma alteração de entidade ou evento em uma ferramenta de simulação ("Sandbox de Causalidade").  

**Fluxo principal:**
1. O usuário acessa a aba "Simular Alteração".
2. O usuário propõe uma mudança hipotética (ex: "Se o Personagem John morrer na Batalha do Moinho, em vez de sobreviver").
3. O sistema mapeia todas as dependências diretas e indiretas de John no grafo (textos, eventos futuros, filhos, locais que governa).
4. A IA analisa os impactos causais da alteração no fluxo da história de forma lógica.
5. O sistema exibe um relatório estruturado de efeitos em cadeia (ex: "A Batalha do Forte será afetada porque John não estará lá para comandar", "O herdeiro James deixará de existir").
6. O usuário visualiza o mapa de impactos com nós e conexões piscando em vermelho na tela.

**Fluxos alternativos:**
- *Simulação de atributos:* O usuário altera o alinhamento de um reino ("neutro" para "guerra") e a IA estima o impacto de hostilidade em todos os locais e personagens pertencentes ao reino.

**Fluxos de exceção:**
- *Grafo sem conexões suficientes:* Se o projeto possuir pouca interconexão mapeada, a simulação retorna "Conexões insuficientes para traçar impactos lógicos no universo".

**Pós-condições:** O relatório detalhado de causa-efeito hipotético é apresentado ao usuário em tela de diagnóstico.

**Critérios de aceite:**
- [ ] O sistema deve rastrear dependências de até 4 graus de separação lógica no grafo de causalidade.
- [ ] A simulação deve ser executada em um ambiente sandbox, sem alterar nenhum dado real do projeto, a menos que o usuário solicite explicitamente "Promover alterações".

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---

## Tabela Resumo: Lote 7 (UC-061 a UC-070)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-061** | RF-61 (listar todas atividades feitas...) | Média | Baixa |
| **UC-062** | RF-62 (poder desenhar entre o texto) | Baixa | Alta |
| **UC-063** | RF-63 (ter opções de fonte) | Média | Baixa |
| **UC-064** | RF-64 (exportar como zip...) | Alta | Média |
| **UC-065** | RF-65 (colar imagens em textos) | Alta | Média |
| **UC-066** | RF-66 (desenhar a capa das pastas) | Baixa | Alta |
| **UC-067** | RF-67 (colocar imagens como capa de pastas) | Média | Média |
| **UC-068** | RF-68 (colocar imagens como capa de textos) | Média | Baixa |
| **UC-069** | RF-69 (colocar imagens e texto como capa...) | Baixa | Média |
| **UC-070** | RF-70 (simular impacto de alterações...) | Média | Alta |
