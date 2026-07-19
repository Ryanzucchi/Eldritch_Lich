# Casos de Uso - Lote 23 (UC-221 a UC-230)

Este documento contém a especificação dos casos de uso de 221 a 230 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Configurar notificações push (sistema)

**ID:** UC-221  
**Requisito relacionado:** RF-221 (configurar notificações push (sistema))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado e o navegador suporta a Web Push API.  
**Gatilho:** O usuário altera as permissões de notificação push no seu painel de configurações ou responde ao prompt do navegador.  

**Fluxo principal:**
1. O usuário acessa a seção "Configurações" -> "Notificações".
2. O usuário clica na chave "Ativar Notificações Push no Navegador".
3. O sistema solicita a permissão oficial de notificações do navegador (via Notification API).
4. O usuário clica em "Permitir" no popup nativo do navegador.
5. O sistema registra a inscrição do dispositivo no servidor e associa à conta do usuário.
6. A interface exibe a confirmação de ativação bem-sucedida.

**Fluxos alternativos:**
- *Desativar push:* O usuário desmarca a opção e o sistema remove a inscrição do dispositivo da base de dados, bloqueando novos disparos.

**Fluxos de exceção:**
- *Bloqueio prévio do navegador:* Se o usuário tiver bloqueado as notificações push globalmente no navegador anteriormente, o popup nativo não abre. O sistema detecta a negação e exibe instruções visuais explicando como reativar as permissões manualmente na barra de endereço.

**Pós-condições:** O dispositivo do usuário é inscrito e fica habilitado para receber notificações em background.

**Critérios de aceite:**
- [ ] O token de inscrição push do navegador deve ser armazenado com segurança associado ao ID do usuário no banco.
- [ ] O processo de registro da inscrição deve durar menos de 800ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Integrar com Google Drive (salvamento/exportação)

**ID:** UC-222  
**Requisito relacionado:** RF-222 (integrar com Google Drive)  
**Ator(es):** Usuário (Escritor), Sistema, Google API  
**Pré-condições:** O usuário possui uma conta ativa do Google.  
**Gatilho:** O usuário clica em "Conectar ao Google Drive" nas configurações de integração.  

**Fluxo principal:**
1. O usuário acessa a aba "Integrações" do projeto.
2. O usuário clica em "Conectar Google Drive".
3. O sistema redireciona a tela para a página de consentimento OAuth2 do Google.
4. O usuário faz o login no Google, autoriza o aplicativo a ler/gravar na pasta específica da aplicação e confirma.
5. O Google redireciona de volta para o sistema com o código de autorização, que é trocado por um token de acesso de longa duração gravado de forma segura.
6. O usuário ativa a sincronização de backup automático para o Google Drive.
7. A cada alteração significativa no projeto, o sistema grava de forma assíncrona uma cópia compactada do projeto no Google Drive.

**Fluxos alternativos:**
- *Exportação manual:* O usuário clica em "Exportar Cópia para o Google Drive". O sistema envia a versão de exportação do projeto (PDF/DOCX/ZIP) diretamente para a nuvem do Google sob demanda.

**Fluxos de exceção:**
- *Token expirado/revogado:* Se a integração falhar por invalidação do token no console do Google, o sistema exibe o aviso "Acesso ao Google Drive expirado. Por favor, reconecte" e desativa a sincronização temporariamente.

**Pós-condições:** A integração OAuth2 é estabelecida e os backups do projeto são gerados na pasta do Google Drive.

**Critérios de aceite:**
- [ ] A gravação de dados do projeto no Google Drive deve rodar em background para não afetar o desempenho do editor.
- [ ] As credenciais de API do usuário (Tokens) devem ser criptografadas em repouso no banco de dados.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Integrar com Dropbox

**ID:** UC-223  
**Requisito relacionado:** RF-223 (integrar com Dropbox)  
**Ator(es):** Usuário (Escritor), Sistema, Dropbox API  
**Pré-condições:** O usuário possui uma conta ativa no Dropbox.  
**Gatilho:** O usuário clica em "Conectar ao Dropbox" nas configurações de integração.  

**Fluxo principal:**
1. O usuário abre o menu de integrações do sistema.
2. O usuário seleciona "Dropbox" e clica em "Conectar".
3. O sistema redireciona o usuário para o portal de login e autorização OAuth2 do Dropbox.
4. O usuário concede permissão para a plataforma salvar arquivos e retorna ao sistema.
5. O sistema valida o token de acesso recebido do Dropbox e ativa o vínculo.
6. O sistema cria uma pasta exclusiva do projeto no Dropbox do usuário e inicia a gravação periódica de backups estruturados.

**Fluxos alternativos:**
- *Exportar manuscrito:* O usuário escolhe enviar um arquivo DOCX exportado diretamente para sua pasta do Dropbox sob demanda.

**Fluxos de exceção:**
- *Cota do Dropbox esgotada:* Se o Dropbox retornar erro de falta de espaço em disco, o sistema suspende o envio automático e alerta o usuário: "Backup para Dropbox interrompido por falta de espaço".

**Pós-condições:** A integração OAuth2 é estabelecida e os backups do projeto são enviados para a pasta do Dropbox.

**Critérios de aceite:**
- [ ] Os tokens OAuth do Dropbox devem ser guardados no banco de dados seguindo políticas de criptografia forte.
- [ ] A sincronização deve respeitar o limite de taxa de requisições da API do Dropbox.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Integrar com OneDrive

**ID:** UC-224  
**Requisito relacionado:** RF-224 (integrar com OneDrive)  
**Ator(es):** Usuário (Escritor), Sistema, Microsoft Graph API  
**Pré-condições:** O usuário possui uma conta ativa da Microsoft.  
**Gatilho:** O usuário clica em "Conectar ao OneDrive" na página de integrações de nuvem.  

**Fluxo principal:**
1. O usuário acessa a página de integrações e seleciona "Microsoft OneDrive".
2. O sistema aciona o fluxo OAuth2 direcionando para a tela de login da Microsoft.
3. O usuário insere as credenciais e autoriza a aplicação a gerenciar arquivos na pasta da conta.
4. O Microsoft Graph API redireciona o usuário de volta com o token de autorização.
5. O sistema vincula a integração e cria a pasta de sincronização remota no OneDrive do usuário.
6. O sistema carrega backups automáticos comprimidos para o OneDrive a cada salvamento relevante.

**Fluxos alternativos:**
- *Download de backup a partir do OneDrive:* O usuário pode escolher um backup salvo no OneDrive para carregar e restaurar o estado atual do projeto na aplicação.

**Fluxos de exceção:**
- *Falha na requisição Graph API:* Se a Microsoft Graph API estiver fora do ar ou lenta, o sistema tenta reenviar o arquivo de backup a cada 30 minutos em background.

**Pós-condições:** A integração OAuth2 é configurada e os backups automáticos passam a ser salvos no OneDrive.

**Critérios de aceite:**
- [ ] O fluxo de upload deve lidar com envio fragmentado (Chunked Upload) para arquivos de backup muito grandes (> 100MB).
- [ ] A integração deve ser protegida contra ataques de CSRF utilizando tokens de estado.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Exportar projeto em formato compactado (.zip)

**ID:** UC-225  
**Requisito relacionado:** RF-225 (exportar projeto em formato compactado (.zip))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto existe e possui dados válidos armazenados no banco de dados.  
**Gatilho:** O usuário clica em "Exportar Backup Completo (.zip)" na aba de segurança do projeto.  

**Fluxo principal:**
1. O usuário abre as configurações avançadas do projeto e acessa "Manutenção e Backups".
2. O usuário clica em "Gerar Arquivo de Backup Completo (.zip)".
3. O backend monta um pacote de exportação completo, contendo:
   - Uma pasta de arquivos de capítulos organizada fisicamente.
   - Arquivos JSON contendo as tabelas de entidades, linhas do tempo, relacionamentos e metadados.
   - Uma pasta de mídias com todas as imagens carregadas no projeto.
4. O sistema compacta todos os arquivos usando o algoritmo standard ZIP.
5. O navegador inicia o download do arquivo compactado.

**Fluxos alternativos:**
- *Criptografar ZIP:* O usuário insere uma senha de segurança no modal e o sistema gera o ZIP protegido por senha AES-256 de forma criptografada.

**Fluxos de exceção:**
- *Estouro de memória:* Se o projeto for excessivamente grande, o backend faz a compressão em fluxo (streaming zip writer) para evitar consumo de memória RAM excessivo da aplicação.

**Pós-condições:** O arquivo compactado contendo todos os dados e arquivos do projeto é baixado para a máquina local do usuário.

**Critérios de aceite:**
- [ ] O pacote ZIP gerado deve incluir um arquivo de manifesto com versão dos dados e hashes MD5 de integridade dos arquivos.
- [ ] O processo de empacotamento em ZIP de um projeto padrão deve demorar menos de 4 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Importar projeto de formato compactado (.zip)

**ID:** UC-226  
**Requisito relacionado:** RF-226 (importar projeto de formato compactado (.zip))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um arquivo ZIP válido contendo a estrutura de dados oficial do sistema.  
**Gatilho:** O usuário clica em "Importar de Backup (.zip)" no Dashboard geral.  

**Fluxo principal:**
1. O usuário clica em "Importar Novo Projeto a partir de Backup (.zip)".
2. O sistema solicita a seleção do arquivo compactado local.
3. O usuário escolhe o arquivo ZIP e clica em importar.
4. O backend faz o upload do arquivo, descompacta os arquivos temporariamente no servidor e valida o arquivo de manifesto.
5. O sistema popula o banco de dados com as tabelas lidas do JSON do pacote e salva os arquivos físicos de capítulos nas novas pastas criadas.
6. O novo projeto importado aparece no Dashboard do usuário.

**Fluxos alternativos:**
- *Substituir projeto ativo:* O usuário importa o ZIP de dentro de um projeto aberto para restaurá-lo e sobrescrever o estado atual em vez de criar um projeto novo.

**Fluxos de exceção:**
- *Versão de manifesto incompatível:* Se o arquivo for de uma versão muito antiga ou de ferramenta incompatível, o sistema cancela a importação e exibe: "Importação abortada: Versão de backup inválida ou não suportada".

**Pós-condições:** A base de dados do projeto e seus respectivos arquivos físicos são restaurados a partir da estrutura compactada importada.

**Critérios de aceite:**
- [ ] O parser deve checar e rejeitar arquivos contendo caminhos relativos maliciosos (Path Traversal Vulnerability) no descompactamento.
- [ ] O tempo total de importação deve ser menor que 10 segundos para projetos padrão.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Restaurar backup completo do projeto

**ID:** UC-227  
**Requisito relacionado:** RF-227 (restaurar backup completo do projeto)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O projeto possui backups (pontos de restauração) automáticos ou manuais armazenados na nuvem.  
**Gatilho:** O usuário clica em "Restaurar Backup" na lista de pontos de restauração.  

**Fluxo principal:**
1. O proprietário acessa a aba "Manutenção e Backups" nas configurações do projeto.
2. O sistema exibe a lista de pontos de restauração passados disponíveis para a conta.
3. O proprietário seleciona a linha do backup desejada e clica em "Restaurar".
4. O sistema exibe um modal de aviso de segurança informando que a ação é crítica e substituirá todo o estado do projeto ativo.
5. O proprietário confirma a ação digitando sua senha.
6. O sistema limpa as tabelas do projeto ativo no banco de dados e repopula todas as tabelas (pastas, capítulos, entidades, timeline, mapa) com as informações do backup.
7. O projeto recarrega a tela com as informações do backup.

**Fluxos alternativos:**
- *Restaurar em um novo projeto:* O usuário opta por restaurar o backup em um novo projeto paralelo, mantendo o projeto ativo atual intacto e criando uma cópia do estado antigo.

**Fluxos de exceção:**
- *Senha inválida:* O sistema bloqueia o processo e exibe a mensagem: "Senha inválida. Ação abortada".

**Pós-condições:** O projeto é reconfigurado para o estado exato correspondente ao ponto de restauração selecionado.

**Critérios de aceite:**
- [ ] A restauração deve ser atômica e executada dentro de uma única transação no banco de dados para evitar estados parciais inconsistentes.
- [ ] O tempo total de transição e restauração do banco de dados deve ser menor que 8 segundos para projetos padrão.

**Prioridade:** Alta  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Criar ponto de restauração manual (backup)

**ID:** UC-228  
**Requisito relacionado:** RF-228 (criar ponto de restauração manual (backup))  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O projeto possui dados cadastrados.  
**Gatilho:** O usuário clica em "Criar Ponto de Restauração" no menu do projeto.  

**Fluxo principal:**
1. O usuário acessa "Manutenção e Backups".
2. O usuário clica em "Criar Novo Ponto de Restauração".
3. O sistema solicita uma descrição para identificar o backup.
4. O usuário insere a descrição e clica em "Salvar Backup".
5. O backend captura a foto instantânea (snapshot) do estado de todas as tabelas do projeto e dos arquivos físicos e grava na base de dados de snapshots.
6. O novo ponto de restauração passa a constar na lista de backups com data, hora, autor e descrição.

**Fluxos alternativos:**
- *Backup automático:* O sistema cria de forma automatizada pontos de restauração temporários a cada 24 horas de edições de projetos.

**Fluxos de exceção:**
- *Limite de backups excedido:* Se a conta do usuário estourar o limite de backups permitidos na cota, o sistema desabilita o botão e orienta a excluir pontos de restauração antigos para liberar espaço.

**Pós-condições:** O snapshot do projeto é criado e listado no painel de segurança.

**Critérios de aceite:**
- [ ] O backup manual deve gravar os dados com precisão, garantindo integridade de todas as referências cruzadas e links do projeto.
- [ ] O tempo de processamento do snapshot em background deve ser menor que 3 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Enviar notificações por e-mail (comentários/menções)

**ID:** UC-229  
**Requisito relacionado:** RF-229 (enviar notificações por e-mail (comentários/menções))  
**Ator(es):** Sistema, Usuário (Destinatário)  
**Pré-condições:** O usuário destinatário possui e-mail cadastrado e ativou as notificações de menção em seu perfil.  
**Gatilho:** Outro colaborador responde ao comentário do usuário ou o menciona no projeto.  

**Fluxo principal:**
1. O Colaborador A escreve um comentário contendo uma menção a outro membro.
2. O sistema identifica a menção, localiza a conta do destinatário e checa se suas preferências de e-mail estão configuradas para envio imediato.
3. O sistema cria um e-mail com layout contendo: Nome do remetente, Foto do remetente, Trecho da mensagem, Nome do projeto, e Link de redirecionamento rápido.
4. O sistema enfileira o e-mail no servidor de e-mails transacionais da aplicação.
5. O e-mail é enviado e chega na caixa de entrada do usuário.

**Fluxos alternativos:**
- *Resumos periódicos:* Se o usuário configurou para resumos diários, o sistema apenas enfileira o log para a rotina do cron job enviar no horário agendado.

**Fluxos de exceção:**
- *Destinatário online:* Se o destinatário estiver online no projeto no exato momento e visualizar a notificação em tela, o sistema suspende o e-mail imediato para evitar spam.

**Pós-condições:** O e-mail notificando o usuário é gerado e despachado.

**Critérios de aceite:**
- [ ] O e-mail transacional deve ser enviado em até 2 minutos após o evento de menção/comentário.
- [ ] O e-mail deve conter o link de redirecionamento que abre o documento focado no comentário exato.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Ativar/desativar notificações por e-mail no perfil

**ID:** UC-230  
**Requisito relacionado:** RF-230 (ativar/desativar notificações por e-mail no perfil)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado no sistema.  
**Gatilho:** O usuário interage com a chave de desativação geral de notificações.  

**Fluxo principal:**
1. O usuário acessa a aba "Configurações" -> "Notificações".
2. O usuário localiza o interruptor "Receber e-mails transacionais (Comentários e Menções)".
3. O usuário clica para desativar a chave (status muda para false).
4. O usuário clica em "Salvar".
5. O sistema grava a preferência na tabela de perfil do usuário.
6. O sistema passa a bloquear qualquer enfileiramento ou disparo de e-mails com destino à conta do usuário.

**Fluxos alternativos:**
- *Desativar e-mails de marketing:* O usuário opta por desativar e-mails de newsletter/marketing nas preferências, mantendo apenas os e-mails transacionais críticos de equipe e segurança.

**Fluxos de exceção:**
- *Falha de sincronização:* O sistema valida a requisição e mantém as chaves locais desativas mesmo em caso de falha de rede temporária (sincronizando em lote posterior).

**Pós-condições:** A preferência de desativação de notificações por e-mail é salva na base de dados.

**Critérios de aceite:**
- [ ] A interface deve fornecer controle granular por tipo de evento.
- [ ] A gravação das preferências no banco deve ocorrer em até 200ms.

---

## Tabela Resumo: Lote 23 (UC-221 a UC-230)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-221** | RF-221 (configurar notificações push) | Média | Média |
| **UC-222** | RF-222 (integrar com Google Drive) | Média | Alta |
| **UC-223** | RF-223 (integrar com Dropbox) | Baixa | Alta |
| **UC-224** | RF-224 (integrar com OneDrive) | Baixa | Alta |
| **UC-225** | RF-225 (exportar projeto completo .zip) | Alta | Média |
| **UC-226** | RF-226 (importar projeto completo .zip) | Alta | Média |
| **UC-227** | RF-227 (restaurar backup completo) | Alta | Alta |
| **UC-228** | RF-228 (criar ponto de restauração manual) | Alta | Média |
| **UC-229** | RF-229 (enviar notificações por e-mail) | Alta | Média |
| **UC-230** | RF-230 (ativar/desativar notificações...) | Alta | Baixa |
