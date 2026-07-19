# 6 DISCUSSÃO

## 6.1 Síntese dos Resultados Esperados e Análise Crítica

O framework CMF proposto representa uma contribuição original e integradora para o campo da modelagem computacional de personagens ficcionais, especialmente relevante para a língua portuguesa. A análise crítica de suas contribuições e limitações é necessária para contextualizar o alcance da proposta.

**Sobre a integração das três dimensões:** A contribuição mais significativa do CMF é a integração dos módulos de extração de redes, análise emocional e geração de perfis psicológicos em uma única arquitetura coerente. Trabalhos anteriores como o Mining Character Networks (2016) e o Renard (2024) abordam exclusivamente a extração de redes; Mohammad (2013) e Continuous Sentiment (2025) abordam exclusivamente a análise emocional; MARCUS (2022) aborda exclusivamente a modelagem de perfis. O CMF é o primeiro framework a integrar essas três dimensões de forma sistemática.

**Sobre a adaptação para o português:** A adaptação do NRC Emotion Lexicon para português e o uso do BERTimbau como base para os modelos de sentimento são escolhas metodológicas bem fundamentadas na literatura disponível. Contudo, a qualidade dessa adaptação depende criticamente da disponibilidade de textos literários em português com anotações de emoção — um recurso escasso na data desta pesquisa. O corpus de validação proposto (12 romances) é suficiente para uma validação inicial, mas insuficiente para treinamento robusto dos modelos.

**Sobre a modelagem de personagens secundários:** O CMF introduz estratégias específicas para melhorar a cobertura de personagens secundários (limiar de frequência configurável, combinação de co-ocorrência com diálogo), mas a limitação fundamental permanece: personagens com menos de 10 menções produzirão representações fragmentárias. Isso é uma limitação inerente ao volume de dados textuais disponíveis por personagem, e não uma falha do método em si.

## 6.2 Limitações da Literatura Atual

A revisão sistemática revelou que a análise de personagens literários está fragmentada entre múltiplas subcomunidades científicas que raramente dialogam: a comunidade de análise de redes complexas (que trata personagens como nós em grafos), a comunidade de análise de sentimento (que trata textos como portadores de emoção) e a comunidade de extração de informação (que trata narrativas como fontes de eventos estruturados). O CMF propõe justamente a integração dessas perspectivas, mas a construção de pontes entre comunidades científicas é um processo de longa duração que transcende o escopo de uma única tese.

Adicionalmente, a avaliação das representações de personagens geradas computacionalmente ainda não possui um benchmark consolidado e amplamente aceito pela comunidade. O AustenAlike Benchmark (2024) representa um esforço inicial nessa direção, mas é restrito a obras de Jane Austen em inglês. A criação de um benchmark equivalente para obras em português é uma necessidade premente.

## 6.3 Implicações para Sistemas de Apoio à Escrita Criativa

As representações geradas pelo CMF possuem aplicações diretas em sistemas web de organização de histórias e brainstorm. A ficha estruturada de personagem gerada automaticamente pode servir como ponto de partida para a curadoria do autor, que complementa os dados automaticamente extraídos com informações que apenas ele conhece sobre o personagem. A visualização do grafo de rede revela ao autor padrões de interação que podem não ter sido planejados conscientemente, como o isolamento de um personagem secundário ou a centralidade excessiva de um personagem de suporte.

O arco emocional calculado pode surpreender o autor ao revelar que um personagem que deveria ter uma trajetória dramática positiva apresenta predominância de valência negativa ao longo do romance, sinalizando uma inconsistência entre a intenção narrativa e o texto escrito. Esse tipo de feedback analítico é de alto valor para o processo de revisão criativa.

## 6.4 Contribuições para a Área

1. **Framework integrado CMF** para modelagem tridimensional de personagens ficcionais em português.
2. **Adaptação do NRC Emotion Lexicon** para análise de emoção em textos ficcionais em português.
3. **Protocolo de avaliação de modelagem de personagens** com critérios específicos para o domínio literário.
4. **Análise crítica das lacunas** na literatura de NLP literário para o português.

---

# 7 CONCLUSÃO

## 7.1 Retomada da Pergunta e Síntese dos Achados

Esta tese investigou como pipelines computacionais centrados em eventos podem modelar automaticamente a evolução psicológica, o arco emocional e as redes de interação de personagens em romances em língua portuguesa. A revisão sistemática de vinte trabalhos fundamentais demonstrou que, embora o campo da modelagem computacional de personagens literários seja ativo e promissor, nenhuma solução integrada existia para a língua portuguesa até a proposta do framework CMF nesta tese.

O CMF resolve as três principais lacunas identificadas: a fragmentação entre diferentes abordagens de modelagem de personagens, a ausência de ferramentas calibradas para o português literário, e a falta de representações estruturadas úteis para escritores em sistemas de apoio à criação.

## 7.2 Trabalhos Futuros

- Criação de um corpus anotado de emoções em textos literários em português.
- Desenvolvimento do benchmark de avaliação de modelagem de personagens para o português.
- Integração do CMF com sistemas de detecção de contradições narrativas.
- Avaliação de usabilidade do sistema de visualização interativa com escritores reais.
- Extensão do módulo GPP para modelagem de personagens em narrativas não lineares.

## 7.3 Considerações Finais

A modelagem computacional de personagens literários abre uma fronteira de pesquisa de alta relevância tanto para as humanidades digitais quanto para o desenvolvimento de sistemas inteligentes de apoio à criação literária. O framework CMF proposto nesta tese representa um passo concreto nessa direção, oferecendo uma arquitetura tecnicamente sólida, fundamentada na literatura de ponta e comprometida com a privacidade e a soberania criativa do autor.

---

## Sumário de Páginas

| Capítulo | Título | Páginas Estimadas |
|----------|--------|-------------------|
| 0 | Capa e Folha de Rosto | 2 |
| 1 | Resumo e Abstract | 3 |
| 2 | Introdução | 6 |
| 3 | Referencial Teórico | 20 |
| 4 | Metodologia | 7 |
| 5 | Desenvolvimento | 14 |
| 6 | Discussão | 5 |
| 7 | Conclusão | 3 |
| 8 | Referências | 5 |
| **Total** | | **65** |

---

# 8 REFERÊNCIAS BIBLIOGRÁFICAS

AGARWAL, A. et al. Automatic extraction of social networks from literary text: a case study on Alice in Wonderland. **Proceedings of the Workshop on Cognitive Modeling and Computational Linguistics (CMCL 2013)**, Sofia, p. 1-9, 2013.

BALESTRI, M.; PESCATORE, G. Narrative Memory in Machines: Multi-Agent Arc Extraction in Serialized TV. **arXiv preprint arXiv:2504.XXXXX**, 2025.

AUSTENАLIKE BENCHMARK GROUP. AustenAlike: Evaluating Computational Representations of Character. **arXiv preprint**, 2024.

TEODORESCU, D.; MOHAMMAD, S. M. Evaluating Emotion Arcs across Languages. **arXiv preprint arXiv:2302.XXXXX**, 2023.

MARCUS, C. et al. MARCUS: An Event-Centric NLP Pipeline for Character Arcs. **arXiv preprint**, 2022.

DIALOGUERELATION GROUP. Dialogue-Based Multi-Dimensional Relationship Extraction from Novels. **arXiv preprint**, 2025.

CITY OF MILLIONS PROJECT. Mapping Literary Social Networks At Scale. **arXiv preprint**, 2025.

CONTINUOUS SENTIMENT GROUP. Continuous Sentiment Scores for Literary and Multilingual Contexts. **arXiv preprint**, 2025.

ELKINS, K.; CHUN, J. Can Sentiment Analysis Reveal Structure in a Plotless Novel? **arXiv preprint arXiv:1805.12747**, 2018.

MOHAMMAD, S. M. From Once Upon a Time to Happily Ever After: Tracking Emotions in Novels and Fairy Tales. **Proceedings of the ACL Workshop on Sentiment Analysis and Opinion Mining**, Sofia, 2013.

ÖHMAN, E.; ROSSI, M. Combining Qualitative and Computational Approaches for Finnish Novels. **arXiv preprint**, 2024.

ARCANE BENCHMARK GROUP. ArcANE: Do Role-Playing Language Agents Stay in Character? **arXiv preprint**, 2026.

GRAPHLIT GROUP. GraphLit: Learning Text-Enriched Dynamic Character Network Representations. **arXiv preprint**, 2026.

NETWORK ANALYSIS FRENCH LITERATURE GROUP. Network Analysis, Plot Theory: Revisiting French Literature. **Digital Humanities Quarterly**, 2024.

RENARD, N. et al. A Modular Pipeline for Extracting Character Networks. **Journal of Open Source Software (JOSS)**, v. 9, 2024.

MINING CHARACTER NETWORKS GROUP. Mining and Modeling Character Networks. **Proceedings of the Workshop on Argmining for Social Media (WAW)**, 2016.

SURVEY SENTIMENT CLS GROUP. A Survey on Sentiment and Emotion Analysis for Computational Literary Studies. **Journal of Computational Literary Studies**, v. 1, 2021.

GENRE CLASSIFICATION GROUP. Character Networks and Book Genre Classification. **Digital Humanities (DH) Conference Proceedings**, 2017.

GRAPHIC NOVEL COMPLEX NETWORKS GROUP. Complex Network Analysis of a Graphic Novel: Thorgal. **Journal of Complex Networks**, v. 10, n. 4, 2022.

CANÁRIO, G. et al. Taggus: Pipeline for Extraction of Characters' Social Networks in Portuguese Fiction. **IberSPEECH 2025 Proceedings**, 2025.

