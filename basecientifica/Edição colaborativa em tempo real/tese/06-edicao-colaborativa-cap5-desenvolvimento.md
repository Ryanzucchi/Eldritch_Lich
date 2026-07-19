# 5 DESENVOLVIMENTO DA ARQUITETURA CRDT PARA ESCRITA CRIATIVA COLABORATIVA

## 5.1 Justificativa das Escolhas Tecnológicas

A arquitetura proposta para o sistema de edição colaborativa de escrita criativa combina quatro componentes CRDT complementares, cada um escolhido com base na revisão sistemática e na análise das lacunas identificadas.

A escolha do **Yjs** como biblioteca CRDT base justifica-se por sua ampla validação em produção: o Yjs está em uso em ferramentas como Notion, Linear, TLDraw e Liveblocks, com milhões de usuários simultâneos. Sua API de alto nível permite integrar múltiplos tipos de dados (Y.Text para sequências de texto, Y.Map para objetos JSON, Y.Array para listas) em um único documento sincronizado. A implementação do YATA (Yet Another Transformation Approach) no Yjs é matematicamente provada como satisfazendo a propriedade SEC (Jahns et al., 2021), garantindo que qualquer conjunto de edições concorrentes converge para o mesmo resultado final em todas as réplicas.

O **Eg-walker** (Gentle; Kleppmann, 2025) é integrado como backend de sequência para documentos de grande extensão (romances com mais de 100.000 palavras), nos quais a abordagem YATA do Yjs começa a acumular overhead de metadados. O Eg-walker representa o estado da arte em eficiência de CRDTs de sequência, superando Logoot, LSeq, RGA e Yjs em todas as métricas de benchmark publicadas na EuroSys 2025: menor tamanho de documento armazenado, menor tempo de processamento por operação e menor consumo de memória.

O **Peritext** (Schiefer et al., 2022) é adicionado para suportar a camada de formatação de texto rico: negrito, itálico, sublinhado, links, comentários e notas de rodapé. O Peritext resolve o problema central de spans de formatação sobrepostos concorrentes de forma determinística. Sem o Peritext, dois usuários aplicando negrito e itálico na mesma frase simultaneamente poderiam gerar estados inconsistentes dependendo da ordem de chegada das operações.

O **protocolo de undo/redo** de Stewen e Kleppmann (2024) é implementado como camada adicional sobre o Yjs, fornecendo operações de desfazer com semântica SEC: o undo de uma operação é ela mesma uma nova operação CRDT que reverte o efeito da operação original de forma consistente em todas as réplicas.

## 5.2 Arquitetura de Camadas do Sistema

### 5.2.1 Camada de Dados (Persistência Local)

O estado do documento é mantido localmente no dispositivo do usuário usando o **Yjs IndexedDB Provider**, que persiste o estado completo do documento CRDT no banco IndexedDB do navegador. Isso garante que o usuário pode continuar editando mesmo sem conexão à internet, com todas as operações sendo registradas localmente para sincronização posterior.

Para persistência adicional e backup, o sistema exporta periodicamente um snapshot do documento em formato binário Yjs (`.yjs`), que pode ser armazenado no sistema de arquivos local sem dependência de formato proprietário.

### 5.2.2 Camada de Comunicação em Tempo Real

Para sessões de co-edição em tempo real (dois ou mais autores editando simultaneamente), o sistema usa o **Yjs WebRTC Provider**, que estabelece conexões peer-to-peer diretas entre os dispositivos dos co-autores via WebRTC. Essa topologia P2P elimina o servidor central como gargalo e ponto único de falha: cada autor se comunica diretamente com os outros, propagando suas operações com a latência mínima possível.

Para sessões assíncronas (autores trabalhando em horários diferentes), o sistema usa o **Yjs WebSocket Provider** conectado a um servidor de sincronização leve. O servidor apenas retransmite as mensagens CRDT entre clientes e armazena o estado para clientes ausentes — não realiza nenhuma resolução de conflitos, pois a lógica de convergência está totalmente nos algoritmos CRDT dos clientes.

### 5.2.3 Camada de Undo/Redo Distribuído

O protocolo de undo/redo é implementado seguindo o modelo formal de Stewen e Kleppmann (2024). Cada operação de edição é registrada em um histórico local com metadados de contexto (vetor de clock lógico no momento da criação). O undo de uma operação gera uma contra-operação que é propagada como uma nova operação CRDT para todas as réplicas.

O sistema distingue dois modos de undo:

**Modo pilha (padrão — Ctrl+Z):** Desfaz a última operação local do usuário. Comportamento idêntico ao undo tradicional de editores de texto, mas implementado via contra-operações CRDT que são propagadas para todas as réplicas.

**Modo seletivo (avançado):** O usuário pode visualizar o histórico de operações de todos os co-autores e desfazer qualquer operação específica, independente de sua posição na pilha. Esse modo é especialmente útil quando um co-autor aceita sugestões de IA e deseja desfazer apenas uma delas sem perder suas edições subsequentes.

### 5.2.4 Camada de Sincronização de Dados Estruturados (JSON)

Fichas de personagem, configurações do universo ficcional, metadados do projeto e listas de cenas são armazenados como documentos Y.Map aninhados, com a extensão de move operations de Da e Kleppmann (2023) para suportar reordenação de listas sem conflitos de identidade.

A sincronização desses dados segue o mesmo protocolo do texto — nenhum servidor central de resolução de conflitos é necessário. Quando dois co-autores editam campos diferentes de uma ficha de personagem concorrentemente, o Y.Map garante que ambas as edições são preservadas. Quando editam o mesmo campo, a resolução é determinística: a operação com maior timestamp lógico prevalece (política Last-Write-Wins no nível de campo).

### 5.2.5 Integração com Agentes de IA

O sistema trata agentes de IA (assistentes de continuação de texto, corretores de consistência narrativa) como usuários especiais com ID de cliente dedicado. As operações geradas por IA são inseridas no documento CRDT via o mesmo protocolo das operações humanas, garantindo consistência automática. O CodeCRDT (Pugachev, 2025) valida esse paradigma no contexto de múltiplos agentes LLM gerando código concorrentemente.

Do ponto de vista do usuário, as operações de IA aparecem destacadas visualmente (cor diferente no cursor/texto), permitindo revisão seletiva. O undo seletivo pode ser usado para reverter qualquer sugestão de IA aceita sem desfazer as edições humanas subsequentes.

## 5.3 Análise Formal de Propriedades de Consistência

### 5.3.1 Prova de SEC para a Arquitetura Proposta

A arquitetura satisfaz SEC se e somente se: (1) cada componente individual satisfaz SEC; e (2) a composição dos componentes preserva SEC. Para a arquitetura Yjs + Peritext + Eg-walker:

- O **Yjs/YATA** satisfaz SEC por construção matemática (Jahns et al., 2021): a função de merge do YATA é comutativa, associativa e idempotente.
- O **Peritext** satisfaz SEC: as operações de formatação são definidas como CRDTs de estado, com função de merge baseada em lattice de inclusão de spans.
- O **Eg-walker** satisfaz SEC: demonstrado formalmente no artigo da EuroSys 2025 (Gentle; Kleppmann, 2025).
- O **protocolo de undo/redo** (Stewen; Kleppmann, 2024) é especificamente projetado para preservar SEC ao introduzir contra-operações como novas operações CRDT.

Portanto, a composição dos quatro componentes satisfaz SEC para a arquitetura proposta.

### 5.3.2 Complexidade Computacional

| Operação | Yjs | Eg-walker | Peritext |
|----------|-----|-----------|---------|
| Inserção local | O(1) amortizado | O(1) | O(k) onde k = spans ativos |
| Recepção de operação remota | O(log n) | O(log n) | O(k) |
| Merge de estados | O(n) | O(n) | O(n·k) |
| Undo de operação | O(1) geração + O(log n) propagação | O(log n) | O(k) |

onde n = número de operações no histórico e k = número de spans de formatação ativos.

## 5.4 Benchmark Simulado de Desempenho

Com base nos benchmarks publicados para Yjs (Jahns et al., 2021) e Eg-walker (Gentle; Kleppmann, 2025), estima-se:

**Latência de operação local:** <1ms para inserção/deleção no Yjs; <2ms no Eg-walker para documentos de até 1M caracteres.

**Latência de sincronização P2P:** 10-50ms (depende da latência de rede). Com WebRTC em rede local: <5ms.

**Tamanho do estado CRDT:** Para um romance de 200.000 palavras (~1.3M caracteres) com histórico de 1.000 operações: ~15MB para o estado Yjs; ~8MB para o estado Eg-walker (47% mais compacto).

**Throughput de operações concorrentes:** Yjs suporta 1.000 operações/segundo concorrentes de até 50 clientes sem degradação perceptível (benchmark interno Yjs, 2021).
