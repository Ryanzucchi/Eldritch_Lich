# Casos de Uso - Lote 29 (UC-281 a UC-290)

Este documento contém a especificação dos casos de uso de 281 a 290 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Cadastrar fichas de itens/objetos (inventário)

**ID:** UC-281  
**Requisito relacionado:** RF-281 (cadastrar fichas de itens/objetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na seção de worldbuilding (itens/equipamentos) do projeto.  
**Gatilho:** O usuário clica em "Novo Item / Objeto" no menu do inventário do projeto.  

**Fluxo principal:**
1. O usuário clica na opção "Criar Novo Item".
2. O sistema abre a ficha técnica padrão de itens solicitando: Nome do Item, Tipo (arma, armadura, relíquia), Descrição Física, História/Lore e Propriedades Especiais.
3. O usuário preenche as informações do item.
4. O usuário clica em "Salvar".
5. O sistema grava o registro do item na tabela de inventário/objetos do banco de dados.
6. O item passa a constar na lista lateral do diretório de worldbuilding.

**Fluxos alternativos:**
- *Criar a partir de modelo:* O usuário cria o item baseado em um template pré-configurado de item (ex: Arma Lendária) que já inicializa com atributos adicionais prontos para preenchimento.

**Fluxos de exceção:**
- *Nome duplicado:* O sistema sugere usar outro nome caso o item já exista para evitar problemas de busca e hyperlinks.

**Pós-condições:** A ficha técnica do item é cadastrada e salva na base de dados do projeto.

**Critérios de aceite:**
- [ ] A ficha técnica deve aceitar formatação em negrito/itálico no campo de história e propriedades.
- [ ] O salvamento do novo item no banco deve ocorrer em até 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Associar itens/objetos a personagens (posse)

**ID:** UC-282  
**Requisito relacionado:** RF-282 (associar itens/objetos a personagens)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens e itens estão cadastrados no projeto.  
**Gatilho:** O usuário edita a ficha de inventário de um personagem.  

**Fluxo principal:**
1. O usuário abre la ficha de um personagem (ex: "Arthur").
2. O usuário clica na aba "Inventário / Posses".
3. O usuário clica em "Equipar / Adicionar Item".
4. O sistema abre a busca de itens do projeto.
5. O usuário seleciona o item desejado e define a data de obtenção e o tipo de posse (Dropdown: Equipado, Carregando, Guardado).
6. O usuário clica em "Salvar".
7. O sistema grava o relacionamento na tabela correspondente.
8. A ficha do personagem passa a listar o item sob o seu inventário e a ficha do item correspondente exibe o campo de proprietário atualizado.

**Fluxos alternativos:**
- *Transferir item:* O usuário clica em "Transferir Item" na ficha do objeto e seleciona outro personagem como novo possuidor. O sistema atualiza os registros de inventário de ambos de forma simultânea.

**Fluxos de exceção:**
- *Itens exclusivos:* Se o item for configurado como exclusivo/único e o usuário tentar atribuí-lo a um segundo personagem sem desvincular do primeiro, o sistema alerta e solicita confirmação para a transferência automática.

**Pós-condições:** O item é associado ao inventário do personagem na base de dados do projeto.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a chave de relacionamento de forma indexada.
- [ ] A interface da aba de inventário deve atualizar em tempo real em menos de 150ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Associar itens/objetos a locais (localização)

**ID:** UC-283  
**Requisito relacionado:** RF-283 (associar itens/objetos a locais)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de itens e locais cadastradas no projeto.  
**Gatilho:** O usuário edita as propriedades geográficas do item ou o posiciona no mapa.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um local.
2. No painel de itens do local, o usuário clica em "Adicionar Item".
3. O sistema abre a busca de itens do projeto.
4. O usuário seleciona o item correspondente e define o status de localização (Dropdown: Escondido, Perdido, Guardado).
5. O usuário clica em "Salvar".
6. O sistema grava o relacionamento na tabela correspondente no banco de dados.
7. A ficha do local passa a listar o item e a ficha do item exibe a localização correspondente.

**Fluxos alternativos:**
- *Posicionar no atlas:* O usuário arrasta o pino do item da lista lateral e o solta diretamente sobre o mapa geográfico, gravando as coordenadas exatas do objeto.

**Fluxos de exceção:**
- *Local excluído:* A associação correspondente é limpa da ficha do item de forma automática caso o local seja deletado.

**Pós-condições:** A localização geográfica do item é salva na base de dados do projeto.

**Critérios de aceite:**
- [ ] O banco de dados deve manter consistência referencial.
- [ ] Clicar na localização na ficha do item deve abrir a página do local em painel split-view.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Filtrar itens/objetos por personagem (inventário pessoal)

**ID:** UC-284  
**Requisito relacionado:** RF-284 (filtrar itens/objetos por personagem)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de itens com possuidores cadastrados configuradas.  
**Gatilho:** O usuário filtra a listagem geral de inventário de itens por personagem.  

**Fluxo principal:**
1. O usuário acessa a listagem geral de "Itens e Objetos" na barra lateral.
2. O usuário clica no seletor de filtros e seleciona a opção "Possuidores / Personagens".
3. O usuário seleciona o personagem desejado (ex: "Arthur").
4. O sistema filtra a lista de itens, exibindo na tela apenas os objetos que pertencem ou estão sob posse de "Arthur".
5. O usuário visualiza o inventário pessoal do personagem selecionado.

**Fluxos alternativos:**
- *Filtrar por itens não associados:* O usuário seleciona "Sem Proprietário" para listar apenas itens livres ou sem dono cadastrado na história.

**Fluxos de exceção:**
- *Personagem sem posses:* Se o personagem selecionado não possuir itens, a listagem exibe "Inventário vazio".

**Pós-condições:** A interface exibe apenas os itens pertencentes ao personagem selecionado no filtro.

**Critérios de aceite:**
- [ ] O filtro de itens por personagem deve demorar menos de 100ms.
- [ ] A lista filtrada deve indicar o status de posse (ex: "Equipado" ou "Guardado").

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Filtrar itens/objetos por local (tesouro/depósito)

**ID:** UC-285  
**Requisito relacionado:** RF-285 (filtrar itens/objetos por local)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de itens com localizações cadastradas configuradas.  
**Gatilho:** O usuário filtra a listagem de itens por local.  

**Fluxo principal:**
1. O usuário acessa a listagem geral de "Itens e Objetos" na barra lateral.
2. O usuário clica no seletor de filtros e seleciona a opção "Localização / Depósito".
3. O usuário escolhe o local correspondente (ex: "Sala do Tesouro").
4. O sistema filtra e exibe apenas os itens que estão armazenados ou localizados na "Sala do Tesouro".
5. O usuário visualiza o acervo de itens do local selecionado.

**Fluxos alternativos:**
- *Filtrar no mapa:* O usuário clica em "Exibir Itens" na visualização do atlas, destacando os ícones de objetos e baús no mapa geográfico.

**Fluxos de exceção:**
- *Local sem itens:* Se não houver itens cadastrados na localidade, a listagem exibe "Nenhum item localizado nesta área".

**Pós-condições:** A listagem exibe apenas os itens correspondentes ao filtro de local selecionado.

**Critérios de aceite:**
- [ ] O tempo de processamento do filtro de itens por local deve ser menor que 100ms.
- [ ] A interface deve permitir limpar o filtro com um único clique.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Criar propriedades/efeitos de itens/objetos

**ID:** UC-286  
**Requisito relacionado:** RF-286 (criar propriedades/efeitos de itens/objetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A ficha do item/objeto está cadastrada no inventário.  
**Gatilho:** O usuário adiciona ou edita propriedades físicas ou mágicas na ficha do item.  

**Fluxo principal:**
1. O usuário abre a ficha técnica do item correspondente.
2. O usuário acessa o painel de "Propriedades e Efeitos".
3. O usuário clica em "Nova Propriedade".
4. O sistema abre campos solicitando: Nome da Propriedade, Tipo de Efeito, Descrição do Efeito e Condição de Ativação.
5. O usuário insere os dados e clica em "Salvar".
6. O sistema grava a propriedade na tabela de atributos de efeitos de itens no banco de dados.
7. A propriedade passa a constar com estilo visual destacado no perfil do item.

**Fluxos alternativos:**
- *Vincular a feitiço:* O usuário vincula a propriedade a um feitiço já cadastrado na árvore de magias global, representando que o item canaliza aquela magia.

**Fluxos de exceção:**
- *Sem nome de efeito:* O sistema impede o salvamento caso o nome do efeito esteja em branco.

**Pós-condições:** A propriedade especial do item é salva e anexada ao perfil correspondente.

**Critérios de aceite:**
- [ ] A interface deve permitir listar as propriedades em formato compacto na ficha do item.
- [ ] O salvamento no banco de dados deve levar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Associar imagens a fichas de itens/objetos (ilustrações)

**ID:** UC-287  
**Requisito relacionado:** RF-287 (associar imagens a fichas de itens/objetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A ficha do item está cadastrada e o arquivo de imagem está disponível localmente ou na galeria.  
**Gatilho:** O usuário clica em "Adicionar Ilustração" na ficha do item.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um item.
2. No cabeçalho da ficha, o usuário clica sobre a área de imagem "Adicionar Ilustração".
3. O sistema abre o modal de seleção da Galeria de Mídias.
4. O usuário seleciona a ilustração correspondente e confirma.
5. O sistema processa a imagem em formato WebP, vinculando o ID do arquivo à ficha técnica do item.
6. A imagem é renderizada como retrato oficial no topo da ficha do item.

**Fluxos alternativos:**
- *Galeria de fotos do item:* O usuário insere múltiplas ilustrações secundárias na aba "Galeria de Fotos" do próprio item para retratar o objeto sob diferentes ângulos.

**Fluxos de exceção:**
- *Upload de arquivo inválido:* O sistema impede a importação de arquivos não suportados e solicita imagem em formato adequado.

**Pós-condições:** A imagem ilustrativa é vinculada e renderizada na ficha técnica do item.

**Critérios de aceite:**
- [ ] A imagem do retrato do item deve ser indexada automaticamente na Galeria de Mídias global do projeto.
- [ ] O tempo de processamento e atualização na tela deve ser de no máximo 1,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Cadastrar fichas de eventos históricos (enciclopédia)

**ID:** UC-288  
**Requisito relacionado:** RF-288 (cadastrar fichas de eventos históricos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na seção de worldbuilding (história/lore) do projeto.  
**Gatilho:** O usuário clica em "Novo Evento Histórico" no menu de enciclopédia/lore.  

**Fluxo principal:**
1. O usuário acessa o menu lateral e seleciona "História/Enciclopédia" -> "Nova Ficha de Evento".
2. O sistema abre a ficha técnica de evento histórico solicitando: Nome do Evento, Data do Evento, Descrição, Antecedentes, Consequências e Documentos de Apoio.
3. O usuário preenche as informações e insere a data correspondente.
4. O usuário clica em "Salvar".
5. O sistema grava o evento na tabela de eventos históricos no banco de dados.
6. O evento passa a constar na lista lateral do diretório e é incluído de forma automática na timeline geral do projeto.

**Fluxos alternativos:**
- *Vincular documento:* O usuário associa um capítulo de texto inteiro como relato detalhado do evento histórico na própria ficha de enciclopédia.

**Fluxos de exceção:**
- *Nome duplicado:* O sistema solicita outro nome caso o evento histórico já exista.

**Pós-condições:** A ficha técnica do evento histórico é gravada e sincronizada com a timeline do projeto.

**Critérios de aceite:**
- [ ] O cadastro do evento histórico deve suportar calendários fictícios configurados no projeto.
- [ ] O inserção no banco de dados e atualização na timeline devem levar menos de 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Associar personagens a eventos históricos (participação)

**ID:** UC-289  
**Requisito relacionado:** RF-289 (associar personagens a eventos históricos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens e eventos históricos estão cadastrados no projeto.  
**Gatilho:** O usuário edita a participação de personagens na ficha do evento histórico.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um evento histórico.
2. No painel de participantes, o usuário clica em "Adicionar Personagem / Participante".
3. O sistema abre a busca de personagens.
4. O usuário seleciona o personagem correspondente e define o seu papel no evento (Dropdown: Protagonista, Testemunha, Vítima, Comandante).
5. O usuário clica em "Salvar".
6. O sistema grava a relação na tabela correspondente.
7. A ficha do evento passa a listar o personagem como participante e a ficha do personagem exibe a participação correspondente na aba de biografia.

**Fluxos alternativos:**
- *Adicionar na ficha do personagem:* O usuário abre a ficha do personagem, acessa a aba de histórico e clica em "Adicionar Evento Histórico" para cadastrar o marco biográfico de forma reversa.

**Fluxos de exceção:**
- *Personagem excluído:* Se o personagem participante for deletado, o sistema o remove da lista de participantes do evento de forma silenciosa.

**Pós-condições:** A relação de participação do personagem no acontecimento histórico é salva na base de dados.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a chave estrangeira de relacionamento de forma íntegra.
- [ ] O tempo total de salvamento do relacionamento deve ser menor que 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Associar locais a eventos históricos (palco do evento)

**ID:** UC-290  
**Requisito relacionado:** RF-290 (associar locais a eventos históricos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Locais e eventos históricos estão cadastrados no projeto.  
**Gatilho:** O usuário edita as propriedades geográficas do evento histórico.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um evento histórico.
2. No painel de geografia, o usuário clica no campo "Palco do Acontecimento (Local)".
3. O sistema abre a busca autocomplete de locais do projeto.
4. O usuário pesquisa e seleciona o local desejado (ex: "Cidade de Eldoria").
5. O usuário clica em "Salvar".
6. O sistema grava a relação na tabela correspondente no banco de dados.
7. A ficha do evento histórico passa a exibir a tag clicável do local e a ficha do local exibe o acontecimento sob sua timeline.

**Fluxos alternativos:**
- *Associação via mapa:* O usuário posiciona o evento diretamente no mapa geográfico, configurando a associação de local com base na proximidade do pino onde foi solto.

**Fluxos de exceção:**
- *Local excluído:* A associação é apagada automaticamente caso o local correspondente seja deletado do projeto.

**Pós-condições:** O local de ambientação do evento histórico é salvo na base de dados do projeto.

**Critérios de aceite:**
- [ ] O banco de dados deve manter consistência referencial de forma indexada.
- [ ] Clicar no local de ambientação na ficha do evento histórico deve abrir a página do local em split-view.

---

## Tabela Resumo: Lote 29 (UC-281 a UC-290)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-281** | RF-281 (cadastrar fichas de itens/objetos) | Alta | Baixa |
| **UC-282** | RF-282 (associar itens a personagens) | Alta | Baixa |
| **UC-283** | RF-283 (associar itens a locais) | Alta | Baixa |
| **UC-284** | RF-284 (filtrar itens por personagem) | Alta | Baixa |
| **UC-285** | RF-285 (filtrar itens por local) | Alta | Baixa |
| **UC-286** | RF-286 (criar propriedades de itens/objetos) | Média | Baixa |
| **UC-287** | RF-287 (associar imagens a fichas de itens) | Alta | Baixa |
| **UC-288** | RF-288 (cadastrar eventos históricos) | Alta | Baixa |
| **UC-289** | RF-289 (associar personagens a eventos) | Alta | Baixa |
| **UC-290** | RF-290 (associar locais a eventos históricos) | Alta | Baixa |
