# Casos de Uso - Lote 42 (UC-411 a UC-420)

Este documento contém a especificação dos casos de uso de 411 a 420 derivados dos Requisitos Funcionais (RFs) e Requisitos Não Funcionais (RNFs) do projeto.

---
### Caso de Uso: Sugerir trilha sonora baseada no tom emocional da cena

**ID:** UC-411  
**Requisito relacionado:** RF-406 (sugerir trilha sonora baseada no tom emocional da cena)  
**Ator(es):** Sistema, IA, Usuário (Escritor)  
**Pré-condições:** A cena de texto possui conteúdo escrito no editor.  
**Gatilho:** O usuário clica em "Sugerir Trilha Sonora" nas ferramentas da cena.  

**Fluxo principal:**
1. O usuário acessa a barra lateral da cena e clica em "Sugerir Trilha por Tom".
2. O backend envia o texto da cena para a IA que realiza análise sentimental (detectando tons de suspense, aventura, drama ou mistério).
3. A IA identifica o tom predominante da cena e a intensidade calculada.
4. O sistema realiza busca no banco de mídias de áudio por trilhas instrumentais contendo tags de humor compatíveis.
5. O sistema apresenta uma listagem de 3 faixas com descrição da justificativa de recomendação.
6. O usuário escuta a prévia rápida e clica em "Associar a esta Cena".

**Fluxos alternativos:**
- *Parametrização manual:* O usuário discorda da análise de sentimentos da IA e seleciona manualmente o tom (ex: "Aventura") para filtrar novas sugestões de áudio.

**Fluxos de exceção:**
- *Biblioteca vazia:* Se nenhuma música corresponder ao tom detectado da cena, o sistema avisa na tela e sugere associar links de playlists de repositórios públicos.

**Pós-condições:** A trilha sonora sugerida é vinculada às propriedades de áudio da cena.

**Critérios de aceite:**
- [ ] A análise de sentimento e retorno de sugestões de áudio devem durar menos de 3 segundos.
- [ ] O sistema de áudio deve permitir ouvir a prévia com player integrado na tela de sugestões.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Gerar playlist automática por capítulo/humor

**ID:** UC-412  
**Requisito relacionado:** RF-407 (gerar playlist automática por capítulo/humor)  
**Ator(es):** Sistema, IA, Usuário (Escritor)  
**Pré-condições:** Capítulos de texto escritos e cadastrados no projeto.  
**Gatilho:** O usuário clica em "Gerar Playlist do Capítulo" no painel de áudio do capítulo.  

**Fluxo principal:**
1. O usuário abre o capítulo de sua obra no editor e acessa o menu de controle de áudio.
2. O usuário clica no botão "Gerar Playlist Automática".
3. A IA analisa o humor predominante de cada cena constituinte do capítulo e compila a sequência emocional da narrativa.
4. A IA seleciona faixas instrumentais correspondentes na biblioteca e monta uma lista de reprodução (playlist) ordenada.
5. O sistema salva a playlist gerada e a exibe no reprodutor lateral do capítulo.
6. O usuário inicia a reprodução contínua da playlist enquanto escreve.

**Fluxos alternativos:**
- *Exportar playlist:* O usuário clica em "Exportar Playlist para Spotify" e o sistema gera a lista de faixas correspondentes na conta do usuário conectado via API.

**Fluxos de exceção:**
- *Capítulo vazio:* Se o capítulo selecionado não contiver texto escrito, o sistema impede a geração automática e solicita digitação prévia ou seleção manual de humor.

**Pós-condições:** A playlist sequencial baseada no humor do capítulo é gerada e vinculada à barra de reprodução.

**Critérios de aceite:**
- [ ] A playlist gerada deve conter transições suaves de áudio (crossfade) de 2 segundos entre as faixas da lista.
- [ ] O processamento e geração da playlist por IA devem demorar menos de 4 segundos.

**Prioridade:** Baixa  
**Complexidade estimada:** Média  

---
### Caso de Uso: Associar som ambiente a local do universo

**ID:** UC-413  
**Requisito relacionado:** RF-408 (associar som ambiente a local do universo)  
**Ator(es):** Usuário (Escritor/RPGista), Sistema  
**Pré-condições:** Fichas de locais cadastradas e banco de áudio de som ambiente ativo.  
**Gatilho:** O usuário edita a ficha técnica de uma localidade de seu universo.  

**Fluxo principal:**
1. O usuário abre a ficha técnica do local correspondente (ex: "Masmorra Escura").
2. O usuário acessa a seção "Som Ambiente / Efeito Sonoro".
3. O usuário seleciona o áudio de som ambiente correspondente (ex: "Gotejamento + Vento frio" em loop) e regula o volume.
4. O usuário clica em "Salvar".
5. O sistema grava o vínculo correspondente na base de dados do projeto.
6. Ao abrir a visualização ou leitura da ficha técnica da localidade, o sistema inicia a reprodução do loop de som ambiente de forma automática em segundo plano.

**Fluxos alternativos:**
- *Sons sobrepostos:* O usuário constrói um som ambiente personalizado adicionando camadas de loops (canal 1 = vento, canal 2 = uivos), regulando o ganho de cada um de forma independente.

**Fluxos de exceção:**
- *Erro de carregamento:* Se o arquivo de áudio falhar ao carregar no dispositivo do cliente, o sistema silencia a reprodução automática em background e exibe um alerta sutil no reprodutor.

**Pós-condições:** O som ambiente é associado ao local e ativado no modo de leitura de fichas.

**Critérios de aceite:**
- [ ] O arquivo de som ambiente deve ser reproduzido em modo Loop sem quebras ou interrupções perceptíveis na transição de volta ao início.
- [ ] O salvamento da ficha com o som ambiente associado deve demorar menos de 200ms.

**Prioridade:** Baixa  
**Complexidade estimada:** Média  

---
### Caso de Uso: Salvar automaticamente sem perda de progresso em caso de queda de conexão (RNF)

**ID:** UC-414  
**Requisito relacionado:** RNF-Critical-1 (salvar automaticamente sem perda em queda de conexão)  
**Ator(es):** Sistema, Infraestrutura Cliente/Servidor  
**Pré-condições:** O usuário está ativamente editando um documento de texto ou ficha técnica no editor.  
**Gatilho:** A conexão de rede com a internet é interrompida (offline).  

**Fluxo principal:**
1. O usuário está digitando no editor e a conexão com a internet cai.
2. O sistema detecta a perda de sinal local e exibe uma notificação de controle visual no rodapé da página.
3. O sistema desvia o salvamento automático das novas edições de texto da API remota para o banco de dados local do navegador (IndexedDB).
4. O usuário continua escrevendo e editando normalmente sem interrupções de interface.
5. Quando a conexão é restabelecida, o sistema detecta o sinal de rede ativo, executa a sincronização dos dados locais salvos com a API do servidor e exibe a mensagem de sucesso.

**Fluxos alternativos:**
- *Conflito de versão:* Se o documento foi editado em outra máquina enquanto o usuário estava offline, o sistema exibe o painel de resolução de conflitos de diff visual na volta online, exigindo a seleção da versão vencedora.

**Fluxos de exceção:**
- *Cache local lotado:* Se o IndexedDB do navegador do usuário estiver sem espaço livre para novas edições, o sistema exibe popup de erro crítico e bloqueia temporariamente a digitação para evitar a perda de novos dados no buffer.

**Pós-condições:** Todos os dados editados offline são salvos localmente no navegador e sincronizados de forma íntegra sem perdas ao retornar a conexão.

**Critérios de aceite:**
- [ ] Nenhuma palavra ou caractere digitado offline deve ser perdido durante a transição de rede.
- [ ] O tempo de detecção de queda e transição do salvamento de rede para o local deve ser imediato (< 50ms).

**Prioridade:** Crítica  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Criptografar dados sensíveis em trânsito (HTTPS/TLS) (RNF)

**ID:** UC-415  
**Requisito relacionado:** RNF-Critical-2 (criptografar dados sensíveis em trânsito)  
**Ator(es):** Sistema, Servidor Web (Infraestrutura)  
**Pré-condições:** Servidor da aplicação com certificado digital SSL/TLS válido instalado e ativo.  
**Gatilho:** Um usuário ou API tenta realizar uma requisição HTTP ou estabelecer conexão WebSocket.  

**Fluxo principal:**
1. O usuário tenta acessar a aplicação digitando o protocolo sem segurança (ex: `http://plataforma.com`).
2. O servidor de borda intercepta a requisição HTTP porta 80 e realiza redirecionamento automático permanente (HTTP 301) para a versão segura HTTPS na porta 443.
3. O navegador e o servidor realizam o aperto de mão (TLS handshake) negociando o protocolo TLS 1.3 de criptografia de dados.
4. Todo o tráfego subsequente de dados de requisições, logins, uploads e WebSockets (WSS) passa a circular criptografado de forma asimétrica na rede.

**Fluxos alternativos:**
- *Renovação automática:* O sistema executa um script automatizado a cada 60 dias para renovar as chaves e o certificado digital SSL antes do vencimento na nuvem de produção.

**Fluxos de exceção:**
- *Protocolo antigo:* Se o cliente tentar conexão usando navegadores legados com protocolos TLS vulneráveis (ex: TLS 1.0), o servidor recusa a conexão de forma imediata por motivos de segurança da informação.

**Pós-condições:** Toda a troca de dados entre clientes e servidores da plataforma ocorre de forma criptografada em trânsito.

**Critérios de aceite:**
- [ ] 100% das páginas e requisições de API devem retornar cabeçalho de segurança HSTS configurado.
- [ ] A nota de segurança de criptografia SSL da plataforma nos testes deve ser obrigatoriamente A+.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Criptografar dados sensíveis em repouso (banco de dados) (RNF)

**ID:** UC-416  
**Requisito relacionado:** RNF-Critical-3 (criptografar dados sensíveis em repouso)  
**Ator(es):** Sistema, Banco de Dados / Storage (Infraestrutura)  
**Pré-condições:** Motor de banco de dados com suporte à Criptografia de Dados Transparente (TDE) ativo.  
**Gatilho:** O sistema realiza gravações de dados no banco de dados ou discos.  

**Fluxo principal:**
1. O backend realiza a persistência de informações sensíveis (dados pessoais, salários do RH, senhas) no banco de dados.
2. O motor do banco de dados intercepta a escrita e codifica os blocos de dados antes de gravá-los fisicamente no disco utilizando chaves AES-256.
3. Arquivos e documentos anexados são criptografados na camada do bucket de persistência de mídias antes do salvamento físico.
4. Em caso de furto físico de discos do servidor ou cópias de segurança de banco (backups), os dados permanecem ilegíveis sem acesso às chaves do chaveiro de segurança (KMS).

**Fluxos alternativos:**
- *Criptografia lógica:* Campos altamente críticos (como tokens de banco) são criptografados pelo código da aplicação no backend antes de serem passados em queries para o banco de dados.

**Fluxos de exceção:**
- *Chave KMS inacessível:* Se o serviço de gerenciamento de chaves falhar na inicialização do servidor, o banco de dados bloqueia todos os acessos de escrita e leitura e emite alertas urgentes para a equipe de SRE.

**Pós-condições:** Todos os dados persistidos em disco e backups no servidor são armazenados de forma criptografada.

**Critérios de aceite:**
- [ ] Os backups em arquivos físicos do banco de dados gerados automaticamente devem ser criptografados na origem.
- [ ] A latência de descriptografia em tempo de execução ao ler os dados do banco deve ser imperceptível (< 50ms).

**Prioridade:** Crítica  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Realizar backup periódico automático dos dados (RNF)

**ID:** UC-417  
**Requisito relacionado:** RNF-Critical-4 (realizar backup periódico automático dos dados)  
**Ator(es):** Sistema, Servidor de Backup (Infraestrutura)  
**Pré-condições:** Agendador de tarefas ativo e espaço disponível em servidor de storage de backups.  
**Gatilho:** Disparo do cron job de backup programado (ex: diariamente às 02:00 da manhã).  

**Fluxo principal:**
1. O agendador de tarefas em background dispara o job de backup na madrugada.
2. O sistema realiza um snapshot consistente em tempo real do banco de dados.
3. O sistema compacta e criptografa o arquivo de backup resultante utilizando a chave AES-256.
4. O sistema realiza o upload seguro do arquivo para um servidor de armazenamento isolado geograficamente (outra região).
5. O sistema registra a data, tamanho, hash e status de sucesso do backup na tabela de auditoria.
6. O sistema executa rotina de purga, removendo backups com mais de 30 dias para otimização de espaço.

**Fluxos alternativos:**
- *Replicação síncrona:* O banco de dados secundário (leitura em espelho) recebe cópias síncronas de todas as transações da base principal de forma instantânea para alta disponibilidade e prevenção de catástrofes.

**Fluxos de exceção:**
- *Falha no upload:* Se o backup falhar por falta de espaço no servidor de destino ou queda de rede, o sistema envia alertas críticos via e-mail e SMS para a equipe de DevOps/SRE.

**Pós-condições:** O arquivo compactado e criptografado de backup diário é salvo de forma segura na nuvem isolada.

**Critérios de aceite:**
- [ ] O tempo total de indisponibilidade ou lentidão da aplicação durante a execução do snapshot de backup deve ser imperceptível aos usuários (< 2 segundos).
- [ ] O sistema deve reter cópias diárias por 30 dias, semanais por 4 semanas e mensais por 12 meses.

**Prioridade:** Crítica  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Garantir isolamento de dados entre usuários/projetos (multi-tenancy seguro) (RNF)

**ID:** UC-418  
**Requisito relacionado:** RNF-Critical-5 (garantir isolamento de dados (multi-tenancy seguro))  
**Ator(es):** Sistema, Banco de Dados  
**Pré-condições:** Modelo de arquitetura multi-tenant implementado no banco de dados.  
**Gatilho:** Um usuário realiza uma consulta de leitura ou comando de gravação em qualquer módulo.  

**Fluxo principal:**
1. O usuário do Tenant ID 10 solicita a visualização da listagem de personagens.
2. O backend intercepta a requisição e anexa de forma automática e forçada a restrição do inquilino (ex: `WHERE tenant_id = 10`) em todas as consultas SQL do repositório.
3. O banco de dados processa a consulta indexada.
4. O banco retorna apenas os personagens pertencentes ao Tenant ID 10.
5. O usuário correspondente é impedido de acessar dados de outros tenants mesmo alterando IDs de parâmetros em URLs de requisições.

**Fluxos alternativos:**
- *Isolamento físico:* Para clientes corporativos enterprise, o sistema cria instâncias dedicadas de banco de dados físicos separados, garantindo isolamento total em nível de hardware.

**Fluxos de exceção:**
- *Vazamento de query:* Se o sistema detectar uma tentativa de execução de query crítica de leitura que não contenha o filtro de tenant id correspondente ao token do usuário, a requisição é abortada e gera log de falha de segurança interna.

**Pós-condições:** O isolamento total de dados entre diferentes empresas/inquilinos é garantido na camada de persistência.

**Critérios de aceite:**
- [ ] Os testes automatizados de segurança devem validar periodicamente a imunidade a falhas de acessos cruzados entre tenants (cross-tenant leakage).
- [ ] A aplicação do filtro de tenant_id não deve onerar as consultas de banco de dados (indexação correta de tabelas).

**Prioridade:** Crítica  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Estar disponível pelo menos 99,5% do tempo (uptime) (RNF)

**ID:** UC-419  
**Requisito relacionado:** RNF-Critical-6 (uptime de 99,5% do tempo)  
**Ator(es):** Sistema, Balanceador de Carga / Clusters (Infraestrutura)  
**Pré-condições:** Aplicação hospedada em clusters redundantes com balanceador de carga ativo.  
**Gatilho:** Queda física ou falha de hardware em um dos servidores de produção.  

**Fluxo principal:**
1. A plataforma roda sob múltiplos servidores paralelos ativos atrás de um balanceador de carga.
2. Um dos servidores do cluster sofre uma falha crítica de hardware e desliga.
3. O monitor de integridade (health check) do balanceador de carga detecta a inatividade do nó com falha em até 10 segundos.
4. O balanceador de carga redireciona imediatamente 100% das requisições subsequentes para os servidores operacionais restantes.
5. Os usuários continuam utilizando a plataforma normalmente sem interrupções de serviço.
6. O sistema de escalonamento automático (auto-scaling) inicia uma nova instância substituta de servidor para restabelecer a capacidade do pool.

**Fluxos alternativos:**
- *Atualização sem queda:* Ao implantar código novo (deploy), o sistema atualiza as instâncias uma a uma (Rolling Update), mantendo sempre servidores ativos e evitando downtime na atualização.

**Fluxos de exceção:**
- *Falha regional:* Se toda a região do data center principal sofrer indisponibilidade, o sistema de failover de DNS redireciona o tráfego dos usuários para servidores em uma segunda região geográfica de backup.

**Pós-condições:** A plataforma se mantém operacional garantindo a cota de 99,5% de uptime anual (máximo de 1,83 dias de downtime acumulado por ano).

**Critérios de aceite:**
- [ ] O balanceador de carga deve remover instâncias problemáticas do pool em até 15 segundos após falhas consecutivas de resposta.
- [ ] A latência de failover em caso de queda de servidores de aplicação deve ser imperceptível ao usuário final.

**Prioridade:** Crítica  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Validar e sanitizar todas as entradas para evitar injeção de código (SQL Injection, XSS) (RNF)

**ID:** UC-420  
**Requisito relacionado:** RNF-Critical-7 (validar e sanitizar entradas contra injeção de código)  
**Ator(es):** Sistema (Backend/Frontend)  
**Pré-condições:** Filtros de sanitização de inputs e ORM configurados no backend.  
**Gatilho:** Um usuário mal-intencionado envia parâmetros de entrada contendo scripts maliciosos.  

**Fluxo principal:**
1. O usuário mal-intencionado preenche um campo de entrada de formulário da aplicação digitando payloads de injeção SQL (ex: `' OR 1=1 --`) ou tags de XSS (ex: `<script>alert('hack')</script>`).
2. O usuário clica em enviar os dados.
3. O backend recebe a payload e intercepta no validador de entradas (Schema Validator).
4. O sistema limpa as tags HTML maliciosas, convertendo caracteres especiais em entidades de texto seguras, e usa consultas parametrizadas do ORM para gravação no banco de dados.
5. A payload é salva de forma inofensiva na base de dados como puro texto corrido.
6. A interface renderiza o texto de forma segura nas telas dos usuários, impedindo execuções de scripts ou vazamentos de banco.

**Fluxos alternativos:**
- *Filtro WAF:* O Web Application Firewall na borda da rede analisa a payload da requisição HTTP e bloqueia a chamada antes que chegue à API da aplicação se detectar padrões comuns de ataques conhecidos.

**Fluxos de exceção:**
- *Erro de formato:* Se o usuário tentar enviar textos em um campo restrito para tipos numéricos (ex: idade), o sistema rejeita a transação antes de rodar a query e retorna erro HTTP 400.

**Pós-condições:** A entrada contendo a tentativa de injeção de código é sanitizada, armazenada de forma segura e inofensiva.

**Critérios de aceite:**
- [ ] Nenhuma entrada de dados vinda do cliente deve ser enviada diretamente em queries de banco cruas (raw queries) sem parametrização.
- [ ] O tempo gasto na sanitização de dados de inputs normais de formulário deve ser inferior a 20ms.

---

## Tabela Resumo: Lote 42 (UC-411 a UC-420)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-411** | RF-406 (sugerir trilha por tom emocional) | Média | Média |
| **UC-412** | RF-407 (playlist automática do capítulo) | Baixa | Média |
| **UC-413** | RF-408 (som ambiente vinculado a local) | Baixa | Média |
| **UC-414** | RNF-Critical-1 (salvamento automático offline) | Crítica | Alta |
| **UC-415** | RNF-Critical-2 (criptografia em trânsito HTTPS) | Crítica | Média |
| **UC-416** | RNF-Critical-3 (criptografia em repouso TDE) | Crítica | Alta |
| **UC-417** | RNF-Critical-4 (backups diários automáticos) | Crítica | Alta |
| **UC-418** | RNF-Critical-5 (isolamento multi-tenancy) | Crítica | Alta |
| **UC-419** | RNF-Critical-6 (uptime de 99,5%) | Crítica | Alta |
| **UC-420** | RNF-Critical-7 (sanitização de inputs SQL/XSS) | Crítica | Média |
