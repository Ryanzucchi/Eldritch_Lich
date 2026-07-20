### Caso de Uso: Mapeamento Semântico Local de Progresso (MMS)

**ID:** UC-456  
**Requisito relacionado:** RF-108 (atualizar wiki), RF-194 (quadro de progresso)  
**Ator(es):** Sistema, Usuário (Escritor)  
**Pré-condições:** O sistema de IA local está inicializado. O GMN contém metas com descrições ativas. O usuário está digitando no editor de texto.  
**Gatilho:** O usuário conclui a digitação de um parágrafo (pressiona Enter ou pausa a digitação por mais de 3 segundos).  

**Fluxo principal:**
1. O editor de texto envia o parágrafo recém-escrito para o monitor de digitação assíncrono.
2. O sistema executa o Módulo de Reconhecimento de Entidades Literárias (NER local) para identificar os personagens, locais e objetos contidos no texto.
3. O Módulo de Embeddings Multilíngues converte o parágrafo em um vetor numérico usando o modelo local `multilingual-e5-small`.
4. O sistema calcula a similaridade de cosseno ($S_{cos}$) entre o vetor do parágrafo e os vetores das metas ativas e pendentes no GMN.
5. Se a similaridade $S_{cos}$ ultrapassar o limiar de aceitação (default $\ge 0,72$):
   - O sistema submete o parágrafo e a meta candidata a uma validação zero-shot do modelo de LLM local.
   - O LLM analisa se o acontecimento de fato ocorreu no parágrafo ou se foi apenas planejado/discutido de forma passiva pelos personagens.
6. Confirmada a execução da meta pelo LLM, o sistema altera o status da meta de `PENDENTE` ou `EM_ANDAMENTO` para `CONCLUIDO`.
7. O sistema associa a meta concluída à linha/parágrafo exato do manuscrito através de um hiperlink interno e atualiza silenciosamente o cartão correspondente no Kanban.

**Fluxos alternativos:**
- *Meta não confirmada:* Se a similaridade de cosseno for alta ($\ge 0,72$), mas a validação zero-shot do LLM classificar como discussão passiva (ex: personagem fala *"Amanhã vou matar o dragão"*), o sistema mantém a meta como `PENDENTE`, registrando um log de baixa confiança.

**Fluxos de exceção:**
- *Indisponibilidade de Hardware:* Se o processamento do embedding demorar mais de 1.000ms devido a limitações de hardware local (ex: CPU de baixo desempenho), o sistema pausa o processamento automático em segundo plano e notifica silenciosamente na barra lateral que a indexação inteligente está operando em modo retardado.

**Pós-condições:** O status da meta é alterado de forma automatizada no banco de dados e na interface do Kanban, e o parágrafo é linkado à meta concluída.

**Critérios de aceite:**
- [ ] Todo o pipeline de NER, vetorização e similaridade deve ser assíncrono e rodar em threads separadas (Web Workers ou background workers), sem bloquear o caminho crítico de digitação do editor (latência de input de texto no editor $< 16\text{ms}$).
- [ ] A acurácia geral de detecção em cenários narrativos estruturados em português deve ser de pelo menos 85%.
- [ ] O link para o manuscrito gerado no cartão da tarefa deve posicionar o editor exatamente no parágrafo que disparou a conclusão.

**Prioridade:** Média  
**Complexidade estimada:** Alta
