# Casos de Uso - Lote 26 (UC-251 a UC-260)

Este documento contém a especificação dos casos de uso de 251 a 260 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Cadastrar árvore de tecnologias/magias (sistema)

**ID:** UC-251  
**Requisito relacionado:** RF-251 (cadastrar árvore de tecnologias/magias (sistema))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na seção de worldbuilding (regras do universo) do projeto.  
**Gatilho:** O usuário clica em "Nova Árvore de Habilidades/Tecnologias" ou "Novo Sistema de Magia".  

**Fluxo principal:**
1. O usuário clica em "Criar Árvore de Conhecimento".
2. O sistema abre um formulário solicitando: Nome da Árvore e descrição das regras físicas ou mágicas básicas.
3. O usuário salva as informações.
4. O sistema abre um canvas de fluxograma onde o usuário adiciona nós de tecnologias ou magias específicas.
5. O usuário desenha setas direcionadas ligando os nós para representar pré-requisitos de aprendizagem.
6. O sistema grava a estrutura lógica e as dependências direcionadas no banco de dados.

**Fluxos alternativos:**
- *Formato de Tabela:* O usuário prefere preencher uma tabela de itens cadastrando os pré-requisitos via seletores dropdown, dispensando o canvas visual.

**Fluxos de exceção:**
- *Ciclos de dependência:* Se o usuário tentar desenhar uma conexão que crie uma dependência cíclica contraditória, o sistema impede o vínculo e emite um alerta explicando o paradoxo.

**Pós-condições:** A árvore lógica de habilidades ou tecnologias do universo é cadastrada no banco de dados.

**Critérios de aceite:**
- [ ] O canvas de árvore deve permitir adicionar e editar campos de descrição detalhada e custos para cada nó.
- [ ] A gravação e consistência dos nós do grafo no banco devem durar menos de 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Associar tecnologias/magias a personagens (habilidades)

**ID:** UC-252  
**Requisito relacionado:** RF-252 (associar tecnologias/magias a personagens)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens e nós de tecnologias/magias estão cadastrados no projeto.  
**Gatilho:** O usuário edita a ficha técnica de habilidades de um personagem.  

**Fluxo principal:**
1. O usuário abre o perfil do personagem.
2. O usuário clica na aba "Habilidades / Poderes".
3. O usuário clica em "Aprender Habilidade".
4. O sistema abre uma lista autocomplete exibindo os nós de magias e tecnologias cadastrados.
5. O usuário seleciona a habilidade correspondente, define o nível de proficiência e a data de aprendizado.
6. O usuário clica em "Salvar".
7. O sistema grava a filiação de habilidade no banco de dados.
8. A ficha do personagem passa a listar a habilidade sob sua respectiva árvore.

**Fluxos alternativos:**
- *Atribuição direta no Grafo:* O usuário abre a visualização da Árvore de Magia Geral, clica com o botão direito no nó do feitiço e seleciona "Atribuir a Personagem", preenchendo as informações.

**Fluxos de exceção:**
- *Nó deletado:* Se o nó do feitiço for apagado da árvore geral futuramente, a habilidade desaparece silenciosamente do perfil do personagem sem quebrar sua ficha.

**Pós-condições:** A habilidade do personagem é salva na base de dados do projeto.

**Critérios de aceite:**
- [ ] A ficha do personagem deve exibir o status de proficiência e a descrição detalhada da habilidade ao passar o mouse.
- [ ] O tempo total de salvamento deve ser menor que 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Associar tecnologias/magias a facções (desenvolvimento)

**ID:** UC-253  
**Requisito relacionado:** RF-253 (associar tecnologias/magias a facções)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Facções (organizações) e nós de tecnologias/magias estão cadastrados no projeto.  
**Gatilho:** O usuário edita os parâmetros de desenvolvimento tecnológico na ficha de uma facção.  

**Fluxo principal:**
1. O usuário abre a ficha da facção correspondente.
2. O usuário acessa a aba "Desenvolvimento e Arsenal".
3. O usuário clica em "Vincular Tecnologia/Conhecimento".
4. O sistema exibe os nós da árvore de tecnologias do universo.
5. O usuário seleciona a tecnologia e define o status de uso (ex: "Tecnologia Exclusiva" ou "Em Desenvolvimento").
6. O usuário clica em "Confirmar".
7. O sistema grava a associação no banco de dados.
8. A ficha técnica da facção passa a listar a tecnologia como conhecimento disponível da organização.

**Fluxos alternativos:**
- *Compartilhar tecnologia:* O usuário define que a tecnologia é compartilhada entre duas facções aliadas por meio de um tratado.

**Fluxos de exceção:**
- *Facção removida:* Se a facção for excluída, a associação é desfeita de forma segura nas tabelas do banco.

**Pós-condições:** A associação de conhecimento tecnológico da facção é salva na base de dados do projeto.

**Critérios de aceite:**
- [ ] A associação deve atualizar o relatório de arsenal e progresso da facção de imediato.
- [ ] A gravação na base deve demorar menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Visualizar árvore de tecnologias/magias (grafo de progresso)

**ID:** UC-254  
**Requisito relacionado:** RF-254 (visualizar árvore de tecnologias/magias)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Árvore de tecnologias/magias cadastrada e estruturada.  
**Gatilho:** O usuário abre o painel "Visualizar Árvores de Conhecimento".  

**Fluxo principal:**
1. O usuário acessa o menu do atlas e seleciona "Árvores de Tecnologias / Magias".
2. O sistema exibe a listagem de árvores. O usuário escolhe a árvore desejada (ex: "Sistema de Alquimia").
3. O sistema busca no banco as tecnologias e dependências de Alquimia.
4. A interface renderiza o grafo direcionado e interativo na tela, conectando os nós com linhas e setas de dependência.
5. O usuário clica sobre o nó "Transmutação de Metais" no canvas.
6. O sistema exibe um painel lateral contendo a ficha técnica do nó, regras de aplicação e a lista de personagens e facções que possuem essa habilidade.

**Fluxos alternativos:**
- *Layout Estático:* Se a física de auto-organização dos nós do grafo engasgar na tela, o usuário clica em "Layout Estático" para desativar a física dinâmica e exibir o grafo como grade fixa.

**Fluxos de exceção:**
- *Grafo sem nós:* Se a árvore estiver vazia, exibe a notificação "Nenhuma tecnologia cadastrada nesta árvore".

**Pós-condições:** O grafo da árvore de tecnologias/magias é exibido de forma interativa.

**Critérios de aceite:**
- [ ] A renderização física dos nós deve ser executada em menos de 1 segundo utilizando aceleração de hardware leve.
- [ ] A interface deve destacar visualmente com cores diferenciadas os nós que são pré-requisitos críticos.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Filtrar árvore de tecnologias/magias por personagem

**ID:** UC-255  
**Requisito relacionado:** RF-255 (filtrar árvore de tecnologias/magias por personagem)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A visualização em grafo da árvore está aberta e existem personagens associados a habilidades.  
**Gatilho:** O usuário seleciona o filtro de personagem na tela da árvore.  

**Fluxo principal:**
1. O usuário visualiza o Grafo Geral da Árvore de Magia na tela.
2. O usuário clica no botão de filtro "Personagens" e seleciona um personagem (ex: "Arthur").
3. O sistema processa e esmaece (reduz opacidade para 15%) todos os nós de feitiços que "Arthur" não conhece.
4. O sistema destaca com cores vibrantes apenas a trilha de feitiços que "Arthur" domina na árvore, permitindo ver de forma clara o seu progresso de aprendizado.

**Fluxos alternativos:**
- *Comparação de personagens:* O usuário seleciona dois personagens simultaneamente, colorindo a árvore com duas cores diferentes para comparar o repertório de habilidades de ambos de forma visual.

**Fluxos de exceção:**
- *Personagem sem habilidades:* Se o personagem selecionado não conhecer nenhum nó daquela árvore, o grafo é exibido inteiramente esmaecido com um aviso explicativo.

**Pós-condições:** O grafo da árvore destaca visualmente apenas o progresso do personagem selecionado.

**Critérios de aceite:**
- [ ] O processamento do destaque visual no canvas deve durar menos de 100ms.
- [ ] O painel lateral deve listar o total de progresso percentual do personagem na árvore.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Filtrar árvore de tecnologias/magias por facção

**ID:** UC-256  
**Requisito relacionado:** RF-256 (filtrar árvore de tecnologias/magias por facção)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A visualização em grafo da árvore está aberta e existem facções associadas a tecnologias.  
**Gatilho:** O usuário seleciona o filtro de facção no painel da árvore de conhecimento.  

**Fluxo principal:**
1. O usuário visualiza o Grafo de Tecnologias correspondente.
2. O usuário abre o filtro "Facções" e seleciona a facção desejada (ex: "Império de Valoria").
3. O sistema analisa e esmaece todos os nós de conhecimento que a facção selecionada não detém.
4. O sistema destaca de forma vibrante os nós correspondentes ao arsenal tecnológico e científico dominado por ela.

**Fluxos alternativos:**
- *Destaque de monopólio:* O sistema destaca em cores exclusivas as tecnologias dominadas exclusivamente pela facção selecionada que nenhuma outra facção possui.

**Fluxos de exceção:**
- *Facção sem conhecimentos:* Se a facção selecionada não possuir tecnologias cadastradas, o grafo é esmaecido por completo.

**Pós-condições:** O grafo da árvore destaca o progresso de desenvolvimento tecnológico da facção selecionada.

**Critérios de aceite:**
- [ ] A alteração do realce no canvas deve rodar de forma instantânea.
- [ ] O filtro deve funcionar em conjunto com a comparação de facções rivais (visualizar o gap tecnológico).

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Cadastrar religiões/mitologias

**ID:** UC-257  
**Requisito relacionado:** RF-257 (cadastrar religiões/mitologias)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na seção de worldbuilding do projeto.  
**Gatilho:** O usuário clica em "Nova Religião/Crença" ou "Nova Mitologia".  

**Fluxo principal:**
1. O usuário clica na opção "Criar Religião/Crença".
2. O sistema abre uma ficha técnica de cadastro solicitando: Nome da Religião, Deuses Principais, Livro Sagrado, Símbolo Sagrado e descrição de dogmas.
3. O usuário preenche as informações e faz o upload da imagem do símbolo.
4. O usuário clica em "Salvar".
5. O sistema grava o registro de crença na tabela de religiões do banco de dados.
6. A religião passa a ser exibida sob o diretório de "Religiosidade" na barra de navegação.

**Fluxos alternativos:**
- *Panteão de deuses:* O usuário vincula múltiplas entidades do tipo Personagem como deuses oficiais daquela mitologia a partir de relações na própria ficha de religião.

**Fluxos de exceção:**
- *Nome duplicado:* O sistema barra nomes iguais no mesmo projeto e solicita que o usuário altere para manter a integridade.

**Pós-condições:** A religião ou mitologia é registrada na base de dados do projeto.

**Critérios de aceite:**
- [ ] O cadastro de religiões deve suportar formatação Markdown no campo de dogmas e regras.
- [ ] A atualização do banco de dados deve ser de no máximo 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Associar personagens a religiões/mitologias (crença)

**ID:** UC-258  
**Requisito relacionado:** RF-258 (associar personagens a religiões/mitologias)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** Personagens e religiões estão cadastrados no projeto.  
**Gatilho:** O usuário edita a ficha de perfil social do personagem.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um personagem.
2. No painel de cultura e perfil, o usuário clica em "Adicionar Religião/Crença".
3. O sistema exibe o dropdown de crenças do projeto.
4. O usuário seleciona a religião correspondente e define o Nível de Devoção (Dropdown: Devoto Fiel, Praticante Nominal, Cético, Fanático).
5. O usuário clica em "Salvar".
6. O sistema grava o vínculo na base de dados.
7. A ficha do personagem passa a exibir o nome e símbolo da religião e seu grau de devoção.

**Fluxos alternativos:**
- *Herege:* O usuário altera o status para "Herege/Ex-membro" e o sistema remove o personagem da lista de devotos ativos daquela religião.

**Fluxos de exceção:**
- *Religião excluída:* Se a religião for deletada do projeto, a associação é removida do perfil do personagem de forma automática.

**Pós-condições:** O vínculo de devoção religiosa do personagem é gravado no banco de dados.

**Critérios de aceite:**
- [ ] O símbolo da religião deve ser exibido ao lado do nome do personagem em sua ficha técnica de forma compacta.
- [ ] A associação deve atualizar as estatísticas de religiosidade do projeto.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Associar locais a religiões/mitologias (locais sagrados)

**ID:** UC-259  
**Requisito relacionado:** RF-259 (associar locais a religiões/mitologias)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Locais e religiões estão cadastrados no projeto.  
**Gatilho:** O usuário edita as propriedades de um local ou associa no mapa.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um local.
2. O usuário localiza o campo "Local Sagrado de (Religião)".
3. O sistema exibe as religiões disponíveis no projeto.
4. O usuário seleciona a religião correspondente.
5. O usuário escolhe o tipo de local (Dropdown: Santuário Principal, Templo Regional, Altar de Peregrinação).
6. O usuário clica em "Salvar".
7. O sistema grava o vínculo de local sagrado no banco de dados.
8. A ficha do local passa a exibir o selo de santuário correspondente.

**Fluxos alternativos:**
- *Rota de peregrinação:* O usuário seleciona múltiplos locais sagrados e os liga no mapa geográfico definindo uma Rota de Peregrinação.

**Fluxos de exceção:**
- *Religião excluída:* A associação é apagada do local de forma automática caso a religião seja deletada.

**Pós-condições:** O local é catalogado como ponto geográfico sagrado da religião no banco de dados.

**Critérios de aceite:**
- [ ] O mapa geográfico deve exibir marcadores diferenciados para locais sagrados utilizando o símbolo correspondente da fé.
- [ ] A atualização do banco de dados deve ser concluída em menos de 150ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Visualizar mapa de religiões/mitologias (influência)

**ID:** UC-260  
**Requisito relacionado:** RF-260 (visualizar mapa de religiões/mitologias)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O mapa geográfico está ativo e locais sagrados e população possuem crenças associadas.  
**Gatilho:** O usuário ativa a camada "Mapa Temático de Religiões" no atlas.  

**Fluxo principal:**
1. O usuário abre o mapa geográfico do projeto.
2. O usuário clica em "Camadas" e seleciona "Influência Religiosa".
3. O sistema lê as informações de controle territorial e a crença predominante de cada região.
4. O sistema gera uma sobreposição visual de cores semitransparentes (Heatmap) sobre a imagem do mapa representando as fés de cada região.
5. O usuário visualiza as zonas de influência religiosa e as áreas de fronteira disputadas.

**Fluxos alternativos:**
- *Evolução temporal da fé:* O usuário avança o Time Slider da timeline e visualiza as cores de influência religiosa mudando no mapa de acordo com os eventos históricos de conquistas e conversões.

**Fluxos de exceção:**
- *Ausência de dados:* Se a região não possuir personagens ou facções de crença declarada, a área do mapa permanece sem cor (neutra/sem religião).

**Pós-condições:** O mapa de calor de influência cultural/religiosa do universo é exibido no atlas.

**Critérios de aceite:**
- [ ] As cores das camadas de influência devem ser suaves e transparentes (opacidade máxima de 30%) para permitir a visualização dos acidentes geográficos sob a cor.
- [ ] O processamento e renderização do heatmap de influência religiosa sobre o mapa devem durar menos de 2 segundos.

---

## Tabela Resumo: Lote 26 (UC-251 a UC-260)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-251** | RF-251 (cadastrar árvore de tecnologias/magias) | Média | Alta |
| **UC-252** | RF-252 (associar tecnologias a personagens) | Média | Baixa |
| **UC-253** | RF-253 (associar tecnologias a facções) | Média | Baixa |
| **UC-254** | RF-254 (visualizar árvore de tecnologias...) | Média | Alta |
| **UC-255** | RF-255 (filtrar árvore por personagem) | Média | Alta |
| **UC-256** | RF-256 (filtrar árvore por facção) | Média | Média |
| **UC-257** | RF-257 (cadastrar religiões/mitologias) | Alta | Baixa |
| **UC-258** | RF-258 (associar personagens a religiões) | Média | Baixa |
| **UC-259** | RF-259 (associar locais a religiões) | Média | Baixa |
| **UC-260** | RF-260 (visualizar mapa de religiões...) | Média | Alta |
