### Caso de Uso: Transcrever chamadas gravadas automaticamente

**ID:** UC-367  
**Requisito relacionado:** RF-366 (transcrever chamadas gravadas automaticamente)  
**Ator(es):** Sistema, IA, Colaboradores  
**Pré-condições:** A gravação da chamada está concluída e o arquivo de áudio/vídeo correspondente está disponível no bucket.  
**Gatilho:** O sistema detecta a finalização do upload do arquivo de gravação.  

**Fluxo principal:**
1. O backend detecta a inserção do arquivo de áudio no bucket de gravação.
2. O sistema inicia o processamento assíncrono de transcrição automática por IA com identificação de oradores (diarização).
3. A IA converte o áudio em texto estruturado com marcas de tempo e nomes de quem fala.
4. Ao concluir, o sistema insere o texto bruto da transcrição no campo de transcrições da ata da reunião.
5. O sistema notifica os organizadores de que a transcrição está pronta para revisão.

**Fluxos alternativos:**
- *Tradução automática:* O usuário clica em "Traduzir Transcrição", e a IA gera uma versão paralela do texto traduzida em outros idiomas cadastrados.

**Fluxos de exceção:**
- *Qualidade péssima de áudio:* Se o sinal de áudio estiver muito ruidoso, a IA destaca trechos problemáticos com marcações de `[Incompreensível]` para revisão manual do organizador.

**Pós-condições:** A transcrição estruturada e com tags de minutagem é salva no banco de dados e anexada à ata.

**Critérios de aceite:**
- [ ] A acurácia média de transcrição (Word Error Rate - WER) de áudios limpos em português deve ser inferior a 12%.
- [ ] O processamento de transcrição de uma chamada de 1 hora deve ser concluído em no máximo 5 minutos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
