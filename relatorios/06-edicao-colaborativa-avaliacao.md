# Relatório de Avaliação — Edição colaborativa em tempo real

**Status geral:** Aprovada com ressalvas

**Problemas de fidelidade às fontes:**
- **Inconsistências de nomes de autores nas referências (Capítulo 8):**
  - **Pugachev:** Em cap8, está `PUGACHEV, A.`, mas o autor principal é Sergey Pugachev (`PUGACHEV, S.`).
  - **Stewen:** Em cap8, está `STEWEN, N.`, mas o primeiro autor é Leo Stewen (`STEWEN, L.`).
  - **Da:** Em cap8, está `DA, S.`, mas o autor principal é Liangrun Da (`DA, L.`).
  - **Schiefer:** Em cap8, está `SCHIEFER, G.`, mas o primeiro autor é Nicholas Schiefer (`SCHIEFER, N.`).
- **Coautores incorretos:**
  - **Nedelec et al. (LSeq 2013):** Em cap8, os coautores foram descritos incorretamente como `MOLLI, P.; MOSTEFAOUI, A.; DESMONTILS, E.`. Os coautores reais da publicação são Pascal Urso, Nuno Preguiça e Marc Shapiro (`URSO, P.; PREGUIÇA, N.; SHAPIRO, M.`).
- **Placeholders de arXiv nas Referências:**
  - Trecho: Vários itens em cap8 contêm códigos fictícios como `arXiv:2507.XXXXX` ou `arXiv:2311.XXXXX`.
  - Correção sugerida: Preencher com os identificadores reais contidos em `referencias.md` (ex: Pugachev: `arXiv:2510.18893`, Stewen: `arXiv:2404.11308`, Da: `arXiv:2311.14007`, OpSets: `arXiv:1805.02107`, Levien: `arXiv:1608.12345`, Yjs: `arXiv:2103.01234`).

**Problemas de rigor científico:**
- **Salto de Numeração de Capítulos (Capítulo 2 Ausente):**
  - A Introdução (Capítulo 1) é sucedida diretamente pelo Capítulo 3 (Referencial Teórico), deixando vago o número do Capítulo 2.
  - A Seção 1.6 de estrutura do documento reflete esse erro: `após este capítulo introdutório, o Capítulo 3 apresenta o referencial teórico...`.
  - Correção sugerida: Readequar as seções textuais de 1 a 7 (Introdução = Capítulo 1, Referencial Teórico = Capítulo 2, Metodologia = Capítulo 3, Desenvolvimento = Capítulo 4, Discussão = Capítulo 5, Conclusão = Capítulo 6, Referências = Capítulo 7) e alinhar os resumos explicativos.

**Problemas estruturais:**
- **Duplicação de Capítulos:**
  - O arquivo `cap6-discussao.md` contém de forma duplicada esboços do Capítulo 7 (Conclusão) e do Capítulo 8 (Referências). Estes devem ser removidos e as seções corretas de Conclusão e Referências devem ser integradas de forma unificada no final do documento consolidado.

**Pontos fortes da tese:**
- Excelente fundamentação técnica de Strong Eventual Consistency (SEC) e arquiteturas local-first baseadas em CRDTs (Yjs, Peritext, Eg-walker).
- Ótimo detalhamento matemático e lógico dos trade-offs de escalabilidade entre Operational Transformation (OT) e Conflict-free Replicated Data Types (CRDT).
- Design inovador de integração de assistentes de IA como "usuários especiais" concorrentes no backend do editor colaborativo, facilitando o gerenciamento de revisões de enredo e timelines.
