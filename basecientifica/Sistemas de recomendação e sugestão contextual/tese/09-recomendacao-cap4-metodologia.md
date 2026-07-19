# 4 METODOLOGIA

## 4.1 Paradigma de Pesquisa

A metodologia adotada nesta tese combina **Design Science Research (DSR)** como paradigma construtivo — guiando o design e a avaliação do artefato ContextRec-Writer — com **revisão sistemática** segundo o protocolo PRISMA para fundamentação do referencial teórico. A DSR é adequada porque o valor científico desta pesquisa reside na criação e avaliação de um artefato técnico original, e não na descoberta de fatos ou regularidades empíricas preexistentes.

As cinco etapas da DSR de Hevner et al. foram seguidas: (1) identificação do problema e motivação; (2) definição dos objetivos da solução; (3) design e desenvolvimento do artefato; (4) demonstração do artefato; (5) avaliação e comunicação.

## 4.2 Protocolo de Revisão Sistemática

**Critérios de inclusão:**
- Estudos sobre sistemas de recomendação contextual, escrita assistida por IA, RAG para criação, estudos empíricos de uso de assistentes de escrita ou sistemas de brainstorm criativo.
- Publicados entre 2021 e 2026.
- Apresentam sistema técnico avaliável ou estudo empírico com amostra documentada.

**Critérios de exclusão:**
- Sistemas de recomendação de conteúdo multimídia (música, vídeo) sem relação com escrita.
- Estudos de geração de texto sem componente de recomendação personalizada ou contextual.
- Trabalhos sem texto completo disponível.

Vinte estudos foram selecionados (detalhados na Tabela 3.5 do Capítulo 3), cobrindo: co-escrita humano-IA (7), RAG para criação (3), ferramentas específicas de apoio criativo (3), estudos empíricos (4), surveys (3).

## 4.3 Framework de Avaliação

Para avaliação do ContextRec-Writer, propõe-se um protocolo em duas fases:

### 4.3.1 Fase 1 — Avaliação Offline (Automática)

A avaliação offline usa um corpus de 50 sessões de escrita criativa gravadas (com consentimento), onde as sugestões do sistema são comparadas às referências e materiais que os escritores efetivamente buscaram durante a sessão.

**Métricas de precisão:**
- *Precision@K* — fração das K recomendações apresentadas que coincidem com o que o escritor buscou na sessão real.
- *NDCG@K* (Normalized Discounted Cumulative Gain) — qualidade do ranking das K recomendações, penalizando recomendações relevantes em posições inferiores.
- *MRR* (Mean Reciprocal Rank) — posição média da primeira recomendação relevante.

**Targets de performance:**
- Precision@5 ≥ 0,70 para modo passivo.
- Precision@5 ≥ 0,80 para modo ativo.
- Latência ≤ 500ms para modo ativo em hardware com GPU de 8GB.
- Latência ≤ 2.000ms para modo passivo.

### 4.3.2 Fase 2 — Avaliação com Usuários (Estudo Empírico)

A avaliação com usuários usa um design de estudo crossover com duas condições: (A) ContextRec-Writer com modo passivo e (B) ContextRec-Writer com modo ativo. Cada participante usa ambas as condições (counterbalanced) em sessões de escrita de 60 minutos.

**Variáveis dependentes:**
- Taxa de aceitação de sugestões (% de recomendações aceitas).
- Taxa de interrupção de sessão (% de sugestões que causaram pausa > 5 segundos).
- Percepção de relevância das sugestões (escala Likert 1-7).
- Percepção de autoria (escala de agência criativa, adaptada de Human Agency, 2024).
- Qualidade dos textos produzidos (avaliação cega por especialistas).

**Participantes:** 30 escritores de ficção com experiência mínima de 1 romance publicado ou 3 anos de escrita criativa regular.

## 4.4 Estratégia de Implementação

O ContextRec-Writer é implementado como um módulo de extensão do sistema web de organização de histórias, comunicando-se com: (a) o módulo GUF do FW-PKM (Tese 07) para acesso ao grafo de universo ficcional; (b) o módulo TropeDetector-PT (Tese 08) para detecção de tropos na cena atual; (c) o módulo HNS-PT (Tese 04) para acesso ao resumo narrativo global.

A camada de recomendação opera como um serviço assíncrono em background: as sugestões são pré-computadas enquanto o escritor escreve, de modo que quando o modo ativo é acionado, as sugestões já estejam prontas, minimizando a latência percebida.
