# 1 INTRODUÇÃO

## 1.1 Contextualização

A edição colaborativa em tempo real surgiu como uma necessidade prática no final dos anos 1980, quando os primeiros sistemas de groupware (sistemas de trabalho cooperativo) foram desenvolvidos. O trabalho pioneiro de Ellis e Gibbs (1989), introduzindo o algoritmo de Operational Transformation (OT), representou o primeiro esforço formalizado para resolver o problema de inconsistência em edição concorrente distribuída. Nesse artigo seminal, os autores demonstraram que operações concorrentes de inserção e deleção de texto podem causar estados divergentes nos documentos mantidos por diferentes usuários, e que uma transformação das operações antes de sua aplicação poderia garantir a convergência.

Décadas depois, com a popularização de editores colaborativos como o Google Docs e o Microsoft Word Online, e mais recentemente com o surgimento de ferramentas como Notion, Obsidian e sistemas dedicados à escrita colaborativa, o problema ganhou nova dimensão em escala e complexidade. A necessidade de suportar edição de texto rico (com formatação, estruturas hierárquicas e anotações), operações de desfazer/refazer colaborativo e sincronização de estruturas de dados complexas (como grafos de personagens e fichas em formato JSON) coloca novos desafios que os algoritmos OT clássicos não resolvem de forma satisfatória.

Os CRDTs (Conflict-free Replicated Data Types), formalizados por Shapiro et al. (2011), surgem como uma alternativa teórica mais robusta: tipos de dados projetados matematicamente para que qualquer sequência de operações concorrentes, quando aplicada em qualquer ordem, produza o mesmo resultado final — garantindo assim a propriedade SEC (Strong Eventual Consistency) sem necessidade de um servidor central de resolução de conflitos.

## 1.2 Justificativa e Relevância

No contexto de sistemas de apoio à escrita criativa colaborativa — como o que esta pesquisa fundamenta —, os requisitos específicos de edição colaborativa apresentam características distintas:

**Colaboração assíncrona predominante:** Coautores de romances frequentemente trabalham em horários e locais diferentes, com períodos longos de desconexão da rede. O sistema deve suportar edição offline com sincronização posterior, o que favorece as arquiteturas P2P dos CRDTs em relação às OT centralizadas.

**Edição de texto rico com formatação semântica:** Além do texto puro, co-autores precisam aplicar formatações (negrito, itálico, comentários, notas de rodapé) que se sobrepõem estruturalmente. O Peritext (2022) foi especificamente projetado para esse caso.

**Operações de undo/redo colaborativo:** Quando um co-autor desfaz uma operação que outro já editou sobre, o comportamento correto é não trivial. O trabalho de Stewen e Kleppmann (2024) sobre undo/redo para registros replicados é a referência mais atual nessa direção.

**Sincronização de dados estruturados (JSON):** Fichas de personagem, metadados do projeto e estruturas de world-building são armazenados em formato JSON, exigindo CRDTs para dados estruturados além de texto sequencial (Kleppmann; Beresford, 2016).

## 1.3 Objetivos

**Objetivo Geral:** Analisar comparativamente as abordagens OT e CRDT para edição colaborativa em tempo real, propor uma arquitetura baseada em CRDTs modernos (Yjs + Peritext + Eg-walker) para um sistema de escrita criativa colaborativa, e avaliar seus trade-offs de desempenho, consistência e complexidade de implementação.

**Objetivos Específicos:**
1. Conduzir uma revisão sistemática dos algoritmos OT e CRDT de sequência disponíveis na literatura.
2. Analisar formalmente as propriedades de consistência dos principais CRDTs de sequência (Logoot, LSeq, Treedoc, Eg-walker).
3. Propor e descrever uma arquitetura CRDT para editores de texto rico com suporte a undo/redo distribuído.
4. Avaliar os trade-offs de desempenho, escalabilidade e complexidade dos diferentes algoritmos.
5. Contextualizar os achados para o design de sistemas de escrita criativa colaborativa.

## 1.4 Pergunta de Pesquisa

Como algoritmos baseados em Conflict-free Replicated Data Types (CRDTs), especialmente em implementações modernas como Eg-walker e Yjs, superam as limitações das abordagens de Operational Transformation (OT) na garantia de consistência eventual forte em editores de texto rico colaborativos, e quais arquiteturas permitem incorporar operações de desfazer/refazer e formatação colaborativa sem degradar o desempenho percebido pelo usuário?

## 1.5 Hipóteses

**H1:** CRDTs de sequência modernos (Eg-walker, Yjs) superam OT em escalabilidade para grandes documentos e em latência percebida em condições de alta concorrência.

**H2:** A implementação de undo/redo colaborativo baseado em CRDTs é viável com custo computacional aceitável usando a abordagem de Stewen e Kleppmann (2024).

**H3:** A arquitetura Yjs + Peritext + Eg-walker suporta todos os casos de uso de edição colaborativa de escrita criativa identificados, incluindo formatação de texto rico e sincronização de estruturas JSON.

## 1.6 Estrutura do Documento

A tese está organizada em oito capítulos seguindo a estrutura padrão para teses de doutorado em Ciência da Computação: após este capítulo introdutório, o Capítulo 3 apresenta o referencial teórico e a revisão sistemática, o Capítulo 4 detalha a metodologia, o Capítulo 5 descreve a arquitetura proposta, e os Capítulos 6 e 7 trazem respectivamente a discussão e as conclusões.

