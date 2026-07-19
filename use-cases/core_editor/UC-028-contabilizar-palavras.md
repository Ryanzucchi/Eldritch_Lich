### Caso de Uso: Contabilizar palavras

**ID:** UC-028  
**Requisito relacionado:** RF-28 (contabilizar palavras)  
**Ator(es):** Sistema  
**Pré-condições:** Um texto está aberto no editor ou selecionado.  
**Gatilho:** Carregamento do documento ou alteração do conteúdo no editor de texto.  

**Fluxo principal:**
1. À medida que o usuário edita o texto, o sistema executa um contador em tempo real em segundo plano (Web Worker).
2. O algoritmo divide o texto utilizando espaços e marcadores de quebra de palavra como delimitadores e conta a quantidade de tokens resultantes.
3. O sistema atualiza o contador de palavras exibido no rodapé do editor de texto em tempo real (ex: "1.234 palavras").

**Fluxos alternativos:**
- *Contagem de seleção:* Se o usuário selecionar um trecho específico do texto com o mouse, o rodapé muda para exibir a contagem do trecho selecionado (ex: "150 de 1.234 palavras").

**Fluxos de exceção:**
- *Textos gigantescos:* Para evitar gargalos de CPU, para textos acima de 500k palavras o sistema executa o contador com throttling de 1 segundo e avisa se houver atraso na atualização do contador.

**Pós-condições:** O número exato de palavras do texto ou do trecho selecionado é exibido no rodapé.

**Critérios de aceite:**
- [ ] A contagem de palavras deve ser feita usando Web Workers para evitar bloqueio da thread principal da interface do usuário.
- [ ] O contador deve ser re-executado instantaneamente (< 50ms) a cada atualização do texto para documentos com menos de 20.000 palavras.
- [ ] Caracteres especiais e tags HTML/rich text do editor não devem ser computados na contagem final de palavras.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa
