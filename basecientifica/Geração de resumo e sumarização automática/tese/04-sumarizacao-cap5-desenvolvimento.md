# 5 DESENVOLVIMENTO E PROPOSTA TÉCNICA

## 5.1 Visão Geral da Arquitetura HNS-PT

O framework **Hierarchical Narrative Summarizer for Portuguese (HNS-PT)** é proposto como uma solução técnica original para o problema da sumarização hierárquica de romances ficcionais longos em língua portuguesa, operando integralmente de forma local para garantir a privacidade dos manuscritos. A arquitetura completa é descrita a seguir em seus componentes modulares interconectados.

A concepção da HNS-PT fundamenta-se em três princípios arquiteturais:

1. **Hierarquia adaptativa de granularidade:** O sistema deve ser capaz de gerar resumos em múltiplos níveis, do parágrafo ao romance completo, sem perder a coerência narrativa entre os níveis, inspirado na abordagem hierárquica do CAHM (2025) e do DTCRS (2026).

2. **Consciência de contexto narrativo:** Diferente de sistemas de propósito geral, o HNS-PT mantém um grafo de estados de entidades (personagens, locais, objetos e eventos) atualizado incrementalmente, permitindo detectar inconsistências factuais nos resumos gerados.

3. **Modularidade e execução local:** Cada componente do sistema pode ser substituído ou atualizado independentemente, e toda a cadeia de processamento é executada sem dependência de APIs externas, compatível com o princípio local-first (Kleppmann et al., 2019 *apud* literatura PKM).

## 5.2 Componentes do Sistema

### 5.2.1 Módulo de Ingestão e Pré-processamento

O Módulo de Ingestão é responsável por receber o texto do romance nos formatos suportados (TXT, EPUB, DOCX, Markdown) e realizar o pré-processamento linguístico necessário. As operações incluem:

- **Tokenização e segmentação de sentenças:** Utilizando spaCy com o modelo `pt_core_news_lg` para língua portuguesa.
- **Normalização ortográfica:** Tratamento de variações de grafia históricas (relevante para romances do século XIX e início do XX), inspirado no corpus MariNER (Sarcinelli et al., 2025).
- **Detecção de estrutura:** Identificação automática de capítulos, subcapítulos e cenas a partir de marcadores estruturais (numeração, linhas em branco, pontuação de diálogo).

### 5.2.2 Módulo de Segmentação Narrativa Adaptativa (SNA)

O SNA implementa uma estratégia de segmentação hierárquica dinâmica, construindo uma **Árvore de Segmentos Narrativos (ASN)** com três níveis:

- **Nível 3 (Folhas – Parágrafos e Cenas):** Cada parágrafo ou cena identificada na etapa de pré-processamento constitui uma folha da ASN. A granularidade mínima é configurável pelo usuário (ex.: mínimo de 200 palavras por cena).

- **Nível 2 (Ramos – Capítulos):** Os capítulos explicitamente marcados no texto constituem os ramos. Quando o texto não possui marcação explícita de capítulos, o SNA utiliza um detector de mudança tópica baseado em embeddings semânticos para identificar fronteiras de capítulo.

- **Nível 1 (Raiz – Obra Completa):** O nível superior representa o romance como um todo, cujo resumo final é gerado pela síntese dos resumos de nível 2.

A construção dinâmica da ASN diferencia o SNA de abordagens de chunking fixo, pois os limites dos segmentos são determinados pela estrutura semântica do texto, não por tamanho arbitrário em tokens, o que é fundamental para preservar a coerência narrativa nos resumos (DTCRS, 2026).

### 5.2.3 Módulo de Sumarização Hierárquica Multi-Nível (SHM)

O SHM é o núcleo do framework HNS-PT. Sua arquitetura combina dois modelos complementares:

**Modelo A – Sumarizador de Nível Folha (SLF):** Um modelo de linguagem pequeno (Small Language Model – SLM) com arquitetura encoder-decoder, com 250M-1B de parâmetros, ajustado especificamente para sumarizar cenas e parágrafos ficcionais em português. O ajuste fino (fine-tuning) é realizado sobre o corpus BookSum (Kryściński et al., 2021) traduzido para português com revisão humana e sobre o corpus PublicHearingBR (2024) para capturar características do português brasileiro formal.

O SLF opera com janelas de contexto de até 4.096 tokens, suficientes para processar a grande maioria das cenas individuais de romances. Para cenas excepcionalmente longas, o mecanismo de atenção esparsa é ativado, priorizando as primeiras e últimas sentenças (teoria da proeminência posicional) e as sentenças que contêm nomes de entidades previamente identificadas.

**Modelo B – Sumarizador de Nível Capítulo (SLC):** Um modelo similar ao SLF, mas ajustado especificamente para consolidar múltiplos resumos de nível L1 em um resumo de nível L2. O SLC implementa o mecanismo de mesclagem contextual proposto no CAHM (2025), ajustando dinamicamente os pesos de relevância dos resumos de cenas vizinhas para evitar a perda de dependências de longo alcance entre cenas.

**Modelo C – Sumarizador de Nível Obra (SLO):** Um modelo seq2seq de maior capacidade (3B-7B parâmetros), operando sobre os resumos de capítulos para gerar o resumo completo da obra. O SLO é guiado por um plano narrativo estruturado (inspirado no Plan-Guided Summarization, 2025), que inclui os elementos narrativos essenciais identificados: protagonistas, antagonistas, conflito principal, pontos de virada e resolução.

### 5.2.4 Módulo de Grafo de Estados de Entidades (GSE)

O Módulo GSE mantém um grafo dinâmico de estados das entidades do universo ficcional, atualizado incrementalmente à medida que cada segmento textual é processado. Para cada personagem, local, objeto e evento identificado no texto, o GSE registra:

- **Estado atual:** Vivo/morto, localização atual, posses/bens, relações ativas.
- **Histórico de estados:** Sequência temporal de estados anteriores com referência ao capítulo de mudança.
- **Relações inter-entidades:** Tipo de relação (parentesco, amizade, inimizade, aliança) e polaridade (positiva/negativa/neutra).

O GSE é implementado como um grafo de conhecimento temporal leve, com persistência em SQLite local, compatível com a abordagem local-first. Sua integração com o SHM permite ao Módulo Verificador de Consistência Factual detectar situações em que um resumo gerado contradiz o estado registrado de uma entidade.

### 5.2.5 Módulo de Verificação de Consistência Factual (VCF)

O VCF opera como um auditor pós-geração, verificando cada resumo produzido pelo SHM contra o estado atual do GSE. Quando uma inconsistência é detectada (ex.: o resumo menciona um personagem em um local onde o GSE registra que ele não pode estar), o VCF sinaliza a inconsistência e solicita ao SHM a regeneração do trecho inconsistente com o contexto de estado fornecido pelo GSE como restrição adicional.

### 5.2.6 Módulo de Geração de Sinopse e Logline

Sobre a base do resumo completo de nível L3, o sistema oferece dois geradores especializados:

**Gerador de Sinopse:** Produz um texto descritivo de 150-400 palavras adequado para apresentação em catálogos, plataformas de publicação ou materiais de divulgação. O gerador é ajustado com exemplos de sinopses profissionais de romances da mesma categoria literária, identificada pela análise de metadados do texto.

**Gerador de Logline:** Produz uma frase de uma a duas sentenças que captura a essência do conflito e os personagens centrais do romance. O gerador é inspirado nos sistemas de destilação de espinha dorsal narrativa do S²tory (2026), focando nos elementos de premissa, personagem e objetivo que definem o núcleo dramático.

## 5.3 Fluxo de Processamento End-to-End

O fluxo completo de processamento de um romance pelo HNS-PT segue a seguinte sequência:

1. **Ingestão:** Leitura e normalização do texto bruto.
2. **Pré-processamento:** Tokenização, NER básico para identificação prévia de entidades.
3. **Segmentação:** Construção da ASN com detecção de capítulos e cenas.
4. **Sumarização L1:** Geração de resumos de cenas pelo SLF.
5. **Atualização do GSE:** Extração e registro de estados de entidades por cena.
6. **Sumarização L2:** Consolidação de resumos de cenas em resumo de capítulo pelo SLC.
7. **Verificação VCF:** Verificação de consistência dos resumos L2.
8. **Sumarização L3:** Geração do resumo completo da obra pelo SLO.
9. **Geração de Sinopse e Logline.**
10. **Exportação:** Disponibilização dos resumos em formato JSON e Markdown.

## 5.4 Análise de Trade-offs

### 5.4.1 Fidelidade Factual vs. Concisão

O principal trade-off na sumarização de romances ficcionais é entre a fidelidade factual ao universo do autor e o nível de concisão do resumo. Resumos mais concisos necessariamente omitem detalhes, mas detalhes omitidos podem ser fatos cruciais para a consistência interna do universo. O framework HNS-PT endereça esse trade-off através do GSE: mesmo quando um fato não aparece explicitamente no resumo, ele é preservado no grafo de estados, permitindo consultas específicas sobre estados de entidades a qualquer momento.

### 5.4.2 Custo Computacional vs. Qualidade

A utilização de SLMs locais (250M-1B parâmetros) ao invés de LLMs proprietários de grande escala (GPT-4, Claude 3.5) implica em uma redução esperada de desempenho em métricas de qualidade geral. Os experimentos do BooookScore (Chang et al., 2023) indicam que os melhores LLMs proprietários produzem resumos significativamente mais fluentes e informativos. Entretanto, para o contexto de aplicação — escritores com manuscritos inéditos —, a privacidade dos dados não é negociável. O HNS-PT aceita explicitamente essa compensação de qualidade em troca de privacidade total.

### 5.4.3 Granularidade vs. Velocidade de Processamento

O processamento em três níveis hierárquicos (L1, L2, L3) aumenta o tempo total de processamento em comparação a abordagens de passagem única. Para um romance de 100.000 palavras, estima-se um tempo total de processamento de 15-45 minutos em hardware commodity (GPU de 8GB de VRAM), o que é aceitável para uso em lote (batch), mas inadequado para uso em tempo real durante a escrita. O sistema foi projetado para operação assíncrona em background, atualizando os resumos incrementalmente à medida que novos capítulos são concluídos.

## 5.5 Cenários de Uso no Sistema de Organização de Escrita Criativa

O HNS-PT foi projetado com cenários de uso específicos em mente para um sistema web de organização de arquivos e histórias:

**Cenário 1 – Geração de sinopse automática de rascunho:** O escritor conclui o primeiro rascunho de um capítulo. O sistema, em background, gera automaticamente um resumo L2 do capítulo e atualiza a sinopse geral da obra.

**Cenário 2 – Consulta de memória narrativa:** O escritor está escrevendo o capítulo 20 e não recorda o estado de um personagem secundário no capítulo 5. O sistema, via QFS integrada ao GSE, responde à consulta "Onde estava o personagem X no capítulo 5?" sem necessidade de leitura manual.

**Cenário 3 – Geração de logline para submissão editorial:** O escritor necessita de uma logline para submeter o manuscrito a uma editora. O sistema gera automaticamente múltiplas versões de loglines em diferentes tons (dramático, comercial, literário) baseadas no resumo L3.

**Cenário 4 – Detecção de inconsistência narrativa via resumo:** O VCF sinaliza que o resumo do capítulo 15 contradiz o estado de uma entidade registrado no capítulo 8 (ex.: personagem descrito como morto aparece em ação no capítulo 15). O sistema alerta o escritor antes do salvamento definitivo.

