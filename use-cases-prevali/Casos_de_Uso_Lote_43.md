# Casos de Uso - Lote 43 (UC-421 a UC-430)

Este documento contém a especificação dos casos de uso de 421 a 430 derivados dos Requisitos Não Funcionais (RNFs) Críticos e Altos do projeto.

---
### Caso de Uso: Autenticar todas as requisições sensíveis via token seguro (RNF)

**ID:** UC-421  
**Requisito relacionado:** RNF-Critical-8 (autenticar requisições via token seguro)  
**Ator(es):** Sistema (API / Gateway de Autenticação)  
**Pré-condições:** Mecanismo de autenticação JWT estruturado com chaves criptográficas secretas ativas no servidor.  
**Gatilho:** O cliente envia uma requisição para um endpoint de API privado.  

**Fluxo principal:**
1. O cliente faz a chamada de rede anexando o token JWT no cabeçalho HTTP `Authorization: Bearer <token>`.
2. O gateway de API intercepta a requisição e valida a assinatura criptográfica do token usando a chave secreta correspondente.
3. O sistema verifica se o token está dentro da data de validade (validação do campo `exp`).
4. O sistema extrai os metadados do token (User ID, Tenant ID e escopos).
5. Se o token for válido e possuir o escopo de autorização correspondente ao endpoint solicitado, a requisição é autorizada e processada pelo backend.

**Fluxos alternativos:**
- *Renovação automática:* O token de acesso curto (ex: expiração de 15 minutos) expira. O cliente envia silenciosamente uma chamada com o refresh token seguro, gerando um novo JWT de acesso ativo sem desconectar o usuário.

**Fluxos de exceção:**
- *Token inválido:* Se a assinatura do token for inválida ou estiver expirada, a API bloqueia a requisição de imediato, retornando o código HTTP 401 Unauthorized de segurança.

**Pós-condições:** A requisição é autenticada e as informações do usuário são validadas de forma segura na API.

**Critérios de aceite:**
- [ ] O processo de validação de assinatura e integridade do token JWT na API deve demorar menos de 10ms por chamada.
- [ ] Os tokens revogados de sessões encerradas devem ser invalidados de imediato no banco/cache.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Limitar tentativas de login para evitar ataques de força bruta (RNF)

**ID:** UC-422  
**Requisito relacionado:** RNF-Critical-9 (limitar tentativas de login)  
**Ator(es):** Sistema (Serviço de Segurança)  
**Pré-condições:** Contador de tentativas de login falhas configurado na base ou cache do servidor.  
**Gatilho:** Um usuário ou bot tenta realizar login com credenciais incorretas consecutivamente.  

**Fluxo principal:**
1. O cliente tenta fazer login fornecendo credenciais incorretas.
2. O sistema valida a falha, armazena no cache a tentativa falha associando-a ao IP/conta e incrementa o contador.
3. O cliente realiza mais 4 tentativas seguidas incorretas em um curto intervalo de tempo (totalizando 5 falhas).
4. Ao tentar a 6ª vez, o sistema detecta que o limite máximo de tolerância a falhas foi atingido.
5. O sistema bloqueia temporariamente novas tentativas de login para aquela conta e para aquele IP de origem por um período de resfriamento.
6. Novas tentativas de login realizadas no período de bloqueio são rejeitadas de imediato, retornando erro HTTP 429 Too Many Requests.

**Fluxos alternativos:**
- *Desbloqueio de senha:* O usuário realiza a recuperação de senha por e-mail de forma segura, efetuando a troca, e o sistema limpa os registros de falha do IP correspondente no cache instantaneamente.

**Fluxos de exceção:**
- *Ataques globais:* Se o sistema detectar picos atípicos de erros de login generalizados em toda a plataforma, ativa de forma automática o CAPTCHA obrigatório na tela inicial para todos os usuários.

**Pós-condições:** O IP e a conta temporariamente bloqueados são impedidos de realizar novas tentativas até o fim do período de timeout.

**Critérios de aceite:**
- [ ] O limite de bloqueio deve ser de no máximo 5 tentativas falhas consecutivas em um intervalo de 5 minutos.
- [ ] O tempo de expiração do bloqueio temporário da conta/IP deve ser de exatamente 15 minutos.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Permitir recuperação de dados em caso de falha catastrófica (disaster recovery) (RNF)

**ID:** UC-423  
**Requisito relacionado:** RNF-Critical-10 (recuperação de dados em falha catastrófica)  
**Ator(es):** Sistema, Infraestrutura SRE/DevOps  
**Pré-condições:** Backups redundantes criptografados salvos em nuvem geograficamente isolada.  
**Gatilho:** Ocorre um desastre físico ou falha catastrófica total no data center de produção.  

**Fluxo principal:**
1. O data center principal sofre perda total física de dados por desastre ou quebra crítica de hardware.
2. O sistema de monitoramento alerta a equipe SRE sobre a indisponibilidade total dos serviços de produção.
3. A equipe SRE aciona o plano de Disaster Recovery (DR).
4. O sistema provisiona de forma automática uma nova infraestrutura de servidores em uma região geográfica secundária por meio de scripts de infraestrutura como código (IaC).
5. O sistema localiza o backup diário mais recente no storage isolado e reconstrói as bases de dados e arquivos.
6. O roteamento DNS é alterado de forma segura para a nova região geográfica e o sistema volta a operar online.

**Fluxos alternativos:**
- *Simulações de DR:* A equipe executa testes controlados periodicamente fora do horário comercial para validar a infraestrutura secundária de desastres.

**Fluxos de exceção:**
- *Backup do dia corrompido:* Se o snapshot diário mais recente apresentar erro de integridade, o sistema retrocede e reconstrói a base a partir do backup do dia anterior, reportando o desvio de integridade.

**Pós-condições:** A plataforma e todos os dados consistentes dos usuários são restaurados na região secundária.

**Critérios de aceite:**
- [ ] RPO (Recovery Point Objective - limite de perda de dados) deve ser de no máximo 24 horas (intervalo do último backup diário).
- [ ] RTO (Recovery Time Objective - tempo de restabelecimento) deve ser inferior a 4 horas.

**Prioridade:** Crítica  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Responder a ações críticas (salvar, editar) em menos de 1 segundo (RNF)

**ID:** UC-424  
**Requisito relacionado:** RNF-Critical-11 (responder a ações críticas em menos de 1 segundo)  
**Ator(es):** Sistema (Backend/Banco de Dados)  
**Pré-condições:** Banco de dados indexado e API de escrita otimizada.  
**Gatilho:** O usuário clica em "Salvar" ou realiza uma alteração de dados crítica.  

**Fluxo principal:**
1. O usuário clica em "Salvar" ao editar informações na interface.
2. O backend recebe a chamada da API contendo a payload com os dados atualizados.
3. O backend processa a escrita gravando na tabela correspondente.
4. O banco de dados confirma o salvamento físico e o sistema envia a resposta de confirmação de sucesso de volta ao cliente.
5. O tempo total transcorrido entre o clique do usuário e a resposta visual de sucesso na tela é inferior a 1 segundo.

**Fluxos alternativos:**
- *Escrita assíncrona otimista:* O cliente exibe o indicador visual de salvamento imediato na interface, enquanto envia a transação de rede em background de forma silenciosa e paralela.

**Fluxos de exceção:**
- *Carga elevada:* Sob picos de tráfego extremos em que a gravação direta demore mais de 1 segundo, o sistema redireciona a chamada para uma fila de processamento assíncrono, respondendo "Salvando em background" de imediato para não travar a tela.

**Pós-condições:** A alteração crítica é gravada na base de dados.

**Critérios de aceite:**
- [ ] 95% das requisições de salvamento e edições de dados de fichas devem responder em até 800ms.
- [ ] O tempo total de resposta de ponta a ponta na API deve ser monitorado por ferramentas de APM.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Suportar pelo menos X usuários simultâneos sem degradação perceptível de performance (RNF)

**ID:** UC-425  
**Requisito relacionado:** RNF-High-1 (suportar usuários simultâneos)  
**Ator(es):** Sistema (Infraestrutura de Clusters)  
**Pré-condições:** Cota mínima de capacidade de processamento e memória dimensionada para escalabilidade.  
**Gatilho:** O tráfego de usuários simultâneos atinge a marca limite de X conexões ativas simultâneas (ex: 5.000 usuários ativos).  

**Fluxo principal:**
1. A plataforma recebe um aumento gradual de acessos de usuários simultâneos.
2. O número de conexões ativas simultâneas na plataforma alcança a marca configurada (ex: 5.000 usuários ativos).
3. O balanceador de carga divide as requisições de forma proporcional entre as instâncias e servidores ativos do cluster.
4. O sistema monitora o tempo médio de resposta de API e a taxa de erros, que permanecem estáveis.
5. Os usuários navegam de forma fluida sem lentidões na tela ou timeouts.

**Fluxos alternativos:**
- *Auto-scaling:* O número de acessos ultrapassa o limite X previsto. O monitor de infraestrutura ativa novas instâncias automaticamente em menos de 2 minutos para absorver a carga.

**Fluxos de exceção:**
- *Sobrecarga de banco:* Sob carga extrema, o sistema gerencia as conexões por meio de pool de conexões para evitar quedas por esgotamento de conexões abertas no banco de dados.

**Pós-condições:** O sistema se mantém íntegro e responsivo sob a carga de tráfego simultâneo.

**Critérios de aceite:**
- [ ] A aplicação deve suportar testes de carga simulando 5.000 usuários simultâneos sem que a taxa de erro de chamadas ultrapasse 1%.
- [ ] O tempo de carregamento de páginas da API sob carga máxima não deve se elevar mais de 20% em relação ao tempo com a plataforma vazia.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Carregar a interface principal em menos de 3 segundos (RNF)

**ID:** UC-426  
**Requisito relacionado:** RNF-High-2 (carregar a interface principal em menos de 3 segundos)  
**Ator(es):** Sistema (Frontend / CDN)  
**Pré-condições:** Arquivos estáticos da aplicação (HTML, JS, CSS) minimizados, compactados e distribuídos em CDN.  
**Gatilho:** O usuário acessa a URL da plataforma pelo navegador.  

**Fluxo principal:**
1. O usuário acessa a plataforma digitando a URL em seu navegador.
2. O navegador busca e baixa os arquivos estáticos de código no servidor de CDN mais próximo geograficamente.
3. O navegador renderiza o esqueleto básico da tela (skeleton loader) em menos de 1 segundo.
4. A aplicação inicializa os scripts essenciais e realiza as chamadas de API paralelas de dados mínimos do painel.
5. A interface completa é renderizada e torna-se totalmente interativa em menos de 3 segundos.

**Fluxos alternativos:**
- *Carregamento tardio (Lazy loading):* Se a página possuir mídias ou imagens pesadas, o sistema renderiza o layout e os textos primeiro e carrega as mídias em background à medida que o usuário rola a página.

**Fluxos de exceção:**
- *Conexão instável móvel:* Se o usuário estiver acessando via rede celular lenta, o sistema desabilita fontes externas pesadas e animações complexas para garantir o carregamento em até 3 segundos.

**Pós-condições:** A aplicação é carregada e torna-se interativa para uso.

**Critérios de aceite:**
- [ ] O tamanho do pacote (bundle) inicial de JS baixado na primeira carga não deve ultrapassar 500KB compactado.
- [ ] A nota de performance do LightHouse da aplicação em mobile e desktop deve ser superior a 90 pontos.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Escalar horizontalmente conforme aumento de usuários/dados (RNF)

**ID:** UC-427  
**Requisito relacionado:** RNF-High-3 (escalabilidade horizontal do sistema)  
**Ator(es):** Sistema (Orquestrador de Containers / Kubernetes)  
**Pré-condições:** Aplicação conteinerizada (Docker) configurada com políticas de escalabilidade HPA.  
**Gatilho:** O consumo de CPU ou memória dos servidores atinge ou supera 70% de utilização.  

**Fluxo principal:**
1. O volume de acessos sobe e os servidores ativos de produção começam a registrar consumo superior a 70% de CPU.
2. O orquestrador Kubernetes detecta o consumo elevado por meio de monitoramento de métricas.
3. O orquestrador dispara de forma automática o escalonamento horizontal, inicializando novas réplicas (containers) da aplicação em paralelo.
4. O balanceador de carga é atualizado e distribui as novas requisições também para as novas instâncias ativadas.
5. O uso médio de CPU do cluster recua para patamares seguros, normalizando a performance.

**Fluxos alternativos:**
- *Escalar banco de dados:* O sistema direciona de forma automática todas as operações de leitura para servidores réplicas de banco de dados (Read Replicas), aliviando o servidor principal.

**Fluxos de exceção:**
- *Limite de hardware da nuvem:* Se o cluster precisar de mais servidores físicos do provedor de nuvem, o orquestrador aciona a API da nuvem (Cluster Autoscaler) para contratar e alocar uma nova máquina física de hardware em background.

**Pós-condições:** Novas réplicas da aplicação são criadas e ativadas para absorver o crescimento de carga sem lentidões.

**Critérios de aceite:**
- [ ] A inicialização completa de uma nova réplica em container do sistema de chat/API deve durar menos de 60 segundos após o disparo do gatilho.
- [ ] A infraestrutura deve suportar escalabilidade até o limite configurado de réplicas antes de emitir alertas de cota física.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Manter consistência dos dados em edição colaborativa em tempo real (RNF)

**ID:** UC-428  
**Requisito relacionado:** RNF-High-4 (consistência de dados em edição colaborativa)  
**Ator(es):** Sistema (Servidor de Sincronização / WebSockets)  
**Pré-condições:** Algoritmo de resolução de conflitos (ex: CRDT) ativo no editor de texto.  
**Gatilho:** Dois ou mais colaboradores realizam edições simultâneas e concorrentes no mesmo parágrafo de um documento.  

**Fluxo principal:**
1. O Usuário A e o Usuário B estão editando simultaneamente o mesmo texto.
2. O Usuário A insere um caractere e o Usuário B edita outra palavra na mesma linha com diferença de milissegundos.
3. O sistema de sincronização no backend recebe os eventos de alteração de ambos os clientes via WebSockets de forma paralela.
4. O sistema aplica o algoritmo de transformação de dados (CRDT/OT) reconciliando as posições de cursores e das edições sem que haja sobrescritas brutas.
5. O sistema replica as atualizações consolidadas de volta aos navegadores de ambos em tempo real.
6. A interface exibe o texto atualizado de forma consistente e idêntica em ambos os navegadores.

**Fluxos alternativos:**
- *Edição offline de volta online:* Se as edições concorrentes ocorrerem em estados offline prolongados, o sistema exibe o painel de divergência de versões (diff) para resolução manual das partes.

**Fluxos de exceção:**
- *Conexão interrompida:* Se a conexão do WebSocket cair, a aplicação desativa a sincronização em tempo real na tela do usuário desconectado, alterando para o modo de salvamento local individual.

**Pós-condições:** O documento é editado de forma concorrente e a consistência do texto é garantida em tempo real.

**Critérios de aceite:**
- [ ] A latência de sincronização e reflexo de digitação entre os colaboradores conectados na mesma página deve ser inferior a 300ms.
- [ ] A aplicação do algoritmo de concorrência não deve corromper a estrutura e a ordem dos caracteres do documento.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Ser responsivo (funcionar bem em desktop, tablet e mobile) (RNF)

**ID:** UC-429  
**Requisito relacionado:** RNF-High-5 (interface responsiva em múltiplos dispositivos)  
**Ator(es):** Sistema (Interface Frontend / CSS Responsivo)  
**Pré-condições:** Layouts do frontend construídos sob padrões de CSS flexíveis e media queries de largura de tela configurados.  
**Gatilho:** O usuário acessa a plataforma em um dispositivo móvel ou redimensiona a janela do navegador.  

**Fluxo principal:**
1. O usuário abre o painel da plataforma em um smartphone (largura de tela menor que 480px).
2. O navegador lê os estilos CSS da folha de estilo responsiva da página.
3. O menu lateral de navegação se recolhe em formato de menu hambúrguer no topo da tela.
4. As colunas de dados do dashboard se empilham verticalmente e as tabelas ativam a rolagem interna para evitar quebras visuais de elementos.
5. O tamanho das fontes e botões se expandem para facilitar toques de dedos no dispositivo móvel.

**Fluxos alternativos:**
- *Visualização em tablet:* O usuário acessa a plataforma de um tablet. O sistema reduz o menu lateral apenas para ícones compactos, maximizando a área de exibição central.

**Fluxos de exceção:**
- *Gráficos de fluxo de caixa em telas pequenas:* Componentes visuais largos que transbordem o limite de tela do celular são envolvtos em blocos de rolagem horizontal nativo independente para manter a integridade visual da página.

**Pós-condições:** A interface gráfica da plataforma é adaptada e legível no tamanho de tela ativo do dispositivo.

**Critérios de aceite:**
- [ ] Nenhum elemento interativo importante ou texto deve transbordar as margens da tela lateralmente (sem scroll de página inteira horizontal).
- [ ] A área mínima de clique de botões e links na versão mobile deve ser de no mínimo 44x44 pixels para acessibilidade.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Ser compatível com os principais navegadores (Chrome, Firefox, Safari, Edge) (RNF)

**ID:** UC-430  
**Requisito relacionado:** RNF-High-6 (compatibilidade com navegadores principais)  
**Ator(es):** Sistema (Frontend / Código Transpilado)  
**Pré-condições:** Código do frontend compilado utilizando transpiladores (Babel) e prefixadores de CSS automáticos.  
**Gatilho:** O usuário acessa a plataforma a partir de diferentes navegadores.  

**Fluxo principal:**
1. O usuário abre o sistema utilizando o navegador Apple Safari ou Mozilla Firefox.
2. O navegador baixa o pacote de código JS e CSS transpilado e compatível da plataforma.
3. O motor de renderização executa os scripts de Web APIs padrão.
4. A página é carregada sem falhas de sintaxe de JavaScript ou quebras de estilos e posicionamentos CSS.
5. Todas as funcionalidades (editor, chat via WebSocket, arrastar e soltar do Kanban) operam com comportamento e layout idênticos aos exibidos no Google Chrome.

**Fluxos alternativos:**
- *Polyfills de suporte:* Se o usuário acessar de um navegador com suporte reduzido a alguma API nativa de áudio ou vídeo, o sistema carrega polyfills específicos em background para manter a funcionalidade ativa.

**Fluxos de exceção:**
- *Navegador obsoleto:* Se o usuário tentar acessar a plataforma utilizando um navegador totalmente desatualizado ou sem suporte de segurança (ex: Internet Explorer), o sistema exibe uma página estática orientando a atualização.

**Pós-condições:** A aplicação é executada de forma correta e consistente no navegador utilizado pelo usuário.

**Critérios de aceite:**
- [ ] O código Javascript gerado não deve conter sintaxes modernas incompatíveis com navegadores sem transpilamento prévio (Babel ES6 target).
- [ ] A aplicação deve ser testada e homologada nas últimas 3 versões estáveis dos navegadores Google Chrome, Mozilla Firefox, Apple Safari e Microsoft Edge.

---

## Tabela Resumo: Lote 43 (UC-421 a UC-430)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-421** | RNF-Critical-8 (autenticar chamadas via token JWT) | Crítica | Média |
| **UC-422** | RNF-Critical-9 (limitar erros de login força bruta) | Crítica | Média |
| **UC-423** | RNF-Critical-10 (restauro em falha catastrófica DR) | Crítica | Alta |
| **UC-424** | RNF-Critical-11 (gravação de dados em menos de 1s) | Crítica | Média |
| **UC-425** | RNF-High-1 (suporte a usuários simultâneos) | Alta | Alta |
| **UC-426** | RNF-High-2 (carregar tela em menos de 3s) | Alta | Média |
| **UC-427** | RNF-High-3 (escalabilidade horizontal HPA) | Alta | Alta |
| **UC-428** | RNF-High-4 (consistência na edição colaborativa) | Alta | Alta |
| **UC-429** | RNF-High-5 (interface responsiva mobile/tablet) | Alta | Média |
| **UC-430** | RNF-High-6 (compatibilidade com navegadores) | Alta | Média |
