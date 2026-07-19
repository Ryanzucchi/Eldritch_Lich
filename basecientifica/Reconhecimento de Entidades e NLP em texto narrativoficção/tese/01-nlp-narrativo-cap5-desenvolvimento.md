# 5 DESENVOLVIMENTO E PROPOSTA TÉCNICA

A proposta técnica visa consolidar um sistema capaz de realizar a extração semântica profunda de textos narrativos em português, garantindo eficácia na manipulação de aliases, e viabilizando a integração futura em um sistema web focado em organização e edição literária. Este capítulo detalha a arquitetura original, a implementação e as decisões técnicas tomadas, justificando-as com rigor frente ao estado da arte.

## 5.1 Arquitetura do Pipeline NER Literário Híbrido

O pipeline conceitual idealizado baseia-se num sistema de múltiplos estágios. Textos ficcionais são notórios pela variação estílica. Ao invés de forçar um único LLM gigantesco a realizar todo o trabalho de forma imperativa — o que demanda recursos excessivos de hardware —, a arquitetura propõe um esquema de "peneiramento semântico". 

**Estágio 1: NER Local (Baseado em Transformers Leves)**
Inspirados pelos testes de pré-treinamento expostos por Silva e Moro (2024) com o PPORTAL_ner, e no modelo MariNER (SARCINELLI et al., 2025), o texto passa por uma primeira etapa de tokenização através de um BERTimbau otimizado. O objetivo é a alta velocidade e a captação de menções explícitas de entidades de Classe (PERSON, LOCATION, ORG). A vantagem do uso do PPORTAL_ner é sua aderência às nuanças da literatura em português, reduzindo falsos positivos que ocorreriam se modelos treinados em textos jornalísticos fossem aplicados (DEKKER; KUHN; VAN ERP, 2019).

**Estágio 2: Resolução de Correferência de Longa Distância e Aliases**
Uma limitação central nos trabalhos de Brooke, Hammond e Baldwin (2016) foi a manutenção do contexto em romances inteiros. Personagens mudam de estado e designação. Para suprir a necessidade exposta por Vala et al. (2015), o pipeline integra regras narratológicas sugeridas por Jahan et al. (2020). Quando uma entidade nominal parcial ("o conde") é identificada, um modelo secundário retrocede nos parágrafos buscando entidades candidatas através de modelagem Bayesiana similar à descrita teoricamente em Bamman, Underwood e Smith (2014) mas implementada de forma heurística com grafos locais, inspirando-se também no Taggus (CANÁRIO et al., 2025) para consolidar a rede social.

**Estágio 3: Entity Linking Interno (On-the-fly)**
Para evitar que "Maria Silva" e "Sra. Silva" sejam marcadas como nós distintos na ferramenta de *brainstorming* do usuário, implementamos um *Entity Linking* local. Em vez de depender de bases de dados globais como Wikidata (SCHARPF et al., 2022; SCHARPF et al., 2026) que falham em captar personagens originais que o autor acabou de inventar, o sistema cria uma ontologia "em memória". Valemo-nos dos princípios estruturais de leveza do OpenTapioca (DELASALLES et al., 2020) mas voltados a este *Knowledge Graph* efêmero. Esse passo atende parcialmente a metodologia descrita em Sarkar et al. (2025) por Mahānāma, com foco na consolidação interna (intra-documento).

**Estágio 4: Local LLM Ensembles para Casos Ambíguos**
Quando o estágio 2 e 3 falham em um nível de confiança, LLMs locais executam no modelo zero-shot, guiados por Sarcinelli e Silva (2025). Essa abordagem garante altíssima precisão apenas sob demanda computacional estrita.

## 5.2 Justificativa Técnica e Trade-Offs

### 5.2.1 Precisão vs. Custo Computacional
Sistemas baseados em nuvem resolvem desafios de NER com altíssima latência financeira e de rede. Modelos locais (*on-premise* LLMs) sofrem com limites de VRAM. A solução em estágios reduz drasticamente a carga em VRAM, direcionando aos Ensembles (SARCINELLI; SILVA, 2025) apenas as ocorrências com taxa de confiança (softmax) do BERT abaixo de 70%. Isso proporciona uma inferência acelerada em hardware de consumo (ex: Apple Silicon ou NVIDIA de arquitetura Turing/Ampere comuns em estações de trabalho criativas).

### 5.2.2 Generalização vs. Adaptação de Domínio
O MariNER (SARCINELLI et al., 2025) demonstrou que treinar especificamente para o português histórico extrai nuanças perdidas em modelos genéricos. O *trade-off* assumido na nossa arquitetura é sacrificar a eficácia em textos que não são narrativas para super-otimizar o reconhecimento de "papéis" e "protagonistas" (ŁAJEWSKA et al., 2021).

### 5.2.3 Cenário de Uso no Sistema de Organização Web
No aplicativo final, quando o escritor fizer o *upload* de 15 capítulos de seu livro, a arquitetura extrairá o elenco automaticamente, organizando as relações de rede social (DEKKER; KUHN; VAN ERP, 2019; CANÁRIO et al., 2025), apontando inconsistências narrativas e montando dossiês de personagem em *background*, assegurando zero vazamento de IP. A extração de estruturas narrativas gerais (SANTANA et al., 2023) também permite o ranqueamento dos arcos de cada personagem principal, a partir dos marcadores de correferência identificados via as lógicas extraídas de Bamman, Lewke e Mansoor (2020).
