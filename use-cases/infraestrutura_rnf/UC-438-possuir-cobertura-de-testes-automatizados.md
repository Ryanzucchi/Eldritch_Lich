### Caso de Uso: Possuir cobertura de testes automatizados nas funcionalidades críticas (RNF)

**ID:** UC-438  
**Requisito relacionado:** RNF-Medium-2 (cobertura de testes automatizados)  
**Ator(es):** Sistema (Pipeline de CI / Runner de Testes)  
**Pré-condições:** Suíte de testes unitários e de integração configurada no repositório.  
**Gatilho:** O desenvolvedor envia commits de código (push) para a branch principal (main).  

**Fluxo principal:**
1. O desenvolvedor realiza o push do código alterado para o repositório git.
2. O servidor de integração contínua (CI) intercepta o evento e dispara o pipeline de automações.
3. O runner do CI inicializa os testes automatizados unitários e de integração de forma paralela.
4. O sistema executa as validações e calcula a cobertura total de linhas e ramificações de código (Test Coverage).
5. O sistema valida que a cobertura de código nas áreas críticas (módulos financeiros, autenticação, salvamento de dados) está acima do limite planejado (ex: cobertura mínima de 80%).
6. O pipeline aprova o build para publicação em produção.

**Fluxos alternativos:**
- *Relatório de cobertura:* O sistema gera relatórios visuais destacando em vermelho as classes do projeto que necessitam de mais testes automatizados.

**Fluxos de exceção:**
- *Queda de cobertura ou testes falhando:* Se os testes apresentarem falhas ou a cobertura de código do commit cair abaixo de 80%, o pipeline de CI rejeita o commit, bloqueia o deploy e notifica a equipe de desenvolvimento.

**Pós-condições:** A integridade de código do sistema é validada pela suíte de testes automatizados antes de subir para a nuvem.

**Critérios de aceite:**
- [ ] A cobertura mínima de testes unitários nas classes críticas (autenticação, financeiro, regras de negócio) deve ser de no mínimo 80%.
- [ ] A execução completa de testes de unidade do CI deve levar menos de 2 minutos para garantir deploys rápidos.

**Prioridade:** Média  
**Complexidade estimada:** Média
