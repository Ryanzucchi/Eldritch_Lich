# Casos de Uso - Lote 5 (UC-041 a UC-050)

Este documento contém a especificação dos casos de uso de 41 a 50 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Auto intitular textos e pastas

**ID:** UC-041  
**Requisito relacionado:** RF-41 (auto intitular textos e pastas)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto ou pasta possui conteúdo textual associado.  
**Gatilho:** O usuário clica na opção "Auto Intitular" no cabeçalho do documento/pasta, ou cria um arquivo e o deixa sem título por mais de 5 minutos de atividade de escrita.  

**Fluxo principal:**
1. O sistema envia as primeiras 500 palavras do texto (ou a lista de títulos de arquivos contidos na pasta) para o assistente de IA.
2. A IA gera 3 sugestões de títulos coerentes baseadas no resumo do conteúdo.
3. O sistema exibe um popover na interface com as 3 sugestões geradas.
4. O usuário seleciona um dos títulos sugeridos.
5. O sistema atualiza o título do arquivo/pasta no banco de dados e na árvore lateral.

**Fluxos alternativos:**
- *Aceitação automática:* O usuário ativa a configuração "Auto intitular novos documentos automaticamente". O sistema atualiza o nome do documento sem confirmação prévia no primeiro auto-salvamento após 1.000 caracteres digitados.

**Fluxos de exceção:**
- *Conteúdo insuficiente para análise:* Se o documento contiver menos de 20 palavras e o usuário acionar o comando, o sistema exibe "Conteúdo insuficiente para gerar título automático" e mantém o título padrão.

**Pós-condições:** O título do arquivo ou pasta é atualizado com base na análise semântica do conteúdo.

**Critérios de aceite:**
- [ ] A geração de títulos deve sugerir opções concisas (máximo de 6 palavras por sugestão).
- [ ] A requisição de geração de título deve ser concluída em menos de 1,5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Categorizar textos automaticamente

**ID:** UC-042  
**Requisito relacionado:** RF-42 (categorizar textos automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** As categorias do projeto estão configuradas.  
**Gatilho:** O usuário ativa a "Auto Categorização" no menu de configurações ou ao salvar o documento.  

**Fluxo principal:**
1. O sistema lê o conteúdo do texto.
2. A IA classifica o texto em relação às categorias existentes no projeto usando modelos de classificação de texto baseados em contexto.
3. O sistema exibe uma notificação sutil na barra de status: "Sugerida categoria: [Categoria X]. Aceitar?".
4. O usuário clica em "Aceitar".
5. A categoria do documento é salva no banco de dados.

**Fluxos alternativos:**
- *Sugerir nova categoria:* Se o texto não se encaixar em nenhuma categoria existente, a IA sugere a criação de uma nova categoria com um nome correspondente (ex: "Capítulo de Ação").

**Fluxos de exceção:**
- *Nenhuma categoria relevante identificada:* Se o score de confiança da classificação for inferior a 60%, o sistema não faz alterações e mantém o arquivo na categoria atual ou "Sem categoria".

**Pós-condições:** O texto é classificado e associado à categoria mais condizente com seu conteúdo.

**Critérios de aceite:**
- [ ] O classificador deve rodar de forma assíncrona, consumindo o texto a partir do banco de dados pós-salvamento.
- [ ] A precisão de classificação em projetos com categorias distintas deve ser de pelo menos 85%.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Estabelecer uma linha de conexão entre duas palavras ou pastas

**ID:** UC-043  
**Requisito relacionado:** RF-43 (estabelecer uma linha de conexão entre duas palavras ou pastas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Os dois itens de origem e destino (palavras/textos ou pastas) existem no projeto.  
**Gatilho:** O usuário aciona a ferramenta de "Conexão Manual" no painel lateral ou no editor.  

**Fluxo principal:**
1. O usuário seleciona um termo no editor (ou uma pasta na barra lateral) e clica em "Conectar a...".
2. O usuário escolhe o segundo item (uma palavra em outro texto ou outra pasta).
3. O sistema registra a conexão direcional entre os IDs dos dois objetos no banco de dados.
4. Na aba de conexões do projeto, o sistema desenha uma linha conectando os dois elementos no painel gráfico correspondente.

**Fluxos alternativos:**
- *Conexão por drag-and-drop no Grafo:* O usuário abre a visualização em grafo, clica na borda de um nó (palavra/pasta) e arrasta um vetor até outro nó, criando a linha de conexão visualmente.

**Fluxos de exceção:**
- *Tentar conectar item a si mesmo:* O sistema impede a operação de auto-conexão e exibe "Não é possível conectar um elemento a si mesmo".

**Pós-condições:** A conexão lógica é estabelecida no banco de dados e renderizada visualmente na interface.

**Critérios de aceite:**
- [ ] O relacionamento deve persistir na tabela de adjacência do grafo de conhecimento.
- [ ] A exclusão de um dos elementos conectados deve remover automaticamente a linha de conexão correspondente no banco de dados (cascading delete).

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Estabelecer uma linha de conexão entre duas entidades

**ID:** UC-044  
**Requisito relacionado:** RF-44 (estabelecer uma linha de conexão entre duas entidades)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** As entidades (personagens, locais, objetos, organizações) existem e estão catalogadas.  
**Gatilho:** O usuário desenha ou especifica um link entre entidades no painel de relações.  

**Fluxo principal:**
1. O usuário acessa a ferramenta "Grafo de Entidades".
2. O usuário clica no botão "Criar Vínculo".
3. O usuário clica na Entidade A (ex: Personagem "Arthur") e arrasta uma linha até a Entidade B (ex: Organização "Ordem dos Cavaleiros").
4. O sistema abre um pequeno formulário sobre a linha pedindo para especificar a relação (ex: "Membro de") e sua intensidade (peso).
5. O usuário preenche os campos e confirma.
6. O sistema atualiza o grafo, exibindo a linha de conexão rotulada e colorida.

**Fluxos alternativos:**
- *Criar relação a partir da ficha técnica:* O usuário adiciona a relação escrevendo os detalhes no formulário da ficha da entidade, e a linha é gerada automaticamente no grafo.

**Fluxos de exceção:**
- *Entidade destino excluída concorrentemente:* Se a Entidade B for deletada por outro usuário antes de concluir a criação do link, o sistema exibe "Erro: A entidade de destino não está mais disponível" e cancela o desenho da linha.

**Pós-condições:** O relacionamento estruturado entre as entidades é gravado e representado visualmente.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar as chaves estrangeiras de ambas as entidades na tabela de arestas do grafo.
- [ ] A linha desenhada no canvas do grafo deve possuir setas direcionais e rótulos legíveis.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Visualizar conexões entre entidades

**ID:** UC-045  
**Requisito relacionado:** RF-45 (visualizar conexões entre entidades)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem entidades cadastradas e conectadas no projeto.  
**Gatilho:** O usuário clica na aba "Grafo de Entidades" ou seleciona "Ver Conexões" na ficha de uma entidade.  

**Fluxo principal:**
1. O usuário acessa a tela do Grafo de Entidades.
2. O sistema lê todas as entidades (nós) e seus relacionamentos (arestas) no banco de dados.
3. O sistema renderiza um canvas 2D/3D interativo utilizando uma biblioteca gráfica (ex: D3.js) com algoritmo de layout direcionado por forças.
4. O usuário visualiza as entidades representadas como círculos (com ícones/fotos) e as conexões representadas como linhas rotuladas conectando os círculos.
5. O usuário interage com o gráfico (zoom, pan, arrasta nós).

**Fluxos alternativos:**
- *Foco em entidade específica:* O usuário clica em "Isolar Entidade" na ficha de um personagem, fazendo com que o grafo exiba apenas aquela entidade e suas conexões diretas (grafo de 1 grau de separação).

**Fluxos de exceção:**
- *Excesso de nós:* Se o projeto tiver mais de 500 entidades, o sistema inicializa o grafo com as conexões principais colapsadas e exibe um alerta sugerindo aplicar filtros para melhor desempenho.

**Pós-condições:** A representação interativa das conexões do universo é apresentada na tela.

**Critérios de aceite:**
- [ ] A renderização inicial do grafo deve ser concluída em menos de 1,5 segundos para projetos de até 200 entidades.
- [ ] O canvas de visualização deve suportar interações de zoom e movimentação dos nós.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Reconhecer contradições no texto

**ID:** UC-046  
**Requisito relacionado:** RF-46 (reconhecer contradições no texto)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto ativo possui conteúdo e a análise de contradições está ativa.  
**Gatilho:** O usuário clica em "Verificar Contradições" ou o sistema inicia a varredura automática após o salvamento.  

**Fluxo principal:**
1. O sistema envia o texto do documento para a IA de análise lógica de enredo.
2. A IA varre o texto buscando inconsistências factuais internas diretas (ex: no parágrafo 1 diz que o personagem é "cego", no parágrafo 5 diz que ele "leu uma carta").
3. O sistema sinaliza as contradições encontradas sublinhando os trechos conflitantes em amarelo no editor.
4. O usuário clica no trecho sublinhado para abrir um balão contendo a explicação da contradição ("Contradição: O personagem foi descrito como cego no início do capítulo, mas aqui ele lê uma carta").

**Fluxos alternativos:**
- *Marcar como intencional:* O usuário clica em "Ignorar (Contradição Intencional)" no balão explicativo, removendo o sublinhado.

**Fluxos de exceção:**
- *Timeout do modelo LLM:* Caso o processamento da IA falhe ou demore mais de 15 segundos, o sistema desativa a análise de inconsistências e alerta o usuário: "Não foi possível verificar contradições no momento".

**Pós-condições:** As contradições internas detectadas no texto são exibidas de forma clara para correção.

**Critérios de aceite:**
- [ ] O modelo de IA deve justificar detalhadamente o motivo da contradição detectada ao usuário.
- [ ] O sistema não deve impor bloqueio de salvamento ou edição devido às contradições encontradas (deve ser apenas informativo).

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Reconhecer contradições em textos entre pastas

**ID:** UC-047  
**Requisito relacionado:** RF-47 (reconhecer contradições em textos entre pastas)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Múltiplos textos estão distribuídos em diferentes pastas no projeto (ex: Pasta de "Rascunhos" e Pasta de "Lore Oficial").  
**Gatilho:** O usuário solicita uma varredura geral de contradições cruzadas no painel do projeto.  

**Fluxo principal:**
1. O usuário clica em "Análise de Consistência do Projeto" no painel principal.
2. O sistema envia os textos de diferentes pastas para o pipeline de análise lógica de IA.
3. A IA confronta as informações dos textos presentes em uma pasta com os textos de outra pasta buscando discrepâncias de fatos ou regras.
4. O sistema gera um relatório de inconsistências cruzadas na tela.
5. O usuário clica sobre um item do relatório e visualiza os dois trechos de arquivos diferentes que estão em contradição lado a lado.

**Fluxos alternativos:**
- *Filtro de escopo:* O usuário seleciona apenas duas pastas específicas para comparar, limitando a varredura para economizar processamento.

**Fluxos de exceção:**
- *Estouro de contexto de token:* Se o volume total dos textos das pastas selecionadas exceder o limite de contexto da IA, o sistema realiza a verificação por blocos incrementais e avisa que o processamento pode demorar mais.

**Pós-condições:** As inconsistências factuais entre documentos de diferentes pastas são listadas em um relatório centralizado.

**Critérios de aceite:**
- [ ] O relatório deve conter links clicáveis direcionando para os arquivos exatos e linhas onde as contradições se originam.
- [ ] A execução da varredura geral do projeto não deve travar a navegação pela interface web.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Reconhecer contradições cronológicas

**ID:** UC-048  
**Requisito relacionado:** RF-48 (reconhecer contradições cronológicas)  
**Ator(es):** Sistema, IA  
**Pré-condições:** A linha do tempo do projeto possui eventos datados e os textos relatam datas ou durações de eventos.  
**Gatilho:** O sistema analisa o texto do capítulo atual contra o banco de dados cronológico do projeto.  

**Fluxo principal:**
1. O sistema analisa o texto em busca de menções a datas, anos, idades de personagens ou durações (ex: "A guerra durou 5 anos", "Ele tinha 20 anos em 1050").
2. A IA confronta essas menções com os fatos registrados no banco de dados cronológico (ex: a "Guerra" dura de 1040 a 1042; a data de nascimento do personagem é 1035).
3. A IA identifica incoerências (ex: "Se ele nasceu em 1035, em 1050 ele teria 15 anos, não 20").
4. O sistema destaca a contradição no editor de texto com um sublinhado laranja e exibe os dados corretos no tooltip explicativo.

**Fluxos alternativos:**
- *Corrigir linha do tempo:* O usuário clica em "Atualizar Linha do Tempo com esta informação do texto", atualizando o banco de dados cronológico diretamente a partir do texto.

**Fluxos de exceção:**
- *Calendários não-padrão:* Se o universo do usuário utilizar um sistema de datação customizado não configurado, a IA de cronologia se limita a analisar intervalos relativos no texto puro.

**Pós-condições:** Inconsistências temporais e de idade são apontadas ao usuário.

**Critérios de aceite:**
- [ ] O parser cronológico deve reconhecer expressões temporais comuns em português (ex: "três dias depois", "no ano de 802").
- [ ] O sistema deve manter um mapa de idades de personagens dinâmico baseado na data de nascimento cadastrada na ficha de cada entidade.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Reconhecer contradições entre personagens

**ID:** UC-049  
**Requisito relacionado:** RF-49 (reconhecer contradições entre personagens)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Fichas de personagens com atributos (como cor de olhos, altura) estão cadastradas e os textos mencionam esses atributos.  
**Gatilho:** Processamento automático do texto escrito ou verificação explícita solicitada pelo usuário.  

**Fluxo principal:**
1. O sistema envia a narrativa e as fichas de personagens envolvidas na cena para a IA.
2. A IA correlaciona as descrições no texto com as propriedades cadastradas na ficha de entidade do personagem (ex: a ficha diz que Arthur tem "olhos castanhos", mas a narrativa afirma: "Arthur piscou seus olhos verdes").
3. A IA identifica a contradição.
4. O sistema destaca a contradição no editor com um sublinhado lilás e exibe os detalhes da ficha do personagem no balão informativo.

**Fluxos alternativos:**
- *Atualizar Ficha:* O usuário clica em "Atualizar Ficha do Personagem" a partir do texto para alterar o registro oficial (ex: muda a cor dos olhos na ficha para verde).

**Fluxos de exceção:**
- *Disfarce intencional:* Se o personagem estiver usando disfarces ou ilusões, o escritor pode selecionar "Ignorar contradição - Disfarce" no menu do balão.

**Pós-condições:** Contradições entre a descrição textual e os metadados dos personagens são apresentadas.

**Critérios de aceite:**
- [ ] A IA deve analisar atributos físicos básicos: cor de olhos, cabelo, cicatrizes, altura relativa, destreza e status (vivo/morto).
- [ ] O processamento deve ter alta precisão para evitar excesso de falsos positivos gerados por descrições poéticas.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Reconhecer contradições entre locais

**ID:** UC-050  
**Requisito relacionado:** RF-50 (reconhecer contradições entre locais)  
**Ator(es):** Sistema, IA  
**Pré-condições:** As fichas de locais com dados geográficos estão cadastradas no projeto.  
**Gatilho:** Análise contínua ou sob demanda do texto do capítulo.  

**Fluxo principal:**
1. A IA lê o texto em busca de descrições geográficas de cenários ou movimentações entre locais.
2. A IA cruza com as definições cadastradas de geografia (ex: a ficha diz que "Cidade X fica a leste de Cidade Y", mas o texto relata: "Eles cavalgaram em direção ao pôr do sol [oeste], saindo de Cidade Y para chegar em Cidade X").
3. A IA aponta que cavalgar em direção ao pôr do sol para ir de Y para X contradiz a localização leste da Cidade X.
4. O sistema marca o trecho do texto com um alerta visual e exibe a justificativa geográfica.

**Fluxos alternativos:**
- *Ver no Mapa:* O usuário clica em "Exibir no Mapa" no balão e o sistema abre o atlas interativo mostrando as rotas conflitantes em vermelho.

**Fluxos de exceção:**
- *Transporte mágico:* Se o universo contiver portais mágicos ou métodos de transporte extraordinários, o usuário pode desativar alertas de tempo de viagem incompatíveis.

**Pós-condições:** Alertas de incoerência espacial e geográfica são apresentados para revisão.

**Critérios de aceite:**
- [ ] A IA deve identificar contradições em relação a: pontos cardeais de deslocamento, clima incompatível cadastrado no local, e distâncias/tempos de viagem impossíveis para meios comuns de transporte.
- [ ] A taxa de acertos em testes de consistência geográfica deve ser de pelo menos 80%.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---

## Tabela Resumo: Lote 5 (UC-041 a UC-050)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-041** | RF-41 (auto intitular textos e pastas) | Média | Média |
| **UC-042** | RF-42 (categorizar textos automaticamente) | Média | Média |
| **UC-043** | RF-43 (estabelecer linha de conexão...) | Alta | Média |
| **UC-044** | RF-44 (estabelecer linha de conexão...) | Alta | Média |
| **UC-045** | RF-45 (visualizar conexões entre entidades) | Alta | Alta |
| **UC-046** | RF-46 (reconhecer contradições no texto) | Alta | Alta |
| **UC-047** | RF-47 (reconhecer contradições... pastas) | Alta | Alta |
| **UC-048** | RF-48 (reconhecer contradições cronológicas) | Média | Alta |
| **UC-049** | RF-49 (reconhecer contradições... personagens) | Alta | Alta |
| **UC-050** | RF-50 (reconhecer contradições... locais) | Média | Alta |
