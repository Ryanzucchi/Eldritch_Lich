# Proposta de Skills — Detecção de contradição e consistência narrativa

Abaixo estão especificadas as skills técnicas extraídas da Tese 02 e de sua base científica correspondente, com diretrizes acionáveis para o desenvolvimento dos módulos de consistência lógica do sistema.

---

## Skill: `deteccao-inconsistencias-locais-nli`

**Temática de origem:** Detecção de contradição e consistência narrativa (Tese 02)
**Objetivo:** Detectar contradições lógicas imediatas e de negação no micro-contexto (sentença recém-digitada vs. parágrafo anterior) de forma extremamente rápida, para fornecer feedback em tempo de digitação.
**Quando usar (triggers):** Ao fim de cada parágrafo concluído, durante pausas na digitação, ou ao salvar rascunhos rápidos.
**Fundamentação científica:** de Marneffe et al. (2008 - Finding Contradictions), Anônimos (2025 - Straightforward NLI), LiteReason (2025).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Extração de Contexto Curto:** Capturar as últimas 500 a 1000 palavras escritas na cena atual como janela de contexto.
2. **Separação Premissa-Hipótese:** Definir o texto consolidado como "Premissa" e o parágrafo/sentença que está sendo digitada como "Hipótese".
3. **Inferência NLI Local:** Passar o par para um modelo de NLI compacto (como RoBERTa-large-NLI destilado) executável localmente na CPU do usuário via WebAssembly ou pequeno server local.
4. **Classificação Lógica:** Avaliar os scores de probabilidade para as classes `entailment` (acarreta), `contradiction` (contradiz) e `neutral` (neutro).
5. **Gatilho de Alerta:** Caso a probabilidade de `contradiction` seja superior a 80%, submeter a frase a um validador local de negação (regras regex para antônimos e modificadores de negação como "não", "nunca") e, se confirmado, sinalizar visualmente no editor a linha contraditória.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Saturação de Atenção Global:** Não tentar submeter o manuscrito inteiro a modelos de NLI locais, pois o contexto de atenção falhará e a latência de processamento ultrapassará o limite aceitável de UI (>300ms) (LiteReason, 2025).

**Métricas de sucesso sugeridas:**
- Acurácia/F1-score de detecção local de contradições em sentenças pareadas (alvo $\ge 82\%$).
- Latência de inferência (alvo < 250ms).

**Requisito(s) do projeto relacionado(s):** RF-46 (reconhecer contradições), RF-73 (verificar antes de salvar), RF-75 (explicar contradição).

**Nível de maturidade da técnica:** Consolidada.

---

## Skill: `auditoria-global-consistencia-entidades`

**Temática de origem:** Detecção de contradição e consistência narrativa (Tese 02)
**Objetivo:** Rastrear a continuidade física de personagens, locais e objetos (status de vida/morte, pertences e localização espacial) ao longo de múltiplos capítulos do livro por meio de representações em Grafos Temporais.
**Quando usar (triggers):** Ao fim de cada capítulo concluído, no fechamento do aplicativo, ou sob demanda de auditoria geral do romance.
**Fundamentação científica:** NarrativeTrack Consortium (2026), SCORE (2025), Duan et al. (2026 - TRACE), Semnani et al. (2025 - CLAIRE).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Extração de Fatos de Entidade:** Ao fim do capítulo, submeter o texto a um pipeline que extrai as relações de eventos (ex: "Kael entra no Castelo", "Kael perde a espada").
2. **Modelagem de Grafo Temporal de Entidades (GTE):** Construir ou atualizar um Grafo Direcionado Acíclico (DAG) onde Vértices representam personagens, locais e objetos, e as Arestas denotam relações indexadas pelo tempo narrativo T.
3. **Validação de Regras de Conservação Física:**
   - **Localização:** Verificar se um personagem que participa de um evento no local X a $T_n$ não estava no local Y a $T_{n-1}$ sem uma aresta de viagem correspondente.
   - **Posse:** Impedir que um personagem use ou venda um objeto cuja posse esteja associada a outro personagem.
   - **Status Vital:** Validar que nenhuma aresta de ação ou diálogo emane de um personagem marcado com o estado "Morto" em instantes temporais subsequentes.
4. **Propagação de Inconsistência:** Caso ocorra uma quebra física, propagar o rótulo de inconsistência recursivamente por todas as arestas descendentes causalmente ligadas no grafo e destacar em vermelho na linha do tempo do autor.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Alucinação por RAG Puro:** Não confiar apenas na busca semântica em banco vetorial (RAG) para validar consistência física, pois LLMs sofrem de alucinações de coerência e ignoram conflitos lógicos booleanos estritos. O estado lógico deve ser extraído em formato de grafo de controle (Gokul et al., 2025).

**Métricas de sucesso sugeridas:**
- Precision e Recall de detecção de furos de enredo (*plot holes*) no benchmark FlawedFictions (alvo $\ge 85\%$).
- Tempo de travessia e auditoria do grafo (alvo < 2 segundos para 100 capítulos).

**Requisito(s) do projeto relacionado(s):** RF-47 (contradições entre capítulos), RF-72 (dependência entre entidades), RF-151 (consistência de idade), RF-169 (inventário de itens).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `analise-consistencia-narrativa-tempo-e-eventos`

**Temática de origem:** Detecção de contradição e consistência narrativa (Tese 02)
**Objetivo:** Rastrear a consistência causal e temporal de tramas ramificadas, linhas do tempo alternativas e versões paralelas do universo da história sem gerar conflitos lógicos.
**Quando usar (triggers):** Criação de universos alternativos, ramificações de enredo, ou importação de timelines de brainstorm.
**Fundamentação científica:** GraphStory (2026), TemporalStory (2023), Zhang et al. (2024 - Narrative-of-Thought).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Modelagem de Branches Causais:** Tratar linhas do tempo e universos alternativos como ramificações separadas de um mesmo nó pai em um Grafo de Eventos Narrativos (GraphStory).
2. **Raciocínio Temporal por NoT (Narrative-of-Thought):** Forçar o sistema a construir uma representação intermediária sequencial de fatos e checar a consistência temporal das ramificações.
3. **Cálculo de Colisão de Linhas Temporais:** Ao mesclar ou comparar duas ramificações de outline (versão A vs. versão B), o sistema deve computar a diferença temporal e relacional e acusar conflitos se personagens possuírem idades diferentes ou eventos incompatíveis no mesmo nó.
4. **Visualização Espaço-Temporal:** Projetar os estados inconsistentes detectados na interface gráfica de mapas e timelines do autor (usando preceitos do TemporalStory para consistência visual e geográfica de cenários).

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Sobrecarga Cognitiva de Ramificação:** A proliferação desordenada de ramificações pode sobrecarregar a memória de trabalho do autor. O sistema deve limitar a visualização ativa a fatias de foco temporais específicas do GTE.

**Métricas de sucesso sugeridas:**
- Recall na identificação de incompatibilidades entre ramificações de enredo (alvo $\ge 80\%$).

**Requisito(s) do projeto relacionado(s):** RF-77 (universos alternativos), RF-80 (ramificações temporárias), RF-79 (comparar linhas do tempo), RF-55 (linha do tempo).

**Nível de maturidade da técnica:** Experimental.
