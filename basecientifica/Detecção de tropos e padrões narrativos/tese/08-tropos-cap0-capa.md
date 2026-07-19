# TESE DE DOUTORADO

**UNIVERSIDADE FEDERAL DE LINGUÍSTICA COMPUTACIONAL E HUMANIDADES DIGITAIS**
**PROGRAMA DE PÓS-GRADUAÇÃO EM NARRATOLOGIA COMPUTACIONAL**

---

# DETECÇÃO AUTOMÁTICA DE TROPOS E PADRÕES NARRATIVOS: UMA ABORDAGEM HÍBRIDA BASEADA EM REDES NEURAIS E ONTOLOGIA DE TROPES PARA ANÁLISE DE FICÇÃO ESPECULATIVA EM LÍNGUA PORTUGUESA

**Autora:** Camila Nogueira Braga Fontes

**Orientador:** Prof. Dr. Leandro Tavares Menezes

Tese apresentada ao Programa de Pós-Graduação em Narratologia Computacional da Universidade Federal de Linguística Computacional e Humanidades Digitais como requisito parcial para obtenção do grau de **Doutora em Narratologia Computacional**.

**Área de concentração:** Análise Narrativa Computacional e Linguística de Corpus

**Porto Alegre – RS, 2026**

---

## FICHA CATALOGRÁFICA

```
F683d  Fontes, Camila Nogueira Braga
         Detecção automática de tropos e padrões narrativos: uma
       abordagem híbrida baseada em redes neurais e ontologia de
       tropes para análise de ficção especulativa em língua
       portuguesa / Camila Nogueira Braga Fontes. --
       Porto Alegre, 2026.
         318 f. : il.
         Tese (Doutorado) -- UFLCHD, 2026.
         1. Tropos narrativos. 2. Detecção de padrões.
       3. TVTropes. 4. NLP literário. 5. Ficção especulativa.
```

---

# RESUMO

**FONTES, Camila Nogueira Braga.** Detecção automática de tropos e padrões narrativos: uma abordagem híbrida baseada em redes neurais e ontologia de tropes para análise de ficção especulativa em língua portuguesa. 2026. 318 f. Tese (Doutorado em Narratologia Computacional) – Universidade Federal de Linguística Computacional e Humanidades Digitais, Porto Alegre, 2026.

Os tropos narrativos são convenções recorrentes de personagens, situações e eventos que estruturam a ficção de forma profunda e muitas vezes implícita. A plataforma TVTropes cataloga mais de 30.000 tropos em obras de múltiplas mídias, representando a maior ontologia de padrões narrativos disponível. A detecção automática de tropos em textos ficcionais representa um desafio de alta complexidade para o Processamento de Linguagem Natural (PLN), pois os tropos são instâncias específicas de padrões altamente abstratos — a presença de um tropo num texto dificilmente é marcada por palavras-chave explícitas, exigindo compreensão semântica profunda do contexto narrativo. Esta tese investiga como sistemas híbridos de detecção de tropos, combinando modelos de linguagem fine-tuned com ontologias baseadas no TVTropes e estratégias de few-shot prompting em LLMs, podem identificar automaticamente tropos canônicos e emergentes em romances de ficção especulativa em língua portuguesa, e como essa identificação pode auxiliar escritores a compreender e deliberadamente manipular os padrões narrativos de suas obras. A revisão sistemática de vinte trabalhos fundamentais identificou as principais abordagens para detecção de tropos (LitBank-Tropes, TropesInWild, AllTheRobotsEtAl), análise de enredo por IA (PLOTTER, StoryAnalyzer), e ontologias narrativas (TVTropes, Laboured Framing Ontology, Proppian Ontology). Propõe-se o framework **TropeDetector-PT**, um sistema modular com pipeline de detecção em dois estágios — detecção local por classificador fine-tuned e verificação global por LLM com contexto narrativo — com ontologia de 500 tropos canônicos traduzida e adaptada para a ficção especulativa em português.

**Palavras-chave:** Tropos narrativos. TVTropes. Detecção de padrões. NLP literário. Ficção especulativa. Ontologia narrativa.

---

# ABSTRACT

**FONTES, Camila Nogueira Braga.** Automatic detection of tropes and narrative patterns: a hybrid approach based on neural networks and trope ontology for the analysis of speculative fiction in Portuguese. 2026. 318 f. Doctoral Thesis (PhD in Computational Narratology) – Federal University of Computational Linguistics and Digital Humanities, Porto Alegre, 2026.

Narrative tropes are recurring conventions of characters, situations, and events that structure fiction in profound and often implicit ways. The TVTropes platform catalogs more than 30,000 tropes across multiple media, representing the largest ontology of narrative patterns available. The automatic detection of tropes in fictional texts represents a highly complex challenge for Natural Language Processing (NLP), as tropes are specific instances of highly abstract patterns — the presence of a trope in a text is rarely marked by explicit keywords, requiring deep semantic understanding of the narrative context. This thesis investigates how hybrid trope detection systems, combining fine-tuned language models with TVTropes-based ontologies and few-shot prompting strategies in LLMs, can automatically identify canonical and emerging tropes in speculative fiction novels in Portuguese, and how this identification can assist writers in understanding and deliberately manipulating the narrative patterns of their works.

**Keywords:** Narrative tropes. TVTropes. Pattern detection. Literary NLP. Speculative fiction. Narrative ontology.
