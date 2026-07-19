# Proposta de Skills — Modelagem de personagens, emoção e arco narrativo

Abaixo estão especificadas as skills técnicas extraídas da Tese 05 e de sua base científica correspondente, voltadas ao rastreamento e caracterização computacional de entidades dramáticas.

---

## Skill: `extracao-redes-personagens-portugues`

**Temática de origem:** Modelagem de personagens, emoção e arco narrativo (Tese 05)
**Objetivo:** Extrair a rede social dinâmica de interações entre personagens em textos ficcionais escritos em português, quantificando alianças, rivalidades e papéis narrativos.
**Quando usar (triggers):** Conclusão de cenas, importação de manuscritos, ou visualização do grafo de relações de personagens no painel de worldbuilding.
**Fundamentação científica:** Taggus (Canário et al., 2025), Renard (2024), DialogueRelation (2025), City of Millions (2025).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Identificação e Alias-Clustering:** Rastrear nomes de personagens usando NER literário e agrupar pronomes e apelidos sob um único identificador canônico canônico via resolução de correferência.
2. **Extração de Arestas por Janela Móvel (Co-ocorrência):** Calcular co-ocorrência em janelas móveis de $W = 150$ palavras. Arestas são criadas e pesadas com base na frequência normalizada de aparição conjunta no mesmo parágrafo.
3. **Extração de Arestas por Diálogo Direto:** Identificar marcadores de discurso direto (travessões/aspas). Arestas conversacionais são pesadas com valor duplicado em relação à co-ocorrência passiva, caracterizando interação ativa.
4. **Construção Dinâmica (Snapshots):** Salvar snapshots estruturados do grafo a cada capítulo para permitir a visualização temporal do surgimento de grupos sociais e isolamento de entidades.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Falsas Arestas Globais:** Não mapear arestas com base apenas na presença no mesmo capítulo completo, sob risco de criar conexões espúrias entre personagens que nunca se encontraram (City of Millions, 2025).

**Métricas de sucesso sugeridas:**
- F1-score de identificação de interações válidas (alvo $\ge 86\%$).

**Requisito(s) do projeto relacionado(s):** RF-94 (rede social de personagens), RF-98 (filtrar por período).

**Nível de maturidade da técnica:** Consolidada.

---

## Skill: `rastreamento-arco-emocional-continuo`

**Temática de origem:** Modelagem de personagens, emoção e arco narrativo (Tese 05)
**Objetivo:** Medir e plotar a flutuação emocional (valência e excitação) de um personagem ao longo da linha do tempo da história, mapeando-a a arquétipos dramáticos.
**Quando usar (triggers):** Ao fim da escrita de capítulos ou sob demanda de análise do arco de tensão dramática no editor do escritor.
**Fundamentação científica:** Teodorescu & Mohammad (2023), Continuous Sentiment (2025), Mohammad (2013), Elkins & Chun (2018).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Modelagem Dimensional de Sentimento:** Adotar a escala de Valência (positivo-negativo) e Excitação (ativado-desativado) de Russell.
2. **Extração Tonal por Bloco:** Mapear o contexto linguístico onde o personagem atua (ex.: parágrafo de foco) usando o NRC Emotion Lexicon adaptado para português associado a um classificador BERTimbau-large fine-tuned em literatura.
3. **Filtro de Ironia e Sarcasmo:** Implementar regras locais e classificadores que invertam a polaridade valência caso marcadores estilísticos ou ironia sejam identificados.
4. **Classificação de Arquétipos Dramáticos:** Executar correspondência geométrica de curvas para identificar se a trajetória emocional do personagem encaixa-se em arquétipos clássicos (ex: *Rags to Riches*, *Man in a Hole*, *Icarus*).

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Amortecimento por Janela Excessiva:** Se a janela de suavização da curva for muito longa, as flutuações rápidas e picos emocionais de cenas curtas serão apagadas, gerando curvas planas irrelevantes (Continuous Sentiment, 2025).

**Métricas de sucesso sugeridas:**
- Correlação de Pearson entre a curva calculada e a percepção humana (alvo $\ge 0.72$).

**Requisito(s) do projeto relacionado(s):** RF-150 (arco de emoções).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `geracao-perfis-psicologicos-e-roleplay`

**Temática de origem:** Modelagem de personagens, emoção e arco narrativo (Tese 05)
**Objetivo:** Extrair a ficha de perfil psicológico estruturada de um personagem a partir de seus papéis nos eventos narrativos e preparar a IA para simular conversações in-character com o autor.
**Quando usar (triggers):** Criação/atualização automática de fichas de personagens e interações com chatbot de entrevista literária.
**Fundamentação científica:** MARCUS (2022), ArcANE (2026), AustenAlike (2024).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Extração de Papéis de Evento:** Catalogar ações e classificar o personagem como *Agente* (quem age) ou *Paciente* (quem sofre a ação) nos eventos (MARCUS, 2022).
2. **Derivação de Atributos Psicológicos:** Mapear traços com base na frequência das categorias de ação (ex.: alta taxa de eventos de confronto físico indica agressividade ou bravura; alta taxa de diálogos conspiratórios indica desconfiança).
3. **Montagem da Ficha de Personagem (Markdown):** Alimentar o template JSON/Markdown estruturado com o perfil, metas, medos, evolução do arco emocional e conexões sociais.
4. **Orquestração de Chatbot In-Character (ArcANE):** Injetar a ficha e o histórico lógicos do personagem no prompt de sistema de um LLM local, orientando-o a adotar a persona do personagem para responder a entrevistas do autor.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Drift de Contexto na Conversação:** LLMs agindo como personagens tendem a esquecer fatos descritos na história e alucinar novas relações. O prompt de sistema deve ser blindado com as restrições e snapshots do Grafo de Estados de Entidades (ArcANE, 2026).

**Métricas de sucesso sugeridas:**
- Acurácia factual das características e biografias extraídas (alvo $\ge 90\%$).

**Requisito(s) do projeto relacionado(s):** RF-166 (biografias), RF-167 (ficha estruturada), RF-168 (chatbot interativo).

**Nível de maturidade da técnica:** Emergente/Experimental.
