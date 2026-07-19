# 2. INTRODUÇÃO

## 2.1 O Problema da Sumarização de Textos Ficcionais Longos em Português

A expansão exponencial de conteúdos textuais gerados digitalmente fomentou um avanço significativo nas tecnologias de Processamento de Linguagem Natural (PLN), com destaque para a Sumarização Automática de Textos. A sumarização automática visa destilar as informações essenciais de um documento, produzindo uma versão condensada que preserve o significado original (SYED et al., 2021). Enquanto o estado da arte tem demonstrado eficácia notável em documentos curtos, como artigos de notícias ou resenhas de produtos, a sumarização de documentos longos — em particular textos narrativos ficcionais de longa extensão, como romances — permanece um dos desafios mais proeminentes e em aberto na inteligência artificial contemporânea (SURVEY DE SUMARIZAÇÃO, 2022).

A complexidade inerente à sumarização de romances reside na natureza orgânica da narrativa. Diferente de textos jornalísticos ou acadêmicos, que frequentemente seguem uma estrutura piramidal invertida ou seções lógicas independentes, textos literários possuem arcos narrativos contínuos, desenvolvimento de personagens ao longo de dezenas de milhares de palavras e dependências semânticas de longo alcance. Além disso, a literatura ficcional introduz a necessidade de manter a coerência causal e temporal do enredo, evitando alucinações que possam corromper os fatos do "universo ficcional" construído pelo autor (CHANG et al., 2023; KRYŚCIŃSKI et al., 2021).

As arquiteturas tradicionais de aprendizado profundo, como as baseadas no modelo *Transformer*, operam com restrições rígidas no tamanho da janela de contexto. O processamento integral de uma obra de 70.000 a mais de 100.000 palavras (característica comum em romances) excede exponencialmente a capacidade de memória e processamento da maioria dos modelos viáveis comercialmente (ASLD, 2024). Estratégias de sumarização por fragmentação e recombinação (frequentemente denominadas recursivas ou hierárquicas) têm sido propostas para contornar esta limitação. No entanto, abordagens ingênuas de fragmentação sofrem de "perda de contexto global", resultando em resumos desconexos que falham em capturar o clímax ou arcos entrelaçados (CAHM, 2025; NEXUSSUM, 2024).

Ademais, a literatura científica demonstra uma escassez crítica de recursos e pesquisas voltadas à língua portuguesa. Enquanto a maioria dos avanços metodológicos, conjuntos de dados e avaliações empíricas foca na língua inglesa — como evidenciado pelos datasets BookSum (KRYŚCIŃSKI et al., 2021) e SummScreen (CHEN et al., 2021) —, esforços para adaptar tais tecnologias para o português do Brasil são emergentes e frequentemente carecem de bases consolidadas de narrativas ficcionais, apoiando-se predominantemente em documentos legais ou governamentais (PUBLICHEARINGBR, 2024).

Portanto, o problema que motiva esta tese é a inadequação das atuais arquiteturas de sumarização hierárquica na preservação da fidelidade dos elementos narrativos de longa extensão e no mapeamento de dependências globais sem a explosão do custo computacional, especialmente quando aplicadas ao contexto literário na língua portuguesa. Tal deficiência afeta diretamente o desenvolvimento de sistemas de suporte à criatividade, organização bibliográfica e gerenciamento de projetos literários, onde usuários demandam extração precisa de sinopses e interações focadas em partes específicas do texto ficcional.

## 2.2 Objetivos e Hipóteses

**Objetivo Geral:**
Investigar, propor e validar uma arquitetura de sumarização hierárquica recursiva, denominada *Hierarchical Narrative Summarizer para português* (HNS-PT), capaz de processar romances de longa extensão em língua portuguesa para gerar resumos consistentes em múltiplos níveis de granularidade, assegurando a fidelidade aos fatos ficcionais e otimizando o custo computacional para permitir seu emprego em sistemas ativos.

**Objetivos Específicos:**
1. Mapear o estado da arte e as lacunas nas técnicas de sumarização de narrativas extensas e na avaliação de modelos de linguagem para o idioma português.
2. Projetar um modelo de particionamento e abstração guiada por planos (PLAN-GUIDED SUMMARIZATION, 2025) e grafos dinâmicos de entidades, adaptado para manter a coesão semântica através dos limites da janela de contexto.
3. Desenvolver o artefato HNS-PT de modo a permitir sumarizações sob demanda em nível de parágrafo, capítulo e obra completa.
4. Avaliar a abordagem proposta qualitativa e quantitativamente perante o estado da arte, utilizando métricas estruturadas como BooookScore, métodos de análise factual e medidas clássicas como ROUGE, mensurando adicionalmente o custo computacional.
5. Empregar o artefato em um cenário de aplicação de um sistema web focado em organização de arquivos, brainstorm e histórias literárias.

**Hipóteses:**
* **Hipótese 1 (H1):** A incorporação de um módulo de extração e rastreamento dinâmico de entidades ficcionais durante o processo de sumarização hierárquica recursiva reduz estatisticamente o índice de alucinação e perda factual em textos literários extensos, comparado a abordagens hierárquicas baseadas puramente em densidade de texto (DTCRS, 2026; CAHM, 2025).
* **Hipótese 2 (H2):** A estruturação guiada por planos (*plan-guided*) em níveis granulares menores (parágrafos e cenas) eleva a consistência narrativa das sinopses agregadas (nível do capítulo e obra), sem causar um aumento superlinear na latência e no custo de inferência, viabilizando o uso em aplicações em tempo real.
* **Hipótese 3 (H3):** A adequação de métricas baseadas em grafos e alinhamento de *role-playing* para o português do Brasil resulta em avaliações de resumos de obras de ficção com maior correlação humana do que métricas lexicais (ROUGE), provendo uma taxonomia de avaliação superior.

## 2.3 Pergunta de Pesquisa

Em consonância com as hipóteses formuladas e a contextualização do problema, a presente pesquisa orienta-se pela seguinte questão central:

*Como estratégias hierárquicas de sumarização recursiva podem ser adaptadas para processar romances de longa extensão em língua portuguesa, gerando sinopses coerentes em múltiplos níveis de granularidade (parágrafo, capítulo e obra completa) sem perda de fidelidade factual aos fatos do universo ficcional, e com custo computacional compatível com sistemas de uso ativo?*

## 2.4 Delimitação e Justificativa

A sumarização de documentos longos é um espectro vasto. O escopo desta tese restringe-se primariamente a textos narrativos ficcionais (romances literários e assemelhados). Não são abordados no núcleo avaliativo os textos jurídicos, médicos ou científicos extensos, visto que as dinâmicas discursivas e a organização informacional diferem radicalmente das narrativas (SURVEY DE SUMARIZAÇÃO, 2022). Optou-se pela língua portuguesa, mais especificamente sua variante brasileira, de modo a suprir uma lacuna flagrante na democratização do uso de Inteligência Artificial Generativa para o campo das Letras e da Indústria Criativa lusófona.

A pesquisa justifica-se não apenas pelo desafio acadêmico intrínseco de dominar dependências de longo alcance em PLNs, mas também por sua expressiva contribuição prática. A arquitetura formulada estabelece os alicerces sistêmicos para uma aplicação web de apoio a escritores e editores (sistema de organização de histórias e *brainstorm*). Nesses sistemas, a geração automatizada, precisa e confiável de loglines (sumários de uma frase), sinopses de capítulos e visualizações estruturais atua como um acelerador cognitivo inestimável na produção intelectual (S2TORY, 2026).

## 2.5 Estrutura da Tese

O presente documento encontra-se estruturado em oito capítulos, organizados para prover uma progressão lógica e científica do tema.
O **Capítulo 1** introduz o problema e os contornos da tese.
O **Capítulo 3** oferece o Referencial Teórico, englobando os fundamentos de sumarização extrativa e abstrativa, o panorama evolutivo de arquiteturas seq2seq e Transformers, além de uma revisão exaustiva e tabelada de vinte trabalhos que representam o estado da arte (incluindo QFS, sumarização em múltiplos agentes, datasets de narrativas), apontando as lacunas remanescentes.
O **Capítulo 4** expõe a Metodologia, alicerçada na *Design Science Research* e detalhando os protocolos de pesquisa e instrumentação de avaliação (ROUGE, BooookScore, testes factuais).
O **Capítulo 5** pormenoriza o Desenvolvimento, apresentando a arquitetura HNS-PT, a integração do grafo de estados, as dinâmicas de múltiplos níveis e a discussão de *trade-offs* entre qualidade, fidelidade e custo computacional.
O **Capítulo 6** reserva-se à Discussão, analisando os resultados experimentais através da lente das hipóteses levantadas e seu impacto no contexto da aplicação web visada.
O **Capítulo 7** conclui o trabalho, reiterando as principais contribuições científicas, as limitações encontradas e demarcando rotas futuras de investigação. O Capítulo 8 reúne o referencial bibliográfico norteador desta pesquisa.
