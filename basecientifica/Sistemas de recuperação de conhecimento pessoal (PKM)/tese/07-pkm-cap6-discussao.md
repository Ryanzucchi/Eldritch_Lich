# 6 DISCUSSÃO

## 6.1 Análise Crítica dos Resultados Esperados

O framework FW-PKM representa uma contribuição técnica original e integrada que endereça uma lacuna claramente identificada na revisão sistemática: nenhum sistema existente combina busca vetorial local, GraphRAG local e filosofia local-first com adaptação específica para universos ficcionais. A análise crítica a seguir avalia cada hipótese formulada no Capítulo 2 à luz dos resultados esperados e das evidências da literatura.

**Hipótese H1 — Latência <200ms para bases de 500k palavras em hardware commodity:** A hipótese é suportada pelos benchmarks de desempenho do SQLite-VSS (2023) e do HNSW, que demonstram buscas em bases de até 10M vetores com latência inferior a 10ms. Para uma base de 500k palavras (~3.000 chunks de 384 tokens, equivalentes a ~3.000 vetores), a busca HNSW levaria bem abaixo de 1ms. O overhead de latência vem da fusão RRF, da travessia do GUF e da geração de resposta pelo SLM, que juntos somam 150-3000ms dependendo do modelo escolhido. A hipótese de latência <200ms é válida especificamente para a fase de recuperação (sem geração de resposta), e factível para geração em GPU com modelos menores.

**Hipótese H2 — Busca híbrida supera busca puramente densa ou puramente esparsa:** A hipótese é fortemente suportada pela literatura de recuperação de informação. O RRF é uma técnica padrão de fusão de listas de ranking que consistentemente melhora a precisão em relação a qualquer lista individual (Vector DB Survey, 2025). Para o domínio ficcional especificamente, a combinação é essencial: nomes de personagens inventados (ex.: "Yorgrath", "Kaelistra") são capturados com perfeição pela busca BM25 mas mal representados nos embeddings; conceitos semânticos (ex.: "sentimentos de traição", "motivação para vingança") são bem capturados pelos embeddings mas pobremente pelos termos exatos.

**Hipótese H3 — GraphRAG local supera RAG convencional para consultas multi-entidade:** A hipótese é suportada pelos resultados do GraphRAG (Microsoft Research, 2024), que demonstra ganhos de 15-30% em recall para consultas que envolvem múltiplas entidades relacionadas em comparação com RAG baseado em chunking simples. A adaptação local proposta no FW-PKM preserva o princípio fundamental do GraphRAG — navegar o grafo de entidades para expandir o contexto — sem depender das APIs da Microsoft.

## 6.2 Limitações da Proposta

**Limitação 1 — Qualidade do SLM vs. LLMs proprietários:** A diferença de qualidade entre respostas geradas por um SLM de 3B parâmetros e um LLM proprietário como o GPT-4o é real e significativa, especialmente para consultas que requerem raciocínio complexo sobre múltiplas relações. O FW-PKM aceita essa limitação explicitamente em nome da privacidade total, mas é importante que o usuário compreenda o trade-off.

**Limitação 2 — Construção automática do GUF depende do NER literário:** A qualidade do GraphRAG local é diretamente dependente da completude e precisão do Grafo de Universo Ficcional. Por sua vez, o GUF depende do módulo NER literário para português — que apresenta suas próprias limitações em personagens secundários e entidades implícitas (como discutido na Tese 01). Erros e omissões do NER se propagam para o GUF e, consequentemente, para a qualidade da recuperação.

**Limitação 3 — Escalabilidade além de 500k palavras:** Para sagas ficcionais com múltiplos volumes e bases de conhecimento superiores a 2 milhões de palavras, o índice HNSW começa a competir com o limite de RAM em hardware de 8GB. Estratégias de sharding do índice ou compressão de vetores (ex.: quantização de produto — PQ) seriam necessárias, com custo de precisão de recuperação.

**Limitação 4 — Atualização incremental vs. reconstrução completa:** A atualização incremental do índice HNSW a cada novo chunk ingerido é tecnicamente suportada pelo SQLite-VSS, mas pode causar degradação progressiva da qualidade do índice em relação à construção em lote (batch). Uma estratégia de reconstrução periódica em background seria necessária para manutenção de performance em longo prazo.

## 6.3 Comparação com Sistemas da Literatura

Em comparação com os sistemas revisados:

O **RAGdb** (2025) é o trabalho mais próximo do FW-PKM em filosofia local-first e ausência de dependências externas, mas não implementa GraphRAG, não tem adaptação para domínios ficcionais e não inclui busca híbrida.

O **GraphRAG da Microsoft** (2024) oferece a implementação de referência de GraphRAG, mas exige APIs da OpenAI e infraestrutura Azure, sendo incompatível com os requisitos de privacidade do FW-PKM.

O **OntoRAG** (2025) propõe extração de ontologia para RAG, que é conceitualmente similar ao GUF, mas não é local-first e não é adaptado para ficção.

O FW-PKM preenche o espaço de interseção deixado por todos os sistemas revisados: local-first + GraphRAG + adaptação ficcional.

## 6.4 Contribuições para a Área

**Contribuição 1 — Framework FW-PKM:** A primeira arquitetura integrada de PKM local-first com GraphRAG, busca híbrida e adaptação específica para universos ficcionais.

**Contribuição 2 — Adaptação de GraphRAG para ficção (vs. fatos):** A formalização de como o GraphRAG deve ser adaptado quando o "conhecimento" gerenciado é internamente consistente (mas não verificável no mundo real), com implicações para estratégias de indexação, recuperação e verificação de respostas.

**Contribuição 3 — Protocolo de sincronização offline-first para bases de conhecimento ficcionais:** O mecanismo de sincronização CRDT para a base de conhecimento local entre dispositivos do autor, sem servidor central de sincronização.

**Contribuição 4 — Análise comparativa de SLMs para geração de respostas sobre universos ficcionais:** A comparação de modelos Gemma, Qwen e Phi para geração de respostas sobre bases de conhecimento ficcionais em português, fornecendo diretrizes de seleção de modelo para diferentes hardware e casos de uso.
