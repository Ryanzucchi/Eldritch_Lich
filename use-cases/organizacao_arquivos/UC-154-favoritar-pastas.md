### Caso de Uso: Favoritar pastas

**ID:** UC-154  
**Requisito relacionado:** RF-154 (favoritar pastas)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** A pasta existe na árvore lateral do projeto.  
**Gatilho:** O usuário clica com o botão direito na pasta e seleciona "Favoritar Pasta" ou clica na estrela do painel.  

**Fluxo principal:**
1. O usuário acessa a barra lateral e clica no menu de contexto de uma pasta.
2. O usuário seleciona a opção "Adicionar aos Favoritos".
3. O sistema atualiza o atributo `favoritada = true` para a pasta correspondente no banco de dados.
4. O sistema insere um atalho de acesso rápido para a pasta na seção de "Favoritos" no topo do painel de navegação lateral.
5. A pasta passa a exibir um ícone visual de estrela.

**Fluxos alternativos:**
- *Remover de favoritos:* O usuário clica em "Remover dos Favoritos" nas propriedades da pasta, desfazendo o atalho.

**Fluxos de exceção:**
- *Exclusão de pasta:* Se o usuário excluir a pasta favoritada, o sistema remove automaticamente a pasta e seu atalho de favoritos.

**Pós-condições:** O atalho para a pasta favorita é adicionado no painel lateral de acessos rápidos.

**Critérios de aceite:**
- [ ] A pasta exibida nos Favoritos deve manter sua funcionalidade de árvore de arquivos interna (permitindo expandir seus textos).
- [ ] A alteração deve ser gravada no banco de dados local/remoto e renderizada instantaneamente.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
