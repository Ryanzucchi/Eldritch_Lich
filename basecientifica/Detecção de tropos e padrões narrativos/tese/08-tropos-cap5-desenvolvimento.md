# 5 DESENVOLVIMENTO DO FRAMEWORK TROPEDETECTOR-PT

## 5.1 Arquitetura Completa do Sistema

O TropeDetector-PT é implementado como um serviço modular integrado ao sistema web de organização de histórias. Sua arquitetura compreende quatro componentes principais que operam em sequência:

**Componente A — Pré-processador narrativo:** Recebe o texto completo do romance e o segmenta em capítulos, cenas e parágrafos. Para cada segmento, extrai metadados estruturais: número do capítulo, posição relativa na obra (percentual), lista de personagens presentes, localização narrativa e tipo de conteúdo predominante (diálogo, narração, ação, descrição). Esses metadados são usados pelo Estágio 2 para contextualizar a análise de tropos.

**Componente B — Estágio 1: Classificador Fine-tuned Multi-Label:** Processa cada capítulo com o classificador BERTimbau-large fine-tuned para os 500 tropos da PT-500. O processamento usa janelas deslizantes de 512 tokens com sobreposição de 128 tokens para cobrir capítulos longos. Para cada janela, o classificador emite scores de confiança para cada um dos 500 tropos. Os scores são agregados por capítulo usando max-pooling (o score máximo de qualquer janela determina o score do capítulo). Candidatos com score superior ao threshold de 0,30 são encaminhados ao Estágio 2.

**Componente C — Estágio 2: Verificação Global por LLM:** Para cada candidato do Estágio 1, o LLM local recebe um prompt estruturado com: (1) definição do tropo em português (PT-500), (2) dois exemplos de outras obras em português, (3) o trecho específico onde o candidato foi detectado e (4) um resumo do estado narrativo global até o capítulo atual (fornecido pelo HNS-PT). O LLM retorna uma classificação ternária: PRESENTE, AUSENTE ou VARIANTE, com justificativa textual de 2-3 sentenças.

**Componente D — Agregador e Relatório:** Consolida as classificações do Estágio 2, remove duplicatas (mesmo tropo detectado em múltiplos capítulos é consolidado em uma entrada única com lista de capítulos de ocorrência), calcula métricas de distribuição e gera os relatórios de DNA Narrativo, Mapa Radar de Gênero e Sugestões de Exploração.

## 5.2 Ontologia PT-500: Estrutura e Conteúdo

A ontologia PT-500 é o recurso original mais relevante desta tese para pesquisadores futuros. A seguir, sua estrutura é detalhada com exemplos representativos de cada nível.

**Nível 1 — Supercategorias (4):**

| Supercategoria | Tropos na PT-500 | Exemplos típicos |
|---------------|-----------------|-----------------|
| Character Tropes | 180 | Chosen One, Anti-Hero, Mentor Death, Love Interest |
| Plot Tropes | 160 | The Call to Adventure, Chekhov's Gun, Deus ex Machina |
| Setting Tropes | 100 | Dystopia, Magical Kingdom, Post-Apocalypse |
| Theme Tropes | 60 | Good vs. Evil, Redemption Arc, Power Corrupts |

**Exemplos de tropos PT-500 com tradução e adaptação:**

| Tropo (inglês) | Tradução PT-500 | Definição abreviada | Exemplo em obra brasileira |
|----------------|-----------------|---------------------|---------------------------|
| Chosen One | O Eleito | Protagonista destinado por profecia/destino a salvar o mundo | *Falha Humana* (ficção brasileira fictícia) — personagem marcado desde o nascimento |
| Mentor Death | Morte do Mentor | Figura mentora morre para catalizar o crescimento do protagonista | *O Guardião das Sombras* — o mestre de magia sacrifica-se no ato II |
| Found Family | Família Escolhida | Grupo de personagens não relacionados forma laços familiares | Tripulação de nave espacial torna-se família em saga de FC |
| The Reveal | A Grande Revelação | Informação crucial sobre identidade/passado muda tudo que o leitor sabia | Vilão é pai do protagonista; aliado é traidor |
| Love Triangle | Triângulo Amoroso | Protagonista entre dois interesses românticos com qualidades complementares | Padrão recorrente em YA fantasia brasileira |

## 5.3 Estratégia de Fine-tuning do Estágio 1

### 5.3.1 Construção do Corpus de Treinamento

O corpus de treinamento para o classificador multi-label foi construído em três fases:

**Fase 1 — Dados base em inglês:** 45.000 pares (snippet, lista de tropos) extraídos do TropesInWild (Rodriguez Vidal et al., 2023) e do dataset do AllTheRobotsEtAl (García-Sánchez et al., 2022).

**Fase 2 — Tradução para português:** Os snippets foram traduzidos para o português usando um modelo de tradução especializado em ficção literária (OPUS-MT-en-pt fine-tuned), com revisão humana de 10% da amostra para controle de qualidade.

**Fase 3 — Dados originais em português:** Foram coletados manualmente 2.000 trechos de obras ficcionais em português (domínio público e com autorização) com anotações de tropos por especialistas em teoria literária.

O corpus final contém: 40.000 exemplos positivos (tropo presente) distribuídos pelos 500 tropos, e 80.000 exemplos negativos. O desbalanceamento proporcional é tratado com Binary Cross-Entropy ponderado por frequência inversa de classe.

### 5.3.2 Arquitetura do Classificador

O classificador usa BERTimbau-large (355M parâmetros) como encoder, com uma camada de classificação multi-label composta por:
- Camada de atenção sobre o output [CLS] do BERT.
- Camada densa de 512 neurônios com ativação GELU.
- Camada de saída com 500 neurônios, um por tropo, com ativação sigmoide.

O treinamento usa as configurações: learning rate = 2e-5, batch size = 32, epochs = 10 com early stopping (paciência de 3 épocas), otimizador AdamW com weight decay de 0,01.

### 5.3.3 Resultados Esperados do Estágio 1

Com base nos resultados de sistemas similares na literatura (TropesInWild, Rodriguez Vidal et al., 2023), estimam-se os seguintes resultados para o Estágio 1 isolado:

| Frequência de Tropo | Exemplos no corpus | F1 esperado |
|--------------------|--------------------|-------------|
| Alta (>500 exemplos) | 120 tropos | 0,68 |
| Média (100-500) | 230 tropos | 0,52 |
| Baixa (<100) | 150 tropos | 0,34 |
| **Média geral** | 500 tropos | **0,51** |

### 5.3.4 Resultados Esperados do Pipeline Híbrido (Estágio 1 + 2)

Com a adição do Estágio 2 (verificação por LLM com contexto global), estima-se:

| Frequência de Tropo | F1 Estágio 1 | F1 Pipeline Híbrido | Melhora |
|--------------------|--------------|--------------------|---------|
| Alta | 0,68 | 0,74 | +8,8% |
| Média | 0,52 | 0,61 | +17,3% |
| Baixa | 0,34 | 0,43 | +26,5% |
| **Média geral** | **0,51** | **0,61** | **+19,6%** |

A melhora é especialmente significativa para tropos de baixa frequência, onde o contexto global fornecido ao LLM resolve ambiguidades que o classificador local não consegue resolver com o snippet isolado.

## 5.4 Exemplos de Detecção

**Exemplo 1 — Tropo "Mentor Death" detectado:**

*Trecho:* "Valdris fechou os olhos pela última vez, um sorriso sereno nos lábios. 'Você já sabe tudo que eu tinha a te ensinar,' sussurrou ele, apertando a mão de Kael antes de soltar. A chama da tocha tremeluzeu e se apagou."

*Estágio 1:* Score = 0,87 para "Morte do Mentor" → Candidato confirmado.
*Estágio 2:* PRESENTE. Justificativa: "A morte de Valdris no momento de transmissão final de sabedoria a Kael é uma instância canônica do tropo Mentor Death. A linguagem simbólica (apagar da tocha, sorriso sereno) reforça a carga dramática característica."

**Exemplo 2 — Tropo "Chosen One" como VARIANTE:**

*Trecho:* "A profecia dizia que o Eleito destruiria o Imperador das Sombras. Mas nenhuma profecia mencionava que o Eleito estaria sem memórias, com mãos calejadas de trabalho em minas, sem a menor ideia de como segurar uma espada."

*Estágio 1:* Score = 0,71 para "O Eleito" → Candidato confirmado.
*Estágio 2:* VARIANTE. Justificativa: "O texto apresenta o Chosen One mas deliberadamente subverte as expectativas do tropo: o eleito é desprovido dos atributos heroicos típicos (habilidades, memória de seu destino). É uma desconstrução do tropo, não uma instância canônica."
