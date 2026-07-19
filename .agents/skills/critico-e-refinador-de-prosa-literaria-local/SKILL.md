---
name: critico-e-refinador-de-prosa-literaria-local
description: Pipeline iterativo de critica e reescrita de prosa com dois agentes LLM locais para manter coerencia estilistica e factual.
---
# critico-e-refinador-de-prosa-literaria-local

## Descrição
A skill `critico-e-refinador-de-prosa-literaria-local` implementa um pipeline iterativo de crítica e reescrita de prosa gerada ou editada por IA para romances em português. Ela usa dois agentes de linguagem locais (um Crítico e um Refinador) em um loop de auto-aperfeiçoamento controlado por critério de parada rígido, garantindo a coerência estilística com a voz do autor, a eliminação de inconsistências factuais introduzidas durante a geração e a manutenção do tom narrativo original.

## Quando usar
Gatilhos concretos e observáveis:
- O sistema de IA gera um parágrafo de continuação de texto ou reescrita de cena no editor.
- O autor solicita "Refinar Estilo" em um bloco de texto selecionado na interface.
- Ocorre a saída de um bloco gerado no modo brainstorming antes de sua apresentação final ao autor.

Quando NÃO usar:
- Em correções puramente ortográficas ou gramaticais (usar verificadores locais).
- Em notas de brainstorming internas do autor que não serão incorporadas ao manuscrito.

## Pré-requisitos
- Modelo de linguagem local carregado e com capacidade de seguir instruções (Instruct-tuned).
- Vetor de estilo de referência do autor ($\mathbf{v}_{ref}$) calculado pela skill `extracao-de-metricas-estilisticas-cognitivo-literarias`.
- Acesso de leitura às triplas de worldbuilding ativas (GUF) para validação de consistência factual.

## Processo (passo a passo executável)
1. **Pré-análise do Texto Gerado (Crítico — CLLM):**
   - Enviar o texto gerado bruto e o contexto de worldbuilding ao agente Crítico local.
   - Instruir o Crítico a gerar um relatório JSON de inconsistências contendo:
     - `style_issues`: lista de frases que desviam do padrão estilístico do autor (verbosidade excessiva, estrutura passiva, adjetivos redundantes).
     - `factual_issues`: lista de inconsistências lógicas detectadas contra as triplas do GUF.
2. **Reescrita Orientada (Refinador — LLM):**
   - Passar ao agente Refinador: o texto original, o relatório JSON do Crítico e exemplos de prosa do autor como in-context learning.
   - Instruir o Refinador a aplicar pontualmente apenas as correções indicadas no relatório, preservando integralmente a narrativa e a voz do autor nos demais trechos.
3. **Avaliação de Convergência (Critério de Parada):**
   - Calcular o vetor de estilo do texto refinado ($\mathbf{v}_{novo}$).
   - Computar a distância estilística: $d_{novo} = ||\mathbf{v}_{novo} - \mathbf{v}_{ref}||_2$.
   - **Encerrar** o loop se: $d_{novo} < STYLE\_DRIFT\_THRESHOLD$ (convergiu) **OU** se o número de iterações atingiu `MAX_REFINEMENT_LOOPS`.
4. **Retorno ao Editor:**
   - Retornar o texto refinado ao editor de forma translúcida (opacidade reduzida) enquanto o processamento ocorreu em background.
   - Exibir ao autor a comparação before/after e oferecer os botões "Aceitar" ou "Rejeitar Refinamento".

## Parâmetros e configuração
- `MAX_REFINEMENT_LOOPS`: Número máximo de iterações do ciclo Crítico-Refinador. Padrão: `2`.
- `STYLE_DRIFT_THRESHOLD`: Limiar máximo da distância estilística para considerar o texto convergido. Padrão: `0.25`.
- `CRITIC_TEMPERATURE`: Temperatura do agente Crítico. Padrão: `0.00` (determinístico).
- `REFINER_TEMPERATURE`: Temperatura do agente Refinador. Padrão: `0.70` (alguma diversidade).

## Armadilhas e como evitá-las
- **Armadilha:** Loops de Refinamento Infinitos: o Crítico LLM é configurado com temperatura alta e gera novos problemas estilísticos em cada rodada de análise mesmo após o refinamento. O loop nunca converge e esgota os recursos da GPU local por horas.
  **Mitigação:** Impor o limite rígido e incondicional `MAX_REFINEMENT_LOOPS = 2`. Ao atingir o limite máximo de iterações, encerrar o loop imediatamente e retornar ao autor a versão com menor $d_{estilo}$ dentre todas as versões geradas durante as iterações, independentemente de o threshold ter sido satisfeito (Self-Refine, 2023).

## Critérios de validação (Definition of Done)
- [ ] O pipeline reduz a frequência de contradições factuais induzidas pela IA (ex: referências a entidades inexistentes no GUF) em pelo menos 80% em testes automatizados.
- [ ] A latência total do ciclo completo de crítica + refinamento de um bloco de 300 palavras é inferior a 1,5 segundos em CPU local.

## Fundamentação científica
- Self-Refine (2023) - Self-Refine: Iterative Refinement with Self-Feedback - NeurIPS 2023
- G-Eval (2023) - G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment - arXiv 2023
- In-Context Critique (2024) - In-Context Critique for Narrative Consistency - arXiv 2024
- LiteraryBench (2026) - LiteraryBench: A Benchmark for AI-Assisted Literary Writing - arXiv 2026

## Requisitos do projeto relacionados
- RF-46 (consistência factual)
- RF-172 (identificação de contradições)
- RF-180 (reescrever com estilo)

## Maturidade e riscos de adoção
**Nível:** Emergente.
*Risco: A qualidade do ciclo crítico depende da capacidade instrucional do modelo local. Modelos de 3B a 7B parâmetros podem gerar relatórios de inconsistência ruidosos ou incompletos.*
*Fallback para v1:* Substituir o loop duplo Crítico-Refinador por um único passo de refinamento com prompt único. Desativar a avaliação iterativa do vetor de estilo e retornar apenas o texto refinado em um único passo com temperatura conservadora.

## Exemplos
**Entrada (Texto IA gerado com problema):**
```text
Kael correu pela floresta até chegar a Valdris, seu querido mentor. — Mas Valdris havia morrido no capítulo 3 do GUF.
```
**Saída esperada (Relatório do Crítico e texto refinado):**
```json
{
  "factual_issues": ["Valdris foi registrado como 'Morto' no GUF - capítulo 3."],
  "refined_text": "Kael correu pela floresta, tentando imaginar o que Valdris lhe diria naquele momento — se ainda estivesse vivo."
}
```
**Caso de falha conhecido:**
O Crítico gerar 12 itens de "problemas de estilo" em um texto de 50 palavras, fazendo o Refinador destruir completamente o texto original e reescrever do zero.
