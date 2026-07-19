# 3 REFERENCIAL TEÓRICO E REVISÃO SISTEMÁTICA

## 3.1 Avaliação e Refinamento de Texto em LLMs

A avaliação automática da qualidade de textos produzidos por modelos generativos é uma das áreas de pesquisa mais ativas em processamento de linguagem natural. Métricas clássicas baseadas em n-gramas, como BLEU e ROUGE, embora úteis para tradução e sumarização, mostraram-se incapazes de avaliar a coesão semântica e a qualidade estilística de textos literários complexos.

Para solucionar essa limitação, surgiram abordagens que utilizam o próprio LLM como avaliador de qualidade de texto. O método **G-Eval** (G-Eval Framework, 2023) estabeleceu uma metodologia robusta que instrui LLMs a avaliarem textos sob múltiplos aspectos de qualidade (coerência, fluidez, relevância), gerando pontuações ponderadas e justificativas detalhadas. A fim de otimizar a qualidade das saídas, o framework **Self-Refine** (Self-Refine Framework, 2023) introduziu o pipeline iterativo de *critique-and-refine*: ao invés de aceitar a primeira geração, o modelo analisa seu próprio texto gerado, formula críticas específicas de qualidade (ex: quebras de tom, repetições lexicais) e reescreve o texto com base no feedback interno de forma contínua até atingir os critérios definidos.

Para garantir que o refinamento estilístico ocorra com consistência, o framework **DOCE** (2025) propõe uma abordagem de descrição de características estilísticas para guiar o alinhamento estilístico de LLMs. Adicionalmente, técnicas baseadas no **In-Context Critique** (2024) comprovam que o fornecimento de exemplos estruturados de crítica e revisão literária melhora a habilidade de revisão interna do modelo.

## 3.2 Datasets e Benchmarks Literários em Computação

A validação de sistemas de IA literária depende da existência de datasets estruturados que representem a prosa ficcional de forma adequada. O dataset **BookSum** (Kryściński et al., 2021) é a referência mais proeminente para tarefas de sumarização e análise de romances, contendo anotações detalhadas de capítulos e estruturas de parágrafos. O dataset **LitBank** (Bamman et al., 2019) estende essa perspectiva fornecendo anotações finas de entidades nomeadas e relações em 100 romances clássicos em inglês.

A transposição dessas iniciativas para contextos de avaliação de qualidade é exemplificada pelo benchmark **LIRE** (2025), focado em avaliar a fluidez literária e a preservação de nuances poéticas em traduções automáticas, e pelo benchmark **LiteraryBench** (2026), voltado especificamente para testar o limite de contexto e a coerência de LLMs em romances de longa extensão.

No contexto de suporte cooperativo, a pesquisa empírica do **Story-theme** (2025) investiga como a modelagem conjunta de temas e obstáculos de enredo através de grafos de conhecimento e teoria literária formal guia LLMs a produzirem histórias com estruturas de conflito e resolução coerentes.

O panorama de estudos sobre o impacto da IA na autoria e fluxo de trabalho criativo é delineado por pesquisas como **Human-AI Co-creation Patterns** (2025) e **Creative Writing Support Systems** (2024), que analisam os gargalos cognitivos enfrentados por escritores humanos ao utilizarem prompts interativos durante a redação.

## 3.3 Tabela Comparativa dos Trabalhos Revisados

A tabela a seguir apresenta os 20 trabalhos centrais que fundamentam a revisão sistemática de literatura desta tese:

| # | Autor / Trabalho | Ano | Tema Principal | Escrita Criativa | Método de Avaliação | Escopo Linguístico / Dataset |
|---|---|---|---|---|---|---|
| 1 | G-Eval Framework | 2023 | Avaliação de geração | Não | LLM como avaliador (G-Eval) | Inglês genérico |
| 2 | Self-Refine Framework | 2023 | Refinamento iterativo | Parcial | Feedback interno iterativo | datasets NLP gerais |
| 3 | DOCE Framework | 2025 | Alinhamento estilístico | Sim | Avaliação por vetor de estilo | datasets literários |
| 4 | In-Context Critique | 2024 | Engenharia de prompts | Sim | Prompting few-shot de crítica | Inglês |
| 5 | BookSum | 2021 | Sumarização literária | Sim | Benchmarking com ROUGE | Romances em inglês |
| 6 | LitBank | 2019 | NLP literário | Sim | Extração de entidades | Inglês clássico |
| 7 | LIRE Benchmark | 2025 | Tradução poética | Sim | Avaliação com métricas literárias | Multilíngue (inclui PT) |
| 8 | LiteraryBench | 2026 | Contexto de LLMs | Sim | Testes de consistência longa | Romances longos |
| 9 | Story-theme | 2025 | Teoria Literária & IA | Sim | Alinhamento estrutural por grafos | Inglês |
| 10 | Human-AI Co-creation | 2025 | Fatores humanos | Sim | Estudo qualitativo com escritores | Inglês |
| 11 | Creative Writing Support | 2024 | Interfaces criativas | Sim | Protocolo de pensamento em voz alta | Misto |
| 12 | Style transfer in NLP | 2024 | Transferência de estilo | Parcial | Classificadores de estilo | datasets gerais |
| 13 | Evaluation of Literary Translation | 2025 | Tradução literária | Sim | Métricas humanas e automáticas | Multilíngue |
| 14 | Automatic Fiction Writing | 2024 | Geração autônoma | Sim | Avaliação por juízes cegos | Inglês |
| 15 | LLMs as Editors | 2025 | Edição de texto | Sim | Comparação com editores humanos | Inglês |
| 16 | Cognitive-literary NLP | 2024 | Linguística computacional | Sim | Análise de complexidade cognitiva | Português e Espanhol |
| 17 | Tone Consistency in LLMs | 2025 | Consistência de tom | Não | Métricas de distância estilística | Inglês |
| 18 | Portuguese Literary NLP | 2025 | Corpus de literatura PT | Sim | Extração de características | Língua Portuguesa |
| 19 | Quality Estimation in Text | 2024 | Estimação de qualidade | Parcial | Métricas sem referência (QE) | Multilíngue |
| 20 | Generative AI and Creativity | 2025 | Impacto social | Sim | Análise de novidade semântica | Inglês |

## 3.4 Lacunas na Literatura de IA Generativa Literária

1.  **Carência de Adaptação para o Português:** A grande maioria das métricas e datasets de avaliação foca estritamente em prosa em língua inglesa. A transposição simples dessas ferramentas para o português falha em capturar as especificidades estilísticas do português (como preferência por construções sintáticas mais fluidas, riqueza morfológica de verbos e estrutura de ritmo da frase).
2.  **Métricas Baseadas Apenas em LLM:** Avaliadores puramente neurais baseados em LLMs (como G-Eval) agem como "caixas-pretas" e sofrem de viés de otimismo (LLMs tendem a avaliar textos gerados por eles mesmos com notas mais altas). Há falta de sistemas híbridos que combinem métricas linguísticas matemáticas explícitas com a avaliação interpretativa do LLM.
3.  **Foco em Geração, Não em Edição Coesiva:** As pesquisas literárias de IA concentram-se em gerar histórias completas a partir do zero, negligenciando a tarefa de suporte interativo à edição, onde o texto deve se ajustar a uma coesão estilística preestabelecida de maneira incremental e não-intrusiva.
