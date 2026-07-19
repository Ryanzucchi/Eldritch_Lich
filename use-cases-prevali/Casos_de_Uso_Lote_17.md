# Casos de Uso - Lote 17 (UC-161 a UC-170)

Este documento contém a especificação dos casos de uso de 161 a 170 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Exportar textos em formato PDF

**ID:** UC-161  
**Requisito relacionado:** RF-161 (exportar textos em formato PDF)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto a ser exportado existe e possui conteúdo.  
**Gatilho:** O usuário clica em "Exportar para PDF" nas opções do editor ou pasta.  

**Fluxo principal:**
1. O usuário abre um capítulo ou seleciona uma pasta de capítulos e escolhe "Exportar como PDF".
2. O sistema exibe um modal de configurações de exportação de PDF (margens, numeração, fonte, tamanho do papel e quebras de página).
3. O usuário ajusta as configurações e clica em "Gerar PDF".
4. O backend renderiza o texto em HTML e converte o stream para PDF utilizando bibliotecas de conversão.
5. O sistema inicia o download automático do arquivo `.pdf`.

**Fluxos alternativos:**
- *Exportar manuscrito completo:* O usuário seleciona a pasta raiz de textos e o sistema monta um único PDF consolidando todos os capítulos na sequência hierárquica.

**Fluxos de exceção:**
- *Mídia corrompida:* Se o texto contiver imagens que falharem no carregamento no servidor durante o render, o sistema as ignora e avisa o usuário de que o PDF foi gerado sem as respectivas mídias.

**Pós-condições:** O arquivo PDF com a formatação e paginação selecionadas é baixado pelo usuário.

**Critérios de aceite:**
- [ ] O PDF exportado deve reter cabeçalhos, rodapés e numeração sequencial configurados pelo usuário.
- [ ] A exportação de um capítulo de até 3.000 palavras deve demorar menos de 3 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Exportar textos em formato EPUB

**ID:** UC-162  
**Requisito relacionado:** RF-162 (exportar textos em formato EPUB)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto ou pasta selecionada existe no projeto.  
**Gatilho:** O usuário clica em "Exportar para EPUB" no menu de exportação.  

**Fluxo principal:**
1. O usuário seleciona "Exportar como EPUB (eBook)" no menu de exportação.
2. O sistema abre um formulário solicitando metadados do eBook: Título, Nome do Autor, Gênero e Imagem de Capa.
3. O usuário preenche as informações, envia a capa e clica em "Gerar EPUB".
4. O backend agrupa os capítulos e gera o arquivo estruturado compactado no padrão EPUB.
5. O sistema inicia o download automático do arquivo `.epub`.

**Fluxos alternativos:**
- *Layout fluido:* O sistema gera o EPUB com layout flexível que se adapta a leitores de diversos tamanhos de e-reader.

**Fluxos de exceção:**
- *Capítulos sem título:* Se houver capítulos sem nome, o sistema atribui títulos temporários estruturados (ex: "Capítulo X") na tabela de conteúdos (TOC).

**Pós-condições:** O arquivo digital EPUB compatível com leitores digitais é gerado e baixado.

**Critérios de aceite:**
- [ ] O EPUB gerado deve passar com sucesso no validador oficial `epubcheck`.
- [ ] O arquivo gerado deve conter o Sumário interativo funcional (TOC).

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Exportar textos em formato DOCX

**ID:** UC-163  
**Requisito relacionado:** RF-163 (exportar textos em formato DOCX)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto a ser exportado está disponível no projeto.  
**Gatilho:** O usuário clica em "Exportar para DOCX" no menu de opções.  

**Fluxo principal:**
1. O usuário seleciona o capítulo ou livro e clica em "Exportar como DOCX (Word)".
2. O sistema abre opções de layout e estilos (fontes padrão, espaçamento entre linhas e recuo de parágrafo).
3. O usuário seleciona as preferências e clica em "Gerar Documento".
4. O backend converte a árvore do editor de rich-text para a estrutura XML padrão OpenXML (.docx).
5. O sistema inicia o download automático do arquivo `.docx`.

**Fluxos alternativos:**
- *Incluir notas de rodapé:* O usuário ativa a opção "Exportar comentários como Notas de Revisão", gerando balões de revisão nativos do Word.

**Fluxos de exceção:**
- *Falha na conversão de tabelas:* Se o texto contiver tabelas complexas e o parser falhar, o sistema as exporta no formato de texto tabulado simples.

**Pós-condições:** O arquivo DOCX formatado e editável para editores de texto de mercado é baixado.

**Critérios de aceite:**
- [ ] O DOCX exportado deve respeitar a estrutura de parágrafos, recuos, cores e formatações de cabeçalhos (H1, H2, H3).
- [ ] O processamento do DOCX deve ser feito em menos de 2 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Visualizar modo tela cheia (editor)

**ID:** UC-164  
**Requisito relacionado:** RF-164 (visualizar modo tela cheia (editor))  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O editor de texto está aberto.  
**Gatilho:** O usuário clica no ícone de "Maximizar/Tela Cheia" no cabeçalho do editor.  

**Fluxo principal:**
1. O usuário clica em "Tela Cheia do Editor".
2. O sistema aciona o modo de tela cheia para o editor de texto via Fullscreen API do navegador.
3. O navegador passa a exibir apenas a folha digital do editor na tela inteira, ocultando as abas do navegador e a barra de tarefas do sistema operacional.

**Fluxos alternativos:**
- *Modo Cenário:* O editor oculta o cursor e a barra de rolagem se o usuário passar mais de 5 segundos sem digitar, mantendo apenas o texto.

**Fluxos de exceção:**
- *Atalho bloqueado:* Caso o navegador bloqueie o foco, o sistema ajusta o foco do teclado para garantir que a digitação permaneça ativa.

**Pós-condições:** O editor de texto é exibido em modo tela cheia no monitor do usuário.

**Critérios de aceite:**
- [ ] Pressionar a tecla 'Esc' ou clicar no ícone de fechar deve desativar instantaneamente o modo de tela cheia.
- [ ] O modo tela cheia do editor deve ser independente do modo foco, mantendo seletivamente barras laterais caso o usuário deseje.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Criar cronologia alternativa (linha do tempo paralela)

**ID:** UC-165  
**Requisito relacionado:** RF-165 (criar cronologia alternativa)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A timeline geral (principal) do projeto existe.  
**Gatilho:** O usuário clica em "Criar Cronologia Alternativa" no painel da Timeline.  

**Fluxo principal:**
1. O usuário acessa a seção "Timelines" do projeto.
2. O usuário clica no botão "Nova Cronologia Paralela".
3. O sistema abre um modal solicitando um título e uma descrição.
4. O sistema oferece a opção de duplicar eventos da cronologia principal. O usuário escolhe "Cronologia em branco".
5. O sistema grava a nova cronologia no banco de dados vinculada ao projeto.
6. A interface atualiza o seletor de timelines e carrega o painel vazio da nova cronologia alternativa.

**Fluxos alternativos:**
- *Clonar linha principal:* O usuário duplica a timeline principal para simular uma realidade alternativa ("E se?") a partir de um evento específico.

**Fluxos de exceção:**
- *Limite de timelines:* O sistema impede a criação se o usuário exceder o limite de timelines do plano ativo, sugerindo upgrade de assinatura.

**Pós-condições:** Uma nova linha do tempo alternativa é criada de forma isolada na base do projeto.

**Critérios de aceite:**
- [ ] A cronologia alternativa deve permitir adicionar novos eventos com datas próprias sem afetar os eventos da cronologia principal.
- [ ] A gravação e inicialização da nova linha do tempo devem levar menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Alternar entre cronologias

**ID:** UC-166  
**Requisito relacionado:** RF-166 (alternar entre cronologias)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem pelo menos duas cronologias cadastradas no projeto.  
**Gatilho:** O usuário interage com o dropdown de seletor de timelines.  

**Fluxo principal:**
1. O usuário visualiza a "Linha do Tempo Principal" aberta.
2. O usuário clica no seletor de timelines no topo do painel.
3. O sistema exibe a lista de cronologias ativas no projeto.
4. O usuário clica na cronologia alternativa desejada.
5. O sistema descarrega os eventos anteriores, executa a busca e renderiza os eventos cronológicos da nova linha selecionada.

**Fluxos alternativos:**
- *Comparação Split View:* O usuário clica em "Comparar Timelines" e a tela divide-se verticalmente exibindo as duas linhas do tempo em paralelo para verificação side-by-side.

**Fluxos de exceção:**
- *Erro de rede:* O sistema exibe "Erro ao carregar linha do tempo" e mantém a visualização anterior na tela do usuário.

**Pós-condições:** O painel de timelines exibe a cronologia selecionada pelo usuário.

**Critérios de aceite:**
- [ ] O tempo total de transição visual ao alternar cronologias (até 100 eventos) deve ser menor que 1 segundo.
- [ ] O sistema deve guardar no estado da sessão qual timeline estava aberta por último para restaurar no próximo acesso.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Associar eventos da cronologia a locais específicos

**ID:** UC-167  
**Requisito relacionado:** RF-167 (associar eventos da cronologia a locais específicos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de locais cadastrados e eventos de timeline existentes.  
**Gatilho:** O usuário edita as propriedades de um evento da timeline.  

**Fluxo principal:**
1. O usuário abre o formulário de edição de um evento na timeline.
2. O usuário clica no campo "Local do Evento".
3. O sistema abre uma caixa de pesquisa autocomplete listando os locais cadastrados no projeto.
4. O usuário digita o nome e seleciona o local correspondente.
5. O usuário clica em "Salvar".
6. O sistema atualiza o atributo `local_id` do evento no banco de dados.
7. O card do evento na timeline passa a exibir uma tag clicável do local.

**Fluxos alternativos:**
- *Navegação reversa:* O usuário abre a ficha técnica de um local e visualiza a listagem cronológica de todos os eventos da timeline que ocorreram ali.

**Fluxos de exceção:**
- *Local excluído:* Se o local associado for excluído do projeto, o evento da timeline remove a tag associada automaticamente, mantendo o registro do evento consistente.

**Pós-condições:** O evento cronológico é vinculado à coordenada lógica da ficha de local correspondente.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a chave estrangeira de relacionamento de forma indexada.
- [ ] A tag do local no card da timeline deve abrir a ficha do local correspondente em um painel split-view ao ser clicada.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Visualizar eventos no mapa geográfico

**ID:** UC-168  
**Requisito relacionado:** RF-168 (visualizar eventos no mapa geográfico)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O mapa geográfico interativo está criado e possui locais associados a eventos de cronologia.  
**Gatilho:** O usuário acessa a "Visualização de Eventos no Mapa" no atlas.  

**Fluxo principal:**
1. O usuário abre o mapa geográfico do projeto.
2. O usuário clica em "Exibir Camada de Eventos".
3. O sistema exibe uma barra de controle temporal (Time Slider) no rodapé e renderiza marcadores nos locais que possuem eventos de timeline associados.
4. O usuário arrasta o controle do Time Slider.
5. À medida que o tempo avança no slider, pinos de eventos acendem ou desaparecem nos locais correspondentes do mapa.
6. O usuário clica sobre o pino de evento ativo no mapa para abrir um popover com o resumo do evento cronológico.

**Fluxos alternativos:**
- *Modo história animado:* O usuário clica em "Play" e o mapa passa automaticamente as datas da timeline, animando o surgimento das ocorrências no mapa.

**Fluxos de exceção:**
- *Eventos sem locais:* Eventos da timeline sem localizações são omitidos do mapa, mas listados em um painel lateral auxiliar.

**Pós-condições:** O usuário visualiza espacialmente os acontecimentos cronológicos ocorridos no mapa ao longo do tempo.

**Critérios de aceite:**
- [ ] O marcador do evento no mapa deve possuir um ícone semântico correspondente ao tipo do evento.
- [ ] A animação do avanço de tempo e atualização de pinos no mapa deve rodar em tempo real de forma fluida.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Filtrar eventos por personagem

**ID:** UC-169  
**Requisito relacionado:** RF-169 (filtrar eventos por personagem)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos da timeline possuem personagens associados.  
**Gatilho:** O usuário interage com o filtro de personagens na timeline.  

**Fluxo principal:**
1. O usuário visualiza o painel da Timeline do projeto.
2. O usuário abre o filtro "Personagens" e seleciona um personagem (ex: "Arthur").
3. O sistema oculta da tela todos os eventos de timeline nos quais o personagem selecionado não é citado ou participante.
4. O sistema exibe apenas a sequência cronológica dos eventos relacionados a "Arthur".
5. A interface exibe a confirmação de filtro ativo.

**Fluxos alternativos:**
- *Filtro múltiplo:* O usuário seleciona dois personagens com a regra "E / Interseção" ativa, exibindo apenas eventos com a presença conjunta de ambos.

**Fluxos de exceção:**
- *Nenhum evento correspondente:* Se o personagem não tiver participado de eventos cronológicos, a timeline exibe a mensagem: "Nenhum evento cadastrado para este personagem".

**Pós-condições:** A linha do tempo renderiza apenas os eventos nos quais o personagem selecionado atua.

**Critérios de aceite:**
- [ ] O filtro deve processar a ocultação e reorganização dos cards na timeline em menos de 100ms.
- [ ] A interface deve fornecer um botão claro de "Limpar Filtro".

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Filtrar eventos por local

**ID:** UC-170  
**Requisito relacionado:** RF-170 (filtrar eventos por local)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos da timeline possuem locais associados.  
**Gatilho:** O usuário interage com o filtro de local no painel de timeline.  

**Fluxo principal:**
1. O usuário visualiza o painel de timeline do projeto.
2. O usuário abre o filtro "Locais" no cabeçalho e seleciona um local (ex: "Eldoria").
3. O sistema varre os eventos e oculta todos aqueles que não ocorreram em "Eldoria".
4. A timeline passa a exibir apenas a cronologia de acontecimentos restrita àquela localidade.
5. O usuário visualiza de forma linear a história exclusiva daquele local.

**Fluxos alternativos:**
- *Filtro direto a partir da ficha:* O usuário abre a ficha técnica do local e clica em "Ver Timeline do Local", abrindo o painel de timelines com o filtro pré-aplicado.

**Fluxos de exceção:**
- *Sem locais correspondentes:* Se não existirem eventos na localidade selecionada, exibe "Nenhum evento registrado nesta localidade".

**Pós-condições:** O painel de timeline exibe apenas os eventos cronológicos ambientados no local selecionado.

**Critérios de aceite:**
- [ ] O filtro de local deve funcionar de forma combinada com outros filtros ativos (ex: filtrar por local e por personagem).
- [ ] A transição e recálculo dos cards da timeline devem demorar menos de 100ms.

---

## Tabela Resumo: Lote 17 (UC-161 a UC-170)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-161** | RF-161 (exportar textos em formato PDF) | Alta | Média |
| **UC-162** | RF-162 (exportar textos em formato EPUB) | Alta | Alta |
| **UC-163** | RF-163 (exportar textos em formato DOCX) | Alta | Média |
| **UC-164** | RF-164 (visualizar modo tela cheia) | Alta | Baixa |
| **UC-165** | RF-165 (criar cronologia alternativa) | Média | Média |
| **UC-166** | RF-166 (alternar entre cronologias) | Média | Baixa |
| **UC-167** | RF-167 (associar eventos a locais específicos) | Alta | Média |
| **UC-168** | RF-168 (visualizar eventos no mapa) | Média | Alta |
| **UC-169** | RF-169 (filtrar eventos por personagem) | Alta | Média |
| **UC-170** | RF-170 (filtrar eventos por local) | Alta | Média |
