# Casos de Uso - Lote 41 (UC-401 a UC-410)

Este documento contém a especificação dos casos de uso de 401 a 410 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Sugerir subversão de tropo identificado

**ID:** UC-401  
**Requisito relacionado:** RF-396 (sugerir subversão de tropo identificado)  
**Ator(es):** Sistema, IA, Usuário (Escritor)  
**Pré-condições:** Cenas ou manuscritos contendo tropos (clichês literários) identificados.  
**Gatilho:** O usuário clica em "Subverter Tropos" no painel de tropos da cena.  

**Fluxo principal:**
1. O usuário acessa a aba de tropos de uma cena correspondente.
2. O usuário seleciona o clichê literário detectado (ex: "O Mentor Sábio que morre no final").
3. O usuário clica no botão "Sugerir Subversão".
4. O backend aciona a IA, que analisa a narrativa e gera 3 sugestões de quebra e subversão do clichê selecionado.
5. O sistema apresenta as sugestões na tela junto com análises do provável impacto dramático na história.
6. O usuário seleciona uma das ideias e a grava como nota de rascunho de enredo no projeto.

**Fluxos alternativos:**
- *Filtros de tom:* O usuário opta por filtrar as sugestões de subversões por tom (cômicas, trágicas, irônicas) no modal de configurações de IA.

**Fluxos de exceção:**
- *Falta de contexto:* Se a cena possuir poucas descrições e falas, a IA alerta sobre a escassez de dados, recomendando complementar o texto antes de tentar gerar subversões ricas.

**Pós-condições:** As ideias de subversão sugeridas são armazenadas nas notas do projeto.

**Critérios de aceite:**
- [ ] O processamento e geração de subversões pela IA devem durar menos de 4 segundos.
- [ ] A interface deve destacar de forma clara e visual as opções de quebras sugeridas.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Catalogar tropos usados por obra/universo

**ID:** UC-402  
**Requisito relacionado:** RF-397 (catalogar tropos usados por obra/universo)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** Obra escrita e estruturada no sistema.  
**Gatilho:** O usuário clica em "Catalogar Tropos" no painel analítico de worldbuilding.  

**Fluxo principal:**
1. O usuário acessa "Worldbuilding" -> "Tropos do Universo".
2. O sistema executa um parser semântico por IA sobre todos os capítulos da obra.
3. O sistema identifica e cataloga os tropos estruturais e narrativos mais comuns presentes.
4. O sistema lista os tropos em formato de biblioteca com hyperlinks para os capítulos e cenas em que ocorrem.
5. O usuário revisa o catálogo de tropos gerado e adiciona anotações manuais se desejar.

**Fluxos alternativos:**
- *Cadastro manual:* O usuário cria um tropo manualmente na lista (ex: "Profecia Auto-realizável") e vincula aos capítulos de sua escolha utilizando tags.

**Fluxos de exceção:**
- *Nenhum tropo localizado:* Se a IA não identificar tropos estruturais na obra, exibe "Nenhum clichê estrutural identificado de forma automática" e sugere cadastrar manualmente.

**Pós-condições:** A biblioteca de tropos catalogados da obra é salva no banco de dados.

**Critérios de aceite:**
- [ ] O parser de detecção de tropos deve rodar em background sem impactar o uso da interface e a digitação do escritor.
- [ ] O tempo total de indexação de tropos deve ser de no máximo 5 segundos para cada 20 páginas de texto.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar sandbox de teste isolado do universo canônico

**ID:** UC-403  
**Requisito relacionado:** RF-398 (criar sandbox de teste isolado do universo canônico)  
**Ator(es):** Usuário (Escritor/Game Designer), Sistema  
**Pré-condições:** Universo do projeto cadastrado com personagens, locais e regras.  
**Gatilho:** O usuário clica em "Criar Sandbox (E se?)" no painel do universo.  

**Fluxo principal:**
1. O usuário acessa o painel de Worldbuilding do projeto.
2. O usuário clica no botão "Criar Novo Sandbox de Teste".
3. O sistema solicita a digitação de um nome de controle (ex: "Sandbox: Protagonista Vilão").
4. O usuário insere o nome e confirma.
5. O sistema cria um clone completo de toda a estrutura relacional do universo canônico (personagens, locais, linhas temporais) para uma área isolada e protegida no banco de dados.
6. A interface passa a exibir o distintivo em destaque "Modo Sandbox (Não Canônico)" no cabeçalho da plataforma.

**Fluxos alternativos:**
- *Clone parcial:* O usuário seleciona clonar apenas um conjunto de personagens e um capítulo específico para testar interações rápidas.

**Fluxos de exceção:**
- *Limites de cota:* Se a conta do usuário atingiu o limite de ambientes de sandbox simultâneos permitidos, o sistema impede a ação e solicita a exclusão de ambientes antigos.

**Pós-condições:** O ambiente de sandbox isolado é inicializado e disponibilizado para edições experimentais.

**Critérios de aceite:**
- [ ] O clone lógico do universo no banco de dados deve ocorrer em até 1 segundo.
- [ ] O distintivo visual de modo Sandbox deve ser proeminente em todas as telas para evitar confusão de dados.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Testar alteração hipotética sem afetar dados originais

**ID:** UC-404  
**Requisito relacionado:** RF-399 (testar alteração hipotética sem afetar dados originais)  
**Ator(es):** Usuário (Escritor/Game Designer), Sistema  
**Pré-condições:** Sandbox de teste ativo criado.  
**Gatilho:** O usuário edita informações no modo Sandbox.  

**Fluxo principal:**
1. O usuário acessa o ambiente Sandbox ativo correspondente.
2. O usuário abre a ficha técnica do herói principal e altera sua facção para "Vilões".
3. O usuário edita o texto do capítulo 1 alterando o desfecho da cena no editor do Sandbox.
4. O sistema grava as alterações de forma local e exclusiva na base de dados do sandbox.
5. As consultas realizadas dentro das ferramentas do sandbox trazem o personagem atualizado e as novas cenas, enquanto a base de dados principal canônica permanece intacta.

**Fluxos alternativos:**
- *Timelines alternativas:* O usuário cria ramificações temporais (branches) experimentais no sandbox para testar caminhos e escolhas alternativas sem interferir na cronologia oficial.

**Fluxos de exceção:**
- *Sessão perdida:* Se o sistema perder a referência do sandbox por desconexão, impede novos salvamentos e emite erro para evitar a sobrescrita acidental de dados da base principal.

**Pós-condições:** As alterações experimentais são salvas de forma exclusiva e isolada na base do sandbox.

**Critérios de aceite:**
- [ ] As alterações efetuadas no sandbox não devem de forma alguma vazar ou afetar a integridade da base canônica principal.
- [ ] A velocidade de salvamento e escrita no sandbox deve ser equivalente à da base comum (< 200ms).

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Comparar resultado do "e se" com o universo canônico

**ID:** UC-405  
**Requisito relacionado:** RF-400 (comparar resultado do "e se" com o universo canônico)  
**Ator(es):** Usuário (Escritor/Game Designer), Sistema  
**Pré-condições:** Sandbox com alterações salvas e universo canônico correspondente ativo.  
**Gatilho:** O usuário clica em "Comparar com Universo Real" no painel do sandbox.  

**Fluxo principal:**
1. O usuário acessa o menu do Sandbox ativo.
2. O usuário clica em "Comparar com Canônico".
3. O sistema abre a tela de comparação em duas colunas verticais paralelas (Split screen).
4. O sistema compara as duas bases e destaca as divergências de dados (exibindo em vermelho exclusões e em verde inserções) em capítulos, cenas e fichas de personagens.
5. O usuário visualiza as diferenças estruturais lado a lado na tela.

**Fluxos alternativos:**
- *Exportar Diferenças:* O usuário exporta o relatório de diferenças estruturais (diff) em formato de texto para análise posterior offline.

**Fluxos de exceção:**
- *Sem alterações:* Se nenhuma modificação tiver sido realizada no sandbox, o sistema exibe a mensagem "Nenhuma alteração detectada em relação ao universo canônico".

**Pós-condições:** O relatório visual comparativo das divergências estruturais e textuais é exibido na tela.

**Critérios de aceite:**
- [ ] A tela de comparação deve utilizar rolagem de tela (scroll) sincronizada entre as colunas do split screen.
- [ ] A varredura e cálculo de diferenças de até 50 fichas do universo devem demorar menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Promover resultado do sandbox para o universo real

**ID:** UC-406  
**Requisito relacionado:** RF-401 (promover resultado do sandbox para o universo real)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Sandbox ativo com alterações e visualização de comparações concluída.  
**Gatilho:** O usuário clica em "Promover para Canônico (Merge)" no painel do sandbox.  

**Fluxo principal:**
1. O usuário abre o painel de comparação do sandbox.
2. O usuário clica no botão "Mesclar com o Universo Canônico".
3. O sistema exibe um aviso crítico alertando sobre a substituição de dados permanentes e exige confirmação de segurança.
4. O usuário confirma a ação.
5. O sistema copia todos os registros, textos e árvores de decisão do sandbox para a base canônica principal do projeto (sobrescrevendo o estado anterior da base principal).
6. O sistema cria um ponto de restauração (backup) automático da base canônica anterior antes da mesclagem.
7. O sandbox é encerrado, e o sistema redireciona o usuário para o universo principal atualizado.

**Fluxos alternativos:**
- *Promoção seletiva:* O usuário seleciona marcar as caixas de verificação apenas nos personagens e fichas que deseja promover, rejeitando as alterações feitas nas cenas de texto.

**Fluxos de exceção:**
- *Conflitos relacionais de banco:* Se houver chaves duplicadas no banco que causem erros de integridade relacional, o sistema cancela a operação, restaura o backup e exibe a tela de resolução manual de conflitos.

**Pós-condições:** Os dados reais da base principal do universo são atualizados com as informações do sandbox promovido.

**Critérios de aceite:**
- [ ] O processo de promoção e mesclagem total dos universos deve durar no máximo 3 segundos.
- [ ] O ponto de restauração pré-mesclagem deve ser armazenado na pasta de backups do usuário.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Identificar padrões recorrentes entre projetos diferentes

**ID:** UC-407  
**Requisito relacionado:** RF-402 (identificar padrões recorrentes entre projetos diferentes)  
**Ator(es):** Sistema, IA, Usuário  
**Pré-condições:** O usuário possui múltiplos projetos cadastrados em sua conta ativa.  
**Gatilho:** O usuário clica em "Análise de Portfólio de Escrita" no dashboard principal.  

**Fluxo principal:**
1. O usuário acessa a página inicial da conta e clica em "Análises Cruzadas".
2. O backend faz a leitura de todas as obras e projetos literários/de RPG do usuário.
3. A IA processa os dados analisando tropos recorrentes em todos os universos, traços de personalidades de personagens e clichês de enredo.
4. O sistema exibe o relatório de padrões detalhado na tela (ex: "Em 3 de seus 4 projetos, o protagonista possui o arquétipo de Guerreiro Solitário").
5. O usuário visualiza as métricas analíticas.

**Fluxos alternativos:**
- *Excluir projetos:* O usuário desmarca determinados projetos da busca cruzada (ex: rascunhos rápidos), focando a análise apenas em suas obras maduras.

**Fluxos de exceção:**
- *Projeto único:* Se o usuário possuir apenas um projeto cadastrado na conta, o sistema desabilita o painel de análise cruzada de padrões de escrita e informa a indisponibilidade.

**Pós-condições:** O relatório analítico contendo os padrões estruturais cruzados de projetos é gerado na tela.

**Critérios de aceite:**
- [ ] A análise global de IA deve ser processada de forma assíncrona com exibição de barra de progresso.
- [ ] O processamento deve demorar menos de 8 segundos para varredura de até 5 projetos médios.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Alertar personagem/tema muito similar já usado em outro projeto

**ID:** UC-408  
**Requisito relacionado:** RF-403 (alertar personagem muito similar já usado em outro projeto)  
**Ator(es):** Sistema, IA, Usuário (Escritor)  
**Pré-condições:** Múltiplos personagens cadastrados em projetos diferentes da conta.  
**Gatilho:** O usuário cria ou edita um personagem no módulo correspondente do projeto atual.  

**Fluxo principal:**
1. O usuário preenche a ficha de um novo personagem (dados, motivações, história).
2. Ao clicar em "Salvar Personagem", o sistema envia os dados para validação cruzada de similaridade semântica em background.
3. O backend calcula a distância de similaridade dos dados com todos os personagens dos outros projetos do usuário.
4. O sistema detecta um nível de similaridade acima do aceitável configurado (ex: similaridade de 85% com personagem de outro projeto).
5. A interface exibe uma janela flutuante sutil alertando sobre a alta similaridade de escrita.
6. O usuário clica para comparar ambas as fichas para fins de diferenciação.

**Fluxos alternativos:**
- *Ignorar alerta:* O usuário opta por desconsiderar o aviso clicando em "Ignorar e Salvar", e o sistema prossegue salvando a ficha sem travar a interface.

**Fluxos de exceção:**
- *Falha de busca:* Se a busca semântica de IA falhar por instabilidade, o sistema executa apenas a busca por termos textuais exatos e prossegue com o salvamento da ficha.

**Pós-condições:** A ficha do personagem é salva e o alerta de similaridade cruzada é disparado quando detectado.

**Critérios de aceite:**
- [ ] A verificação de similaridade deve durar menos de 800ms após o clique de salvamento da ficha.
- [ ] Os parâmetros de percentual de similaridade de gatilho (ex: alertar acima de 80%) devem ser configuráveis nas configurações de conta.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Sugerir cruzamento de universos (crossover) baseado em compatibilidade

**ID:** UC-409  
**Requisito relacionado:** RF-404 (sugerir cruzamento de universos (crossover) baseado em compatibilidade)  
**Ator(es):** Sistema, IA, Usuário (Escritor)  
**Pré-condições:** Pelo menos dois universos/projetos de fantasia ou RPG distintos cadastrados na conta.  
**Gatilho:** O usuário clica em "Sugerir Crossover" no painel de análises cruzadas.  

**Fluxo principal:**
1. O usuário acessa a página de análises do portfólio.
2. O usuário clica em "Sugestões de Crossover".
3. A IA avalia a compatibilidade de regras mágicas, níveis de tecnologia, deuses e facções dos universos do escritor.
4. A IA gera uma proposta de cruzamento exibindo o percentual de compatibilidade lógica de lore e tramas em comum.
5. O sistema apresenta sugestões de tramas e pontos de contato geográficos/temporais unindo os dois mundos.
6. O usuário clica em "Criar Projeto de Crossover", gerando um projeto híbrido contendo a importação das bases de ambos os mundos.

**Fluxos alternativos:**
- *Crossover manual:* O usuário seleciona manualmente as facções de projetos distintos que deseja cruzar, e a IA calcula apenas a probabilidade de conflito lógico de regras de worldbuilding.

**Fluxos de exceção:**
- *Sem compatibilidade:* Se os universos tiverem regras contraditórias impossíveis de mesclar (ex: ficção científica rígida versus fantasia mitológica), o sistema alerta sobre os principais paradoxos conceituais.

**Pós-condições:** A proposta de crossover e o novo projeto híbrido unificado são gerados na conta.

**Critérios de aceite:**
- [ ] O processamento de compatibilidade de IA e geração do relatório detalhado devem demorar menos de 6 segundos.
- [ ] O projeto gerado de crossover deve conter links de referência aos projetos originais de origem.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Gerar relatório de "estilo autoral" com base em todos os projetos

**ID:** UC-410  
**Requisito relacionado:** RF-405 (gerar relatório de "estilo autoral" com base em todos os projetos)  
**Ator(es):** Usuário, Sistema, IA  
**Pré-condições:** O usuário possui textos de capítulos e diálogos escritos em seus projetos.  
**Gatilho:** O usuário seleciona "Análise de Estilo de Escrita" no menu do perfil.  

**Fluxo principal:**
1. O usuário abre seu perfil de escritor e clica em "Relatório de Estilo Autoral".
2. O backend aciona o motor de análise estilométrica (stylometry) sobre os textos compilados do usuário de todos os projetos.
3. O sistema computa: vocabulário predominante, extensão média de sentenças, riqueza lexical, tons emocionais mais frequentes, uso de voz ativa/passiva e ritmo de frases.
4. O sistema gera o relatório consolidado de estilo em formato gráfico, exibindo a proximidade estilística do autor com escritores renomados e gráficos de radar de suas características de escrita.
5. O usuário visualiza o relatório e faz a exportação em PDF.

**Fluxos alternativos:**
- *Análise por gênero:* O usuário segmenta a análise de estilo autoral para focar apenas nas obras marcadas como de determinado gênero literário (ex: "Ficção Científica").

**Fluxos de exceção:**
- *Volume insuficiente:* Se o usuário possuir menos de 1.000 palavras escritas em toda a sua conta, o sistema suspende a análise alegando que a massa de dados de escrita é insuficiente para precisão estatística.

**Pós-condições:** O relatório estilométrico em PDF do estilo de escrita do autor é gerado e baixado.

**Critérios de aceite:**
- [ ] O relatório final deve ser exibido com gráficos de radar e barra com cores harmoniosas e legibilidade profissional.
- [ ] A compilação estilométrica de até 50.000 palavras deve demorar no máximo 8 segundos no servidor.

---

## Tabela Resumo: Lote 41 (UC-401 a UC-410)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-401** | RF-396 (sugerir subversão de tropo) | Média | Média |
| **UC-402** | RF-397 (catalogar tropos da obra) | Média | Média |
| **UC-403** | RF-398 (criar sandbox do universo) | Alta | Média |
| **UC-404** | RF-399 (testar alteração sem alterar canônico) | Alta | Média |
| **UC-405** | RF-400 (comparar sandbox com canônico) | Média | Média |
| **UC-406** | RF-401 (promover sandbox para canônico) | Alta | Alta |
| **UC-407** | RF-402 (identificar padrões entre projetos) | Média | Alta |
| **UC-408** | RF-403 (alertar personagem similar em outros projetos) | Média | Alta |
| **UC-409** | RF-404 (sugerir crossover de universos) | Baixa | Alta |
| **UC-410** | RF-405 (relatório de estilo autoral) | Média | Alta |
