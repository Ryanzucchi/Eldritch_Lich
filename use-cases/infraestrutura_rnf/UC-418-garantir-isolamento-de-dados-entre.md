### Caso de Uso: Garantir isolamento de dados entre usuários/projetos (multi-tenancy seguro) (RNF)

**ID:** UC-418  
**Requisito relacionado:** RNF-Critical-5 (garantir isolamento de dados (multi-tenancy seguro))  
**Ator(es):** Sistema, Banco de Dados  
**Pré-condições:** Modelo de arquitetura multi-tenant implementado no banco de dados.  
**Gatilho:** Um usuário realiza uma consulta de leitura ou comando de gravação em qualquer módulo.  

**Fluxo principal:**
1. O usuário do Tenant ID 10 solicita a visualização da listagem de personagens.
2. O backend intercepta a requisição e anexa de forma automática e forçada a restrição do inquilino (ex: `WHERE tenant_id = 10`) em todas as consultas SQL do repositório.
3. O banco de dados processa a consulta indexada.
4. O banco retorna apenas os personagens pertencentes ao Tenant ID 10.
5. O usuário correspondente é impedido de acessar dados de outros tenants mesmo alterando IDs de parâmetros em URLs de requisições.

**Fluxos alternativos:**
- *Isolamento físico:* Para clientes corporativos enterprise, o sistema cria instâncias dedicadas de banco de dados físicos separados, garantindo isolamento total em nível de hardware.

**Fluxos de exceção:**
- *Vazamento de query:* Se o sistema detectar uma tentativa de execução de query crítica de leitura que não contenha o filtro de tenant id correspondente ao token do usuário, a requisição é abortada e gera log de falha de segurança interna.

**Pós-condições:** O isolamento total de dados entre diferentes empresas/inquilinos é garantido na camada de persistência.

**Critérios de aceite:**
- [ ] Os testes automatizados de segurança devem validar periodicamente a imunidade a falhas de acessos cruzados entre tenants (cross-tenant leakage).
- [ ] A aplicação do filtro de tenant_id não deve onerar as consultas de banco de dados (indexação correta de tabelas).

**Prioridade:** Crítica  
**Complexidade estimada:** Alta
