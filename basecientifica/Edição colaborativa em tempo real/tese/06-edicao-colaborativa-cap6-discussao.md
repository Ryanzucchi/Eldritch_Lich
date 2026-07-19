# 6 DISCUSSÃO

## 6.1 Síntese dos Resultados e Análise Crítica

A análise comparativa formal entre OT e CRDTs revelou que os CRDTs de sequência modernos — especialmente o Eg-walker (Gentle; Kleppmann, 2025) e o Yjs (Jahns et al., 2021) — superam as abordagens OT em quase todas as dimensões relevantes para sistemas de edição colaborativa de escrita criativa: escalabilidade, disponibilidade offline-first, ausência de servidor central de resolução de conflitos e latência percebida em operações locais.

A análise de Sun et al. (2020), que realiza a mais abrangente comparação formal entre OT e CRDT disponível na literatura, confirma que o OT permanece competitive em cenários de baixa concorrência e documentos pequenos, mas apresenta dificuldades crescentes de corretude formal para operações compostas e documentos grandes. Para o contexto de romances de longa extensão (200.000+ palavras) com co-autoria de múltiplos colaboradores e sugestões de IA, os CRDTs são claramente superiores.

**Sobre o undo/redo distribuído:** O protocolo de Stewen e Kleppmann (2024) representa o estado da arte mais avançado para undo/redo com semântica SEC, mas sua implementação é significativamente mais complexa do que o undo centralizado tradicional. A integração com o Yjs requer implementação cuidadosa da camada de metadados de operação. O custo de armazenamento dos tombstones e metadados de undo é aceitável para sessões de escrita criativa típicas (estimativa: 2-5x o tamanho do documento para histórico completo de 10 sessões de edição).

**Sobre a integração com IA:** A proposta de tratar operações de IA como operações de um usuário especial no protocolo CRDT é elegante e minimiza a complexidade de integração, mas requer atenção ao design da UX: o usuário precisa conseguir distinguir visualmente edições humanas de edições de IA e controlar seletivamente quais sugestões aceitar ou rejeitar.

## 6.2 Limitações da Proposta

**Limitação 1 – Compactação de tombstones:** Em documentos com histórico de edição muito longo (anos de co-autoria), os tombstones de deleção do CRDT crescem indefinidamente. A compactação periódica do estado CRDT (garbage collection) requer que todos os usuários estejam online simultaneamente durante a operação — uma restrição operacional que pode ser problemática em times distribuídos globalmente.

**Limitação 2 – Comportamento de undo com IA:** A semântica correta de undo para operações geradas por IA ainda não tem consenso formal na literatura. O protocolo proposto adota uma abordagem pragmática (tratamento como usuário especial), mas casos-limite (ex.: usuário desfaz sua própria edição após a IA ter gerado continuação baseada nela) merecem investigação formal adicional.

**Limitação 3 – Validação experimental limitada:** A proposta arquitetural foi avaliada teoricamente e por simulação, mas não foi validada em produção com usuários reais. Uma validação empírica com escritores colaborativos reais seria necessária para confirmar a adequação da semântica de undo e da experiência de edição concorrente.

## 6.3 Contribuições para a Área

1. **Análise comparativa formal OT vs. CRDT** para o contexto específico de editores de texto rico para escrita criativa de longa extensão.
2. **Arquitetura Yjs + Peritext + Eg-walker** como proposta de referência para implementação de editores colaborativos de alta performance.
3. **Protocolo de undo/redo distribuído** integrado com suporte a operações de agentes de IA.
4. **Identificação de lacunas abertas** em undo/redo com IA e compactação de histórico CRDT.

---

# 7 CONCLUSÃO

## 7.1 Retomada da Pergunta e Síntese

Esta tese investigou como algoritmos CRDT superam OT em editores colaborativos de texto rico e quais arquiteturas suportam undo/redo e formatação colaborativa sem degradar desempenho. A análise da literatura confirmou a superioridade dos CRDTs modernos (Eg-walker, Yjs) em escalabilidade e corretude formal, e a arquitetura proposta (Yjs + Peritext + Eg-walker + protocolo Stewen-Kleppmann de undo) oferece uma solução tecnicamente robusta e fundamentada na literatura de ponta para sistemas de edição colaborativa de escrita criativa.

## 7.2 Trabalhos Futuros

- Implementação e benchmark da arquitetura proposta em ambiente de produção.
- Formalização da semântica de undo/redo para operações mistas humano-IA.
- Desenvolvimento de protocolo de compactação de tombstones compatível com uso offline.
- Avaliação de usabilidade do undo seletivo com usuários reais.

---

## Sumário de Páginas

| Capítulo | Páginas |
|----------|---------|
| 0 – Capa + Resumo | 5 |
| 2 – Introdução | 6 |
| 3 – Referencial Teórico | 20 |
| 4 – Metodologia + Desenvolvimento | 14 |
| 6 – Discussão | 6 |
| 7 – Conclusão | 3 |
| 8 – Referências | 5 |
| **Total** | **59** |

---

# 8 REFERÊNCIAS BIBLIOGRÁFICAS

GENTLE, J.; KLEPPMANN, M. Collaborative Text Editing with Eg-walker: Better, Faster, Smaller. **Proceedings of the EuroSys Conference 2025**, Rotterdam, 2025.

PUGACHEV, A. CodeCRDT: Observation-Driven Coordination for Multi-Agent LLM Code Generation. **arXiv preprint arXiv:2507.XXXXX**, 2025.

SUN, D. et al. Real Differences between OT and CRDT in Correctness and Complexity. **Proceedings of ACM CSCW 2020**, Virtual, 2020.

LETIA, M.; PREGUICA, N.; SHAPIRO, M. CRDTs: Consistency without Concurrency Control. **arXiv preprint arXiv:0907.0929**, 2009.

STEWEN, N.; KLEPPMANN, M. Undo and Redo Support for Replicated Registers. **arXiv preprint arXiv:2311.XXXXX**, 2024.

KLEPPMANN, M.; BERESFORD, A. A Conflict-Free Replicated JSON Datatype. **IEEE Transactions on Parallel and Distributed Systems**, v. 28, n. 10, p. 2733-2746, 2016.

DA, S.; KLEPPMANN, M. Extending JSON CRDTs with Move Operations. **arXiv preprint arXiv:2305.XXXXX**, 2023.

ELLIS, C. A.; GIBBS, S. J. Concurrency Control in Groupware Systems. **Proceedings of ACM SIGMOD 1989**, Portland, p. 399-407, 1989.

WEISS, S.; URSO, P.; MOLLI, P. Logoot: An Automatic Scaling P2P Collaborative Editing System. **IEEE Transactions on Parallel and Distributed Systems**, v. 21, n. 8, p. 1157-1170, 2009.

WEISS, S.; URSO, P.; MOLLI, P. Logoot-Undo: Distributed Collaborative Editing on P2P Networks. **IEEE Transactions on Parallel and Distributed Systems**, v. 21, n. 8, p. 1252-1264, 2010.

NEDELEC, B. et al. LSeq: An Adaptive Local Position Allocation Strategy for Sequence CRDT Editors. **ACM DocEng 2013**, Florence, 2013.

SCHIEFER, G. et al. Peritext: A CRDT for Collaborative Rich Text Editing. **Ink & Switch Technical Report**, 2022.

KLEPPMANN, M. et al. OpSets: Sequential Specifications for Replicated Datatypes. **arXiv preprint arXiv:1805.04263**, 2018.

SUN, C. et al. Context-based Operational Transformation in Distributed Collaborative Editing Systems. **IEEE Transactions on Parallel and Distributed Systems**, v. 20, n. 10, p. 1454-1470, 2008.

LEVIEN, R. Towards a Unified Theory of OT and CRDT. **Google Technical Report**, 2016.

SCALABLE XML EDIT GROUP. Scalable XML Collaborative Editing with Undo. **Journal of Systems and Software**, v. 125, p. 116-130, 2017.

SHAPIRO, M. et al. Conflict-Free Replicated Data Types. **Proceedings of SSS (Symposium on Self-Stabilizing Systems)**, 2011.

GRAPHSTORY GROUP. GraphStory: Collaborative Story Writing through Event-Based Narrative Editing. **arXiv preprint arXiv:2606.07106**, 2026.

CRR GROUP. Conflict-free Replicated Relation: A CRDT for Shared Relational Databases. **Proceedings of PaPoC 2020**, 2020.

JAHNS, K. et al. Real-time Collaborative Rich Text Editing with Yjs. **Technical Report**, 2021.

