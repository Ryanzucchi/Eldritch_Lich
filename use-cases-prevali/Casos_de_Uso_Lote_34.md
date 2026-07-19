# Casos de Uso - Lote 34 (UC-331 a UC-340)

Este documento contém a especificação dos casos de uso de 331 a 340 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Criar índice de notas (MOC - Map of Content)

**ID:** UC-331  
**Requisito relacionado:** RF-330 (criar índice de notas (MOC - Map of Content))  
**Ator(es):** Usuário (Escritor/Pesquisador), Sistema  
**Pré-condições:** Notas atômicas cadastradas e conectadas.  
**Gatilho:** O usuário clica em "Criar Mapa de Conteúdo (MOC)" no menu de notas.  

**Fluxo principal:**
1. O usuário acessa a pasta de Notas e seleciona "Novo Mapa de Conteúdo (MOC)".
2. O sistema cria um documento especial de índice de tópicos.
3. O usuário digita o título do índice (ex: "MOC: Física de Partículas").
4. O usuário adiciona hyperlinks diretos organizando as notas atômicas em formato de lista hierárquica e sequencial de leitura (ex: "1. Introdução: [[Nota A]]", "2. Detalhes: [[Nota B]]").
5. O usuário clica em "Salvar MOC".
6. O sistema grava o índice e indexa os hyperlinks internos na base de dados.

**Fluxos alternativos:**
- *MOC dinâmico automático:* O usuário adiciona uma tag de busca (ex: `#física`) na nota de MOC. O sistema gera dinamicamente uma listagem em tempo real de todas as notas do projeto contendo aquela tag correspondente.

**Fluxos de exceção:**
- *Links quebrados:* Se alguma nota atômica linkada no MOC for excluída, o sistema sinaliza visualmente a linha correspondente como link quebrado no MOC e sugere desvincular.

**Pós-condições:** O documento de MOC (índice estruturado de notas) é persistido na base de dados do projeto.

**Critérios de aceite:**
- [ ] A interface do MOC deve permitir arrastar e reposicionar a ordem das notas do índice com animação fluida.
- [ ] A gravação do MOC no banco de dados deve levar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Sugerir notas relacionadas ao escrever

**ID:** UC-332  
**Requisito relacionado:** RF-331 (sugerir notas relacionadas ao escrever)  
**Ator(es):** Sistema, IA, Usuário (Escritor/Pesquisador)  
**Pré-condições:** Notas de pesquisa cadastradas e o editor de texto está ativo.  
**Gatilho:** O usuário digita no editor de texto (com debounce de 3 segundos).  

**Fluxo principal:**
1. O usuário digita no editor o parágrafo (ex: "A dilatação do tempo ocorre em campos gravitacionais...").
2. Após a pausa de digitação, o sistema dispara a análise semântica em background.
3. A IA lê o trecho escrito, extrai conceitos-chaves e realiza uma busca por similaridade semântica na base de notas do projeto.
4. O sistema exibe um painel lateral flutuante sutil contendo miniaturas de notas correspondentes (ex: "Nota: Buracos Negros", "Nota: Relatividade").
5. O usuário clica na sugestão para abrir a nota ao lado ou clica em "Linkar" para inserir a referência bidirecional correspondente no texto ativo.

**Fluxos alternativos:**
- *Desativar sugestões:* O usuário desmarca a chave "Sugestões de Notas por IA" na barra de ferramentas do editor para focar na escrita livre sem popups.

**Fluxos de exceção:**
- *Banco de vetores offline:* Se a indexação de vetores do projeto falhar por falta de recursos do servidor, a busca se converte em busca textual exata por palavras-chaves, mantendo as recomendações básicas.

**Pós-condições:** O painel de sugestões de notas relacionadas é atualizado na interface com base no texto ativo digitado.

**Critérios de aceite:**
- [ ] A busca semântica em background não deve causar nenhum atraso ou lag na digitação do editor.
- [ ] O tempo total de processamento semântico e recomendação das notas na tela deve ser de no máximo 1,5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Documentar mecânicas de jogo

**ID:** UC-333  
**Requisito relacionado:** RF-332 (documentar mecânicas de jogo)  
**Ator(es):** Usuário (Game Designer), Sistema  
**Pré-condições:** O usuário está no módulo de Game Design (GDD) do projeto.  
**Gatilho:** O usuário clica em "Nova Mecânica de Jogo" no menu de documentação de regras do jogo.  

**Fluxo principal:**
1. O usuário acessa "GDD" -> "Mecânicas de Jogo".
2. O usuário clica em "Criar Nova Mecânica".
3. O sistema abre o formulário de cadastro solicitando: Nome da Mecânica, Tipo (combate, exploração), Core Loop associado, Gatilho de Entrada, Ação Realizada e Estado de Retorno.
4. O usuário preenche as informações estruturadas da mecânica.
5. O usuário clica em "Salvar".
6. O sistema grava a mecânica na tabela correspondente.
7. A mecânica é listada no diretório GDD do projeto.

**Fluxos alternativos:**
- *Desenhar fluxo:* O usuário abre o canvas de fluxograma integrado na própria ficha da mecânica para desenhar de forma visual o ciclo de ação do jogador.

**Fluxos de exceção:**
- *Mecânica sem nome:* O sistema exige o preenchimento de nome descritivo para gravação de integridade.

**Pós-condições:** A mecânica de jogo é cadastrada e catalogada no GDD do projeto.

**Critérios de aceite:**
- [ ] A ficha de mecânica de jogo deve suportar anexo de imagens e GIFs ilustrativos de gameplay.
- [ ] A gravação no banco de dados deve levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Documentar sistema de regras

**ID:** UC-334  
**Requisito relacionado:** RF-333 (documentar sistema de regras)  
**Ator(es):** Usuário (Game Designer), Sistema  
**Pré-condições:** Módulo de regras ativo no projeto.  
**Gatilho:** O usuário cria um documento de sistema de regras gerais do jogo ou RPG.  

**Fluxo principal:**
1. O usuário acessa "GDD" -> "Regras do Jogo".
2. O usuário clica em "Novo Conjunto de Regras".
3. O sistema abre o formulário estruturado solicitando: Nome da Regra, Categoria (combate, exploração), Fórmula de Cálculo (ex: `Dano = Ataque * 1.5 - Defesa`) e Condições Especiais.
4. O usuário digita a regra utilizando a notação matemática correspondente.
5. O usuário clica em "Salvar".
6. O sistema valida as variáveis da fórmula e grava a regra na tabela correspondente no banco de dados.

**Fluxos alternativos:**
- *Vincular regra a atributos:* O usuário linka as variáveis da fórmula diretamente aos atributos de personagens da base de dados (ex: linka a variável "Ataque" ao atributo "força" do personagem).

**Fluxos de exceção:**
- *Fórmula inválida:* Se a fórmula contiver parênteses abertos sem fechamento ou caracteres não matemáticos inválidos, o sistema impede o salvamento e exibe: "Erro: Sintaxe matemática de fórmula inválida".

**Pós-condições:** A regra matemática/lógica é salva e cadastrada na base de dados do projeto.

**Critérios de aceite:**
- [ ] O parser de fórmulas deve checar a validade matemática da equação antes de persistir no banco.
- [ ] A inserção da regra no banco de dados deve demorar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Balancear atributos/estatísticas de personagens jogáveis

**ID:** UC-335  
**Requisito relacionado:** RF-334 (balancear atributos/estatísticas de personagens jogáveis)  
**Ator(es):** Usuário (Game Designer), Sistema  
**Pré-condições:** Personagens jogáveis com fichas de estatísticas cadastradas.  
**Gatilho:** O usuário edita a tabela de curvas de evolução de atributos dos personagens.  

**Fluxo principal:**
1. O usuário acessa "GDD" -> "Balanceamento de Personagens".
2. O sistema exibe uma planilha contendo os atributos (Vida, Mana, Força, Defesa) de todos os personagens jogáveis de acordo com seus níveis (nível 1 ao 50).
3. O usuário seleciona o personagem desejado (ex: "Guerreiro").
4. O usuário altera os valores do fator de progressão na planilha.
5. O sistema recalcula automaticamente todas as linhas da tabela em background.
6. A tela exibe um gráfico de linha mostrando a curva de evolução do Guerreiro ao longo dos níveis em comparação com a curva do Mago.
7. O usuário confirma os novos valores clicando em "Salvar Ajustes de Balanceamento".
8. O sistema atualiza os atributos e a curva na tabela correspondente no banco.

**Fluxos alternativos:**
- *Ajustar por curva visual:* O usuário arrasta pontos de controle de uma curva visual (Bezier) para suavizar a evolução de força dos personagens sem preencher números manualmente.

**Fluxos de exceção:**
- *Atributos inválidos:* Se o usuário preencher valores de atributos zerados ou negativos para níveis avançados, o sistema bloqueia o salvamento para evitar crashes de balanceamento.

**Pós-condições:** Os valores de progressão e a curva de balanceamento dos atributos do personagem são atualizados na base de dados.

**Critérios de aceite:**
- [ ] A re-renderização do gráfico comparativo ao alterar qualquer valor da planilha deve durar menos de 200ms.
- [ ] A planilha de balanceamento deve permitir exportação rápida dos dados em formato CSV.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Documentar níveis/fases do jogo

**ID:** UC-336  
**Requisito relacionado:** RF-335 (documentar níveis/fases do jogo)  
**Ator(es):** Usuário (Game Designer/Level Designer), Sistema  
**Pré-condições:** O usuário está na seção de GDD do projeto.  
**Gatilho:** O usuário clica em "Novo Nível / Fase" no menu de level design.  

**Fluxo principal:**
1. O usuário acessa "GDD" -> "Design de Níveis".
2. O usuário clica em "Criar Nova Fase".
3. O sistema abre a ficha técnica de level design solicitando: Nome da Fase, Objetivo Principal, Duração Estimada, Lista de Inimigos Presentes, Lista de Itens a Coletar e descrição do fluxo de navegação do jogador.
4. O usuário preenche as informações estruturadas da fase.
5. O usuário faz o upload da imagem do mapa de design da fase (layout/planta baixa).
6. O usuário clica em "Salvar".
7. O sistema grava o nível na tabela correspondente no banco.
8. A fase é incluída no sumário do projeto de Game Design.

**Fluxos alternativos:**
- *Mapear pontos na planta baixa:* O usuário clica sobre a imagem do mapa da fase e adiciona pins marcando o ponto de início (Spawn), posições de baús e chefões, idêntico ao processo do atlas geográfico.

**Fluxos de exceção:**
- *Erro de upload do mapa:* Se a imagem do mapa da fase falhar no upload, o sistema permite salvar a ficha puramente textual, indicando a pendência visual.

**Pós-condições:** A ficha técnica estruturada e o layout visual do nível são salvos na base de dados do projeto.

**Critérios de aceite:**
- [ ] A ficha de nível de jogo deve cruzar dados de inventário de itens e bestiário para autocomplete de itens e inimigos presentes.
- [ ] O salvamento da fase no banco de dados deve levar menos de 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Versionar regras de jogo

**ID:** UC-337  
**Requisito relacionado:** RF-336 (versionar regras de jogo)  
**Ator(es):** Usuário (Game Designer), Sistema  
**Pré-condições:** Regras de jogo e fórmulas matemáticas cadastradas no GDD.  
**Gatilho:** O usuário edita e altera uma regra ou fórmula matemática existente de combate.  

**Fluxo principal:**
1. O usuário abre a ficha da regra correspondente (versão ativa: v1.0).
2. O usuário edita a fórmula matemática alterando os multiplicadores.
3. O usuário digita o motivo do ajuste de balanceamento.
4. O usuário clica em "Atualizar Regra".
5. O backend recebe a alteração, cria a versão v1.1 da regra, grava os metadados do autor/data e armazena o histórico da versão anterior na tabela de auditoria.
6. O painel passa a exibir as duas versões com opção de comparação rápida das fórmulas.

**Fluxos alternativos:**
- *Restaurar regra antiga:* O usuário clica em "Reverter para Versão Anterior" e o sistema promove a fórmula anterior para ativa, desativando a versão mais recente.

**Fluxos de exceção:**
- *Queda de rede:* O sistema salva as edições de regras localmente caso haja queda de conexão para posterior sincronização.

**Pós-condições:** A nova versão da regra é gravada, mantendo o histórico de auditoria das versões anteriores acessível.

**Critérios de aceite:**
- [ ] O sistema de versionamento de regras deve exibir um diff claro de alteração de fórmulas matemáticas.
- [ ] A gravação e cálculo de versão de regras devem durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Simular resultado de combate/interação com base em regras

**ID:** UC-337  
**Requisito relacionado:** RF-337 (simular resultado de combate)  
**Ator(es):** Usuário (Game Designer), Sistema  
**Pré-condições:** Personagens e fórmulas de combate cadastrados e ativos.  
**Gatilho:** O usuário clica em "Simular Combate" no painel de balanceamento.  

**Fluxo principal:**
1. O usuário acessa o painel de simulações do GDD.
2. O usuário seleciona o Atacante (Guerreiro) e o Defensor (Mago), bem como o nível de ambos.
3. O usuário escolhe a ação de ataque especial da lista.
4. O usuário clica em "Executar Simulação de Combate".
5. O sistema busca os atributos de ambos no banco de dados, recupera a fórmula de combate correspondente da tabela de regras e calcula os resultados matemáticos de forma isolada.
6. O sistema exibe o relatório detalhado do dano resultante, chance de acerto crítico, consumo de recursos e pontos de vida restantes.

**Fluxos alternativos:**
- *Simulação de múltiplos turnos:* O usuário seleciona "Combate Completo (Auto-battle)". O sistema roda 100 rodadas de simulação e exibe a estatística de probabilidade de vitória de cada personagem.

**Fluxos de exceção:**
- *Atributo nulo:* Se o Guerreiro ou o Mago possuir algum atributo vital em branco (ex: Defesa do Mago está cadastrada como nula), o sistema avisa: "Não é possível realizar a simulação. Defesa do Mago está com valor nulo".

**Pós-condições:** O relatório consolidado de dados e estatísticas do combate simulado é exibido na tela.

**Critérios de aceite:**
- [ ] A simulação matemática e renderização do relatório do duelo individual devem ocorrer em menos de 500ms.
- [ ] A simulação de auto-battle de 100 rodadas deve durar menos de 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Documentar economia interna do jogo (itens, moedas, trocas)

**ID:** UC-339  
**Requisito relacionado:** RF-338 (documentar economia interna do jogo)  
**Ator(es):** Usuário (Game Designer), Sistema  
**Pré-condições:** Itens cadastrados no inventário do projeto.  
**Gatilho:** O usuário edita os parâmetros de economia ou tabelas de lojas.  

**Fluxo principal:**
1. O usuário acessa "GDD" -> "Economia e Lojas".
2. O usuário clica em "Nova Loja / Tabela de Trocas".
3. O usuário digita o nome do estabelecimento.
4. O usuário seleciona quais itens estão à venda na loja e preenche os campos: Preço de Compra (em moedas de ouro), Preço de Venda e Limite de Estoque.
5. O usuário clica em "Salvar".
6. O sistema grava a tabela de comércio e preços no banco de dados.
7. A economia e os valores de liquidez dos itens passam a constar nos relatórios de balanceamento econômico do projeto.

**Fluxos alternativos:**
- *Calcular modificadores de preço:* O usuário ativa um modificador de economia (ex: "Evento de Inflação"). O sistema eleva automaticamente em 20% os preços de compra de todos os itens de combate em todas as lojas cadastradas do reino.

**Fluxos de exceção:**
- *Preço de venda maior que compra:* Se o usuário preencher um preço de venda do item maior do que o preço de compra por engano, o sistema emite um alerta de segurança avisando sobre o risco de loop infinito de moedas.

**Pós-condições:** A tabela de precificação econômica dos itens de comércio é salva na base de dados.

**Critérios de aceite:**
- [ ] A interface de economia deve fornecer um relatório consolidado com a média de valor dos itens por raridade.
- [ ] A gravação no banco de dados deve levar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar pauta de reunião

**ID:** UC-340  
**Requisito relacionado:** RF-339 (criar pauta de reunião)  
**Ator(es):** Usuário (Organizador da Reunião), Sistema  
**Pré-condições:** Coautores ou colaboradores convidados no projeto.  
**Gatilho:** O organizador cria um convite de reunião no painel de equipe.  

**Fluxo principal:**
1. O organizador acessa o módulo de "Equipe" -> "Reuniões".
2. O organizador clica em "Agendar Nova Reunião".
3. O sistema abre o formulário solicitando: Título da Reunião, Data e Horário, Local/Plataforma, Colaboradores Convidados e o campo "Pauta da Reunião".
4. O organizador digita os tópicos que serão abordados (pauta) em formato de lista Markdown.
5. O organizador clica em "Salvar e Notificar".
6. O sistema grava a reunião na tabela correspondente no banco de dados e envia convites por e-mail e notificações internas para todos os colaboradores selecionados.

**Fluxos alternativos:**
- *Vincular pauta a objetivos:* O organizador associa a pauta a um objetivo ou meta de equipe ativa (OKR), indicando que a reunião servirá para discutir o progresso da meta correspondente.

**Fluxos de exceção:**
- *Conflito de agenda:* O sistema verifica a agenda interna dos participantes convidados. Caso algum membro possua outra reunião marcada no mesmo horário, o sistema alerta o organizador sobre a pendência.

**Pós-condições:** A pauta de reunião é salva e enviada aos participantes.

**Critérios de aceite:**
- [ ] O e-mail de pauta enviado deve conter link de aceite/recusa do convite integrado à plataforma.
- [ ] A inserção no banco e disparo de e-mails de convocação em lote devem ocorrer em menos de 2 segundos.

---

## Tabela Resumo: Lote 34 (UC-331 a UC-340)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-331** | RF-330 (criar índice de notas MOC) | Média | Baixa |
| **UC-332** | RF-331 (sugerir notas ao escrever) | Média | Alta |
| **UC-333** | RF-332 (documentar mecânicas de jogo) | Alta | Baixa |
| **UC-334** | RF-333 (documentar sistema de regras) | Alta | Média |
| **UC-335** | RF-334 (balancear atributos de personagens) | Média | Alta |
| **UC-336** | RF-335 (documentar níveis/fases do jogo) | Média | Média |
| **UC-337** | RF-336 (versionar regras de jogo) | Média | Média |
| **UC-338** | RF-337 (simular resultado de combate) | Média | Alta |
| **UC-339** | RF-338 (documentar economia do jogo) | Média | Média |
| **UC-340** | RF-339 (criar pauta de reunião) | Alta | Média |
