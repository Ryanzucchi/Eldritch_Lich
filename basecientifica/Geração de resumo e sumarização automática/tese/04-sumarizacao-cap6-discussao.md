# 6 DISCUSSÃO

## 6.1 Limitações da Proposta

O framework HNS-PT, embora represente uma contribuição original e relevante para a área de sumarização de narrativas ficcionais em língua portuguesa, apresenta um conjunto de limitações inerentes que precisam ser explicitamente reconhecidas e contextualizadas.

**Limitação 1 – Dependência de corpus de fine-tuning:** A qualidade do Sumarizador de Nível Folha (SLF) é diretamente dependente da qualidade e quantidade do corpus de ajuste fino utilizado. O corpus BookSum (Kryściński et al., 2021), embora seja o melhor recurso disponível, é composto exclusivamente de literatura clássica em língua inglesa. A tradução automática desses textos para o português, mesmo com revisão humana, introduz ruídos e inconsistências que podem afetar o desempenho do modelo em textos de ficção contemporânea brasileira. A ausência de um corpus de sumarização de romances ficcionais em português nativo constitui a principal limitação da abordagem proposta.

**Limitação 2 – Capacidade limitada dos SLMs em relação a LLMs proprietários:** A comparação de desempenho entre o HNS-PT (baseado em SLMs locais) e sistemas baseados em LLMs proprietários (GPT-4, Claude 3.5) é inevitavelmente desfavorável ao primeiro em métricas de fluência e informativeness geral (BooookScore, 2023). Essa compensação é aceita explicitamente pela proposta em troca de privacidade, mas é importante que usuários do sistema compreendessem essa limitação de qualidade.

**Limitação 3 – Escopo do GSE:** O Grafo de Estados de Entidades foi projetado para rastrear estados de personagens, locais e objetos, mas apresenta limitações na modelagem de estados mais abstratos, como relações emocionais e motivações psicológicas que evoluem de forma sutil ao longo da narrativa. Essas dimensões ficam fora do escopo de rastreamento automático do sistema proposto.

**Limitação 4 – Avaliação experimental restrita ao corpus disponível:** Na ausência de um corpus de referência para sumarização de romances ficcionais em português, a validação experimental do HNS-PT necessita depender de métricas automáticas e de avaliação humana em escala reduzida, o que limita a generalização das conclusões.

## 6.2 Limitações da Literatura Atual

A análise da literatura revisada revela limitações estruturais que condicionam o estado da arte e que a presente proposta apenas parcialmente endereça:

A ausência de benchmarks específicos para sumarização de ficção em português constitui a lacuna mais crítica da literatura, como identificado na seção 3.4. Sem um corpus de referência anotado por especialistas literários, a comparação sistemática entre abordagens é prejudicada. O trabalho de PublicHearingBR (2024) representa um passo na direção correta, mas seu domínio (audiências públicas institucionais) é distante do universo literário ficcional.

A desconexão entre sistemas de sumarização e sistemas de consistência narrativa é outra limitação notável. Nenhum dos sistemas revisados (DTCRS, CAHM, NexusSum, Plan-Guided, S²tory) incorpora um mecanismo explícito de verificação de consistência interna ao universo ficcional. Os verificadores de consistência existentes (SCORE, 2025; TRACE, 2026) operam em sistemas independentes da sumarização. A integração proposta no HNS-PT (via GSE e VCF) constitui uma contribuição original nessa direção.

## 6.3 Riscos e Desafios Técnicos

**Risco 1 – Deriva de qualidade em romances de grande extensão:** Para romances com mais de 200.000 palavras (como longas sagas de fantasia épica), a árvore de segmentos narrativos pode atingir uma profundidade que degrada progressivamente a qualidade dos resumos de nível superior, à medida que informações dos primeiros capítulos se diluem nas múltiplas camadas de sumarização. Estratégias de recuperação direta (RAG sobre os resumos de nível folha) podem mitigar esse risco, mas não o eliminam completamente.

**Risco 2 – Inconsistências introduzidas pela tradução do corpus de fine-tuning:** O uso de textos traduzidos do inglês para o ajuste fino dos modelos pode introduzir artefatos linguísticos que afetam a qualidade dos resumos gerados para textos ficcionais originais em português. Uma campanha de curadoria humana dos dados de fine-tuning mitigaria esse risco, mas aumenta substancialmente o custo de desenvolvimento.

**Risco 3 – Custo computacional para usuários sem GPU:** O HNS-PT na sua configuração de máxima qualidade requer uma GPU com 8GB de VRAM para operação em tempo aceitável. Usuários sem acesso a hardware com GPU podem experimentar tempos de processamento proibitivos em CPU. A disponibilização de versões quantizadas dos modelos (GGUF, GPTQ) com 4 bits de precisão pode tornar o sistema viável em hardware sem GPU, com custo adicional de qualidade.

## 6.4 Contribuições desta Tese para o Avanço da Área

Esta tese oferece as seguintes contribuições originais para o campo da sumarização automática de narrativas ficcionais:

**Contribuição 1 – Taxonomia dos métodos de sumarização para narrativas longas:** A taxonomia proposta na seção 3.5, organizando os métodos em cinco categorias (Extrativos Baseados em Grafos, Abstrativos Seq2Seq, Híbridos Hierárquicos, RAG-Aumentados e Avaliação/Benchmarking), oferece um framework conceitual original para a literatura, facilitando a comparação e seleção de abordagens por pesquisadores e desenvolvedores.

**Contribuição 2 – Framework HNS-PT:** A proposta de uma arquitetura modular de sumarização hierárquica específica para romances ficcionais em português, com operação local e integração explícita de grafo de estados de entidades para verificação de consistência factual, representa uma solução técnica sem precedente direto na literatura revisada.

**Contribuição 3 – Identificação de lacunas críticas para o português:** A revisão sistemática conduzida documenta formalmente a ausência de recursos e benchmarks específicos para sumarização de ficção em língua portuguesa, constituindo um roadmap para pesquisas futuras na área.

**Contribuição 4 – Design de avaliação para consistência factual literária:** A proposta de métricas e critérios de avaliação que consideram a fidelidade ao universo ficcional interno (não ao mundo real) contribui para o desenvolvimento de protocolos de avaliação mais adequados à especificidade do domínio literário.

