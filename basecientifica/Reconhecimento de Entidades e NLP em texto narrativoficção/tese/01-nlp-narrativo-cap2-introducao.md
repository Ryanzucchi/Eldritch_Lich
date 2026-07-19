# 1 INTRODUÇÃO

## 1.1 Contextualização do Problema

O Processamento de Linguagem Natural (PLN) obteve avanços expressivos nos últimos anos, impulsionado por modelos de linguagem de grande escala (LLMs) e arquiteturas baseadas em *Transformers*. Contudo, a aplicação de técnicas de PLN, particularmente o Reconhecimento de Entidades Nomeadas (NER), ao domínio literário — narrativas e ficção — ainda esbarra em obstáculos substanciais (BAMMAN; UNDERWOOD; SMITH, 2014; DEKKER; KUHN; VAN ERP, 2019). Textos literários diferem radicalmente de textos noticiosos ou acadêmicos (domínios sobre os quais a maioria dos modelos tradicionais é treinada) por sua extensão, complexidade estrutural, uso de linguagem figurada, e pela presença de fenômenos como múltiplos apelidos (aliases) e referências pronominais distantes (VALA et al., 2015; JAHAN; FINLAYSON, 2019).

Enquanto sistemas NER genéricos atingem altas taxas de sucesso (F1-score > 90%) em notícias, seu desempenho decai vertiginosamente quando aplicados à literatura (VAN DALEN-OSKAM et al., 2014; BROOKE; HAMMOND; BALDWIN, 2016). Personagens literários frequentemente não são referenciados por seus nomes completos. A utilização de epítetos ("o velho", "a condessa") e relações de parentesco ("sr. Bennet", "seu cocheiro") dificulta a extração precisa e a criação de redes sociais de personagens (VALA et al., 2015). Para a língua portuguesa, o desafio é agravado pela escassez histórica de corpora literários anotados, embora iniciativas recentes venham buscando preencher essa lacuna (SILVA; MORO, 2024; SARCINELLI et al., 2025).

## 1.2 Justificativa e Relevância

A relevância científica desta tese sustenta-se na necessidade de adaptar e inovar as arquiteturas de extração de informação para o contexto de obras literárias longas. Trabalhos como os de Bamman, Popat e Shen (2019) com o LitBank em inglês demonstraram a viabilidade de corpora focados, mas a extrapolação para o português demanda investigação de estratégias de pré-treinamento e modelagem específicas (SILVA; MORO, 2024).

Sob o prisma prático, a pesquisa fornece a base arquitetural e algorítmica para um sistema web voltado a escritores e roteiristas, com funcionalidades de organização de arquivos, histórias e *brainstorm*. Nesse contexto de aplicação, a privacidade e a proteção da propriedade intelectual são primordiais. Autores não desejam enviar manuscritos inéditos para APIs comerciais de terceiros (como OpenAI ou Google). Portanto, o desenvolvimento de estratégias locais (*local LLM ensembles*), conforme apontado por Sarcinelli e Silva (2025), e arquiteturas leves tornam-se requisitos não funcionais críticos.

## 1.3 Objetivos

### 1.3.1 Objetivo Geral
Propor, desenvolver e avaliar um pipeline de Reconhecimento de Entidades Nomeadas e *Entity Linking* adaptado para textos ficcionais longos em língua portuguesa, capaz de superar o estado da arte de ferramentas genéricas, executando de forma autônoma sem dependência de APIs externas para garantir a privacidade dos dados.

### 1.3.2 Objetivos Específicos
1. Conduzir uma revisão sistemática da literatura abordando NER, correferência e *Entity Linking* em domínios literários.
2. Identificar e categorizar os principais desafios na resolução de aliases e na identificação de personagens de cauda longa (personagens secundários) em romances (JAHAN et al., 2020).
3. Desenhar uma arquitetura híbrida que combine NER, *Entity Linking* (DELASALLES et al., 2020) e modelos de correferência locais (BAMMAN; LEWKE; MANSOOR, 2020).
4. Avaliar o modelo proposto perante corpora literários recentes em língua portuguesa, analisando o compromisso (*trade-off*) entre custo computacional e precisão.

## 1.4 Pergunta de Pesquisa e Hipóteses

**Pergunta de Pesquisa:** Em que medida sistemas de reconhecimento de entidades nomeadas (NER) adaptados especificamente para textos ficcionais em língua portuguesa são capazes de superar as limitações de ferramentas genéricas — particularmente no reconhecimento de personagens secundários, aliases e resolução de correferências em romances de longa extensão — e quais estratégias arquiteturais maximizam a precisão sem expor dados privados de autores a APIs externas?

**Hipótese 1:** Sistemas NER treinados ou ajustados especificamente com corpora literários apresentam um F1-score significativamente superior na identificação de personagens secundários em comparação a modelos genéricos.
**Hipótese 2:** É possível construir um pipeline com *ensembles* de LLMs locais que atingem precisão comparável às APIs fechadas comerciais, preservando a soberania dos dados do autor.

## 1.5 Delimitação do Escopo

O foco primário reside na extração e unificação de personagens, locais e organizações dentro de narrativas ficcionais. O idioma de teste e desenvolvimento das ferramentas é primariamente o português brasileiro e europeu, fazendo uso de bases de dados de referência (SILVA; MORO, 2024). Os aspectos algorítmicos abordarão soluções executáveis em hardware comoditizado ou pequenas instâncias de nuvem que respeitem a privacidade dos dados (arquiteturas *on-premise*).

## 1.6 Estrutura do Documento

A tese está organizada em sete capítulos. O Capítulo 2 (este) apresenta a introdução e o problema. O Capítulo 3 delineia o referencial teórico e a revisão sistemática da literatura. O Capítulo 4 detalha a metodologia da pesquisa. O Capítulo 5 apresenta a proposta técnica e o desenvolvimento do pipeline. O Capítulo 6 engloba a discussão dos resultados e o Capítulo 7 traz as conclusões e os trabalhos futuros.
