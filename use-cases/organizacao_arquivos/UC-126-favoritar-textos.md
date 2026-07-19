### Caso de Uso: Favoritar textos

**ID:** UC-126  
**Requisito relacionado:** RF-126 (favoritar textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto a ser favoritado existe no projeto.  
**Gatilho:** O usuário clica no ícone de "Estrela / Favorito" no cabeçalho do documento ou no menu de contexto.  

**Fluxo principal:**
1. O usuário clica no ícone de estrela ao lado do título do texto.
2. O sistema altera o status do atributo `favoritado` para `true` no banco de dados.
3. A estrela do cabeçalho preenche-se com a cor amarela.
4. O sistema insere o texto na seção rápida de "Favoritos" no topo do painel de navegação lateral.

**Fluxos alternativos:**
- *Desfavoritar:* O usuário clica novamente na estrela amarela, mudando o status para `false` e removendo o item da lista rápida de favoritos.

**Fluxos de exceção:**
- *Sem internet:* O sistema executa a mudança localmente no cache do navegador e enfileira a sincronização.

**Pós-condições:** A relação de favorito é salva e o atalho de acesso rápido fica disponível na interface lateral.

**Critérios de aceite:**
- [ ] O texto favoritado deve continuar residindo em sua pasta de origem original.
- [ ] O limite de favoritos na barra lateral rápida deve ser ilimitado, suportando rolagem interna.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
