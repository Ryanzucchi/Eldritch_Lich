# Proposta de Skills — Grafos de conhecimento e visualização de relações

Abaixo estão especificadas as skills técnicas extraídas da Tese 03 e de sua base científica correspondente, com diretrizes operacionais para implementar o FUKG (*Fictional Universe Knowledge Graph*) e sua interface gráfica associada.

---

## Skill: `modelagem-ontologica-worldbuilding`

**Temática de origem:** Grafos de conhecimento e visualização de relações (Tese 03)
**Objetivo:** Estruturar e padronizar os elementos do universo ficcional (personagens, facções, locais, itens) e suas regras lógicas internas em uma ontologia flexível acoplada à estrutura dramática do enredo (obstáculos, temas).
**Quando usar (triggers):** Criação de um novo universo de história, modelagem de regras mágicas ou científicas, e mapeamento de fichas de personagens.
**Fundamentação científica:** WLKG (2023), URW-KG (2024), Narrative World Model (2026), Story-Theme-Obstacle (2025).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Definição da Ontologia FUKG:** Instanciar três superclasses primárias no banco de dados em grafos:
   - **Entidades Perenes (Nodes):** `Character` (atributos, raça, biografia), `Location` (hierarquia espacial), e `Faction` (membros, objetivos).
   - **Propriedades Mutáveis (Edges):** Relações dinâmicas que variam no tempo narrativo (ex: `Possui(João, Espada, [t_start, t_end])`, `Aliado(FacçãoA, FacçãoB, [t_start, t_end])`).
   - **Metadados de Trama (Plot Nodes):** Nós que ligam fatos concretos do mundo a estruturas da narrativa (clímax, clichê, obstáculo do personagem).
2. **Formatação em Quádruplas:** Representar as informações na forma de quádruplas: `(sujeito, predicado, objeto, [t_inicial, t_final])` para garantir que mudanças de estado não apaguem dados históricos.
3. **Indexação por Evento:** Ligar cada mudança na ontologia a um nó de `Evento` correspondente a um capítulo ou cena.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Rigidez Ontológica do Mundo Real:** Evitar o uso exclusivo de ontologias genéricas pré-existentes (como DBpedia ou Wikidata), que são incompatíveis com mundos fantásticos ou ficcionais dotados de regras físicas/biológicas customizadas.

**Métricas de sucesso sugeridas:**
- Cobertura semântica das fichas de lore do universo (alvo 100% de representação gráfica).

**Requisito(s) do projeto relacionado(s):** RF-42 (classificar entidades), RF-44 (linha de conexão), RF-166 (biografias), RF-167 (fichas estruturadas).

**Nível de maturidade da técnica:** Consolidada.

---

## Skill: `extracao-autonoma-relacoes-literarias`

**Temática de origem:** Grafos de conhecimento e visualização de relações (Tese 03)
**Objetivo:** Extrair automaticamente entidades, fatos e relacionamentos a partir de manuscritos textuais livres e notas de brainstorming do autor, reduzindo duplicatas e a propagação de erros.
**Quando usar (triggers):** Ao importar arquivos de manuscritos, ao submeter rascunhos de capítulos concluídos, ou ao salvar notas de brainstorming soltas.
**Fundamentação científica:** KnoBuilder (2025), CTiKG (2026 - Context-aware extraction), Chen et al. (2025 - Joint Extraction).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Pipeline de Extração Conjunta (Joint Extraction):** Utilizar modelos que processem simultaneamente a detecção de entidades e a predição de relações (como Chen et al., 2025), evitando que erros cometidos na marcação de nomes inviabilizem a identificação da aresta correspondente.
2. **Orquestração Multiagente (KnoBuilder):** Empregar três agentes de linguagem em loop de auto-refinamento:
   - **Agente A (Extrator):** Varre o parágrafo e gera as triplas de relações em formato JSON.
   - **Agente B (Resolução de Entidades/Coreferência):** Verifica se a entidade extraída (ex: "Kael") já existe no banco de dados sob apelidos (ex: "O Guerreiro de Ferro") para evitar a multiplicação de nós duplicados.
   - **Agente C (Integrador Ontológico):** Insere as novas relações garantindo a consistência com o contexto prévio do universo.
3. **Extração Ciente de Contexto (CTiKG):** Tratar sentenças complexas contendo negações ou orações aninhadas de modo a qualificar as arestas corretamente (ex: "João pensou que Maria odiava Pedro" não cria a aresta `Odeia(Maria, Pedro)`, mas sim uma relação mental subjetiva).

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Propagação de Nós Duplicados:** A falta de etapas rigorosas de entity linking e resolução de aliases gera grafos com dezenas de nós redundantes para o mesmo personagem, quebrando a integridade do banco (KG Scoping Review, 2026).

**Métricas de sucesso sugeridas:**
- F1-score de extração conjunta de entidades e relações em romances literários (alvo $\ge 85\%$).

**Requisito(s) do projeto relacionado(s):** RF-18 (auto-extrair), RF-107 (identificar entidades), RF-147 (sugerir fusão), RF-108 (atualizar entidades).

**Nível de maturidade da técnica:** Emergente.

---

## Skill: `visualizacao-interativa-time-slicing`

**Temática de origem:** Grafos de conhecimento e visualização de relações (Tese 03)
**Objetivo:** Renderizar redes complexas de personagens e locais de forma legível na Web, mitigando a sobrecarga cognitiva e eliminando o emaranhado visual (*hairball effect*).
**Quando usar (triggers):** Na interface de navegação do grafo de personagens e mapas relacionais do sistema.
**Fundamentação científica:** GuidelineExplorer (2025), Graph Usability Group (2026), Tiddi et al. (2024 - From Nodes to Narratives).

**Conhecimento operacional (o que a skill ensina na prática):**
1. **Fatiamento Temporal (Time-slicing Slider):** Acoplar a renderização do grafo a um componente *slider* de linha do tempo. Exibir estritamente os nós e arestas válidos no intervalo temporal $T$ selecionado pelo autor (usando o marcador temporal das quádruplas).
2. **Agrupamento Semântico (Clustering):** Agrupar nós pertencentes à mesma facção, família ou localização geográfica. Renderizar inicialmente o grupo como um nó consolidado, permitindo que o usuário dê duplo clique para expandi-lo e revelar os subnós.
3. **Layout Force-Directed Otimizado:** Implementar layouts de simulação de forças (ex: d3-force) com restrições paramétricas que previnam o cruzamento excessivo de arestas e maximizem a simetria (GuidelineExplorer, 2025).
4. **Legenda e Código de Cores Semântico:** Colorir arestas por tipo (ex: verde para alianças, vermelho para hostilidades, tracejado para segredos/subtextos) para facilitar a scannabilidade.

**Armadilhas conhecidas (do que a literatura alerta para evitar):**
- **Exibição Global Desfiltrada:** Nunca renderizar o grafo relacional total de um romance de longo formato sem agrupamento e filtros por padrão, pois isso causa sobrecarga visual instantânea e degrada a performance de renderização no navegador do usuário (Graph Usability Group, 2026).

**Métricas de sucesso sugeridas:**
- Taxa de quadros de renderização visual (alvo $\ge 60$ FPS em WebGL/Canvas).
- Tempo médio de carregamento e estabilização de layouts (alvo < 800ms).

**Requisito(s) do projeto relacionado(s):** RF-57 (visualização de grafos), RF-96 (filtrar por personagem), RF-97 (filtrar por tipo), RF-98 (filtrar por período).

**Nível de maturidade da técnica:** Consolidada.
