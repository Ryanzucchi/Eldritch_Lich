# 1 INTRODUÇÃO

## 1.1 Contextualização do Problema

A ficção narrativa, em todas as suas formas e mídias, organiza-se em torno de convenções culturalmente compartilhadas conhecidas como tropos. Um tropo narrativo é uma convenção recorrente que os leitores e espectadores reconhecem intuitivamente como parte do vocabulário da narrativa — o "herói relutante" que inicialmente recusa o chamado à aventura, a "descoberta de identidade secreta" que redefine as relações entre os personagens, o "sacrifício redentor" que transforma a morte de um personagem em legado moral. Essas convenções não são simples clichês: representam estruturas cognitivas profundas que orientam tanto a produção quanto a recepção da ficção.

A plataforma colaborativa TVTropes, com mais de 30.000 tropos catalogados em obras de literatura, cinema, televisão, videogames, quadrinhos e outras mídias, representa a maior ontologia de padrões narrativos disponível ao público. Embora não seja uma fonte acadêmica em sentido estrito, o TVTropes possui aplicações computacionais significativas documentadas na literatura científica (Rodriguez Vidal et al., 2023; García-Sánchez et al., 2020; García-Sánchez et al., 2022), sendo amplamente utilizado como base de anotação para datasets de análise narrativa automática.

A detecção automática de tropos em textos ficcionais é intrinsecamente difícil para sistemas de NLP por múltiplas razões. Primeiro, os tropos são padrões de alto nível de abstração — um tropo como "Bury Your Gays" não pode ser detectado pela presença de palavras-chave específicas, mas apenas pela compreensão da sequência de eventos narrativos, identidades dos personagens envolvidos e consequências dramáticas. Segundo, o mesmo tropo pode ser instanciado de formas textualmente muito diferentes: o tropo "Mentor Death" ocorre tanto em descrições de batalha violenta quanto em mortes silenciosas de velhice. Terceiro, muitos textos apresentam variações, subversões e desconstruções de tropos, que devem ser detectadas como variantes, não como ausências. Quarto, para textos em português, a escassez de corpora anotados com tropos é crítica — praticamente toda a literatura de detecção automática de tropos foi desenvolvida e avaliada em textos em inglês.

## 1.2 Justificativa e Relevância

A detecção automática de tropos tem relevância científica e prática em múltiplas dimensões. Do ponto de vista científico, contribui para a narratologia computacional ao formalizar e automatizar a identificação de estruturas narrativas que os estudos literários identificam qualitativamente há décadas. A conexão entre a morfologia dos contos de Propp, as estruturas actanciais de Greimas e as ontologias computacionais do TVTropes representa uma linha de pesquisa de alta relevância para as humanidades digitais.

Do ponto de vista prático — especificamente no contexto desta pesquisa —, a detecção de tropos em sistemas de apoio à escrita criativa oferece ao escritor um espelho analítico de sua própria obra: permite identificar quais convenções narrativas estão sendo utilizadas (consciente ou inconscientemente), avaliar se elas são adequadas ao gênero e ao público-alvo, e deliberadamente subverter ou reforçar determinados tropos para criar efeitos narrativos específicos. Um sistema que alerta o escritor "este personagem está seguindo o padrão do Chosen One — você pode querer explorar ou subverter essa estrutura" oferece um feedback criativo de alto valor.

## 1.3 Objetivos

**Objetivo Geral:** Propor, desenvolver e avaliar o framework TropeDetector-PT, um sistema híbrido de detecção automática de tropos narrativos em ficção especulativa em língua portuguesa, integrando classificador fine-tuned, ontologia de tropos e verificação por LLM.

**Objetivos Específicos:**
1. Revisar sistematicamente os trabalhos de detecção computacional de tropos, análise de enredo e ontologias narrativas.
2. Construir e disponibilizar uma ontologia de 500 tropos canônicos traduzida para o português com exemplos de ficção brasileira e portuguesa.
3. Propor um pipeline de detecção em dois estágios (local + global) que maximize o F1-score na identificação de tropos de alta e baixa frequência.
4. Analisar as implicações dos achados para o design de sistemas de feedback narrativo para escritores.

## 1.4 Pergunta de Pesquisa

Como sistemas híbridos de detecção de tropos, combinando classificadores fine-tuned com ontologias baseadas no TVTropes e estratégias de few-shot prompting em LLMs locais, podem identificar automaticamente tropos canônicos e emergentes em romances de ficção especulativa em língua portuguesa, e como essa identificação pode ser utilizada para fornecer feedback criativo estruturado a escritores?

## 1.5 Hipóteses

**H1:** O pipeline híbrido de dois estágios (classificador local + verificação por LLM) supera tanto abordagens zero-shot puras quanto abordagens de classificação fine-tuned puras na detecção de tropos em ficção especulativa em português.

**H2:** Tropos de alta frequência (presentes em mais de 5% das obras do corpus) são detectáveis com F1-score superior a 0,65; tropos de baixa frequência (menos de 1% do corpus) apresentam F1-score médio abaixo de 0,50, independente da abordagem.

**H3:** A tradução e adaptação da ontologia TVTropes para o contexto da ficção especulativa em português melhora significativamente a taxa de recall do sistema em relação ao uso direto dos tropos em inglês com tradução automática.

## 1.6 Estrutura do Documento

A tese está organizada em oito capítulos. O Capítulo 3 apresenta o referencial teórico, incluindo os fundamentos da narratologia computacional e o estado da arte em detecção de tropos. O Capítulo 4 descreve a metodologia. O Capítulo 5 apresenta o framework TropeDetector-PT. Os Capítulos 6 e 7 trazem discussão e conclusões.
