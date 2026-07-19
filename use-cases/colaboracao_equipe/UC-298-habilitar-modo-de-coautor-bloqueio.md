### Caso de Uso: Habilitar modo de coautor (bloqueio de capítulo por usuário)

**ID:** UC-298  
**Requisito relacionado:** RF-298 (habilitar modo de coautor)  
**Ator(es):** Usuário A (Coautor ativo), Usuário B (Coautor concorrente), Sistema  
**Pré-condições:** O projeto é colaborativo e ambos os coautores possuem permissão de escrita.  
**Gatilho:** O Usuário A clica em um capítulo para iniciar a edição do documento.  

**Fluxo principal:**
1. O Usuário A abre o capítulo no editor de texto.
2. O sistema envia a notificação de trancamento de arquivo para o servidor via conexão persistente (WebSocket).
3. O sistema ativa o bloqueio do capítulo de texto para o Usuário A, gravando o status em cache de memória rápida do servidor.
4. O Usuário B tenta abrir o mesmo capítulo de texto no painel dele.
5. O sistema abre o capítulo para o Usuário B no modo "Apenas Leitura", desabilitando o teclado de digitação e exibindo um banner informando que o capítulo está sendo editado no momento pelo Usuário A.
6. O Usuário B visualiza a escrita do Usuário A em tempo real, mas é impedido de fazer alterações concorrentes.

**Fluxos alternativos:**
- *Liberação automática de trava:* O Usuário A fecha o capítulo ou sai da tela. O sistema dispara evento WebSocket desfazendo a trava e liberando o arquivo de escrita para outros coautores.

**Fluxos de exceção:**
- *Inatividade ou desconexão:* Se o Usuário A ficar inativo ou perder a conexão de rede por mais de 10 minutos, o sistema expira o status de trancamento automaticamente e libera o capítulo.

**Pós-condições:** O status de bloqueio de edição exclusiva do capítulo é gerenciado ativamente.

**Critérios de aceite:**
- [ ] A ativação e validação do bloqueio de arquivo devem ocorrer em menos de 100ms via WebSocket.
- [ ] O banner de aviso de bloqueio de capítulo deve exibir a foto e o nome em tempo real do coautor que está com o arquivo aberto para escrita.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
