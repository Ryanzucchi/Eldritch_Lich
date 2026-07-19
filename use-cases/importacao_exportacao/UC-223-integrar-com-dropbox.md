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
