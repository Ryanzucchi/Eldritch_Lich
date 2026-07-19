### Caso de Uso: Habilitar chat de coautores no documento (comentário em tempo real)

**ID:** UC-299  
**Requisito relacionado:** RF-299 (habilitar chat de coautores no documento)  
**Ator(es):** Usuário A (Coautor), Usuário B (Coautor), Sistema  
**Pré-condições:** Ambos os coautores estão com o mesmo documento aberto simultaneamente.  
**Gatilho:** O Usuário A abre o painel de chat lateral do documento.  

**Fluxo principal:**
1. O Usuário A abre a aba de chat flutuante do capítulo de escrita ativa.
2. O Usuário A digita uma mensagem e clica em enviar.
3. O sistema envia a mensagem em tempo real via WebSocket.
4. A mensagem de Usuário A é renderizada na janela de chat do Usuário B de forma imediata.
5. O Usuário B responde.
6. Ambos debatem o enredo do texto em tempo real sem sair da tela do editor de texto.

**Fluxos alternativos:**
- *Discussões arquivadas:* As mensagens trocadas no chat do documento são gravadas sob uma aba de discussões passadas do próprio arquivo para histórico.

**Fluxos de exceção:**
- *Desconexão temporária:* Se um dos coautores perder a conexão de rede, o painel do chat exibe o status offline e tenta reconectar em background, enfileirando as mensagens não enviadas.

**Pós-condições:** O canal de comunicação síncrono é disponibilizado ao lado da página de digitação.

**Critérios de aceite:**
- [ ] O chat do documento deve carregar em background de forma assíncrona sem comprometer o lag de digitação no editor.
- [ ] As mensagens de chat devem ser persistidas de forma integrada no histórico do projeto.

**Prioridade:** Média  
**Complexidade estimada:** Média
