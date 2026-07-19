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
