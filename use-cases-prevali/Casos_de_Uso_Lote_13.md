# Casos de Uso - Lote 13 (UC-121 a UC-130)

Este documento contém a especificação dos casos de uso de 121 a 130 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Exportar projetos

**ID:** UC-121  
**Requisito relacionado:** RF-121 (exportar projetos)  
**Ator(es):** Usuário (Escritor/Admin), Sistema  
**Pré-condições:** O projeto existe no banco de dados e o usuário tem permissão de leitura/exportação.  
**Gatilho:** O usuário seleciona "Exportar Projeto" no Dashboard ou menu de configurações do projeto.  

**Fluxo principal:**
1. O usuário acessa a tela de exportação de projeto.
2. O sistema oferece opções de formato (ex: Pacote de Dados do Sistema .zip, ou pasta de arquivos estruturada em Markdown).
3. O usuário seleciona a opção "Backup Nativo (.zip)" e clica em "Iniciar Exportação".
4. O sistema gera arquivos JSON consolidados com os metadados do projeto (fichas, timelines, relacionamentos, permissões) e exporta os textos organizados nas respectivas pastas físicas.
5. O sistema compacta a estrutura em um ZIP.
6. O navegador inicia o download automático do arquivo `[nome_do_projeto]_export.zip`.

**Fluxos alternativos:**
- *Exportação para plataformas externas:* O usuário seleciona exportar a estrutura no formato compatível com Obsidian (arquivos Markdown linkados via double brackets).

**Fluxos de exceção:**
- *Erro de download:* O download falha. O usuário pode clicar em "Tentar Novamente" para re-iniciar a transferência do arquivo gerado temporariamente no servidor (válido por 1 hora).

**Pós-condições:** O arquivo compactado com todos os dados estruturados do projeto é baixado.

**Critérios de aceite:**
- [ ] A exportação nativa deve incluir todas as imagens de mídia e capas vinculadas no projeto.
- [ ] O processo de empacotamento deve rodar de forma assíncrona.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Desfazer alterações

**ID:** UC-122  
**Requisito relacionado:** RF-122 (desfazer alterações)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O editor de texto está focado e o usuário realizou pelo menos uma alteração no texto na sessão atual.  
**Gatilho:** O usuário clica no botão "Desfazer" (Undo) na barra de ferramentas ou pressiona o atalho Ctrl+Z (ou Cmd+Z).  

**Fluxo principal:**
1. O usuário edita o texto e pressiona Ctrl+Z.
2. O sistema intercepta o atalho e recupera o estado anterior do editor a partir do histórico local (pilha de Undo em memória).
3. O sistema reverte a última alteração realizada.
4. O editor atualiza a renderização na tela e move o cursor para a posição correspondente.

**Fluxos alternativos:**
- *Desfazer alteração no grafo:* O usuário arrasta um nó no grafo e pressiona Ctrl+Z. O sistema desfaz a movimentação do nó e o retorna para a coordenada anterior.

**Fluxos de exceção:**
- *Pilha de desfazer vazia:* Se o usuário pressionar Ctrl+Z sem nenhuma alteração pendente de desfazer, o sistema emite um bipe sonoro sutil de erro e nenhuma alteração é feita.

**Pós-condições:** O estado do editor/grafo retorna à etapa imediatamente anterior.

**Critérios de aceite:**
- [ ] O histórico de desfazer no editor de texto deve armazenar pelo menos 100 estados da sessão atual.
- [ ] A reversão de estado deve ocorrer instantaneamente (< 50ms).

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Refazer alterações

**ID:** UC-123  
**Requisito relacionado:** RF-123 (refazer alterações)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O usuário executou a ação "Desfazer" (UC-122) pelo menos uma vez na sessão atual.  
**Gatilho:** O usuário clica no botão "Refazer" (Redo) na barra de ferramentas ou pressiona o atalho Ctrl+Y (ou Ctrl+Shift+Z).  

**Fluxo principal:**
1. O usuário pressiona Ctrl+Y.
2. O sistema recupera o estado desfeito da pilha de Redo.
3. O sistema reaplica a alteração no editor de texto ou no canvas.
4. O editor renderiza a alteração e atualiza a posição do cursor.

**Fluxos alternativos:**
- *Refazer no grafo:* O usuário re-aplica uma alteração de conexão desfeita anteriormente no grafo.

**Fluxos de exceção:**
- *Pilha de Redo vazia:* Se não houver estados desfeitos na pilha, o sistema ignora o atalho de teclado silenciosamente.

**Pós-condições:** A alteração desfeita é reaplicada com sucesso.

**Critérios de aceite:**
- [ ] A ação de Redo deve ser limpa se o usuário realizar qualquer nova edição de escrita após um Undo.
- [ ] A re-aplicação deve ocorrer em menos de 50ms.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Histórico de versões

**ID:** UC-124  
**Requisito relacionado:** RF-124 (histórico de versões)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto possui salvamentos anteriores registrados.  
**Gatilho:** O usuário clica na aba "Histórico de Versões" no painel lateral do editor.  

**Fluxo principal:**
1. O usuário clica em "Histórico de Versões".
2. O sistema recupera a lista de revisões salvas na tabela de histórico de versões do banco de dados para o arquivo atual.
3. A interface lateral apresenta a lista de versões categorizada por data, hora e autor.
4. O usuário clica em uma das versões.
5. O sistema abre uma tela de comparação side-by-side (diff visual) exibindo a versão atual e a versão histórica selecionada, marcando adições em verde e exclusões em vermelho.

**Fluxos alternativos:**
- *Nomear versão:* O usuário seleciona uma versão da lista e clica em "Nomear esta versão" para identificá-la com um rótulo personalizado (ex: "Versão Enviada para Editora").

**Fluxos de exceção:**
- *Falha de comunicação:* O sistema exibe o aviso "Não foi possível carregar o histórico de versões" e mantém o editor na visualização ativa atual.

**Pós-condições:** O histórico e as diferenças das versões passadas são apresentados ao usuário.

**Critérios de aceite:**
- [ ] O sistema deve salvar uma nova versão histórica a cada salvamento manual ou criar pontos de restauração a cada 1 hora de edição contínua.
- [ ] A renderização do diff visual deve destacar trechos modificados em nível de linha/palavra.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Restaurar versões anteriores

**ID:** UC-125  
**Requisito relacionado:** RF-125 (restaurar versões anteriores)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está visualizando uma versão antiga no Histórico de Versões (UC-124).  
**Gatilho:** O usuário clica no botão "Restaurar esta Versão" na barra de visualização da versão histórica.  

**Fluxo principal:**
1. O usuário clica no botão "Restaurar esta Versão" para recuperar o estado antigo selecionado.
2. O sistema exibe um modal de confirmação: "Tem certeza de que deseja substituir o texto atual por esta versão anterior?".
3. O usuário clica em "Confirmar Restauração".
4. O sistema cria uma versão de backup contendo o texto antes do clique.
5. O sistema sobrescreve o conteúdo ativo do documento com os dados da versão antiga no banco de dados.
6. O editor recarrega o conteúdo restaurado na tela do usuário.

**Fluxos alternativos:**
- *Copiar trecho antigo:* O usuário opta por não restaurar o arquivo completo; ele apenas seleciona e copia um parágrafo da versão antiga na tela de diff.

**Fluxos de exceção:**
- *Erro na gravação:* Se a substituição falhar na transação do banco, o sistema aborta o processo e reverte o arquivo para o estado ativo mais recente.

**Pós-condições:** O documento ativo é atualizado com o conteúdo da versão histórica selecionada.

**Critérios de aceite:**
- [ ] A restauração de versões antigas não deve deletar os registros de histórico de versões subsequentes.
- [ ] A restauração de um texto com até 100 mil palavras deve ser concluída em menos de 2 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Favoritar textos

**ID:** UC-126  
**Requisito relacionado:** RF-126 (favoritar textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto a ser favoritado existe no projeto.  
**Gatilho:** O usuário clica no ícone de "Estrela / Favorito" no cabeçalho do documento ou no menu de contexto.  

**Fluxo principal:**
1. O usuário clica no ícone de estrela ao lado do título do texto.
2. O sistema altera o status do atributo `favoritado` para `true` no banco de dados.
3. A estrela do cabeçalho preenche-se com a cor amarela.
4. O sistema insere o texto na seção rápida de "Favoritos" no topo do painel de navegação lateral.

**Fluxos alternativos:**
- *Desfavoritar:* O usuário clica novamente na estrela amarela, mudando o status para `false` e removendo o item da lista rápida de favoritos.

**Fluxos de exceção:**
- *Sem internet:* O sistema executa a mudança localmente no cache do navegador e enfileira a sincronização.

**Pós-condições:** A relação de favorito é salva e o atalho de acesso rápido fica disponível na interface lateral.

**Critérios de aceite:**
- [ ] O texto favoritado deve continuar residindo em sua pasta de origem original.
- [ ] O limite de favoritos na barra lateral rápida deve ser ilimitado, suportando rolagem interna.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Arquivar textos

**ID:** UC-127  
**Requisito relacionado:** RF-127 (arquivar textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto existe no projeto ativo.  
**Gatilho:** O usuário clica com o botão direito no texto e seleciona "Arquivar".  

**Fluxo principal:**
1. O usuário acessa o menu de contexto do texto e seleciona "Arquivar".
2. O sistema apresenta um modal informativo explicando que o texto ficará em modo leitura e oculto da navegação ativa.
3. O usuário confirma.
4. O sistema define a flag `arquivado = true` no banco de dados.
5. O texto é removido da listagem de diretórios ativa e movido para a pasta virtual "Textos Arquivados" no rodapé da árvore lateral.

**Fluxos alternativos:**
- *Desarquivar:* O usuário acessa a pasta "Textos Arquivados", clica com o botão direito no texto e seleciona "Desarquivar", retornando o arquivo à sua pasta original.

**Fluxos de exceção:**
- *Tentativa de edição:* O editor desabilita a digitação em arquivos arquivados, exibindo o status "Arquivo em modo de leitura".

**Pós-condições:** O texto é ocultado da árvore de navegação ativa do projeto.

**Critérios de aceite:**
- [ ] O texto arquivado deve continuar sendo incluído em buscas globais contanto que a opção "Incluir arquivados" esteja ativa.
- [ ] O processo de arquivamento deve atualizar a interface em menos de 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Fixar textos

**ID:** UC-128  
**Requisito relacionado:** RF-128 (fixar textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto existe no projeto.  
**Gatilho:** O usuário clica em "Fixar Texto" no menu de contexto do arquivo na árvore lateral.  

**Fluxo principal:**
1. O usuário abre o menu de contexto de um texto e seleciona "Fixar no Topo".
2. O sistema altera o status do atributo `fixado` para `true` no banco de dados.
3. O sistema move o item para o topo da listagem de arquivos da pasta atual, ignorando a ordenação padrão.
4. A interface exibe um ícone de pino ao lado do título do texto para indicar que está fixado.

**Fluxos alternativos:**
- *Desafixar:* O usuário clica em "Desafixar" e o sistema retorna o texto à sua posição de ordenação natural.

**Fluxos de exceção:**
- *Múltiplos itens fixados:* Se o usuário fixar vários textos na mesma pasta, o sistema ordena os fixados entre si por ordem alfabética.

**Pós-condições:** O texto é fixado no topo de seu respectivo nível hierárquico na árvore de arquivos.

**Critérios de aceite:**
- [ ] O ícone do pino deve ser renderizado de forma clara e visível.
- [ ] A fixação do texto na interface deve ser refletida de forma imediata.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Cadastrar e autenticar usuários

**ID:** UC-129  
**Requisito relacionado:** RF-129 (cadastrar e autenticar usuários)  
**Ator(es):** Usuário (Visitante/Escritor), Sistema  
**Pré-condições:** O usuário não está autenticado e acessa a página de login/cadastro.  
**Gatilho:** O usuário preenche o formulário de cadastro ou de login e envia.  

**Fluxo principal:**
1. O usuário acessa a página inicial e clica em "Cadastrar-se".
2. O usuário preenche: Nome, E-mail, Senha e confirmação de senha.
3. O usuário clica em "Registrar".
4. O sistema criptografa a senha e cria a conta do usuário com status de e-mail "não verificado".
5. O sistema envia um e-mail de ativação e redireciona o usuário para a tela de login.
6. Para se autenticar, o usuário preenche o e-mail e senha cadastrados e clica em "Entrar".
7. O sistema valida as credenciais no backend, gera um token de sessão seguro (JWT) e o armazena nos cookies seguros.
8. O sistema redireciona o usuário autenticado para seu Dashboard de projetos.

**Fluxos alternativos:**
- *Login social:* O usuário clica em "Entrar com o Google". O fluxo é redirecionado para a autenticação OAuth2 do Google e retorna com o login efetuado.

**Fluxos de exceção:**
- *Credenciais incorretas:* Se o e-mail ou a senha estiverem incorretos, o sistema apresenta a mensagem de erro: "E-mail ou senha incorretos".

**Pós-condições:** O usuário é autenticado, recebe o token de acesso e acessa a área protegida do sistema.

**Critérios de aceite:**
- [ ] O sistema não deve transmitir senhas em texto puro na rede (exigir protocolo HTTPS).
- [ ] A autenticação de usuário e verificação de token na API devem demorar menos de 1 segundo.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Recuperar senha

**ID:** UC-130  
**Requisito relacionado:** RF-130 (recuperar senha)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui uma conta cadastrada com um e-mail válido no sistema.  
**Gatilho:** O usuário clica em "Esqueci minha senha" na tela de login.  

**Fluxo principal:**
1. O usuário clica no link "Esqueci minha senha".
2. O sistema abre a tela de redefinição de senha solicitando o e-mail cadastrado.
3. O usuário digita o e-mail e clica em "Enviar link de recuperação".
4. O sistema gera um token de recuperação de uso único (com prazo de expiração de 1 hora) e grava no banco de dados.
5. O sistema envia um e-mail contendo o link de redefinição.
6. O usuário abre o e-mail, clica no link, insere a nova senha e clica em "Salvar Nova Senha".
7. O sistema valida a integridade e expiração do token, hashes a nova senha e atualiza o registro do usuário.
8. O token é invalidado e uma mensagem de sucesso é exibida orientando a realizar o login com a nova senha.

**Fluxos alternativos:**
- *E-mail não cadastrado:* Se o e-mail inserido não existir na base de dados, por motivos de segurança, o sistema exibe a mesma mensagem de sucesso de envio.

**Fluxos de exceção:**
- *Token expirado:* Se o usuário clicar no link após 1 hora da solicitação, o sistema exibe a mensagem "Link de recuperação expirado" e bloqueia o formulário.

**Pós-condições:** A senha do usuário é atualizada de forma segura na base de dados.

**Critérios de aceite:**
- [ ] O link de redefinição deve ser de uso único (deve expirar imediatamente após a primeira redefinição).
- [ ] A senha antiga deve ser invalidada assim que a nova for gravada.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---

## Tabela Resumo: Lote 13 (UC-121 a UC-130)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-121** | RF-121 (exportar projetos) | Alta | Média |
| **UC-122** | RF-122 (desfazer alterações) | Crítica | Baixa |
| **UC-123** | RF-123 (refazer alterações) | Crítica | Baixa |
| **UC-124** | RF-124 (histórico de versões) | Alta | Alta |
| **UC-125** | RF-125 (restaurar versões anteriores) | Alta | Média |
| **UC-126** | RF-126 (favoritar textos) | Média | Baixa |
| **UC-127** | RF-127 (arquivar textos) | Média | Baixa |
| **UC-128** | RF-128 (fixar textos) | Média | Baixa |
| **UC-129** | RF-129 (cadastrar/autenticar usuários) | Crítica | Média |
| **UC-130** | RF-130 (recuperar senha) | Crítica | Média |
