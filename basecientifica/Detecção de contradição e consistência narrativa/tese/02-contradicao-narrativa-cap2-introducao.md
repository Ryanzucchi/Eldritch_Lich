# 1 INTRODUÇÃO

A redação de narrativas longas, em especial romances literários e roteiros de longa extensão, é um exercício intelectual que demanda não apenas criatividade e habilidade expressiva, mas um rigoroso controle cognitivo sobre os elementos diegéticos da obra. O autor, ao conceber universos ficcionais complexos, atua de forma análoga a um arquiteto de sistemas: necessita gerenciar múltiplos estados, variáveis, cronologias e a evolução das entidades no decorrer do tempo. 

## 1.1 Contextualização do Problema

O problema central abordado nesta tese repousa sobre a dificuldade intrínseca na manutenção da consistência narrativa. Durante o processo de escrita, é comum que a sobrecarga cognitiva resulte em inconsistências lógicas — fenômeno que Ahuja, Sclar e Tsvetkov (2025) classificam como furos de roteiro (*plot holes*). Tais furos podem se manifestar de variadas formas, desde a alteração não justificada da cor dos olhos de um personagem até conflitos temporais e violações de leis físicas estabelecidas dentro do próprio universo ficcional construído pelo autor.

No âmbito computacional, a área de Processamento de Linguagem Natural (PLN) tem devotado crescente atenção a esse desafio, outrora restrito a domínios de textos factuais. Conforme de Marneffe, Rafferty e Manning (2008) propuseram em sua taxonomia seminal sobre detecção de contradições, a incompatibilidade semântica ocorre quando duas afirmações não podem ser simultaneamente verdadeiras em um mesmo modelo de mundo. Embora essa definição clássica seja robusta para sentenças curtas e isoladas, Li et al. (2026) demonstram no ConStory-Bench que a detecção de contradições em narrativas longas requer um nível de sofisticação substancialmente maior. O desafio transcende o alinhamento de sentenças e ingressa no âmbito do rastreamento de estados (estado de localização de um personagem, posse de um objeto) e do raciocínio cronológico sobre a sequência de eventos.

## 1.2 Justificativa e Relevância

A relevância científica desta tese justifica-se pela insuficiência dos atuais modelos baseados puramente em atenção global (transformers densos tradicionais) para tratar do escopo estendido de romances inteiros. Trabalhos como os desenvolvidos pelo NarrativeTrack Consortium (2026) enfatizam a urgência de abordagens centradas em entidades e relações para a compreensão de histórias, contrapondo-se ao simples emparelhamento de passagens textuais. 

A demanda prática surge do desenvolvimento de ferramentas assistivas voltadas a escritores profissionais. Softwares de processamento de texto tradicionais não oferecem mais do que corretores ortográficos e gramaticais. O estado da arte almeja ambientes integrados (IDE para escritores) onde o software analisa ativamente a digitação. Para que tal ferramenta tenha adoção prática, é imperativo solucionar a latência de processamento. Modelos pesados não permitem análise em tempo real; modelos ultra-rápidos carecem do contexto global. Neste contexto, o LiteReason (2025) aponta para a importância do raciocínio latente e leve em tarefas narrativas. Este trabalho viabilizará, do ponto de vista algorítmico e arquitetural, a construção de um sistema web completo de organização de arquivos, histórias e brainstorming que acompanhe ativamente a consistência sem interromper o fluxo criativo do usuário.

## 1.3 Objetivo Geral e Objetivos Específicos

O objetivo geral desta tese é propor e validar teoricamente um framework arquitetural híbrido, que combine modelos leves de Inferência em Linguagem Natural (NLI) e representações estruturadas baseadas em grafos de estados de entidades, para a detecção de contradições em narrativas longas com latência compatível com ferramentas de assistência à escrita em tempo real.

Para o alcance do objetivo geral, estabelecem-se os seguintes objetivos específicos:
1. Analisar o estado da arte referente à detecção de contradição, incluindo sistemas, benchmarks e taxonomias aplicáveis ao contexto ficcional;
2. Desenvolver um modelo arquitetural de duas camadas que dissocie a validação temporal imediata da auditoria global do documento;
3. Modelar o gerenciamento de continuidade narrativa por intermédio de grafos espaço-temporais e de estados das entidades;
4. Discutir as implicações arquiteturais em termos de latência computacional, uso de memória e completude do sistema híbrido proposto.

## 1.4 Pergunta de Pesquisa e Hipóteses

O norteador metodológico desta pesquisa encontra-se cristalizado na seguinte **pergunta de pesquisa**:

> Como sistemas híbridos de detecção de contradições, combinando modelos NLI de baixo custo computacional com grafos de estados de entidades, podem identificar de forma eficiente contradições cronológicas, de personagens e de eventos em romances de longa extensão, mantendo latência adequada para uso em tempo real durante a digitação?

Em resposta a esse questionamento, formula-se a hipótese central de que a decomposição do problema de detecção em processos locais de alta frequência (usando modelos NLI compactos e eficientes) conjugados a validações globais e assíncronas baseadas na travessia de grafos de estados (atualizados em background), reduzirá expressivamente a complexidade de inferência computacional, viabilizando o processamento em tempo real sem sacrifício fatal da precisão em inconsistências globais de narrativa.

## 1.5 Delimitação e Estrutura do Trabalho

Esta tese foca no aspecto semântico e lógico da contradição em narrativas literárias fictícias, abstendo-se da análise de viés, toxicidade ou correção factual relativa ao mundo real (fact-checking enciclopédico). O escopo está delimitado às inconsistências intra-documento e regras definidas pelo próprio texto.

O trabalho está organizado em sete capítulos. Após esta Introdução, o Capítulo 2 traça o Referencial Teórico, estabelecendo as definições fundamentais e analisando rigorosamente 20 trabalhos expoentes do estado da arte na área de PLN e compreensão narrativa. O Capítulo 3 delineia a Metodologia orientada à ciência de design. O Capítulo 4 constitui o coração da tese, detalhando o Desenvolvimento da arquitetura de duas camadas e a modelagem do grafo. O Capítulo 5 provê a Discussão acerca dos trade-offs técnicos, seguido pela Conclusão no Capítulo 6.
