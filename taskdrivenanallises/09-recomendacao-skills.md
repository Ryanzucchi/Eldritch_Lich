# Proposta de Skills — Sistemas de recomendação e sugestão contextual

Abaixo estão especificadas as skills técnicas extraídas da Tese 09 e de sua base científica correspondente, focadas na co-criação equilibrada humano-IA e preservação de autoria.

---

## Skill: `vetorizacao-e-contexto-de-escrita`

**Temática de origem:** Sistemas de recomendação e sugestão contextual (Tese 09)
**Objetivo:** Compilar dinamicamente o estado atual da escrita de um autor em um vetor de contexto unificado (CAC) para alimentar os motores de busca e recomendação.
**Quando usar (triggers):** Ao concluir um parágrafo no editor de texto ou disparar atalhos de sugestão.
**Fundamentação científica:** RecSys Survey (2022), Sequential RecSys (SEQUENTIAL RECSYS GROUP, 2021), SCORE (SCORE GROUP, 2025).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Embedding Textual Recente ($c_1$):** Vetorizar as últimas 512 palavras escritas no editor através do modelo de embeddings local para capturar tom, estilo e o assunto em andamento.
2. **Extração de Estado Narrativo ($c_2$):** Consultar o banco de dados de grafos local (GUF) para identificar quais nós de personagem e local estão marcados como ativos na cena atual.
3. **Mapeamento de Posição Estrutural ($c_3$):** Calcular a porcentagem de conclusão da obra (0 a 100%) para dar pesos diferentes a tropos de início, clímax ou desfecho.
4. **Log de Feedback do Usuário ($c_4$):** Processar as ações de aceitação e rejeição das últimas 100 sugestões de IA para calibrar a tendência de estilo preferencial do autor.
5. **Combinação de Variáveis:** Executar a compilação assíncrona do vetor composto $\mathbf{c} = f(c_1, c_2, c_3, c_4)$ em background de forma debounced para não degradar a taxa de quadros (FPS) da renderização do editor.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Processamento Síncrono no Editor:** Processar a compilação e cálculo de embeddings síncronos a cada tecla pressionada introduz latência severa na digitação (lag), quebrando a usabilidade básica da ferramenta. O worker de compilação de contexto deve operar de forma puramente assíncrona e desacoplada (RecSys Survey, 2022).

**Métricas de sucesso sugeridas:**
- Latência de compilação do vetor CAC (alvo $< 50\text{ms}$).

**Requisito(s) do projeto relacionado(s):** RF-30 (contexto implícito), RF-81 (sugestões inline).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `recomendador-hibrido-literario`

**Temática de origem:** Sistemas de recomendação e sugestão contextual (Tese 09)
**Objetivo:** Projetar motores de recomendação de enredo e referências literárias fundindo buscas relacionais, vetoriais e de grafos com RRF.
**Quando usar (triggers):** Processamento de solicitações de nomes, ganchos de enredo e referências bibliográficas do autor.
**Fundamentação científica:** CreativeRAG (2025), LitSearch (2024), DraftRec (2024), GraphStory (2026).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Tri-Busca Paralela:** Lançar três buscas independentes usando o vetor CAC como entrada: (a) similaridade de cosseno em base de obras de referência; (b) travessia de nós no grafo do universo (GUF); (c) busca vetorial nas notas de worldbuilding do próprio autor.
2. **Interseção e Filtro de Conflitos:** Antes de fundir as recomendações externas de outras obras, filtrar e substituir nomes de entidades externas para evitar colidir com nomes do GUF do autor (ex.: sugerir um nome de personagem de romance parceiro que já pertença a um vilão na obra atual).
3. **Ajuste Ponderado de RRF (Reciprocal Rank Fusion):** Combinar os rankings com pesos assimétricos baseando-se no tipo de requisição (ex: pesos maiores no GUF para sugestão de rumos de trama; pesos maiores em notas de RAG para consultas de mistério e regras mágicas).

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Recomendação Inconsistente:** Fornecer ganchos de enredo de bases de dados externas de forma crua, sem verificar a consistência em relação ao grafo de mundo (GUF) do autor. Isso introduz inconsistências lógicas que frustram romancistas. Toda recomendação externa deve ser auditada e restrita pelas triplas relacionais locais (CreativeRAG, 2025).

**Métricas de sucesso sugeridas:**
- Precision@5 em modo ativo (alvo $\ge 0.80$).
- Latência de recomendação de ganchos (alvo $< 500\text{ms}$).

**Requisito(s) do projeto relacionado(s):** RF-175 (sugestões contextuais), RF-176 (sugerir ganchos).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `design-de-interacao-nao-intrusivo-para-ia`

**Temática de origem:** Sistemas de recomendação e sugestão contextual (Tese 09)
**Objetivo:** Implementar políticas de interface do usuário (UI) para assistentes de escrita baseados em IA que preservem o estado de flow criativo e a sensação de posse (ownership) do manuscrito.
**Quando usar (triggers):** Exibição de autocompletes, balões de diálogo, painéis laterais de sugestões e modais de brainstorm no editor.
**Fundamentação científica:** Wordcraft (Ippolito et al., 2022), CoAuthor (2022), CreativeFlow (2024), Human Agency (2024).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Sidebar Passiva por Padrão:** Configurar o sistema para exibir sugestões em painel lateral (sidebar) sem animações intrusivas ou pop-ups. O painel atualiza em silêncio absoluto no final de parágrafos.
2. **Gatilhos de Modo Ativo Explícitos:** Permitir sugestões flutuantes (popups) no cursor de digitação somente se ativados por gatilhos textuais predefinidos do autor (ex: `[nome?]`, `[ref?]`).
3. **Escrita Interativa de Ideias (Brainstorm):** Criar uma interface dedicada separada para sessões de brainstorming, aplicando técnicas estruturadas como inversão de premissas e SCAMPER de forma interativa.
4. **Fechamento Automático sob Atividade:** Fechar balões de sugestão imediatamente se o autor ignorar o painel e continuar digitando, limpando a área visual para manter o foco criativo.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Perda de Sensação de Autoria (Sense of Ownership):** Gerar continuações textuais automáticas longas e proativas (estilo "escrever pelo usuário") frequentemente faz com que romancistas profissionais sintam que a história não lhes pertence mais, induzindo à alienação e abandono da ferramenta. A IA deve sugerir insumos secundários (nomes, tropos, referências, caminhos lógicos), deixando a redação final da prosa sempre sob controle humano (Human Agency, 2024).

**Métricas de sucesso sugeridas:**
- Taxa de abandono ou interrupção de escrita sob exibição de sugestões (alvo $\le 5\%$).
- Índice de agência criativa declarada de escritores (alvo $\ge 6/7$ na escala Likert).

**Requisito(s) do projeto relacionado(s):** RF-33 (sugestões sidebar), RF-81 (sugestões inline), RF-193 (brainstorm interativo).

**Nível de maturidade da técnica:** Consolidada.
