# 4 METODOLOGIA E VETORES ESTILÍSTICOS

## 4.1 Método de Pesquisa (DSR)

Esta tese adota a **Design Science Research (DSR)** como método de condução científica, focando na concepção, no desenvolvimento e na avaliação rigorosa do framework **StyleGuard-PT**. A validação é realizada de maneira híbrida, contemplando testes quantitativos automáticos (métricas linguísticas e consistência sob simulação de erros) e um estudo de percepção de qualidade com especialistas em teoria literária.

## 4.2 Métricas Cognitivo-Literárias Propostas para o Português

O framework StyleGuard-PT quantifica o estilo de um texto literário através de um vetor de características estilísticas $\mathbf{v}_{estilo} = [m_1, m_2, m_3, m_4, m_5, m_6]$, cujas métricas são detalhadas abaixo:

1.  **Densidade Lexical ($m_1$):** Mede a riqueza do vocabulário através da razão Type-Token Ratio (TTR) corrigida (fórmula de Guiraud):
    $$TTR_{Guiraud} = \frac{V}{\sqrt{N}}$$
    onde $V$ é o número de palavras únicas (tipos) e $N$ é o número total de palavras (tokens). Limiares literários típicos em português situam-se na faixa de $[6.5, 8.5]$ para fragmentos de 500 palavras.
2.  **Complexidade Sintática ($m_2$):** Mede a profundidade média da árvore de dependência sintática do parágrafo, extraída pelo parser SpaCy (modelo `pt_core_news_lg`), quantificando o grau de subordinação oracional.
3.  **Variabilidade de Extensão de Frase ($m_3$):** Desvio padrão do número de palavras por frase. Em textos literários de qualidade, a variação de ritmo é alta (frases curtas justapostas com períodos longos), enquanto textos gerados por IA pura tendem a apresentar variação baixa (frases uniformes).
4.  **Uso de Voz Passiva e Gerundismo ($m_4$):** Razão de construções passivas analíticas e gerúndios por total de verbos. Valores altos indicam decalque sintático inadequado da língua inglesa.
5.  **Distância Estilística Cosine ($m_5$):** A distância de cosseno entre a média dos embeddings das sentenças do texto gerado e a média das sentenças do corpus de referência do próprio autor:
    $$D_{cos}(\mathbf{u}, \mathbf{w}) = 1 - \frac{\mathbf{u} \cdot \mathbf{w}}{\|\mathbf{u}\| \|\mathbf{w}\|}$$
6.  **Densidade de Tropos Detectados ($m_6$):** Frequência de tropos narrativos por capítulo identificados pelo classificador *TropeDetector-PT* (Tese 08).

## 4.3 Protocolo de Avaliação Humana (Estudo Duplo-Cego)

Para validar a qualidade da escrita refinada pelo StyleGuard-PT, foi estruturado um experimento com 15 avaliadores humanos (críticos literários, linguistas e escritores profissionais):

*   **Corpus de Teste:** 30 trechos narrativos de 500 palavras gerados em português em duas condições distintas:
    *   *Condição Controlada (One-shot):* Geração direta usando prompt com instrução detalhada de estilo.
    *   *Condição Experimental (StyleGuard-PT):* Texto gerado e posteriormente refinado pelo pipeline do StyleGuard-PT.
*   **Protocolo:** Os avaliadores receberam os textos sem identificação do sistema gerador e responderam a um questionário baseado em escala Likert de 1 (insatisfatório) a 5 (excelente) sob quatro critérios:
    1.  *Coesão de Tom:* O texto mantém a mesma voz e atitude narrativa do início ao fim?
    2.  *Qualidade da Prosa:* O texto flui de forma natural em português, livre de cacofonias e estruturas traduzidas?
    3.  *Criatividade e Expressividade:* O texto evita clichês e exibe riqueza metafórica?
    4.  *Coerência Factual:* O trecho respeita os dados de personagens e enredo estabelecidos?
*   **Análise Estatística:** Aplicação do teste t de Student para amostras pareadas para verificar se as diferenças de médias de pontuações obtidas nas duas condições possuem significância estatística ($p < 0,05$).
