### Caso de Uso: Visualizar quem está editando qual arquivo/campo (cursor)

**ID:** UC-213  
**Requisito relacionado:** RF-213 (visualizar quem está editando qual arquivo/campo (cursor))  
**Ator(es):** Usuário (Colaborador), Sistema  
**Pré-condições:** Múltiplos colaboradores estão com o mesmo documento aberto e editando em tempo real.  
**Gatilho:** Movimentação do cursor ou digitação de texto por parte de um dos colaboradores.  

**Fluxo principal:**
1. O Colaborador A está com o cursor posicionado na linha 15 do capítulo aberto.
2. O sistema captura a posição do cursor (índice de caractere no editor) do Colaborador A e envia em tempo real via WebSocket.
3. O Colaborador B visualiza um cursor flutuante colorido (ex: roxo) posicionado na linha 15 do seu próprio editor, contendo uma tag com o nome "Colaborador A" flutuando acima.
4. À medida que o Colaborador A digita ou move o cursor, as alterações de posição são sincronizadas na tela do Colaborador B.

**Fluxos alternativos:**
- *Visualizar foco na árvore:* A árvore lateral exibe uma miniatura do avatar do Colaborador A ao lado do nome do arquivo na listagem, indicando de forma macro que ele está com aquele documento aberto no momento.

**Fluxos de exceção:**
- *Latência alta:* Se a conexão do usuário ficar lenta, a movimentação do cursor é atualizada com interpolação suave na tela do outro usuário para evitar saltos.

**Pós-condições:** As coordenadas dos cursores ativos dos colaboradores online são renderizadas na tela de forma síncrona.

**Critérios de aceite:**
- [ ] A posição dos cursores deve se adaptar dinamicamente ao redimensionamento de fontes ou layouts de tela diferentes.
- [ ] O envio de eventos de cursor deve ter taxa limitada (throttling) a no máximo 10 mensagens por segundo para poupar banda.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
