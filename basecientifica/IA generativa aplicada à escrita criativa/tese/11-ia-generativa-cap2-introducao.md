# 2 INTRODUÇÃO

## 2.1 Contextualização do Problema

A inteligência artificial generativa aplicada à linguagem natural avançou substancialmente com o desenvolvimento de grandes modelos baseados na arquitetura Transformer. Essa evolução permitiu que ferramentas de escrita assistida por computador transitassem de corretores ortográficos e preditores de palavras simples para assistentes generativos capazes de criar trechos completos de prosa descritiva, diálogos realistas e propostas de desenvolvimento de tramas.

No entanto, quando se trata de escrita criativa de ficção de longa extensão, os LLMs encontram barreiras no controle de qualidade do texto gerado. A primeira barreira é a **coesão estilística**. Os LLMs são treinados com corpora massivos e heterogêneos de internet, o que faz com que o texto por eles produzido tenda a sofrer flutuações estilísticas drásticas e repentinas. Em uma única página de geração, o modelo pode alternar entre um tom excessivamente formal, clichês de romances vitorianos ou gírias modernas, destruindo a voz do escritor que interage com o sistema.

A segunda barreira é a ocorrência de **alucinações narrativas**. LLMs operam gerando a próxima palavra mais provável estatisticamente com base no contexto recente. Isso faz com que eles frequentemente "alucinem" contradições factuais drásticas em relação ao universo planejado pelo autor, mudando nomes de personagens secundários, alterando o paradeiro de objetos cruciais ou ignorando regras físicas anteriormente definidas para o mundo ficcional.

Por fim, no contexto da escrita em língua portuguesa, há uma carência de ferramentas específicas voltadas ao controle de tom e coesão literária. Os modelos comerciais dominantes do mercado (como GPT-4 ou Claude 3.5) são calibrados predominantemente com base na literatura em inglês, o que faz com que sua escrita gerada em português soe artificial, excessivamente dependente de decalques sintáticos do inglês (como uso abusivo da voz passiva e de gerúndios) e desconectada do ritmo da prosa literária lusófona.

## 2.2 Justificativa e Relevância

Esta tese justifica-se pela necessidade de desenvolver frameworks de processamento que permitam a coautoria humano-IA de alta qualidade sem comprometer a identidade artística e o estilo do escritor. A maioria dos assistentes de escrita baseia-se em pipelines de geração em um único passo (*one-shot generation*), delegando todo o controle de estilo à formulação de instruções no prompt. Essa abordagem mostra-se insuficiente para garantir consistência em obras longas de ficção.

Ao propor métricas cognitivo-literárias quantificáveis e um pipeline híbrido de avaliação e refinamento executado localmente, esta pesquisa contribui para a narratologia computacional e a engenharia de prompts. Isso preserva a propriedade intelectual e a privacidade do autor, ao mesmo tempo em que eleva o nível técnico das ferramentas de suporte ao trabalho editorial na língua portuguesa.

## 2.3 Objetivos da Pesquisa

### Objetivo Geral
Propor, implementar e avaliar o framework **StyleGuard-PT**, um pipeline híbrido de avaliação e refinamento automático de texto projetado para garantir a coesão estilística e a consistência factual em prosas literárias geradas por IA em língua portuguesa.

### Objetivos Específicos
1. Construir um conjunto de métricas de estilo literário (diversidade de vocabulário, complexidade e ritmo sintático, densidade de figuras de linguagem) aplicáveis ao português.
2. Desenvolver um avaliador híbrido de qualidade de texto que combine o cálculo matemático das métricas literárias com a análise de consistência efetuada por um LLM local treinado como crítico literário.
3. Propor um pipeline iterativo de refinamento (*critique-and-refine*) que reescreva trechos problemáticos de texto gerado até que atinjam limiares mínimos de qualidade estilística e factual.
4. Avaliar experimentalmente a qualidade da prosa refinada pelo StyleGuard-PT por meio de avaliações duplo-cegas com especialistas humanos.

## 2.4 Pergunta de Pesquisa

De que modo um pipeline híbrido que associa a extração de métricas quantitativas cognitivo-literárias a rodadas iterativas de avaliação e refinamento por LLMs locais finamente ajustados consegue manter a consistência de tom, a coesão de estilo e a coerência factual de textos ficcionais gerados de forma assistida em português, sem comprometer a latência essencial em tempo de escrita?

## 2.5 Hipóteses

*   **H1:** O uso do pipeline iterativo de refinamento *StyleGuard-PT* resulta em uma melhora estatisticamente significativa na coesão de estilo percebida por críticos literários humanos, com pontuações em escala de qualidade pelo menos 20% superiores às de modelos de geração de passo único.
*   **H2:** A inclusão das métricas cognitivas e de consistência do universo ficcional como restrições ativas no prompt de refinamento reduz em mais de 80% a ocorrência de contradições factuais graves em capítulos gerados de forma semiautomática.
*   **H3:** O processamento local e assíncrono do pipeline de refinamento em hardware de consumo é capaz de atingir tempos de resposta inferiores a 1,5 segundo para blocos de 300 palavras, viabilizando o uso do sistema durante sessões ativas de redação.

## 2.6 Estrutura do Documento

Esta tese está estruturada da seguinte forma: o Capítulo 3 aborda o referencial teórico e a revisão sistemática de vinte artigos recentes sobre avaliação de textos e IA literária. O Capítulo 4 define a metodologia e as métricas. O Capítulo 5 apresenta a arquitetura e detalhes técnicos do StyleGuard-PT. Os Capítulos 6 e 7 analisam os resultados empíricos e expõem as conclusões da pesquisa. O Capítulo 8 reúne as referências no padrão ABNT.
