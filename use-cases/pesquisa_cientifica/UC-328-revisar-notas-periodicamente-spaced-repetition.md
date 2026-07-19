### Caso de Uso: Revisar notas periodicamente (spaced repetition)

**ID:** UC-328  
**Requisito relacionado:** RF-327 (revisar notas periodicamente)  
**Ator(es):** Usuário (Pesquisador/Escritor), Sistema  
**Pré-condições:** Notas atômicas salvas no banco de dados.  
**Gatilho:** O usuário acessa o painel "Revisão Espaçada" ou o sistema gera a fila de revisão do dia.  

**Fluxo principal:**
1. O usuário abre o módulo de revisão de notas.
2. O sistema analisa as datas de revisões anteriores de cada nota e monta a fila de cartões do dia utilizando algoritmo de repetição espaçada (ex: SM-2).
3. O sistema exibe o cartão da primeira nota agendada.
4. O usuário lê e estuda a nota na tela.
5. O usuário clica em um botão de feedback correspondente ao seu nível de recordação (Fácil, Médio, Difícil, Esqueci).
6. O sistema recalcula a nova data de agendamento (afastando o período conforme a facilidade) e grava no banco.
7. O sistema remove o cartão resolvido da lista e carrega a próxima nota.

**Fluxos alternativos:**
- *Revisão temática:* O usuário filtra a revisão para focar apenas em cartões contendo uma tag específica (ex: "física").

**Fluxos de exceção:**
- *Fila de revisão zerada:* Se o usuário já tiver revisado todas as notas agendadas do dia, o sistema exibe a mensagem de parabenização e a fila em branco.

**Pós-condições:** As novas datas de revisão espaçada são gravadas nas respectivas notas atômicas.

**Critérios de aceite:**
- [ ] O cálculo do novo intervalo de revisão deve seguir de forma correta as fórmulas do algoritmo SM-2.
- [ ] O processamento e avanço de cartões devem ser imediatos (< 100ms).

**Prioridade:** Média  
**Complexidade estimada:** Média
