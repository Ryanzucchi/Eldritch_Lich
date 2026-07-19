### Caso de Uso: Permitir recuperação de dados em caso de falha catastrófica (disaster recovery) (RNF)

**ID:** UC-423  
**Requisito relacionado:** RNF-Critical-10 (recuperação de dados em falha catastrófica)  
**Ator(es):** Sistema, Infraestrutura SRE/DevOps  
**Pré-condições:** Backups redundantes criptografados salvos em nuvem geograficamente isolada.  
**Gatilho:** Ocorre um desastre físico ou falha catastrófica total no data center de produção.  

**Fluxo principal:**
1. O data center principal sofre perda total física de dados por desastre ou quebra crítica de hardware.
2. O sistema de monitoramento alerta a equipe SRE sobre a indisponibilidade total dos serviços de produção.
3. A equipe SRE aciona o plano de Disaster Recovery (DR).
4. O sistema provisiona de forma automática uma nova infraestrutura de servidores em uma região geográfica secundária por meio de scripts de infraestrutura como código (IaC).
5. O sistema localiza o backup diário mais recente no storage isolado e reconstrói as bases de dados e arquivos.
6. O roteamento DNS é alterado de forma segura para a nova região geográfica e o sistema volta a operar online.

**Fluxos alternativos:**
- *Simulações de DR:* A equipe executa testes controlados periodicamente fora do horário comercial para validar a infraestrutura secundária de desastres.

**Fluxos de exceção:**
- *Backup do dia corrompido:* Se o snapshot diário mais recente apresentar erro de integridade, o sistema retrocede e reconstrói a base a partir do backup do dia anterior, reportando o desvio de integridade.

**Pós-condições:** A plataforma e todos os dados consistentes dos usuários são restaurados na região secundária.

**Critérios de aceite:**
- [ ] RPO (Recovery Point Objective - limite de perda de dados) deve ser de no máximo 24 horas (intervalo do último backup diário).
- [ ] RTO (Recovery Time Objective - tempo de restabelecimento) deve ser inferior a 4 horas.

**Prioridade:** Crítica  
**Complexidade estimada:** Alta
