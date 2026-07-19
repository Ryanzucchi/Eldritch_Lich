# Proposta de Skills — Geração de resumo e sumarização automática

Abaixo estão especificadas as skills técnicas extraídas da Tese 04 e de sua base científica correspondente, voltadas ao processamento e condensação de romances em múltiplos níveis de granularidade.

---

## Skill: `sumarizacao-hierarquica-recursiva`

**Temática de origem:** Geração de resumo e sumarização automática (Tese 04)
**Objetivo:** Gerar resumos e sinopses consistentes de romances de grande extensão em múltiplos níveis de granularidade (cena, capítulo e obra completa) sem perder a coerência temporal e sem estourar as janelas de contexto de modelos locais.
**Quando usar (triggers):** Fechamento de capítulos, importação de manuscritos, ou solicitação manual de resumo estruturado da obra.
**Fundamentação científica:** DTCRS (2026), CAHM (2025), BookSum (Kryściński et al., 2021).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Montagem da Árvore de Segmentos Narrativos (ASN):** Dividir o texto dinamicamente em uma árvore lógica:
   - **L1 (Folha):** Cenas ou parágrafos (200-1000 palavras).
   - **L2 (Ramo):** Capítulos estruturais.
   - **L3 (Raiz):** Romance completo.
2. **Sumarização L1 (Local):** Processar cada cena folha usando um modelo de linguagem local leve (SLM) ajustado em corpora literários (BookSum).
3. **Fusão Contextual (L2):** Combinar os resumos L1 do capítulo em um resumo L2 aplicando ponderação de atenção ciente de contexto (CAHM), atenuando a perda de dependências causais nas fronteiras das cenas.
4. **Sumarização L3 (Global):** Unificar os resumos de capítulos L2 em uma sinopse completa da obra guiada por um plano narrativo estruturado (protagonista, conflito, clímax).

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Chunking Fixo Arbitrário:** Evitar a quebra de texto baseada estritamente em contagem de tokens (ex.: fatiar a cada 2000 tokens), pois isso corta diálogos e cenas ao meio, destruindo a semântica local (DTCRS, 2026).

**Métricas de sucesso sugeridas:**
- ROUGE-1/ROUGE-L de resumos literários (alvo $\ge 0.38$).
- BooookScore de consistência lógica (alvo $\ge 88\%$).

**Requisito(s) do projeto relacionado(s):** RF-52 (resumo de textos longos), RF-181 (mesclar textos).

**Nível de maturidade da técnica:** Consolidada.

---

## Skill: `destilacao-espinha-dorsal-narrativa`

**Temática de origem:** Geração de resumo e sumarização automática (Tese 04)
**Objetivo:** Extrair a essência dramática de uma narrativa para gerar automaticamente sinopses comerciais e loglines (resumos de uma única frase) altamente impactantes.
**Quando usar (triggers):** Solicitação de loglines para propostas comerciais, preenchimento de metadados de publicação, ou síntese conceitual do livro.
**Fundamentação científica:** S2tory (2026), Plan-Guided Summarization (2025).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Identificação de Elementos da Espinha Dorsal (Story Spine):** Filtrar o texto para isolar:
   - Protagonista e seu desejo central.
   - O Incidente Incitador (evento que inicia a trama).
   - Obstáculo Principal (conflito).
   - As Consequências (risco de falha).
2. **Geração de Logline Estruturada:** Aplicar templates lógicos com base nos elementos extraídos (ex: *"Quando [incidente incitador] acontece, um [protagonista] com o objetivo de [desejo] enfrenta [obstáculo], sob o risco de [consequência]"*).
3. **Geração de Sinopse Comercial:** Expandir o resumo L3 filtrando subtramas irrelevantes e focando estritamente na progressão do conflito principal.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Sobrecarga de Subtramas:** Não incluir personagens secundários ou detalhes de worldbuilding na logline, mantendo a frase focada no núcleo dramático (S2tory, 2026).

**Métricas de sucesso sugeridas:**
- Acurácia e coerência factual dos elementos dramáticos (alvo $\ge 90\%$).

**Requisito(s) do projeto relacionado(s):** RF-170 (gerar sinopse), RF-171 (gerar logline).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `recuperacao-conhecimento-qfs-narrativo`

**Temática de origem:** Geração de resumo e sumarização automática (Tese 04)
**Objetivo:** Responder a perguntas do autor sobre o universo e os acontecimentos da história (QFS) gerando resumos focados sob demanda baseados no contexto do manuscrito.
**Quando usar (triggers):** Pesquisa no banco de dados do universo, consultas do autor no painel lateral do editor ("onde a espada foi guardada?", "quem matou o duque?").
**Fundamentação científica:** QFS-KIT (2021), BeyondRD (2024), OntoRAG (2025).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Recuperação Híbrida local:** Buscar trechos relevantes no manuscrito e notas de worldbuilding usando uma combinação de busca vetorial densa (embeddings) e busca lexical esparsa (BM25).
2. **Sumarização Baseada em Consulta (QFS):** Alimentar o modelo local com a pergunta do usuário e os trechos recuperados, instruindo-o a gerar um resumo que responda estritamente à pergunta.
3. **Geração com Citação de Fontes:** Obrigar o modelo a indicar de quais capítulos ou notas de personagem as informações foram extraídas.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Alucinação por RAG Aberto:** Modelos de linguagem podem alucinar respostas lógicas baseadas em conhecimento geral. É mandatório forçar o grounding das respostas estritamente nas passagens recuperadas do manuscrito.

**Métricas de sucesso sugeridas:**
- Precisão da resposta factual perante o GSE (alvo $\ge 92\%$).

**Requisito(s) do projeto relacionado(s):** RF-24 (busca semântica), RF-28 (busca contextual), RF-90 (wiki do universo), RF-106 (responder perguntas), RF-158 (responder citando).

**Nível de maturidade da técnica:** Consolidada.
