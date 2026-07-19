# 6 DISCUSSÃO E ANÁLISE DOS RESULTADOS

## 6.1 Análise de Desempenho e Overhead de Isolamento

Os testes experimentais conduzidos conforme o protocolo detalhado no Capítulo 4 geraram resultados consistentes sobre os trade-offs entre nível de isolamento, custos de infraestrutura e latência geral da plataforma.

### 6.1.1 Overhead do Banco de Dados com RLS (Nível 1)
A aplicação de políticas de Row-Level Security no PostgreSQL 16 (Nível 1) introduziu um overhead mínimo nas operações transacionais de escrita e leitura de parágrafos. Sob carga simulada de 100 usuários concorrentes ativos por nó, a latência de persistência de texto apresentou as seguintes variações:

*   **Sem RLS (Tabela não isolada):** Latência média de 48ms, com percentil p95 de 95ms.
*   **Com RLS ativo:** Latência média de 52ms, com percentil p95 de 102ms.

Isso representa um aumento de latência de aproximadamente **8,3%**, confirmando a hipótese **H1** de que o overhead do RLS permaneceria abaixo do limiar de 10%. Esse acréscimo de tempo é imperceptível para o autor durante o fluxo de digitação em tempo real. A segurança lógica oferecida pelo RLS no motor do banco impede que bugs de injeção na aplicação exponham linhas de outros tenants.

### 6.1.2 Desempenho do Isolamento de Esquemas e Bancos Independentes (Níveis 2 e 3)
A abordagem de esquemas isolados por tenant (Nível 2) eliminou a necessidade de checagem de RLS nas linhas, mas introduziu uma latência média de conexão ligeiramente superior durante o *cold start* das conexões (tempo para alterar o `search_path` de conexão em pools não otimizados). No entanto, em pools de conexões persistentes, o p95 manteve-se estável em 98ms.

O Nível 3 (instâncias dedicadas) ofereceu o melhor desempenho transacional puro devido à ausência total de concorrência por recursos físicos com outros tenants. Contudo, essa abordagem elevou linearmente o custo de infraestrutura de nuvem, tornando-se economicamente inviável para planos de assinatura de baixo custo.

## 6.2 Avaliação da Inferência de IA com Adapters LoRA Dinâmicos

A análise do tempo de inferência do Llama-3-8B com adaptadores dinâmicos carregados via Triton Inference Server forneceu dados cruciais para a validação da hipótese **H2**:

*   **Inferência em Modelo Base Estático (Sem LoRA):** O tempo até o primeiro token gerado (time-to-first-token - TTFT) foi de 280ms de média.
*   **Inferência com Adaptador LoRA Dinâmico por Tenant:** O TTFT subiu para 298ms de média.

Esse comportamento representa um acréscimo de latência de apenas **6,4%**, situando-se com folga abaixo dos 8% postulados na hipótese **H2**. O Triton gerencia o cache e mapeamento na memória VRAM da GPU com eficácia. Uma vez carregado o adaptador de 40 MB na GPU para uma sessão ativa, as chamadas subsequentes têm custo de comutação desprezível (<2ms).

Esse resultado comprova que o particionamento de adaptadores LoRA soluciona o risco de segurança de memorização cruzada em modelos de linguagem compartilhados na nuvem sem prejudicar o tempo de resposta do assistente de escrita criativa.

## 6.3 Avaliação de Conformidade LGPD

A arquitetura do CreativeCloud-MT demonstrou ser altamente compatível com os princípios regulatórios de proteção de dados (LGPD e GDPR), validando a hipótese **H3**:

1.  **Garantia de Apagamento Eficaz:** O uso de rotinas de deleção física (`cascade hard-delete`) combinadas ao comando PostgreSQL `VACUUM` provou remover os dados permanentemente dos arquivos físicos em disco, ao contrário de sistemas SaaS comerciais que apenas alteram uma flag de deleção lógica.
2.  **Portabilidade do Tenant:** O mecanismo de exportação via API gerou arquivos compactados padronizados contendo todos os dados e metadados estruturados das obras, garantindo portabilidade total do usuário.
3.  **Segurança do Consentimento:** A persistência à prova de adulteração do histórico de consentimento assegura a rastreabilidade exigida em auditorias de conformidade legais.

## 6.4 Limitações e Desafios Observados

*   **Consumo de VRAM com Múltiplos Adapters Concorrentes:** Embora o Triton gerencie o cache de adaptadores LoRA com eficácia, um pico extremo de usuários concorrentes de diferentes tenants (ex: acima de 500 adaptadores distintos ativos na mesma GPU) pode saturar a memória VRAM, forçando a desalocação e recarga frequente de adaptadores do S3 para a GPU. Isso pode elevar temporariamente a latência TTFT para até 1,2s.
*   **Complexidade no Gerenciamento de Backups no Nível 2:** A manutenção e a recuperação de backups individuais em uma arquitetura de múltiplos esquemas compartilhados (Nível 2) é consideravelmente mais complexa do que no modelo de bancos separados (Nível 3).
*   **Limitação do SQLite-VSS para Exclusão Rápida:** A remoção física imediata de embeddings vetoriais locais baseados em SQLite-VSS pode ser lenta em bases de dados muito grandes devido aos custos de reindexação interna da árvore HNSW local.
