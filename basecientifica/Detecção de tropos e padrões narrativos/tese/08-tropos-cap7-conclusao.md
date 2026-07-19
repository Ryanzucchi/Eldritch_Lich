# 7 CONCLUSÃO

## 7.1 Retomada da Pergunta de Pesquisa

Esta tese investigou como sistemas híbridos de detecção de tropos narrativos — combinando classificadores fine-tuned com ontologias baseadas no TVTropes e verificação por LLMs locais — podem identificar automaticamente padrões narrativos em romances de ficção especulativa em língua portuguesa, e como essa identificação pode ser utilizada para fornecer feedback criativo estruturado a escritores.

A investigação confirmou as três hipóteses centrais: (H1) o pipeline híbrido de dois estágios é superior a abordagens mono-estágio; (H2) há correlação clara entre frequência de tropo no corpus de treinamento e qualidade de detecção; (H3) a adaptação cultural da ontologia para o português melhora significativamente a taxa de recall para tropos com especificidade lusófona.

## 7.2 Síntese Final

O TropeDetector-PT representa a primeira tentativa sistemática de detecção automática de tropos narrativos em ficção especulativa em língua portuguesa. A ontologia PT-500 é o recurso mais duradouro desta pesquisa, fornecendo uma base de conhecimento que transcende o sistema proposto e pode ser utilizado por pesquisadores de humanidades digitais e desenvolvedores de sistemas de apoio à criação literária.

A principal lição desta pesquisa é que a detecção de tropos narrativos é fundamentalmente uma tarefa de compreensão narrativa profunda — não é possível detectar tropos de alta abstração apenas com análise de sentenças isoladas. O contexto global da obra, sua estrutura narrativa, o estado de seus personagens e os eventos que precedem cada cena são indispensáveis para uma classificação correta. O pipeline híbrido de dois estágios, ao integrar o contexto global via resumo narrativo no Estágio 2, é a abordagem que melhor endereça essa necessidade dentro das restrições de privacidade e operação local.

## 7.3 Trabalhos Futuros

**Curto prazo (1-2 anos):**
- Implementação do TropeDetector-PT como módulo integrado ao sistema de apoio à escrita criativa.
- Avaliação empírica com escritores de ficção especulativa em português.
- Criação e disponibilização pública de corpus anotado de tropos em ficção especulativa brasileira.

**Médio prazo (2-4 anos):**
- Expansão da PT-500 para PT-1000, com ênfase em tropos específicos da tradição literária lusófona.
- Desenvolvimento de funcionalidade de detecção de subversões e desconstruções de tropos com maior especificidade.
- Integração com análise de corpus em larga escala para estudo de evolução histórica de tropos na ficção brasileira.

**Longo prazo (4+ anos):**
- Estudo longitudinal sobre o impacto do uso do TropeDetector-PT na qualidade narrativa percebida de obras escritas com apoio do sistema.
- Extensão para análise de roteiros audiovisuais e quadrinhos em português.

## 7.4 Considerações Finais

A ficção especulativa é o gênero literário que mais deliberadamente joga com os tropos da cultura popular, subvertendo, desconstruindo e reinventando convenções para criar significado. Um sistema que torna visíveis esses padrões narrativos — o DNA oculto de cada história — oferece ao escritor um instrumento poderoso de autoconhecimento criativo. O TropeDetector-PT, ao trazer essa capacidade analítica para o contexto da ficção em língua portuguesa, contribui tanto para o avanço científico da narratologia computacional quanto para o enriquecimento das ferramentas disponíveis aos escritores brasileiros e portugueses.

| Capítulo | Páginas Estimadas |
|----------|-------------------|
| 0 – Capa e Resumo | 5 |
| 1 – Resumo e Abstract | 3 |
| 2 – Introdução | 6 |
| 3 – Referencial Teórico | 22 |
| 4 – Metodologia | 10 |
| 5 – Desenvolvimento | 12 |
| 6 – Discussão | 7 |
| 7 – Conclusão | 3 |
| 8 – Referências | 5 |
| **Total** | **73** |
