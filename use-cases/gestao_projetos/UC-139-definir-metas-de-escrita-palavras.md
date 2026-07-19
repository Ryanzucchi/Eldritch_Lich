### Caso de Uso: Definir metas de escrita (palavras/dia)

**ID:** UC-139  
**Requisito relacionado:** RF-139 (definir metas de escrita)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário deseja gerenciar seu progresso e ritmo de escrita.  
**Gatilho:** O usuário clica em "Definir Metas de Escrita" no painel de estatísticas ou configurações.  

**Fluxo principal:**
1. O usuário acessa o painel de produtividade.
2. O usuário clica em "Adicionar Nova Meta".
3. O sistema solicita: Tipo de Meta, Quantidade de Palavras Alvo (ex: 500 palavras/dia), Data Limite e Documentos elegíveis.
4. O usuário configura a meta e confirma.
5. O sistema grava a meta no banco de dados e adiciona uma barra de progresso visual no rodapé do editor de texto principal.

**Fluxos alternativos:**
- *Meta de prazo final:* O usuário define uma meta de entregar um livro de 80.000 palavras em 3 meses. O sistema calcula automaticamente a cota diária necessária.

**Fluxos de exceção:**
- *Valores inválidos:* Se o usuário inserir uma meta de zero ou palavras negativas, o sistema impede a gravação e notifica sobre o valor inválido.

**Pós-condições:** A meta é ativada no sistema de monitoramento de produtividade e a barra de progresso correspondente é exibida no editor.

**Critérios de aceite:**
- [ ] A barra de progresso da meta diária no editor deve atualizar em tempo real à medida que o usuário digita novas palavras.
- [ ] Ao atingir 100% da meta diária, a barra de progresso deve mudar de cor e exibir uma mensagem animada de conquista discreta.

**Prioridade:** Alta  
**Complexidade estimada:** Média
