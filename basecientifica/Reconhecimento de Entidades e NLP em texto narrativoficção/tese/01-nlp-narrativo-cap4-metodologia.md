# 4 METODOLOGIA

A estratégia metodológica adotada nesta tese caracteriza-se como um esforço delineado sob o paradigma de *Design Science Research* (DSR), acoplada ao protocolo PRISMA (*Preferred Reporting Items for Systematic Reviews and Meta-Analyses*) para a condução do mapeamento sistemático prévio.

## 4.1 Abordagem: Design Science Research e PRISMA

A *Design Science Research* fundamenta a construção de artefatos que resolvam problemas práticos, iterando entre a base de conhecimento e as necessidades de aplicação. O artefato proposto nesta pesquisa é um *pipeline* algorítmico e arquitetural para NER em literatura.

A revisão sistemática seguiu o fluxo PRISMA para consolidar a base teórica restrita aos 20 artigos cruciais definidos, incluindo as produções fundamentais sobre NER literário (BAMMAN; UNDERWOOD; SMITH, 2014; SILVA; MORO, 2024) e técnicas avançadas de isolamento (ŁAJEWSKA et al., 2021). Os critérios de inclusão envolveram estudos empíricos sobre PLN aplicado à literatura e extração de redes sociais e narrativas (DEKKER; KUHN; VAN ERP, 2019; SANTANA et al., 2023).

## 4.2 Proposta Metodológica: O Pipeline Híbrido

O método experimental pauta-se no desenvolvimento iterativo de um pipeline que combina diferentes vertentes taxonômicas (discutidas no capítulo anterior):
1. **Fase de Extração Primária**: Utilização de modelos *Transformer* afinados (*fine-tuned*) sobre o corpus PPORTAL_ner (SILVA; MORO, 2024), auxiliado por adaptações advindas do MariNER para o português (SARCINELLI et al., 2025).
2. **Fase de Resolução Narratológica**: Módulo de resolução de correferências adaptado das diretrizes metodológicas de Bamman, Lewke e Mansoor (2020) e algoritmos narratológicos (JAHAN et al., 2020).
3. **Módulo de *Entity Linking***: Uso de algoritmos baseados na estrutura do OpenTapioca (DELASALLES et al., 2020) com *matching* flexível, para ligar variantes nominais à entidade central criada durante o voo (*on-the-fly*).
4. **Verificação Zero-Shot**: Uso de pequenos LLMs locais (Llama 3 8B ou similar, *on-premise*) atuando como *ensemble* para validar ambiguidades complexas sem ferir a privacidade, respaldado por Sarcinelli e Silva (2025).

## 4.3 Procedimentos de Avaliação

O artefato é validado empiricamente em uma amostra cega de romances históricos e contemporâneos que simulam o input típico de um aplicativo web para escritores.
As métricas utilizadas para aferir a validade técnica do modelo incluem o Precision, Recall e o F1-Score, avaliados separadamente para personagens principais e personagens de cauda longa (secundários e obscuros), emulando as medições de Vala et al. (2015). Avalia-se também a velocidade de inferência e a viabilidade da execução isolada (sem rede externa) da aplicação.
