# 7 CONCLUSÃO

## 7.1 Retomada da Pergunta de Pesquisa e dos Objetivos

Esta tese partiu da seguinte pergunta de pesquisa: Como estratégias hierárquicas de sumarização recursiva podem ser adaptadas para processar romances de longa extensão em língua portuguesa, gerando sinopses coerentes em múltiplos níveis de granularidade (parágrafo, capítulo e obra completa) sem perda de fidelidade factual aos fatos do universo ficcional, e com custo computacional compatível com sistemas de uso ativo?

A investigação realizada respondeu a essa pergunta em múltiplas dimensões. A revisão sistemática de literatura demonstrou que, embora estratégias hierárquicas como DTCRS (2026) e CAHM (2025) representem o estado da arte para documentos longos em geral, nenhuma abordagem existente foi desenvolvida e avaliada especificamente para o contexto de romances ficcionais em língua portuguesa. O framework HNS-PT proposto preenche essa lacuna ao integrar segmentação narrativa adaptativa, sumarização hierárquica em três níveis, grafo de estados de entidades e verificação de consistência factual em uma arquitetura modular executável localmente.

## 7.2 Síntese dos Achados Principais

1. **A literatura de sumarização de documentos longos está madura para textos jornalísticos e documentos institucionais, mas carece de adaptações específicas para narrativas ficcionais em português.** Os benchmarks disponíveis (BookSum em inglês, BooookScore) demonstram que mesmo os LLMs mais avançados cometem inconsistências factuais significativas ao resumir romances completos, e nenhum dataset equivalente existe em língua portuguesa.

2. **A integração de grafos de estados de entidades com sistemas de sumarização é uma contribuição original desta pesquisa.** Nenhum dos 20 trabalhos revisados propõe essa integração direta, que permite ao sistema verificar ativamente a consistência das afirmações geradas nos resumos em relação à lógica interna do universo ficcional.

3. **O trade-off entre privacidade e qualidade é real e quantificável.** O uso de SLMs locais em vez de LLMs proprietários implica em sacrifício de qualidade mensurável, mas aceito explicitamente pelo contexto de uso com manuscritos inéditos.

4. **A granularidade multi-nível é essencial para atender às necessidades diversas de escritores.** Autores necessitam de resumos em diferentes granularidades e para diferentes finalidades (memória narrativa, sinopse editorial, logline para submissão), e o HNS-PT foi projetado para atender a todas essas necessidades.

## 7.3 Trabalhos Futuros

Os trabalhos futuros mais relevantes derivados desta pesquisa são:

- **Criação de um corpus de sumarização de romances ficcionais em português:** Este é o passo mais crítico para o avanço da área. Sugere-se uma campanha de anotação colaborativa com escritores e editores de língua portuguesa.

- **Avaliação empírica do HNS-PT com usuários reais:** A validação da arquitetura proposta com escritores em contexto real de uso gerará dados qualitativos e quantitativos sobre a aceitação do sistema e a qualidade percebida dos resumos.

- **Integração com sistemas de detecção de contradição:** A combinação do HNS-PT com frameworks de detecção de inconsistência narrativa (como os revisados em literatura paralela desta pesquisa) pode aumentar significativamente a robustez da verificação de consistência factual do VCF.

- **Suporte a narrativas não lineares:** O HNS-PT foi projetado primariamente para narrativas lineares. Romances com estruturas não lineares (flashbacks, múltiplas linhas temporais paralelas) exigem extensões específicas do módulo de segmentação e do grafo de estados.

## 7.4 Considerações Finais

Esta tese demonstrou que a sumarização automática de romances ficcionais em língua portuguesa é um problema aberto e de alta relevância prática, especialmente no contexto de sistemas digitais de apoio à escrita criativa. A ausência de recursos específicos para o português ficcional constitui uma oportunidade de pesquisa significativa para a comunidade de PLN brasileiro. O framework HNS-PT proposto oferece uma base técnica sólida para a implementação de funcionalidades de memória narrativa e geração automática de sinopses em sistemas de organização de histórias, respeitando o requisito fundamental de privacidade dos dados do autor.

---

## Sumário de Páginas por Capítulo

| Capítulo | Título | Páginas Estimadas |
|----------|--------|-------------------|
| Cap. 0 | Capa e Folha de Rosto | 2 |
| Cap. 1 | Resumo e Abstract | 3 |
| Cap. 2 | Introdução | 7 |
| Cap. 3 | Referencial Teórico e Revisão Sistemática | 22 |
| Cap. 4 | Metodologia | 8 |
| Cap. 5 | Desenvolvimento e Proposta Técnica | 14 |
| Cap. 6 | Discussão | 6 |
| Cap. 7 | Conclusão | 3 |
| Cap. 8 | Referências Bibliográficas | 5 |
| **Total** | | **70** |

