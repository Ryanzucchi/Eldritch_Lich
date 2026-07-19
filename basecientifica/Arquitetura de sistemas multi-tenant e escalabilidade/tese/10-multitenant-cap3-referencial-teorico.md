# 3 REFERENCIAL TEÓRICO E REVISÃO SISTEMÁTICA

## 3.1 Fundamentos de Arquitetura Multi-tenant e Isolamento de Dados

A computação em nuvem baseada em Software as a Service (SaaS) exige a implementação de estratégias de isolamento de dados eficazes. Conforme o *SaaS Isolation Survey* (2023), existem três padrões clássicos de particionamento de dados em bancos de dados relacionais:

1.  **Shared Database, Shared Schema (Row-Level Security):** Caracteriza-se por armazenar os dados de todos os tenants na mesma tabela, diferenciados apenas por uma chave estrangeira identificadora (ex: `tenant_id`). Embora ofereça o menor custo operacional e máxima densidade de dados, o risco de segurança é elevado, pois falhas lógicas na aplicação podem vazar dados entre tenants. A mitigação desse risco é efetuada por meio do PostgreSQL Row-Level Security (RLS) (RLS Policy Patterns, 2024), que delega a filtragem das linhas diretamente ao motor do banco de dados com base na sessão conectada.
2.  **Shared Database, Separate Schema (Schema-per-tenant):** Cada tenant possui um esquema de tabelas próprio dentro do mesmo banco lógico. Esse modelo fornece isolamento lógico intermediário e simplifica tarefas de backup individuais, embora o crescimento do número de schemas possa sobrecarregar o dicionário de dados do SGDB.
3.  **Separate Database (Database-per-tenant):** Cada tenant possui um banco de dados independente e isolado, por vezes alocado em instâncias de hardware distintas. Esse padrão fornece o isolamento físico máximo exigido por grandes corporações e editoras com rígidos requisitos contratuais, mas eleva o custo de infraestrutura e a complexidade de manutenção global do sistema.

Para sistemas modernos em contêineres, o isolamento computacional é garantido na camada de infraestrutura via Kubernetes (*Kubernetes Tenant Isolation*, 2025), utilizando recursos como namespaces isolados, políticas de rede (Network Policies) e restrições de limites de CPU e memória por cliente para evitar o problema do "vizinho barulhento" (noisy neighbor).

## 3.2 IA Generativa e Riscos de Vazamento de Privacidade

A adoção acelerada de LLMs integrados a sistemas SaaS redefiniu as preocupações de segurança. Estudos sobre privacidade em modelos de linguagem (*LLM Privacy Leakage*, 2024) comprovam que redes neurais profundas memorizam informações raras contidas nos seus dados de treino. Em plataformas de escrita criativa, se um escritor redige uma obra contendo elementos proprietários e o modelo de IA do sistema passa por ajuste fino contínuo com esses dados, trechos dessa obra podem vir a ser sugeridos involuntariamente para outros usuários concorrentes (*Memorization in LLMs*, 2023).

A aplicação de técnicas de *Differential Privacy* (DP) no treinamento com descida de gradiente estocástico privado (DP-SGD) adiciona ruído matemático aos gradientes, garantindo formalmente que a presença ou ausência de uma sequência de texto específica nos dados de treino não alterará significativamente a saída do modelo (*DP in ML Survey*, 2024).

Adicionalmente, abordagens de *Federated Learning* adaptadas para NLP (*Federated NLP*, 2025) propõem que o treinamento ocorra localmente nos dispositivos dos usuários, consolidando de forma centralizada apenas os pesos matemáticos do modelo, sem enviar os textos originais à nuvem. Contudo, em plataformas baseadas na nuvem, o uso de adaptadores baseados em *Low-Rank Adaptation* (LoRA) específicos por cliente (*Multi-tenant LoRA*, 2025) emergiu como a solução mais eficiente: o modelo base permanece congelado e inalterado, enquanto adaptadores LoRA leves e criptografados de cada tenant são carregados dinamicamente no momento da inferência, eliminando os riscos de memorização cruzada.

## 3.3 Tabela Comparativa dos Trabalhos Revisados

A tabela abaixo sintetiza os 20 trabalhos fundamentais identificados na revisão sistemática de literatura:

| # | Autor / Trabalho | Ano | Foco Principal | Estratégia de Isolamento | IA / Aprendizado de Máquina | Aspectos Legais (LGPD/GDPR) |
|---|---|---|---|---|---|---|
| 1 | SaaS Isolation Survey | 2023 | Padrões de isolamento | Row-level, Schema, Database | Não | Não |
| 2 | RLS Policy Patterns | 2024 | Segurança em SGBD | PostgreSQL Row-Level Security | Não | Sim |
| 3 | Kubernetes Tenant Isolation | 2025 | Infraestrutura | Namespaces, Network Policies | Não | Não |
| 4 | Serverless Multi-tenant | 2023 | Arquitetura de microsserviços | Isolamento lógico em FaaS | Não | Não |
| 5 | LLM Privacy Leakage | 2024 | Riscos de LLMs | Não aplicável | Memorização em Transformers | Sim |
| 6 | Memorization in LLMs | 2023 | Análise de vazamento | Não aplicável | Extração de dados de LLMs | Sim |
| 7 | DP in ML Survey | 2024 | Algoritmos de privacidade | Ruído em gradientes (DP-SGD) | Treinamento diferencial | Sim |
| 8 | Federated NLP | 2025 | NLP Colaborativo | Treinamento descentralizado | Federated Learning em NLP | Sim |
| 9 | Multi-tenant LoRA | 2025 | Ajuste fino em SaaS | Adaptadores de baixo rank por tenant | Carregamento dinâmico de LoRA | Sim |
| 10 | HTAP for SaaS | 2025 | Bancos de dados distribuídos | Particionamento híbrido transação/análise | Não | Não |
| 11 | PostgreSQL Citus | 2024 | Escalabilidade de dados | Sharding horizontal de banco de dados | Não | Não |
| 12 | Cloud Cost Optimization | 2025 | Otimização financeira | Alocação dinâmica de recursos | Alocação com preditores de IA | Não |
| 13 | Edge Computing Multi-tenant | 2025 | Processamento na borda | Computação isolada na borda | Execução local de LLMs | Sim |
| 14 | GDPR Multi-tenant | 2023 | Legislação de dados | Rastreabilidade e apagamento físico | Não | Sim (GDPR) |
| 15 | LGPD Compliance SaaS | 2024 | Legislação nacional | Direito à portabilidade e exclusão | Não | Sim (LGPD) |
| 16 | Zero Trust Architecture | 2024 | Segurança corporativa | Autenticação contínua, isolamento | Não | Sim |
| 17 | API Gateway Multi-tenant | 2025 | Roteamento de dados | Roteamento baseado em token | Rate limiting de chamadas de IA | Não |
| 18 | Tenant Onboarding Automation | 2024 | Provisionamento | Automação de infraestrutura por tenant | Não | Não |
| 19 | SaaS Pricing Models | 2023 | Sustentabilidade financeira | Precificação orientada a recursos | Não | Não |
| 20 | Creative Writing SaaS UX | 2025 | Engenharia de requisitos | Usabilidade de recursos de coautoria | Usabilidade de recursos de IA | Não |

## 3.4 Análise Crítica e Lacunas na Literatura

A análise sistemática da literatura aponta para as seguintes limitações do estado da arte:

1.  **Fragmentação entre Isolamento de Dados e IA:** Os trabalhos de sistemas distribuídos concentram-se no isolamento lógico e físico das bases de dados, ignorando os novos vetores de ataque decorrentes do compartilhamento de modelos de inteligência artificial generativa. Por outro lado, as pesquisas de privacidade em redes neurais desconsideram as limitações de infraestrutura física de plataformas SaaS, propondo treinamentos caros e impraticáveis no mundo real.
2.  **Falta de Foco no Domínio Literário:** O processamento de manuscritos literários, protegidos por direitos autorais e regras rígidas de sigilo de mercado editorial, exige soluções de segurança de nível bancário que não são encontradas nas plataformas SaaS genéricas focadas em RLS rudimentar.
3.  **Conformidade Jurídica Abstrata:** Embora o direito ao esquecimento e a portabilidade sejam previstos pela LGPD e pelo GDPR, faltam guias arquiteturais que mapeiem tais direitos em comandos e rotinas automáticas de exclusão definitiva em bancos de dados relacionais e vetoriais distribuídos.
