### Caso de Uso: Analisar arco emocional do texto por capítulo

**ID:** UC-148  
**Requisito relacionado:** RF-148 (analisar arco emocional do texto por capítulo)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto do capítulo possui conteúdo escrito e a IA de análise de sentimento está ativa.  
**Gatilho:** O usuário seleciona a aba "Gráfico Emocional" do capítulo.  

**Fluxo principal:**
1. O usuário clica na aba de análise de sentimento do capítulo.
2. O sistema divide o texto do capítulo em parágrafos e envia cada trecho para um pipeline de IA de classificação emocional.
3. O sistema calcula a trajetória das emoções ao longo do texto.
4. O sistema renderiza um gráfico de linha temporal de sentimentos, onde o eixo X representa os parágrafos do texto e o eixo Y representa a valência emocional.
5. O usuário visualiza as transições de tom do capítulo.

**Fluxos alternativos:**
- *Múltiplos capítulos:* O usuário seleciona uma pasta de arco narrativo completo e visualiza o arco emocional consolidado do livro inteiro por capítulo.

**Fluxos de exceção:**
- *Textos sem carga dramática:* Em textos puramente de Worldbuilding sem carga dramática, o gráfico é exibido linear e predominantemente como "Neutro".

**Pós-condições:** O gráfico do arco de sentimento do capítulo é apresentado ao usuário.

**Critérios de aceite:**
- [ ] O sistema de análise de sentimento deve ser calibrado para reconhecer nuances literárias como ironia e descrições poéticas melancólicas.
- [ ] O processamento do arco de sentimento do capítulo deve ser executado em menos de 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
