### Caso de Uso: Gerar palavras-chave automaticamente

**ID:** UC-053  
**Requisito relacionado:** RF-53 (gerar palavras-chave automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O documento possui conteúdo textual escrito.  
**Gatilho:** Salvamento do texto ou acionamento pelo usuário nas ferramentas de metadados.  

**Fluxo principal:**
1. O sistema consome o texto mais recente do documento.
2. A IA identifica e pontua os termos mais relevantes com base em algoritmos de NLP.
3. O sistema atualiza automaticamente o campo "Palavras-chave geradas por IA" nas propriedades do arquivo.
4. O usuário visualiza as sugestões de palavras-chave como tags sugeridas no rodapé do documento e pode aceitá-las com um clique.

**Fluxos alternativos:**
- *Auto-tags:* O sistema adiciona automaticamente as palavras-chave com maior score de relevância diretamente como tags do projeto.

**Fluxos de exceção:**
- *Falha de conexão:* O sistema aguarda até a próxima conexão estável para tentar gerar e preencher as palavras-chave.

**Pós-condições:** Palavras-chave semânticas são geradas e sugeridas nas propriedades do documento.

**Critérios de aceite:**
- [ ] A lista de palavras-chave sugeridas não deve conter duplicatas nem stopwords comuns.
- [ ] A geração automática das palavras-chave deve ser executada de forma assíncrona com latência total < 1,5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média
