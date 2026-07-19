### Caso de Uso: Estar disponível pelo menos 99,5% do tempo (uptime) (RNF)

**ID:** UC-419  
**Requisito relacionado:** RNF-Critical-6 (uptime de 99,5% do tempo)  
**Ator(es):** Sistema, Balanceador de Carga / Clusters (Infraestrutura)  
**Pré-condições:** Aplicação hospedada em clusters redundantes com balanceador de carga ativo.  
**Gatilho:** Queda física ou falha de hardware em um dos servidores de produção.  

**Fluxo principal:**
1. A plataforma roda sob múltiplos servidores paralelos ativos atrás de um balanceador de carga.
2. Um dos servidores do cluster sofre uma falha crítica de hardware e desliga.
3. O monitor de integridade (health check) do balanceador de carga detecta a inatividade do nó com falha em até 10 segundos.
4. O balanceador de carga redireciona imediatamente 100% das requisições subsequentes para os servidores operacionais restantes.
5. Os usuários continuam utilizando a plataforma normalmente sem interrupções de serviço.
6. O sistema de escalonamento automático (auto-scaling) inicia uma nova instância substituta de servidor para restabelecer a capacidade do pool.

**Fluxos alternativos:**
- *Atualização sem queda:* Ao implantar código novo (deploy), o sistema atualiza as instâncias uma a uma (Rolling Update), mantendo sempre servidores ativos e evitando downtime na atualização.

**Fluxos de exceção:**
- *Falha regional:* Se toda a região do data center principal sofrer indisponibilidade, o sistema de failover de DNS redireciona o tráfego dos usuários para servidores em uma segunda região geográfica de backup.

**Pós-condições:** A plataforma se mantém operacional garantindo a cota de 99,5% de uptime anual (máximo de 1,83 dias de downtime acumulado por ano).

**Critérios de aceite:**
- [ ] O balanceador de carga deve remover instâncias problemáticas do pool em até 15 segundos após falhas consecutivas de resposta.
- [ ] A latência de failover em caso de queda de servidores de aplicação deve ser imperceptível ao usuário final.

**Prioridade:** Crítica  
**Complexidade estimada:** Alta
