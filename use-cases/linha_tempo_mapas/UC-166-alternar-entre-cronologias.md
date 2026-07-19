### Caso de Uso: Alternar entre cronologias

**ID:** UC-166  
**Requisito relacionado:** RF-166 (alternar entre cronologias)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem pelo menos duas cronologias cadastradas no projeto.  
**Gatilho:** O usuário interage com o dropdown de seletor de timelines.  

**Fluxo principal:**
1. O usuário visualiza a "Linha do Tempo Principal" aberta.
2. O usuário clica no seletor de timelines no topo do painel.
3. O sistema exibe a lista de cronologias ativas no projeto.
4. O usuário clica na cronologia alternativa desejada.
5. O sistema descarrega os eventos anteriores, executa a busca e renderiza os eventos cronológicos da nova linha selecionada.

**Fluxos alternativos:**
- *Comparação Split View:* O usuário clica em "Comparar Timelines" e a tela divide-se verticalmente exibindo as duas linhas do tempo em paralelo para verificação side-by-side.

**Fluxos de exceção:**
- *Erro de rede:* O sistema exibe "Erro ao carregar linha do tempo" e mantém a visualização anterior na tela do usuário.

**Pós-condições:** O painel de timelines exibe a cronologia selecionada pelo usuário.

**Critérios de aceite:**
- [ ] O tempo total de transição visual ao alternar cronologias (até 100 eventos) deve ser menor que 1 segundo.
- [ ] O sistema deve guardar no estado da sessão qual timeline estava aberta por último para restaurar no próximo acesso.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
