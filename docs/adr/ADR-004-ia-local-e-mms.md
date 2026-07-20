# ADR 004: Inteligência Artificial Local e MMS (Embeddings + Zero-Shot Local)

## Status
Aprovado

## Data
20 de julho de 2026

## Contexto
O meta-framework TaskWriter-PT exige um Módulo de Mapeamento Semântico (MMS) para concluir metas de enredo em tempo real à medida que o autor digita. Enviar cada parágrafo digitado para APIs de nuvem externas (ex: OpenAI, Gemini) é inviável financeiramente, além de violar a premissa de privacidade local e de operação offline ("local-first").

## Decisão
- As funcionalidades de IA/NLP do MMS rodarão **localmente no dispositivo do usuário** por padrão.
- Para gerar embeddings do texto digitado no manuscrito e compará-lo às metas, utilizaremos o modelo open-source **`multilingual-e5-small`** pré-carregado no navegador via Transformers.js (ou no desktop via runtime embarcado).
- Para evitar falsos positivos de discussões passivas dos personagens no texto, a validação final será executada por um modelo de linguagem leve de classificação (ex: Llama-3-8B ou Phi-3-mini executado localmente via WebGPU/Ollama pelo autor, ou em lote assíncrono no servidor no caso de coautoria em nuvem).
- Nenhuma operação de rede síncrona de IA será executada no caminho crítico da digitação; toda a vetorização e NLP ocorrerá de forma assíncrona por meio de Web Workers em background.

## Consequências
* **Positivas:**
  * Custo operacional zero com APIs de nuvem para as rotinas de escrita do autor.
  * Privacidade absoluta: a prosa do autor nunca sai de sua máquina para fins de indexação ou validação sem consentimento explícito.
  * Baixa latência de digitação (editor responde instantaneamente sem aguardar a IA).
* **Negativas:**
  * Uso de CPU/GPU e memória ram no dispositivo do autor. Dispositivos muito antigos ou navegadores com aceleração por hardware desativada podem ter degradação de performance.
  * Modelos de linguagem locais menores podem apresentar taxas de alucinação ligeiramente maiores que LLMs gigantes em nuvem, exigindo thresholds de similaridade bem calibrados ($\ge 0,72$).
