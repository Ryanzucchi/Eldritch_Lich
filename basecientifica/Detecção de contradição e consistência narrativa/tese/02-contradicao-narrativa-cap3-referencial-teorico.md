# 2 REFERENCIAL TEÓRICO

A compreensão mecânica de textos, especialmente de narrativas, constitui um dos desafios mais complexos no campo da Inteligência Artificial. Este capítulo revisa criticamente a literatura basilar e o estado da arte para embasar a proposta de detecção híbrida de contradições.

## 2.1 Fundamentos: Inferência em Linguagem Natural e Contradições

O estudo sistemático das contradições no Processamento de Linguagem Natural ganhou tração significativa com o trabalho seminal de de Marneffe, Rafferty e Manning (2008), que propôs uma taxonomia robusta para categorizar incompatibilidades textuais. Os autores definem a contradição quando sentenças apresentam discordâncias lógicas incontornáveis, dividindo-as em anomalias de negação, discordâncias factuais estruturais e de conhecimento de mundo. Contudo, na literatura ficcional, a contradição exige alinhamento não apenas factual estático, mas dependência temporal.

A Inferência em Linguagem Natural (NLI), que envolve determinar se uma premissa acarreta (entailment), contradiz (contradiction) ou é neutra a uma hipótese (Anônimos, 2025), serve como bloco fundamental para tais algoritmos. O artigo dos Anônimos (2025) propõe um pipeline direto (Straightforward Pipeline) para a extração refinada dessas relações lógicas. Adicionalmente, sistemas como o LegalWiz (Mantravadi et al., 2025) demonstram a eficácia de estruturas multiagentes na identificação de discrepâncias textuais complexas em documentos, onde cada agente focaliza um subconjunto de regras lógicas.

No escopo dos RAG Systems (Retrieval-Augmented Generation), Gokul, Tenneti e Nakkiran (2025) expõem que a injeção de trechos recuperados pode frequentemente causar alucinações contraditórias ao texto previamente gerado. Evitar essas colisões lógicas depende intimamente da manutenção de consistência nos fluxos de inferência. Analogamente, na avaliação de conhecimento no nível de corpus, Semnani et al. (2025) apresentam métodos (CLAIRE, WIKICOLLIDE) eficientes para identificar incongruências documentais através da recuperação direcionada de conflitos.

## 2.2 O Estado da Arte em Entendimento e Raciocínio Narrativo

### Modelagem Temporal e de Entidades
O processamento lógico de ficções extensas demanda mais do que a leitura sequencial. Zhang et al. (2024) introduziram o paradigma "Narrative-of-Thought (NoT)", projetado para aperfeiçoar o raciocínio temporal ao forçar o modelo a instanciar uma representação cronológica intermediária antes da tomada de decisão. Na mesma linha de raciocínio, mas visando mídias multimodais, o projeto TemporalStory (2023) utiliza mecanismos de atenção espaço-temporal para sustentar a coerência narrativa durante a geração visual de histórias.

A centralidade da entidade é reforçada pelo NarrativeTrack Consortium (2026), que delineia que rastrear o estado dinâmico, localização, pertences e conexões sociais de cada personagem é mandatório. Zhu et al. (2023) instigaram a comunidade acadêmica questionando: "Are NLP Models Good at Tracing Thoughts?" A resposta aponta que, enquanto curtas abstrações funcionam, a preservação do encadeamento causal de pensamentos das entidades requer arquiteturas especializadas. A solução reside em estruturas de menor peso operacional, como discutido pelo projeto LiteReason (2025), focado em "Lightweight Latent Reasoning", que permite manter os traços dos estados subjacentes da história de modo menos oneroso do que nos tradicionais *Large Language Models* densos.

### Sistemas de Organização de Longas Narrativas
Diversos autores propuseram sistemas visando a organização de epopeias. O SCORE (Story Coherence and Retrieval Enhancement) (2025) articula um sistema otimizado para IA na geração e controle de histórias. Já o GraphStory (2026) apresenta uma ferramenta pautada inteiramente na edição e colaboração via eventos narrativos. A estruturação orientada a eventos demonstra notável superioridade no rastreio causal em contraste com o simples empilhamento semântico de blocos de texto. O modelo TRACE (Tracking, Retrieving, Auditing for Coherent Epics) de Duan et al. (2026) unifica essas noções em um auditório contínuo de rastreamento para longos épicos.

O aspecto dos dados se modernizou. O ConStory-Bench (Li et al., 2026) fornece a fundação empírica para testes com romances, isolando especificamente "consistency bugs". Da mesma maneira, o benchmark FlawedFictions (Ahuja, Sclar & Tsvetkov, 2025) cria o desafio estrito da identificação autônoma de falhas de roteiro e furos lógicos por agentes de linguagem. Além disso, Brei et al. (2025), com o dataset TUNa, investigaram as discrepâncias narrativas oriundas de "narradores não confiáveis", provando a importância de discernir entre mentira de personagem intencional e falha do autor.

Finalmente, aplicações específicas revelam a versatilidade destas abordagens: Subbiah et al. (2024) avaliaram subtextos em resumos; Hamarsheh et al. (2025) focaram em inconsistências de tradução cruzada no contexto dos textos da Nakba; e Wagner, Keydar e Abend (2025) debruçaram-se filosoficamente sobre o desafio do "Fair Play" (Jogo Justo com o leitor), onde o desafio para a máquina consiste em prever o final com as pistas dadas de forma justa e sem contradição causal. O clássico levantamento de Guo, Schlichtkrull e Vlachos (2022) resguarda as técnicas fundacionais de verificação factual que permeiam as mecânicas dos algoritmos em voga.

## 2.3 Tabela Comparativa de Trabalhos Referência

| Trabalho / Autor | Ano | Foco Principal / Ferramenta | Abordagem Metodológica |
|---|---|---|---|
| de Marneffe et al. | 2008 | Taxonomia fundacional para contradições. | Regras linguísticas. |
| Guo, Schlichtkrull & Vlachos | 2022 | Fact-checking estruturado. | Survey analítico. |
| Zhu et al. | 2023 | Tracing Thoughts. | Avaliação comportamental. |
| TemporalStory | 2023 | Visualização espacial-temporal. | Attention-based CV/NLP. |
| Subbiah et al. | 2024 | Resumo e Leitura de Subtexto. | Avaliação de LLMs. |
| Zhang et al. (NoT) | 2024 | Raciocínio Temporal na Narrativa. | Prompting Estruturado. |
| Ahuja, Sclar & Tsvetkov | 2025 | FlawedFictions: Plot holes. | Benchmark complexo. |
| Gokul, Tenneti & Nakkiran| 2025 | RAG Systems e Contradição. | Retrieval Filtering. |
| Mantravadi et al. | 2025 | LegalWiz (Framework Multi-agente). | LLMs Especializados. |
| Anônimos | 2025 | Pipeline para Entailment e Contradição. | Classificação NLI. |
| Semnani et al. | 2025 | CLAIRE, WIKICOLLIDE. | Conflito Corpus-Level. |
| LiteReason | 2025 | Latent Reasoning para narrativa. | Modelos leves. |
| Wagner, Keydar & Abend | 2025 | Fair Play Narrativo. | Raciocínio lógico-literário. |
| SCORE | 2025 | Retrieval Enhancement. | Coerência Generativa. |
| Brei et al. (TUNa) | 2025 | Narradores não confiáveis. | Classificação Semântica. |
| Hamarsheh et al. | 2025 | Textos da Nakba Cross-Lingual. | Inconsistência multilíngue. |
| Li et al. (ConStory) | 2026 | Consistency Bugs em Romances. | Benchmark extensivo. |
| NarrativeTrack | 2026 | Rastreamento Entidade-cêntrico. | Graph-based reasoning. |
| GraphStory | 2026 | Edição narrativa baseada em eventos. | Grafos interativos. |
| Duan et al. (TRACE) | 2026 | Rastreamento, Auditoria p/ Épicos. | Pipeline Contínuo. |

## 2.4 Análise Crítica e Lacunas

Da análise da literatura, constata-se a progressão cronológica do campo: inicialmente pautada no alinhamento raso (2008), transitou pelo paradigma de raciocínio espacial e estruturado (2022-2023), até alcançar a atual fronteira no mapeamento de narrativas macroscópicas baseadas em agentes (2025-2026). Entretanto, identifica-se uma lacuna severa aplicacional. Sistemas complexos como o TRACE (Duan et al., 2026) e as verificações profundas vistas no FlawedFictions requerem o processamento integral (ou de enormes blocos contextuais) via LLMs gigantes. Esse requerimento de poder computacional torna impeditivo o uso como assistente simultâneo de digitação (as-you-type). A latência de modelos como o GPT-4 para gerar árvores de atenção temporal sobre 100 mil palavras oblitera a experiência de uso.

## 2.5 Taxonomia Proposta: Camada Local vs. Auditoria Global

Com base nas revisões, esta tese advoga uma dicotomia conceitual no tratamento de histórias, estruturando a consistência em duas dimensões. A **Camada Local** responsabiliza-se pela validação do micro-contexto. Ela emprega a arquitetura clássica de Entailment NLI leve (Anônimos, 2025; LiteReason, 2025) focada na cena corrente e na transição iminente entre o parágrafo anterior e o sendo redigido. A **Auditoria Global** se encarrega das amarras estruturais, como propostas no NarrativeTrack (2026) e GraphStory (2026), processando, assincronamente (background task), o registro de estado global dos personagens, inventários, locações, e do sequenciamento de macro-eventos cronológicos em grafos não-bloqueantes. Essa hibridização endereça a lacuna de latência no processo de *real-time writing assistant*.
