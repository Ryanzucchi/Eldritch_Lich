# 7 CONCLUSÃO

## 7.1 Retomada da Pergunta de Pesquisa

Esta tese investigou como algoritmos CRDT modernos superam as abordagens OT na garantia de consistência eventual forte em editores de texto rico colaborativos, e quais arquiteturas suportam undo/redo distribuído e formatação colaborativa sem degradar o desempenho percebido.

A análise comparativa formal de vinte trabalhos fundamentais confirmou a hipótese central: os CRDTs de sequência modernos — especialmente o Eg-walker (Gentle; Kleppmann, 2025) e o Yjs (Jahns et al., 2021) — superam as abordagens OT em todas as dimensões relevantes para sistemas de edição colaborativa de escrita criativa de longa extensão: escalabilidade, ausência de servidor central de resolução de conflitos, latência de operações locais e corretude formal para operações compostas.

A análise de Sun et al. (2020) confirma que o OT permanece competitivo apenas em cenários de baixíssima concorrência e documentos pequenos — precisamente o caso que menos interessa aos autores de romances colaborativos de longa extensão. Para o contexto específico desta tese, os CRDTs são a escolha tecnicamente superior em todos os critérios relevantes.

## 7.2 Síntese dos Achados

**Sobre CRDTs vs. OT:** Os CRDTs modernos eliminam a necessidade de servidor central de transformação, reduzem a latência de operações locais para valores inferiores a 1ms, e provam formalmente a propriedade SEC para qualquer sequência de operações concorrentes. O OT contextual (Sun et al., 2008) alcança corretude comparável apenas com servidor central de serialização, introduzindo gargalo de escalabilidade e ponto único de falha.

**Sobre undo/redo distribuído:** A semântica de undo proposta por Stewen e Kleppmann (2024) — baseada em contra-operações CRDT propagadas para todas as réplicas — é formalmente correta e respeita a intuição do usuário sobre o comportamento esperado do undo. O custo adicional de armazenamento de metadados (estimado em 2-5x o tamanho do documento para histórico completo) é aceitável para o contexto de escrita criativa.

**Sobre formatação colaborativa:** O Peritext resolve de forma definitiva o problema de spans de formatação sobrepostos concorrentes, que não tem solução satisfatória em abordagens OT convencionais. A integração Yjs + Peritext garante comportamento determinístico e intuitivo para todas as operações de formatação de texto rico relevantes para escritores.

**Sobre integração com IA:** Tratar agentes de IA como usuários especiais no protocolo CRDT é uma solução elegante que minimiza a complexidade de integração e garante consistência automática entre edições humanas e edições de IA.

## 7.3 Contribuições desta Pesquisa

**Contribuição 1 – Análise comparativa formal OT vs. CRDT para escrita criativa:** A análise sistemática das propriedades formais dos algoritmos OT e CRDT, contextualizada especificamente para o domínio de romances colaborativos de longa extensão, preenche uma lacuna na literatura que trata os dois paradigmas de forma genérica sem considerar as características específicas do domínio.

**Contribuição 2 – Arquitetura Yjs + Peritext + Eg-walker + undo Stewen-Kleppmann:** A proposta de uma arquitetura completa para editores colaborativos de escrita criativa, combinando quatro componentes CRDT complementares em um sistema coerente, com análise formal de consistência e estimativas de desempenho.

**Contribuição 3 – Protocolo de integração de IA via CRDT:** A formalização do tratamento de agentes de IA como usuários especiais no protocolo CRDT, com semântica de undo seletivo para operações de IA.

**Contribuição 4 – Identificação de lacunas abertas:** A documentação formal das lacunas abertas em undo/redo com IA e compactação de histórico CRDT em documentos de grande extensão.

## 7.4 Trabalhos Futuros

**Curto prazo:**
- Implementação da arquitetura proposta em um editor de texto rico de código aberto (ex.: extensão do TipTap ou ProseMirror).
- Benchmark empírico de desempenho com documentos de 200.000+ palavras.
- Formalização da semântica de undo/redo para operações mistas humano-IA.

**Médio prazo:**
- Desenvolvimento de protocolo de compactação de tombstones compatível com uso offline intermitente.
- Avaliação de usabilidade do undo seletivo com escritores reais em colaboração.
- Extensão do protocolo para suporte a operações de reorganização estrutural (mover capítulos, reorganizar seções).

**Longo prazo:**
- Investigação de garantias de segurança e privacidade para a camada de sincronização WebSocket.
- Extensão da arquitetura para suporte a documentos multimodais (texto + imagens + áudio).

## 7.5 Considerações Finais

A edição colaborativa de texto rico é um problema técnico profundo que a comunidade de sistemas distribuídos resolveu de forma progressiva ao longo de três décadas. A evolução de OT para CRDTs representou um avanço fundamental em rigor matemático e escalabilidade. As contribuições mais recentes — Eg-walker, Peritext, protocolo de undo/redo de Stewen e Kleppmann — colocam a área em um ponto de maturidade tecnológica suficiente para construir editores colaborativos de escrita criativa de alta qualidade, com garantias formais de consistência e privacidade total dos dados.

O framework proposto nesta tese traduz esse conhecimento acadêmico acumulado em uma proposta arquitetural concreta e acionável para sistemas de apoio à escrita criativa colaborativa, contribuindo tanto para a comunidade de pesquisa quanto para desenvolvedores de ferramentas para escritores.
