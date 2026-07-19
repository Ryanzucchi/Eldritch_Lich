### Caso de Uso: Reconhecer diversas línguas

**ID:** UC-015  
**Requisito relacionado:** RF-15 (reconhecer diversas línguas)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O usuário inseriu texto em um idioma suportado (português, inglês, espanhol, francês, alemão, italiano) no editor.  
**Gatilho:** O texto é salvo ou enviado para análise semântica.  

**Fluxo principal:**
1. O usuário digita ou cola um texto no editor.
2. O sistema executa um detector de idioma leve (algoritmo baseado em n-gramas ou biblioteca NLP) em segundo plano.
3. O sistema identifica o idioma dominante do texto com um score de confiança.
4. O sistema configura dinamicamente o dicionário do corretor ortográfico e os modelos NLP correspondentes àquele idioma para análises posteriores.

**Fluxos alternativos:**
- *Identificação incorreta:* O usuário pode ir no menu de configurações do documento e selecionar manualmente o idioma correto caso a detecção automática falhe.

**Fluxos de exceção:**
- *Idioma não suportado:* Se o sistema detectar um idioma para o qual não há modelo NLP ativo, ele exibe um aviso discreto: "Idioma não suportado para análise inteligente. Análises automáticas estarão indisponíveis".

**Pós-condições:** O idioma do texto é indexado nos metadados do documento e as ferramentas associadas (dicionário, IA) são inicializadas adequadamente.

**Critérios de aceite:**
- [ ] A precisão da detecção automática deve ser superior a 95% para blocos de texto contendo mais de 50 palavras nos idiomas principais (PT-BR, EN, ES).
- [ ] A detecção deve ser executada em background e concluída em menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média
