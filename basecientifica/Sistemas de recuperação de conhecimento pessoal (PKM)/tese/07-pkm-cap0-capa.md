# TESE 07 – SISTEMAS DE RECUPERAÇÃO DE CONHECIMENTO PESSOAL (PKM)

**UNIVERSIDADE FEDERAL DE SISTEMAS DE INFORMAÇÃO E COMPUTAÇÃO**
**PROGRAMA DE PÓS-GRADUAÇÃO EM INFORMÁTICA**

---

# ARQUITETURAS LOCAL-FIRST PARA GESTÃO DE CONHECIMENTO PESSOAL EM UNIVERSOS FICCIONAIS: INTEGRAÇÃO DE BUSCA VETORIAL LOCAL E GRAPHRAG COM PRIVACIDADE TOTAL

**Autor:** Thiago Vasconcelos Almada

**Orientadora:** Profa. Dra. Simone Ribeiro Cardoso

Tese de Doutorado – Universidade Federal de Sistemas de Informação e Computação, Fortaleza, 2026.

---

## RESUMO

**ALMADA, Thiago Vasconcelos.** Arquiteturas local-first para gestão de conhecimento pessoal em universos ficcionais: integração de busca vetorial local e GraphRAG com privacidade total. 2026. 287 f. Tese (Doutorado em Informática).

Os sistemas de gerenciamento de conhecimento pessoal (PKM — Personal Knowledge Management) evoluíram significativamente com a integração de modelos de linguagem e busca vetorial, mas permanecem predominantemente dependentes de infraestruturas de nuvem que comprometem a privacidade dos dados dos usuários. Esta tese investiga como arquiteturas local-first de PKM, integrando busca vetorial densa local (SQLite-VSS, HNSW) com Retrieval-Augmented Generation baseado em grafos (GraphRAG), podem suportar a organização, recuperação e consistência de universos ficcionais criados por autores, sem dependência de infraestrutura de nuvem e com garantias de privacidade total. A investigação fundamenta-se em vinte trabalhos fundamentais sobre PKM, sistemas RAG, bancos de dados vetoriais e filosofia local-first. Propõe-se o framework **FW-PKM (Fictional World PKM)**, uma arquitetura modular que integra busca híbrida (densa + esparsa BM25), GraphRAG para universos ficcionais e sincronização offline-first via CRDT. Os resultados esperados demonstram que arquiteturas locais são viáveis para textos ficcionais de até 500.000 palavras com latência de recuperação inferior a 200ms em hardware commodity, mantendo privacidade total dos manuscritos inéditos.

**Palavras-chave:** PKM. RAG. Busca vetorial. Local-first. Universos ficcionais. Privacidade. GraphRAG.

---

## ABSTRACT

**ALMADA, Thiago Vasconcelos.** Local-first architectures for personal knowledge management in fictional universes: integration of local vector search and GraphRAG with total privacy. 2026. 287 f. Doctoral Thesis.

Personal Knowledge Management (PKM) systems have evolved significantly with the integration of language models and vector search, but remain predominantly dependent on cloud infrastructures that compromise user data privacy. This thesis investigates how local-first PKM architectures, integrating local dense vector search (SQLite-VSS, HNSW) with Graph-based Retrieval-Augmented Generation (GraphRAG), can support the organization, retrieval, and consistency of fictional universes created by authors, without cloud infrastructure dependency and with total privacy guarantees.

**Keywords:** PKM. RAG. Vector search. Local-first. Fictional universes. Privacy. GraphRAG.

