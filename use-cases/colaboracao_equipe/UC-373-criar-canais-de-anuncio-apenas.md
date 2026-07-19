### Caso de Uso: Criar canais de anúncio (apenas administradores postam)

**ID:** UC-373  
**Requisito relacionado:** RF-372 (criar canais de anúncio)  
**Ator(es):** Administrador, Colaboradores, Sistema  
**Pré-condições:** Painel de canais ativo e usuário com permissões de administrador.  
**Gatilho:** O administrador cria um canal e ativa a chave de canal de anúncios.  

**Fluxo principal:**
1. O administrador clica em "Criar Canal" nas configurações de comunicação do projeto.
2. O administrador preenche as informações e ativa a chave "Canal de Anúncios (Apenas Admins Postam)".
3. O administrador clica em "Salvar".
4. O sistema cria o canal gravando as restrições na tabela do banco de dados.
5. Na interface de escrita dos colaboradores comuns do canal, a caixa de digitação inferior é substituída pela mensagem: "Apenas administradores podem enviar mensagens neste canal".
6. O administrador posta um aviso no canal correspondente.

**Fluxos alternativos:**
- *Interações por reações:* O administrador permite que os colaboradores comuns interajam exclusivamente por meio de reações de emojis nas mensagens, mantendo a restrição de escrita de texto.

**Fluxos de exceção:**
- *Envio direto via API:* Se a API receber uma tentativa de requisição de envio de mensagens no canal de anúncios por um token sem papel de administrador, o backend bloqueia emitindo erro 403 Forbidden.

**Pós-condições:** O canal de anúncios restrito é ativado e disponibilizado no sistema.

**Critérios de aceite:**
- [ ] O canal de anúncios deve exibir um distintivo visual de megafone ao lado do nome na lista de canais.
- [ ] O bloqueio de escrita na interface de colaboradores comuns deve ser instantâneo.

**Prioridade:** Média  
**Complexidade estimada:** Média
