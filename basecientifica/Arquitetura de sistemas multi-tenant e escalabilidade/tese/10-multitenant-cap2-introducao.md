# 2 INTRODUÇÃO

## 2.1 Contextualização do Problema

O modelo de Software as a Service (SaaS) multi-tenant consolidou-se como o paradigma dominante para a entrega de aplicativos baseados na nuvem. Nesse modelo, uma única instância lógica da aplicação atende a múltiplos clientes, denominados tenants. Os recursos computacionais, de rede e de armazenamento são compartilhados entre os tenants em diferentes níveis da pilha tecnológica. O principal benefício dessa abordagem reside na eficiência operacional e na redução de custos por meio do compartilhamento de recursos comuns de infraestrutura e manutenção.

No entanto, quando aplicado a plataformas dedicadas à escrita criativa e colaborativa de ficção, a arquitetura multi-tenant enfrenta restrições incomuns e rigorosas. Ao contrário de sistemas empresariais típicos que lidam com dados estruturados padronizados, as plataformas de escrita criativa armazenam manuscritos literários originais e inéditos. Tais dados representam propriedade intelectual sensível, cujo vazamento acidental ou acesso não autorizado por outros tenants traria severas consequências jurídicas, além de perdas comerciais irreparáveis para os autores.

A integração recente de recursos baseados em inteligência artificial generativa, como sugestão de texto e brainstorm contextual, adiciona uma camada extra de complexidade. Modelos de linguagem de grande escala (LLMs) tendem a memorizar partes significativas do seu conjunto de dados de treino ou ajuste fino. Caso um modelo compartilhado seja ajustado finamente de maneira indiscriminada com dados de múltiplos autores, existe o risco inerente de vazamento de passagens inéditas de uma obra a outro tenant através de geração textual. Isso exige técnicas rigorosas de isolamento no treinamento e na inferência dos modelos.

## 2.2 Justificativa e Relevância

Esta pesquisa justifica-se pela necessidade de preencher a lacuna entre as eficiências operacionais de sistemas multi-tenant tradicionais e a necessidade de proteção estrita à propriedade intelectual de autores literários. A maioria das plataformas de coautoria existentes delega o controle de isolamento exclusivamente a camadas lógicas superficiais na aplicação. Isso expõe o ecossistema de criação a falhas de segurança críticas em caso de brechas lógicas no código.

Adicionalmente, com a entrada em vigor de regulamentações de proteção de dados, como a Lei Geral de Proteção de Dados Pessoais (LGPD) no Brasil e o General Data Protection Regulation (GDPR) na União Europeia, o tratamento de manuscritos literários — que frequentemente contêm dados sensíveis do próprio autor e detalhes pessoais incorporados em rascunhos autobiográficos — requer conformidade jurídica estrita, com garantias técnicas de portabilidade e direito ao esquecimento.

## 2.3 Objetivos da Pesquisa

### Objetivo Geral
Propor, implementar e avaliar o framework **CreativeCloud-MT**, uma arquitetura de referência para plataformas SaaS de escrita criativa que integra três níveis configuráveis de isolamento de dados com particionamento seguro de modelos de inteligência artificial generativa.

### Objetivos Específicos
1. Identificar as vulnerabilidades de isolamento e vazamento de dados em sistemas SaaS multi-tenant convencionais voltados a textos literários.
2. Desenvolver mecanismos eficientes de isolamento de banco de dados por tenant (database-per-tenant, schema-per-tenant e row-level security) no PostgreSQL, avaliando seu overhead de desempenho.
3. Propor um pipeline de personalização de IA generativa isolada por meio de adaptadores dinâmicos específicos por tenant (LoRA), mitigando os riscos de vazamento por memorização em modelos compartilhados.
4. Implementar mecanismos de conformidade com a LGPD, focando nas garantias de deleção lógica e física de dados e portabilidade segura.

## 2.4 Pergunta de Pesquisa

De que forma estratégias integradas de isolamento de dados no nível de armazenamento e de particionamento de adaptadores neurais específicos na inferência de LLMs conseguem garantir segurança e privacidade de propriedade intelectual em plataformas SaaS de escrita criativa, mantendo a latência das operações de persistência e inferência compatível com o fluxo de escrita em tempo real?

## 2.5 Hipóteses

*   **H1:** A adoção de políticas PostgreSQL Row-Level Security (RLS) combinada a um esquema de segurança lógica garante isolamento de dados equivalente a bancos de dados fisicamente separados, com um overhead de latência em operações de leitura e escrita inferior a 10%.
*   **H2:** O isolamento de modelos de IA generativa por meio de adaptadores dinâmicos de baixo rank (LoRA) impede o vazamento de dados por memorização cruzada entre tenants, com um acréscimo de tempo de resposta menor que 8% na inferência quando comparado a um modelo estático não personalizado.
*   **H3:** O framework arquitetural proposto assegura a rastreabilidade completa e a deleção física e imediata de dados do tenant, atendendo plenamente aos critérios de conformidade da LGPD.

## 2.6 Estrutura do Documento

Esta tese está organizada em oito capítulos. O Capítulo 3 delineia o referencial teórico e a revisão sistemática de literatura sobre multi-tenancy e privacidade em IA. O Capítulo 4 expõe a metodologia científica e os protocolos experimentais. O Capítulo 5 apresenta a arquitetura detalhada do CreativeCloud-MT. Os Capítulos 6 e 7 contêm a discussão dos resultados e as conclusões gerais, respectivamente. O Capítulo 8 reúne as referências bibliográficas.
