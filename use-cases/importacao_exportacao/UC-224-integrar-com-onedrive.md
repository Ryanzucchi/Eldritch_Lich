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
