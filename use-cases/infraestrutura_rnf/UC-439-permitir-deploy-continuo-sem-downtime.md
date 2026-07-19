### Caso de Uso: Permitir deploy contínuo sem downtime perceptível (RNF)

**ID:** UC-439  
**Requisito relacionado:** RNF-Medium-3 (deploy contínuo sem downtime)  
**Ator(es):** Sistema (Pipeline de CD / Orquestrador de Deploy)  
**Pré-condições:** Orquestrador de containers suportando deploys no padrão Blue-Green ou Rolling Updates.  
**Gatilho:** O pipeline de CI aprova o build de uma nova versão estável (v1.2).  

**Fluxo principal:**
1. O sistema de deploy contínuo (CD) inicia o processo de atualização de versão na nuvem de produção.
2. O orquestrador mantém as instâncias da versão antiga (v1.1) ativas e respondendo às requisições dos usuários normalmente (Ambiente Blue).
3. O orquestrador inicializa as novas réplicas de containers da versão nova (v1.2) de forma isolada em paralelo (Ambiente Green).
4. O sistema executa testes automatizados rápidos de integridade (smoke tests) nas novas instâncias.
5. Ao passar nos testes de fumaça, o balanceador de carga redireciona instantaneamente o tráfego dos usuários da v1.1 para a v1.2 na camada de rede.
6. Os containers antigos de v1.1 realizam desligamento suave e são finalizados de forma limpa.

**Fluxos alternativos:**
- *Deploy Canário:* O sistema direciona apenas um pequeno percentual (ex: 5%) de conexões para a nova versão v1.2. Se nenhum erro ocorrer após 1 hora, expande gradualmente o tráfego de usuários até atingir 100% de direcionamento.

**Fluxos de exceção:**
- *Falhas detectadas na fumaça:* Se a versão v1.2 disparar erros de sistema na verificação de integridade inicial, o deploy é abortado pelo orquestrador mantendo 100% dos usuários no Ambiente Blue (v1.1) estável (Rollback Automático).

**Pós-condições:** O deploy da nova versão da aplicação é concluído com zero downtime de serviço.

**Critérios de aceite:**
- [ ] A troca de conexões entre versões no balanceador de carga deve ocorrer em menos de 100ms.
- [ ] O deploy não deve exigir telas de manutenção fora do horário comercial para subida de novos builds.

**Prioridade:** Média  
**Complexidade estimada:** Alta
