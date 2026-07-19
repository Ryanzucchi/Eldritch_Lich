### Caso de Uso: Categorizar textos automaticamente

**ID:** UC-042  
**Requisito relacionado:** RF-42 (categorizar textos automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** As categorias do projeto estão configuradas.  
**Gatilho:** O usuário ativa a "Auto Categorização" no menu de configurações ou ao salvar o documento.  

**Fluxo principal:**
1. O sistema lê o conteúdo do texto.
2. A IA classifica o texto em relação às categorias existentes no projeto usando modelos de classificação de texto baseados em contexto.
3. O sistema exibe uma notificação sutil na barra de status: "Sugerida categoria: [Categoria X]. Aceitar?".
4. O usuário clica em "Aceitar".
5. A categoria do documento é salva no banco de dados.

**Fluxos alternativos:**
- *Sugerir nova categoria:* Se o texto não se encaixar em nenhuma categoria existente, a IA sugere a criação de uma nova categoria com um nome correspondente (ex: "Capítulo de Ação").

**Fluxos de exceção:**
- *Nenhuma categoria relevante identificada:* Se o score de confiança da classificação for inferior a 60%, o sistema não faz alterações e mantém o arquivo na categoria atual ou "Sem categoria".

**Pós-condições:** O texto é classificado e associado à categoria mais condizente com seu conteúdo.

**Critérios de aceite:**
- [ ] O classificador deve rodar de forma assíncrona, consumindo o texto a partir do banco de dados pós-salvamento.
- [ ] A precisão de classificação em projetos com categorias distintas deve ser de pelo menos 85%.

**Prioridade:** Média  
**Complexidade estimada:** Média
