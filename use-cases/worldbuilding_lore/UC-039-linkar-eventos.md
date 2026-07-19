### Caso de Uso: Linkar eventos

**ID:** UC-039  
**Requisito relacionado:** RF-39 (linkar eventos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos estão criados no banco de dados do projeto.  
**Gatilho:** O usuário acessa o painel de edição de eventos ou a linha do tempo.  

**Fluxo principal:**
1. O usuário seleciona um evento (ex: "A Queda do Muro").
2. O usuário clica em "Vincular a outro Evento".
3. O sistema exibe os eventos catalogados.
4. O usuário seleciona o evento de destino e especifica a relação (ex: "Causa de", "Ocorre simultaneamente a").
5. O sistema grava o relacionamento temporal ou causal.
6. O sistema atualiza a visualização da linha do tempo, exibindo as setas de conexão ou agrupando eventos simultâneos.

**Fluxos alternativos:**
- *Causalidade implícita:* Ao vincular um evento como "Causa de" outro, o sistema marca o segundo automaticamente como "Consequência de", garantindo a correspondência reversa.

**Fluxos de exceção:**
- *Inconsistência cronológica:* Se o usuário tentar marcar um evento futuro como causa de um evento passado, o sistema emite um alerta: "Aviso: O evento causa possui uma data posterior ao evento consequência. Deseja prosseguir?".

**Pós-condições:** O relacionamento temporal e causal entre eventos é armazenado no banco de dados.

**Critérios de aceite:**
- [ ] A relação causal deve ser representada graficamente na tela da linha do tempo.
- [ ] O sistema deve validar loops de causalidade impedindo relações cíclicas.

**Prioridade:** Alta  
**Complexidade estimada:** Média
