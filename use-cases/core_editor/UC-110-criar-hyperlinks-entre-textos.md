### Caso de Uso: Criar hyperlinks entre textos

**ID:** UC-110  
**Requisito relacionado:** RF-110 (criar hyperlinks entre textos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto de origem e o texto de destino existem no projeto.  
**Gatilho:** O usuário seleciona uma palavra ou frase no editor de texto e escolhe a opção "Inserir Hyperlink do Projeto".  

**Fluxo principal:**
1. O usuário seleciona a palavra "Muralha" no editor.
2. O usuário pressiona o atalho Ctrl+K.
3. O sistema abre uma caixa de busca de arquivos internos do projeto.
4. O usuário digita "história" e o sistema lista os arquivos correspondentes (ex: "A História da Muralha").
5. O usuário clica sobre o arquivo de destino.
6. O sistema insere um hyperlink inline no formato de link interno markdown `[[A História da Muralha|Muralha]]`.
7. A palavra passa a ser exibida como link sublinhado e clicável no editor.

**Fluxos alternativos:**
- *Navegação rápida:* O usuário clica com a tecla Ctrl pressionada em cima do hyperlink no editor e o sistema abre o arquivo linkado em um novo painel split-view ao lado.

**Fluxos de exceção:**
- *Arquivo de destino excluído:* Se o arquivo linkado for deletado do projeto, o hyperlink passa a ser exibido em vermelho com um aviso de "Link quebrado".

**Pós-condições:** O hyperlink de referência interna é estabelecido no corpo do texto.

**Critérios de aceite:**
- [ ] A criação de links deve ser compatível com a sintaxe de wiki-links (`[[nome_do_arquivo]]`) padrão de mercado.
- [ ] O hyperlink inserido deve ser indexado no banco de dados de conexões de textos.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
