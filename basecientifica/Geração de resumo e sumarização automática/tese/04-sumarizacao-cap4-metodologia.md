# 4 METODOLOGIA

## 4.1 Abordagem de Pesquisa

A presente tese adota a **Design Science Research (DSR)** como paradigma metodológico central, complementada por uma revisão sistemática de literatura conduzida segundo o protocolo PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses). A DSR é uma metodologia reconhecida no campo da ciência da computação e dos sistemas de informação por visar a produção de artefatos — modelos, frameworks, algoritmos e protótipos — com rigor científico, orientados à resolução de problemas práticos identificados na realidade (HEVNER et al., 2004 *apud* Survey de Sumarização, 2022).

A escolha da DSR justifica-se por três razões fundamentais. Primeira, o problema investigado nesta tese — sumarização hierárquica de romances ficcionais longos em português — é essencialmente um problema de design: demanda a construção de uma solução técnica inovadora que não existe na literatura atual. Segunda, a DSR permite o desenvolvimento iterativo e avaliativo de artefatos, alinhando-se com o objetivo de propor e validar uma arquitetura de pipeline. Terceira, a produção de um artefato (framework HNS-PT) constitui por si uma contribuição científica relevante, além das contribuições teóricas derivadas da revisão sistemática.

## 4.2 Protocolo de Revisão Sistemática (PRISMA)

A revisão sistemática de literatura foi conduzida seguindo o protocolo PRISMA adaptado para ciência da computação, com as seguintes etapas:

### 4.2.1 Critérios de Inclusão

Os estudos foram incluídos quando atenderam simultaneamente aos seguintes critérios:
- (I1) Publicados em conferências, periódicos ou repositórios de pré-prints de reconhecida relevância na área de PLN, aprendizado de máquina ou sistemas de informação.
- (I2) Abordavam diretamente técnicas, frameworks ou datasets relacionados à sumarização automática, sumarização orientada a consultas, ou sumarização de documentos longos.
- (I3) Apresentavam resultados experimentais ou propostas metodológicas concretas e avaliáveis.
- (I4) Publicados entre 2018 e 2026, com exceção de trabalhos seminais anteriores considerados fundacionais pela literatura.

### 4.2.2 Critérios de Exclusão

Os estudos foram excluídos quando:
- (E1) Focavam exclusivamente em sumarização de domínios sem relação com texto narrativo (ex.: sumarização de código-fonte, sumarização de imagens).
- (E2) Não apresentavam acesso ao texto completo ou à avaliação experimental.
- (E3) Eram trabalhos de extensão de outros já incluídos, sem contribuição incremental substancial.

### 4.2.3 Processo de Seleção

Foram identificados 20 estudos que atenderam plenamente aos critérios de inclusão. Os estudos cobrem os anos de 2018 a 2026, com concentração nos anos de 2024-2026, refletindo o dinamismo atual da área com os modelos de linguagem de grande escala.

## 4.3 Método Proposto: Framework HNS-PT

O método proposto nesta tese denomina-se **Hierarchical Narrative Summarizer for Portuguese (HNS-PT)**, um framework modular de sumarização hierárquica adaptado para romances ficcionais em língua portuguesa. O HNS-PT opera em três módulos principais:

**Módulo 1 – Segmentação Narrativa Adaptativa (SNA):** Responsável por segmentar o texto de entrada (romance completo) em unidades semânticas coerentes, utilizando detecção de mudanças de cena, capítulos e quebras de continuidade narrativa como fronteiras naturais. Inspirado na abordagem do DTCRS (2026), o SNA constrói dinamicamente uma árvore de segmentos baseada na complexidade semântica local do texto.

**Módulo 2 – Sumarizador Hierárquico Multi-Nível (SHM):** Processa cada segmento textual em cadeia hierárquica, gerando resumos em três níveis de granularidade: nível de parágrafo/cena (L1), nível de capítulo (L2) e nível de obra completa (L3). O SHM utiliza um modelo de linguagem pequeno ajustado (SLM fine-tuned) sobre o corpus BookSum (Kryściński et al., 2021) e o PublicHearingBR (2024) para português, com mecanismo de atenção contextual entre os resumos de capítulos vizinhos, inspirado no CAHM (2025).

**Módulo 3 – Verificador de Consistência Factual (VCF):** Valida os resumos gerados em relação a um grafo de estados de entidades construído incrementalmente à medida que o texto é processado. O VCF detecta potenciais inconsistências factuais internas ao universo ficcional, como mudanças de localização impossíveis ou menções a eventos que contradizem o estado de entidades registrado.

## 4.4 Critérios de Avaliação e Validação

O framework HNS-PT será avaliado segundo os seguintes critérios:

**Avaliação Automática:**
- **ROUGE-L, ROUGE-1 e ROUGE-2:** Métricas padrão de avaliação de sumarização por sobreposição de n-gramas.
- **BooookScore (Chang et al., 2023):** Métrica específica para avaliação de consistência factual em resumos de romances completos.
- **Tempo de processamento (latência):** Medido em segundos por capítulo e por romance completo.
- **Pegada de memória:** Monitoramento de utilização de RAM e armazenamento em disco.

**Avaliação Qualitativa:**
- Análise de coerência narrativa por leitores humanos (amostra de capítulos resumidos).
- Avaliação da preservação de arcos de personagens (critério derivado do S²tory, 2026).

**Avaliação de Privacidade:**
- Verificação de que nenhuma dado do manuscrito é transmitido a serviços externos durante o processamento.
- Benchmark de desempenho com execução 100% local versus execução via API.

## 4.5 Considerações Éticas e de Privacidade

Dado o contexto de aplicação do sistema — escritores com manuscritos inéditos em processo de criação —, a arquitetura proposta é fundamentalmente comprometida com a privacidade por design. Todos os modelos de linguagem utilizados no HNS-PT são modelos de código aberto executados localmente, sem transmissão de dados a APIs externas, seguindo o princípio local-first de Kleppmann et al. (2019) *apud* sistemas PKM. Essa escolha implica em compensações técnicas (modelos locais tipicamente inferiores aos proprietários em benchmarks gerais), que serão explicitamente quantificadas e discutidas na seção de desenvolvimento.

