### Caso de Uso: Reconhecer contradições entre eventos

**ID:** UC-051  
**Requisito relacionado:** RF-51 (reconhecer contradições entre eventos)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui eventos cadastrados na base de dados e textos que relatam esses eventos.  
**Gatilho:** Análise contínua do texto do editor ou solicitação de verificação lógica pelo usuário.  

**Fluxo principal:**
1. A IA lê o texto e identifica descrições que relatam o andamento, consequências ou participantes de um evento cadastrado.
2. A IA confronta as descrições com os metadados do evento no banco de dados (ex: a base diz que o evento "A Batalha do Moinho" terminou com a "vitória dos rebeldes" e que o personagem "John morreu" nela, mas o texto relata: "Após a vitória das forças imperiais na Batalha do Moinho, John retornou para casa").
3. A IA identifica as contradições (desfecho incorreto e personagem morto reaparecendo).
4. O sistema marca o trecho do texto com um sublinhado vermelho e exibe a justificativa do conflito no tooltip informativo.

**Fluxos alternativos:**
- *Retcon automático:* O usuário clica em "Atualizar Evento com esta versão" para mudar os metadados do evento na linha do tempo baseado no novo texto do capítulo.

**Fluxos de exceção:**
- *Universos alternativos:* Se a contradição ocorrer devido a ramificações temporárias ativas, o sistema contextualiza e não sinaliza como erro caso os eventos ocorram em linhas temporais paralelas diferentes.

**Pós-condições:** Contradições lógicas e factuais sobre eventos históricos do universo são apresentadas.

**Critérios de aceite:**
- [ ] A IA deve analisar inconsistências de: vencedor/desfecho do evento, personagens participantes, e localização do evento.
- [ ] O relatório de inconsistência deve apontar claramente qual o fato gravado na cronologia e qual o trecho em contradição.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
