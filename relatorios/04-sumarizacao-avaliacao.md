# Relatório de Avaliação — Geração de resumo e sumarização automática

**Status geral:** Aprovada com ressalvas

**Problemas de fidelidade às fontes:**
- **Inconsistência de autores e placeholders "AUTOR DESCONHECIDO" nas referências:**
  - Em cap8, quase todas as referências constam como `AUTOR DESCONHECIDO` e os IDs de arXiv contêm placeholders `arXiv:XXXX.XXXXX`. Isso afeta gravemente a fidelidade científica e o controle de fontes.
  - Correção: Substituir por seus respectivos autores e IDs reais, conforme listado em `referencias.md`.
  - **Kryściński et al. (2021):** O nome do primeiro autor no cap8 está escrito com erro de inicial/grafia em relação aos metadados (deve ser `KRYŚCIŃSKI, W. et al.`).
  - **Chen et al. (SUMMSCREEN 2021):** Em cap8, está `CHEN, Y. et al.`, mas o primeiro autor é Mingda Chen (`CHEN, M. et al.`).
  - **Syed et al. (2021):** Em cap8, está `SYED, A. Z. et al.`, mas os metadados indicam `Autores do Survey Geral de Sumarização` (ou `SURVEY GERAL DE SUMARIZAÇÃO`).

**Problemas de rigor científico:**
- **Erro de Numeração e Estrutura de Capítulos:**
  - O Capítulo 2 da tese foi rotulado como `# 2. INTRODUÇÃO` e a revisão de literatura como `# 3 REFERENCIAL TEÓRICO...`. O Resumo no Capítulo 1 e a Capa no Capítulo 0 receberam contagens que empurraram a Introdução para o número 2. A Introdução é a primeira seção textual e deve receber a classificação de Capítulo 1.
  - Na descrição da estrutura da tese no final do Capítulo de Introdução (Seção 2.5), pula-se a menção ao "Capítulo 2", dizendo: `O Capítulo 1 introduz o problema... O Capítulo 3 oferece o Referencial Teórico...`. Isso reflete um desalinhamento lógico grave.
  - Correção: Reclassificar a Introdução como Capítulo 1, o Referencial Teórico como Capítulo 2, e os demais capítulos de forma sequencial (Capítulos 1 a 7). Corrigir a descrição da estrutura no final da Introdução para seguir a numeração contínua correspondente.

**Problemas estruturais:**
- **Presença de placeholders em elementos pré-textuais:**
  - Trecho: `NOME DO AUTOR`, `Nome do Orientador`, `CIDADE`, `ANO` (Capítulo 0 — Capa)
  - Problema: A capa e folha de rosto contêm marcações de preenchimento pendentes.
  - Correção sugerida: Preencher com dados fictícios verossímeis (ex: Autor: Thiago Henrique Rodrigues; Orientadora: Prof. Dra. Clarice Moreira Mendes; Local: Campinas – SP; Ano: 2026).

**Pontos fortes da tese:**
- Sólida modelagem da arquitetura HNS-PT (Hierarchical Narrative Summarizer para português), propondo a integração inovadora de um Grafo de Estados de Entidades (GSE) com o pipeline de sumarização recursiva para auditar furos de roteiro nos resumos gerados.
- Excelente discussão e mapeamento de trade-offs operacionais fundamentais (Concisão vs. Fidelidade Factual, Custo vs. Qualidade local-first).
- Revisão bibliográfica completa com taxonomia bem desenhada em 5 categorias metodológicas.
