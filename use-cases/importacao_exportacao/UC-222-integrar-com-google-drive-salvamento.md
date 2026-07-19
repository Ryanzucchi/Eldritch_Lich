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
