# Relatório de Avaliação — Arquitetura de sistemas multi-tenant e escalabilidade

**Status geral:** Aprovada com ressalvas

**Problemas de fidelidade às fontes:**
- **IDs de arXiv e Venue nas referências:**
  - Padronizar os autores corporativos nas referências do Capítulo 7 para formatos acadêmicos consistentes, utilizando a nomenclatura de `PROJETO <NAME>` ou `GRUPO <NAME>`.

**Problemas de rigor científico:**
- **Erro de Numeração e Estrutura de Capítulos (Resumo como Capítulo 1):**
  - O resumo é classificado como Capítulo 1 (`# RESUMO`), deslocando o início da Introdução para o Capítulo 2 (`# 2 INTRODUÇÃO`).
  - Segundo as normas da ABNT, elementos pré-textuais não devem conter numeração de capítulo. O primeiro capítulo numerado deve ser a Introdução (Capítulo 1).
  - Correção sugerida: Readequar as seções textuais sequencialmente de 1 a 7 (Introdução = Capítulo 1, Referencial Teórico = Capítulo 2, Metodologia = Capítulo 3, Desenvolvimento = Capítulo 4, Discussão = Capítulo 5, Conclusão = Capítulo 6, Referências = Capítulo 7) e alinhar os resumos explicativos correspondentes.

**Problemas estruturais:**
- **Placeholder massivo no Cap 0:**
  - O arquivo `10-multitenant-cap0-capa.md` contém o texto completo de vários outros capítulos em formato redundante. Ele deve ser limpo para conter apenas a folha de capa e elementos pré-textuais protocolares da ABNT.

**Pontos fortes da tese:**
- Excelente proposta e detalhamento prático do framework CreativeCloud-MT com 3 níveis configuráveis de isolamento de banco de dados (RLS, schema-per-tenant, e database-per-tenant).
- Abordagem inovadora no particionamento e cacheamento de modelos generativos na nuvem via Triton Inference Server utilizando adaptadores neurais LoRA isolados por tenant, minimizando o vazamento de propriedade intelectual.
- Fundamentação de conformidade de engenharia de software com as exigências da LGPD e GDPR (deleção física de dados em cascata no PostgreSQL e portabilidade segura).
- Discussão crítica robusta fundamentada em overheads transacionais reais (aumento de apenas 8,3% de latência com RLS e 6,4% de TTFT com LoRA).
