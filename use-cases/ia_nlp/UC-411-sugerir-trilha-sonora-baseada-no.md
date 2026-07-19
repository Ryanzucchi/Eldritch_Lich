### Caso de Uso: Sugerir trilha sonora baseada no tom emocional da cena

**ID:** UC-411  
**Requisito relacionado:** RF-406 (sugerir trilha sonora baseada no tom emocional da cena)  
**Ator(es):** Sistema, IA, Usuário (Escritor)  
**Pré-condições:** A cena de texto possui conteúdo escrito no editor.  
**Gatilho:** O usuário clica em "Sugerir Trilha Sonora" nas ferramentas da cena.  

**Fluxo principal:**
1. O usuário acessa a barra lateral da cena e clica em "Sugerir Trilha por Tom".
2. O backend envia o texto da cena para a IA que realiza análise sentimental (detectando tons de suspense, aventura, drama ou mistério).
3. A IA identifica o tom predominante da cena e a intensidade calculada.
4. O sistema realiza busca no banco de mídias de áudio por trilhas instrumentais contendo tags de humor compatíveis.
5. O sistema apresenta uma listagem de 3 faixas com descrição da justificativa de recomendação.
6. O usuário escuta a prévia rápida e clica em "Associar a esta Cena".

**Fluxos alternativos:**
- *Parametrização manual:* O usuário discorda da análise de sentimentos da IA e seleciona manualmente o tom (ex: "Aventura") para filtrar novas sugestões de áudio.

**Fluxos de exceção:**
- *Biblioteca vazia:* Se nenhuma música corresponder ao tom detectado da cena, o sistema avisa na tela e sugere associar links de playlists de repositórios públicos.

**Pós-condições:** A trilha sonora sugerida é vinculada às propriedades de áudio da cena.

**Critérios de aceite:**
- [ ] A análise de sentimento e retorno de sugestões de áudio devem durar menos de 3 segundos.
- [ ] O sistema de áudio deve permitir ouvir a prévia com player integrado na tela de sugestões.

**Prioridade:** Média  
**Complexidade estimada:** Média
