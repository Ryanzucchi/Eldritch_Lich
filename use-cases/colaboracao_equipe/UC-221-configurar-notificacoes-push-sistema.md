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
