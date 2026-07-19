# 6 DISCUSSÃO E ANÁLISE EXPERIMENTAL

## 6.1 Resultados do Estudo Duplo-Cego com Avaliadores Humanos

Os testes empíricos baseados no protocolo descrito no Capítulo 4 geraram resultados estatisticamente significativos que validam as hipóteses centrais da tese.

### 6.1.1 Avaliação das Condições de Escrita
Os 15 especialistas literários avaliaram os 30 trechos gerados (metade One-shot e metade refinada pelo StyleGuard-PT) sob uma escala Likert de 1 a 5. Os resultados consolidados são apresentados a seguir:

*   **Coesão de Tom:**
    *   *One-shot:* Média 3,12 (desvio padrão 0,55)
    *   *StyleGuard-PT:* Média 3,88 (desvio padrão 0,42)
    *   *Ganho:* **+24,3%** de melhoria na coesão, confirmando a hipótese **H1** de acréscimo superior a 20% de qualidade.
*   **Qualidade da Prosa em Português:**
    *   *One-shot:* Média 2,95 (desvio padrão 0,62)
    *   *StyleGuard-PT:* Média 3,65 (desvio padrão 0,48)
    *   *Ganho:* **+23,7%**. O refatorador removeu com sucesso expressões que soavam artificiais e decalques sintáticos.
*   **Coerência Factual (Prevenção de Alucinações):**
    *   *One-shot:* Média 2,80 (desvio padrão 0,74)
    *   *StyleGuard-PT:* Média 4,50 (desvio padrão 0,32)
    *   *Ganho:* **+60,7%**.

O teste t de Student pareado para a coesão de tom indicou um valor de $t(14) = 4,82$ com $p = 0,0003$, demonstrando forte significância estatística na superioridade do StyleGuard-PT.

## 6.2 Análise quantitativa de Prevenção de Alucinações (Hipótese H2)

Para testar a hipótese **H2**, induzimos deliberadamente 50 situações de risco de contradição de dados (fornecendo informações parciais nos prompts de contexto).
*   Na condição **One-shot**, o modelo apresentou 18 quebras graves de consistência factual (mudança repentina de filiação de personagem ou local geográfico inconsistente com a base de conhecimento).
*   Na condição **StyleGuard-PT**, o CLLM detectou as falhas no estágio crítico de JSON e orientou a correção no estágio RIE. O número de quebras graves de consistência despencou para apenas 2 ocorrências nos textos finais.

Isso representa uma redução de **88,8%** nas inconsistências de dados narrativos, validando estatisticamente a hipótese **H2** de redução superior a 80%.

## 6.3 Avaliação de Latência de Processamento (Hipótese H3)

A latência do pipeline em hardware local (CPU Intel Core i7 13ª geração, GPU NVIDIA RTX 4060 Ti com 16 GB VRAM rodando Qwen-2.5-7B quantizado em INT4) apresentou a seguinte distribuição por bloco de 300 palavras:

*   **Módulo EVE (Análise sintática e métricas):** Média de 120ms.
*   **Módulo CLLM (Crítico LLM):** Média de 450ms.
*   **Módulo RIE (Refinador LLM):** Média de 680ms (primeira rodada).

O tempo total para uma rodada completa de crítica e refinamento foi de **1,25 segundo** em média (p95 de 1,48 segundo). Para blocos que exigiram duas rodadas (limiares de estilo muito distantes do ideal), o tempo subiu para 2,35 segundos.

Estes resultados validam a hipótese **H3**, atestando a viabilidade de execução do framework em tempo real e de forma assíncrona sob a abordagem de escrita translúcida sem interromper a fluidez cognitiva do autor.

## 6.4 Limitações do Framework StyleGuard-PT

*   **Limitações de Sensibilidade a Estilos não Convencionais:** A métrica de variabilidade de extensão de frase ($m_3$) e a densidade lexical ($m_1$) assumem que a boa prosa literária busca variação e riqueza. Estilos minimalistas ou intencionalmente repetitivos (como a prosa de certos autores contemporâneos) podem ser incorretamente marcados pelo sistema como de baixa qualidade, exigindo reparametrização manual do vetor de referência $\mathbf{v}_{ref}$.
*   **Consumo de Recursos Locais:** A execução concorrente do LLM de edição junto a editores de texto rico e navegadores em computadores pessoais de menor desempenho (8 GB RAM sem GPU dedicada) pode elevar os tempos de processamento para até 6 segundos por bloco, quebrando a premissa de latência aceitável para escrita ativa.
