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
