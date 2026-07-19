# Casos de Uso - Lote 3 (UC-021 a UC-030)

Este documento contém a especificação dos casos de uso de 21 a 30 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Agrupar textos semelhantes

**ID:** UC-021  
**Requisito relacionado:** RF-21 (agrupar textos semelhantes)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui múltiplos textos salvos.  
**Gatilho:** O usuário solicita o agrupamento de textos por semelhança semântica na aba de ferramentas.  

**Fluxo principal:**
1. O usuário acessa o menu de ferramentas do projeto e clica em "Agrupar Textos Semelhantes".
2. O sistema extrai o conteúdo de todos os textos ativos e gera vetores de embedding para cada um.
3. O sistema aplica um algoritmo de agrupamento (clustering, como K-Means ou DBSCAN) baseado na similaridade de cosseno entre os vetores.
4. O sistema apresenta os grupos sugeridos em um painel interativo (ex: "Grupo A: Magia e Feitiçaria", "Grupo B: Revolução Industrial").
5. O usuário seleciona quais grupos deseja consolidar em pastas ou marcar com tags em lote.
6. O usuário clica em "Aplicar Agrupamento".

**Fluxos alternativos:**
- *Ajuste de sensibilidade:* O usuário pode ajustar um slider de "Sensibilidade/Rigidez" para tornar os grupos mais amplos ou mais estritos antes de reprocessar.

**Fluxos de exceção:**
- *Textos insuficientes:* Se houver menos de 3 textos no projeto, o sistema cancela a operação e exibe: "Número insuficiente de textos para realizar agrupamento semântico (mínimo de 3 textos)".

**Pós-condições:** Os textos são categorizados, movidos ou tagueados de acordo com os grupos aceitos pelo usuário.

**Critérios de aceite:**
- [ ] O algoritmo deve processar e agrupar 100 textos em menos de 5 segundos.
- [ ] Os agrupamentos gerados devem possuir títulos sugeridos pela IA que reflitam o tema comum do grupo.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Procurar palavras

**ID:** UC-022  
**Requisito relacionado:** RF-22 (procurar palavras)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário tem o projeto aberto.  
**Gatilho:** O usuário clica no atalho Ctrl+F (ou na barra de busca global).  

**Fluxo principal:**
1. O usuário clica no campo de busca ou pressiona Ctrl+F.
2. O usuário digita uma palavra específica (ex: "espada").
3. O sistema varre o banco de dados indexado de textos do projeto procurando ocorrências literais exatas.
4. O sistema exibe uma lista de resultados contendo o nome do arquivo, a linha e um trecho do contexto onde a palavra aparece.
5. O usuário clica em um resultado e o sistema abre o arquivo no editor, rolando e destacando a palavra pesquisada.

**Fluxos alternativos:**
- *Busca case-sensitive:* O usuário marca a opção "Diferenciar maiúsculas de minúsculas" no painel de busca para restringir os resultados.

**Fluxos de exceção:**
- *Nenhum resultado encontrado:* O sistema apresenta uma mensagem discreta "Nenhuma ocorrência encontrada para '[palavra]'" e limpa os destaques na interface.

**Pós-condições:** As palavras correspondentes são listadas e destacadas na interface para o usuário.

**Critérios de aceite:**
- [ ] A busca em projetos de até 1 milhão de palavras deve ser concluída em menos de 200ms usando índices de texto invertido.
- [ ] O destaque visual (highlight) no editor de texto deve ser aplicado em todas as ocorrências simultaneamente.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Procurar frases

**ID:** UC-023  
**Requisito relacionado:** RF-23 (procurar frases)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário tem o projeto aberto.  
**Gatilho:** O usuário digita uma sequência de palavras entre aspas ou seleciona a opção "Buscar frase exata" na barra de busca.  

**Fluxo principal:**
1. O usuário abre o painel de busca avançada do projeto.
2. O usuário digita uma frase inteira (ex: "o segredo do castelo abandonado").
3. O sistema realiza uma busca por correspondência de frase exata (procurando a sequência exata de tokens contíguos no indexador).
4. O sistema lista os trechos de texto que contém a correspondência exata.
5. O usuário clica no trecho de interesse para abri-lo diretamente na linha correspondente no editor.

**Fluxos alternativos:**
- *Ignorar pontuação:* Por padrão, a busca ignora pontuações intermediárias (como vírgulas ou pontos de exclamação) para encontrar a frase correspondente.

**Fluxos de exceção:**
- *Texto de busca vazio:* O sistema desabilita o botão de busca enquanto o campo de entrada estiver vazio ou contiver apenas espaços.

**Pós-condições:** As frases correspondentes são exibidas e destacadas no editor ao serem selecionadas.

**Critérios de aceite:**
- [ ] O sistema deve encontrar correspondências mesmo que estejam separadas por quebras de linha suaves (soft-breaks).
- [ ] A velocidade da busca de frase exata em todo o projeto deve ser inferior a 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Procurar por contexto

**ID:** UC-024  
**Requisito relacionado:** RF-24 (procurar por contexto)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** O projeto possui busca vetorial semântica ativada e textos previamente indexados.  
**Gatilho:** O usuário digita uma consulta conceitual na barra de busca e seleciona "Busca Semântica/Por Contexto".  

**Fluxo principal:**
1. O usuário digita uma dúvida ou conceito (ex: "onde os personagens discutem a traição do rei").
2. O sistema envia a busca para um modelo de embedding que gera a representação vetorial da consulta.
3. O sistema calcula a similaridade vetorial contra os blocos de texto indexados no banco vetorial.
4. O sistema retorna os trechos de textos semanticamente mais próximos da intenção de busca do usuário, mesmo que não contenham as palavras exatas (ex: retorna cenas sobre "a deslealdade de Varian").
5. O usuário clica no resultado para ser levado ao trecho.

**Fluxos alternativos:**
- *Busca híbrida:* O sistema combina a pontuação de similaridade semântica (vetores) com busca lexical tradicional (BM25) para refinar a precisão.

**Fluxos de exceção:**
- *Banco de dados vetorial inacessível:* Se o serviço de busca vetorial falhar, o sistema exibe "Busca semântica indisponível no momento. Realizando busca padrão por palavras-chave" e reverte para a busca convencional.

**Pós-condições:** Os trechos semanticamente relevantes são apresentados ao usuário de forma ranqueada por relevância conceitual.

**Critérios de aceite:**
- [ ] Os resultados semânticos devem retornar em até 1,5 segundos.
- [ ] Cada resultado exibido deve mostrar a porcentagem de correspondência conceitual estimada pela IA.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Procurar personagens

**ID:** UC-025  
**Requisito relacionado:** RF-25 (procurar personagens)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens estão catalogados no projeto (manualmente ou via NER).  
**Gatilho:** O usuário abre a busca rápida de entidades e digita o nome de um personagem.  

**Fluxo principal:**
1. O usuário abre o painel de personagens do projeto.
2. O usuário digita o nome do personagem (ex: "Arthur") na barra de filtro rápido de entidades.
3. O sistema filtra instantaneamente os perfis de personagem cadastrados e exibe as menções a ele nos textos do projeto.
4. O usuário clica no resultado "Menções no Texto" e vê a lista de capítulos e frases onde o nome ou apelidos configurados aparecem.
5. Ao clicar em uma menção, o sistema abre o editor e foca na linha exata.

**Fluxos alternativos:**
- *Busca por apelido:* Se o personagem "Arthur" tiver cadastrado em sua ficha o apelido "Artie", a busca por "Artie" também retornará o personagem Arthur e suas respectivas menções.

**Fluxos de exceção:**
- *Personagem não catalogado:* Se o personagem não estiver na lista de entidades, o sistema oferece um link rápido: "Personagem não encontrado. Deseja cadastrar '[Nome]' como novo personagem?".

**Pós-condições:** O usuário localiza o perfil do personagem e todas as suas aparições nos textos.

**Critérios de aceite:**
- [ ] A indexação de menções deve mapear variações de nomes cadastradas na ficha de entidade do personagem.
- [ ] A busca e listagem das aparições de um personagem no projeto devem carregar em até 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Procurar locais

**ID:** UC-026  
**Requisito relacionado:** RF-26 (procurar locais)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Locais estão catalogados no projeto (manualmente ou via NER).  
**Gatilho:** O usuário abre o seletor de locais ou busca global e digita um local.  

**Fluxo principal:**
1. O usuário abre a aba de busca ou o atlas/mapa do projeto.
2. O usuário digita o nome do local desejado (ex: "Castelo de Winterfell").
3. O sistema filtra a base de dados de locais catalogados no projeto.
4. O sistema apresenta a ficha do local e a lista de textos em que esse local é mencionado ou serve de cenário.
5. O usuário clica em uma das menções e o sistema abre o arquivo no local correspondente.

**Fluxos alternativos:**
- *Filtrar textos por cenário:* O usuário seleciona o local na lista e clica em "Ver todos os textos ambientados aqui" para filtrar a barra lateral de navegação.

**Fluxos de exceção:**
- *Nenhum resultado:* O sistema notifica a ausência de registros e sugere criar um novo ponto de local com aquele nome no diretório.

**Pós-condições:** O local e suas menções textuais são exibidos.

**Critérios de aceite:**
- [ ] O sistema deve exibir a listagem de locais em ordem alfabética ou por número de menções no texto.
- [ ] A pesquisa deve retornar resultados parciais (ex: buscar "Winter" deve retornar "Winterfell").

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Procurar eventos

**ID:** UC-027  
**Requisito relacionado:** RF-27 (procurar eventos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos da linha do tempo/cronologia estão cadastrados no projeto.  
**Gatilho:** O usuário pesquisa por um evento na barra de busca cronológica ou global.  

**Fluxo principal:**
1. O usuário abre a linha do tempo ou o painel de busca de eventos.
2. O usuário digita palavras-chave associadas a um evento (ex: "Grande Batalha", "Coroação").
3. O sistema busca no título, descrição e data dos eventos cadastrados na timeline do projeto.
4. O sistema apresenta a lista de eventos correspondentes com suas datas cronológicas fictícias e os textos do projeto que estão vinculados a cada evento.
5. O usuário clica no evento e o sistema destaca a posição do evento na linha do tempo visual.

**Fluxos alternativos:**
- *Filtro por período:* O usuário pode buscar eventos definindo um intervalo de anos/datas (ex: do ano 1000 ao ano 1050).

**Fluxos de exceção:**
- *Nenhum evento no período:* O sistema informa que não há eventos cadastrados no intervalo selecionado e exibe uma linha do tempo vazia.

**Pós-condições:** O evento localizado é exibido no contexto da linha do tempo do projeto.

**Critérios de aceite:**
- [ ] O tempo de resposta para busca e renderização de eventos filtrados na linha do tempo deve ser menor que 500ms.
- [ ] Cada evento retornado na busca deve exibir sua data cronológica formatada e os links para os textos de cena relacionados.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Contabilizar palavras

**ID:** UC-028  
**Requisito relacionado:** RF-28 (contabilizar palavras)  
**Ator(es):** Sistema  
**Pré-condições:** Um texto está aberto no editor ou selecionado.  
**Gatilho:** Carregamento do documento ou alteração do conteúdo no editor de texto.  

**Fluxo principal:**
1. À medida que o usuário edita o texto, o sistema executa um contador em tempo real em segundo plano (Web Worker).
2. O algoritmo divide o texto utilizando espaços e marcadores de quebra de palavra como delimitadores e conta a quantidade de tokens resultantes.
3. O sistema atualiza o contador de palavras exibido no rodapé do editor de texto em tempo real (ex: "1.234 palavras").

**Fluxos alternativos:**
- *Contagem de seleção:* Se o usuário selecionar um trecho específico do texto com o mouse, o rodapé muda para exibir a contagem do trecho selecionado (ex: "150 de 1.234 palavras").

**Fluxos de exceção:**
- *Textos gigantescos:* Para evitar gargalos de CPU, para textos acima de 500k palavras o sistema executa o contador com throttling de 1 segundo e avisa se houver atraso na atualização do contador.

**Pós-condições:** O número exato de palavras do texto ou do trecho selecionado é exibido no rodapé.

**Critérios de aceite:**
- [ ] A contagem de palavras deve ser feita usando Web Workers para evitar bloqueio da thread principal da interface do usuário.
- [ ] O contador deve ser re-executado instantaneamente (< 50ms) a cada atualização do texto para documentos com menos de 20.000 palavras.
- [ ] Caracteres especiais e tags HTML/rich text do editor não devem ser computados na contagem final de palavras.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Contabilizar caracteres

**ID:** UC-029  
**Requisito relacionado:** RF-29 (contabilizar caracteres)  
**Ator(es):** Sistema  
**Pré-condições:** Um texto está aberto no editor ou selecionado.  
**Gatilho:** Modificação do conteúdo no editor de texto.  

**Fluxo principal:**
1. O usuário digita ou apaga caracteres no editor.
2. O sistema calcula o comprimento da string de texto puro (removendo tags de formatação) em tempo real.
3. O rodapé do editor atualiza o contador exibindo a quantidade de caracteres total.

**Fluxos alternativos:**
- *Excluir espaços:* O usuário clica sobre o contador de caracteres para alternar a exibição entre "com espaços" e "sem espaços".

**Fluxos de exceção:**
- *Nenhum erro esperado:* A contagem de caracteres é uma operação primitiva síncrona extremamente rápida.

**Pós-condições:** O número total de caracteres é exibido de forma legível no rodapé.

**Critérios de aceite:**
- [ ] O contador deve apresentar a quantidade com espaços (ex: "5.430 caracteres") por padrão.
- [ ] Ao alternar para "sem espaços", o cálculo deve subtrair todos os caracteres de espaço em branco (`\s`).
- [ ] As tags internas de formatação de Rich Text não podem ser somadas à contagem de caracteres do usuário.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Reconhecer contexto das palavras

**ID:** UC-030  
**Requisito relacionado:** RF-30 (reconhecer contexto das palavras)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto está aberto no editor e o processamento de linguagem natural por contexto está ativo.  
**Gatilho:** O usuário clica com o botão direito em uma palavra específica e escolhe "Verificar Sentido/Contexto".  

**Fluxo principal:**
1. O usuário clica com o botão direito sobre uma palavra no texto (ex: "banco") e seleciona "Verificar Sentido/Contexto".
2. O sistema envia a frase circundante (janela de contexto de 3 frases antes e depois) e a palavra em questão para a IA de NLP.
3. A IA analisa as relações sintáticas e semânticas da palavra na oração.
4. O sistema abre uma popover acima da palavra exibindo a definição contextual precisa (ex: classifica "banco" como "instituição financeira").
5. O sistema sugere sinônimos adequados especificamente para aquele sentido no contexto (ex: "instituição", "casa bancária").

**Fluxos alternativos:**
- *Desambiguação automática:* O sistema roda a análise em background no documento e gera links automáticos de termos específicos com base no contexto verificado.

**Fluxos de exceção:**
- *Ambiguidades insolúveis:* Se o contexto for muito curto (ex: frase isolada "Ele foi ao banco"), a IA apresenta as duas classificações mais prováveis com seus respectivos percentuais de certeza e pede para o usuário escolher o sentido pretendido.

**Pós-condições:** O sentido contextual da palavra é classificado e exibido na interface com sugestões de sinônimos contextualizados.

**Critérios de aceite:**
- [ ] A IA deve classificar palavras polissêmicas comuns com acurácia mínima de 90%.
- [ ] A resposta da desambiguação contextual em tempo real deve aparecer em até 1,2 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---

## Tabela Resumo: Lote 3 (UC-021 a UC-030)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-021** | RF-21 (agrupar textos semelhantes) | Média | Alta |
| **UC-022** | RF-22 (procurar palavras) | Crítica | Baixa |
| **UC-023** | RF-23 (procurar frases) | Alta | Média |
| **UC-024** | RF-24 (procurar por contexto) | Alta | Alta |
| **UC-025** | RF-25 (procurar personagens) | Alta | Média |
| **UC-026** | RF-26 (procurar locais) | Média | Baixa |
| **UC-027** | RF-27 (procurar eventos) | Média | Média |
| **UC-028** | RF-28 (contabilizar palavras) | Crítica | Baixa |
| **UC-029** | RF-29 (contabilizar caracteres) | Crítica | Baixa |
| **UC-030** | RF-30 (reconhecer contexto das palavras) | Alta | Alta |
