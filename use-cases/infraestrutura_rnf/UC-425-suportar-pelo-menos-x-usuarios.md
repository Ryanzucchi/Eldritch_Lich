### Caso de Uso: Suportar pelo menos X usuários simultâneos sem degradação perceptível de performance (RNF)

**ID:** UC-425  
**Requisito relacionado:** RNF-High-1 (suportar usuários simultâneos)  
**Ator(es):** Sistema (Infraestrutura de Clusters)  
**Pré-condições:** Cota mínima de capacidade de processamento e memória dimensionada para escalabilidade.  
**Gatilho:** O tráfego de usuários simultâneos atinge a marca limite de X conexões ativas simultâneas (ex: 5.000 usuários ativos).  

**Fluxo principal:**
1. A plataforma recebe um aumento gradual de acessos de usuários simultâneos.
2. O número de conexões ativas simultâneas na plataforma alcança a marca configurada (ex: 5.000 usuários ativos).
3. O balanceador de carga divide as requisições de forma proporcional entre as instâncias e servidores ativos do cluster.
4. O sistema monitora o tempo médio de resposta de API e a taxa de erros, que permanecem estáveis.
5. Os usuários navegam de forma fluida sem lentidões na tela ou timeouts.

**Fluxos alternativos:**
- *Auto-scaling:* O número de acessos ultrapassa o limite X previsto. O monitor de infraestrutura ativa novas instâncias automaticamente em menos de 2 minutos para absorver a carga.

**Fluxos de exceção:**
- *Sobrecarga de banco:* Sob carga extrema, o sistema gerencia as conexões por meio de pool de conexões para evitar quedas por esgotamento de conexões abertas no banco de dados.

**Pós-condições:** O sistema se mantém íntegro e responsivo sob a carga de tráfego simultâneo.

**Critérios de aceite:**
- [ ] A aplicação deve suportar testes de carga simulando 5.000 usuários simultâneos sem que a taxa de erro de chamadas ultrapasse 1%.
- [ ] O tempo de carregamento de páginas da API sob carga máxima não deve se elevar mais de 20% em relação ao tempo com a plataforma vazia.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
