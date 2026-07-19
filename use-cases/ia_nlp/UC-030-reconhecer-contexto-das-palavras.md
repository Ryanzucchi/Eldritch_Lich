### Caso de Uso: Reconhecer contexto das palavras

**ID:** UC-030  
**Requisito relacionado:** RF-30 (reconhecer contexto das palavras)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto está aberto no editor e o processamento de linguagem natural por contexto está ativo.  
**Gatilho:** O usuário clica com o botão direito em uma palavra específica e escolhe "Verificar Sentido/Contexto".  

**Fluxo principal:**
1. O usuário clica com o botão direito sobre uma palavra no texto (ex: "banco") e seleciona "Verificar Sentido/Contexto".
2. O sistema envia a frase circundante (janela de contexto de 3 frases antes e depois) e a palavra em questão para a IA de NLP.
3. A IA analisa as relações sintáticas e semânticas da palavra na oração.
4. O sistema abre uma popover acima da palavra exibindo a definição contextual precisa (ex: classifica "banco" como "instituição financeira").
5. O sistema sugere sinônimos adequados especificamente para aquele sentido no contexto (ex: "instituição", "casa bancária").

**Fluxos alternativos:**
- *Desambiguação automática:* O sistema roda a análise em background no documento e gera links automáticos de termos específicos com base no contexto verificado.

**Fluxos de exceção:**
- *Ambiguidades insolúveis:* Se o contexto for muito curto (ex: frase isolada "Ele foi ao banco"), a IA apresenta as duas classificações mais prováveis com seus respectivos percentuais de certeza e pede para o usuário escolher o sentido pretendido.

**Pós-condições:** O sentido contextual da palavra é classificado e exibido na interface com sugestões de sinônimos contextualizados.

**Critérios de aceite:**
- [ ] A IA deve classificar palavras polissêmicas comuns com acurácia mínima de 90%.
- [ ] A resposta da desambiguação contextual em tempo real deve aparecer em até 1,2 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
