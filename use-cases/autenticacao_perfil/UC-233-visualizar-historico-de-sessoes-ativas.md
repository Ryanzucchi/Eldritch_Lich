### Caso de Uso: Visualizar histórico de sessões ativas (dispositivos)

**ID:** UC-233  
**Requisito relacionado:** RF-233 (visualizar histórico de sessões ativas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado e possui uma ou mais sessões ativas registradas na tabela correspondente.  
**Gatilho:** O usuário acessa "Sessões Ativas" no menu de configurações da conta.  

**Fluxo principal:**
1. O usuário abre o painel "Minhas Sessões".
2. O sistema realiza uma busca na tabela de sessões ativas vinculadas ao ID do usuário.
3. A interface renderiza a lista de dispositivos logados contendo:
   - Nome do Dispositivo/SO (ex: "Chrome no Windows 11").
   - Endereço IP aproximado.
   - Localização estimada por IP.
   - Data do último acesso.
   - Marcador "Sessão Atual" na linha correspondente à aba ativa.
4. O usuário visualiza onde sua conta está sendo acessada.

**Fluxos alternativos:**
- *Histórico de logins:* O usuário clica na aba "Histórico de Acessos Recentes" para auditar logins encerrados nos últimos 30 dias.

**Fluxos de exceção:**
- *Localização falhar:* Se a base de dados de geolocalização por IP falhar, o sistema exibe "Localização desconhecida".

**Pós-condições:** O relatório detalhado de dispositivos logados é apresentado ao usuário na tela.

**Critérios de aceite:**
- [ ] A listagem deve identificar corretamente o User-Agent do navegador de origem da requisição.
- [ ] A listagem de sessões deve carregar em menos de 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
