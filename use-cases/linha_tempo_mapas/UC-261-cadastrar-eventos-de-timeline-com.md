### Caso de Uso: Cadastrar eventos de timeline com múltiplos finais

**ID:** UC-261  
**Requisito relacionado:** RF-261 (cadastrar eventos de timeline com múltiplos finais)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O painel de timelines do projeto está ativo.  
**Gatilho:** O usuário cria ou edita um evento cronológico de enredo ramificado.  

**Fluxo principal:**
1. O usuário abre o painel da Timeline e seleciona "Criar Evento Ramificado".
2. O sistema abre o formulário solicitando: Nome do Evento, Data e descrição do contexto gerador.
3. No final do formulário, o sistema exibe a seção "Finais Possíveis".
4. O usuário adiciona o Final 1 (expondo as consequências e desfecho).
5. O usuário clica em "Adicionar outro final" e preenche o Final 2.
6. O usuário clica em "Salvar".
7. O sistema grava o evento e seus finais vinculados no banco de dados na tabela de eventos ramificados.

**Fluxos alternativos:**
- *Vincular a timelines alternativas:* O usuário define que o Final 1 continua a história na Timeline Principal, enquanto o Final 2 cria uma nova Timeline Alternativa automaticamente.

**Fluxos de exceção:**
- *Datas inconsistentes:* Se as datas de desfecho das ramificações forem anteriores à data de início do próprio evento gerador, o sistema alerta e solicita a correção.

**Pós-condições:** O evento com opções de finais múltiplos é gravado no banco de dados.

**Critérios de aceite:**
- [ ] A interface deve exibir as opções de finais como cartões ou caminhos bifurcados na linha do tempo.
- [ ] O salvamento das ramificações deve ser feito de forma atômica no banco de dados.

**Prioridade:** Média  
**Complexidade estimada:** Alta
