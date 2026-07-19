### Caso de Uso: Escalar horizontalmente conforme aumento de usuários/dados (RNF)

**ID:** UC-427  
**Requisito relacionado:** RNF-High-3 (escalabilidade horizontal do sistema)  
**Ator(es):** Sistema (Orquestrador de Containers / Kubernetes)  
**Pré-condições:** Aplicação conteinerizada (Docker) configurada com políticas de escalabilidade HPA.  
**Gatilho:** O consumo de CPU ou memória dos servidores atinge ou supera 70% de utilização.  

**Fluxo principal:**
1. O volume de acessos sobe e os servidores ativos de produção começam a registrar consumo superior a 70% de CPU.
2. O orquestrador Kubernetes detecta o consumo elevado por meio de monitoramento de métricas.
3. O orquestrador dispara de forma automática o escalonamento horizontal, inicializando novas réplicas (containers) da aplicação em paralelo.
4. O balanceador de carga é atualizado e distribui as novas requisições também para as novas instâncias ativadas.
5. O uso médio de CPU do cluster recua para patamares seguros, normalizando a performance.

**Fluxos alternativos:**
- *Escalar banco de dados:* O sistema direciona de forma automática todas as operações de leitura para servidores réplicas de banco de dados (Read Replicas), aliviando o servidor principal.

**Fluxos de exceção:**
- *Limite de hardware da nuvem:* Se o cluster precisar de mais servidores físicos do provedor de nuvem, o orquestrador aciona a API da nuvem (Cluster Autoscaler) para contratar e alocar uma nova máquina física de hardware em background.

**Pós-condições:** Novas réplicas da aplicação são criadas e ativadas para absorver o crescimento de carga sem lentidões.

**Critérios de aceite:**
- [ ] A inicialização completa de uma nova réplica em container do sistema de chat/API deve durar menos de 60 segundos após o disparo do gatilho.
- [ ] A infraestrutura deve suportar escalabilidade até o limite configurado de réplicas antes de emitir alertas de cota física.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
