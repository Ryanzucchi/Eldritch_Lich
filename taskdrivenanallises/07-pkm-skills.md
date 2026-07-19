# Proposta de Skills — Sistemas de recuperação de conhecimento pessoal (PKM)

Abaixo estão especificadas as skills técnicas extraídas da Tese 07 e de sua base científica correspondente, voltadas à busca semântica local e sistemas de RAG estruturado sobre universos ficcionais.

---

## Skill: `busca-hibrida-local-first`

**Temática de origem:** Sistemas de recuperação de conhecimento pessoal (PKM) (Tese 07)
**Objetivo:** Criar um mecanismo de busca híbrido de alto desempenho rodando localmente (local-first) que combine busca vetorial densa (embeddings) com busca lexical esparsa (BM25) usando Reciprocal Rank Fusion (RRF).
**Quando usar (triggers):** Digitação de buscas na wiki de worldbuilding, painéis de pesquisa rápida de notas no editor de romances, ou checagem de referências do autor.
**Fundamentação científica:** SQLite-VSS (asg017, 2023), MemX (2026), Vector DB Survey (2025), LLM-Vector DB Survey (2024).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Segmentação Semântica Literária:** Fatiar documentos em chunks de 384 tokens de tamanho com sobreposição parcial (overlap) de 10% para manter a coesão semântica de cenas e notas.
2. **Embeddings Locais:** Gerar representações vetoriais de 768 dimensões usando o modelo `multilingual-e5-base` executado localmente via WebAssembly/llama.cpp.
3. **Indexação ANN HNSW:** Indexar os vetores gerados em uma extensão SQLite local (SQLite-VSS) utilizando topologia HNSW com parâmetros $M=16$ e $ef\_construction=200$.
4. **Indexação BM25 Local:** Construir um índice de palavras invertido BM25 baseado em tokenização e stemming para a língua portuguesa.
5. **Fusão RRF (Reciprocal Rank Fusion):** Executar ambas as buscas simultaneamente e fundir os resultados atribuindo um score RRF ponderado com constante $k=60$.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Dependência Exclusiva de Vetores:** Busca vetorial genérica frequentemente falha ao tentar recuperar termos específicos inventados pelo autor (ex: nomes de raças mágicas, magias ou naves espaciais), pois esses termos não possuem representação semântica prévia nos embeddings gerais. O uso concomitante de indexação lexical (BM25) é mandatório para capturar correspondências de termos exatos (Vector DB Survey, 2025).

**Métricas de sucesso sugeridas:**
- Recall@10 em buscas de nomes próprios ficcionais (alvo $\ge 95\%$).
- Latência de busca sobre 500k palavras (alvo $< 200\text{ms}$).

**Requisito(s) do projeto relacionado(s):** RF-24 (busca semântica), RF-28 (busca contextual), RF-126 (busca offline-first).

**Nível de maturidade da técnica:** Consolidada.

---

## Skill: `rag-baseado-em-grafos-pessoais-locais`

**Temática de origem:** Sistemas de recuperação de conhecimento pessoal (PKM) (Tese 07)
**Objetivo:** Implementar um motor de geração de respostas local baseado em grafos (GraphRAG) que utilize uma wiki estruturada para esclarecer dúvidas do autor sobre a consistência de seu universo em tempo real.
**Quando usar (triggers):** Consultas ao assistente de escrita do tipo "quem é casado com quem na família real?", checagem de genealogia no painel lateral ou perguntas de enredo.
**Fundamentação científica:** GraphRAG (Microsoft Research, 2024), EpisTwin (2026), RUVA (2026), OntoRAG (2025).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Modelagem do Grafo de Universo Ficcional (GUF):** Mapear entidades (personagens, locais, clãs, eventos) e relações ( arestas tipadas) em um banco local SQLite com tabelas de grafos (`sqlite-graph`).
2. **Mapeamento Multi-hop de Entidades:** Identificar as entidades chaves citadas na consulta do usuário (lookup) e navegar pelo grafo local recolhendo nós e arestas adjacentes de primeiro e segundo graus.
3. **Compilação de Prompt Baseada em Grafo:** Fundir os chunks de texto originais das notas associadas às entidades adjacentes em um prompt de contexto hierárquico.
4. **Inferência por SLM local:** Processar o prompt contendo a questão e o contexto do grafo em um modelo leve quantizado de 2B a 3B parâmetros (Gemma-2B-IT ou Qwen2.5-3B) local via llama.cpp.
5. **Rastreamento de Proveniência:** Anexar às respostas citações exatas dos documentos fontes de onde os nós foram derivados (RADIANT-LLM, 2026).

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Context-Overflow de Modelos Pequenos:** Evitar travessias de grafos profundas (+3 hops), pois a injeção de dezenas de nós no contexto do prompt estoura a janela de tokens e a capacidade de raciocínio de modelos Small Language Models locais, provocando alucinações (RUVA, 2026). Limitar a expansão a no máximo 1 ou 2 hops.

**Métricas de sucesso sugeridas:**
- Acurácia nas respostas baseadas em relacionamentos do universo (alvo $\ge 90\%$).

**Requisito(s) do projeto relacionado(s):** RF-106 (responder perguntas), RF-158 (responder citando).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `sincronizacao-e-armazenamento-offline-first`

**Temática de origem:** Sistemas de recuperação de conhecimento pessoal (PKM) (Tese 07)
**Objetivo:** Sincronizar bases de dados SQLite contendo índices relacionais, vetoriais e grafos entre múltiplos dispositivos do autor mantendo o funcionamento em tempo real e offline.
**Quando usar (triggers):** Conexão ou desconexão da rede, sincronização em background e suporte multi-dispositivo do escritor.
**Fundamentação científica:** Shapiro et al. (2011), Local-first (Kleppmann et al., 2019), VELO (2024).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Delta-State CRDT Sync:** Implementar sincronização baseada em vetores de estado compartilhando apenas as mutações binárias da base SQLite IndexedDB local, em vez de retransmitir arquivos inteiros de banco de dados.
2. **Last-Write-Wins determinístico:** Adotar clocks lógicos e de tempo físico para resolver colisões de edição simultânea em fichas e notas.
3. **Distribuição de QoS (Busca Híbrida):** Configurar o motor para realizar a busca vetorial localmente (Edge) e apenas rotear o processamento pesado de geração ou buscas em massa para servidores na nuvem caso o hardware local esteja severamente restrito, seguindo o framework VELO (2024).

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Sobrescrita de Banco de Dados Físico:** Nunca substituir o arquivo do banco SQLite local de forma integral durante sincronizações em background, pois isso causará perda irreversível de edições não propagadas do autor. Use sempre transações de replicação incrementais (Kleppmann et al., 2019).

**Métricas de sucesso sugeridas:**
- Taxa de sucesso em sincronizações incrementais sem conflitos manuais (alvo $100\%$).

**Requisito(s) do projeto relacionado(s):** RF-127 (sincronização offline), RF-90 (sincronização de dados).

**Nível de maturidade da técnica:** Consolidada.
