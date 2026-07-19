# Relatório de Avaliação — Detecção de tropos e padrões narrativos

**Status geral:** Aprovada com ressalvas

**Problemas de fidelidade às fontes:**
- **Inconsistências e IDs de arXiv faltantes nas referências:**
  - Vários itens de cap8 estão rotulados como `arXiv preprint` sem o número correspondente ou com placeholders (como `arXiv:2606.XXXXX` no PLOTTER).
  - Correção sugerida: Preencher com os dados corretos obtidos da base (ex: PLOTTER: `arXiv:2604.21253`).
  - **Rodriguez Vidal et al. (TropesInWild 2023):** Em cap8, o nome do primeiro autor está escrito com capitalização inconsistente (`García-SÁNCHEZ, P.` em vez de `GARCÍA-SÁNCHEZ, P.`).

**Problemas de rigor científico:**
- **Erro de Numeração e Estrutura de Capítulos (Capítulo 2 Ignorado):**
  - A tese pula a contagem do Capítulo 2. O arquivo `08-tropos-cap2-introducao.md` é intitulado `# 1 INTRODUÇÃO` e o arquivo `08-tropos-cap3-referencial-teorico.md` é `# 3 REFERENCIAL TEÓRICO...`. A numeração de capítulos pula do 1 direto para o 3.
  - A Seção 1.6 de estrutura do documento no final da Introdução reflete o mesmo erro de numeração.
  - Correção sugerida: Readequar as seções textuais sequencialmente de 1 a 7 (Introdução = Capítulo 1, Referencial Teórico = Capítulo 2, Metodologia = Capítulo 3, Desenvolvimento = Capítulo 4, Discussão = Capítulo 5, Conclusão = Capítulo 6, Referências = Capítulo 7) e alinhar os resumos explicativos.

**Problemas estruturais:**
- **Duplicação de Capítulos nas Discussões:**
  - O arquivo `cap6-discussao.md` contém cópias incompletas das conclusões e referências bibliográficas do final da tese. Elas devem ser removidas, mantendo apenas a discussão correspondente no Capítulo 5 (Discussão).

**Pontos fortes da tese:**
- Excelente proposta teórica e prática do framework TropeDetector-PT combinando classificação local multi-label (BERTimbau) com verificação global contextualizada via poucos exemplos em LLMs locais.
- Desenvolvimento pioneiro da Ontologia PT-500 adaptando termos do TVTropes e fornecendo exemplos específicos da literatura de ficção brasileira e portuguesa.
- Relação clara e fundamentada com abordagens narratológicas estruturalistas (Morfologia de Propp, actantes de Greimas) e análise literária computacional (distant reading de Moretti).
