# 2 INTRODUÇÃO

## 2.1 Contextualização do Problema

A recomendação de conteúdo relevante no momento certo é um dos problemas centrais dos sistemas de informação modernos. Em plataformas digitais de entretenimento — como Netflix, Spotify e Amazon — os sistemas de recomendação atingiram alto grau de sofisticação algorítmica, guiando o consumo de conteúdo com base em histórico de interações, preferências declaradas e comportamento coletivo de usuários similares. Em sistemas de apoio à escrita criativa, entretanto, a recomendação contextual é substancialmente menos desenvolvida, apesar do potencial impacto para a produtividade e qualidade do processo criativo.

O processo de escrita de ficção de longa extensão — romances, sagas, séries — envolve um fluxo cognitivo complexo e altamente contextual. Em diferentes momentos da escrita, o autor necessita de tipos de apoio radicalmente distintos: ao escrever uma cena de batalha, pode necessitar de referências históricas sobre armamentos medievais; ao introduzir um personagem secundário sem nome planejado, necessita de sugestões de nomes culturalmente coerentes; ao enfrentar um bloqueio criativo num ponto de virada da trama, necessita de ideias de brainstorm sobre possíveis desenvolvimentos; ao descrever um local que mencionou brevemente cinco capítulos antes, necessita recuperar as notas que escreveu sobre esse local.

Sistemas de recomendação genéricos são inadequados para essas necessidades: o contexto relevante para um escritor em um momento específico da escrita não é seu histórico geral de consumo de conteúdo, mas sim o estado atual de seu universo ficcional — o grafo de personagens, locais, eventos e relações que ele mesmo construiu ao longo da obra. Esse contexto é radicalmente idiossincrático e não pode ser modelado por filtragem colaborativa baseada em usuários similares.

A integração de três paradigmas tecnológicos — filtragem colaborativa baseada em embeddings, grafos de conhecimento ficcional e Retrieval-Augmented Generation (RAG) — oferece a base técnica para sistemas de recomendação contextual que endereçam as necessidades específicas de escritores de ficção: alta relevância contextual, baixa intrusividade, e capacidade de trabalhar com o universo ficcional proprietário do autor.

## 2.2 Justificativa e Relevância

A relevância científica desta pesquisa reside em três dimensões. Primeira, a recomendação contextual para domínios criativos é um problema pouco investigado na literatura de sistemas de recomendação, que historicamente focou em entretenimento, comércio eletrônico e informação. Os desafios específicos do domínio criativo — intrusividade, preservação de voz autoral, coerência com universo ficcional proprietário — representam contribuições originais para a área.

Segunda, a integração do grafo de conhecimento ficcional como componente central de um sistema de recomendação é uma inovação arquitetural não documentada na literatura. O Grafo de Universo Ficcional (GUF), desenvolvido como produto da Tese 07 desta pesquisa, representa uma forma de contexto radicalmente diferente dos perfis de usuário tradicionais e do histórico de consumo coletivo.

Terceira, a questão da preservação do flow criativo durante o uso de sistemas de sugestão por IA é um desafio de design de interação de alta relevância prática — documentado empiricamente por CreativeFlow (2024) e Human Agency (2024) — que permanece sem solução satisfatória nos sistemas existentes.

## 2.3 Objetivos

**Objetivo Geral:** Propor e avaliar o framework ContextRec-Writer, uma arquitetura de recomendação contextual em tempo de escrita que integra filtragem colaborativa baseada em embeddings, navegação no grafo de conhecimento ficcional e RAG para sugestão proativa de conteúdo a escritores de ficção.

**Objetivos Específicos:**
1. Revisar sistematicamente os sistemas de recomendação contextual, escrita assistida por IA e frameworks RAG para criação, publicados entre 2021 e 2026.
2. Identificar e categorizar os tipos de recomendação mais valorizados por escritores em diferentes fases e estados do processo criativo.
3. Propor e descrever a arquitetura ContextRec-Writer com seus três modos de interação (passivo, ativo e brainstorm), fundamentando cada decisão de design na literatura revisada.
4. Analisar os trade-offs de precisão, latência e intrusividade para cada tipo de sugestão implementado.
5. Definir um protocolo de avaliação empírica que possa ser usado para validação futura do framework com escritores reais.

## 2.4 Pergunta de Pesquisa

Como arquiteturas híbridas de recomendação contextual — combinando filtragem colaborativa baseada em embeddings, navegação em grafos de conhecimento ficcional e geração aumentada por recuperação (RAG) — podem sugerir conteúdo relevante ao escritor no momento adequado da escrita, sem interromper o fluxo criativo, e como os trade-offs entre precisão, latência e intrusividade podem ser balanceados para diferentes tipos de sugestão?

## 2.5 Hipóteses

**H1:** O uso do Grafo de Universo Ficcional como contexto de recomendação produz sugestões significativamente mais relevantes do que abordagens de filtragem colaborativa baseadas apenas em histórico de consumo de outras obras.

**H2:** O modo de sugestão passiva (sidebar sem interrupção) preserva melhor o estado de flow criativo do escritor do que o modo ativo, com impacto estatisticamente menor na taxa de interrupção de sessão.

**H3:** A precisão das sugestões de modo ativo é superior à do modo passivo (por serem acionadas por gatilho contextual explícito), com Precision@5 superior a 0,80 para o modo ativo vs. 0,70 para o modo passivo.

## 2.6 Estrutura do Documento

A tese está organizada em oito capítulos: este capítulo introdutório apresenta o problema e os objetivos; o Capítulo 3 apresenta o referencial teórico e a revisão sistemática; o Capítulo 4 descreve a metodologia; o Capítulo 5 apresenta o framework ContextRec-Writer; os Capítulos 6 e 7 trazem discussão e conclusões; o Capítulo 8 lista as referências bibliográficas.
