# 1 INTRODUÇÃO

## 1.1 Contextualização do Problema

O conceito de Personal Knowledge Management (PKM) refere-se ao conjunto de práticas, técnicas e ferramentas que indivíduos utilizam para coletar, organizar, armazenar, recuperar e aplicar informações relevantes para suas atividades pessoais e profissionais. No contexto da escrita criativa de longa extensão — especialmente romances de fantasia épica, ficção científica e sagas multivolume —, o PKM assume uma dimensão crítica: autores acumulam vastas bases de conhecimento sobre seus universos ficcionais, incluindo milhares de personagens, locais, eventos históricos, sistemas de magia, tecnologias fictícias, línguas inventadas e relações complexas entre todos esses elementos.

Ferramentas tradicionais de PKM como wikis locais (Obsidian, Notion, Roam Research) e processadores de texto permitem a organização manual desse conhecimento, mas carecem de capacidade de recuperação semântica — a capacidade de encontrar informações relevantes a partir de consultas em linguagem natural, e não apenas por palavras-chave exatas. Com o advento dos modelos de linguagem de grande escala (LLMs) e da técnica de Retrieval-Augmented Generation (RAG), tornou-se tecnicamente viável construir sistemas que combinam o armazenamento estruturado de informação com a capacidade de recuperação semântica e geração de respostas contextualizadas.

Contudo, a grande maioria das implementações RAG disponíveis depende de infraestruturas de nuvem — envio de textos para APIs externas (OpenAI, Google, Anthropic) para geração de embeddings e inferência dos LLMs. Para autores com manuscritos inéditos de valor comercial e intelectual significativo, esse modelo é inaceitável: enviar o texto de um romance não publicado para APIs externas expõe a propriedade intelectual do autor a riscos jurídicos e comerciais.

O trabalho de Kleppmann et al. (2019) sobre software local-first estabeleceu os princípios fundamentais que guiam esta pesquisa: dados do usuário devem residir primariamente no dispositivo local; operações locais devem ter prioridade e ser instantâneas; a sincronização com servidores remotos é desejável, mas não obrigatória para o funcionamento básico do sistema.

## 1.2 Justificativa e Relevância

A integração de princípios local-first com técnicas avançadas de RAG e busca vetorial para o domínio específico de universos ficcionais representa uma contribuição original de alta relevância prática e científica. Do ponto de vista prático, escritores de ficção especulativa são um segmento de usuários com necessidades de PKM altamente especializadas e atualmente desatendidas: nenhum sistema existente combina busca semântica sobre bases de conhecimento ficcionais, raciocínio baseado em grafos de relações (GraphRAG) e operação completamente local sem dependência de nuvem.

Do ponto de vista científico, a adaptação de técnicas de RAG para domínios ficcionais apresenta desafios únicos: o "conhecimento" a ser recuperado não é factual (verificável no mundo real), mas internamente consistente dentro do universo ficcional criado pelo autor. Isso exige estratégias de indexação e recuperação que respeitem a lógica interna do universo, em vez de pressupor fidelidade ao mundo real.

## 1.3 Objetivos

**Objetivo Geral:** Propor, desenvolver e avaliar o framework FW-PKM, uma arquitetura local-first de gestão de conhecimento pessoal para universos ficcionais, integrando busca vetorial densa local (SQLite-VSS, HNSW), GraphRAG adaptado para ficção e sincronização offline-first via CRDT.

**Objetivos Específicos:**
1. Revisar sistematicamente os sistemas PKM existentes, frameworks RAG e bancos de dados vetoriais relevantes para o domínio ficcional.
2. Adaptar a arquitetura GraphRAG (Microsoft, 2024) para universos ficcionais, onde as entidades e relações são internamente definidas.
3. Propor uma camada de busca híbrida que combine busca densa (vetores) com busca esparsa (BM25) para maximizar a cobertura semântica.
4. Desenvolver um mecanismo de sincronização offline-first baseado em CRDTs para a base de conhecimento local.
5. Avaliar o desempenho do sistema em termos de latência de recuperação, precisão semântica e escalabilidade para textos de 500.000+ palavras.

## 1.4 Pergunta de Pesquisa

Como arquiteturas local-first de gerenciamento de conhecimento pessoal, integrando busca vetorial densa local (SQLite-VSS, HNSW) com Retrieval-Augmented Generation baseado em grafos, podem suportar a organização, recuperação e consistência de universos ficcionais criados por autores, sem dependência de infraestrutura de nuvem e com garantias de privacidade total dos dados?

## 1.5 Hipóteses

**H1:** É possível construir um sistema RAG completamente local com latência de recuperação inferior a 200ms para bases de conhecimento ficcionais de até 500.000 palavras em hardware commodity (8GB RAM, SSD).

**H2:** A busca híbrida (densa + esparsa BM25) supera tanto a busca puramente densa quanto a puramente esparsa em precisão de recuperação para consultas sobre universos ficcionais.

**H3:** O GraphRAG adapta-se ao domínio ficcional com performance superior ao RAG convencional (chunking simples) para consultas que envolvem múltiplas entidades e relações do universo.

## 1.6 Estrutura do Documento

A tese está organizada em oito capítulos: após esta introdução, o Capítulo 3 apresenta o referencial teórico, o Capítulo 4 descreve a metodologia, o Capítulo 5 apresenta o framework FW-PKM, e os Capítulos 6 e 7 trazem discussão e conclusões.

