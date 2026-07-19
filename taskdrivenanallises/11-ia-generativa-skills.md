# Proposta de Skills — IA generativa aplicada à escrita criativa

Abaixo estão especificadas as skills técnicas extraídas da Tese 11 e de sua base científica correspondente, voltadas ao controle fino de estilo e prevenção de alucinações em português.

---

## Skill: `extracao-de-metricas-estilisticas-cognitivo-literarias`

**Temática de origem:** IA generativa aplicada à escrita criativa (Tese 11)
**Objetivo:** Extrair assinaturas matemáticas de estilo (vetor de estilo) a partir de blocos de prosa em português, servindo de base para transferências e checagens de tom.
**Quando usar (triggers):** Ao analisar o texto escrito pelo autor para alimentar a referência de estilo, ou ao auditar trechos gerados pela IA no editor.
**Fundamentação científica:** Cognitive-Literary NLP (2024), Tone Consistency in LLMs (2025), Quality Estimation in Text (2024), Portuguese Literary NLP (2025).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Type-Token Ratio Adaptado ($m_1$):** Lematizar o texto filtrando apenas classes de conteúdo (substantivos, verbos, adjetivos, advérbios) e calcular a razão de lemas únicos sobre palavras totais para mapear a riqueza lexical.
2. **Índice Flesch para Português ($m_2$):** Calcular a legibilidade usando a constante adaptada:
   \[m_2 = 248.835 - (1.015 \times ASL) - (84.6 \times ASW)\]
   Onde $ASL$ é a extensão média das frases (palavras/sentenças) e $ASW$ é o número médio de sílabas por palavra.
3. **Variabilidade de Extensão de Frase ($m_3$):** Calcular o desvio padrão do número de palavras por frase em nível de parágrafo, servindo como proxy matemático do ritmo e cadência da prosa.
4. **Vetor de Estilo:** Mapear os resultados na tupla $\mathbf{v}_{atual} = [m_1, m_2, m_3]$ e calcular a distância euclidiana em relação ao vetor de referência do autor $\mathbf{v}_{ref}$.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Uso de Flesch English em Português:** Aplicar a fórmula de legibilidade original em inglês (Flesch Kincaid) para textos em português gera scores distorcidos, pois a extensão média de palavras e sílabas varia de forma marcante entre os idiomas. O uso das constantes corrigidas para a língua portuguesa é indispensável (COGNITIVE-LITERARY NLP, 2024).

**Métricas de sucesso sugeridas:**
- Latência de cálculo do vetor de estilo por página de texto (alvo $< 150\text{ms}$).

**Requisito(s) do projeto relacionado(s):** RF-180 (reescrever com estilo), RF-181 (mesclar estilo).

**Nível de maturidade da técnica:** Consolidada.

---

## Skill: `critico-e-refinador-de-prosa-literaria-local`

**Temática de origem:** IA generativa aplicada à escrita criativa (Tese 11)
**Objetivo:** Implementar um loop iterativo local de crítica e reescrita de prosa (StyleGuard-PT) para ajustar a coesão de estilo e remover furos lógicos e contradições temporárias em tempo real.
**Quando usar (triggers):** Edição ou geração automática de trechos de romance através do assistente de escrita criativa.
**Fundamentação científica:** Self-Refine (2023), G-Eval (2023), In-Context Critique (2024), LiteraryBench (2026).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Mapeamento de Inconsistências (CLLM):** Enviar o trecho gerado bruto para o LLM Crítico local, acompanhado das triplas de worldbuilding e das métricas EVE, instruindo-o a gerar um relatório de inconsistências estilísticas e lógicas em formato JSON estruturado.
2. **Reescrita Ponderada (RIE):** Alimentar o LLM Refinador com o texto original, o relatório JSON e instruções de in-context learning de romance em português, orientando-o a corrigir pontualmente o texto.
3. **Loop de Parada:** Avaliar o texto refinado novamente com o EVE. Encerrar o ciclo caso a distância estilística seja menor que o threshold estipulado ou o número máximo de 2 iterações seja atingido.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Loops de Refinamento Infinitos:** Processos sem critério rígido de parada podem gerar infinitas rodadas de reescrita se o LLM Crítico for configurado para ser excessivamente detalhista, exaurindo a CPU/GPU local. O limite rígido de no máximo 2 loops de refinamento deve ser garantido, retornando a melhor versão sob o score do crítico se o threshold ideal de estilo não for satisfeito (Self-Refine, 2023).

**Métricas de sucesso sugeridas:**
- Redução de contradições factuais induzidas (alvo $\ge 80\%$).
- Latência média por bloco de 300 palavras (alvo $< 1,5\text{s}$).

**Requisito(s) do projeto relacionado(s):** RF-46 (consistência factual), RF-172 (identificação de contradições), RF-180 (reescrever com estilo).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `otimizacao-de-modelos-generativos-locais`

**Temática de origem:** IA generativa aplicada à escrita criativa (Tese 11)
**Objetivo:** Otimizar o processamento e a latência de LLMs rodando localmente no app desktop/navegador para viabilizar assistentes de escrita em tempo real.
**Quando usar (triggers):** Configuração de engines locais de inferência (llama.cpp, Triton) e especificação de UI de escrita assistida.
**Fundamentação científica:** Self-Refine (2023), LiteraryBench (2026).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Quantização INT4 (Q4_K_M):** Aplicar quantização pós-treinamento de 4 bits nos modelos (ex: Qwen-2.5-7B) para reduzir a pegada de memória VRAM para menos de 4.5 GB, permitindo execução em placas de vídeo populares de consumo doméstico.
2. **Prompt Caching (Context Caching):** Ativar o cacheamento de tokens do prompt no llama.cpp para manter os resumos de worldbuilding fixos já processados na memória, eliminando a latência de processamento inicial do contexto nas chamadas de continuação de texto.
3. **Escrita Translúcida Assíncrona:** Criar layouts de interface que processem o refinamento em workers de background e exibam o texto sendo processado de forma translúcida no editor até que as checagens terminem, evitando travar a digitação do autor.
4. **Configuração de Decodificação Literária:** Ajustar parâmetros de decodificação para fins literários: temperatura $= 0,8$, top-p $= 0,9$, e penalidade de repetição $= 1,1$ para maximizar a riqueza vocabular mantendo a consistência gramatical.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Saturação de VRAM por Ausência de Caching:** Sem o prompt caching ativo, enviar grandes pedaços de romances repetidamente forçará a GPU a recalcular todos os tensores de atenção desde o início a cada parágrafo escrito, elevando o tempo de primeiro token (TTFT) a patamares inviáveis de mais de 10 segundos (LiteraryBench, 2026).

**Métricas de sucesso sugeridas:**
- TTFT médio para prompts com grande contexto literário (alvo $< 300\text{ms}$).
- Pegada de memória VRAM do modelo quantizado (alvo $< 4.5\text{GB}$).

**Requisito(s) do projeto relacionado(s):** RF-81 (sugestões inline), RF-180 (reescrever com estilo).

**Nível de maturidade da técnica:** Consolidada.
