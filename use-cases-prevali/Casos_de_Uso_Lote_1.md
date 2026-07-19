# Casos de Uso - Lote 1 (UC-001 a UC-010)

Este documento contém a especificação dos casos de uso de 1 a 10 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Escrever textos

**ID:** UC-001  
**Requisito relacionado:** RF-1 (escrever textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O usuário está autenticado e possui um projeto aberto.  
**Gatilho:** O usuário clica no botão "Criar Novo Texto" ou "Novo Capítulo".  

**Fluxo principal:**
1. O usuário clica na opção "Criar Novo Texto" no painel de navegação lateral ou menu do projeto.
2. O sistema inicializa um novo documento vazio no banco de dados e abre a interface do editor de texto focada nesse novo documento.
3. O usuário digita o conteúdo desejado no editor.
4. O editor exibe o texto digitado em tempo real com formatação visual básica.
5. O usuário insere um título para o texto (opcional).

**Fluxos alternativos:**
- *Edição de título vazio:* Se o usuário não fornecer um título, o sistema atribui o título provisório "Sem título" automaticamente ao salvar ou fechar o arquivo.

**Fluxos de exceção:**
- *Perda inesperada de conexão:* O sistema exibe um alerta sutil de rede e redireciona o salvamento para o cache local do navegador (IndexedDB) para posterior sincronização em nuvem.

**Pós-condições:** O novo texto é criado e armazenado no estado local/banco de dados com o ID associado ao projeto.

**Critérios de aceite:**
- [ ] O editor deve renderizar a entrada de texto do teclado com latência inferior a 50ms.
- [ ] O sistema deve aceitar caracteres Unicode (UTF-8), incluindo acentuações da língua portuguesa e emojis.
- [ ] O documento recém-criado deve conter pelo menos os campos: `id`, `titulo`, `conteudo`, `data_criacao` e `data_atualizacao`.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Editar textos

**ID:** UC-002  
**Requisito relacionado:** RF-2 (editar textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto a ser editado já existe no projeto aberto e o usuário possui permissão de escrita.  
**Gatilho:** O usuário clica em um texto existente no painel lateral de navegação ou busca por ele.  

**Fluxo principal:**
1. O usuário seleciona o texto desejado na árvore de arquivos lateral.
2. O sistema carrega o conteúdo atual do texto e o renderiza no editor de texto.
3. O usuário posiciona o cursor no editor e realiza alterações (inserção, deleção ou modificação de texto).
4. O sistema atualiza o conteúdo em tempo real na interface do usuário.

**Fluxos alternativos:**
- *Visualização sem permissão de escrita:* Se o usuário tiver papel de apenas "Leitor", o sistema desabilita o cursor e a entrada de texto no editor, exibindo apenas o modo leitura.

**Fluxos de exceção:**
- *Documento bloqueado:* Se o documento estiver sendo editado de forma exclusiva por outro usuário (com bloqueio ativo), o sistema exibe um banner informativo de "Documento em edição por [Usuário]" e bloqueia a escrita, abrindo-o apenas para leitura.

**Pós-condições:** O texto editado reflete as modificações realizadas na interface do usuário.

**Critérios de aceite:**
- [ ] Ao clicar no texto, a interface do editor deve carregar o conteúdo em menos de 1 segundo para arquivos de até 100 mil palavras.
- [ ] O usuário deve ser capaz de selecionar, copiar, cortar e colar trechos de texto usando atalhos de teclado padrão (Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A).
- [ ] O histórico local de edição deve suportar desfazer (Undo) pelo menos as últimas 50 ações da sessão atual.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Salvar textos

**ID:** UC-003  
**Requisito relacionado:** RF-3 (salvar textos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário realizou alterações em um documento aberto no editor.  
**Gatilho:** O usuário clica no botão "Salvar" ou pressiona o atalho Ctrl+S (ou Cmd+S no macOS).  

**Fluxo principal:**
1. O usuário pressiona o atalho Ctrl+S ou clica no ícone de salvar (disquete) na barra de ferramentas.
2. O sistema envia a requisição de atualização de dados para a API do backend com o novo conteúdo.
3. O backend valida a requisição, atualiza o registro no banco de dados e registra a timestamp de `data_atualizacao`.
4. O backend retorna um status de sucesso (HTTP 200) à interface.
5. A interface exibe brevemente uma notificação ou indicador visual discreto: "Texto salvo".

**Fluxos alternativos:**
- *Interface offline:* Se o sistema detectar ausência de conexão com a internet, salva o arquivo localmente no IndexedDB e atualiza o estado para "Salvo localmente (offline)".

**Fluxos de exceção:**
- *Falha de gravação no banco de dados:* O sistema exibe o erro "Erro ao salvar no servidor. Tente novamente." e mantém o editor em estado "Não salvo", preservando o conteúdo na tela.

**Pós-condições:** O conteúdo update é persistido com sucesso no banco de dados centralizado ou no armazenamento local.

**Critérios de aceite:**
- [ ] O salvamento manual no backend deve ser processado em até 1 segundo sob condições normais de rede (latência < 100ms).
- [ ] O indicador visual de modificação (ex: ponto sutil de alteração pendente) deve sumir imediatamente após a confirmação.
- [ ] O payload de salvamento deve ser enviado em formato JSON estruturado contendo o ID do texto, título, conteúdo e versão atual.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Salvar automaticamente

**ID:** UC-004  
**Requisito relacionado:** RF-4 (salvar automaticamente)  
**Ator(es):** Sistema  
**Pré-condições:** O usuário está editando um texto e o salvamento automático está ativo.  
**Gatilho:** Inatividade detectada no teclado (debounce de 2 segundos) ou intervalo fixo de 30 segundos após modificações.  

**Fluxo principal:**
1. O usuário edita o texto no editor e para de digitar.
2. O sistema detecta a inatividade de 2 segundos (debounce timer expira) e inicia o processo de auto-salvamento.
3. O sistema envia os dados alterados assincronamente à API do servidor.
4. O servidor valida, persiste as alterações e retorna a resposta de sucesso.
5. A interface atualiza discretamente a legenda no rodapé: "Salvo automaticamente às HH:MM".

**Fluxos alternativos:**
- *Conexão instável durante auto-save:* O sistema tenta enviar ao servidor. Se falhar ou demorar mais de 3segundos, redireciona o salvamento para o cache persistente (IndexedDB) e atualiza o rodapé para "Salvo localmente".

**Fluxos de exceção:**
- *Conflito de versão no servidor:* Se o servidor rejeitar a atualização porque a versão do servidor é mais nova (edição concorrente por outro usuário), o sistema suspende o auto-save automático e inicia o fluxo de resolução de conflito colaborativo.

**Pós-condições:** As alterações mais recentes no texto são persistidas de forma transparente no backend ou no armazenamento local temporário.

**Critérios de aceite:**
- [ ] O salvamento automático deve rodar de forma assíncrona, não interferindo na digitação ou na fluidez da interface.
- [ ] O debounce de digitação deve reiniciar a cada nova tecla pressionada para evitar chamadas excessivas ao servidor.
- [ ] Deve exibir um status sutil de salvamento no rodapé do editor (ex: "Salvando...", "Salvo automaticamente às Xh").

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Excluir textos

**ID:** UC-005  
**Requisito relacionado:** RF-5 (excluir textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto a ser excluído existe no projeto e o usuário tem permissões para editá-lo.  
**Gatilho:** O usuário clica com o botão direito no texto na barra lateral e seleciona "Excluir", ou usa o botão "Excluir" no menu do documento.  

**Fluxo principal:**
1. O usuário seleciona a opção "Excluir" correspondente a um texto do projeto.
2. O sistema apresenta um modal de confirmação: "Deseja mover '[Título]' para a Lixeira?".
3. O usuário clica em "Mover para Lixeira".
4. O sistema altera o status do texto no banco de dados para `deletado = true` e preenche a timestamp `deletado_em`.
5. O texto é ocultado da lista principal da árvore de arquivos.
6. Uma mensagem curta é exibida confirmando a operação.

**Fluxos alternativos:**
- *Cancelamento:* Se o usuário clicar em "Cancelar" ou fechar o modal, a ação é abortada e nenhuma alteração é feita.

**Fluxos de exceção:**
- *Erro de permissão:* Se o usuário tiver permissão de apenas "Leitor", o botão "Excluir" é exibido desabilitado (ou oculto). Qualquer chamada direta ao endpoint de exclusão retorna HTTP 403 Forbidden.

**Pós-condições:** O texto é marcado como deletado logicamente no banco de dados e movido para a pasta virtual da Lixeira do projeto.

**Critérios de aceite:**
- [ ] O sistema não deve excluir fisicamente o texto imediatamente; ele deve passar por uma lixeira (soft-delete).
- [ ] O modal de confirmação deve exibir claramente o título do arquivo que será excluído.
- [ ] O arquivo excluído deve sumir da listagem e navegação principal do projeto imediatamente.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Duplicar textos

**ID:** UC-006  
**Requisito relacionado:** RF-6 (duplicar textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto de origem existe no projeto e o usuário tem permissão de escrita.  
**Gatilho:** O usuário seleciona a opção "Duplicar" no menu de opções do texto.  

**Fluxo principal:**
1. O usuário clica com o botão direito em um texto na árvore lateral ou abre as opções do documento aberto e escolhe "Duplicar".
2. O sistema lê o título, conteúdo, categorias, tags e metadados do texto original.
3. O sistema cria um novo registro de texto no banco de dados com uma nova chave primária (ID).
4. O título da nova cópia é preenchido com o padrão `[Título Original] (Cópia)`.
5. O sistema insere a cópia na mesma pasta e posição logo abaixo do texto de origem na árvore de arquivos.
6. O sistema exibe um toast de sucesso indicando a criação do documento.

**Fluxos alternativos:**
- *Duplicações sucessivas:* Caso o nome gerado já exista, o sistema incrementa sequencialmente, ex: `[Título Original] (Cópia 2)`.

**Fluxos de exceção:**
- *Limite de armazenamento:* Caso o usuário atinja o limite do seu plano para quantidade de textos ou armazenamento, a operação é rejeitada com uma mensagem clara orientando o upgrade de plano.

**Pós-condições:** Um novo texto com conteúdo idêntico ao original é gerado e disponibilizado para edição no projeto.

**Critérios de aceite:**
- [ ] O texto duplicado deve copiar fielmente todo o conteúdo do editor, metadados (tags, categorias) e vinculações.
- [ ] O histórico de versões do documento original não deve ser migrado para o novo documento duplicado.
- [ ] A criação do novo registro deve ocorrer em menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Importar textos

**ID:** UC-007  
**Requisito relacionado:** RF-7 (importar textos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está dentro de um projeto e possui um arquivo local válido (.txt, .md).  
**Gatilho:** O usuário clica no botão "Importar Arquivo" ou arrasta o arquivo para a área de importação.  

**Fluxo principal:**
1. O usuário clica na opção "Importar Arquivo" na barra de ações ou no menu de importação.
2. O sistema abre a janela de upload do sistema operacional.
3. O usuário seleciona o arquivo (.txt ou .md) e confirma a seleção.
4. O sistema processa o arquivo, faz a leitura dos metadados e do corpo textual.
5. O sistema realiza a sanitização do texto e converte a formatação Markdown básica para o formato de edição estruturado interno.
6. O sistema insere o novo documento no projeto atual, atribuindo como título o nome original do arquivo.
7. O sistema abre o texto importado no editor e atualiza a barra de arquivos lateral.

**Fluxos alternativos:**
- *Importação por arrastar e soltar:* O usuário arrasta o arquivo de sua máquina diretamente para a barra lateral do projeto, pulando as etapas de diálogo do SO.

**Fluxos de exceção:**
- *Arquivo com extensão não suportada:* O sistema exibe uma mensagem de erro ("Extensão inválida. Formatos aceitos: .txt, .md") e interrompe o upload.
- *Arquivo com tamanho excessivo:* Se o arquivo exceder o limite (ex: 5MB), o sistema cancela a operação e exibe um erro informando sobre o limite de tamanho.

**Pós-condições:** O conteúdo do arquivo externo é transformado em um texto nativo persistido dentro do projeto do usuário.

**Critérios de aceite:**
- [ ] O parser deve importar corretamente codificações UTF-8 e ISO-8859-1 sem corromper caracteres especiais (acentuações).
- [ ] Títulos, parágrafos, listas e negritos do formato original em markdown devem ser convertidos sem perda para o editor WYSIWYG.
- [ ] O tempo total de processamento e criação de arquivo para textos de até 50 mil palavras deve ser inferior a 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Exportar textos

**ID:** UC-008  
**Requisito relacionado:** RF-8 (exportar textos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto a ser exportado existe no projeto e possui conteúdo.  
**Gatilho:** O usuário clica em "Exportar" no menu de opções do texto.  

**Fluxo principal:**
1. O usuário acessa o menu de contexto do texto e seleciona "Exportar".
2. O sistema exibe um modal para seleção do formato de exportação (.txt, .md, .docx, .pdf) e preferências de estilo (margem, tamanho de fonte).
3. O usuário escolhe o formato desejado (ex: Markdown) e confirma a exportação.
4. O sistema gera dinamicamente o arquivo com o conteúdo do editor, aplicando o template selecionado.
5. O sistema inicia o download automático do arquivo no navegador do usuário com o nome `[titulo_do_texto].[extensao]`.

**Fluxos alternativos:**
- *Exportar todo o projeto:* O usuário seleciona exportar a partir da raiz do projeto, gerando um arquivo consolidado ou um pacote ZIP com a estrutura de pastas e arquivos preservados.

**Fluxos de exceção:**
- *Falha de renderização do PDF:* O sistema de geração de PDF atinge timeout ou apresenta falha de memória. O sistema cancela o processo, notifica o usuário ("Não foi possível exportar em PDF. Tente os formatos .md ou .txt") e registra o log de erro.

**Pós-condições:** O arquivo com o conteúdo do editor é baixado na máquina do usuário sem alterações na base de dados.

**Critérios de aceite:**
- [ ] A exportação para Markdown deve preservar tags html sanitizadas ou manter a marcação padrão de sintaxe (Markdown puro).
- [ ] A exportação em PDF deve manter a quebra de páginas correta e margens padrões do padrão A4.
- [ ] O download deve iniciar de forma automática e assíncrona, sem recarregar a interface web.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Separação inteligente de textos

**ID:** UC-009  
**Requisito relacionado:** RF-9 (separação inteligente de textos)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Um texto longo está aberto no editor e a ferramenta de IA está configurada e ativa.  
**Gatilho:** O usuário aciona "Separação Inteligente de Textos" no menu de ferramentas de escrita.  

**Fluxo principal:**
1. O usuário clica na opção "Separar Texto Inteligentemente" no painel de ferramentas do editor.
2. O sistema envia o conteúdo do texto ativo para o serviço de IA em background.
3. A IA analisa semanticamente o fluxo de texto buscando marcadores implícitos (como quebras de cena, transição abrupta de perspectiva, elipses temporais e novos capítulos) e marcadores explícitos ("Capítulo 1", "Parte II").
4. O sistema apresenta uma tela de visualização lado a lado (*Split Preview*) exibindo as sugestões de pontos de corte, trechos de início e fim propostos, e sugestões de títulos para os novos blocos de texto.
5. O usuário revisa as propostas, podendo arrastar os pontos de divisão ou renomear os títulos propostos.
6. O usuário clica em "Confirmar Separação".
7. O sistema executa a divisão física: cria os novos subdocumentos ordenados, coloca-os dentro de uma nova pasta com o nome do arquivo original, e atualiza a barra lateral.

**Fluxos alternativos:**
- *Divisão sem marcadores de IA:* Se a IA não identificar elementos semânticos de quebra, sugere fatiamento simples baseado em contagem de palavras (ex: a cada 1.500 palavras) configurável pelo usuário.

**Fluxos de exceção:**
- *Timeout na resposta da IA:* Se a requisição de IA demorar mais de 20 segundos, o sistema aborta a operação, exibe "O assistente de IA demorou muito para responder. Tente realizar a quebra manual" e mantém o arquivo original intocado.

**Pós-condições:** O documento original é subdividido em vários documentos ordenados, sem perda de caracteres e organizados hierarquicamente.

**Critérios de aceite:**
- [ ] A separação deve manter a integridade exata dos caracteres: a junção de todas as partes novas geradas deve resultar exatamente no mesmo caractere-por-caractere do texto de origem.
- [ ] O usuário deve ter a opção de manter ou excluir o arquivo consolidado de origem durante o passo de confirmação.
- [ ] O processo de gravação dos novos arquivos no banco de dados deve ser transacional (se falhar em um, desfaz todos os criados para evitar dados órfãos).

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Organizar texto em pastas

**ID:** UC-010  
**Requisito relacionado:** RF-10 (organizar texto em pastas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Pelo menos uma pasta e um texto existem no projeto. O usuário tem privilégios de escrita.  
**Gatilho:** O usuário arrasta o texto para cima de uma pasta ou escolhe a ação "Mover para Pasta" nas opções do texto.  

**Fluxo principal:**
1. O usuário clica e arrasta o texto no painel de navegação lateral.
2. O usuário posiciona o cursor com o arquivo arrastado sobre a pasta destino desejada.
3. A pasta destino destaca-se visualmente (borda ou cor de fundo diferenciada) sinalizando ser uma dropzone activa.
4. O usuário solta o botão do mouse.
5. O sistema dispara uma requisição interna atualizando a propriedade `id_pasta_pai` do texto com o ID da pasta destino.
6. A árvore de diretórios é renderizada novamente com a hierarquia atualizada, mostrando o texto recuado dentro da pasta.

**Fluxos alternativos:**
- *Mover via menu de contexto:* O usuário clica com o botão direito no texto, seleciona "Mover para...", navega por um seletor modal com a árvore de pastas do projeto, escolhe a pasta destino e clica em "Confirmar".

**Fluxos de exceção:**
- *Movimentação circular ou inválida:* Se o usuário tentar mover uma pasta para dentro de si mesma ou para dentro de um subdiretório dela mesma, o sistema impede a ação, exibe um toast de erro ("Ação inválida: pasta pai não pode ser filha de si mesma") e retorna a pasta à sua posição original.

**Pós-condições:** A relação hierárquica do texto com a pasta está atualizada no banco de dados e refletida visualmente.

**Critérios de aceite:**
- [ ] O drag and drop deve funcionar de forma fluida nos navegadores homologados (Chrome, Firefox, Edge, Safari).
- [ ] A alteração do parentesco no banco de dados deve ocorrer em menos de 500ms.
- [ ] Ao arrastar um texto sobre uma pasta colapsada e manter por mais de 1,5 segundos, a pasta deve se expandir automaticamente exibindo seu conteúdo.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---

## Tabela Resumo: Lote 1 (UC-001 a UC-010)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-001** | RF-1 (escrever textos) | Crítica | Baixa |
| **UC-002** | RF-2 (editar textos) | Crítica | Baixa |
| **UC-003** | RF-3 (salvar textos) | Crítica | Baixa |
| **UC-004** | RF-4 (salvar automaticamente) | Crítica | Média |
| **UC-005** | RF-5 (excluir textos) | Alta | Baixa |
| **UC-006** | RF-6 (duplicar textos) | Média | Baixa |
| **UC-007** | RF-7 (importar textos) | Média | Média |
| **UC-008** | RF-8 (exportar textos) | Alta | Média |
| **UC-009** | RF-9 (separação inteligente de textos) | Média | Alta |
| **UC-010** | RF-10 (organizar texto em pastas) | Crítica | Média |
