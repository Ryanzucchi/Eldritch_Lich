# 3 REFERENCIAL TEÓRICO E REVISÃO SISTEMÁTICA

## 3.1 Fundamentos Conceituais

### 3.1.1 O Problema da Consistência em Sistemas Distribuídos

A consistência em sistemas distribuídos refere-se à garantia de que todos os nós de um sistema convergem para o mesmo estado após a aplicação de operações concorrentes. O teorema CAP (Consistency, Availability, Partition Tolerance) de Brewer estabelece que nenhum sistema distribuído pode garantir simultaneamente consistência forte, disponibilidade total e tolerância a partições de rede. Editores colaborativos em tempo real necessariamente priorizam disponibilidade e tolerância a partições (usuários devem poder editar mesmo sem conexão), sacrificando a consistência forte em favor de modelos mais relaxados.

A **consistência eventual** (eventual consistency) garante que, na ausência de novas atualizações, todos os nós convergirão para o mesmo estado. A **consistência eventual forte** (SEC — Strong Eventual Consistency), formalizada por Shapiro et al. (2011) no trabalho seminal sobre CRDTs, adiciona a garantia de determinismo: quaisquer dois nós que tenham recebido o mesmo conjunto de atualizações (independentemente da ordem) terão necessariamente o mesmo estado.

### 3.1.2 Operational Transformation (OT)

O paradigma OT, introduzido por Ellis e Gibbs (1989), resolve o problema de concorrência transformando operações antes de aplicá-las: quando a operação B precisa ser aplicada sobre um estado que foi modificado pela operação A (concorrente), B é transformada para levar em conta o efeito de A. Por exemplo, se A inseriu um caractere na posição 5 e B pretende inserir na posição 6, B precisa ser transformada para inserir na posição 7 após a aplicação de A.

O OT contextual (Sun et al., 2008), que define o contexto de uma operação como o vetor de estado do documento no momento da criação da operação, resolveu muitos problemas de corretude das abordagens OT anteriores. Sun et al. (2020) realizaram uma análise comparativa formal e abrangente entre OT e CRDTs, demonstrando que, embora o OT seja conceitualmente simples para operações básicas, sua corretude se torna difícil de garantir e verificar formalmente para operações compostas e para modelos de consistência mais fortes.

### 3.1.3 Conflict-Free Replicated Data Types (CRDTs)

Os CRDTs, formalizados por Shapiro et al. (2011), são tipos de dados projetados matematicamente para garantir SEC sem necessidade de transformações: as operações concorrentes são definidas de tal forma que sua aplicação em qualquer ordem produz o mesmo resultado determinístico. Existem dois tipos principais:

**CRDTs baseados em operação (op-based):** Transmitem as operações entre réplicas. Requerem que o canal de comunicação garanta entrega exatamente uma vez (exatamente-uma vez semântica).

**CRDTs baseados em estado (state-based):** Transmitem o estado completo ou delta do estado. Requerem que a função de fusão (merge) seja comutativa, associativa e idempotente.

Para editores de texto, os CRDTs baseados em posição lógica são especialmente relevantes, pois resolvem o problema fundamental de como identificar posições em um documento que muda com as inserções e deleções de outros usuários.

### 3.1.4 CRDTs de Sequência para Texto

**Logoot e Logoot-Undo (Weiss et al., 2009, 2010):** O Logoot atribui identificadores únicos e ordenados a cada átomo (caractere) do documento, de tal forma que os átomos podem ser inseridos de forma distribuída sem conflito. O Logoot-Undo estende o Logoot com suporte a operações de desfazer, permitindo recuperar o estado anterior de forma consistente em cenários distribuídos.

**LSeq (Nedelec et al., 2013):** Uma estratégia de alocação adaptativa de identificadores de posição para documentos colaborativos que reduz o tamanho crescente dos identificadores em documentos editados intensamente, mitigando um dos principais problemas de performance do Logoot.

**Treedoc (Letia et al., 2009):** Organiza o documento como uma árvore binária, onde a posição de cada nó é determinada por seu caminho na árvore. O Treedoc é mais compacto que o Logoot em documentos com poucas edições concorrentes, mas pode degenerar em desempenho com edição concorrente intensa.

**Eg-walker (Gentle; Kleppmann, 2025):** O mais recente e avançado CRDT de sequência publicado, apresentado na EuroSys 2025. O Eg-walker supera todos os CRDTs anteriores em eficiência, tamanho e velocidade de processamento, ao introduzir uma representação interna baseada em eventos egocêntricos que elimina a necessidade de armazenar metadados de posição por caractere. O artigo demonstra superioridade em todas as métricas de benchmark em relação ao Logoot, LSeq, RGA e Yjs.

### 3.1.5 CRDTs para Texto Rico

**Peritext (Schiefer et al., 2022):** Publicado pelo Ink & Switch Lab, o Peritext é um CRDT especificamente projetado para formatação de texto rico colaborativa. Resolve o problema de spans de formatação sobrepostos concorrentes (ex.: dois usuários aplicam negrito e itálico na mesma frase simultaneamente) de forma determinística e intuitiva. O Peritext distingue entre formatações que se aplicam a caracteres específicos (como negrito e itálico) e formatações que se aplicam a regiões (como comentários e anotações), garantindo comportamento correto para ambos.

**Yjs (Jahns et al., 2021):** Uma das implementações de CRDT mais amplamente utilizadas em produção, com suporte nativo a texto, arrays e maps (JSON). O Yjs implementa uma variante otimizada do CRDT YATA (Yet Another Transformation Approach), com excelente performance em ambientes de alto tráfego e suporte a providers de comunicação múltiplos (WebRTC, WebSocket, IDB).

### 3.1.6 CRDTs para Undo/Redo

O problema do undo/redo em sistemas distribuídos é significativamente mais complexo do que em editores centralizados. Quando um usuário desfaz uma operação que outro usuário já editou por cima, o comportamento esperado não é trivial. O trabalho de Stewen e Kleppmann (2024) sobre undo e redo para registros replicados representa o estado da arte nessa direção, propondo uma semântica formal de undo/redo que é compatível com a propriedade SEC e que respeita a intenção do usuário de uma forma intuitivamente correta.

### 3.1.7 CRDTs para Dados Estruturados (JSON)

Para além de texto sequencial, sistemas de escrita criativa requerem sincronização de estruturas de dados complexas: fichas de personagem, metadados do projeto e grafos de relações. O trabalho de Kleppmann e Beresford (2016) sobre CRDTs para JSON e a extensão posterior com suporte a operações de mover (Da; Kleppmann, 2023) fornecem as bases teóricas para sincronização de documentos JSON aninhados com semântica SEC. O OpSets (Kleppmann et al., 2018) propõe uma especificação sequencial unificada para especificar o comportamento de CRDTs complexos, facilitando a verificação formal.

### 3.1.8 CRDTs para Bancos de Dados Relacionais

O trabalho de CRR Group (2020) sobre Conflict-free Replicated Relations estende o conceito de CRDT para bancos de dados relacionais, relevante para sincronização do banco de dados central do sistema com réplicas locais de clientes desktop que operam em modo offline-first.

### 3.1.9 Aplicações Específicas

O trabalho de CodeCRDT (Pugachev, 2025) aplica CRDTs para coordenar geração de código por múltiplos agentes LLM concorrentes, demonstrando a generalidade do paradigma CRDT além da edição humana colaborativa. O GraphStory (2026) aplica edição colaborativa baseada em grafos de eventos para escrita criativa narrativa, com relevância direta para o contexto desta tese.

O trabalho de Levien (2016) sobre uma teoria unificada de OT e CRDT e o Scalable XML Edit Group (2017) sobre edição colaborativa XML com undo completam o panorama histórico e teórico da área.

## 3.2 Tabela Comparativa

| # | Autor/Projeto | Ano | Paradigma | Texto Rico | Undo/Redo | Estruturado (JSON) | Performance |
|---|---------------|-----|-----------|------------|-----------|---------------------|-------------|
| 1 | Gentle & Kleppmann (Eg-walker) | 2025 | CRDT | Não nativo | Não | Não | Melhor da classe |
| 2 | Pugachev (CodeCRDT) | 2025 | CRDT | Sim (código) | Não explícito | Sim | Alta |
| 3 | Sun et al. (OT vs CRDT) | 2020 | OT+CRDT | Ambos | Análise | Análise | Comparativo |
| 4 | Letia et al. (Treedoc) | 2009 | CRDT | Sim | Não | Não | Média |
| 5 | Stewen & Kleppmann | 2024 | CRDT | Sim | Sim (SEC) | Parcial | Alta |
| 6 | Kleppmann & Beresford | 2016 | CRDT | Não | Não | Sim (JSON) | Alta |
| 7 | Da & Kleppmann | 2023 | CRDT | Não | Não | Sim + move | Alta |
| 8 | Ellis & Gibbs | 1989 | OT | Não | Não | Não | Pioneiro |
| 9 | Weiss et al. (Logoot) | 2009 | CRDT | Sim | Não | Não | Média |
| 10 | Weiss et al. (Logoot-Undo) | 2010 | CRDT | Sim | Sim | Não | Média |
| 11 | Nedelec et al. (LSeq) | 2013 | CRDT | Sim | Não | Não | Boa |
| 12 | Schiefer et al. (Peritext) | 2022 | CRDT | Sim (rich) | Não | Não | Alta |
| 13 | Kleppmann et al. (OpSets) | 2018 | CRDT | Sim | Não | Sim | Alta |
| 14 | Sun et al. (OT Contextual) | 2008 | OT | Sim | Sim | Não | Média |
| 15 | Levien | 2016 | Teoria | Análise | Análise | Análise | N/A |
| 16 | Scalable XML Edit | 2017 | OT | Sim (XML) | Sim | Parcial | Boa |
| 17 | Shapiro et al. (CRDTs) | 2011 | CRDT | Fundamentos | Parcial | Sim | N/A |
| 18 | GraphStory | 2026 | CRDT-Events | Sim | Não | Sim | Alta |
| 19 | CRR Group | 2020 | CRDT | Não | Não | Relacional | Alta |
| 20 | Jahns et al. (Yjs) | 2021 | CRDT | Sim | Parcial | Sim | Muito Alta |

## 3.3 Análise Crítica e Lacunas

**Lacuna 1 – Integração de undo/redo com texto rico:** Nenhum CRDT existente combina suporte nativo a texto rico (formatação semântica) com undo/redo distribuído robusto. O Peritext cobre o texto rico; Stewen e Kleppmann (2024) cobrem o undo/redo; mas a integração precisa ser desenvolvida.

**Lacuna 2 – Integração com agentes de IA concorrentes:** Editores de escrita criativa modernos incluem assistentes de IA que modificam o documento concorrentemente com o usuário. A semântica correta de integração entre edições humanas e edições de IA (qual tem prioridade em conflito? como o undo do usuário interage com sugestões de IA?) não está formalizada na literatura.

**Lacuna 3 – Performance em documentos de muito longa extensão:** Os benchmarks de performance dos CRDTs revisados avaliam documentos de até dezenas de milhares de caracteres. Para romances de 200.000+ palavras com histórico completo de edição, o impacto no desempenho não foi avaliado.

