# Proposta de Skills — Detecção de tropos e padrões narrativos

Abaixo estão especificadas as skills técnicas extraídas da Tese 08 e de sua base científica correspondente, voltadas ao mapeamento analítico de estruturas dramáticas e mitigação de clichês literários.

---

## Skill: `classificacao-local-de-tropos`

**Temática de origem:** Detecção de tropos e padrões narrativos (Tese 08)
**Objetivo:** Executar classificação multi-label local em capítulos de romances para identificar trechos candidatos à presença de tropos narrativos da ontologia PT-500.
**Quando usar (triggers):** Ao salvar um capítulo no editor, sob demanda no painel de análise de enredo, ou durante a ingestão de manuscritos.
**Fundamentação científica:** TropesInWild (Rodriguez Vidal et al., 2023), AllTheRobotsEtAl (García-Sánchez et al., 2022), García-Sánchez et al. (2020).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Fatiamento Dinâmico em Janelas:** Fragmentar o capítulo em janelas deslizantes de 512 tokens com sobreposição (stride) de 128 tokens.
2. **Inferência Multi-Label Local:** Carregar o classificador BERTimbau-large fine-tuned para as 500 classes da PT-500 no dispositivo local.
3. **Max-Pooling Aggregation:** Agregar os scores de sigmoide obtidos em cada janela deslizante escolhendo o valor máximo obtido para cada classe no capítulo inteiro.
4. **Filtragem de Candidatos:** Reter apenas tropos cujos scores superem o threshold mínimo de 0,30, repassando-os como candidatos para a camada seguinte de validação.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Desbalanceamento de Classes Raras:** Na fase de ajuste fino do modelo, a grande maioria dos tropos apresenta pouquíssimos exemplos positivos. Se treinado de forma convencional, o classificador convergirá para responder zero em classes raras. É mandatório aplicar pesos inversamente proporcionais às frequências na loss (weighted BCE) durante o fine-tuning (Rodriguez Vidal et al., 2023).

**Métricas de sucesso sugeridas:**
- Macro-F1 no classificador local (alvo $\ge 0.51$).

**Requisito(s) do projeto relacionado(s):** RF-172 (identificação de tropos), RF-173 (tropos recomendados).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `verificacao-global-de-tropos-com-llm`

**Temática de origem:** Detecção de tropos e padrões narrativos (Tese 08)
**Objetivo:** Validar candidatos a tropos em LLM local utilizando o contexto global do enredo para mitigar falsos positivos e rotular desconstruções literárias (variantes).
**Quando usar (triggers):** Processamento em background após o Estágio 1 (Classificação Local) confirmar candidatos a tropos no romance.
**Fundamentação científica:** TropeEval (2025), Surprising Turns (2025), FlawedFictions (Ahuja et al., 2025).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Engenharia de Prompt Contextual:** Montar prompts estruturados contendo: (a) nome e definição do tropo da PT-500; (b) exemplos literários canônicos na língua de destino; (c) o snippet onde o candidato foi detectado e (d) a sinopse atualizada dos capítulos prévios (HNS-PT).
2. **Classificação Ternária:** Instruir o LLM local (Phi-3.5-mini-instruct) a responder unicamente com PRESENTE, AUSENTE ou VARIANTE.
3. **Mapeamento de Subversões Criativas:** Filtrar as saídas classificadas como "VARIANTE" e apresentá-las no painel do autor como "Subversão de Clichê" — fornecendo uma validação positiva de originalidade.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Análise Sem Contexto de Enredo:** Tentar classificar tropos abstratos (ex: Mentor Death) alimentando a IA apenas com a frase literal onde o fato ocorre (ex: "Valdris morreu"). Sem o contexto global fornecido por sinopses de que Valdris era o mentor espiritual do protagonista Kael, a IA falhará sistematicamente em associar o trecho ao tropo (TropeEval, 2025).

**Métricas de sucesso sugeridas:**
- F1-score do pipeline híbrido (alvo $\ge 0.61$ macro, $\ge 0.74$ em tropos comuns).

**Requisito(s) do projeto relacionado(s):** RF-172 (identificação de tropos), RF-174 (brainstorm de arcos).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `analise-de-co-ocorrencia-e-cliches-literarios`

**Temática de origem:** Detecção de tropos e padrões narrativos (Tese 08)
**Objetivo:** Comparar os tropos detectados na obra com as expectativas de gênero e alertar o autor sobre clichês estruturais, oferecendo rotas criativas de subversão.
**Quando usar (triggers):** Exibição do painel radar de "DNA Narrativo" na aba de planejamento de romances.
**Fundamentação científica:** Fantasy Tropes Analysis (2025), Genre-Specific Clichés (2025), Narrative Patterns in SF (2024), Distant Reading (Moretti, 2013).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Radar de DNA de Gênero:** Agrupar os tropos validados nas supercategorias (Character, Plot, Setting, Theme) e compará-los com distribuições médias de gênero (ex: fantasia épica de Fantasy Tropes, 2025).
2. **Alerta de Clichê Estrutural:** Identificar se o autor acumulou pacotes de tropos altamente correlacionados (ex: *Chosen One* + *Ancient Prophecy* + *Mentor Death* + *The Kingdom under Threat*).
3. **Sugestão Proativa de Subversão:** Quando um pacote de clichê for acionado, sugerir rotas de desconstrução (ex.: "Valdris, o mentor, morre no Ato I, mas na verdade fingiu a morte para evitar o combate" — convertendo o tropo canônico para uma Variante).

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Bloqueio de Liberdade Autoral:** O sistema de IA não deve classificar tropos comuns como erros ou forçar sua remoção; tropos e clichês são estruturas de gênero queridas pelo público. O feedback deve focar na visualização analítica e em sugestões opcionais de criatividade (Genre-Specific Clichés, 2025).

**Métricas de sucesso sugeridas:**
- Acurácia na predição estatística do gênero com base em redes de tropos (alvo $\ge 90\%$).

**Requisito(s) do projeto relacionado(s):** RF-173 (tropos recomendados), RF-174 (brainstorm de arcos), RF-149 (arco dramático).

**Nível de maturidade da técnica:** Consolidada/Emergente.
