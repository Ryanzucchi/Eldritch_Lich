### Caso de Uso: Ter código modular e testável (arquitetura desacoplada) (RNF)

**ID:** UC-437  
**Requisito relacionado:** RNF-Medium-1 (código modular e testável)  
**Ator(es):** Sistema (Arquitetura de Software / Engenharia)  
**Pré-condições:** Padrões de arquitetura limpa e injeção de dependências configurados no repositório de código.  
**Gatilho:** A equipe de desenvolvimento insere um novo módulo ou altera regras de negócio.  

**Fluxo principal:**
1. O desenvolvedor implementa um novo módulo (ex: Gestão de Metas) separando as regras em camadas lógicas (infraestrutura, adaptadores, regras de negócio e entidades).
2. O desenvolvedor escreve regras de negócio em classes desacopladas do banco de dados e do framework de rotas (inversão de dependência).
3. Ao construir a suíte de testes do módulo, o desenvolvedor mocka (simula) o banco de dados e a rede de forma simplificada no código dos testes.
4. O desenvolvedor roda a validação isolada, e o sistema executa os testes unitários sem abrir conexões de infraestrutura física.
5. Os testes unitários validam a integridade lógica da regra de negócio de metas com sucesso.

**Fluxos alternativos:**
- *Mudança de tecnologia:* A diretoria decide trocar o banco de dados da aplicação. Como as regras de negócio estão isoladas, a equipe altera apenas a implementação das classes do repositório da camada de infraestrutura, mantendo 100% da lógica de negócio intacta.

**Fluxos de exceção:**
- *Acoplamento indevido:* O pipeline de CI executa análises estáticas de arquitetura de código, rejeitando commits que tentem importar dependências de infraestrutura diretamente nas classes centrais de regras de negócio (domínio).

**Pós-condições:** O código-fonte mantém a modularidade estrutural e a testabilidade automatizada.

**Critérios de aceite:**
- [ ] A arquitetura deve seguir o princípio da responsabilidade única (SRP) e inversão de dependência (DIP) de SOLID.
- [ ] O tempo total de execução dos testes de unidade de uma classe deve ser de no máximo 50ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
