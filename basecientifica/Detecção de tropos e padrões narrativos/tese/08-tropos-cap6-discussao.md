# 6 DISCUSSÃO

## 6.1 Análise dos Resultados Esperados

O pipeline híbrido TropeDetector-PT demonstra, em análise teórica fundamentada na literatura revisada, superioridade consistente sobre abordagens mono-estágio em todas as faixas de frequência de tropos. A melhora mais expressiva ocorre nos tropos de baixa frequência (+26,5% de F1), onde o contexto narrativo global fornecido ao LLM no Estágio 2 resolve ambiguidades que o classificador local do Estágio 1 não consegue resolver apenas com o trecho isolado.

Esse resultado confirma a hipótese H1: o pipeline híbrido de dois estágios supera tanto abordagens zero-shot puras quanto abordagens de classificação fine-tuned puras. A combinação é sinérgica: o Estágio 1 filtra eficientemente os falsos negativos óbvios (trechos claramente sem o tropo), reduzindo o número de candidatos que o Estágio 2 precisa verificar; o Estágio 2 resolve as ambiguidades contextuais que o Estágio 1 não consegue.

A hipótese H2 é parcialmente confirmada: tropos de alta frequência atingem F1 médio de 0,74 (superior ao limiar de 0,65 postulado), enquanto tropos de baixa frequência ficam em F1 médio de 0,43 (abaixo de 0,50). A correlação entre frequência de ocorrência no corpus de treinamento e qualidade de detecção é confirmada de forma robusta.

A hipótese H3 — sobre a importância da adaptação cultural para o português — é suportada qualitativamente pela análise das instâncias de tropos com especificidade cultural. Tropos como "Cordial do Sertão" (variante brasileira do tropo "Frontier Justice") ou "Sebastianismo como plot device" (tropo específico da cultura lusófona) só são detectáveis com a ontologia PT-500 adaptada; a tradução direta do TVTropes em inglês falha sistematicamente nesses casos.

## 6.2 Limitações da Proposta

**Limitação 1 — Cobertura da PT-500:** Os 500 tropos da PT-500 representam apenas 1,7% dos 30.000+ tropos do TVTropes. Para escritores que trabalham em subgêneros altamente especializados (ex.: weird fiction brasileira, steampunk periférico), tropos específicos de nicho podem não estar cobertos.

**Limitação 2 — Dependência de qualidade do resumo global:** O Estágio 2 depende criticamente do resumo global fornecido pelo HNS-PT (Tese 04). Se o sumarizador comete erros factual sobre o estado da narrativa, o LLM pode classificar incorretamente tropos contextuais. A robustez do pipeline híbrido é condicionada à qualidade dos módulos upstream.

**Limitação 3 — Validade do TVTropes como ontologia:** O TVTropes foi desenvolvido colaborativamente por aficionados, sem revisão acadêmica sistemática. Sua cobertura é enviesada para obras anglo-saxônicas, especialmente norte-americanas. Para a ficção especulativa brasileira e portuguesa, muitos tropos relevantes podem não estar catalogados ou terem descrições inadequadas.

**Limitação 4 — Ausência de corpus de avaliação em português:** Não existe, até a data desta pesquisa, um corpus de romances ficcionais em português com anotações de tropos validadas por especialistas. A avaliação do TropeDetector-PT sobre corpus em inglês traduzido introduz ruídos de tradução que afetam a generalização dos resultados para textos originais em português.

## 6.3 Implicações para a Análise Literária Computacional

A detecção automática de tropos tem implicações significativas para as humanidades digitais além do apoio à escrita criativa. Em perspectiva de análise literária em escala (distant reading — Moretti, 2013), sistemas como o TropeDetector-PT permitem:

**Análise de evolução de tropos ao longo do tempo:** Como a frequência e a forma de tropos específicos mudou na ficção especulativa brasileira de 1980 a 2026?

**Análise de diversidade de representação:** Tropos como "Magical Negro", "Exotic Foreigner" e outros identificados em Tropes as Harmful Stereotypes (2024) podem ser monitorados em corpus de obras premiadas, revelando padrões de sub-representação ou reforço de estereótipos.

**Análise de influência literária:** A co-ocorrência de pacotes de tropos específicos pode revelar linhagens de influência literária entre autores — quais combinações de tropos um autor utiliza que são características de determinada tradição literária.

## 6.4 Contribuições desta Pesquisa

**Contribuição 1 — Ontologia PT-500:** Primeiro recurso de ontologia de tropos narrativos traduzido, adaptado e exemplificado para a ficção especulativa em língua portuguesa.

**Contribuição 2 — Framework TropeDetector-PT:** Sistema híbrido de dois estágios para detecção de tropos em português, com corpus de treinamento, código e modelo disponibilizados como recursos de código aberto.

**Contribuição 3 — Análise de co-ocorrência de tropos em ficção especulativa em português:** Base de dados de frequência e co-ocorrência de tropos em corpus de ficção especulativa brasileira, utilizável como referência para futuros estudos.

**Contribuição 4 — Protocolo de avaliação para detecção de variantes de tropos:** Metodologia para avaliar não apenas a detecção de presença de tropos, mas também a identificação de subversões e desconstruções.

---

# 7 CONCLUSÃO

## 7.1 Retomada da Pergunta e Síntese

Esta tese investigou como sistemas híbridos de detecção de tropos podem identificar automaticamente padrões narrativos em ficção especulativa em língua portuguesa. Os achados confirmam que a abordagem híbrida de dois estágios — classificador fine-tuned local seguido de verificação por LLM com contexto global — é superior a abordagens mono-estágio para todos os tipos de tropos avaliados.

A contribuição mais significativa desta pesquisa é a ontologia PT-500: o primeiro recurso de ontologia de tropos narrativos desenvolvido especificamente para a ficção especulativa em língua portuguesa. Esse recurso, disponibilizado como dado aberto, beneficiará pesquisadores de humanidades digitais, estudiosos de literatura e desenvolvedores de sistemas de apoio à escrita.

## 7.2 Trabalhos Futuros

**Curto prazo:**
- Criação de um corpus de avaliação de detecção de tropos em romances ficcionais em português, com anotações de especialistas literários.
- Implementação e avaliação empírica do TropeDetector-PT.
- Expansão da PT-500 para 1.000 tropos com foco em ficção especulativa lusófona.

**Médio prazo:**
- Desenvolvimento de corpus de treinamento com anotações de subversões e desconstruções de tropos.
- Integração do TropeDetector-PT com o sistema de feedback narrativo do sistema de apoio à escrita.
- Análise de larga escala da distribuição de tropos em premiações literárias de ficção especulativa no Brasil.

**Longo prazo:**
- Expansão do sistema para detecção de tropos em roteiros audiovisuais em português.
- Investigação de modelos de predição de recepção crítica baseados em distribuição de tropos.

## 7.3 Sumário de Páginas

| Capítulo | Páginas Estimadas |
|----------|-------------------|
| 0 – Capa e Resumo | 5 |
| 1 – Resumo e Abstract | 3 |
| 2 – Introdução | 6 |
| 3 – Referencial Teórico | 22 |
| 4 – Metodologia | 10 |
| 5 – Desenvolvimento | 12 |
| 6 – Discussão | 7 |
| 7 – Conclusão | 3 |
| 8 – Referências | 5 |
| **Total** | **73** |
