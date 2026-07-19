# Casos de Uso - Lote 21 (UC-201 a UC-210)

Este documento contém a especificação dos casos de uso de 201 a 210 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Visualizar estatísticas de produtividade do colaborador

**ID:** UC-201  
**Requisito relacionado:** RF-201 (visualizar estatísticas de produtividade do colaborador)  
**Ator(es):** Usuário (Escritor/Admin), Sistema  
**Pré-condições:** O projeto possui atividade de múltiplos colaboradores registrada na tabela de logs.  
**Gatilho:** O usuário clica na aba "Produtividade da Equipe" no painel de estatísticas.  

**Fluxo principal:**
1. O usuário acessa o Dashboard de estatísticas e clica em "Métricas dos Colaboradores".
2. O sistema exibe um seletor contendo a lista de membros do projeto.
3. O usuário seleciona o colaborador desejado.
4. O sistema processa os logs e exibe:
   - Gráfico de palavras escritas por dia pelo colaborador.
   - Horários de maior atividade de escrita.
   - Lista de capítulos com maior contribuição desse membro.
5. O usuário visualiza o relatório de rendimento.

**Fluxos alternativos:**
- *Métricas individuais:* Se o projeto for privado (individual), a tela exibe apenas o relatório de produtividade do próprio usuário escritor.

**Fluxos de exceção:**
- *Privacidade ativada:* Se o colaborador configurou seu perfil para ocultar dados de produtividade detalhados, o sistema exibe apenas as contagens gerais de palavras adicionadas, omitindo dados comportamentais.

**Pós-condições:** As estatísticas individuais de rendimento e constância de escrita do colaborador selecionado são exibidas.

**Critérios de aceite:**
- [ ] A contagem das estatísticas de produtividade deve ser recalculada e guardada no banco periodicamente de forma assíncrona.
- [ ] O carregamento dos gráficos estatísticos deve demorar menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Exportar estatísticas do projeto (CSV/PDF)

**ID:** UC-202  
**Requisito relacionado:** RF-202 (exportar estatísticas do projeto (CSV/PDF))  
**Ator(es):** Usuário (Escritor/Admin), Sistema  
**Pré-condições:** O projeto possui dados estatísticos acumulados no dashboard.  
**Gatilho:** O usuário clica no botão "Exportar Relatório" no Dashboard de estatísticas.  

**Fluxo principal:**
1. O usuário acessa o painel de estatísticas.
2. O usuário clica em "Exportar Métricas" e seleciona o formato: "Relatório Consolidado (PDF)" ou "Dados Brutos (CSV)".
3. O usuário seleciona a opção "Relatório Consolidado (PDF)" e clica em confirmar.
4. O sistema gera a formatação de tabelas e insere os gráficos renderizados em imagem no arquivo PDF.
5. O navegador inicia o download automático do arquivo.

**Fluxos alternativos:**
- *Exportação CSV:* O usuário escolhe CSV. O sistema compila os logs de palavras por dia e distribuição de entidades em colunas tabuladas prontas para uso no Excel.

**Fluxos de exceção:**
- *Dados nulos:* Se o projeto não possuir registros de escrita ou dados, o sistema emite um alerta e desabilita a exportação.

**Pós-condições:** O relatório consolidado de métricas e produtividade do projeto é gerado e baixado.

**Critérios de aceite:**
- [ ] O arquivo PDF gerado deve possuir formatação profissional com capas e sumários explicativos.
- [ ] O processamento do PDF estatístico deve demorar menos de 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criar metas de produtividade em equipe

**ID:** UC-203  
**Requisito relacionado:** RF-203 (criar metas de produtividade em equipe)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O projeto possui colaboradores vinculados e o usuário tem cargo de administração.  
**Gatilho:** O administrador acessa a tela de Metas e clica em "Nova Meta Coletiva".  

**Fluxo principal:**
1. O administrador acessa "Metas de Escrita" e clica em "Nova Meta de Equipe".
2. O sistema abre o formulário solicitando: Nome da Meta, Contribuição Alvo por membro, Data Limite, e pasta de documentos elegível.
3. O administrador preenche os dados e clica em "Criar Meta".
4. O sistema registra a meta na tabela de metas coletivas e notifica todos os colaboradores do projeto.
5. A barra de progresso da meta coletiva passa a ser exibida no dashboard do projeto para toda a equipe.

**Fluxos alternativos:**
- *Modo ranking (Leaderboard):* O administrador ativa o modo ranking, onde a meta coletiva exibe uma lista ranqueada mostrando quem contribuiu com mais palavras para o objetivo comum.

**Fluxos de exceção:**
- *Sem colaboradores ativos:* Se não houver colaboradores vinculados ao projeto, o sistema impede a criação da meta de equipe e orienta a criar uma meta individual.

**Pós-condições:** A meta coletiva é criada e notificada aos colaboradores do projeto.

**Critérios de aceite:**
- [ ] O sistema deve permitir associar pesos ou metas individuais distintas para cada membro na composição da meta coletiva.
- [ ] O salvamento e disparo de notificações devem ocorrer em menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Acompanhar progresso da equipe (meta coletiva)

**ID:** UC-204  
**Requisito relacionado:** RF-204 (acompanhar progresso da equipe (meta coletiva))  
**Ator(es):** Usuários (Colaboradores), Sistema  
**Pré-condições:** O projeto possui uma meta coletiva ativa cadastrada.  
**Gatilho:** Edições de texto realizadas por qualquer membro participante são salvas no banco.  

**Fluxo principal:**
1. O Colaborador A escreve 300 palavras no capítulo correspondente e o documento é salvo.
2. O sistema detecta o evento de escrita, calcula as palavras adicionadas e atualiza o total consolidado da meta coletiva no banco de dados.
3. Ao acessar a aba de metas, qualquer membro da equipe visualiza a barra de progresso coletiva atualizada.
4. Abaixo da barra de progresso geral, o sistema exibe gráficos circulares de progresso individual mostrando a fatia de entrega de cada colaborador.

**Fluxos alternativos:**
- *Alerta de conclusão:* Quando a meta coletiva atinge 90% de conclusão, o sistema envia uma notificação em tempo real na tela de todos os colaboradores online.

**Fluxos de exceção:**
- *Descarte de edições:* Se um administrador excluir um arquivo de capítulo contendo palavras que faziam parte da meta, o sistema subtrai o volume de palavras correspondente do total acumulado da meta.

**Pós-condições:** O painel de progresso coletivo reflete as contribuições consolidadas em tempo real.

**Critérios de aceite:**
- [ ] O cálculo do progresso da equipe deve deduzir edições redundantes ou exclusões de texto de forma precisa.
- [ ] A interface deve recarregar os dados de progresso coletivo em menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Alternar permissão de escrita de pasta (bloquear/liberar)

**ID:** UC-205  
**Requisito relacionado:** RF-205 (alternar permissão de escrita de pasta (bloquear/liberar))  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** A pasta existe e o usuário tem cargo de administração do projeto.  
**Gatilho:** O administrador clica em "Bloquear Pasta" ou "Liberar Pasta" no menu de contexto.  

**Fluxo principal:**
1. O administrador clica com o botão direito sobre a pasta correspondente na árvore de arquivos lateral.
2. O administrador seleciona a opção "Permissões da Pasta".
3. O sistema abre um modal de controle de acesso.
4. O administrador clica na chave "Bloquear Escrita para Colaboradores (Somente Leitura)".
5. O administrador clica em "Aplicar Alteração".
6. O sistema atualiza o status de permissão da pasta no banco de dados e adiciona um ícone de cadeado ao lado do nome da pasta.
7. A partir deste momento, todos os colaboradores têm o acesso de escrita bloqueado nos arquivos contidos dentro dessa pasta.

**Fluxos alternativos:**
- *Bloqueio direcionado:* O administrador escolhe bloquear a escrita da pasta apenas para um colaborador específico, mantendo a permissão ativa para os demais membros.

**Fluxos de exceção:**
- *Bloquear si mesmo:* O sistema impede que o proprietário (Owner) bloqueie seu próprio acesso de escrita na pasta para evitar travamento acidental.

**Pós-condições:** O status de permissão de escrita da pasta e seus subdocumentos é alterado e aplicado às contas dos colaboradores.

**Critérios de aceite:**
- [ ] A restrição de escrita deve ser validada tanto na interface do editor quanto nos endpoints de gravação de arquivos da API (backend).
- [ ] A propagação do bloqueio a todos os subarquivos da pasta deve durar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Transferir propriedade do projeto

**ID:** UC-206  
**Requisito relacionado:** RF-206 (transferir propriedade do projeto)  
**Ator(es):** Usuário (Proprietário/Owner do Projeto), Sistema  
**Pré-condições:** O projeto possui outros colaboradores com contas ativas e o usuário é o proprietário atual.  
**Gatilho:** O proprietário seleciona a opção "Transferir Propriedade" nas configurações do projeto.  

**Fluxo principal:**
1. O proprietário acessa as configurações avançadas do projeto.
2. O proprietário clica em "Transferir Propriedade do Projeto".
3. O sistema exibe a lista de colaboradores ativos habilitados para receber a transferência.
4. O proprietário seleciona o colaborador de destino.
5. O sistema solicita que o proprietário digite sua senha de acesso atual por razões de segurança.
6. O proprietário insere a senha e clica em "Confirmar Transferência Definitiva".
7. O sistema valida a senha, altera o ID do proprietário na tabela de projetos e rebaixa a permissão do proprietário antigo para o nível "Administrador".
8. O sistema envia uma notificação para o novo proprietário informando sobre a transferência.

**Fluxos alternativos:**
- *Aceite requerido:* O sistema exige uma etapa de confirmação do novo proprietário aceitando a propriedade antes de efetuar a migração no banco de dados.

**Fluxos de exceção:**
- *Senha incorreta:* Se o proprietário digitar a senha incorretamente, o sistema bloqueia a transação e exibe: "Senha de segurança incorreta. Ação cancelada".

**Pós-condições:** O novo usuário é gravado como proprietário definitivo do projeto no banco de dados.

**Critérios de aceite:**
- [ ] A transferência de propriedade deve ser uma ação transacional e irreversível pelo proprietário anterior.
- [ ] O processo de autenticação e validação de segurança deve durar menos de 1,5 segundos.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Remover colaboradores do projeto

**ID:** UC-207  
**Requisito relacionado:** RF-207 (remover colaboradores do projeto)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O colaborador que será removido está associado ao projeto.  
**Gatilho:** O administrador clica em "Remover" no modal de gerenciamento de membros.  

**Fluxo principal:**
1. O administrador acessa a tela de membros do projeto.
2. O administrador localiza o colaborador na listagem.
3. O administrador clica no ícone de "Remover" ao lado do nome do colaborador.
4. O sistema abre uma caixa de confirmação de exclusão do membro.
5. O administrador confirma.
6. O sistema remove o registro de vínculo do colaborador na tabela de permissões de membros do banco de dados.
7. Se o colaborador estiver com o projeto aberto no momento, a interface detecta a perda de permissão e o redireciona automaticamente para o Dashboard geral.

**Fluxos alternativos:**
- *Suspender membro:* O administrador seleciona "Suspender temporariamente", mantendo o usuário na listagem mas bloqueando seu login no projeto.

**Fluxos de exceção:**
- *Remover o proprietário:* O sistema impede que qualquer administrador remova o Proprietário (Owner) do projeto, desabilitando a opção correspondente.

**Pós-condições:** O colaborador perde o acesso de leitura/escrita e é excluído da listagem de membros do projeto.

**Critérios de aceite:**
- [ ] A revogação do token de acesso do colaborador removido no servidor deve ocorrer de forma imediata.
- [ ] A tela do colaborador removido deve fechar o projeto e retornar ao dashboard em menos de 1 segundo.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Sair do projeto colaborativo

**ID:** UC-208  
**Requisito relacionado:** RF-208 (sair do projeto colaborativo)  
**Ator(es):** Usuário (Colaborador)  
**Pré-condições:** O usuário está associado a um projeto colaborativo pertencente a terceiros.  
**Gatilho:** O colaborador seleciona a opção "Sair do Projeto" no painel de controle do projeto.  

**Fluxo principal:**
1. O colaborador abre o projeto compartilhado.
2. O colaborador clica no cabeçalho de opções do projeto e seleciona "Sair do Projeto".
3. O sistema exibe uma tela de confirmação de saída definitiva.
4. O colaborador clica em "Confirmar Saída".
5. O sistema remove a entrada do colaborador correspondente na tabela de membros no banco de dados.
6. O sistema redireciona o usuário de volta ao seu Dashboard de projetos.
7. O sistema envia uma notificação para o proprietário do projeto informando sobre a saída do membro.

**Fluxos alternativos:**
- *Saída rápida:* O usuário realiza a mesma operação clicando no botão "Sair" diretamente no card do projeto compartilhado exibido no Dashboard geral.

**Fluxos de exceção:**
- *Proprietário tentar sair:* Se o Proprietário tentar clicar em "Sair do Projeto", o sistema impede e orienta a transferir a propriedade ou excluir o projeto.

**Pós-condições:** O colaborador perde o vínculo com o projeto e é redirecionado ao dashboard.

**Critérios de aceite:**
- [ ] O processo de exclusão de permissões do colaborador deve ser concluído de forma transacional.
- [ ] A transição e carregamento do dashboard principal do usuário devem demorar menos de 1 segundo.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Rebaixar permissão de colaborador para leitor

**ID:** UC-209  
**Requisito relacionado:** RF-209 (rebaixar permissão de colaborador para leitor)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O colaborador possui cargo de edição ativo (Editor) no projeto.  
**Gatilho:** O administrador ajusta as permissões de membros no painel administrativo.  

**Fluxo principal:**
1. O administrador acessa a tela de membros do projeto.
2. O administrador localiza o colaborador desejado.
3. O administrador clica no seletor de permissão ao lado do nome e seleciona "Leitor" (Viewer).
4. O administrador clica em "Salvar Alterações".
5. O sistema atualiza o cargo na tabela de membros no banco de dados.
6. Se o colaborador rebaixado estiver online editando algum documento, o sistema bloqueia instantaneamente sua permissão de digitação na thread ativa e exibe a notificação de alteração de permissão.

**Fluxos alternativos:**
- *Expiração de acesso:* O administrador configura uma data de expiração para o acesso de escrita, fazendo com que o sistema rebaixe a conta do usuário para leitor de forma automática na data programada.

**Fluxos de exceção:**
- *Rebaixar proprietário:* O sistema impede o rebaixamento de cargo do proprietário do projeto por qualquer administrador.

**Pós-condições:** O cargo do colaborador é atualizado para "Leitor" limitando seu acesso no projeto a modo de leitura.

**Critérios de aceite:**
- [ ] A alteração do nível de permissão deve ser propagada aos endpoints de API do backend de imediato, negando requisições de salvamento.
- [ ] A atualização visual da interface de edição do usuário afetado deve ocorrer em até 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Promover permissão de leitor para colaborador

**ID:** UC-210  
**Requisito relacionado:** RF-210 (promover permissão de leitor para colaborador)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O usuário possui papel de "Leitor" ativo no projeto.  
**Gatilho:** O administrador eleva o acesso do usuário no painel de membros.  

**Fluxo principal:**
1. O administrador acessa o painel de gerenciamento de membros.
2. O administrador localiza o usuário correspondente.
3. O administrador clica no seletor de cargos e altera o papel para "Colaborador".
4. O administrador clica em "Salvar".
5. O sistema grava a alteração no banco de dados.
6. O sistema atualiza a sessão do leitor promovido, liberando a digitação no editor de textos e a criação de pastas no projeto.
7. O usuário promovido recebe uma notificação visual na tela indicando a liberação de edição.

**Fluxos alternativos:**
- *Promover a Administrador:* O proprietário promove um colaborador para "Administrador", dando a ele permissão de gerenciar outros membros, exceto o proprietário.

**Fluxos de exceção:**
- *Erro ao propagar permissão:* Se o WebSocket falhar no envio, o usuário continua em modo leitura até reabrir o projeto ou recarregar a página, forçando a leitura da nova permissão da API.

**Pós-condições:** O usuário passa a ter privilégios de escrita e edição no projeto.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a data e o ID do administrador responsável pela promoção nos logs de auditoria.
- [ ] O desbloqueio de escrita na tela do colaborador promovido deve ocorrer de forma fluida.

---

## Tabela Resumo: Lote 21 (UC-201 a UC-210)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-201** | RF-201 (visualizar estatísticas colaborador) | Média | Média |
| **UC-202** | RF-202 (exportar estatísticas CSV/PDF) | Média | Média |
| **UC-203** | RF-203 (criar metas em equipe) | Média | Média |
| **UC-204** | RF-204 (acompanhar meta coletiva) | Média | Média |
| **UC-205** | RF-205 (bloquear/liberar escrita de pasta) | Alta | Média |
| **UC-206** | RF-206 (transferir propriedade do projeto) | Crítica | Média |
| **UC-207** | RF-207 (remover colaboradores do projeto) | Crítica | Média |
| **UC-208** | RF-208 (sair do projeto colaborativo) | Alta | Baixa |
| **UC-209** | RF-209 (rebaixar colaborador para leitor) | Alta | Baixa |
| **UC-210** | RF-210 (promover leitor para colaborador) | Alta | Baixa |
