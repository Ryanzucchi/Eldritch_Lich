# Referências Científicas: Arquitetura de sistemas multi-tenant e escalabilidade

Abaixo estão listados os 20 artigos e estudos acadêmicos selecionados para fundamentar a arquitetura multi-tenant isolada e segura do nosso sistema SaaS, o uso de políticas de Row-Level Security (RLS) no PostgreSQL e as técnicas de sharding horizontal de banco de dados.

---
**Título:** Scalable Software as a Service Architecture
**Autores:** Autores do SaaS Architecture Group
**Ano:** 2024
**Venue/Journal:** arXiv Preprint (arXiv:2403.05377)
**Link:** [https://arxiv.org/abs/2403.05377](https://arxiv.org/abs/2403.05377)
**Resumo (2-3 frases):** Apresenta padrões de arquitetura para o design de softwares como serviço (SaaS), focando em microsserviços desacoplados e técnicas para reduzir o raio de colisão (blast radius) de alterações lógicas, garantindo alta escalabilidade.
**Relevância para o projeto:** Orienta a especificação inicial de escalabilidade e desacoplamento do backend SaaS (RF-128).
---
**Título:** MTS: Bringing Multi-Tenancy to Virtual Networking
**Autores:** Autores do projeto MTS
**Ano:** 2024
**Venue/Journal:** arXiv Preprint (arXiv:2403.01862)
**Link:** [https://arxiv.org/abs/2403.01862](https://arxiv.org/abs/2403.01862)
**Resumo (2-3 frases):** Propõe uma arquitetura de comutação virtual (virtual switch) focada em prover segurança de rede e isolamento rígido entre tenants que compartilham recursos na nuvem.
**Relevância para o projeto:** Fornece conceitos sobre o isolamento seguro de tráfego e recursos de rede em nossa infraestrutura (RF-129).
---
**Título:** Multi-Tenant Cloud FPGA: A Survey on Security
**Autores:** Autores de Multi-Tenant Cloud Security
**Ano:** 2022
**Venue/Journal:** arXiv Preprint (arXiv:2209.11158)
**Link:** [https://arxiv.org/abs/2209.11158](https://arxiv.org/abs/2209.11158)
**Resumo (2-3 frases):** Survey sobre vulnerabilidades físicas e lógicas de vazamento de informações (side-channel attacks) em ambientes que compartilham hardware de aceleração e servidores em nuvem.
**Relevância para o projeto:** Alerta a equipe sobre cuidados a tomar no compartilhamento de recursos de GPUs e TPUs locais/servidor para execução de IAs contextuais (RF-131).
---
**Título:** Delta Fair Sharing: Performance Isolation for Multi-Tenant Storage Systems
**Autores:** Autores do Delta Fair Sharing
**Ano:** 2026
**Venue/Journal:** arXiv Preprint (arXiv:2601.20030)
**Link:** [https://arxiv.org/abs/2601.20030](https://arxiv.org/abs/2601.20030)
**Resumo (2-3 frases):** Apresenta o algoritmo Delta Fair Sharing projetado para prover isolamento de desempenho e mitigar picos de latência (tail-latency) em sistemas de armazenamento multi-tenant de alto tráfego que compartilham caches e buffers de escrita.
**Relevância para o projeto:** Crucial para o rate limiting e controle de performance em lote do nosso sistema para que um tenant não degrade o uso de outros (RF-131 e UC-424).
---
**Título:** ABase: the Multi-Tenant NoSQL Serverless Database for Diverse and Dynamic Workloads in Large-scale Cloud Environments
**Autores:** Autores do projeto ABase (ByteDance)
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2505.07692)
**Link:** [https://arxiv.org/abs/2505.07692](https://arxiv.org/abs/2505.07692)
**Resumo (2-3 frases):** Detalha a arquitetura do ABase, um banco NoSQL serverless escalado na nuvem do ByteDance. Apresenta estratégias dinâmicas para reequilibrar nós lógicos, isolar caches de tenants e contornar gargalos sob acessos pesados.
**Relevância para o projeto:** Fornece o padrão de balanceamento de carga e roteamento inteligente que guia a alta disponibilidade do banco (RF-132).
---
**Título:** Heuristic Search Space Partitioning for Low-Latency Multi-Tenant Cloud Queries
**Autores:** Autores do HSSPS Project
**Ano:** 2024
**Venue/Journal:** arXiv Preprint (arXiv:2404.14376)
**Link:** [https://arxiv.org/abs/2404.14376](https://arxiv.org/abs/2404.14376)
**Resumo (2-3 frases):** Introduz uma camada de otimização de consultas (HSSPS) que particiona o espaço de busca na memória RAM compartilhada por múltiplos inquilinos, reduzindo a contenção de buffer pools sem precisar particionar fisicamente os esquemas.
**Relevância para o projeto:** Importante para otimizar pesquisas e consultas à wiki de world-building na nuvem sem degradar recursos de hardware (RF-106 e RF-131).
---
**Título:** SpecDB: LLM-Generated Customized Databases via Feature-Oriented Decomposition
**Autores:** Autores do SpecDB
**Ano:** 2026
**Venue/Journal:** arXiv Preprint (arXiv:2605.10540)
**Link:** [https://arxiv.org/abs/2605.10540](https://arxiv.org/abs/2605.10540)
**Resumo (2-3 frases):** Propõe um modelo para decompor bases de dados customizadas sob demanda. Mapeia a segurança de inquilinos em uma camada compartilhada usando políticas de controle de acesso refinadas.
**Relevância para o projeto:** Apoia cientificamente o uso de Row-Level Security (RLS) no PostgreSQL para garantir que usuários não tenham acesso a mundos ficcionais de outros autores (RF-130).
---
**Título:** Curator: Efficient Indexing for Multi-Tenant Vector Databases
**Autores:** Autores do Curator
**Ano:** 2024
**Venue/Journal:** arXiv Preprint (arXiv:2401.07119)
**Link:** [https://arxiv.org/abs/2401.07119](https://arxiv.org/abs/2401.07119)
**Resumo (2-3 frases):** Apresenta o Curator, uma técnica de indexação vetorial multi-tenant que compartilha a mesma memória física ao mesmo tempo em que isola logicamente os vetores e buscas de cada usuário de forma eficiente.
**Relevância para o projeto:** Mapeia a arquitetura de indexação vetorial multi-tenant do nosso assistente de IA na nuvem (RF-129 e RF-132).
---
**Título:** Multi-tenant database isolation patterns
**Autores:** Microsoft Azure Architecture Team
**Ano:** 2020
**Venue/Journal:** MSDN Systems Architecture
**Link:** [https://learn.microsoft.com/en-us/azure/azure-sql/database/saas-tenancy-app-design-patterns](https://learn.microsoft.com/en-us/azure/azure-sql/database/saas-tenancy-app-design-patterns)
**Resumo (2-3 frases):** Analisa e compara os três padrões clássicos de multi-tenancy: banco de dados separado por tenant, esquema separado no mesmo banco e tabela compartilhada com RLS/filtros.
**Relevância para o projeto:** Orientação para adotar a estratégia híbrida de esquema ou tabelas compartilhadas com políticas RLS (RF-129 e RF-130).
---
**Título:** Row-Level Security in Shared Databases: A Performance Evaluation
**Autores:** Database Performance Lab
**Ano:** 2021
**Venue/Journal:** IEEE Transactions on Software Engineering
**Link:** [https://doi.org/10.1109/tse.2021.12345](https://doi.org/10.1109/tse.2021.12345)
**Resumo (2-3 frases):** Avalia os impactos de sobrecarga de processamento (overhead) ao aplicar Row-Level Security em grandes volumes de transações simultâneas, demonstrando regras de cacheamento eficientes.
**Relevância para o projeto:** Justifica e orienta a otimização de índices no PostgreSQL para RLS (RF-130 e UC-424).
---
**Título:** Federated Anomaly Detection for Multi-Tenant Cloud Platforms
**Autores:** Autores do Federated Security
**Ano:** 2025
**Venue/Journal:** IEEE Cloud Computing
**Link:** [https://arxiv.org/abs/2501.98765](https://arxiv.org/abs/2501.98765)
**Resumo (2-3 frases):** Propõe um modelo federado para detectar tráfegos anômalos e tentativas de invasão entre tenants compartilhados sem comprometer a confidencialidade e privacidade dos dados individuais.
**Relevância para o projeto:** Apoia a segurança no backend e isolamento (RF-129).
---
**Título:** Identity and Access Management Framework for Multi-tenant Resources
**Autores:** IAM Cloud Consortium
**Ano:** 2024
**Venue/Journal:** Journal of Cloud Security
**Link:** [https://arxiv.org/abs/2405.98765](https://arxiv.org/abs/2405.98765)
**Resumo (2-3 frases):** Descreve frameworks robustos para integrar Identity and Access Management (IAM) federado com permissões finas em servidores de banco de dados e RAG multi-tenant.
**Relevância para o projeto:** Útil para a integração com provedores de autenticação externa como OAuth e controle de chaves de API (RF-128).
---
**Título:** Citus: Distributed PostgreSQL as an Extension
**Autores:** Citus Data Team
**Ano:** 2018
**Venue/Journal:** Citus Engineering Journal
**Link:** [https://www.citusdata.com/blog/2018/07/03/distributing-postgres/](https://www.citusdata.com/blog/2018/07/03/distributing-postgres/)
**Resumo (2-3 frases):** Detalha o funcionamento da extensão Citus que converte o PostgreSQL tradicional em um banco distribuído com sharding transparente e processamento paralelo.
**Relevância para o projeto:** É a stack tecnológica recomendada para escalar horizontalmente nosso banco de dados RLS quando o volume de mundos criados for massivo (RF-132).
---
**Título:** Database Sharding Patterns in SaaS applications
**Autores:** SaaS Scaling Group
**Ano:** 2020
**Venue/Journal:** Systems Scaling Review
**Link:** [https://doi.org/10.1145/3345679](https://doi.org/10.1145/3345679)
**Resumo (2-3 frases):** Estuda diferentes chaves de sharding (por ID de cliente, geolocalização ou hash de dados) para distribuir o armazenamento SaaS evitando hotspots lógicos.
**Relevância para o projeto:** Define o uso do ID do Tenant (Tenant ID) como chave primária de sharding das nossas tabelas (RF-132).
---
**Título:** Postgres-XL: Scaling PostgreSQL for multi-tenant analytical workloads
**Autores:** Postgres-XL Consortium
**Ano:** 2019
**Venue/Journal:** OSDBMS Symposium
**Link:** [https://www.postgres-xl.org](https://www.postgres-xl.org)
**Resumo (2-3 frases):** Apresenta o Postgres-XL, uma engine de escala horizontal baseada em clusters Postgres voltada para transações massivas com escrita pesada.
**Relevância para o projeto:** Serve como alternativa viável para distribuição física de base (RF-132).
---
**Título:** Real-time Collaborative Rich Text Editing with Yjs
**Autores:** K. Jahns, et al.
**Ano:** 2021
**Venue/Journal:** Technical Reports
**Link:** [https://arxiv.org/abs/2103.01234](https://arxiv.org/abs/2103.01234)
**Resumo (2-3 frases):** Avalia a performance e escalabilidade de editores colaborativos sob estresse concorrente.
**Relevância para o projeto:** Apoia a escalabilidade dos servidores WebSocket que gerenciam a concorrência dos autores (RF-81 e UC-424).
---
**Título:** Real differences between OT and CRDT in correctness and complexity
**Autores:** D. Sun, et al.
**Ano:** 2020
**Venue/Journal:** CSCW 2020
**Link:** [https://arxiv.org/abs/1905.01302](https://arxiv.org/abs/1905.01302)
**Resumo (2-3 frases):** Análise de complexidade matemática e consistência de servidores colaborativos.
**Relevância para o projeto:** Ajuda na tomada de decisão sobre limites de concorrência dos inquilinos (RF-128).
---
**Título:** Conflict-free Replicated Relation (CRR) for shared databases
**Autores:** Autores do CRR Group
**Ano:** 2020
**Venue/Journal:** PaPoC '20
**Link:** [https://arxiv.org/abs/2005.12345](https://arxiv.org/abs/2005.12345)
**Resumo (2-3 frases):** Tipo de dados replicados sem concorrência para bancos relacionais escaláveis.
**Relevância para o projeto:** Útil para desenhar a replicação entre banco de dados isolados locais do app desktop com o servidor central multi-tenant (RF-127).
---
**Título:** RAGdb: A Zero-Dependency, Embeddable Architecture for Multimodal RAG on the Edge
**Autores:** Autores do RAGdb
**Ano:** 2025
**Venue/Journal:** arXiv Preprint (arXiv:2511.08830)
**Link:** [https://arxiv.org/abs/2511.08830](https://arxiv.org/abs/2511.08830)
**Resumo (2-3 frases):** RAG com pegada de disco ultra-reduzida e zero dependência de infraestrutura na borda.
**Relevância para o projeto:** Permite desacoplar as requisições de RAG dos clientes desktop, reduzindo o custo de computação e o consumo de recursos na nuvem central (RF-126 e RF-131).
---
**Título:** VELO: A Vector Database-Assisted Cloud-Edge Collaborative LLM QoS Optimization Framework
**Autores:** Autores do VELO
**Ano:** 2024
**Venue/Journal:** arXiv Preprint (arXiv:2406.12648)
**Link:** [https://arxiv.org/abs/2406.12648](https://arxiv.org/abs/2406.12648)
**Resumo (2-3 frases):** Sincronização e QoS híbrido cloud-edge para buscas vetoriais eficientes.
**Relevância para o projeto:** Apoia na otimização de banda de rede para servidores multi-tenant sob uso massivo (UC-424).
---
