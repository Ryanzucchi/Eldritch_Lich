# ADR 003: Banco de Dados e Multi-Tenancy (PostgreSQL + pgvector + RLS)

## Status
Aprovado

## Data
20 de julho de 2026

## Contexto
O sistema armazena dados intelectuais altamente sensíveis (manuscritos, outlines de roteiro) de múltiplos usuários e equipes de coautores. É crítico isolar totalmente as bases de dados para evitar injeções ou vazamentos IDOR (Insecure Direct Object Reference) de terceiros. Além disso, o sistema apoia busca semântica em grafos e textos.

## Decisão
- Utilizaremos **PostgreSQL** como nosso banco de dados relacional unificado para produção.
- Para busca semântica e suporte ao Grafo de Metas Narrativas (GMN), usaremos a extensão **pgvector** integrada no próprio banco.
- O isolamento multi-tenant (por projeto e usuário) será garantido na camada de banco de dados via **Row-Level Security (RLS)** do PostgreSQL.
- Todas as tabelas que envolvem dados de projetos (textos, personagens, GMN) terão uma política RLS aplicada: por padrão, todas as operações de leitura/escrita são bloqueadas (`default deny`) a menos que a query passe um ID de contexto do tenant validado na sessão JWT do WebSocket ou REST da API.

## Consequências
* **Positivas:**
  * Proteção nativa no banco contra vazamento de dados. Mesmo que ocorra um bug na lógica da aplicação (NestJS), o banco de dados impede que um usuário leia dados de outro tenant.
  * Baixa complexidade operacional comparado a gerenciar um banco de dados por usuário.
  * Busca semântica e dados estruturados residem sob o mesmo motor ACID.
* **Negativas:**
  * Testes de banco exigem cuidado para validar o contexto RLS do usuário nas conexões de teste.
  * HNSW no pgvector necessita monitoramento de desempenho de memória no servidor.
