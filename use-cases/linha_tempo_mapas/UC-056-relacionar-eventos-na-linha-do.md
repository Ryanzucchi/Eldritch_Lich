### Caso de Uso: Relacionar eventos na linha do tempo

**ID:** UC-056  
**Requisito relacionado:** RF-56 (relacionar eventos na linha do tempo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A linha do tempo selecionada possui pelo menos dois eventos cadastrados.  
**Gatilho:** O usuário gerencia os eventos no painel de timeline.  

**Fluxo principal:**
1. O usuário abre a visualização interativa da linha do tempo.
2. O usuário clica sobre um evento "Evento A" e seleciona "Vincular a...".
3. O usuário arrasta uma linha até outro evento "Evento B" ou seleciona-o a partir de uma lista.
4. O usuário define a relação temporal/lógica entre eles (ex: "Precursor de", "Ocorre simultaneamente a", "Consequência de").
5. O sistema grava o relacionamento temporal no banco de dados e exibe a conexão gráfica na linha do tempo.

**Fluxos alternativos:**
- *Ordenação automática:* Se o usuário alterar a data fictícia de um evento relacionado, o sistema reordena visualmente os eventos na timeline preservando os links de causa-efeito definidos.

**Fluxos de exceção:**
- *Inconsistência cronológica:* Se o usuário vinculou B como consequência de A, mas alterar a data de B para antes de A, o sistema avisa sobre o conflito cronológico mas permite salvar.

**Pós-condições:** Os eventos na linha do tempo ficam vinculados lógica e cronologicamente na base de dados.

**Critérios de aceite:**
- [ ] O sistema deve exibir as conexões causais diretamente na interface visual da timeline.
- [ ] A alteração do relacionamento deve ser sincronizada instantaneamente no banco de dados (< 500ms).

**Prioridade:** Alta  
**Complexidade estimada:** Média
