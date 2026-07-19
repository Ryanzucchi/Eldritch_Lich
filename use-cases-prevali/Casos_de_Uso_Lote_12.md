# Casos de Uso - Lote 12 (UC-111 a UC-120)

Este documento contém a especificação dos casos de uso de 111 a 120 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Criar hyperlinks externos

**ID:** UC-111  
**Requisito relacionado:** RF-111 (criar hyperlinks externos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto está aberto no editor.  
**Gatilho:** O usuário seleciona uma palavra e insere uma URL externa.  

**Fluxo principal:**
1. O usuário seleciona uma palavra no editor de texto.
2. O usuário clica em "Inserir Link" ou pressiona Ctrl+K.
3. O sistema abre uma caixa de diálogo de inserção de link.
4. O usuário insere um link externo completo (ex: `https://pt.wikipedia.org/wiki/Idade_Media`).
5. O sistema valida a URL.
6. O sistema aplica o hyperlink na palavra selecionada.
7. O editor exibe o texto formatado como link ativo sublinhado com um ícone de link externo.

**Fluxos alternativos:**
- *Colagem rápida:* O usuário copia uma URL e a cola diretamente sobre a palavra selecionada no editor. O sistema converte automaticamente a palavra em link contendo a URL colada.

**Fluxos de exceção:**
- *URL malformada:* Se o usuário digitar uma URL inválida sem o protocolo, o sistema tenta corrigir inserindo `https://` automaticamente ou alerta: "URL inválida".

**Pós-condições:** O link externo está inserido e funcional no documento de texto.

**Critérios de aceite:**
- [ ] O link externo deve abrir em uma nova aba do navegador (`target="_blank"`) e possuir atributos de segurança (`rel="noopener noreferrer"`).
- [ ] A alteração deve ser gravada no esquema de dados estruturado do editor em menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Visualizar backlinks

**ID:** UC-112  
**Requisito relacionado:** RF-112 (visualizar backlinks)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Outros documentos do projeto possuem hyperlinks internos apontando para o texto ativo.  
**Gatilho:** O usuário abre um documento e clica na aba "Backlinks" ou "Mencionados em".  

**Fluxo principal:**
1. O usuário abre o arquivo "A Batalha do Moinho".
2. O usuário clica em "Ver Backlinks" no menu lateral do editor.
3. O sistema varre o banco de dados de conexões mapeando todos os arquivos que contêm links ativos apontando para "A Batalha do Moinho".
4. A interface abre um painel exibindo a lista de arquivos de origem.
5. Ao lado de cada item da lista, o sistema renderiza um trecho textual mostrando o contexto em que a menção ocorre no arquivo original.
6. O usuário clica em um item para navegar até a página de origem.

**Fluxos alternativos:**
- *Exibição compacta:* Os backlinks são exibidos em formato de notas de rodapé de forma estática no fim do documento.

**Fluxos de exceção:**
- *Sem referências:* Se nenhum outro documento mencionar o texto ativo, o painel exibe "Nenhum backlink encontrado para este documento".

**Pós-condições:** A lista das fontes que fazem referência ao documento ativo é exibida na interface.

**Critérios de aceite:**
- [ ] O tempo de varredura e retorno dos backlinks para um documento deve ser inferior a 300ms.
- [ ] O trecho contextualizado deve destacar o link de destino em negrito.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar automaticamente hyperlinks e backlinks

**ID:** UC-113  
**Requisito relacionado:** RF-113 (criar automaticamente hyperlinsk e backlinks)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Existem entidades catalogadas no projeto com nomes oficiais configurados.  
**Gatilho:** O usuário edita o texto e para de digitar (debounce de 3 segundos) ou conclui o salvamento do arquivo.  

**Fluxo principal:**
1. O sistema lê o texto modificado pelo usuário.
2. A IA cruza as palavras do texto com a lista de títulos de arquivos e nomes de entidades cadastrados no projeto.
3. O sistema converte automaticamente a palavra detectada em um hyperlink direcionando para a ficha de entidade ou texto correspondente.
4. O sistema atualiza o índice de backlinks do documento de destino de forma automática.
5. O link e o backlink passam a constar nos relatórios e visualizações do projeto.

**Fluxos alternativos:**
- *Aceitação por hover:* A palavra detectada ganha um sublinhado tracejado azul. Ao passar o mouse, exibe um balão sugerindo a criação do link.

**Fluxos de exceção:**
- *Auto-links indesejados:* Se a palavra for um termo comum que coincide com o nome de uma entidade, o usuário pode clicar no link e selecionar "Desativar auto-link para esta palavra".

**Pós-condições:** Os links internos e backlinks correspondentes são gerados e indexados de forma automatizada no banco de dados.

**Critérios de aceite:**
- [ ] O gerador automático de links não deve sobrescrever formatações manuais ou links externos inseridos pelo usuário.
- [ ] O tempo de processamento dos auto-links deve ser assíncrono e não deve travar a digitação.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Comentar em textos

**ID:** UC-114  
**Requisito relacionado:** RF-114 (comentar em textos)  
**Ator(es):** Usuário (Escritor/Colaborador), Sistema  
**Pré-condições:** O usuário possui acesso de escrita ou leitura no documento aberto.  
**Gatilho:** O usuário seleciona um trecho do texto e clica em "Adicionar Comentário" ou pressiona Ctrl+Alt+M.  

**Fluxo principal:**
1. O usuário seleciona um bloco de texto no editor.
2. O usuário clica no botão "Comentar" ou usa o atalho de teclado.
3. O sistema destaca o trecho selecionado em amarelo e abre uma caixa de texto lateral focada.
4. O usuário digita o comentário e clica em "Enviar".
5. O sistema grava o comentário no banco de dados vinculando ao ID do documento, coordenadas de caractere e ID do usuário.
6. A interface renderiza o comentário no painel lateral de comentários.

**Fluxos alternativos:**
- *Resolver comentário:* O usuário clica em "Resolver". O sistema oculta o comentário da barra lateral e remove o destaque em amarelo do texto.

**Fluxos de exceção:**
- *Texto comentado excluído:* Se o trecho do texto que continha o destaque de comentário for apagado nas edições, o comentário é movido para uma seção especial "Comentários Órfãos".

**Pós-condições:** O comentário é associado ao trecho textual e salvo no banco de dados.

**Critérios de aceite:**
- [ ] O painel lateral deve permitir responder a comentários criando threads de discussão organizadas.
- [ ] A inclusão do comentário deve ser notificada aos coautores do projeto.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Adicionar anotações

**ID:** UC-115  
**Requisito relacionado:** RF-115 (adicionar anotações)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O projeto ou um texto específico está aberto.  
**Gatilho:** O usuário abre o painel lateral de "Anotações" do projeto ou documento.  

**Fluxo principal:**
1. O usuário clica na aba "Anotações Gerais" do painel lateral.
2. O sistema exibe um editor de rascunhos simples separado do fluxo principal de capítulos.
3. O usuário digita notas rápidas, ideias de brainstorm ou links temporários.
4. O sistema salva as anotações automaticamente ao detectar inatividade na escrita.

**Fluxos alternativos:**
- *Anotação do projeto:* O usuário alterna para a aba "Anotações do Projeto" para registrar notas globais do universo fictício.

**Fluxos de exceção:**
- *Sem internet:* O sistema mantém as anotações gravadas no armazenamento local e executa a sincronização assim que reestabelecido o sinal de rede.

**Pós-condições:** A anotação rápida fica persistida nas propriedades do documento/projeto.

**Critérios de aceite:**
- [ ] O editor de anotações deve aceitar formatação Markdown básica (negrito, itálico, listas).
- [ ] O salvamento deve ser assíncrono com latência de resposta < 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Adicionar lembretes

**ID:** UC-116  
**Requisito relacionado:** RF-116 (adicionar lembretes)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está trabalhando em um projeto e deseja agendar um lembrete.  
**Gatilho:** O usuário clica no ícone de "Lembrete" no cabeçalho ou menu de anotações.  

**Fluxo principal:**
1. O usuário clica em "Adicionar Lembrete".
2. O sistema abre um formulário solicitando: Texto do Lembrete, Data e Hora do alerta, e Grau de importância.
3. O usuário define os dados e clica em "Salvar Lembrete".
4. O sistema agenda o alerta na fila de tarefas.
5. Na data/hora configurada, o sistema dispara uma notificação visual na tela da aplicação (ou por e-mail, se configurado).

**Fluxos alternativos:**
- *Lembrete de texto:* O usuário adiciona o lembrete vinculado a um capítulo, fazendo com que a notificação futura contenha o link direto para abrir o arquivo de destino.

**Fluxos de exceção:**
- *Notificações bloqueadas:* Se o navegador bloquear as notificações em tela, o sistema exibe um aviso e envia o alerta por e-mail como fallback.

**Pós-condições:** O lembrete é agendado e a notificação correspondente é disparada no momento programado.

**Critérios de aceite:**
- [ ] A notificação interna no sistema deve persistir em uma aba de "Notificações Recentes" até que o usuário a marque como lida.
- [ ] O lembrete deve poder ser adiado (função snooze) ou cancelado.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar múltiplos projetos

**ID:** UC-117  
**Requisito relacionado:** RF-117 (criar múltiplos projetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado e possui uma conta ativa.  
**Gatilho:** O usuário clica em "Novo Projeto" na tela do Dashboard principal da conta.  

**Fluxo principal:**
1. O usuário clica no botão "Criar Novo Projeto".
2. O sistema apresenta um modal de criação de projeto solicitando: Nome do Projeto, Gênero Literário e Visibilidade (privado/compartilhado).
3. O usuário preenche as informações e clica em "Criar".
4. O sistema cria um novo namespace exclusivo de banco de dados para o projeto na conta do usuário.
5. O sistema redireciona o usuário para o espaço de trabalho do novo projeto em branco.

**Fluxos alternativos:**
- *Criar a partir de modelo:* O usuário seleciona um template de projeto pronto que já inicializa com pastas e estruturas pré-configuradas.

**Fluxos de exceção:**
- *Limite do plano:* Se o usuário no plano gratuito tentar criar mais projetos do que o limite permitido, o sistema bloqueia e sugere o upgrade para o plano Premium.

**Pós-condições:** Um novo projeto independente é inicializado no banco de dados e focado no painel do usuário.

**Critérios de aceite:**
- [ ] A criação do novo projeto no banco de dados deve ocorrer em até 1,5 segundos.
- [ ] Os dados de cada projeto devem residir de forma isolada, impedindo vazamentos de dados entre projetos.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Alternar entre projetos

**ID:** UC-118  
**Requisito relacionado:** RF-118 (alternar entre projetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui mais de um projeto criado em sua conta.  
**Gatilho:** O usuário clica no dropdown de projetos ativos na barra de cabeçalho global.  

**Fluxo principal:**
1. O usuário clica no seletor de projetos (dropdown) no topo esquerdo do cabeçalho.
2. O sistema lista todos os projetos ativos vinculados à conta do usuário.
3. O usuário clica no "Projeto B".
4. O sistema descarrega o estado do projeto atual, carrega os metadados do "Projeto B" e renderiza a nova árvore de pastas e arquivos lateral.
5. A URL do navegador é atualizada contendo o ID do novo projeto ativo.

**Fluxos alternativos:**
- *Alternar via Dashboard:* O usuário clica em "Sair do projeto" para retornar ao painel central de sua conta, onde clica sobre o card do Projeto B para abri-lo.

**Fluxos de exceção:**
- *Projeto de destino excluído:* Se o projeto de destino tiver sido excluído por outro administrador concorrentemente, o sistema exibe "Projeto não encontrado. Retornando ao Dashboard" e atualiza a tela.

**Pós-condições:** O espaço de trabalho é recarregado exibindo os dados exclusivos do novo projeto focado.

**Critérios de aceite:**
- [ ] O tempo total de transição de tela e carregamento de dados do novo projeto selecionado deve ser inferior a 1,5 segundos.
- [ ] O sistema deve salvar o ID do último projeto ativo no localStorage para abri-lo no próximo carregamento.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Duplicar projeto

**ID:** UC-119  
**Requisito relacionado:** RF-119 (duplicar projeto)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto de origem existe na conta do usuário e o usuário tem permissão de administração.  
**Gatilho:** O usuário clica em "Duplicar" no menu de opções do projeto no Dashboard.  

**Fluxo principal:**
1. O usuário acessa a listagem de projetos no Dashboard.
2. O usuário clica no ícone de opções no card do projeto e seleciona "Duplicar".
3. O sistema abre uma caixa de confirmação exibindo o nome do novo projeto proposto no formato `[Nome do Projeto Original] (Cópia)`.
4. O usuário confirma.
5. O sistema realiza a clonagem completa das tabelas do projeto de origem no banco de dados (pastas, arquivos de textos, entidades, relacionamentos, timelines).
6. O novo projeto duplicado aparece na listagem do Dashboard do usuário.

**Fluxos alternativos:**
- *Duplicação parcial:* O usuário seleciona quais módulos deseja copiar para o novo projeto (ex: opta por duplicar apenas o mapa de entidades e a timeline, sem copiar os capítulos).

**Fluxos de exceção:**
- *Espaço insuficiente:* O sistema interrompe o processo se a cópia for exceder a cota de armazenamento e exibe mensagem informativa de cota esgotada.

**Pós-condições:** Uma réplica dos dados do projeto é gerada no banco de dados do usuário.

**Critérios de aceite:**
- [ ] A duplicação de projetos de tamanho padrão (com até 50 textos) deve ser concluída em menos de 5 segundos.
- [ ] O log de histórico de auditoria do projeto original não deve ser clonado para o projeto duplicado.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Importar projetos

**ID:** UC-120  
**Requisito relacionado:** RF-120 (importar projetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um arquivo ZIP válido contendo a estrutura de dados de projeto do sistema.  
**Gatilho:** O usuário clica no botão "Importar Projeto (.zip)" no Dashboard.  

**Fluxo principal:**
1. O usuário clica em "Importar Projeto".
2. O sistema abre a caixa de upload de arquivos do sistema operacional.
3. O usuário seleciona o arquivo ZIP correspondente e clica em abrir.
4. O sistema envia o arquivo ZIP para o backend, onde o parser descompacta o arquivo e lê a estrutura dos textos e tabelas em JSON.
5. O sistema valida a integridade do pacote ZIP.
6. O sistema cria as tabelas do projeto no banco de dados populando com os dados importados e grava os textos nas respectivas pastas.
7. O novo projeto importado aparece no Dashboard do usuário.

**Fluxos alternativos:**
- *Importação de plataformas terceiras:* O sistema possui adaptadores dedicados para importar estruturas de diretórios de ferramentas como Scrivener ou Obsidian.

**Fluxos de exceção:**
- *Arquivo ZIP inválido:* Se o ZIP não contiver o arquivo de índice esperado ou estiver corrompido, o sistema cancela a tarefa e exibe: "Falha na importação. Arquivo ZIP inválido".

**Pós-condições:** O projeto externo é convertido em um projeto ativo e independente na conta do usuário.

**Critérios de aceite:**
- [ ] O parser deve ser capaz de processar e validar a integridade dos dados importados em lote.
- [ ] O tempo total de importação de um projeto com até 100 capítulos de texto deve ser menor que 10 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---

## Tabela Resumo: Lote 12 (UC-111 a UC-120)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-111** | RF-111 (criar hyperlinks externos) | Média | Baixa |
| **UC-112** | RF-122 (visualizar backlinks) | Alta | Média |
| **UC-113** | RF-113 (criar aut. hyperlinks/backlinks) | Média | Alta |
| **UC-114** | RF-114 (comentar em textos) | Alta | Média |
| **UC-115** | RF-115 (adicionar anotações) | Média | Baixa |
| **UC-116** | RF-116 (adicionar lembretes) | Média | Média |
| **UC-117** | RF-117 (criar múltiplos projetos) | Crítica | Média |
| **UC-118** | RF-118 (alternar entre projetos) | Crítica | Baixa |
| **UC-119** | RF-119 (duplicar projeto) | Média | Média |
| **UC-120** | RF-120 (importar projetos) | Alta | Média |
