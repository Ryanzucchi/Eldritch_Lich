# 4 METODOLOGIA

## 4.1 Paradigma de Pesquisa

Esta tese combina dois métodos complementares: **análise comparativa formal** e **Design Science Research (DSR)**. A análise comparativa formal é empregada para avaliar rigorosamente as propriedades de consistência, convergência e complexidade computacional dos algoritmos OT e CRDT identificados na revisão sistemática. A DSR é empregada para guiar o design e a avaliação da arquitetura proposta para o sistema de edição colaborativa de escrita criativa.

## 4.2 Protocolo de Revisão Sistemática

### 4.2.1 Critérios de Inclusão
- Estudos sobre algoritmos OT, CRDTs, ou sistemas de edição colaborativa em tempo real.
- Publicados entre 1989 e 2026 (o período pioneiro de 1989 é incluído por razão histórica fundamental).
- Apresentam análise formal de propriedades de consistência ou resultados experimentais de desempenho.

### 4.2.2 Critérios de Exclusão
- Sistemas de edição colaborativa sem fundamento formal (sem análise de consistência).
- Trabalhos de escopo exclusivamente de HCI sem contribuição algorítmica.

### 4.2.3 Resultado da Seleção
Vinte trabalhos foram selecionados, cobrindo: OT clássico e contextual (4 trabalhos), CRDTs de sequência (7 trabalhos), CRDTs para rich text (3 trabalhos), CRDTs para JSON e dados estruturados (4 trabalhos) e aplicações específicas (2 trabalhos).

## 4.3 Framework de Análise Comparativa Formal

### 4.3.1 Critérios de Análise

**Critério 1 – Corretude de consistência:** O algoritmo garante formalmente a propriedade SEC?
**Critério 2 – Suporte a texto rico:** O algoritmo suporta formatações semânticas sobrepostas de forma determinística?
**Critério 3 – Undo/redo distribuído:** O algoritmo suporta operações de desfazer/refazer com semântica correta em cenário distribuído?
**Critério 4 – Performance:** Qual a complexidade de tempo das operações de inserção, deleção e mesclagem?
**Critério 5 – Dados estruturados:** O algoritmo suporta sincronização de objetos JSON aninhados?
**Critério 6 – Escalabilidade:** O algoritmo mantém performance aceitável para documentos de grande extensão e muitos usuários concorrentes?

### 4.3.2 Método de Avaliação

Os critérios serão avaliados por: (a) análise formal das provas disponíveis nos trabalhos originais; (b) revisão de benchmarks de performance publicados; (c) simulação computacional de cenários de edição concorrente usando os algoritmos disponíveis em código aberto (Yjs, Automerge, Logoot-JS).

## 4.4 Design da Arquitetura CRDT Proposta

A proposta arquitetural foi desenvolvida seguindo as etapas da DSR:

1. **Identificação do problema:** Ausência de arquitetura CRDT completa para texto rico com undo/redo e sincronização JSON para escrita criativa colaborativa.
2. **Design do artefato:** Combinação de Yjs + Peritext + Eg-walker com protocolo de undo/redo baseado em Stewen e Kleppmann (2024).
3. **Avaliação do artefato:** Análise teórica de propriedades de consistência, benchmarks simulados de latência e throughput.
4. **Comunicação dos resultados:** Esta tese.

## 4.5 Critérios de Avaliação da Arquitetura

**Consistência:** Verificação formal de que a arquitetura proposta satisfaz SEC.
**Latência percebida:** Simulação do tempo entre operação local e confirmação de sincronização.
**Throughput:** Número máximo de operações por segundo suportado pela arquitetura.
**Tamanho do documento:** Escalabilidade para romances de 200.000+ palavras.
**Tamanho do histórico de undo:** Volume de metadados de undo armazenado por operação.

# 5 DESENVOLVIMENTO E PROPOSTA ARQUITETURAL

## 5.1 Arquitetura CRDT para Escrita Criativa Colaborativa

A arquitetura proposta combina quatro componentes tecnológicos baseados na revisão sistemática:

### 5.1.1 Yjs como Base de Sincronização

O Yjs (Jahns et al., 2021) é selecionado como a biblioteca CRDT base da arquitetura por quatro razões:
- Suporte nativo a múltiplos tipos de dados (texto, arrays, maps/JSON).
- Ampla adoção em produção (Notion, Linear, Liveblocks, TLDraw).
- API de alto nível que abstrai os detalhes de implementação do CRDT.
- Suporte a múltiplos providers de comunicação (WebSocket, WebRTC, IndexedDB para persistência local).

### 5.1.2 Peritext para Formatação de Texto Rico

O Peritext (Schiefer et al., 2022) é integrado sobre o Yjs para suportar spans de formatação semântica (negrito, itálico, comentários, links, notas de rodapé). A integração Yjs+Peritext garante que duas operações de formatação concorrentes sobre a mesma região de texto produzam sempre o mesmo resultado determinístico, independentemente da ordem em que as operações chegam ao servidor.

### 5.1.3 Eg-walker para Documentos de Grande Extensão

O Eg-walker (Gentle; Kleppmann, 2025) é utilizado como backend de sequência de texto para documentos com mais de 100.000 palavras, nos quais a performance do YATA (algoritmo base do Yjs) começa a degradar. O Eg-walker é superior ao Logoot e ao LSeq em compactação e velocidade de processamento, sendo a escolha ótima para romances de longa extensão.

### 5.1.4 Protocolo de Undo/Redo Distribuído

O protocolo de undo/redo é implementado seguindo a semântica formal proposta por Stewen e Kleppmann (2024). O protocolo distingue entre:

**Undo seletivo:** Desfaz uma operação específica, mesmo que outras operações posteriores (concorrentes ou subsequentes) não sejam desfeitas. Esse é o comportamento mais intuitivo para o usuário: "quero desfazer apenas essa inserção, não tudo que veio depois".

**Undo em pilha:** Desfaz a última operação do usuário local, na ordem inversa de aplicação. É o comportamento padrão do Ctrl+Z em editores tradicionais.

Para o contexto de escrita criativa, o undo em pilha é o modo default, com a opção de undo seletivo disponível para casos avançados de co-autoria.

### 5.1.5 Sincronização de Dados JSON (Fichas de Personagem)

Para dados estruturados como fichas de personagem, metadados do projeto e configurações do universo ficcional, a arquitetura utiliza o Yjs Y.Map — a estrutura CRDT do Yjs para objetos aninhados — com a extensão de move operations proposta por Da e Kleppmann (2023), que suporta reordenação de elementos sem conflitos de identidade.

Para bancos de dados relacionais (PostgreSQL), a sincronização com réplicas locais de clientes desktop é implementada usando o protocolo CRR (Conflict-free Replicated Relation) do CRR Group (2020), adaptado para as tabelas de personagens e eventos do sistema.

## 5.2 Modelo de Comunicação

### 5.2.1 Topologia Híbrida

A arquitetura adota uma topologia híbrida: para sessões de co-edição em tempo real (dois ou mais usuários editando simultaneamente), utiliza-se comunicação WebRTC P2P com o Yjs WebRTC Provider, eliminando o servidor central como bottleneck. Para sincronização em background e persistência, utiliza-se um servidor de sincronização baseado em WebSocket com o Yjs WebSocket Provider.

### 5.2.2 Suporte Offline-First

A camada de persistência local utiliza o Yjs IndexedDB Provider, que armazena o estado completo do documento e o histórico de operações no banco IndexedDB do navegador. Quando o usuário reconecta, o sistema sincroniza automaticamente as operações realizadas offline com o servidor central, sem perda de dados ou necessidade de resolução manual de conflitos.

## 5.3 Integração com Agentes de IA

Um aspecto inovador desta arquitetura é o suporte a operações concorrentes geradas por agentes de IA (como sugestões de continuação de texto ou correções de consistência narrativa). As operações de IA são tratadas como operações de um usuário especial (com ID único de usuário-IA) e sincronizadas via o mesmo protocolo CRDT, garantindo consistência com as edições humanas. O CodeCRDT (Pugachev, 2025) fornece um precedente relevante para essa integração.

A semântica de undo de operações de IA pelo usuário segue o protocolo de undo seletivo: o usuário pode desfazer qualquer sugestão aceita da IA sem desfazer suas próprias edições subsequentes.

## 5.4 Trade-offs

**CRDT vs. OT:** A arquitetura CRDT elimina a necessidade de servidor central de transformação de operações, melhorando a disponibilidade e a escalabilidade. Como trade-off, os metadados de identidade de posição (tombstones) crescem com o histórico de edições, exigindo compactação periódica do documento.

**Peritext vs. OT para rich text:** O Peritext garante comportamento determinístico e intuitivo para formatação concorrente, com trade-off de maior complexidade de implementação em relação a soluções OT simples.

**Undo/redo distribuído vs. centralizado:** O undo/redo distribuído com semântica SEC tem custo de armazenamento superior ao undo centralizado, pois precisa armazenar metadados de cada operação para possibilitar o undo seletivo.

