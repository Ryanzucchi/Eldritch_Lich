# Casos de Uso - Lote 2 (UC-011 a UC-020)

Este documento contém a especificação dos casos de uso de 11 a 20 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Organizar texto em subpastas

**ID:** UC-011  
**Requisito relacionado:** RF-11 (organizar texto em subpastas)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O usuário possui pastas criadas no projeto.  
**Gatilho:** O usuário clica em "Nova Pasta" estando com uma pasta selecionada ou arrasta uma pasta para dentro de outra na árvore lateral.  

**Fluxo principal:**
1. O usuário clica com o botão direito sobre uma pasta existente ("Pasta Pai") no painel lateral de navegação.
2. O usuário seleciona a opção "Criar Subpasta".
3. O sistema abre uma caixa de entrada para digitar o nome da subpasta.
4. O usuário digita o nome e pressiona Enter.
5. O sistema cria o registro da pasta com `id_pasta_pai` referenciando a "Pasta Pai" no banco de dados.
6. A interface atualiza o painel exibindo a subpasta recuada abaixo da pasta pai.

**Fluxos alternativos:**
- *Mover pasta existente:* O usuário arrasta uma pasta existente para dentro de outra pasta, transformando-a em subpasta.

**Fluxos de exceção:**
- *Profundidade máxima de pastas:* O sistema limita a hierarquia a no máximo 10 níveis de profundidade. Se o usuário tentar criar além disso, o sistema impede e exibe: "Limite de subpastas atingido (máximo 10 níveis)".

**Pós-condições:** A subpasta é criada sob a pasta pai, mantendo a relação de parentesco estruturada na base de dados.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a nova pasta apontando para o ID da pasta pai.
- [ ] A árvore lateral de arquivos deve permitir expandir e colapsar a subpasta mantendo seu estado (aberto/fechado) em cache.
- [ ] Mover um texto para a subpasta deve seguir a mesma lógica de hierarquia.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Mover textos entre pastas

**ID:** UC-012  
**Requisito relacionado:** RF-12 (mover textos entre pastas)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto já está em uma pasta e existe outra pasta de destino no projeto.  
**Gatilho:** O usuário arrasta o texto de uma pasta para outra na árvore de arquivos, ou usa a opção "Mover para Pasta".  

**Fluxo principal:**
1. O usuário clica com o botão direito sobre o texto e clica em "Mover para...".
2. O sistema exibe um modal contendo a árvore de pastas e subpastas disponíveis no projeto.
3. O usuário clica na pasta destino e confirma em "Mover".
4. O sistema atualiza o `id_pasta_pai` do texto para o ID da nova pasta destino.
5. O sistema remove o texto da visualização sob a pasta antiga e o insere na nova pasta na barra de navegação lateral.

**Fluxos alternativos:**
- *Arrastar e soltar direto:* O usuário arrasta o texto para fora da pasta antiga e o solta em cima da pasta nova.

**Fluxos de exceção:**
- *Pasta destino não existe:* Se a pasta de destino tiver sido excluída por outro colaborador simultaneamente, o sistema exibe "Esta pasta de destino já não existe. Atualizando lista de pastas..." e cancela a operação.

**Pós-condições:** O texto é realocado com sucesso na nova pasta hierárquica.

**Critérios de aceite:**
- [ ] A atualização do parentesco da pasta no banco de dados deve ocorrer em menos de 500ms.
- [ ] O menu de seleção de pasta no modal deve refletir a hierarquia de pastas completa e atualizada em tempo real.
- [ ] O usuário deve poder mover múltiplos textos selecionados de uma vez só (seleção múltipla e movimentação em lote).

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Organizar textos por tags

**ID:** UC-013  
**Requisito relacionado:** RF-13 (organizar textos por tags)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto está aberto no editor ou selecionado na lista de arquivos.  
**Gatilho:** O usuário clica na seção de Tags do documento.  

**Fluxo principal:**
1. O usuário clica na área "Adicionar Tags" no painel de metadados do texto.
2. O sistema exibe uma lista de tags já existentes no projeto com uma barra de busca e digitação rápida.
3. O usuário digita o nome de uma nova tag ou seleciona uma tag da lista.
4. O usuário confirma a seleção (ou aperta Enter).
5. O sistema vincula a tag ao documento (relação N:M entre textos e tags) no banco de dados.
6. A interface exibe a tag como um selo (*badge*) colorido ao lado do título ou no painel de metadados do texto.

**Fluxos alternativos:**
- *Remover tag:* O usuário clica no ícone "x" da tag correspondente para desvinculá-la do texto.

**Fluxos de exceção:**
- *Tag muito longa:* Se o usuário tentar criar uma tag com mais de 30 caracteres, o sistema trunca o input e notifica: "Tags devem ter no máximo 30 caracteres".

**Pós-condições:** A associação do texto à tag é registrada no banco de dados, permitindo buscas e filtros.

**Critérios de aceite:**
- [ ] O sistema deve salvar tags de forma case-insensitive para evitar duplicatas.
- [ ] A inserção de tags deve disparar atualizações instantâneas no indexador de busca.
- [ ] O usuário deve conseguir associar um número ilimitado de tags a um único texto.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Organizar textos por categorias

**ID:** UC-014  
**Requisito relacionado:** RF-14 (organizar textos por categorias)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O usuário tem textos criados e deseja classificá-los sob categorias temáticas gerais.  
**Gatilho:** O usuário acessa a barra lateral de controle de categorias ou o painel de propriedades do texto.  

**Fluxo principal:**
1. O usuário abre as configurações do projeto ou propriedades do texto e escolhe "Definir Categoria".
2. O sistema exibe as categorias padrão e customizadas do projeto (ex: Rascunho, Lore, Worldbuilding).
3. O usuário seleciona uma categoria ou cria uma nova categoria atribuindo um nome e uma cor correspondente.
4. O sistema grava a associação no banco de dados.
5. O painel do texto exibe o indicador de categoria com a cor associada.

**Fluxos alternativos:**
- *Filtro por categoria:* O usuário clica em uma categoria na listagem geral e o sistema exibe apenas os textos pertencentes a ela.

**Fluxos de exceção:**
- *Duplicidade de categoria:* Se o usuário tentar criar uma categoria com um nome que já existe no projeto, o sistema impede e exibe: "Uma categoria com este nome já existe".

**Pós-condições:** O texto fica classificado sob uma categoria específica, facilitando a filtragem global.

**Critérios de aceite:**
- [ ] Cada texto deve pertencer a no máximo uma categoria principal.
- [ ] O sistema deve permitir que o usuário gerencie (crie, edite a cor ou exclua) a lista global de categorias do projeto.
- [ ] Ao deletar uma categoria, os textos a ela associados devem voltar para o estado "Sem categoria" sem serem excluídos.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Reconhecer diversas línguas

**ID:** UC-015  
**Requisito relacionado:** RF-15 (reconhecer diversas línguas)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O usuário inseriu texto em um idioma suportado (português, inglês, espanhol, francês, alemão, italiano) no editor.  
**Gatilho:** O texto é salvo ou enviado para análise semântica.  

**Fluxo principal:**
1. O usuário digita ou cola um texto no editor.
2. O sistema executa um detector de idioma leve (algoritmo baseado em n-gramas ou biblioteca NLP) em segundo plano.
3. O sistema identifica o idioma dominante do texto com um score de confiança.
4. O sistema configura dinamicamente o dicionário do corretor ortográfico e os modelos NLP correspondentes àquele idioma para análises posteriores.

**Fluxos alternativos:**
- *Identificação incorreta:* O usuário pode ir no menu de configurações do documento e selecionar manualmente o idioma correto caso a detecção automática falhe.

**Fluxos de exceção:**
- *Idioma não suportado:* Se o sistema detectar um idioma para o qual não há modelo NLP ativo, ele exibe um aviso discreto: "Idioma não suportado para análise inteligente. Análises automáticas estarão indisponíveis".

**Pós-condições:** O idioma do texto é indexado nos metadados do documento e as ferramentas associadas (dicionário, IA) são inicializadas adequadamente.

**Critérios de aceite:**
- [ ] A precisão da detecção automática deve ser superior a 95% para blocos de texto contendo mais de 50 palavras nos idiomas principais (PT-BR, EN, ES).
- [ ] A detecção deve ser executada em background e concluída em menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Reconhecer palavras

**ID:** UC-016  
**Requisito relacionado:** RF-16 (reconhecer palavras)  
**Ator(es):** Sistema  
**Pré-condições:** O usuário está digitando no editor de texto.  
**Gatilho:** Digitação de caracteres terminados por espaço ou pontuação, ou carregamento de documento.  

**Fluxo principal:**
1. À medida que o usuário digita no editor, o sistema quebra o fluxo de texto em tokens (palavras) usando expressões regulares ajustadas ao idioma do documento.
2. O sistema valida cada token em relação ao dicionário ativo do idioma.
3. Se a palavra não for reconhecida no dicionário, o sistema a sinaliza visualmente com um sublinhado vermelho.

**Fluxos alternativos:**
- *Adicionar ao dicionário:* O usuário clica com o botão direito na palavra sublinhada e seleciona "Adicionar ao dicionário", fazendo com que o sistema passe a reconhecê-la no projeto.

**Fluxos de exceção:**
- *Dicionário inacessível:* Se o dicionário local/servidor falhar ao carregar, o sistema desabilita temporariamente a validação de palavras e remove os sublinhados vermelhos para evitar falsos alertas.

**Pós-condições:** O texto é analisado em nível de palavra e as palavras não reconhecidas são reportadas ao usuário.

**Critérios de aceite:**
- [ ] O tokenizador deve ignorar caracteres de controle e marcas de formatação Rich Text ao isolar as palavras.
- [ ] O reconhecimento e validação de palavras não devem causar latência ou lentidão visível na digitação (tempo de execução < 10ms).

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Reconhecer frases

**ID:** UC-017  
**Requisito relacionado:** RF-17 (reconhecer frases)  
**Ator(es):** Sistema  
**Pré-condições:** Um texto contendo orações e pontuações está inserido no editor.  
**Gatilho:** Fim de digitação de parágrafo ou salvamento do documento.  

**Fluxo principal:**
1. O sistema analisa o texto do documento.
2. O sistema aplica regras de divisão de sentenças (Sentence Boundary Disambiguation) com base em pontuações como pontos finais, pontos de exclamação e de interrogação, desconsiderando abreviações comuns.
3. O sistema mapeia os limites (início e fim) de cada frase no texto para análises semânticas, estilísticas e gramaticais subsequentes.

**Fluxos alternativos:**
- *Análise de legibilidade:* Com as frases delimitadas, o sistema calcula o comprimento médio das sentenças para gerar estatísticas de legibilidade (ex: fórmula Flesch-Kincaid).

**Fluxos de exceção:**
- *Uso excessivo de reticências ou pontuações incomuns:* O algoritmo usa regras heurísticas para agrupar pontuações contíguas como delimitadores únicos de frase, prevenindo a criação de frases vazias.

**Pós-condições:** O texto é estruturado internamente em frases lógicas mapeadas para uso em análises avançadas.

**Critérios de aceite:**
- [ ] O sistema deve segmentar frases corretamente com taxa de erro inferior a 3% em textos comuns.
- [ ] A quebra de frases deve ignorar diálogos marcados com travessão ou aspas quando não encerrarem a oração principal.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Reconhecer entidades (personagens, locais, objetos, organizações)

**ID:** UC-018  
**Requisito relacionado:** RF-18 (reconhecer entidades (personagens, locais, objetos, organizações))  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto possui conteúdo e a análise inteligente de entidades está ativa nas configurações.  
**Gatilho:** O usuário clica em "Detectar Entidades" ou o sistema executa a análise em background após o salvamento automático.  

**Fluxo principal:**
1. O sistema envia o texto do documento para o pipeline de Reconhecimento de Entidades Nomeadas (NER) baseado em IA.
2. O pipeline NER analisa o texto e identifica termos que representam pessoas, locais, objetos físicos e organizações, associando scores de probabilidade.
3. O sistema destaca visualmente no texto as entidades identificadas (ex: Personagens em azul, Locais em verde, etc.) com marcações sutis.
4. O usuário clica sobre uma entidade destacada para visualizar sua ficha descritiva ou criar uma nova entrada na wiki do projeto.

**Fluxos alternativos:**
- *Cadastro manual:* Se uma entidade não for detectada pela IA, o usuário pode selecionar o texto manualmente e clicar em "Marcar como Entidade", escolhendo seu tipo.

**Fluxos de exceção:**
- *Falso positivo de entidade:* Se a IA classify erroneamente uma palavra comum como personagem, o usuário pode clicar sobre ela e selecionar "Remover marcação de entidade" ou "Ignorar esta entidade neste documento".

**Pós-condições:** As entidades nomeadas identificadas são salvas e associadas ao texto no banco de dados.

**Critérios de aceite:**
- [ ] O modelo NER deve ser otimizado para lidar com nomes fictícios/fantásticos usando contexto gramatical (ex: precedido de pronomes ou verbos de ação).
- [ ] A extração deve categorizar as entidades em pelo menos quatro tipos: Personagem, Local, Objeto e Organização.
- [ ] A renderização gráfica das tags de entidades sobre o texto do editor deve ser dinâmica e não prejudicar a performance de rolagem.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Auto subpastear algo

**ID:** UC-019  
**Requisito relacionado:** RF-19 (auto subpastear algo)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui múltiplos textos na raiz ou soltos e uma estrutura de pastas principal.  
**Gatilho:** O usuário seleciona múltiplos textos soltos e clica no botão "Auto Subpastear" no painel de controle do projeto.  

**Fluxo principal:**
1. O usuário aciona a funcionalidade "Auto Subpastear" para um grupo de arquivos selecionados.
2. O sistema envia os metadados, títulos e conteúdo resumido dos arquivos selecionados para a IA em background.
3. A IA agrupa os arquivos por similaridade temática, cronologia ou tipo de conteúdo (ex: capítulos da mesma saga, fichas de personagens de um mesmo local).
4. O sistema sugere a criação de subpastas temáticas com as distribuições de arquivos propostas.
5. O usuário visualiza o mapa de movimentação sugerido e clica em "Confirmar Organização".
6. O sistema cria as subpastas sugeridas e move os respectivos arquivos para dentro delas no banco de dados.

**Fluxos alternativos:**
- *Ajuste manual da proposta:* Antes de confirmar, o usuário pode arrastar itens na tela de visualização para ajustar o destino final proposto.

**Fluxos de exceção:**
- *Falta de dados contextuais suficientes:* Se os textos forem muito curtos ou sem similaridade, o sistema aborta e informa: "Não foi possível agrupar os arquivos de forma inteligente devido à falta de similaridade textual evidente".

**Pós-condições:** Os textos são organizados em novas subpastas criadas dinamicamente com base nas semelhanças detectadas.

**Critérios de aceite:**
- [ ] O algoritmo de agrupamento deve utilizar embeddings semânticos para calcular a similaridade entre os documentos.
- [ ] A estrutura original dos arquivos só deve ser modificada após a confirmação expressa do usuário na tela de preview.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Agrupar palavras

**ID:** UC-020  
**Requisito relacionado:** RF-20 (agrupar palavras)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O usuário solicitou a análise lexical de um texto ou projeto.  
**Gatilho:** O usuário clica na ferramenta de "Análise Lexical" -> "Agrupar Palavras".  

**Fluxo principal:**
1. O usuário aciona a opção "Agrupar Palavras" no painel de estatísticas textuais do editor.
2. O sistema extrai todas as palavras do texto e remove stopwords correspondentes ao idioma do texto.
3. O sistema aplica o processo de lematização ou stemming para agrupar variações da mesma palavra raiz.
4. O sistema gera uma lista ordenada por frequência com os termos principais e suas variações agrupadas.
5. O sistema exibe o resultado na forma de uma nuvem de palavras interativa ou uma tabela de frequência.

**Fluxos alternativos:**
- *Filtro de exclusão:* O usuário pode clicar com o botão direito em uma palavra na lista e selecionar "Ocultar deste agrupamento" para refinar o resultado.

**Fluxos de exceção:**
- *Erro no processamento linguístico:* Se a lematização falhar, o sistema reverte para o agrupamento literal exato de palavras (case-insensitive) e exibe uma notificação informando o ocorrido.

**Pós-condições:** O sistema apresenta a distribuição e agrupamento lexical do documento para fins de análise estilística.

**Critérios de aceite:**
- [ ] O sistema de lematização deve carregar o dicionário correspondente ao idioma do texto em menos de 1 segundo.
- [ ] Stopwords comuns do português brasileiro devem ser ignoradas por padrão na geração da frequência.
- [ ] Clicar em um termo agrupado deve destacar todas as ocorrências de suas variações no editor de texto.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---

## Tabela Resumo: Lote 2 (UC-011 a UC-020)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-011** | RF-11 (organizar texto em subpastas) | Alta | Média |
| **UC-012** | RF-12 (mover textos entre pastas) | Crítica | Média |
| **UC-013** | RF-13 (organizar textos por tags) | Média | Baixa |
| **UC-014** | RF-14 (organizar textos por categorias) | Média | Baixa |
| **UC-015** | RF-15 (reconhecer diversas línguas) | Média | Média |
| **UC-016** | RF-16 (reconhecer palavras) | Alta | Baixa |
| **UC-017** | RF-17 (reconhecer frases) | Média | Média |
| **UC-018** | RF-18 (reconhecer entidades (personagens, locais, objetos, organizações)) | Alta | Alta |
| **UC-019** | RF-19 (auto subpastear algo) | Baixa | Alta |
| **UC-020** | RF-20 (agrupar palavras) | Média | Média |
