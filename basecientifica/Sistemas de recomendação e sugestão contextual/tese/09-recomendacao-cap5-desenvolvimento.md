# 5 DESENVOLVIMENTO DO FRAMEWORK CONTEXTREC-WRITER

## 5.1 Arquitetura Geral

O ContextRec-Writer é estruturado em três camadas funcionais que operam sobre o documento em edição e sobre a base de conhecimento ficcional do autor:

### 5.1.1 Camada de Contexto Atual (CAC)

A CAC monitora continuamente o texto sendo escrito e extrai o vetor de contexto de recomendação $\mathbf{c}_{atual}$, composto por:

**c₁ — Embedding textual recente:** Embedding denso das últimas 512 palavras digitadas, gerado pelo modelo multilíngue E5 executando localmente. Captura o tema, tom e estilo da escrita atual.

**c₂ — Estado narrativo:** Vetor derivado do grafo GUF descrevendo: personagens presentes na cena, localização no universo ficcional, tempo narrativo, estado emocional dominante (derivado do módulo de análise emocional da Tese 05) e tipo de conteúdo (diálogo, narração de ação, descrição de ambiente, narração introspectiva).

**c₃ — Posição estrutural:** Posição percentual na obra (0-100%), capítulo atual, e proximidade a marcos estruturais (início, clímax, resolução). Usado para calibrar a relevância de diferentes tipos de sugestão — tropos estruturais são mais relevantes próximo ao clímax; sugestões de worldbuilding são mais relevantes em cenas de exposição.

**c₄ — Histórico de interações:** Vetor de preferências do escritor derivado das últimas 100 interações com sugestões do sistema (aceitas, rejeitadas, modificadas). Garante personalização progressiva ao estilo e preferências do autor.

O vetor composto $\mathbf{c} = f(c_1, c_2, c_3, c_4)$ é atualizado a cada parágrafo concluído (modo passivo) ou sob demanda via gatilho (modo ativo).

### 5.1.2 Camada de Recomendação Híbrida (CRH)

A CRH consulta três fontes complementares de recomendação em paralelo, fusionando os resultados por Reciprocal Rank Fusion (RRF):

**Fonte 1 — Filtragem Colaborativa por Embeddings:** Usa $\mathbf{c}_1$ como query para recuperar trechos similares de uma base de referências curada (obras do mesmo gênero do autor, sem obras privadas de terceiros). A similaridade é calculada por produto interno no espaço de embeddings. Os trechos recuperados são ranqueados por relevância e filtrados para remover conteúdo inconsistente com o GUF do autor (ex.: nomes de personagens da base de referências que conflitem com nomes do universo ficcional do autor).

**Fonte 2 — Navegação no GUF:** Usa $\mathbf{c}_2$ para navegar o Grafo de Universo Ficcional do autor. Para cada entidade presente na cena atual (personagens, locais), o sistema recupera: (a) outras cenas onde essa entidade apareceu, (b) entidades relacionadas que ainda não foram mencionadas na cena (podendo ser sugestões de personagens a introduzir), (c) eventos do GUF que a entidade vivenciou e que têm relevância potencial para a cena atual.

**Fonte 3 — RAG sobre Base de Notas:** Usa $\mathbf{c}_1$ como query para recuperar e sintetizar informações da base de notas de pesquisa do autor (worldbuilding notes, referências bibliográficas, notas de personagem). O RAG usa o FW-PKM (Tese 07) como backend de recuperação e um SLM local para síntese.

**Fusão RRF:** Os resultados das três fontes são fusionados usando o algoritmo Reciprocal Rank Fusion com pesos ajustáveis por tipo de sugestão. Para sugestões de referências, a Fonte 3 recebe peso maior; para sugestões de personagens e enredo, a Fonte 2 recebe peso maior; para sugestões de estilo e cenas análogas, a Fonte 1 recebe peso maior.

### 5.1.3 Camada de Apresentação Adaptativa (CPA)

A CPA gerencia a apresentação das sugestões segundo três modos, com política de apresentação fundamentada nos achados de CreativeFlow (2024):

**Modo Passivo (default):**
- Sugestões exibidas em painel lateral fixo (sidebar) ao lado do editor.
- Atualização silenciosa a cada parágrafo concluído (sem notificação visual no editor).
- O escritor pode consultar o sidebar à vontade, sem pressão.
- 5 sugestões exibidas por categoria (referências, personagens, cenas análogas).
- Indicador visual mínimo (ponto verde) quando novas sugestões estão disponíveis.

**Modo Ativo (por gatilho):**
- Ativado por gatilhos textuais configuráveis pelo escritor: `[nome?]`, `[ref?]`, `[ideia?]`, ou outros.
- Ao detectar o gatilho, exibe popup contextual com 3-5 sugestões específicas para o tipo de gatilho.
- O popup é fechado automaticamente se o escritor continuar digitando (respeitando o flow).
- Latência-alvo: <500ms (sugestões são pré-computadas em background).

**Modo Brainstorm:**
- Ativado explicitamente via atalho de teclado ou botão na sidebar.
- Abre painel lateral expandido com sessão interativa de ideação.
- Usa o contexto atual ($\mathbf{c}$) como semente e aplica técnicas de ideação: (a) analogia forçada (pega o estado atual da narrativa e o conecta com um domínio aleatório para gerar insights inesperados), (b) inversão de premissas (inverte características dos personagens, locais ou situação para explorar alternativas), (c) SCAMPER narrativo (Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse aplicado a elementos da narrativa).
- As ideias geradas são organizadas em clusters temáticos e podem ser salvas nas notas do projeto.

## 5.2 Tipos de Recomendação: Implementação Técnica

### 5.2.1 Recomendação de Referências

Quando o texto menciona um conceito com correspondente factual (detectado por um classificador de "factualidade" que distingue elementos do universo ficcional de elementos do mundo real), o sistema recupera automaticamente documentos relevantes da base de notas do autor (via RAG) e, opcionalmente, de uma base de referências curada pelo sistema.

A detecção de menção a conceito factual usa um classificador NER de entidades do mundo real vs. entidades ficcionais, calibrado para o universo específico do autor (entidades do GUF são classificadas como ficcionais; tudo mais é potencialmente factual).

### 5.2.2 Recomendação de Nomes

Quando o escritor usa um gatilho de nome (`[nome?]` ou equivalente configurável), o sistema gera sugestões de nomes usando:
- Análise fonética dos nomes existentes no GUF (para garantir sonoridade compatível).
- Análise de origem cultural dos personagens existentes (para consistência de estilo de nomeação dentro do universo).
- Base de nomes por cultura, período e gênero (curada e filtrada para excluir nomes já usados no universo).
- Raridade: prioriza nomes memoráveis e distintos dentro do corpus de nomes já usados.

### 5.2.3 Recomendação de Tropos Relacionados

Integrado com o TropeDetector-PT (Tese 08), o sistema identifica os tropos ativos na cena atual e sugere tropos de co-ocorrência típica (com base nas análises do Fantasy Tropes Analysis, 2025 e Genre-Specific Clichés, 2025). A sugestão apresenta: (a) o tropo relacionado, (b) exemplos em outras obras, (c) como poderia se manifestar no universo específico do autor.

### 5.2.4 Recomendação de Cenas Análogas

Recupera da base de referências curada (obras do mesmo gênero) trechos que tratam de situação narrativa similar à cena em escrita (ex.: confronto entre mentor e aprendiz, descoberta de traição, cena de despedida), usando similaridade semântica de embeddings. O objetivo é inspirar o escritor com diferentes formas de tratar a mesma situação.

### 5.2.5 Brainstorm Guiado

Implementação das técnicas de BrainstormAI (2025) com adaptações para o contexto narrativo:
- **Analogia forçada:** "Essa cena é como X no contexto de Y" — conecta a narrativa atual com domínios distantes para gerar insights.
- **Inversão de premissas:** "E se [elemento central da cena] fosse o oposto?" — gera variantes radicalmente diferentes.
- **Pergunta geradora:** Série de perguntas sobre a motivação dos personagens, as consequências possíveis e os elementos não explorados da cena.

## 5.3 Performance e Latência

| Tipo de Sugestão | Modo | Fonte Principal | Latência Estimada (GPU 8GB) |
|-----------------|------|----------------|---------------------------|
| Referências | Passivo | RAG (FW-PKM) | 800ms |
| Referências | Ativo | RAG (pré-computado) | 150ms |
| Nomes | Ativo | Base de nomes + GUF | 200ms |
| Tropos | Passivo | TropeDetector-PT | 1.200ms |
| Cenas análogas | Passivo | Filtragem colaborativa | 400ms |
| Brainstorm | Ativo | SLM + técnicas | 2.000-5.000ms |

As sugestões passivas são pré-computadas em background enquanto o escritor escreve, de modo que quando o modo ativo é acionado (gatilho ou consulta do sidebar), os resultados já estão prontos. O serviço de background é gerenciado por um worker assíncrono que opera com prioridade inferior à thread de edição, garantindo que a experiência de escrita nunca seja comprometida pelo processamento de recomendações.
