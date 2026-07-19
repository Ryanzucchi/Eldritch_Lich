### Caso de Uso: Reconhecer frases

**ID:** UC-017  
**Requisito relacionado:** RF-17 (reconhecer frases)  
**Ator(es):** Sistema  
**Pré-condições:** Um texto contendo orações e pontuações está inserido no editor.  
**Gatilho:** Fim de digitação de parágrafo ou salvamento do documento.  

**Fluxo principal:**
1. O sistema analisa o texto do documento.
2. O sistema aplica regras de divisão de sentenças (Sentence Boundary Disambiguation) com base em pontuações como pontos finais, pontos de exclamação e de interrogação, desconsiderando abreviações comuns.
3. O sistema mapeia os limites (início e fim) de cada frase no texto para análises semânticas, estilísticas e gramaticais subsequentes.

**Fluxos alternativos:**
- *Análise de legibilidade:* Com as frases delimitadas, o sistema calcula o comprimento médio das sentenças para gerar estatísticas de legibilidade (ex: fórmula Flesch-Kincaid).

**Fluxos de exceção:**
- *Uso excessivo de reticências ou pontuações incomuns:* O algoritmo usa regras heurísticas para agrupar pontuações contíguas como delimitadores únicos de frase, prevenindo a criação de frases vazias.

**Pós-condições:** O texto é estruturado internamente em frases lógicas mapeadas para uso em análises avançadas.

**Critérios de aceite:**
- [ ] O sistema deve segmentar frases corretamente com taxa de erro inferior a 3% em textos comuns.
- [ ] A quebra de frases deve ignorar diálogos marcados com travessão ou aspas quando não encerrarem a oração principal.

**Prioridade:** Média  
**Complexidade estimada:** Média
