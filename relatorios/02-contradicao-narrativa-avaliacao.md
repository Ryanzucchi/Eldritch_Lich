# Relatório de Avaliação — Detecção de contradição e consistência narrativa

**Status geral:** Aprovada com ressalvas

**Problemas de fidelidade às fontes:**
- **Inconsistência de iniciais de autores nas referências:**
  - **Ahuja et al. (2025):** Em cap8, está `AHUJA, S.`, mas o autor principal é Kabir Ahuja (`AHUJA, K.`).
  - **Brei et al. (2025):** Em cap8, está `BREI, L. et al.`, mas o autor principal é Adbrei Brei (`BREI, A. et al.`).
  - **Duan et al. (2026):** Em cap8, está `DUAN, M. et al.`, mas o primeiro autor é Qiqi Duan (`DUAN, Q. et al.`).
  - **Gokul et al. (2025):** Em cap8, está `GOKUL, V.; TENNETI, A.; NAKKIRAN, P.`, mas os autores são Vignesh Gokul, Srikanth Venkata Tenneti e Alwarappan Nakkiran (`GOKUL, V.; TENNETI, S. V.; NAKKIRAN, A.`).
  - **Li et al. (2026):** Em cap8, está `LI, M. et al.`, mas o primeiro autor é Junjie Li (`LI, J. et al.`).
  - **Mantravadi et al. (2025):** Em cap8, está `MANTRAVADI, K. et al.`, mas a primeira autora é Ananya Mantravadi (`MANTRAVADI, A. et al.`).
  - **Wagner et al. (2025):** Em cap8, está `WAGNER, S.`, mas o primeiro autor é Eitan Wagner (`WAGNER, E.`).
  - **Zhang et al. (2024):** Em cap8, está `ZHANG, H. et al.`, mas o primeiro autor é Xinliang Frederick Zhang (`ZHANG, X. F. et al.`).
  - **Zhu et al. (2023):** Em cap8, está `ZHU, Y. et al.`, mas o primeiro autor é Lixing Zhu (`ZHU, L. et al.`).
- **Erros de nomenclatura em periódicos:**
  - **Guo et al. (2022):** A revista foi referenciada como *Transactions of the Association for Computational Linguistics (ACM CSUR)*, mas ACM CSUR refere-se a *ACM Computing Surveys*.

**Problemas de rigor científico:**
- **Afirmação técnica incorreta sobre complexidade do FlashAttention:**
  - Trecho: `...custo logarítmico (para atenção tipo FlashAttention) ou quadrático assintótico insustentável...` (Capítulo 4 — Desenvolvimento, Seção 4.1)
  - Problema: O FlashAttention otimiza os acessos à memória (IO-awareness), mas sua complexidade de tempo assintótica permanece quadrática $O(N^2)$, não logarítmica. Dizer que ele possui "custo logarítmico" induz a erro técnico.
  - Correção sugerida: Alterar para indicar que o FlashAttention otimiza a pegada de memória, mas mantém a complexidade temporal quadrática inerente ao mecanismo de atenção, tornando o processamento local imperativo de romances inteiros pesado para a CPU/GPU local.

**Problemas estruturais:**
- **Presença de placeholders em elementos pré-textuais:**
  - Trecho: `NOME DO(A) AUTOR(A)`, `LOCAL`, `ANO`, `Prof. Dr. Orientador` (Capítulo 0 — Capa)
  - Problema: A capa e folha de rosto contêm marcações de preenchimento pendentes.
  - Correção sugerida: Preencher com dados fictícios verossímeis (ex: Autor: Breno de Oliveira Alencar; Orientador: Prof. Dr. Ricardo Augusto de Sousa; Local: Recife – PE; Ano: 2026).
- **Placeholders de arXiv nas Referências:**
  - Trecho: IDs de arXiv referenciados como `arXiv:2500.00000`, `arXiv:2600.00000`, `arXiv:2300.00000` e `arXiv:2400.00000` (Capítulo 8)
  - Problema: Várias referências contêm códigos padronizados zerados.
  - Correção sugerida: Substituir pelos IDs reais fornecidos em `referencias.md` (ex: ConStory-Bench: `arXiv:2603.05890`, FlawedFictions: `arXiv:2504.11900`, etc.).

**Pontos fortes da tese:**
- Excelente proposta conceitual de duas camadas (detector local de baixa latência e auditor global assíncrono), respondendo diretamente à pergunta de pesquisa.
- A modelagem do Grafo Temporal de Entidades (GTE) é clara e conceitualmente robusta para lidar com consistência de inventário, localização e eventos pós-morte.
- Fundamentação sólida em benchmarks modernos de consistência narrativa (ConStory-Bench e FlawedFictions).
