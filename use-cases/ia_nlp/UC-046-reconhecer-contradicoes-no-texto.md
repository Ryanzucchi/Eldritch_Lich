### Caso de Uso: Reconhecer contradições no texto

**ID:** UC-046  
**Requisito relacionado:** RF-46 (reconhecer contradições no texto)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto ativo possui conteúdo e a análise de contradições está ativa.  
**Gatilho:** O usuário clica em "Verificar Contradições" ou o sistema inicia a varredura automática após o salvamento.  

**Fluxo principal:**
1. O sistema envia o texto do documento para a IA de análise lógica de enredo.
2. A IA varre o texto buscando inconsistências factuais internas diretas (ex: no parágrafo 1 diz que o personagem é "cego", no parágrafo 5 diz que ele "leu uma carta").
3. O sistema sinaliza as contradições encontradas sublinhando os trechos conflitantes em amarelo no editor.
4. O usuário clica no trecho sublinhado para abrir um balão contendo a explicação da contradição ("Contradição: O personagem foi descrito como cego no início do capítulo, mas aqui ele lê uma carta").

**Fluxos alternativos:**
- *Marcar como intencional:* O usuário clica em "Ignorar (Contradição Intencional)" no balão explicativo, removendo o sublinhado.

**Fluxos de exceção:**
- *Timeout do modelo LLM:* Caso o processamento da IA falhe ou demore mais de 15 segundos, o sistema desativa a análise de inconsistências e alerta o usuário: "Não foi possível verificar contradições no momento".

**Pós-condições:** As contradições internas detectadas no texto são exibidas de forma clara para correção.

**Critérios de aceite:**
- [ ] O modelo de IA deve justificar detalhadamente o motivo da contradição detectada ao usuário.
- [ ] O sistema não deve impor bloqueio de salvamento ou edição devido às contradições encontradas (deve ser apenas informativo).

**Prioridade:** Alta  
**Complexidade estimada:** Alta
