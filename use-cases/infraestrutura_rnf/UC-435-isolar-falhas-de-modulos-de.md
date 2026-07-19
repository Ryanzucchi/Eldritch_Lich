### Caso de Uso: Isolar falhas de módulos de IA sem derrubar o restante da aplicação (RNF)

**ID:** UC-435  
**Requisito relacionado:** RNF-High-11 (isolar falhas de módulos de IA)  
**Ator(es):** Sistema (Arquitetura de Microsserviços / Circuit Breaker)  
**Pré-condições:** Módulo de IA rodando em contêiner ou serviço isolado do servidor de API principal. Padrão Circuit Breaker configurado.  
**Gatilho:** O servidor de IA cai ou estoura o tempo limite de resposta (timeout).  

**Fluxo principal:**
1. O usuário aciona uma funcionalidade de IA (ex: resumo por IA) na interface.
2. O backend principal da API envia a requisição para o módulo de IA isolado.
3. O módulo de IA falha consecutivamente por indisponibilidade.
4. O backend detecta as falhas, ativa o disjuntor (Circuit Breaker) e desativa temporariamente o fluxo de chamadas para a IA.
5. O backend responde imediatamente ao usuário final com a mensagem de que o serviço de IA está instável, mantendo a tela ativa e utilizável para digitação e outras operações comuns.
6. Os demais módulos vitais (escrita de textos, chats, financeiro) continuam operando normalmente sem interrupções.

**Fluxos alternativos:**
- *Recuperação automática do Circuit Breaker:* Passados 5 minutos, o sistema realiza uma chamada de teste silenciosa à IA. Se responder com sucesso, o disjuntor é fechado e a funcionalidade de IA é re-ativada para os usuários.

**Fluxos de exceção:**
- *Timeout rígido:* Se o módulo de IA demorar para responder sem cair fisicamente, o sistema corta a requisição após timeout limite de 10 segundos para liberar a thread da API principal e evitar lentidão.

**Pós-condições:** A falha no módulo de IA é contida e isolada de forma silenciosa, mantendo os recursos vitais da plataforma operacionais.

**Critérios de aceite:**
- [ ] O Circuit Breaker deve abrir de imediato após 3 falhas consecutivas de timeout ou erro 500 do módulo de IA.
- [ ] O isolamento de falha deve garantir que nenhum outro banco de dados do sistema principal seja corrompido ou travado pelas falhas de IA.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
