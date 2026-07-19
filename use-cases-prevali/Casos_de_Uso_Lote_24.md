# Casos de Uso - Lote 24 (UC-231 a UC-240)

Este documento contém a especificação dos casos de uso de 231 a 240 derivados dos Requisitos Funcionais (RFs) do projeto.

---
### Caso de Uso: Autenticação em dois fatores (2FA)

**ID:** UC-231  
**Requisito relacionado:** RF-231 (autenticação em dois fatores (2FA))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado e deseja aumentar a segurança da sua conta.  
**Gatilho:** O usuário acessa "Configurações" -> "Segurança" -> "Ativar Autenticação em Duas Etapas".  

**Fluxo principal:**
1. O usuário clica em "Configurar 2FA (App Autenticador)".
2. O sistema gera uma chave secreta exclusiva (seed TOTP) e exibe na tela no formato de código de texto e um QR Code correspondente.
3. O usuário abre o aplicativo autenticador no smartphone (ex: Google Authenticator) e escaneia o QR Code.
4. O aplicativo do usuário passa a gerar tokens temporários de 6 dígitos baseados em tempo.
5. O usuário insere o token de 6 dígitos ativo no campo de validação da plataforma e clica em "Ativar 2FA".
6. O sistema valida o token contra a chave secreta e ativa o status 2FA como ativo no banco de dados.
7. O sistema gera e exibe uma lista de 10 códigos de backup de uso único para recuperação, orientando o usuário a salvá-los.

**Fluxos alternativos:**
- *Verificação no Login:* Ao fazer login futuramente, após validar e-mail e senha, o sistema redireciona para a tela de segundo fator, onde o usuário deve preencher o token de 6 dígitos gerado no app para concluir o acesso.

**Fluxos de exceção:**
- *Token inválido:* Se o usuário preencher um token incorreto ou expirado, o sistema impede a ativação e exibe: "Código inválido. Tente novamente".

**Pós-condições:** A autenticação em duas etapas é ativada para a conta e exigida em logins subsequentes.

**Critérios de aceite:**
- [ ] A chave secreta 2FA deve ser armazenada com criptografia reversível forte no banco de dados para possibilitar verificação.
- [ ] Os códigos de backup de uso único devem ser hashed no banco de forma inalterável.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Login com chave de segurança física (WebAuthn/FIDO2)

**ID:** UC-232  
**Requisito relacionado:** RF-232 (login com chave de segurança física (WebAuthn/FIDO2))  
**Ator(es):** Usuário (Escritor), Sistema, Hardware de Segurança (YubiKey/Windows Hello)  
**Pré-condições:** O dispositivo do usuário suporta WebAuthn e o usuário está autenticado para cadastro da chave.  
**Gatilho:** O usuário clica em "Registrar Chave de Segurança Física" nas opções de segurança de sua conta.  

**Fluxo principal:**
1. O usuário acessa a seção "Segurança" -> "Chaves Físicas / Biometria".
2. O usuário clica em "Registrar Novo Dispositivo WebAuthn".
3. O backend gera opções de desafio de autenticação (challenge options) e envia para o frontend.
4. O frontend executa a chamada do navegador `navigator.credentials.create()`.
5. O sistema operacional abre a caixa de consentimento (solicitando tocar na chave USB ou usar biometria).
6. O usuário executa a validação física.
7. A chave gera uma assinatura e devolve as credenciais públicas para o navegador, que as envia para o backend.
8. O backend valida a assinatura e salva a chave pública e o ID da credencial associados ao usuário.

**Fluxos alternativos:**
- *Login com a chave:* Na tela de login, o usuário seleciona "Entrar usando Chave Física". O sistema envia um desafio de login, o navegador solicita a interação com o hardware de segurança (`navigator.credentials.get()`) e valida a assinatura no servidor, liberando o login.

**Fluxos de exceção:**
- *Cancelamento da operação:* Se o usuário fechar o popup nativo do sistema operacional sem validar a chave, a plataforma aborta o registro e exibe: "O registro da chave física foi cancelado".

**Pós-condições:** A chave de segurança física é cadastrada e habilitada para logins na conta do usuário.

**Critérios de aceite:**
- [ ] A credencial registrada deve respeitar as diretrizes de especificação oficial do consórcio W3C WebAuthn.
- [ ] A validação criptográfica da chave pública no backend deve ocorrer de forma transacional.

**Prioridade:** Média  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Visualizar histórico de sessões ativas (dispositivos)

**ID:** UC-233  
**Requisito relacionado:** RF-233 (visualizar histórico de sessões ativas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado e possui uma ou mais sessões ativas registradas na tabela correspondente.  
**Gatilho:** O usuário acessa "Sessões Ativas" no menu de configurações da conta.  

**Fluxo principal:**
1. O usuário abre o painel "Minhas Sessões".
2. O sistema realiza uma busca na tabela de sessões ativas vinculadas ao ID do usuário.
3. A interface renderiza a lista de dispositivos logados contendo:
   - Nome do Dispositivo/SO (ex: "Chrome no Windows 11").
   - Endereço IP aproximado.
   - Localização estimada por IP.
   - Data do último acesso.
   - Marcador "Sessão Atual" na linha correspondente à aba ativa.
4. O usuário visualiza onde sua conta está sendo acessada.

**Fluxos alternativos:**
- *Histórico de logins:* O usuário clica na aba "Histórico de Acessos Recentes" para auditar logins encerrados nos últimos 30 dias.

**Fluxos de exceção:**
- *Localização falhar:* Se a base de dados de geolocalização por IP falhar, o sistema exibe "Localização desconhecida".

**Pós-condições:** O relatório detalhado de dispositivos logados é apresentado ao usuário na tela.

**Critérios de aceite:**
- [ ] A listagem deve identificar corretamente o User-Agent do navegador de origem da requisição.
- [ ] A listagem de sessões deve carregar em menos de 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Revogar sessão ativa (deslogar remotamente)

**ID:** UC-234  
**Requisito relacionado:** RF-234 (revogar sessão ativa)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui mais de uma sessão ativa listada no Histórico de Sessões.  
**Gatilho:** O usuário clica em "Encerrar Sessão" ao lado de um dispositivo listado.  

**Fluxo principal:**
1. O usuário acessa a listagem de sessões ativas.
2. O usuário localiza o dispositivo indesejado e clica no botão "Revogar Acesso / Deslogar".
3. O sistema remove o registro correspondente (Token JWT ou session ID) da tabela de sessões ativas no banco de dados e limpa os tokens do cache do servidor.
4. Na próxima requisição enviada pelo dispositivo revogado, o servidor bloqueia o acesso e redireciona para o login.
5. A listagem é atualizada na tela do usuário, removendo o dispositivo da lista.

**Fluxos alternativos:**
- *Deslogar de todos:* O usuário clica no botão "Deslogar de todos os outros dispositivos", invalidando todas as sessões ativas vinculadas à conta de uma só vez, exceto a aba em que ele está navegando ativamente.

**Fluxos de exceção:**
- *Revogar a própria sessão:* Se o usuário revogar a sessão ativa atual, o sistema executa o logout imediato da tela e redireciona para a página de login.

**Pós-condições:** O token da sessão revogada é invalidado e o acesso remoto é bloqueado.

**Critérios de aceite:**
- [ ] A invalidação do token revogado na camada de autenticação (Middleware) do backend deve ser instantânea.
- [ ] O processamento de exclusão da sessão deve durar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Alterar senha logado (confirmar senha atual)

**ID:** UC-235  
**Requisito relacionado:** RF-235 (alterar senha logado)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado na plataforma.  
**Gatilho:** O usuário acessa "Alterar Senha" nas configurações de segurança.  

**Fluxo principal:**
1. O usuário abre o formulário de alteração de senha.
2. O sistema exibe os campos: Senha Atual, Nova Senha e Confirmar Nova Senha.
3. O usuário preenche as informações e clica em "Atualizar Senha".
4. O backend realiza a validação, comparando o hash da Senha Atual fornecida com o hash registrado no banco de dados.
5. Se válidos, o sistema gera o hash da nova senha (bcrypt), grava no banco de dados e exibe mensagem de sucesso.

**Fluxos alternativos:**
- *Sem senha cadastrada (Login social):* Se o usuário se cadastrou apenas via Google e não possui senha, o sistema solicita definir uma senha primária enviando um código de ativação para o e-mail.

**Fluxos de exceção:**
- *Senha atual incorreta:* Se a senha atual fornecida não coincidir com o hash guardado, o sistema impede a gravação e informa: "Senha atual incorreta".

**Pós-condições:** A senha é redefinida e atualizada de forma criptografada na base de dados.

**Critérios de aceite:**
- [ ] O sistema deve exigir que a nova senha seja diferente da senha atual e atenda às regras mínimas de complexidade.
- [ ] O processamento e retorno da verificação de senha devem demorar menos de 1 segundo.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa  

---
### Caso de Uso: Excluir conta de usuário (LGPD/GDPR)

**ID:** UC-236  
**Requisito relacionado:** RF-236 (excluir conta de usuário)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado no sistema.  
**Gatilho:** O usuário clica em "Excluir Minha Conta Permanentemente" nas configurações de perfil.  

**Fluxo principal:**
1. O usuário acessa as configurações avançadas de sua conta.
2. O usuário clica na opção "Excluir Conta".
3. O sistema exibe um aviso informando que a ação excluirá permanentemente todos os projetos pessoais, textos e metadados.
4. O usuário deve digitar a palavra "EXCLUIR" e sua senha de acesso para confirmação.
5. O usuário confirma.
6. O sistema executa a deleção física em cascata de todos os dados do usuário nas tabelas e remove o registro do perfil do banco.
7. O sistema limpa as credenciais de login locais (cookies/storage) e redireciona o usuário para a tela inicial.

**Fluxos alternativos:**
- *Anonimização em projetos de terceiros:* Se o usuário participava de projetos colaborativos de terceiros, suas mensagens e modificações permanecem visíveis, mas seu nome é substituído por um identificador genérico (ex: "Usuário Excluído") para fins de manter a consistência do enredo.

**Fluxos de exceção:**
- *Proprietário de projetos ativos com colaboradores:* Se o usuário for dono de projetos compartilhados com outros membros, o sistema impede a exclusão direta e orienta a transferir a propriedade ou excluir esses projetos antes de deletar a conta.

**Pós-condições:** Todas as informações cadastrais e dados pessoais do usuário são deletados fisicamente dos servidores da plataforma.

**Critérios de aceite:**
- [ ] O processo de exclusão de dados em cascata deve garantir que nenhuma imagem de mídia do usuário permaneça órfã no bucket de armazenamento em nuvem.
- [ ] A exclusão física deve ser definitiva e irreversível.

**Prioridade:** Crítica  
**Complexidade estimada:** Alta  

---
### Caso de Uso: Integração com login social (Google, Apple, Facebook)

**ID:** UC-237  
**Requisito relacionado:** RF-237 (integração com login social)  
**Ator(es):** Usuário (Escritor/Visitante), Sistema, Servidor OAuth2  
**Pré-condições:** O usuário acessa a página de autenticação e possui conta ativa no provedor social selecionado.  
**Gatilho:** O usuário clica em "Entrar com o Google" na tela de login.  

**Fluxo principal:**
1. O usuário clica no botão "Entrar com o Google".
2. O sistema inicializa a requisição OAuth2 e redireciona o navegador para o endpoint de autorização do Google.
3. O usuário insere as credenciais e autoriza o compartilhamento de perfil básico (Nome, E-mail e Foto).
4. O Google redireciona o navegador de volta para a aplicação com o token de validação.
5. O backend valida a assinatura do token do Google (JWT) e verifica se o e-mail já existe na base de dados.
6. Se o e-mail já existir, o sistema vincula a credencial à conta existente e inicia a sessão (login).
7. Se o e-mail não existir, o sistema cria um novo registro de usuário preenchendo os dados vindos do Google e ativa a conta.
8. O usuário é redirecionado ao Dashboard de projetos.

**Fluxos alternativos:**
- *Login com a Apple:* O usuário realiza o mesmo fluxo selecionando "Entrar com a Apple", validando a identidade no ecossistema correspondente.

**Fluxos de exceção:**
- *E-mail não verificado:* Se o provedor indicar que o e-mail não foi verificado na plataforma de origem, o sistema exige uma validação manual por e-mail antes de liberar o vínculo.

**Pós-condições:** O usuário é autenticado na plataforma por meio de suas credenciais do provedor externo.

**Critérios de aceite:**
- [ ] O fluxo de login social deve ser integrado de forma segura sem expor credenciais ou chaves de API do backend.
- [ ] O tempo total de redirecionamento e login após retorno do provedor deve ser inferior a 1,5 segundos.

**Prioridade:** Crítica  
**Complexidade estimada:** Média  

---
### Caso de Uso: Baixar todos os dados do usuário (portabilidade)

**ID:** UC-238  
**Requisito relacionado:** RF-238 (baixar todos os dados do usuário)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado e possui projetos cadastrados em sua conta.  
**Gatilho:** O usuário clica em "Baixar Meus Dados (Portabilidade)" nas opções de privacidade da conta.  

**Fluxo principal:**
1. O usuário acessa a página de privacidade do perfil.
2. O usuário clica no botão "Solicitar Cópia dos Meus Dados (Portabilidade de Dados)".
3. O sistema abre uma caixa de diálogo informando que preparará um pacote contendo todos os dados cadastrais, logs de segurança, e a totalidade dos projetos cadastrados.
4. O usuário clica em "Iniciar Preparação".
5. O backend dispara em background uma tarefa assíncrona que extrai todas as tabelas do usuário e formata em coleções de arquivos estruturados JSON, agrupados com as pastas e mídias físicas em um arquivo compactado `.zip`.
6. O sistema salva o arquivo compactado no servidor e envia um e-mail para o usuário contendo o link de download seguro.
7. O usuário abre o e-mail, clica no link e realiza o download do arquivo ZIP.

**Fluxos alternativos:**
- *Download direto:* Se o volume de dados da conta for pequeno (< 20MB), o sistema gera o ZIP em tempo real e inicia o download direto no navegador em poucos segundos.

**Fluxos de exceção:**
- *Link de download expirado:* Por segurança, o link enviado por e-mail expira após 48 horas. Se o usuário clicar após o prazo, o sistema o orienta a fazer uma nova solicitação.

**Pós-condições:** O arquivo estruturado contendo todos os dados da conta do usuário é exportado e baixado.

**Critérios de aceite:**
- [ ] Os dados devem ser exportados em formatos padrão abertos (como JSON e Markdown) para garantir portabilidade efetiva de acordo com a LGPD.
- [ ] O token de download seguro deve possuir expiração e ser de uso único.

**Prioridade:** Alta  
**Complexidade estimada:** Média  

---
### Caso de Uso: Suporte a múltiplos idiomas no sistema (i18n)

**ID:** UC-239  
**Requisito relacionado:** RF-239 (suporte a múltiplos idiomas no sistema (i18n))  
**Ator(es):** Sistema  
**Pré-condições:** Arquivos de dicionário de tradução do sistema (ex: `pt-BR.json`, `en-US.json`) contendo chaves e valores estruturados de tradução estão cadastrados na base de código da aplicação.  
**Gatilho:** Inicialização da aplicação no navegador ou carregamento da interface.  

**Fluxo principal:**
1. O usuário acessa o site da aplicação.
2. O sistema lê as configurações de idioma do navegador do visitante (`navigator.language`) para detectar o idioma preferido.
3. O sistema carrega o dicionário correspondente na memória da aplicação.
4. O sistema renderiza a interface traduzindo dinamicamente todas as chaves (ex: o rótulo da árvore lateral que exibia "Personagens" passa a ser renderizado como "Characters").

**Fluxos alternativos:**
- *Idioma de fallback:* Se o usuário utilizar um idioma que o sistema não possui suporte, o sistema carrega o idioma padrão configurado de fallback (ex: "en-US").

**Fluxos de exceção:**
- *Chave de tradução ausente:* Se uma chave de texto não constar no dicionário do idioma selecionado por omissão, o sistema renderiza a chave de fallback correspondente ou o próprio nome da chave.

**Pós-condições:** A interface da aplicação é apresentada no idioma detectado ou de fallback.

**Critérios de aceite:**
- [ ] Todas as telas, botões, modais e placeholders do sistema devem possuir chaves de tradução suportadas no sistema de i18n.
- [ ] A troca e renderização dinâmica do dicionário de idiomas no carregamento inicial deve durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Média  

---
### Caso de Uso: Alternar idioma do sistema

**ID:** UC-240  
**Requisito relacionado:** RF-240 (alternar idioma do sistema)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Suporte a múltiplos idiomas ativo na aplicação.  
**Gatilho:** O usuário altera o seletor de idiomas no rodapé ou cabeçalho.  

**Fluxo principal:**
1. O usuário clica no seletor de idiomas (Dropdown) no cabeçalho ou rodapé da tela.
2. O sistema exibe os idiomas homologados: "Português (BR)", "English (US)", "Español (ES)".
3. O usuário seleciona o idioma desejado (ex: "English (US)").
4. O sistema descarrega o dicionário anterior, baixa de forma assíncrona o arquivo JSON contendo o dicionário correspondente ao novo idioma selecionado e re-renderiza todos os componentes da interface.
5. O sistema grava o idioma selecionado nas configurações de perfil de conta do usuário e localmente no localStorage.

**Fluxos alternativos:**
- *URL query parameter:* O usuário força o idioma adicionando parâmetro na URL da página (ex: `?lang=es`), fazendo com que o sistema carregue o dicionário correspondente automaticamente.

**Fluxos de exceção:**
- *Erro de rede:* Se o download do arquivo de idioma falhar, o sistema mantém o idioma atual ativo e exibe um alerta sutil: "Não foi possível carregar o idioma. Tente novamente".

**Pós-condições:** O idioma da interface é redefinido para a escolha ativa do usuário.

**Critérios de aceite:**
- [ ] A alteração de idioma deve ser instantânea e ocorrer sem a necessidade de forçar um reload completo da página no navegador (Single Page App).
- [ ] A preferência selecionada deve persistir de forma definitiva na conta do usuário em logins futuros.

---

## Tabela Resumo: Lote 24 (UC-231 a UC-240)

| ID | Requisito Relacionado | Prioridade | Complexidade Estimada |
| :--- | :--- | :--- | :--- |
| **UC-231** | RF-231 (autenticação em dois fatores 2FA) | Alta | Média |
| **UC-232** | RF-232 (login com chave física WebAuthn) | Média | Alta |
| **UC-233** | RF-233 (visualizar histórico de sessões) | Alta | Média |
| **UC-234** | RF-234 (revogar sessão ativa) | Alta | Média |
| **UC-235** | RF-235 (alterar senha logado) | Crítica | Baixa |
| **UC-236** | RF-236 (excluir conta LGPD/GDPR) | Crítica | Alta |
| **UC-237** | RF-237 (login social Google/Apple...) | Crítica | Média |
| **UC-238** | RF-238 (baixar dados portabilidade) | Alta | Média |
| **UC-239** | RF-239 (suporte a múltiplos idiomas i18n) | Média | Média |
| **UC-240** | RF-240 (alternar idioma do sistema) | Média | Baixa |
