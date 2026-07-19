### Caso de Uso: Explicar por que existe uma contradição

**ID:** UC-075  
**Requisito relacionado:** RF-75 (explicar por que existe uma contradição)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** Uma contradição lógica foi sinalizada no editor ou no relatório geral.  
**Gatilho:** O usuário clica no alerta de contradição ativa e clica no botão "Explicar Contradição".  

**Fluxo principal:**
1. O usuário clica sobre o trecho sublinhado em amarelo (contradição ativa) no editor de texto.
2. O usuário clica em "Explicar".
3. O sistema abre um painel lateral onde a IA detalha o raciocínio silogístico da inconsistência (ex: "Fato A: O personagem John morreu no ano 1020... Fato B: O texto do Capítulo 4 afirma que John está almoçando em 1025... Conclusão: Um personagem morto não pode realizar ações físicas").
4. O sistema exibe botões com ações corretivas sugeridas (ex: "Mudar data", "Editar trecho", "Ignorar").

**Fluxos alternativos:**
- *Explicar contradição de local:* A IA explica a incompatibilidade física/geográfica (ex: "Eles viajaram 500km a cavalo em 2 horas. Tempo de viagem estimado impossível").

**Fluxos de exceção:**
- *Erro de processamento da explicação:* Se o serviço de detalhamento falhar, o sistema exibe a mensagem curta original da detecção.

**Pós-condições:** A explicação lógica detalhada da inconsistência é apresentada ao usuário.

**Critérios de aceite:**
- [ ] A explicação deve citar de forma clara os documentos e trechos em conflito.
- [ ] A justificativa lógica deve ser expressa em linguagem natural clara e objetiva.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
