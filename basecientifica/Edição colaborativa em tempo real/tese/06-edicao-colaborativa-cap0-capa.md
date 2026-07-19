# TESE DE DOUTORADO

**UNIVERSIDADE FEDERAL DE ENGENHARIA DE SOFTWARE E SISTEMAS DISTRIBUÍDOS**
**PROGRAMA DE PÓS-GRADUAÇÃO EM CIÊNCIA DA COMPUTAÇÃO**

---

# CONSISTÊNCIA EVENTUAL FORTE EM EDITORES DE TEXTO RICO COLABORATIVOS: UMA ANÁLISE COMPARATIVA DE CRDTs DE SEQUÊNCIA E PROPOSTA DE ARQUITETURA PARA SISTEMAS DE ESCRITA CRIATIVA

**Autor:** Rafael Henrique Moura Castelo

**Orientadora:** Profa. Dra. Isabela Costa Drummond

Tese apresentada ao Programa de Pós-Graduação em Ciência da Computação da Universidade Federal de Engenharia de Software e Sistemas Distribuídos como requisito parcial para obtenção do grau de **Doutor em Ciência da Computação**.

**Área de concentração:** Sistemas Distribuídos e Computação Colaborativa

**Brasília – DF, 2026**

---

## FICHA CATALOGRÁFICA

```
C348c  Castelo, Rafael Henrique Moura
         Consistência eventual forte em editores de texto rico
       colaborativos: uma análise comparativa de CRDTs de sequência
       e proposta de arquitetura para sistemas de escrita criativa /
       Rafael Henrique Moura Castelo. -- Brasília, 2026.
         321 f. : il.
         Tese (Doutorado) -- UFESSD, 2026.
         1. CRDTs. 2. Edição colaborativa. 3. Consistência eventual.
       4. Operational Transformation. 5. Sistemas distribuídos.
```

---

# RESUMO

**CASTELO, Rafael Henrique Moura.** Consistência eventual forte em editores de texto rico colaborativos: uma análise comparativa de CRDTs de sequência e proposta de arquitetura para sistemas de escrita criativa. 2026. 321 f. Tese (Doutorado em Ciência da Computação) – Universidade Federal de Engenharia de Software e Sistemas Distribuídos, Brasília, 2026.

A edição colaborativa em tempo real de documentos de texto rico constitui um dos problemas mais desafiadores em sistemas distribuídos, envolvendo a necessidade de garantir que múltiplos usuários concorrentes possam editar o mesmo documento simultaneamente sem que suas alterações se percam ou se corrompam. Esta tese investiga como algoritmos baseados em Conflict-free Replicated Data Types (CRDTs), especialmente em implementações modernas como o Eg-walker e o Yjs, superam as limitações das abordagens de Operational Transformation (OT) na garantia de consistência eventual forte (SEC — Strong Eventual Consistency) em editores de texto rico colaborativos, e quais arquiteturas permitem incorporar operações de desfazer/refazer e formatação colaborativa sem degradar o desempenho percebido pelo usuário. Por meio de uma revisão sistemática de vinte trabalhos fundamentais da área, identificaram-se as principais contribuições teóricas e práticas de CRDTs de sequência (Logoot, LSeq, Treedoc, Peritext, Eg-walker), OT contextual (Sun et al., 2008), CRDTs para undo/redo (Stewen; Kleppmann, 2024) e replicação de JSON (Kleppmann; Beresford, 2016). Propõe-se uma arquitetura baseada em Yjs + Peritext + Eg-walker para editores de escrita criativa colaborativa, com suporte a undo/redo distribuído e sincronização de estruturas JSON para fichas de personagem. Os resultados esperados indicam superioridade dos CRDTs modernos em escalabilidade, ausência de servidor central de resolução de conflitos e melhor latência percebida, com compromisso de maior complexidade de implementação do undo/redo colaborativo.

**Palavras-chave:** CRDTs. Edição colaborativa. Consistência eventual forte. Operational Transformation. Sistemas distribuídos. Undo/redo distribuído.

---

# ABSTRACT

**CASTELO, Rafael Henrique Moura.** Strong eventual consistency in collaborative rich text editors: a comparative analysis of sequence CRDTs and architectural proposal for creative writing systems. 2026. 321 f. Doctoral Thesis – Federal University of Software Engineering and Distributed Systems, Brasília, 2026.

Real-time collaborative editing of rich text documents represents one of the most challenging problems in distributed systems, requiring that multiple concurrent users can simultaneously edit the same document without losing or corrupting their changes. This thesis investigates how algorithms based on Conflict-free Replicated Data Types (CRDTs), especially modern implementations like Eg-walker and Yjs, overcome the limitations of Operational Transformation (OT) approaches in ensuring strong eventual consistency (SEC) in collaborative rich text editors, and which architectures allow incorporating undo/redo operations and collaborative formatting without degrading perceived user performance. Through a systematic review of twenty fundamental works in the field, the main theoretical and practical contributions of sequence CRDTs (Logoot, LSeq, Treedoc, Peritext, Eg-walker), contextual OT (Sun et al., 2008), CRDTs for undo/redo (Stewen; Kleppmann, 2024), and JSON replication (Kleppmann; Beresford, 2016) were identified. An architecture based on Yjs + Peritext + Eg-walker is proposed for collaborative creative writing editors, with support for distributed undo/redo and JSON structure synchronization for character sheets.

**Keywords:** CRDTs. Collaborative editing. Strong eventual consistency. Operational Transformation. Distributed systems. Distributed undo/redo.

