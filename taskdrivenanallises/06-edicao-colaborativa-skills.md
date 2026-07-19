# Proposta de Skills — Edição colaborativa em tempo real

Abaixo estão especificadas as skills técnicas extraídas da Tese 06 e de sua base científica correspondente, voltadas ao desenvolvimento de motores colaborativos assíncronos e em tempo real baseados em Strong Eventual Consistency (SEC).

---

## Skill: `concorrencia-editor-texto-rico-crdt`

**Temática de origem:** Edição colaborativa em tempo real (Tese 06)
**Objetivo:** Implementar um editor de texto rico concorrente em tempo real que garanta a propriedade SEC e preserve formatações semânticas sobrepostas, adequado para romances extensos (+100.000 palavras).
**Quando usar (triggers):** Integração do editor de texto rico com o servidor de sincronização, suporte a edição multiusuário e revisões do motor colaborativo.
**Fundamentação científica:** Yjs (Jahns et al., 2021), Peritext (Schiefer et al., 2022), Eg-walker (Gentle; Kleppmann, 2025).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Binding de Documento Replicado:** Vincular o editor visual (ex: ProseMirror/TipTap) a uma instância de documento compartilhado `Y.Doc` usando wrappers de concorrência.
2. **Integração de Eg-walker para Textos Longos:** Utilizar o Eg-walker como backend de sequência para comprimir os metadados de posição de inserções e mitigar o overhead de tombstones em documentos de longa duração.
3. **Formatação de Texto Rico Semântico (Peritext):** Representar negritos, itálicos, comentários e links como spans indexados por IDs de caracteres estáveis (ancoragem), em vez de marcações XML/HTML inline clássicas.
4. **Coleta de Lixo de Tombstones (GC):** Configurar rotinas cliente-side para compactar o histórico de caracteres excluídos em momentos de repouso, preservando a compatibilidade de sincronização das réplicas ativas.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Marcação Baseada em Offsets Relativos:** Nunca formatar textos aplicando índices de caracteres numéricos puros (ex.: negrito da posição 10 a 20), sob risco de a formatação se deslocar ou corromper-se caso outro usuário insira texto concorrentemente antes desse bloco (Peritext, 2022).

**Métricas de sucesso sugeridas:**
- Convergência de mesclagem (alvo $100\%$).
- Latência de aplicação local de digitação (alvo $< 2\text{ms}$).

**Requisito(s) do projeto relacionado(s):** RF-81 (edição em tempo real), RF-82 (IA concorrente), UC-424 (editor concorrência).

**Nível de maturidade da técnica:** Consolidada.

---

## Skill: `desfazer-refazer-colaborativo-seletivo`

**Temática de origem:** Edição colaborativa em tempo real (Tese 06)
**Objetivo:** Prover suporte a operações de desfazer/refazer distributed (Undo/Redo) que respeitem a intenção do autor, permitindo inclusive o undo seletivo de blocos sugeridos por IAs.
**Quando usar (triggers):** Implementação de atalhos de Ctrl+Z/Ctrl+Y em contexto colaborativo e rollback de sugestões automatizadas de copilotagem literária.
**Fundamentação científica:** Stewen & Kleppmann (2024), Logoot-undo (Weiss et al., 2010).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Mapeamento de Histórico Local com Vetor de Clocks:** Registrar cada transação local do usuário associando-a a um clock lógico que indique o estado de sincronização das outras réplicas na hora do evento.
2. **Geração de Contra-operações (Undo):** Quando o undo for disparado, em vez de voltar o ponteiro do histórico, gerar uma contra-operação correspondente (ex: se a operação original inseriu "casa", a contra-operação deleta a palavra "casa" nas coordenadas de ID exatas) e propagá-la como uma nova alteração CRDT.
3. **Undo Seletivo (IA Rollback):** Permitir desfazer edições específicas (como um bloco reescrito por um assistente de IA) mantendo preservadas as edições humanas realizadas concorrentemente ou depois em outras partes do capítulo.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Undo Linear em Pilha Global:** Não projetar pilhas de undo globais centralizadas, pois o Ctrl+Z de um escritor reverteria a última palavra escrita por outro co-autor em um parágrafo distinto da obra (Stewen; Kleppmann, 2024).

**Métricas de sucesso sugeridas:**
- Acurácia na reversão de spans específicos (alvo $100\%$).

**Requisito(s) do projeto relacionado(s):** RF-84 (histórico de alterações), RF-2 (desfazer/refazer).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `sincronizacao-banco-dados-local-first`

**Temática de origem:** Edição colaborativa em tempo real (Tese 06)
**Objetivo:** Sincronizar estruturas de dados complexas aninhadas (fichas de personagens, cronogramas, notas) offline-first, garantindo a fusão de alterações relacionais sem intervenção humana.
**Quando usar (triggers):** Sincronização de IndexedDB do navegador com PostgreSQL remoto, movimentação de capítulos na árvore de arquivos, e persistência offline.
**Fundamentação científica:** Kleppmann & Beresford (2016), Da & Kleppmann (2023), CRR Group (2020), Local-first (Kleppmann et al., 2019).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Modelagem Y.Map para JSON:** Estruturar as fichas de personagens e notas de worldbuilding como mapas aninhados CRDT (`Y.Map` e `Y.Array`).
2. **Operações de Movimentação em Árvores (Move):** Implementar reorganização de cenas e capítulos por arraste (drag-and-drop) aplicando o algoritmo de move com detecção de ciclos para impedir a perda ou clonagem de pastas em edições concorrentes.
3. **Persistência Local-First:** Utilizar o IndexedDB no cliente para salvar snapshots binários compactos da sessão, permitindo que a aplicação inicie instantaneamente offline.
4. **Replicação Relacional (CRR):** Sincronizar tabelas SQL com os dados estruturados locais dos clientes aplicando políticas Last-Write-Wins baseadas em clock físico e clocks de vetor para dirimir divergências em registros.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Conflito de Loop por Movimentação:** Evitar algoritmos de movimentação de nós de diretórios ingênuos, que podem gerar ciclos infinitos (ex: Pasta A colocada dentro de Pasta B, e Pasta B colocada dentro de Pasta A concorrentemente), quebrando a árvore lógica do sistema de arquivos (Da; Kleppmann, 2023).

**Métricas de sucesso sugeridas:**
- Resolução comutativa de conflitos em fichas e arquivos (alvo $100\%$).

**Requisito(s) do projeto relacionado(s):** RF-2 (reorganização), RF-81 (edição concorrente), RF-90 (IndexedDB/PostgreSQL sync).

**Nível de maturidade da técnica:** Consolidada.
