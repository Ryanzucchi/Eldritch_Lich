# Relatório de Avaliação — Modelagem de personagens, emoção e arco narrativo

**Status geral:** Aprovada com ressalvas

**Problemas de fidelidade às fontes:**
- **Inconsistência de iniciais de autores nas referências:**
  - **Balestri & Pescatore (2025):** Em cap8, está `BALESTRI, M.`, mas o autor principal é Roberto Balestri (`BALESTRI, R.`).
- **Placeholders de arXiv nas Referências:**
  - Trecho: Vários itens em cap8 constam como `arXiv preprint` sem o código identificador correspondente.
  - Correção sugerida: Inserir os códigos corretos baseados em `referencias.md` (ex: GraphLit: `arXiv:2605.28643`, ArcANE: `arXiv:2606.05553`, AustenAlike: `arXiv:2408.16131`, City of Millions: `arXiv:2502.19612`, Continuous Sentiment: `arXiv:2508.14620`, DialogueRelation: `arXiv:2507.04852`, MARCUS: `arXiv:2510.18201`, Mining Character Networks: `arXiv:1404.5874`, Network Analysis French Literature: `arXiv:2503.13449`, Öhman & Rossi: `arXiv:2406.01021`, Survey Sentiment CLS: `arXiv:2109.12345`).

**Problemas de rigor científico:**
- **Salto de Numeração de Capítulos (Capítulo 2 Ausente):**
  - O Capítulo 1 (Introdução) é seguido diretamente pelo Capítulo 3 (Referencial Teórico), ignorando completamente a existência de um Capítulo 2. Isso representa uma falha grave na lógica e integridade estrutural do documento.
  - Na seção de estrutura do documento (Seção 1.6), o texto reflete esse erro ao dizer: `Os Capítulos 3 e 4 detalham o referencial teórico e a metodologia...`.
  - Correção sugerida: Reordenar os capítulos sequencialmente de 1 a 7 (Introdução = Capítulo 1, Referencial Teórico = Capítulo 2, Metodologia = Capítulo 3, Desenvolvimento = Capítulo 4, Discussão = Capítulo 5, Conclusão = Capítulo 6, Referências = Capítulo 7) e alinhar as referências a eles no texto.

**Problemas estruturais:**
- **Capa Completa:** A capa possui dados preenchidos corretamente (o que é positivo), mas a inconsistência no índice de numeração dos capítulos ao longo do texto deve ser retificada na versão corrigida.

**Pontos fortes da tese:**
- Excelente proposta do framework CMF (Character Modeling Framework) integrando as três dimensões analíticas de modelagem de forma inovadora (Redes Sociais, Arcos Emocionais e Perfis Psicológicos).
- Integração adequada do pipeline Taggus (IberSPEECH 2025) como fundamento de extração para o idioma português.
- Apresentação clara de cenários práticos que dialogam diretamente com o contexto da aplicação (fichas estruturadas de personagens e chatbots interativos).
