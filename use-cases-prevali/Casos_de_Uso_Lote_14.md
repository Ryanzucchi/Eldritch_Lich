# Casos de Uso - Lote 14 (UC-131 a UC-140)

Este documento contém a especificação dos casos de uso de 131 a 140 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Editar perfil do usuário

**ID:** UC-131  
**Requisito relacionado:** RF-131 (editar perfil do usuário)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado no sistema.  
**Gatilho:** O usuário clica em "Editar Perfil" no painel de controle da sua conta.  

**Fluxo principal:**
1. O usuário acessa a tela "Meu Perfil".
2. O sistema exibe os dados cadastrais atuais (Nome, E-mail, Foto de Perfil, Biografia e fuso horário).
3. O usuário edita os campos desejados (ex: altera o Nome ou envia uma nova foto).
4. O usuário clica em "Salvar Alterações".
5. O sistema valida os campos, realiza o processamento e redimensionamento da imagem de avatar no backend, e atualiza o registro na tabela de usuários.
6. A interface atualiza o cabeçalho e exibe uma notificação de sucesso.

**Fluxos alternativos:**
- *Alterar senha:* O usuário abre a sub-aba "Segurança" para redefinir sua senha preenchendo a senha antiga e definindo a nova.

**Fluxos de exceção:**
- *E-mail duplicado:* Se o usuário tentar alterar seu e-mail para um que já está cadastrado por outra conta, o sistema impede a gravação e informa: "Este e-mail já está sendo utilizado".

**Pós-condições:** Os dados cadastrais e o avatar do usuário são atualizados na base de dados.

**Critérios de aceite:**
- [ ] O tamanho da foto de perfil deve ser limitado a no máximo 2MB e convertida em formato otimizado WebP.
- [ ] A alteração de perfil deve sincronizar dinamicamente nos cabeçalhos da interface sem necessidade de relogar.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Edição colaborativa em tempo real

**ID:** UC-132  
**Requisito relacionado:** RF-132 (edição colaborativa em tempo real)  
**Ator(es):** Usuários (Colaboradores), Sistema  
**Pré-condições:** Múltiplos usuários possuem permissão de escrita e estão com o mesmo documento aberto no editor simultaneamente.  
**Gatilho:** Qualquer um dos colaboradores digita ou apaga caracteres no editor.  

**Fluxo principal:**
1. O Colaborador A e o Colaborador B estão com o mesmo capítulo aberto em suas telas.
2. O Colaborador A insere uma frase no primeiro parágrafo.
3. O sistema captura a alteração localmente e envia o delta de alteração estruturado (via algoritmo CRDT ou OT) através de uma conexão WebSocket segura.
4. O servidor recebe o delta, concilia a ordem das operações e retransmite para o Colaborador B.
5. O editor na tela do Colaborador B renderiza a nova frase imediatamente no parágrafo correspondente.

**Fluxos alternativos:**
- *Desconexão temporária:* Se um dos colaboradores perder a conexão, o editor entra em modo de reconciliação local e sincroniza as edições acumuladas assim que o canal WebSocket for restabelecido.

**Fluxos de exceção:**
- *Conflitos insolúveis:* Em caso raro de divergência de conciliação de texto que o CRDT não consiga mesclar de forma limpa, o sistema gera duas ramificações de parágrafos na tela e solicita que um dos colaboradores clique em qual versão manter.

**Pós-condições:** O documento é editado de forma simultânea por múltiplos autores mantendo a consistência dos caracteres gravados no banco de dados.

**Critérios de aceite:**
- [ ] A latência de replicação dos caracteres digitados entre as telas dos colaboradores na mesma região geográfica deve ser inferior a 150ms.
- [ ] O sistema não deve apresentar perda de caracteres ou caracteres embaralhados em testes de escrita concorrente rápida de 5 usuários.

**Prioridade:** Crítica  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Mencionar usuários em comentários

**ID:** UC-133  
**Requisito relacionado:** RF-133 (mencionar usuários em comentários)  
**Ator(es):** Usuário (Escritor/Colaborador), Sistema  
**Pré-condições:** O projeto possui colaboradores vinculados e o usuário está criando um comentário.  
**Gatilho:** O usuário digita o caractere `@` na caixa de texto de um comentário.  

**Fluxo principal:**
1. O usuário abre a caixa de comentário de um parágrafo.
2. O usuário digita `@`.
3. O sistema exibe um popover flutuante com a listagem de nomes dos colaboradores ativos no projeto.
4. O usuário digita as primeiras letras do nome (ex: `@Ar`) para filtrar a lista.
5. O usuário seleciona o colaborador na lista e pressiona Enter.
6. O sistema insere o marcador do usuário no comentário.
7. O usuário conclui o comentário e clica em "Enviar".
8. O sistema registra o comentário e envia uma notificação diretamente para a conta do usuário mencionado.

**Fluxos alternativos:**
- *Mencionar todos:* O usuário digita `@todos` para enviar um alerta a todos os colaboradores vinculados ao projeto de uma vez só.

**Fluxos de exceção:**
- *Usuário mencionado removido do projeto:* Se o colaborador for removido do projeto posteriormente, o comentário mantém o nome textual da menção, mas o link de perfil correspondente fica desativado.

**Pós-condições:** O comentário com a menção é salvo e a notificação correspondente é enfileirada.

**Critérios de aceite:**
- [ ] A listagem de filtro rápido de usuários citados deve abrir em menos de 100ms após digitar `@`.
- [ ] A menção inserida deve gerar uma notificação por e-mail caso o destinatário não esteja online no momento.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Notificar usuários sobre alterações relevantes

**ID:** UC-134  
**Requisito relacionado:** RF-134 (notificar usuários sobre alterações relevantes)  
**Ator(es):** Sistema, Usuário (Destinatário)  
**Pré-condições:** O usuário está cadastrado no projeto e possui preferências de notificação ativas.  
**Gatilho:** Ocorre um evento relevante no projeto (ex: comentário resolvido, nova contradição grave detectada ou alteração no status de um evento).  

**Fluxo principal:**
1. O sistema detecta o evento relevante (ex: o Colaborador A resolveu um comentário em que o Colaborador B foi mencionado).
2. O sistema gera um registro de notificação contendo o remetente, destinatário, tipo do evento e mensagem.
3. Se o destinatário estiver online no sistema (WebSocket ativo), a notificação é exibida em tempo real como um banner no canto da tela.
4. Se o usuário estiver offline, a notificação é mantida no banco de dados com status de não lida e exibida no painel de notificações na próxima sessão.

**Fluxos alternativos:**
- *E-mail:* De acordo com as preferências do perfil, o sistema envia adicionalmente um e-mail transacional relatando o resumo das atividades.

**Fluxos de exceção:**
- *Falha de envio do e-mail:* O sistema registra a falha na tabela de logs de e-mails, mas mantém a notificação interna intacta na conta do usuário.

**Pós-condições:** A notificação é registrada e entregue ao usuário destinatário.

**Critérios de aceite:**
- [ ] O envio do toast em tempo real para usuários online deve ocorrer em até 500ms após o evento gerador.
- [ ] A interface do painel de notificações deve permitir "Marcar todas como lidas" com um único clique.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Convidar colaboradores por link

**ID:** UC-135  
**Requisito relacionado:** RF-135 (convidar colaboradores por link)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O projeto está salvo na nuvem e o usuário tem permissão de administração.  
**Gatilho:** O usuário clica em "Gerar Link de Convite" no modal de membros.  

**Fluxo principal:**
1. O administrador acessa a aba de membros do projeto.
2. O administrador clica em "Gerar Link de Acesso Rápido".
3. O sistema gera um token criptográfico associado ao projeto com perfil de permissão pré-definido e data de expiração.
4. O sistema exibe a URL de convite com um botão "Copiar".
5. O administrador compartilha o link com o novo colaborador.
6. O novo colaborador clica no link, realiza o login/cadastro e é inserido automaticamente na lista de membros do projeto.

**Fluxos alternativos:**
- *Revogar link:* O administrador clica em "Revogar Link de Convite", invalidando o token no banco de dados e impedindo novos acessos por meio dele.

**Fluxos de exceção:**
- *Link expirado:* Se um convidado clicar no link após a data de expiração, o sistema exibe "Este link de convite expirou" e impede a associação.

**Pós-condições:** O colaborador é adicionado ao projeto através da validação bem-sucedida do link de convite.

**Critérios de aceite:**
- [ ] O administrador deve conseguir definir se o link de convite expira em 24 horas, 7 dias ou nunca.
- [ ] O link de convite deve ser criptografado para evitar ataques de força bruta.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Registrar log de quem editou o quê e quando

**ID:** UC-136  
**Requisito relacionado:** RF-136 (registrar log de quem editou o quê e quando)  
**Ator(es):** Sistema  
**Pré-condições:** Ações de edição ou exclusão de dados são realizadas por usuários no projeto.  
**Gatilho:** Execução de gravação ou atualização de registros na base de dados.  

**Fluxo principal:**
1. Um usuário ("Colaborador A") altera o parágrafo 2 do documento "Capítulo 1" às 15:30.
2. No momento de processar a requisição no backend, o sistema gera uma entrada de log na tabela de auditoria.
3. O log registra: ID do Usuário, ID do Projeto, Ação, ID do Recurso afetado, Data/Hora (timestamp UTC), IP e o delta da alteração.
4. O log é salvo no banco de dados.

**Fluxos alternativos:**
- *Log de exclusão:* O log grava o nome antigo do recurso excluído e a lista de dependências afetadas para possibilitar auditoria.

**Fluxos de exceção:**
- *Falha no sistema de auditoria:* Se o banco de logs estiver inacessível, o sistema tenta gravar localmente em arquivos de texto de log de erro rotativos no servidor.

**Pós-condições:** A ação do usuário é auditada e registrada de forma inalterável no banco de logs.

**Critérios de aceite:**
- [ ] O log de auditoria deve ser somente de inserção (append-only), impedindo edições ou exclusões de registros por qualquer usuário.
- [ ] A gravação do log não deve acrescentar mais de 50ms de latência na requisição de edição principal.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar modelos de textos

**ID:** UC-137  
**Requisito relacionado:** RF-137 (criar modelos (templates) de textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O editor está aberto e o usuário possui um texto formatado que deseja reutilizar.  
**Gatilho:** O usuário clica em "Salvar como Modelo de Texto" no menu do documento.  

**Fluxo principal:**
1. O usuário edita um texto estruturando campos padronizados (ex: "Cena 1: Introdução", "Cena 2: Conflito").
2. O usuário clica em "Salvar como Template".
3. O sistema abre um modal solicitando um nome para o modelo e uma descrição.
4. O usuário clica em "Salvar".
5. O sistema grava o conteúdo do texto na tabela de templates da conta.
6. Ao criar um novo texto futuramente, o modelo passa a constar na lista de opções rápidas de inicialização.

**Fluxos alternativos:**
- *Usar modelo padrão:* O usuário escolhe modelos pré-configurados do sistema (ex: Ficha de Personagem padrão) ao inicializar um novo documento.

**Fluxos de exceção:**
- *Duplicidade de nome:* O sistema alerta caso o nome já exista e sugere sobrescrever o modelo anterior.

**Pós-condições:** O modelo de texto é cadastrado e disponibilizado para novos arquivos.

**Critérios de aceite:**
- [ ] O modelo salvo deve reter estruturas de cabeçalhos e formatações ricas.
- [ ] A aplicação do modelo a um novo texto deve carregar o conteúdo em menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Criar modelos de estrutura de pastas

**ID:** UC-138  
**Requisito relacionado:** RF-138 (criar modelos de estrutura de pastas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário estruturou uma árvore de diretórios no projeto e deseja salvá-la como modelo.  
**Gatilho:** O usuário clica com o botão direito na pasta raiz e seleciona "Salvar Estrutura como Modelo".  

**Fluxo principal:**
1. O usuário clica em "Salvar Estrutura como Modelo".
2. O sistema abre um modal solicitando um título (ex: "Organização de Trilogia Fantástica").
3. O sistema varre recursivamente toda a árvore sob a pasta selecionada mapeando os nomes e a hierarquia.
4. O sistema grava a árvore estruturada em formato JSON na tabela de modelos de pastas.
5. Ao criar uma nova pasta em qualquer projeto, o usuário pode selecionar "Aplicar Modelo de Estrutura" para recriar a hierarquia.

**Fluxos alternativos:**
- *Aplicar na criação de projeto:* Ao criar um projeto novo, o usuário seleciona o modelo de pastas para inicializar o espaço de trabalho com a estrutura completa montada de imediato.

**Fluxos de exceção:**
- *Estrutura muito profunda:* O sistema valida se a estrutura a ser salva respeita a profundidade máxima permitida e avisa caso haja nós inválidos.

**Pós-condições:** O modelo de diretórios é salvo e disponibilizado para aplicação rápida.

**Critérios de aceite:**
- [ ] A recriação de uma árvore com até 20 pastas a partir de um modelo deve demorar menos de 1 segundo.
- [ ] O modelo deve salvar apenas os nomes e hierarquias das pastas, sem copiar os textos que residiam nelas.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Definir metas de escrita (palavras/dia)

**ID:** UC-139  
**Requisito relacionado:** RF-139 (definir metas de escrita)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário deseja gerenciar seu progresso e ritmo de escrita.  
**Gatilho:** O usuário clica em "Definir Metas de Escrita" no painel de estatísticas ou configurações.  

**Fluxo principal:**
1. O usuário acessa o painel de produtividade.
2. O usuário clica em "Adicionar Nova Meta".
3. O sistema solicita: Tipo de Meta, Quantidade de Palavras Alvo (ex: 500 palavras/dia), Data Limite e Documentos elegíveis.
4. O usuário configura a meta e confirma.
5. O sistema grava a meta no banco de dados e adiciona uma barra de progresso visual no rodapé do editor de texto principal.

**Fluxos alternativos:**
- *Meta de prazo final:* O usuário define uma meta de entregar um livro de 80.000 palavras em 3 meses. O sistema calcula automaticamente a cota diária necessária.

**Fluxos de exceção:**
- *Valores inválidos:* Se o usuário inserir uma meta de zero ou palavras negativas, o sistema impede a gravação e notifica sobre o valor inválido.

**Pós-condições:** A meta é ativada no sistema de monitoramento de produtividade e a barra de progresso correspondente é exibida no editor.

**Critérios de aceite:**
- [ ] A barra de progresso da meta diária no editor deve atualizar em tempo real à medida que o usuário digita novas palavras.
- [ ] Ao atingir 100% da meta diária, a barra de progresso deve mudar de cor e exibir uma mensagem animada de conquista discreta.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Acompanhar sequência de dias escrevendo (streak)

**ID:** UC-140  
**Requisito relacionado:** RF-140 (acompanhar sequência de dias escrevendo (streak))  
**Ator(es):** Sistema, Usuário (Escritor)  
**Pré-condições:** O usuário possui metas de escrita diárias ativas no projeto.  
**Gatilho:** Conclusão de uma sessão de escrita onde a cota mínima de palavras foi atingida.  

**Fluxo principal:**
1. O usuário digita no editor até que o contador atinja o limite mínimo diário configurado para streak (ex: mínimo de 200 palavras digitadas em um dia).
2. O sistema detecta a meta diária alcançada, atualiza a data da última atividade e incrementa o contador de "Streak" em 1 dia no banco de dados de progresso do usuário.
3. O cabeçalho exibe um ícone de fogo com o número de dias seguidos (ex: "🔥 5 dias").
4. Se o usuário passar um dia inteiro sem escrever o mínimo exigido, o sistema zera a sequência no próximo acesso.

**Fluxos alternativos:**
- *Protetor de streak:* O usuário configura um "dia de folga" nas opções para evitar que a sequência seja zerada em um dia específico de ausência.

**Fluxos de exceção:**
- *Alteração manual de data:* O sistema valida a timestamp no servidor utilizando a hora do servidor de banco de dados para evitar trapaças de data local.

**Pós-condições:** A sequência de dias de escrita do usuário é incrementada ou redefinida de acordo com a constância monitorada.

**Critérios de aceite:**
- [ ] O ícone visual de streak deve mudar de cor ao atingir marcos relevantes (7 dias, 30 dias, 100 dias).
- [ ] O sistema deve emitir um relatório semanal consolidado de constância por e-mail.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---

## Tabela Resumo: Lote 14 (UC-131 a UC-140)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-131** | RF-131 (editar perfil do usuário) | Média | Baixa |
| **UC-132** | RF-132 (edição colaborativa tempo real) | Crítica | Alta |
| **UC-133** | RF-133 (mencionar usuários @menção) | Alta | Média |
| **UC-134** | RF-134 (notificar alterações relevantes) | Alta | Média |
| **UC-135** | RF-135 (convidar colaboradores por link) | Média | Média |
| **UC-136** | RF-136 (registrar log de edição) | Alta | Média |
| **UC-137** | RF-137 (criar modelos de textos) | Média | Baixa |
| **UC-138** | RF-138 (criar modelos de pastas) | Média | Média |
| **UC-139** | RF-139 (definir metas de escrita) | Alta | Média |
| **UC-140** | RF-140 (acompanhar streak de escrita) | Média | Média |
