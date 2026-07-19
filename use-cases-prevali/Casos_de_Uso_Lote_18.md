# Casos de Uso - Lote 18 (UC-171 a UC-180)

Este documento contém a especificação dos casos de uso de 171 a 180 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Exportar cronologia (PDF/imagem)

**ID:** UC-171  
**Requisito relacionado:** RF-171 (exportar cronologia (PDF/imagem))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui uma timeline contendo eventos cronológicos salvos.  
**Gatilho:** O usuário clica em "Exportar Timeline" no painel da Linha do Tempo.  

**Fluxo principal:**
1. O usuário acessa a timeline do projeto.
2. O usuário clica no botão "Exportar" e escolhe o formato: "Imagem (.png)" ou "Documento (.pdf)".
3. O sistema renderiza o componente visual da timeline inteira em um elemento canvas no navegador.
4. O sistema converte o canvas para um arquivo de imagem de alta resolução (PNG) ou insere na página de um PDF estruturado.
5. O navegador inicia o download automático do arquivo.

**Fluxos alternativos:**
- *Exportar apenas intervalo:* O usuário seleciona datas de início e fim no modal de exportação, gerando o arquivo apenas com os eventos ocorridos no período delimitado.

**Fluxos de exceção:**
- *Timeline excessivamente longa:* Se a timeline contiver centenas de eventos que estouram a resolução máxima de renderização do navegador, o sistema força a conversão para PDF multi-páginas de forma automática como alternativa segura.

**Pós-condições:** O arquivo contendo a visualização gráfica da timeline é baixado pelo usuário.

**Critérios de aceite:**
- [ ] A imagem ou PDF exportado deve reter as cores das tags, linhas de conexão e fontes idênticas às exibidas na interface.
- [ ] O processamento do arquivo de exportação de até 50 eventos deve durar menos de 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Visualizar árvore genealógica de personagens

**ID:** UC-172  
**Requisito relacionado:** RF-172 (visualizar árvore genealógica de personagens)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui personagens com vínculos familiares cadastrados.  
**Gatilho:** O usuário abre a ficha técnica de um personagem e clica em "Ver Árvore Genealógica".  

**Fluxo principal:**
1. O usuário acessa a ficha técnica de um personagem (ex: "Arthur").
2. O usuário clica na aba "Árvore Genealógica".
3. O sistema consulta as tabelas de relacionamentos familiares da base de dados.
4. A interface renderiza uma árvore genealógica gráfica com layout hierárquico (ascendentes acima, cônjuges ao lado e descendentes abaixo).
5. O usuário navega pela árvore aplicando arrasto e zoom no canvas.
6. O usuário clica no nome de qualquer membro familiar para abrir sua respectiva ficha técnica.

**Fluxos alternativos:**
- *Árvore Geral do Projeto:* O usuário clica em "Árvore Genealógica Geral" no menu e visualiza todas as dinastias do projeto simultaneamente no canvas.

**Fluxos de exceção:**
- *Nenhuma relação familiar:* Se o personagem não tiver parentes cadastrados, a tela exibe o card de Arthur isolado com a notificação: "Nenhum familiar vinculado".

**Pós-condições:** A árvore genealógica hierárquica do personagem é renderizada de forma interativa.

**Critérios de aceite:**
- [ ] O layout gráfico deve separar claramente gerações em linhas horizontais distintas.
- [ ] A renderização da árvore para uma dinastia de 30 personagens deve durar menos de 800ms.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Criar relações de parentesco (pai, mãe, filhos, cônjuges)

**ID:** UC-173  
**Requisito relacionado:** RF-173 (criar relações de parentesco)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Pelo menos dois personagens distintos estão cadastrados no projeto.  
**Gatilho:** O usuário gerencia relacionamentos na ficha técnica de um personagem.  

**Fluxo principal:**
1. O usuário abre a ficha do personagem "Arthur".
2. O usuário clica em "Adicionar Familiar".
3. O sistema abre um modal solicitando selecionar o personagem (autocomplete) e o grau de parentesco (Dropdown: Pai, Mãe, Filho(a), Irmão/Irmã, Cônjuge/Parceiro).
4. O usuário seleciona o personagem "Uther" e escolhe a opção "Pai".
5. O usuário clica em "Confirmar Vínculo".
6. O sistema insere a relação na tabela de parentesco no banco de dados.
7. A ficha de Arthur exibe "Pai: Uther" e a ficha de Uther exibe automaticamente "Filho: Arthur".

**Fluxos alternativos:**
- *Relações de adoção:* O usuário seleciona a opção "Adotivo / Vínculo Não Biológico" para representar relacionamentos de adoção ou tutoria de forma visualmente diferenciada na árvore.

**Fluxos de exceção:**
- *Paradoxo biológico:* Se o usuário tentar associar como "Filho" um personagem cuja data de nascimento seja anterior à do pai, o sistema exibe um alerta de inconsistência biológica, mas permite salvar sob confirmação.

**Pós-condições:** O relacionamento familiar bidirecional é gravado e indexado no banco de dados.

**Critérios de aceite:**
- [ ] O banco de dados deve refletir a bidirecionalidade lógica da relação (se A é pai de B, B é filho de A) de forma íntegra.
- [ ] A inserção e atualização na interface devem levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Atualizar árvore genealógica automaticamente a partir de relações

**ID:** UC-174  
**Requisito relacionado:** RF-174 (atualizar árvore genealógica automaticamente a partir de relações)  
**Ator(es):** Sistema  
**Pré-condições:** Um relacionamento de parentesco foi adicionado ou removido pelo usuário.  
**Gatilho:** Confirmação da gravação de uma nova relação na tabela de parentesco.  

**Fluxo principal:**
1. O backend confirma a inserção de uma nova linha de parentesco (ex: "Arthur é cônjuge de Guinevere").
2. O sistema dispara em background um script de reconstrução do grafo da árvore familiar.
3. O sistema recalcula o encadeamento de relacionamentos indiretos (ex: deduz que se Uther é pai de Arthur e Arthur é pai de Galahad, então Uther é avô de Galahad).
4. O sistema gera a nova estrutura JSON hierárquica atualizada.
5. Ao abrir o painel de árvore genealógica, o usuário visualiza os novos ramos familiares perfeitamente integrados, sem necessidade de desenhar nós manualmente.

**Fluxos alternativos:**
- *Remover nó:* O usuário deleta um vínculo de parentesco e a árvore reconstrói-se automaticamente, afastando os nós e ajustando a descendência direta.

**Fluxos de exceção:**
- *Grafos cíclicos:* Em mundos de fantasia com árvores genealógicas complexas ou cruzamento de dinastias parentes, o algoritmo utiliza detecção de ciclos para evitar travamentos, renderizando linhas de conexão transversais.

**Pós-condições:** O grafo hierárquico da árvore genealógica é regenerado e indexado na base de dados.

**Critérios de aceite:**
- [ ] A atualização do modelo lógico da árvore genealógica deve ser concluída no banco de dados de forma síncrona com a gravação do parentesco.
- [ ] A re-renderização da árvore na tela do usuário deve levar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Visualizar linhagem familiar (ascendentes/descendentes)

**ID:** UC-175  
**Requisito relacionado:** RF-175 (visualizar linhagem familiar)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O personagem possui ascendentes ou descendentes cadastrados na árvore familiar.  
**Gatilho:** O usuário clica em "Ver Linhagem de Sangue" ou "Linhagem Direta" na ficha do personagem.  

**Fluxo principal:**
1. O usuário abre a aba de genealogia de um personagem.
2. O usuário seleciona a opção de visualização "Linhagem Linear".
3. O sistema calcula a trilha ancestral vertical direta (ex: Arthur <- Uther <- Constantino) e a linhagem de descendência vertical direta (Arthur -> Galahad).
4. A interface exibe a linhagem em formato de lista hierárquica com recuos visuais, focando exclusivamente no sangue direto e omitindo cônjuges externos e ramos colaterais.
5. O usuário visualiza com clareza a sucessão de títulos e heranças dinásticas de forma vertical.

**Fluxos alternativos:**
- *Filtrar por linhagem materna ou paterna:* O usuário opta por visualizar exclusivamente a linhagem patrilineal ou matrilineal do personagem.

**Fluxos de exceção:**
- *Linhagem isolada:* Se não houver ascendentes ou descendentes diretos cadastrados além do personagem, a interface indica: "Nenhuma linhagem direta mapeada".

**Pós-condições:** A linhagem direta (ascendente ou descendente) é exibida de forma linear na tela.

**Critérios de aceite:**
- [ ] A lista de linhagem deve destacar os anos de nascimento e morte de cada antecessor/sucessor ao lado de seu nome.
- [ ] A navegação deve permitir saltar diretamente para qualquer ficha de personagem listada.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Marcar facção/organização do personagem

**ID:** UC-176  
**Requisito relacionado:** RF-176 (marcar facção/organização do personagem)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** Personagens e entidades do tipo Organização/Facção estão cadastrados no projeto.  
**Gatilho:** O usuário edita a filiação de um personagem.  

**Fluxo principal:**
1. O usuário acessa a ficha técnica de um personagem.
2. No painel de filiações, o usuário clica em "Adicionar Filiação/Facção".
3. O sistema exibe a lista de organizações do projeto.
4. O usuário seleciona a organização desejada (ex: "Cavaleiros da Távola Redonda").
5. O sistema solicita selecionar o cargo do personagem dentro da organização (Dropdown: Líder, Membro, Aliado, Espião, Ex-membro).
6. O usuário define o cargo e confirma.
7. O sistema grava o vínculo de filiação no banco de dados.
8. A ficha do personagem passa a exibir o brasão correspondente e o personagem é indexado no diretório de membros da organização.

**Fluxos alternativos:**
- *Múltiplas filiações:* O usuário vincula o mesmo personagem a outra organização secundária, definindo seu papel correspondente.

**Fluxos de exceção:**
- *Organização excluída:* Se a organização for deletada do projeto, a associação é removida do perfil do personagem de forma automática.

**Pós-condições:** O personagem é associado e indexado à organização na base de dados do projeto.

**Critérios de aceite:**
- [ ] O brasão da facção deve ser exibido ao lado do nome do personagem em sua ficha técnica de forma compacta.
- [ ] A associação deve atualizar o grafo de rede do projeto.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Filtrar personagens por facção/organização

**ID:** UC-177  
**Requisito relacionado:** RF-177 (filtrar personagens por facção/organização)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens com filiações a facções/organizações configuradas.  
**Gatilho:** O usuário filtra a listagem de diretório ou o grafo por facção.  

**Fluxo principal:**
1. O usuário acessa o diretório geral de personagens.
2. O usuário clica no seletor de filtros e abre o dropdown de facções.
3. O usuário seleciona a facção desejada (ex: "Ordem dos Magos").
4. O sistema processa e oculta temporariamente todos os personagens que não pertençam à facção da listagem lateral.
5. O usuário visualiza apenas o elenco de magos e seus cargos.

**Fluxos alternativos:**
- *Filtrar no Grafo:* O usuário acessa o Grafo de Entidades e clica no filtro visual por facção. O canvas esmaece personagens de facções neutras ou inimigas, mantendo a rede da facção selecionada em destaque na tela.

**Fluxos de exceção:**
- *Facção vazia:* Se a organização selecionada estiver sem membros cadastrados, o sistema exibe: "Nenhum personagem de filiação ativa".

**Pós-condições:** A interface renderiza apenas os personagens pertencentes à facção selecionada no filtro.

**Critérios de aceite:**
- [ ] O tempo de processamento e atualização da lista filtrada deve ser menor que 100ms.
- [ ] A interface deve disponibilizar atalho rápido para limpar o filtro de facção com um clique.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Visualizar rede de facções (grafo de organizações)

**ID:** UC-178  
**Requisito relacionado:** RF-178 (visualizar rede de facções)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Organizações cadastradas possuem relações de aliança, neutralidade ou guerra configuradas entre si.  
**Gatilho:** O usuário seleciona "Visualizar Grafo de Organizações" no menu.  

**Fluxo principal:**
1. O usuário abre o painel de redes e clica em "Rede de Facções".
2. O sistema consulta a tabela de relacionamentos inter-organizacionais no banco de dados.
3. O sistema renderiza na tela um grafo de nós no canvas, onde cada nó representa uma organização e cada aresta representa um tipo de aliança política ou militar.
4. O sistema usa cores nas arestas para mapear o status diplomático (Verde: Aliança, Vermelho: Hostilidade, Cinza: Neutralidade).
5. O usuário interage com o grafo aplicando zoom e clicando nos nós para abrir a descrição e o histórico de conflitos.

**Fluxos alternativos:**
- *Visualizar força de facção:* O usuário ativa a visualização de volume do nó, onde o tamanho do círculo de cada facção é proporcional ao número de membros cadastrados nela.

**Fluxos de exceção:**
- *Sem relações diplomáticas:* Se não houver relações cadastradas entre facções, o grafo exibe os nós das organizações isolados no canvas, exibindo instruções para vinculá-los.

**Pós-condições:** A rede visual de relações diplomáticas das organizações é exibida na tela.

**Critérios de aceite:**
- [ ] As arestas diplomáticas devem exibir rótulos contendo o nome do tratado ou acordo associado ao passar o cursor.
- [ ] O carregamento e física do grafo de organizações devem ser fluidos (< 1 segundo de renderização).

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Criar brasão/insígnia de facções (gerador visual ou upload)

**ID:** UC-179  
**Requisito relacionado:** RF-179 (criar brasão/insígnia de facções)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A organização/facção está cadastrada no projeto.  
**Gatilho:** O usuário clica em "Editar Brasão" na ficha da facção.  

**Fluxo principal:**
1. O usuário abre a ficha de uma organização e clica em "Adicionar Brasão/Símbolo".
2. O sistema abre um modal com duas abas: "Fazer Upload" e "Criar Brasão Rápido".
3. O usuário seleciona "Fazer Upload", escolhe o arquivo contendo a imagem da insígnia e confirma.
4. O sistema realiza o upload da imagem para o servidor, gera miniaturas otimizadas e associa a imagem à organização.
5. A ficha da facção passa a renderizar o brasão de forma destacada no cabeçalho.

**Fluxos alternativos:**
- *Criar Brasão Rápido (Gerador Visual):* O usuário escolhe o formato do escudo, cor de fundo e adiciona um ícone da galeria do sistema. O sistema mescla os elementos em um arquivo SVG consolidado e o salva como imagem oficial do brasão.

**Fluxos de exceção:**
- *Upload excessivo:* Se o usuário tentar enviar uma imagem superior a 5MB, o sistema barra o envio e solicita um arquivo menor.

**Pós-condições:** A imagem do brasão é processada e vinculada à organização no projeto.

**Critérios de aceite:**
- [ ] O gerador visual interno de brasões em SVG deve exportar arquivos válidos de no máximo 200KB.
- [ ] A miniatura do brasão deve ser renderizada corretamente ao lado de todos os membros associados no diretório.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Associar locais a facções (território de controle)

**ID:** UC-180  
**Requisito relacionado:** RF-180 (associar locais a facções)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de locais e organizações cadastradas.  
**Gatilho:** O usuário edita as propriedades políticas da ficha de um local ou associa no mapa.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um local.
2. O usuário clica no campo "Território Controlado por (Facção)".
3. O sistema abre a listagem autocomplete de organizações do projeto.
4. O usuário pesquisa e seleciona a organização desejada.
5. O usuário escolhe o Status de Controle (Dropdown: Domínio Total, Ocupado, Território Disputado).
6. O usuário clica em "Salvar".
7. O sistema grava o vínculo político na base de dados.

**Fluxos alternativos:**
- *Desenhar território no mapa:* O usuário seleciona uma facção no mapa e desenha um polígono simples sobre uma área geográfica. O sistema pinta a região e vincula todos os locais contidos nela à facção Stark automaticamente.

**Fluxos de exceção:**
- *Facção removida:* Se a facção associada for excluída do projeto, o status político do local correspondente retorna para "Neutro/Sem Facção" de forma automática.

**Pós-condições:** Os locais ficam mapeados como territórios pertencentes ou controlados pelas respectivas organizações na base do projeto.

**Critérios de aceite:**
- [ ] A ficha técnica do local deve exibir o brasão e o nome da facção controladora em destaque.
- [ ] A atualização do status de controle territorial deve refletir instantaneamente nas cores das camadas do mapa geográfico interativo.

---

## Tabela Resumo: Lote 18 (UC-171 a UC-180)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-171** | RF-171 (exportar cronologia PDF/imagem) | Média | Média |
| **UC-172** | RF-172 (visualizar árvore genealógica...) | Alta | Alta |
| **UC-173** | RF-173 (criar relações de parentesco) | Alta | Média |
| **UC-174** | RF-174 (atualizar árvore automaticamente) | Alta | Alta |
| **UC-175** | RF-175 (visualizar linhagem familiar) | Média | Média |
| **UC-176** | RF-176 (marcar facção/organização) | Alta | Baixa |
| **UC-177** | RF-177 (filtrar personagens por facção) | Alta | Baixa |
| **UC-178** | RF-178 (visualizar rede de facções) | Média | Alta |
| **UC-179** | RF-179 (criar brasão/insígnia de facção) | Média | Média |
| **UC-180** | RF-180 (associar locais a facções) | Alta | Alta |
