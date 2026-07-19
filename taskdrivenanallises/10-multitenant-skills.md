# Proposta de Skills — Arquitetura de sistemas multi-tenant e escalabilidade

Abaixo estão especificadas as skills técnicas extraídas da Tese 10 e de sua base científica correspondente, voltadas ao desenvolvimento de plataformas SaaS seguras, isoladas e escaláveis.

---

## Skill: `isolamento-de-banco-de-dados-com-rls`

**Temática de origem:** Arquitetura de sistemas multi-tenant e escalabilidade (Tese 10)
**Objetivo:** Implementar isolamento lógico rigoroso de dados no PostgreSQL usando políticas declarativas de Row-Level Security (RLS) para múltiplos inquilinos compartilhando as mesmas tabelas físicas.
**Quando usar (triggers):** Na modelagem de tabelas relacionais compartilhadas na nuvem, desenvolvimento de microsserviços SaaS e auditoria de segurança lógica.
**Fundamentação científica:** RLS Policy Patterns (2024), HTAP for SaaS (2025), GDPR Multi-Tenant (2023).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Adição de Tenant Key:** Adicionar uma coluna indexada `tenant_id` (tipo UUID) em todas as tabelas compartilhadas da base (ex: `manuscritos`, `notas`, `entidades`).
2. **Ativação do RLS:** Habilitar a segurança de linha através do comando SQL:
   `ALTER TABLE manuscritos ENABLE ROW LEVEL SECURITY;`
3. **Criação de Política Declarativa:** Associar uma política baseada em parâmetro de sessão dinâmica:
   `CREATE POLICY tenant_isolation_policy ON manuscritos USING (tenant_id = current_setting('app.current_tenant_id', true));`
4. **Vinculação de Sessão Transacional:** No gateway do servidor, iniciar cada requisição HTTP/WebSocket abrindo uma transação SQL e setando a variável local:
   `SET LOCAL app.current_tenant_id = 'uuid-do-tenant';`
5. **Prevenção de Cache Leak:** Configurar o ORM para usar queries parametrizadas estritas para evitar planos de execução mal otimizados compartilhando o mesmo cache de busca.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Full Table Scans por Ausência de Índices:** Se a coluna `tenant_id` não estiver indexada como chave primária composta (ex: `PRIMARY KEY (tenant_id, id)`), o PostgreSQL executará varreduras completas na tabela física a cada checagem de RLS. Isso eleva a latência exponencialmente com o crescimento da base. Indexar a chave de tenant é obrigatório (RLS Policy Patterns, 2024).

**Métricas de sucesso sugeridas:**
- Overhead de latência transacional adicionado pelo RLS (alvo $< 10\%$).

**Requisito(s) do projeto relacionado(s):** RF-130 (banco de dados isolado), RF-129 (dados criptografados).

**Nível de maturidade da técnica:** Consolidada.

---

## Skill: `particionamento-de-modelos-de-ia-com-lora-dinamico`

**Temática de origem:** Arquitetura de sistemas multi-tenant e escalabilidade (Tese 10)
**Objetivo:** Personalizar assistentes de IA generativa por inquilino usando adaptadores LoRA dinâmicos e isolados na nuvem para impedir vazamento de propriedade intelectual.
**Quando usar (triggers):** Ao projetar chamadas de RAG, brainstorm ou sugestões de escrita contextual na nuvem compartilhada.
**Fundamentação científica:** Multi-Tenant LoRA (2025), LLM Privacy Leakage (2024), Memorization in LLMs (2023).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Modelo Base Congelado:** Carregar um LLM base unificado (ex: Llama-3-8B) em modo de apenas leitura na memória VRAM da GPU.
2. **LoRA Fine-Tuning Isolado:** Ajustar adaptadores LoRA (40MB de tamanho médio) independentemente para cada tenant utilizando apenas seus manuscritos proprietários.
3. **Inferência Multi-Tenant no Triton:** Configurar o Triton Inference Server para escutar requisições de inferência contendo o cabeçalho `tenant_id`.
4. **Mapeamento de Pesos Dinâmico:** Overlayar dinamicamente os tensores do adaptador LoRA correspondente ao tenant sobre o modelo base congelado.
5. **Gerenciamento LRU Cache:** Monitorar e manter adaptadores de tenants ativos em cache na VRAM GPU, removendo os menos utilizados sob políticas LRU quando a memória física atingir limites críticos.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Cold-Start Latency por IO de Rede:** Buscar o adaptador LoRA de 40MB do bucket S3 a cada requisição de inferência adiciona uma latência de rede insustentável (>1,2s). É mandatório pré-carregar e manter adaptadores de sessões ativas de escrita no cache do Triton Server (Multi-Tenant LoRA, 2025).

**Métricas de sucesso sugeridas:**
- TTFT (Time-to-first-token) adicional introduzido pelo LoRA dinâmico (alvo $< 8\%$).

**Requisito(s) do projeto relacionado(s):** RF-131 (IA isolada), RF-132 (balanceamento).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `conformidade-com-lgpd-e-gdpr-por-design`

**Temática de origem:** Arquitetura de sistemas multi-tenant e escalabilidade (Tese 10)
**Objetivo:** Projetar rotinas de exclusão física permanente e portabilidade estruturada de propriedade intelectual literária em ambientes SaaS multi-tenant.
**Quando usar (triggers):** Requisições de encerramento de conta, solicitações de portabilidade de dados, auditoria de dados sensíveis e conformidade legal.
**Fundamentação científica:** GDPR Multi-Tenant (2023), LGPD Compliance SaaS (2024), Zero Trust (ZERO TRUST ARCHITECTURE GROUP, 2024).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Hard-Delete em Cascata:** Configurar tabelas com restrições `ON DELETE CASCADE` estritas ligadas ao `tenant_id` para garantir que a exclusão física do inquilino limpe todos os chunks, grafos, redes e arquivos do banco.
2. **VACUUM PostgreSQL:** Rodar o comando PostgreSQL `VACUUM FULL` ou sobregravação direta de blocos de disco imediatamente após a deleção para remover traços físicos dos arquivos excluídos da máquina do servidor.
3. **Exportador Unificado Aberto:** Desenvolver empacotadores JSON/YAML que exportem integralmente o GUF (grafos), fichas, linhas do tempo e manuscritos em pacotes padronizados legíveis por máquina.
4. **Log de Consentimento Imutável:** Manter um log protegido contra escrita contendo metadados de aceitação/revogação de termos e logs de execução de exclusão física para conformidade legal.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Deleção Lógica como Solução de Privacidade:** Apenas marcar `is_deleted = true` em colunas do banco de dados expõe o sistema a auditorias de privacidade negativas sob a LGPD. Os dados permanecem legíveis em disco. Para conformidade de direito ao apagamento, a remoção física dos blocos e a reindexação devem ser executadas (GDPR Multi-Tenant, 2023).

**Métricas de sucesso sugeridas:**
- Taxa de sucesso e integridade em deleções físicas completas em cascata (alvo $100\%$).

**Requisito(s) do projeto relacionado(s):** RF-128 (conformidade LGPD), RF-129 (dados criptografados).

**Nível de maturidade da técnica:** Consolidada.
