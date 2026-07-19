# Relatório de Avaliação — Grafos de conhecimento e visualização de relações

**Status geral:** Aprovada com ressalvas

**Problemas de fidelidade às fontes:**
- **Inconsistência de iniciais de autores nas referências:**
  - **Chen et al. (TPAR 2024):** Em cap8, está `CHEN, L.`, mas o autor principal é Kai Chen (`CHEN, K.`).
  - **Chen et al. (Joint Extraction 2025):** Em cap8, está `CHEN, W.`, mas o autor principal é G. Chen (`CHEN, G.`).
  - **Han & Wang (2024):** Em cap8, está `HAN, X.; WANG, Y.`, mas os autores são S. Han e X. Wang (`HAN, S.; WANG, X.`).
  - **KnoBuilder (2025):** Em cap8, o autor está referenciado como `KNOBUILDER`, mas os autores reais são Yuxiang Luo, Chen Wang, Nan Tang e Yuyu Luo (`LUO, Y. et al.`).
  - **Liu et al. (RLEE 2025):** Em cap8, está `LIU, M. et al.`, mas o primeiro autor é Longzhou Liu (`LIU, L. et al.`).

**Problemas de rigor científico:**
- **Atribuição incorreta na numeração de Capítulos:**
  - Trecho: `# CAPÍTULO 2 - INTRODUÇÃO` (Capítulo 2)
  - Problema: Pela norma ABNT, a Introdução é o primeiro elemento textual da tese e deve ser numerada como Capítulo 1. A numeração atual conta o Resumo como Capítulo 1, o que é conceitualmente e estruturalmente incorreto.
  - Correção sugerida: Alterar para `# 1 INTRODUÇÃO` e reordenar de forma sequencial os demais capítulos (Capítulo 2: Referencial Teórico, Capítulo 3: Metodologia, Capítulo 4: Desenvolvimento, Capítulo 5: Discussão, Capítulo 6: Conclusão, Capítulo 7: Referências Bibliográficas).

**Problemas estruturais:**
- **Presença de placeholders em elementos pré-textuais:**
  - Trecho: `NOME DO ALUNO`, `[Nome do Orientador]`, `[Área de Concentração]`, `LOCAL`, `ANO` (Capítulo 0 — Capa)
  - Problema: A capa e folha de rosto contêm marcações de preenchimento pendentes.
  - Correção sugerida: Preencher com dados fictícios verossímeis (ex: Autor: Douglas Santos Silva; Orientador: Prof. Dr. André Luiz de Souza; Área de Concentração: Humanidades Digitais e Engenharia de Software; Local: Porto Alegre – RS; Ano: 2026).
- **Placeholders de arXiv nas Referências:**
  - Trecho: IDs de arXiv referenciados como `arXiv:2603.XXXXX` (CTiKG), `arXiv:2010.XXXXX` (Evolutionary Knowledge), `arXiv:2602.XXXXX` (GraphStory), `arXiv:2604.XXXXX` (MAGE), `arXiv:2601.XXXXX` (Narrative World Model), `arXiv:2605.XXXXX` (PLOTTER), `arXiv:2511.XXXXX` (SCORE), `arXiv:2508.XXXXX` (Story-Theme-Obstacle) (Capítulo 8)
  - Problema: Várias referências contêm códigos padronizados zerados.
  - Correção sugerida: Substituir pelos IDs reais fornecidos em `referencias.md` (ex: CTiKG: `arXiv:2605.15904`, Evolutionary Knowledge: `arXiv:2004.09974`, etc.).

**Pontos fortes da tese:**
- Sólido delineamento da arquitetura FUKG (Fictional Universe Knowledge Graph) e modelagem ontológica que atende diretamente aos requisitos de worldbuilding dinâmico e rastreamento de plot structures.
- Excelente fundamentação e aplicação de diretrizes de usabilidade de grafos (GuidelineExplorer e Graph Usability Group), propondo a estratégia de *time-slicing* para mitigar a sobrecarga visual (hairball effect).
- Revisão abrangente integrando raciocínio em grafos temporais (TPAR, RLEE, Know-Evolve).
