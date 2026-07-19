# Casos de Uso - Lote 4 (UC-031 a UC-040)

Este documento contém a especificação dos casos de uso de 31 a 40 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Reconhecer temas

**ID:** UC-031  
**Requisito relacionado:** RF-31 (reconhecer temas)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto do documento possui conteúdo suficiente (mínimo de 200 palavras) e a análise de IA está habilitada.  
**Gatilho:** O usuário clica em "Análise de Temas" ou o sistema executa a análise em background após o salvamento automático.  

**Fluxo principal:**
1. O sistema envia o texto do documento para o pipeline de análise temática por IA.
2. A IA processa o texto para extrair conceitos semânticos abstratos e recorrências de motivos narrativos (ex: "vingança", "redenção").
3. O sistema calcula a relevância e proporção de cada tema no texto.
4. O sistema exibe um relatório com os temas dominantes do documento no painel de análise lateral (ex: "Vingança (45%)", "Superação (30%)").
5. O usuário confirma ou ajusta manualmente a relevância dos temas atribuídos.

**Fluxos alternativos:**
- *Filtro de busca temática:* O usuário clica em um tema na lista do painel lateral e o sistema filtra outros textos do projeto que possuem temas semelhantes.

**Fluxos de exceção:**
- *Texto muito curto:* Se o documento possuir menos de 200 palavras, a análise temática é omitida e a interface exibe "Insira mais texto para realizar a análise de temas".

**Pós-condições:** Os temas reconhecidos são associados aos metadados do texto no banco de dados.

**Critérios de aceite:**
- [ ] A análise temática deve usar modelos de processamento semântico capazes de extrair conceitos que não aparecem literalmente no texto.
- [ ] O processamento e retorno da lista de temas de um capítulo de até 5.000 palavras devem demorar menos de 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Reconhecer palavras-chave

**ID:** UC-032  
**Requisito relacionado:** RF-32 (reconhecer palavras-chave)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto tem conteúdo no editor.  
**Gatilho:** O usuário clica em "Extrair Palavras-chave" ou o sistema executa em background após salvamento.  

**Fluxo principal:**
1. O sistema extrai o texto puro do editor.
2. O sistema executa um algoritmo estatístico (ex: TF-IDF, YAKE! ou KeyBERT) para encontrar os termos mais importantes e informativos do texto.
3. O sistema seleciona as 10 principais palavras-chave identificadas.
4. O sistema lista e exibe as palavras-chave no cabeçalho ou painel de metadados do texto.
5. O usuário seleciona quais palavras-chave deseja adicionar automaticamente como tags permanentes do documento.

**Fluxos alternativos:**
- *Remoção de palavra-chave sugerida:* O usuário clica no ícone "x" ao lado de uma palavra-chave sugerida para descartá-la.

**Fluxos de exceção:**
- *Texto sem termos significativos:* Se o texto for composto apenas por stopwords, nenhuma palavra-chave é gerada.

**Pós-condições:** As palavras-chave sugeridas e aprovadas são salvas como metadados do texto.

**Critérios de aceite:**
- [ ] O algoritmo deve ignorar stopwords e pontuações de forma nativa no idioma identificado.
- [ ] A extração de palavras-chave deve rodar em menos de 1 segundo para textos de tamanho padrão.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Linkar palavras a outras baseado no contexto

**ID:** UC-033  
**Requisito relacionado:** RF-33 (linkar palavras a outras baseado no contexto)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Existem termos semanticamente relacionados em diferentes textos do projeto.  
**Gatilho:** O usuário seleciona "Gerar Conexões Contextuais" ou passa o cursor sobre um termo sublinhado pelo sistema.  

**Fluxo principal:**
1. O sistema mapeia os termos de um documento e compara com termos de outros documentos do projeto usando a base de conhecimento (grafo semântico).
2. A IA identifica termos equivalentes ou relacionados contextualmente (ex: a palavra "Coroa" linkada ao termo "Monarquia").
3. O sistema cria um link contextual interativo sobre a palavra.
4. O usuário clica no link contextual e vê uma lista de palavras e trechos correlacionados com aquele termo em outros documentos.
5. O usuário clica em uma das sugestões para navegar até ela.

**Fluxos alternativos:**
- *Aceite manual:* O sistema sugere as conexões em uma barra lateral antes de transformar o texto do editor em links visíveis.

**Fluxos de exceção:**
- *Conexões irrelevantes:* Se a IA sugerir uma conexão inadequada, o usuário pode clicar em "Ignorar relação" para remover o link contextual daquela palavra específica.

**Pós-condições:** As conexões de palavras por contexto são salvas na tabela de relacionamentos do grafo do projeto.

**Critérios de aceite:**
- [ ] O sistema não deve sobrescrever links manuais inseridos pelo usuário.
- [ ] A criação de links baseados em contexto deve respeitar as desambiguações verificadas em UC-030 (sentido correto do termo).

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Linkar textos baseado no contexto

**ID:** UC-034  
**Requisito relacionado:** RF-34 (linkar textos baseado no contexto)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui múltiplos textos indexados com vetores semânticos.  
**Gatilho:** O usuário abre o painel lateral de "Documentos Relacionados" de um texto ativo.  

**Fluxo principal:**
1. O usuário abre um texto no editor.
2. O sistema envia a representação semântica do texto ativo para comparação contra os demais textos do projeto.
3. O sistema calcula a similaridade global de conteúdo e contexto entre os documentos.
4. O sistema lista na barra lateral os 5 textos com maior similaridade semântica (ex: "Capítulo 3 (85% de similaridade)", "Ficha: A Batalha de Eldoria (72% de similaridade)").
5. O usuário clica em "Vincular" em uma sugestão para criar um link de referência recíproca entre os textos.

**Fluxos alternativos:**
- *Auto-link:* O sistema vincula automaticamente na base de dados os textos que possuem mais de 80% de similaridade semântica, marcando a conexão como gerada por IA.

**Fluxos de exceção:**
- *Projetos com apenas um texto:* A barra lateral de documentos relacionados é oculta ou exibe a mensagem "Crie mais textos para ver as recomendações de conexão".

**Pós-condições:** A conexão referencial entre os documentos é estabelecida e salva no banco de dados.

**Critérios de aceite:**
- [ ] O sistema deve sugerir links bidirecionais entre os textos recomendados.
- [ ] A lista de recomendações contextuais de textos deve ser atualizada de forma assíncrona para não comprometer a digitação.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Linkar pasta baseado no contexto de seus textos

**ID:** UC-035  
**Requisito relacionado:** RF-35 (linkar pasta baseado no contexto de seus textos)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Existem pastas criadas que contêm múltiplos textos com conteúdos definidos.  
**Gatilho:** O usuário visualiza o grafo de conexões ou as propriedades de uma pasta.  

**Fluxo principal:**
1. O sistema consolida as representações semânticas (vetores) de todos os textos presentes dentro de uma determinada pasta ("Pasta A").
2. O sistema faz o mesmo para outras pastas do projeto.
3. A IA compara os perfis semânticos agregados das pastas para identificar relações temáticas fortes (ex: a pasta "Arco da Traição" possui alta correlação temática com a pasta "Reino do Norte").
4. O sistema sugere um link contextual entre as pastas na árvore de arquivos ou no painel de visualização em grafo.
5. O usuário clica em "Aprovar link entre pastas" para oficializar o relacionamento.

**Fluxos alternativos:**
- *Filtro no Grafo:* O usuário pode visualizar essa conexão no grafo geral para identificar conexões de alto nível entre grupos de textos.

**Fluxos de exceção:**
- *Pastas vazias:* Pastas sem textos dentro são desconsideradas no mapeamento e agrupamento contextual.

**Pós-condições:** A relação contextual entre pastas é registrada no banco de dados de relacionamentos do projeto.

**Critérios de aceite:**
- [ ] A consolidação vetorial deve ponderar textos mais longos ou marcados como "importantes" com pesos maiores.
- [ ] O cálculo de correlação de pastas deve rodar de forma assíncrona sob demanda para evitar sobrecarga.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Linkar personagens

**ID:** UC-036  
**Requisito relacionado:** RF-36 (linkar personagens)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens estão catalogados no diretório de entidades do projeto.  
**Gatilho:** O usuário abre a ficha de um personagem e clica em "Adicionar Relacionamento".  

**Fluxo principal:**
1. O usuário abre o perfil do "Personagem A".
2. O usuário clica no botão "Adicionar Relação com Personagem".
3. O sistema exibe um seletor modal com a lista de outros personagens cadastrados no projeto.
4. O usuário seleciona o "Personagem B" e escolhe o tipo de conexão (ex: "Aliado", "Mentor").
5. O usuário escreve uma breve descrição da relação (opcional).
6. O sistema cria a conexão no banco de dados de entidades.
7. A interface atualiza a árvore de relações exibindo o vínculo estabelecido.

**Fluxos alternativos:**
- *Link automático por texto:* O sistema detecta que o "Personagem A" e o "Personagem B" aparecem juntos frequentemente na mesma frase e sugere a criação de um link entre eles no painel lateral de sugestões.

**Fluxos de exceção:**
- *Relações circulares redundantes:* Se o usuário tentar criar uma relação idêntica à que já existe, o sistema exibe "Esta relação já está registrada" e cancela o salvamento.

**Pós-condições:** O vínculo entre os personagens é salvo na base de dados de relacionamentos do grafo do projeto.

**Critérios de aceite:**
- [ ] O sistema deve suportar tipos de relacionamentos simétricos e assimétricos.
- [ ] A conexão criada deve ser representada visualmente na tela de visualização em grafo.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Linkar locais

**ID:** UC-037  
**Requisito relacionado:** RF-37 (linkar locais)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Locais estão catalogados no projeto.  
**Gatilho:** O usuário gerencia os relacionamentos a partir da ficha de um local.  

**Fluxo principal:**
1. O usuário acessa a ficha técnica do "Local A".
2. O usuário seleciona a opção "Vincular a outro Local".
3. O sistema exibe a lista de locais cadastrados.
4. O usuário escolhe o "Local B" e define a natureza da ligação (ex: "Dentro de" para sublocais, "Fronteira com").
5. O sistema grava o relacionamento de localidade/geografia fictícia no banco de dados.

**Fluxos alternativos:**
- *Linkar local a personagem/evento:* O usuário vincula o Local à ficha de um personagem (ex: "Residência de") ou de um evento.

**Fluxos de exceção:**
- *Sublocal recursivo:* Se o usuário definir que o "Local A" está "Dentro de" "Local B", e depois tentar definir que "Local B" está "Dentro de" "Local A", o sistema bloqueia a ação e exibe: "Erro: Relação de pertencimento cíclica detectada".

**Pós-condições:** O relacionamento geográfico ou administrativo entre os locais é armazenado.

**Critérios de aceite:**
- [ ] A relação de hierarquia geográfica ("Dentro de") deve ser tratada de forma transitiva para fins de busca.
- [ ] O relacionamento deve ser refletido nos mapas e no grafo do universo.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Linkar objetos

**ID:** UC-038  
**Requisito relacionado:** RF-38 (linkar objetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Os objetos estão catalogados como entidades no projeto.  
**Gatilho:** O usuário acessa o menu de relacionamentos da ficha de um objeto.  

**Fluxo principal:**
1. O usuário acessa a ficha de um objeto (ex: "Anel do Poder").
2. O usuário seleciona a opção "Vincular Entidade".
3. O sistema abre a lista de entidades.
4. O usuário escolhe a entidade de destino (ex: escolhe o personagem "Frodo") e atribui a relação (ex: "Possuído por", "Escondido em").
5. O sistema grava o vínculo no banco de dados.
6. A ficha do objeto passa a exibir quem é o detentor atual e onde ele se encontra.

**Fluxos alternativos:**
- *Rastreamento automático:* O sistema atualiza o link de localização de um objeto analisando o texto das cenas em que o objeto é mencionado sendo movido.

**Fluxos de exceção:**
- *Múltiplos donos exclusivos:* Se a relação for de propriedade exclusiva e o usuário tentar associar a outro personagem, o sistema pergunta: "Este objeto pertence a [Personagem A]. Deseja transferir a posse para [Personagem B]?".

**Pós-condições:** O relacionamento do objeto com outras entidades do universo é persistido.

**Critérios de aceite:**
- [ ] O sistema deve listar na aba do objeto todas as suas conexões históricas de posse e localização.
- [ ] O objeto deve constar automaticamente no inventário da entidade vinculada.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Linkar eventos

**ID:** UC-039  
**Requisito relacionado:** RF-39 (linkar eventos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos estão criados no banco de dados do projeto.  
**Gatilho:** O usuário acessa o painel de edição de eventos ou a linha do tempo.  

**Fluxo principal:**
1. O usuário seleciona um evento (ex: "A Queda do Muro").
2. O usuário clica em "Vincular a outro Evento".
3. O sistema exibe os eventos catalogados.
4. O usuário seleciona o evento de destino e especifica a relação (ex: "Causa de", "Ocorre simultaneamente a").
5. O sistema grava o relacionamento temporal ou causal.
6. O sistema atualiza a visualização da linha do tempo, exibindo as setas de conexão ou agrupando eventos simultâneos.

**Fluxos alternativos:**
- *Causalidade implícita:* Ao vincular um evento como "Causa de" outro, o sistema marca o segundo automaticamente como "Consequência de", garantindo a correspondência reversa.

**Fluxos de exceção:**
- *Inconsistência cronológica:* Se o usuário tentar marcar um evento futuro como causa de um evento passado, o sistema emite um alerta: "Aviso: O evento causa possui uma data posterior ao evento consequência. Deseja prosseguir?".

**Pós-condições:** O relacionamento temporal e causal entre eventos é armazenado no banco de dados.

**Critérios de aceite:**
- [ ] A relação causal deve ser representada graficamente na tela da linha do tempo.
- [ ] O sistema deve validar loops de causalidade impedindo relações cíclicas.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Entitular textos e pastas

**ID:** UC-040  
**Requisito relacionado:** RF-40 (entitular textos e pastas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Um texto ou pasta está selecionado na árvore de arquivos.  
**Gatilho:** O usuário clica em "Renomear", dá um duplo clique sobre o título, ou altera o título no topo do editor de texto.  

**Fluxo principal:**
1. O usuário seleciona uma pasta ou texto e clica em "Renomear" no menu de opções.
2. O sistema ativa um campo de texto editável sobre o nome do item na árvore lateral.
3. O usuário digita o novo título (ex: "Capítulo I - O Retorno") e pressiona Enter.
4. O sistema valida o novo nome e envia uma requisição de atualização para a API do backend.
5. A API persiste o novo título no banco de dados e retorna a confirmação.
6. A árvore lateral é atualizada com o novo nome.

**Fluxos alternativos:**
- *Alteração no editor:* Se for um texto, o usuário pode digitar o título diretamente no campo de cabeçalho no topo da tela do editor de texto, sincronizando o nome automaticamente com a barra lateral.

**Fluxos de exceção:**
- *Nome inválido ou vazio:* Se o usuário deixar o nome em branco, o sistema impede a gravação, mantém o nome anterior e exibe um alerta sutil: "O nome não pode ficar em branco".

**Pós-condições:** O texto ou pasta é atualizado com o novo nome no banco de dados e na interface.

**Critérios de aceite:**
- [ ] O sistema deve remover automaticamente espaços em branco extras no início e fim do título fornecido pelo usuário.
- [ ] Caracteres especiais válidos e pontuações devem ser aceitos como parte dos títulos.
- [ ] O tamanho do título deve ser limitado a no máximo 150 caracteres.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa  

---

## Tabela Resumo: Lote 4 (UC-031 a UC-040)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-031** | RF-31 (reconhecer temas) | Média | Alta |
| **UC-032** | RF-32 (reconhecer palavras-chave) | Média | Média |
| **UC-033** | RF-33 (linkar palavras a outras baseado no contexto) | Alta | Alta |
| **UC-034** | RF-34 (linkar textos baseado no contexto) | Alta | Alta |
| **UC-035** | RF-35 (linkar pasta baseado no contexto de seus textos) | Média | Alta |
| **UC-036** | RF-36 (linkar personagens) | Alta | Média |
| **UC-037** | RF-37 (linkar locais) | Média | Média |
| **UC-038** | RF-38 (linkar objetos) | Média | Baixa |
| **UC-039** | RF-39 (linkar eventos) | Alta | Média |
| **UC-040** | RF-40 (entitular textos e pastas) | Crítica | Baixa |
