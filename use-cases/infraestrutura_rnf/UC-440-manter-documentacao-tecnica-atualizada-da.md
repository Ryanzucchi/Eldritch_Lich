### Caso de Uso: Manter documentação técnica atualizada da arquitetura (RNF)

**ID:** UC-440  
**Requisito relacionado:** RNF-Medium-4 (documentação técnica de arquitetura)  
**Ator(es):** Sistema (Gerador de Documentação), Engenharia  
**Pré-condições:** Documentação estruturada em markdown ou frameworks de API Docs (ex: Swagger/OpenAPI) integrados ao código.  
**Gatilho:** O desenvolvedor realiza alterações de esquemas de dados ou endpoints na API do projeto.  

**Fluxo principal:**
1. O desenvolvedor cria um novo endpoint e insere as anotações do Swagger descritivas correspondentes diretamente no código-fonte.
2. Ao realizar o commit e push do código para o repositório git, o gerador automatizado lê as anotações do código.
3. O sistema compila e gera a nova versão do arquivo de especificação da API (`openapi.json`).
4. O sistema publica as atualizações de forma automática no portal de desenvolvedores da plataforma.
5. Os desenvolvedores e usuários autorizados visualizam os novos métodos cadastrados atualizados no portal.

**Fluxos alternativos:**
- *Diagramas automatizados:* O sistema reconstrói os diagramas de entidade-relacionamento (ERD) do banco de dados a cada aplicação de scripts de migração estrutural de banco.

**Fluxos de exceção:**
- *Código sem documentação:* O linter de código rejeita o commit do desenvolvedor caso ele insira novas rotas públicas sem as anotações obrigatórias de documentação do Swagger.

**Pós-condições:** A documentação técnica da API e banco de dados é mantida atualizada de forma coerente e automática.

**Critérios de aceite:**
- [ ] O portal de documentação `/docs/api` deve ser público ou protegido por login e sincronizado de imediato com a versão de produção do sistema.
- [ ] O tempo total de build e geração da documentação no pipeline de CD deve ser inferior a 1 minuto.

**Prioridade:** Média  
**Complexidade estimada:** Média
