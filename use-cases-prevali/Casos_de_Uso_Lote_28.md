# Casos de Uso - Lote 28 (UC-271 a UC-280)

Este documento contém a especificação dos casos de uso de 271 a 280 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Pesquisar imagens por tag/entidade

**ID:** UC-271  
**Requisito relacionado:** RF-271 (pesquisar imagens por tag/entidade)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem imagens registradas com tags ou associadas a fichas de entidades.  
**Gatilho:** O usuário digita um termo na caixa de buscas da Galeria de Mídias.  

**Fluxo principal:**
1. O usuário acessa a galeria e clica no campo de pesquisa.
2. O usuário digita o termo correspondente (ex: nome de um personagem ou tag "brasão").
3. O sistema realiza a busca nas colunas de metadados e tabelas de relacionamento.
4. O sistema filtra e atualiza a grade em tempo real, exibindo apenas as imagens vinculadas ao personagem pesquisado ou marcadas com a tag correspondente.
5. O usuário visualiza as correspondências.

**Fluxos alternativos:**
- *Filtro por extensão:* O usuário filtra simultaneamente pela extensão do arquivo (ex: exibir apenas arquivos de extensão .svg).

**Fluxos de exceção:**
- *Sem resultados:* Se não houver mídias associadas à pesquisa, o sistema exibe "Nenhuma imagem correspondente encontrada".

**Pós-condições:** A grade da galeria exibe apenas as imagens filtradas de acordo com as chaves selecionadas.

**Critérios de aceite:**
- [ ] A busca deve cruzar referências de nomes oficiais de entidades cadastrados.
- [ ] O tempo de resposta do filtro deve ser menor que 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Excluir imagens da galeria

**ID:** UC-272  
**Requisito relacionado:** RF-272 (excluir imagens da galeria)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A imagem a ser excluída está cadastrada no projeto.  
**Gatilho:** O usuário clica em "Excluir" nas opções de uma imagem na galeria.  

**Fluxo principal:**
1. O usuário abre a Galeria de Mídias.
2. O usuário clica no ícone de lixeira (Excluir) em cima do card da imagem selecionada.
3. O sistema abre uma caixa de diálogo avisando sobre a exclusão e desvinculação da imagem de fichas de entidades.
4. O usuário confirma.
5. O sistema remove o registro do banco de dados e deleta o arquivo físico do servidor.
6. A grade da galeria é atualizada removendo a miniatura.

**Fluxos alternativos:**
- *Excluir em lote:* O usuário seleciona múltiplas imagens na galeria e clica no botão "Excluir Selecionados".

**Fluxos de exceção:**
- *Imagem em uso no texto:* Se a imagem estiver em uso no corpo de algum capítulo de texto ativo, o sistema alerta o usuário. Se ele confirmar, o link correspondente no texto passa a renderizar um ícone quebrado de mídia.

**Pós-condições:** O arquivo de imagem é apagado fisicamente dos servidores da plataforma.

**Critérios de aceite:**
- [ ] A exclusão física do arquivo de armazenamento no servidor deve ocorrer de forma síncrona com a exclusão do banco de dados.
- [ ] O tempo total de exclusão deve ser menor que 1 segundo.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Compactar imagens automaticamente no upload (otimização)

**ID:** UC-273  
**Requisito relacionado:** RF-273 (compactar imagens automaticamente no upload)  
**Ator(es):** Sistema  
**Pré-condições:** O usuário iniciou o upload de um arquivo de imagem de alta resolução.  
**Gatilho:** Envio do arquivo de imagem à API de uploads do backend.  

**Fluxo principal:**
1. O usuário seleciona uma imagem pesada para carregar no perfil ou ficha técnica.
2. O backend recebe o arquivo na pasta temporária.
3. O sistema aciona um pipeline de compressão de imagem em background.
4. O script de otimização converte a imagem para o formato WebP, limita as dimensões máximas de largura/altura mantendo a proporção, e aplica compressão de qualidade imperceptível ao olho humano.
5. A imagem final comprimida e otimizada é salva na nuvem de armazenamento e vinculada à ficha do usuário.

**Fluxos alternativos:**
- *Gerar miniaturas:* O sistema gera adicionalmente uma cópia miniatura em resolução baixa para ser usada como avatar em cabeçalhos sem sobrecarregar a banda de rede.

**Fluxos de exceção:**
- *Arquivos vetoriais/gifs:* Se o arquivo for um vetor (.svg) ou animação (.gif), o sistema ignora a compressão e salva o arquivo original intacto para não corromper o formato.

**Pós-condições:** A imagem otimizada e convertida em WebP é armazenada no servidor.

**Critérios de aceite:**
- [ ] A taxa de redução média de tamanho de arquivos JPG/PNG convertidos em WebP deve ser de pelo menos 60%.
- [ ] O processamento e compressão da imagem devem demorar menos de 1,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Baixar imagens individuais da galeria

**ID:** UC-274  
**Requisito relacionado:** RF-274 (baixar imagens individuais da galeria)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A imagem existe e está cadastrada na galeria de mídias do projeto.  
**Gatilho:** O usuário clica no botão "Baixar Imagem" no lightbox da galeria.  

**Fluxo principal:**
1. O usuário acessa a Galeria de Mídias e abre a imagem desejada em modo lightbox.
2. O usuário clica no botão "Baixar Original" ou "Download".
3. O sistema recupera a URL física do arquivo no servidor e força a resposta HTTP contendo os cabeçalhos de download.
4. O navegador inicia o download do arquivo diretamente para a pasta local correspondente da máquina do usuário.

**Fluxos alternativos:**
- *Salvar imagem de capa:* O usuário clica com o botão direito na foto da capa do projeto e seleciona "Salvar imagem como" nativo do navegador para download imediato.

**Fluxos de exceção:**
- *Erro de mídia:* Se a URL da imagem estiver corrompida na nuvem, o sistema alerta: "Falha no download. Arquivo de mídia indisponível".

**Pós-condições:** O arquivo físico da imagem original é baixado na máquina do usuário.

**Critérios de aceite:**
- [ ] O download deve fornecer o arquivo na mesma resolução e formato cadastrados após otimização (WebP/PNG/JPG).
- [ ] O início do download no navegador deve ser instantâneo.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Exportar todas as imagens do projeto (.zip)

**ID:** UC-275  
**Requisito relacionado:** RF-275 (exportar todas as imagens do projeto (.zip))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui imagens e arquivos de mídia salvos na galeria.  
**Gatilho:** O usuário clica em "Exportar Todas as Mídias (.zip)" no painel da galeria.  

**Fluxo principal:**
1. O usuário acessa a Galeria de Mídias.
2. O usuário clica em "Exportar Tudo para ZIP" nas opções do cabeçalho.
3. O backend varre a lista de mídias associadas ao projeto, transfere os arquivos originais e os compacta em um único arquivo ZIP.
4. O sistema gera o arquivo compactado `mídias_[nome_do_projeto].zip`.
5. O navegador inicia o download automático do arquivo.

**Fluxos alternativos:**
- *Exportação setorial:* O usuário opta por exportar apenas a pasta compactada contendo "Mapas" ou "Retratos de Personagens".

**Fluxos de exceção:**
- *Galeria vazia:* Se o projeto não contiver imagens cadastradas, o botão de exportação é exibido desabilitado com o aviso "Nenhuma mídia disponível para exportação".

**Pós-condições:** O arquivo compactado ZIP contendo a totalidade das imagens do projeto é baixado.

**Critérios de aceite:**
- [ ] O ZIP gerado deve organizar as mídias em pastas internas coerentes com as categorias correspondentes.
- [ ] O tempo total de compressão de um lote de até 50 imagens deve ser menor que 5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Cadastrar fichas de criaturas/monstros (bestiário)

**ID:** UC-276  
**Requisito relacionado:** RF-276 (cadastrar fichas de criaturas/monstros)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na seção de worldbuilding (fauna e flora) do projeto.  
**Gatilho:** O usuário clica em "Nova Criatura / Monstro" no menu do bestiário.  

**Fluxo principal:**
1. O usuário acessa o menu lateral e clica em "Bestiário" -> "Nova Ficha de Criatura".
2. O sistema abre uma ficha técnica padrão do bestiário contendo campos: Nome da Espécie, Classificação, Descrição Física, Habilidades/Poderes, Fraquezas e Dieta.
3. O usuário insere as informações da criatura.
4. O usuário clica em "Salvar".
5. O sistema grava o registro de criatura no banco de dados.
6. A criatura passa a constar na barra lateral sob o diretório "Bestiário".

**Fluxos alternativos:**
- *Criar subespécie:* O usuário duplica a ficha de uma criatura para criar uma variação (subespécie) herdando a maioria dos atributos e alterando apenas fraquezas ou cores.

**Fluxos de exceção:**
- *Nome duplicado:* O sistema solicita um nome diferente caso a espécie já exista.

**Pós-condições:** A ficha da criatura é cadastrada no bestiário do projeto.

**Critérios de aceite:**
- [ ] A ficha do bestiário deve aceitar marcações de tags personalizadas para permitir filtros de busca rápidos.
- [ ] O salvamento da nova criatura no banco de dados deve levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Associar locais a criaturas/monstros (habitat)

**ID:** UC-277  
**Requisito relacionado:** RF-277 (associar locais a criaturas/monstros)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de locais e criaturas cadastradas no projeto.  
**Gatilho:** O usuário edita as propriedades geográficas na ficha da criatura ou no mapa.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de uma criatura.
2. No painel de ecologia, o usuário clica em "Adicionar Habitat/Local".
3. O sistema abre a busca autocomplete de locais do projeto.
4. O usuário seleciona o local desejado e define o status de presença (Dropdown: Comum, Raro, Extinto).
5. O usuário clica em "Confirmar".
6. O sistema grava a relação de habitat no banco de dados.
7. A ficha da criatura passa a listar o local como habitat oficial e a ficha do local lista a espécie correspondente.

**Fluxos alternativos:**
- *Marcar no atlas:* O usuário arrasta a ficha da criatura e a solta sobre uma coordenada do mapa geográfico, marcando a posição como habitat ou local de avistamento.

**Fluxos de exceção:**
- *Local excluído:* A associação correspondente é removida automaticamente da ficha da criatura caso o local seja excluído do projeto.

**Pós-condições:** A associação de habitat da criatura é salva no banco de dados do projeto.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a chave estrangeira de relacionamento de forma íntegra.
- [ ] A atualização do habitat deve refletir no mapa geográfico adicionando ícones correspondentes se a camada de fauna estiver ativa.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Filtrar criaturas/monstros por local (habitat)

**ID:** UC-278  
**Requisito relacionado:** RF-278 (filtrar criaturas/monstros por local)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de criaturas com habitats associados configuradas.  
**Gatilho:** O usuário filtra a listagem de diretório de criaturas por local.  

**Fluxo principal:**
1. O usuário acessa a listagem do "Bestiário" na barra lateral.
2. O usuário clica no seletor de filtros e seleciona a opção "Habitats / Locais".
3. O usuário seleciona o local desejado.
4. O sistema processa e oculta da lista todas as criaturas que não tenham o local correspondente marcado como habitat.
5. O usuário visualiza apenas a lista de animais e monstros nativos daquela região.

**Fluxos alternativos:**
- *Filtro no atlas:* O usuário clica em "Exibir Fauna" na visualização do atlas e filtra para exibir apenas pinos de criaturas agressivas no mapa geográfico.

**Fluxos de exceção:**
- *Sem fauna:* Se o local selecionado não possuir espécies associadas, a listagem exibe "Nenhuma criatura registrada neste habitat".

**Pós-condições:** O diretório de criaturas exibe apenas as espécies correspondentes ao filtro de local selecionado.

**Critérios de aceite:**
- [ ] O processamento do filtro de criaturas deve demorar menos de 100ms.
- [ ] A interface deve fornecer um botão claro de limpar filtros com um clique.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Criar habilidades de criaturas/monstros

**ID:** UC-279  
**Requisito relacionado:** RF-279 (criar habilidades de criaturas/monstros)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A ficha da criatura está cadastrada no bestiário.  
**Gatilho:** O usuário adiciona ou edita habilidades específicas na ficha da criatura.  

**Fluxo principal:**
1. O usuário abre a ficha de uma criatura no bestiário.
2. O usuário acessa o painel de "Habilidades Naturais".
3. O usuário clica em "Nova Habilidade".
4. O sistema abre campos solicitando: Nome da Habilidade, Tipo (Ativo/Passivo), Efeito e Frequência de uso.
5. O usuário preenche as informações e clica em "Salvar".
6. O sistema grava a habilidade na tabela de atributos de poderes de criaturas do bestiário.
7. A habilidade passa a constar com estilo destacado no perfil da criatura.

**Fluxos alternativos:**
- *Vincular a árvore de magias:* O usuário seleciona uma habilidade já cadastrada na árvore de magias global do projeto em vez de criar uma habilidade exclusiva de criatura.

**Fluxos de exceção:**
- *Nome em branco:* O sistema impede o salvamento caso o nome da habilidade esteja em branco.

**Pós-condições:** A habilidade da criatura é salva e anexada ao perfil do bestiário.

**Critérios de aceite:**
- [ ] A interface deve permitir listar as habilidades da criatura em formato de lista simples recolhível para otimizar espaço.
- [ ] O tempo total de salvamento deve ser de no máximo 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Associar imagens a fichas de criaturas/monstros (ilustrações)

**ID:** UC-280  
**Requisito relacionado:** RF-280 (associar imagens a fichas de criaturas/monstros)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A ficha da criatura está cadastrada e o arquivo de imagem está disponível localmente ou na galeria.  
**Gatilho:** O usuário clica em "Adicionar Ilustração" na ficha da criatura.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de uma criatura no bestiário.
2. No cabeçalho da ficha, o usuário clica sobre a área de imagem "Adicionar Ilustração/Foto".
3. O sistema abre o modal de seleção da Galeria de Mídias.
4. O usuário seleciona ou faz o upload da ilustração correspondente e confirma.
5. O sistema processa a imagem em formato WebP, vinculando o ID do arquivo à ficha técnica da criatura.
6. A imagem é renderizada como retrato oficial no topo da ficha técnica da criatura.

**Fluxos alternativos:**
- *Galeria interna da espécie:* O usuário insere múltiplas ilustrações na aba "Galeria de Fotos" da criatura para retratar variações de cor ou gênero da espécie.

**Fluxos de exceção:**
- *Upload corrompido:* O sistema barra o arquivo e exibe a mensagem de erro padrão solicitando imagem em formato adequado.

**Pós-condições:** A imagem ilustrativa é vinculada e renderizada na ficha técnica da criatura.

**Critérios de aceite:**
- [ ] A imagem do retrato da criatura deve ser indexada de forma automática na Galeria de Mídias global do projeto.
- [ ] O tempo de processamento e atualização na tela deve ser inferior a 1,5 segundos.

---

## Tabela Resumo: Lote 28 (UC-271 a UC-280)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-271** | RF-271 (pesquisar imagens por tag/entidade) | Média | Baixa |
| **UC-272** | RF-272 (excluir imagens da galeria) | Alta | Baixa |
| **UC-273** | RF-273 (compactar imagens automaticamente) | Alta | Média |
| **UC-274** | RF-274 (baixar imagens individuais) | Alta | Baixa |
| **UC-275** | RF-275 (exportar todas as imagens .zip) | Média | Média |
| **UC-276** | RF-276 (cadastrar criaturas no bestiário) | Alta | Baixa |
| **UC-277** | RF-277 (associar locais a criaturas) | Alta | Baixa |
| **UC-278** | RF-278 (filtrar criaturas por habitat) | Alta | Baixa |
| **UC-279** | RF-279 (criar habilidades de criaturas) | Média | Baixa |
| **UC-280** | RF-280 (associar imagens a criaturas) | Alta | Baixa |
