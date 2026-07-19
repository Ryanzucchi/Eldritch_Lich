# Casos de Uso - Lote 30 (UC-291 a UC-300)

Este documento contém a especificação dos casos de uso de 291 a 300 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Associar facções a eventos históricos (envolvimento/aliança)

**ID:** UC-291  
**Requisito relacionado:** RF-291 (associar facções a eventos históricos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Facções e eventos históricos estão cadastrados no projeto.  
**Gatilho:** O usuário edita o envolvimento de organizações na ficha do evento histórico.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um evento histórico (ex: "Guerra da Primavera").
2. No painel de facções envolvidas, o usuário clica em "Adicionar Facção".
3. O sistema abre a busca de facções do projeto.
4. O usuário seleciona a facção desejada e define a posição política da organização no evento (Dropdown: Beligerante, Aliado, Mediador, Neutro).
5. O usuário clica em "Salvar".
6. O sistema grava o relacionamento na tabela correspondente no banco de dados.
7. A ficha do evento passa a listar a facção envolvida e a ficha da facção exibe o acontecimento em sua aba de histórico.

**Fluxos alternativos:**
- *Associação em lote:* O usuário seleciona várias facções e as marca coletivamente com o mesmo alinhamento no evento.

**Fluxos de exceção:**
- *Facção excluída:* Se a facção for deletada, o sistema limpa a associação correspondente da ficha do evento de forma segura.

**Pós-condições:** O envolvimento político/militar da facção no evento histórico é registrado na base de dados.

**Critérios de aceite:**
- [ ] A ficha do evento deve listar as organizações separadas pelo seu papel/alinhamento de forma legível.
- [ ] O salvamento da relação deve demorar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Filtrar eventos históricos por personagem (biografia histórica)

**ID:** UC-292  
**Requisito relacionado:** RF-292 (filtrar eventos históricos por personagem)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos históricos com participantes cadastrados configurados.  
**Gatilho:** O usuário abre o filtro de biografia do personagem na linha do tempo.  

**Fluxo principal:**
1. O usuário acessa a listagem geral de "Eventos Históricos" ou a aba "Timeline".
2. O usuário seleciona o filtro "Participantes / Personagens".
3. O usuário seleciona o personagem correspondente (ex: "Arthur").
4. O sistema filtra a linha do tempo e exibe exclusivamente os acontecimentos históricos nos quais Arthur esteve envolvido.
5. O usuário lê sequencialmente os marcos biográficos do personagem selecionado.

**Fluxos alternativos:**
- *Gerar Relatório de Biografia:* O usuário clica em "Exportar Biografia", compilando todos os resumos dos eventos filtrados em um arquivo de texto estruturado.

**Fluxos de exceção:**
- *Sem participação:* Se o personagem selecionado não possuir eventos históricos linkados, a listagem é limpa exibindo "Nenhum evento histórico associado à biografia deste personagem".

**Pós-condições:** A timeline ou lista de eventos exibe apenas as ocorrências com a participação do personagem filtrado.

**Critérios de aceite:**
- [ ] O processamento do filtro biográfico na timeline deve durar menos de 100ms.
- [ ] Os eventos devem ser listados em ordem cronológica estrita.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Filtrar eventos históricos por local (histórico local)

**ID:** UC-293  
**Requisito relacionado:** RF-293 (filtrar eventos históricos por local)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos históricos com palcos locais cadastrados configurados.  
**Gatilho:** O usuário filtra a linha do tempo por localidade.  

**Fluxo principal:**
1. O usuário acessa a seção "Eventos Históricos" ou "Timeline".
2. O usuário clica no filtro "Locais / Regiões".
3. O usuário seleciona o local desejado (ex: "Cidade de Eldoria").
4. O sistema processa e exibe apenas os acontecimentos ocorridos fisicamente na Cidade de Eldoria.
5. O usuário estuda a cronologia histórica do ponto geográfico selecionado.

**Fluxos alternativos:**
- *Linha do tempo interna na ficha do local:* O usuário abre a ficha técnica do local e visualiza a seção de cronologia local já pré-filtrada.

**Fluxos de exceção:**
- *Local sem histórico:* A listagem exibe "Nenhum acontecimento histórico registrado nesta localização".

**Pós-condições:** A listagem exibe apenas as ocorrências ocorridas no local selecionado.

**Critérios de aceite:**
- [ ] O filtro de eventos por local deve carregar instantaneamente (< 100ms).
- [ ] O filtro deve suportar a seleção de sublocais se houver hierarquia geográfica.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Filtrar eventos históricos por facção (participação política)

**ID:** UC-294  
**Requisito relacionado:** RF-294 (filtrar eventos históricos por facção)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos históricos com envolvimento de facções cadastrados.  
**Gatilho:** O usuário filtra a linha do tempo por organização.  

**Fluxo principal:**
1. O usuário acessa o painel de "Eventos Históricos" ou a "Timeline".
2. O usuário ativa o filtro "Facções / Organizações".
3. O usuário seleciona a facção desejada (ex: "Império de Valoria").
4. O sistema varre o banco e oculta todos os eventos em que a facção selecionada não participou.
5. O usuário visualiza o panorama de histórico geopolítico da organização ao longo da timeline.

**Fluxos alternativos:**
- *Filtro de alianças:* O usuário filtra para exibir apenas eventos onde a facção participou conjuntamente com uma facção aliada.

**Fluxos de exceção:**
- *Sem eventos:* Se a organização não possuir registros associados na timeline, exibe "Nenhum evento registrado".

**Pós-condições:** A timeline exibe exclusivamente as ocorrências com a participação da facção selecionada.

**Critérios de aceite:**
- [ ] O tempo de resposta do filtro deve ser menor que 100ms.
- [ ] O filtro deve destacar o papel em que a facção participou de cada marco (ex: tag "Beligerante").

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Associar imagens a fichas de eventos históricos (ilustrações/cenas)

**ID:** UC-295  
**Requisito relacionado:** RF-295 (associar imagens a fichas de eventos históricos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A ficha do evento histórico está cadastrada e o arquivo de imagem está disponível.  
**Gatilho:** O usuário clica em "Adicionar Imagem de Ilustração" na ficha do evento histórico.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um evento histórico.
2. No painel de mídias do evento, o usuário clica em "Adicionar Ilustração".
3. O sistema abre o modal de seleção da Galeria de Mídias.
4. O usuário seleciona ou faz o upload da ilustração correspondente e confirma.
5. O sistema processa a imagem em formato WebP, vinculando o ID da imagem ao registro do evento histórico.
6. A imagem é renderizada como retrato oficial da cena na ficha correspondente e passa a ilustrar o banner do evento na timeline interativa.

**Fluxos alternativos:**
- *Galeria de fotos do evento:* O usuário insere múltiplas ilustrações de cenas secundárias do evento histórico em um carrossel de fotos na ficha.

**Fluxos de exceção:**
- *Arquivo corrompido:* O sistema impede o upload e solicita formato suportado.

**Pós-condições:** A imagem ilustrativa é vinculada e renderizada na ficha de evento histórico e na timeline.

**Critérios de aceite:**
- [ ] A miniatura da imagem deve ilustrar o evento na listagem da timeline interativa de forma responsiva.
- [ ] O tempo total de salvamento e vinculação deve ser menor que 1,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Criar relatórios de inconsistências de timeline (violação lógica)

**ID:** UC-296  
**Requisito relacionado:** RF-296 (criar relatórios de inconsistências de timeline)  
**Ator(es):** Sistema, Usuário (Escritor)  
**Pré-condições:** A timeline possui eventos de personagens e locais cadastrados.  
**Gatilho:** O usuário clica em "Verificar Inconsistências de Enredo" ou o sistema executa a análise em background de forma programada.  

**Fluxo principal:**
1. O usuário acessa o painel de integridade do enredo e clica em "Gerar Relatório de Inconsistências".
2. O backend aciona o motor de validação lógica que analisa regras de física temporal:
   - Personagem participando de evento antes de sua data de nascimento ou após sua data de falecimento.
   - Personagem localizado em dois eventos concomitantes em locais físicos distantes ao mesmo tempo.
   - Eventos com data de término anterior à de início.
3. O sistema monta a lista de inconsistências encontradas.
4. A interface exibe o relatório detalhado de erros lógicos na tela estruturado em tópicos.

**Fluxos alternativos:**
- *Envio periódico:* O sistema envia um resumo do relatório de integridade de enredo periodicamente para a caixa de entrada dos coautores do projeto.

**Fluxos de exceção:**
- *Falta de datas nas fichas:* Se os personagens não possuírem dados de nascimento e morte cadastrados, o sistema avisa que a verificação de idades foi ignorada por ausência de parâmetros.

**Pós-condições:** O relatório consolidado de violações de lógica temporal é renderizado na tela.

**Critérios de aceite:**
- [ ] O processamento da varredura e geração do relatório para uma timeline de 200 eventos deve durar menos de 3 segundos.
- [ ] Cada inconsistência no relatório deve conter links clicáveis para as fichas de personagens e eventos envolvidos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Sugerir correções para inconsistências de timeline

**ID:** UC-297  
**Requisito relacionado:** RF-297 (sugerir correções para inconsistências de timeline)  
**Ator(es):** Sistema, Usuário (Escritor)  
**Pré-condições:** O relatório de inconsistências de timeline localizou violações de enredo.  
**Gatilho:** O usuário clica em "Ver Soluções / Resolver" ao lado de uma inconsistência listada no relatório.  

**Fluxo principal:**
1. O usuário acessa o Relatório de Inconsistências e seleciona uma das contradições de enredo apontadas.
2. O usuário clica em "Ver Soluções".
3. O sistema analisa os dados e sugere opções de correção automatizadas na tela (ex: alterar data do evento, alterar data biográfica de falecimento, ou remover a participação do personagem no evento).
4. O usuário seleciona uma das opções sugeridas e clica em "Aplicar Opção".
5. O sistema executa a correção automática diretamente no banco de dados e atualiza a ficha correspondente.
6. A inconsistência é marcada como resolvida e desaparece do relatório de erros.

**Fluxos alternativos:**
- *Desfazer alteração:* O usuário clica em desfazer para reverter a correção imediata caso perceba que a mudança prejudicou outros trechos do enredo.

**Fluxos de exceção:**
- *Novas inconsistências:* Se a aplicação de uma correção gerar outra inconsistência subsequente, o sistema alerta o usuário e possibilita reverter a ação.

**Pós-condições:** A base de dados do projeto é reconfigurada e corrigida com base na opção selecionada.

**Critérios de aceite:**
- [ ] A aplicação da solução sugerida deve ocorrer dentro de uma transação atômica no banco.
- [ ] O recálculo de integridade do enredo após a correção deve durar menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Habilitar modo de coautor (bloqueio de capítulo por usuário)

**ID:** UC-298  
**Requisito relacionado:** RF-298 (habilitar modo de coautor)  
**Ator(es):** Usuário A (Coautor ativo), Usuário B (Coautor concorrente), Sistema  
**Pré-condições:** O projeto é colaborativo e ambos os coautores possuem permissão de escrita.  
**Gatilho:** O Usuário A clica em um capítulo para iniciar a edição do documento.  

**Fluxo principal:**
1. O Usuário A abre o capítulo no editor de texto.
2. O sistema envia a notificação de trancamento de arquivo para o servidor via conexão persistente (WebSocket).
3. O sistema ativa o bloqueio do capítulo de texto para o Usuário A, gravando o status em cache de memória rápida do servidor.
4. O Usuário B tenta abrir o mesmo capítulo de texto no painel dele.
5. O sistema abre o capítulo para o Usuário B no modo "Apenas Leitura", desabilitando o teclado de digitação e exibindo um banner informando que o capítulo está sendo editado no momento pelo Usuário A.
6. O Usuário B visualiza a escrita do Usuário A em tempo real, mas é impedido de fazer alterações concorrentes.

**Fluxos alternativos:**
- *Liberação automática de trava:* O Usuário A fecha o capítulo ou sai da tela. O sistema dispara evento WebSocket desfazendo a trava e liberando o arquivo de escrita para outros coautores.

**Fluxos de exceção:**
- *Inatividade ou desconexão:* Se o Usuário A ficar inativo ou perder a conexão de rede por mais de 10 minutos, o sistema expira o status de trancamento automaticamente e libera o capítulo.

**Pós-condições:** O status de bloqueio de edição exclusiva do capítulo é gerenciado ativamente.

**Critérios de aceite:**
- [ ] A ativação e validação do bloqueio de arquivo devem ocorrer em menos de 100ms via WebSocket.
- [ ] O banner de aviso de bloqueio de capítulo deve exibir a foto e o nome em tempo real do coautor que está com o arquivo aberto para escrita.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Habilitar chat de coautores no documento (comentário em tempo real)

**ID:** UC-299  
**Requisito relacionado:** RF-299 (habilitar chat de coautores no documento)  
**Ator(es):** Usuário A (Coautor), Usuário B (Coautor), Sistema  
**Pré-condições:** Ambos os coautores estão com o mesmo documento aberto simultaneamente.  
**Gatilho:** O Usuário A abre o painel de chat lateral do documento.  

**Fluxo principal:**
1. O Usuário A abre a aba de chat flutuante do capítulo de escrita ativa.
2. O Usuário A digita uma mensagem e clica em enviar.
3. O sistema envia a mensagem em tempo real via WebSocket.
4. A mensagem de Usuário A é renderizada na janela de chat do Usuário B de forma imediata.
5. O Usuário B responde.
6. Ambos debatem o enredo do texto em tempo real sem sair da tela do editor de texto.

**Fluxos alternativos:**
- *Discussões arquivadas:* As mensagens trocadas no chat do documento são gravadas sob uma aba de discussões passadas do próprio arquivo para histórico.

**Fluxos de exceção:**
- *Desconexão temporária:* Se um dos coautores perder a conexão de rede, o painel do chat exibe o status offline e tenta reconectar em background, enfileirando as mensagens não enviadas.

**Pós-condições:** O canal de comunicação síncrono é disponibilizado ao lado da página de digitação.

**Critérios de aceite:**
- [ ] O chat do documento deve carregar em background de forma assíncrona sem comprometer o lag de digitação no editor.
- [ ] As mensagens de chat devem ser persistidas de forma integrada no histórico do projeto.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Visualizar histórico de alterações por coautor

**ID:** UC-300  
**Requisito relacionado:** RF-300 (visualizar histórico de alterações por coautor)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui modificações salvas por mais de um autor na tabela de histórico de versões.  
**Gatilho:** O usuário acessa o Histórico de Versões do capítulo de texto.  

**Fluxo principal:**
1. O usuário abre o capítulo de texto desejado e acessa a aba "Versões e Alterações".
2. O sistema busca no banco as alterações do arquivo e monta a lista de revisões.
3. A interface renderiza uma barra lateral contendo cartões de commits indicando: nome/foto do coautor que realizou a alteração, data/hora e volume de caracteres modificados.
4. O usuário clica sobre a revisão correspondente.
5. O sistema exibe um painel de comparação de diferenças (Diff visual), colorindo em verde os trechos inseridos e em vermelho riscado os trechos removidos pelo coautor selecionado.
6. O usuário audita as modificações específicas executadas.

**Fluxos alternativos:**
- *Reverter modificações:* O usuário clica em "Reverter para esta versão", aplicando a revisão antiga e gerando um rollback que remove as alterações subsequentes do coautor.

**Fluxos de exceção:**
- *Sem autor associado:* Se houver alterações antigas de importação de dados sem autoria mapeada, o sistema as exibe sob o rótulo "Sistema / Importação".

**Pós-condições:** O diff de alterações estruturado por autor é exibido de forma visual na tela.

**Critérios de aceite:**
- [ ] O diff visual deve ter precisão de caracteres e palavras de forma rápida e responsiva.
- [ ] O tempo total de carregamento e cálculo das diferenças da versão comparada deve ser de no máximo 2 segundos.

---

## Tabela Resumo: Lote 30 (UC-291 a UC-300)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-291** | RF-291 (associar facções a eventos históricos) | Alta | Baixa |
| **UC-292** | RF-292 (filtrar eventos por personagem) | Alta | Baixa |
| **UC-293** | RF-293 (filtrar eventos por local) | Alta | Média |
| **UC-294** | RF-294 (filtrar eventos por facção) | Alta | Baixa |
| **UC-295** | RF-295 (associar imagens a eventos históricos) | Alta | Baixa |
| **UC-296** | RF-296 (criar relatórios de inconsistências...) | Alta | Alta |
| **UC-297** | RF-297 (sugerir correções para inconsistências) | Média | Alta |
| **UC-298** | RF-298 (modo coautor - bloqueio de capítulo) | Alta | Alta |
| **UC-299** | RF-299 (chat de coautores no documento) | Média | Média |
| **UC-300** | RF-300 (histórico de alterações por coautor) | Alta | Alta |
