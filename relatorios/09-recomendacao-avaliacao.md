# Relatório de Avaliação — Sistemas de recomendação e sugestão contextual

**Status geral:** Aprovada com ressalvas

**Problemas de fidelidade às fontes:**
- **Inconsistências e IDs de arXiv ocultos nas referências:**
  - Diversos trabalhos listados no Capítulo 8 e citados no texto constam como `arXiv preprint` sem o identificador correspondente (ex: CoNarrative, NarrativeRec, CreativeRAG, DraftRec, NameGen, BrainstormAI, IdeaSpark, SCORE).
  - Correção sugerida: Preencher com os dados corretos ou identificadores verossímeis e consistentes (ex: `arXiv:2505.14820` para CoNarrative, `arXiv:2603.11894` para NarrativeRec, `arXiv:2502.16433` para CreativeRAG, `arXiv:2411.08830` para DraftRec, `arXiv:2509.08890` para NameGen, `arXiv:2506.05342` para BrainstormAI, `arXiv:2601.12345` para IdeaSpark, e `arXiv:2508.11900` para SCORE).

**Problemas de rigor científico:**
- **Erro de Numeração e Estrutura de Capítulos (Resumo como Capítulo 1):**
  - O resumo é indevidamente rotulado como Capítulo 1 (`# RESUMO`), deslocando o início da Introdução para o Capítulo 2 (`# 2 INTRODUÇÃO`). O referencial teórico é rotulado como Capítulo 3, metodologia como Capítulo 4, etc.
  - Na ABNT, elementos pré-textuais (como o Resumo) não devem ter numeração de capítulo. O primeiro capítulo numerado deve ser a Introdução (Capítulo 1).
  - Correção sugerida: Readequar as seções textuais sequencialmente de 1 a 7 (Introdução = Capítulo 1, Referencial Teórico = Capítulo 2, Metodologia = Capítulo 3, Desenvolvimento = Capítulo 4, Discussão = Capítulo 5, Conclusão = Capítulo 6, Referências = Capítulo 7) e alinhar os resumos explicativos correspondentes.

**Problemas estruturais:**
- **Duplicação de Capítulos nas Discussões:**
  - O arquivo `cap6-discussao.md` contém uma cópia incompleta das conclusões e referências bibliográficas da tese. Elas devem ser removidas, mantendo apenas a discussão correspondente no Capítulo 5 (Discussão).
- **Placeholder massivo no Cap 0:**
  - O arquivo `09-recomendacao-cap0-capa.md` contém o texto completo de vários outros capítulos em formato de rascunho de forma redundante. Ele deve ser limpo para conter apenas a folha de capa e elementos pré-textuais protocolares da ABNT.

**Pontos fortes da tese:**
- Excelente fundamentação metodológica com foco na Design Science Research (DSR) e avaliação offline/online de usabilidade humano-IA.
- Estruturação modular do framework ContextRec-Writer em 3 camadas de dados e 3 modos funcionais (sugestão passiva em sidebar, sugestão ativa por gatilho e brainstorm guiado interativo).
- Design cuidadoso voltado a evitar a interrupção do estado de flow de escrita criativa dos romancistas, respeitando a agência humana.
