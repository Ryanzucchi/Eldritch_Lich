# Casos de Uso - Lote 44 (UC-431 a UC-440)

Este documento contém a especificação dos casos de uso de 431 a 440 derivados dos Requisitos Não Funcionais (RNFs) Altos e Médios do projeto.

---
### Caso de Uso: Permitir uso funcional mesmo com internet instável (modo offline básico) (RNF)

**ID:** UC-431  
**Requisito relacionado:** RNF-High-7 (modo offline básico)  
**Ator(es):** Sistema, Cliente (Navegador)  
**Pré-condições:** Service Workers registrados e ativos no navegador do usuário (configuração PWA).  
**Gatilho:** A internet do usuário apresenta alta instabilidade ou cai por completo.  

**Fluxo principal:**
1. O usuário está utilizando a plataforma e a conexão com a internet é interrompida.
2. O Service Worker intercepta as requisições de assets e chamadas de API do cliente.
3. Para arquivos estáticos (HTML, JS, CSS), o Service Worker serve os recursos diretamente do cache local do navegador.
4. Para dados de leitura de fichas e capítulos do projeto, o sistema busca e apresenta as informações armazenadas no banco IndexedDB local.
5. A interface exibe as informações correspondentes ao usuário, permitindo visualizações e edições locais.

**Fluxos alternativos:**
- *Mensagem de indisponibilidade:* Se o usuário tentar acessar uma aba que não foi cacheada previamente, o sistema exibe de forma limpa a tela: "Esta página necessita de conexão com a internet para carregar".

**Fluxos de exceção:**
- *Cache excluído:* Se o sistema operacional do dispositivo do usuário deletar o cache local por falta de espaço em disco, a aplicação exibe a tela padrão de indisponibilidade offline de dados.

**Pós-condições:** A aplicação continua operando de forma básica e legível sem apresentar travamentos de tela por queda de rede.

**Critérios de aceite:**
- [ ] A aplicação deve carregar a estrutura básica do layout (App Shell) em menos de 1,5 segundos em modo 100% offline.
- [ ] A navegação offline de páginas em cache deve funcionar sem emitir erros de requisição não tratada no console do desenvolvedor.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Seguir princípios de acessibilidade (WCAG) para leitores de tela e navegação por teclado (RNF)

**ID:** UC-432  
**Requisito relacionado:** RNF-High-8 (acessibilidade WCAG)  
**Ator(es):** Sistema (Interface / HTML Semântico)  
**Pré-condições:** Estrutura HTML5 semântica e atributos WAI-ARIA corretamente mapeados nos componentes.  
**Gatilho:** Um usuário com deficiência visual ou motora navega pela plataforma utilizando teclado ou leitor de tela.  

**Fluxo principal:**
1. O usuário acessa a plataforma e inicia a navegação utilizando a tecla Tab.
2. O sistema exibe um indicador visual claro de foco (outline colorido) em cada elemento ativo selecionado na sequência de navegação.
3. O leitor de tela traduz em áudio o texto e os atributos de acessibilidade dos elementos focados (ex: `aria-expanded="false"`, `role="button"`).
4. O usuário utiliza a tecla Enter ou Barra de Espaço para acionar as opções de menus ou botões.
5. O sistema executa o comando e atualiza o estado lido na tela para o usuário.

**Fluxos alternativos:**
- *Atalhos de acessibilidade rápidos:* O usuário pressiona atalhos de teclado (ex: `Alt + 1`) para saltar os menus iniciais e ir diretamente para a caixa de edição de texto principal, agilizando o uso.

**Fluxos de exceção:**
- *Imagens sem tag alt:* Mídias inseridas sem descrição alternativa (alt tag) são ignoradas pelo leitor de tela ou descritas genericamente como "Imagem ilustrativa" para evitar a leitura ruidosa de caminhos brutos de arquivos.

**Pós-condições:** O usuário consegue navegar, ler e realizar ações críticas da plataforma por teclado ou leitor de tela de forma independente.

**Critérios de aceite:**
- [ ] O contraste de cores entre o texto e o plano de fundo em toda a interface deve atender à taxa mínima de 4.5:1 (nível AA da WCAG).
- [ ] A interface deve ser navegável por teclado sem armadilhas de foco (keyboard traps) que impeçam o usuário de retroceder ou fechar modais.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Possuir versionamento de API para evitar quebra de integrações existentes (RNF)

**ID:** UC-433  
**Requisito relacionado:** RNF-High-9 (versionamento de API)  
**Ator(es):** Sistema (Roteador de API), Integrações Externas / Clientes  
**Pré-condições:** Gateway de rotas configurado com suporte a múltiplos endpoints de versão paralelos (v1, v2).  
**Gatilho:** A equipe de engenharia publica uma alteração destrutiva (breaking change) em endpoints da API.  

**Fluxo principal:**
1. A equipe de desenvolvimento publica a nova versão de API contendo alterações incompatíveis na rota `/api/v2/entidades`.
2. A versão antiga compatível com as regras anteriores permanece ativa e inalterada no endpoint `/api/v1/entidades`.
3. As integrações e aplicativos clientes antigos continuam consumindo dados via rota `/api/v1` sem interrupções de serviço ou erros de incompatibilidade.
4. Os aplicativos novos e atualizados realizam as requisições utilizando a rota `/api/v2`.
5. O sistema gerencia e responde ambas as rotas no mesmo banco de dados, aplicando mapeamentos na camada dos controladores do backend.

**Fluxos alternativos:**
- *Depreciação de API (Deprecation):* A equipe sinaliza a v1 como depreciada. O sistema passa a retornar cabeçalhos HTTP de alerta com a data programada para encerramento das rotas de v1, permitindo migração programada.

**Fluxos de exceção:**
- *Versão inexistente:* Se o cliente tentar requisição em uma rota de versão que não existe (ex: `/api/v3/...`), o roteador de API bloqueia a chamada e retorna erro HTTP 404 Not Found.

**Pós-condições:** As novas versões de API são disponibilizadas sem causar quebras ou indisponibilidades nas integrações e clientes já existentes.

**Critérios de aceite:**
- [ ] O versionamento de endpoints da API deve ser explícito no caminho da URL (ex: `/api/v1/...`).
- [ ] A inclusão de novas rotas de v2 não deve interferir no tempo de resposta das chamadas ativas de v1.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Registrar logs de erro para diagnóstico rápido de falhas (RNF)

**ID:** UC-434  
**Requisito relacionado:** RNF-High-10 (registrar logs de erro)  
**Ator(es):** Sistema (Serviço de Log), Engenharia / DevOps  
**Pré-condições:** Framework de logging configurado e integrado a um console de agregação de logs.  
**Gatilho:** Ocorre um erro não tratado ou exceção de execução no backend ou frontend.  

**Fluxo principal:**
1. Ocorre uma exceção ou falha inesperada durante o processamento de uma requisição de usuário.
2. O backend captura a exceção na classe global de tratamento de erros (Exception Handler).
3. O sistema formata de forma automática o log do erro contendo: timestamp UTC, nível de criticidade (ERROR, CRITICAL), stack trace detalhado do erro, ID do usuário, endpoint chamado e payload da chamada.
4. O sistema grava o log no agregador centralizado de logs (ex: Sentry/Datadog) e exibe uma mensagem amigável para o usuário final.
5. A equipe de engenharia visualiza o erro agrupado no console do agregador para correção imediata.

**Fluxos alternativos:**
- *Auditoria de acessos:* O sistema registra logs informativos (INFO) de ações administrativas e transações financeiras críticas para fins de auditoria interna e conformidade de RH.

**Fluxos de exceção:**
- *Agregador offline:* Se o serviço remoto do agregador de logs estiver instável ou offline, o sistema grava os logs localmente em arquivos de texto de emergência (`error.log`) na máquina do servidor para evitar a perda de diagnóstico de falhas.

**Pós-condições:** O log descritivo do erro é capturado, formatado e persistido de forma segura para fins de depuração.

**Critérios de aceite:**
- [ ] Os logs não devem conter de forma alguma dados sensíveis brutos (como senhas brutas ou cartões de crédito) que violem regras de compliance de dados (sanitização de logs ativa).
- [ ] O disparo de gravação do log de erro não deve degradar a velocidade de entrega de erro do cliente (< 50ms).

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Isolar falhas de módulos de IA sem derrubar o restante da aplicação (RNF)

**ID:** UC-435  
**Requisito relacionado:** RNF-High-11 (isolar falhas de módulos de IA)  
**Ator(es):** Sistema (Arquitetura de Microsserviços / Circuit Breaker)  
**Pré-condições:** Módulo de IA rodando em contêiner ou serviço isolado do servidor de API principal. Padrão Circuit Breaker configurado.  
**Gatilho:** O servidor de IA cai ou estoura o tempo limite de resposta (timeout).  

**Fluxo principal:**
1. O usuário aciona uma funcionalidade de IA (ex: resumo por IA) na interface.
2. O backend principal da API envia a requisição para o módulo de IA isolado.
3. O módulo de IA falha consecutivamente por indisponibilidade.
4. O backend detecta as falhas, ativa o disjuntor (Circuit Breaker) e desativa temporariamente o fluxo de chamadas para a IA.
5. O backend responde imediatamente ao usuário final com a mensagem de que o serviço de IA está instável, mantendo a tela ativa e utilizável para digitação e outras operações comuns.
6. Os demais módulos vitais (escrita de textos, chats, financeiro) continuam operando normalmente sem interrupções.

**Fluxos alternativos:**
- *Recuperação automática do Circuit Breaker:* Passados 5 minutos, o sistema realiza uma chamada de teste silenciosa à IA. Se responder com sucesso, o disjuntor é fechado e a funcionalidade de IA é re-ativada para os usuários.

**Fluxos de exceção:**
- *Timeout rígido:* Se o módulo de IA demorar para responder sem cair fisicamente, o sistema corta a requisição após timeout limite de 10 segundos para liberar a thread da API principal e evitar lentidão.

**Pós-condições:** A falha no módulo de IA é contida e isolada de forma silenciosa, mantendo os recursos vitais da plataforma operacionais.

**Critérios de aceite:**
- [ ] O Circuit Breaker deve abrir de imediato após 3 falhas consecutivas de timeout ou erro 500 do módulo de IA.
- [ ] O isolamento de falha deve garantir que nenhum outro banco de dados do sistema principal seja corrompido ou travado pelas falhas de IA.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Processar tarefas pesadas (IA, importação em lote) de forma assíncrona sem travar a interface (RNF)

**ID:** UC-436  
**Requisito relacionado:** RNF-High-12 (processar tarefas pesadas assincronamente)  
**Ator(es):** Sistema (Fila de Tarefas / Workers em Background)  
**Pré-condições:** Infraestrutura de fila de mensagens e processos workers de segundo plano ativos.  
**Gatilho:** O usuário solicita uma ação de alto custo computacional na interface.  

**Fluxo principal:**
1. O usuário clica em "Importar Planilha de Funcionários (CSV)" contendo centenas de registros.
2. O backend recebe o arquivo, coloca a tarefa de importação em uma Fila de Processamento em Background e responde instantaneamente ao cliente confirmando o recebimento da planilha.
3. A interface do usuário é liberada de imediato na tela, permitindo que ele continue navegando e usando a plataforma normalmente.
4. Um processo Worker em background consome a tarefa da fila de forma isolada, processando os dados em segundo plano.
5. Ao concluir, o Worker envia uma notificação push via WebSocket para a interface do usuário correspondente informando a conclusão.

**Fluxos alternativos:**
- *Cancelamento:* O usuário acessa a tela de status de processamento e clica em "Cancelar Importação". O sistema interrompe o worker correspondente e limpa os registros parciais inseridos para integridade.

**Fluxos de exceção:**
- *Queda do Worker:* Se o processo do worker morrer durante a execução de uma tarefa, a tarefa permanece na fila marcada com falha, permitindo que outro worker a execute a partir do último checkpoint.

**Pós-condições:** O processamento pesado é executado de forma assíncrona sem gerar travamento de interface ou lentidão nas requisições normais da API.

**Critérios de aceite:**
- [ ] A resposta da API confirmando a inserção da tarefa na fila para o cliente deve durar menos de 200ms.
- [ ] O processamento em background não deve elevar o consumo de CPU da máquina da API principal acima de 40% (isolamento de processos de CPU).

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Ter código modular e testável (arquitetura desacoplada) (RNF)

**ID:** UC-437  
**Requisito relacionado:** RNF-Medium-1 (código modular e testável)  
**Ator(es):** Sistema (Arquitetura de Software / Engenharia)  
**Pré-condições:** Padrões de arquitetura limpa e injeção de dependências configurados no repositório de código.  
**Gatilho:** A equipe de desenvolvimento insere um novo módulo ou altera regras de negócio.  

**Fluxo principal:**
1. O desenvolvedor implementa um novo módulo (ex: Gestão de Metas) separando as regras em camadas lógicas (infraestrutura, adaptadores, regras de negócio e entidades).
2. O desenvolvedor escreve regras de negócio em classes desacopladas do banco de dados e do framework de rotas (inversão de dependência).
3. Ao construir a suíte de testes do módulo, o desenvolvedor mocka (simula) o banco de dados e a rede de forma simplificada no código dos testes.
4. O desenvolvedor roda a validação isolada, e o sistema executa os testes unitários sem abrir conexões de infraestrutura física.
5. Os testes unitários validam a integridade lógica da regra de negócio de metas com sucesso.

**Fluxos alternativos:**
- *Mudança de tecnologia:* A diretoria decide trocar o banco de dados da aplicação. Como as regras de negócio estão isoladas, a equipe altera apenas a implementação das classes do repositório da camada de infraestrutura, mantendo 100% da lógica de negócio intacta.

**Fluxos de exceção:**
- *Acoplamento indevido:* O pipeline de CI executa análises estáticas de arquitetura de código, rejeitando commits que tentem importar dependências de infraestrutura diretamente nas classes centrais de regras de negócio (domínio).

**Pós-condições:** O código-fonte mantém a modularidade estrutural e a testabilidade automatizada.

**Critérios de aceite:**
- [ ] A arquitetura deve seguir o princípio da responsabilidade única (SRP) e inversão de dependência (DIP) de SOLID.
- [ ] O tempo total de execução dos testes de unidade de uma classe deve ser de no máximo 50ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Possuir cobertura de testes automatizados nas funcionalidades críticas (RNF)

**ID:** UC-438  
**Requisito relacionado:** RNF-Medium-2 (cobertura de testes automatizados)  
**Ator(es):** Sistema (Pipeline de CI / Runner de Testes)  
**Pré-condições:** Suíte de testes unitários e de integração configurada no repositório.  
**Gatilho:** O desenvolvedor envia commits de código (push) para a branch principal (main).  

**Fluxo principal:**
1. O desenvolvedor realiza o push do código alterado para o repositório git.
2. O servidor de integração contínua (CI) intercepta o evento e dispara o pipeline de automações.
3. O runner do CI inicializa os testes automatizados unitários e de integração de forma paralela.
4. O sistema executa as validações e calcula a cobertura total de linhas e ramificações de código (Test Coverage).
5. O sistema valida que a cobertura de código nas áreas críticas (módulos financeiros, autenticação, salvamento de dados) está acima do limite planejado (ex: cobertura mínima de 80%).
6. O pipeline aprova o build para publicação em produção.

**Fluxos alternativos:**
- *Relatório de cobertura:* O sistema gera relatórios visuais destacando em vermelho as classes do projeto que necessitam de mais testes automatizados.

**Fluxos de exceção:**
- *Queda de cobertura ou testes falhando:* Se os testes apresentarem falhas ou a cobertura de código do commit cair abaixo de 80%, o pipeline de CI rejeita o commit, bloqueia o deploy e notifica a equipe de desenvolvimento.

**Pós-condições:** A integridade de código do sistema é validada pela suíte de testes automatizados antes de subir para a nuvem.

**Critérios de aceite:**
- [ ] A cobertura mínima de testes unitários nas classes críticas (autenticação, financeiro, regras de negócio) deve ser de no mínimo 80%.
- [ ] A execução completa de testes de unidade do CI deve levar menos de 2 minutos para garantir deploys rápidos.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Permitir deploy contínuo sem downtime perceptível (RNF)

**ID:** UC-439  
**Requisito relacionado:** RNF-Medium-3 (deploy contínuo sem downtime)  
**Ator(es):** Sistema (Pipeline de CD / Orquestrador de Deploy)  
**Pré-condições:** Orquestrador de containers suportando deploys no padrão Blue-Green ou Rolling Updates.  
**Gatilho:** O pipeline de CI aprova o build de uma nova versão estável (v1.2).  

**Fluxo principal:**
1. O sistema de deploy contínuo (CD) inicia o processo de atualização de versão na nuvem de produção.
2. O orquestrador mantém as instâncias da versão antiga (v1.1) ativas e respondendo às requisições dos usuários normalmente (Ambiente Blue).
3. O orquestrador inicializa as novas réplicas de containers da versão nova (v1.2) de forma isolada em paralelo (Ambiente Green).
4. O sistema executa testes automatizados rápidos de integridade (smoke tests) nas novas instâncias.
5. Ao passar nos testes de fumaça, o balanceador de carga redireciona instantaneamente o tráfego dos usuários da v1.1 para a v1.2 na camada de rede.
6. Os containers antigos de v1.1 realizam desligamento suave e são finalizados de forma limpa.

**Fluxos alternativos:**
- *Deploy Canário:* O sistema direciona apenas um pequeno percentual (ex: 5%) de conexões para a nova versão v1.2. Se nenhum erro ocorrer após 1 hora, expande gradualmente o tráfego de usuários até atingir 100% de direcionamento.

**Fluxos de exceção:**
- *Falhas detectadas na fumaça:* Se a versão v1.2 disparar erros de sistema na verificação de integridade inicial, o deploy é abortado pelo orquestrador mantendo 100% dos usuários no Ambiente Blue (v1.1) estável (Rollback Automático).

**Pós-condições:** O deploy da nova versão da aplicação é concluído com zero downtime de serviço.

**Critérios de aceite:**
- [ ] A troca de conexões entre versões no balanceador de carga deve ocorrer em menos de 100ms.
- [ ] O deploy não deve exigir telas de manutenção fora do horário comercial para subida de novos builds.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Manter documentação técnica atualizada da arquitetura (RNF)

**ID:** UC-440  
**Requisito relacionado:** RNF-Medium-4 (documentação técnica de arquitetura)  
**Ator(es):** Sistema (Gerador de Documentação), Engenharia  
**Pré-condições:** Documentação estruturada em markdown ou frameworks de API Docs (ex: Swagger/OpenAPI) integrados ao código.  
**Gatilho:** O desenvolvedor realiza alterações de esquemas de dados ou endpoints na API do projeto.  

**Fluxo principal:**
1. O desenvolvedor cria um novo endpoint e insere as anotações do Swagger descritivas correspondentes diretamente no código-fonte.
2. Ao realizar o commit e push do código para o repositório git, o gerador automatizado lê as anotações do código.
3. O sistema compila e gera a nova versão do arquivo de especificação da API (`openapi.json`).
4. O sistema publica as atualizações de forma automática no portal de desenvolvedores da plataforma.
5. Os desenvolvedores e usuários autorizados visualizam os novos métodos cadastrados atualizados no portal.

**Fluxos alternativos:**
- *Diagramas automatizados:* O sistema reconstrói os diagramas de entidade-relacionamento (ERD) do banco de dados a cada aplicação de scripts de migração estrutural de banco.

**Fluxos de exceção:**
- *Código sem documentação:* O linter de código rejeita o commit do desenvolvedor caso ele insira novas rotas públicas sem as anotações obrigatórias de documentação do Swagger.

**Pós-condições:** A documentação técnica da API e banco de dados é mantida atualizada de forma coerente e automática.

**Critérios de aceite:**
- [ ] O portal de documentação `/docs/api` deve ser público ou protegido por login e sincronizado de imediato com a versão de produção do sistema.
- [ ] O tempo total de build e geração da documentação no pipeline de CD deve ser inferior a 1 minuto.

---

## Tabela Resumo: Lote 44 (UC-431 a UC-440)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-431** | RNF-High-7 (modo offline básico da interface) | Alta | Alta |
| **UC-432** | RNF-High-8 (acessibilidade leitores de tela) | Alta | Média |
| **UC-433** | RNF-High-9 (versionamento de API v1/v2) | Alta | Média |
| **UC-434** | RNF-High-10 (gravação de logs de erro Sentry) | Alta | Média |
| **UC-435** | RNF-High-11 (isolamento do módulo de IA) | Alta | Alta |
| **UC-436** | RNF-High-12 (processamento de fila assíncrona) | Alta | Alta |
| **UC-437** | RNF-Medium-1 (código modular clean architecture) | Média | Média |
| **UC-438** | RNF-Medium-2 (taxa de testes automáticos > 80%) | Média | Média |
| **UC-439** | RNF-Medium-3 (deploy contínuo sem indisponibilidade) | Média | Alta |
| **UC-440** | RNF-Medium-4 (geração de documentação Swagger) | Média | Média |
