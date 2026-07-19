### Caso de Uso: Comentar em textos

**ID:** UC-114  
**Requisito relacionado:** RF-114 (comentar em textos)  
**Ator(es):** Usuário (Escritor/Colaborador), Sistema  
**Pré-condições:** O usuário possui acesso de escrita ou leitura no documento aberto.  
**Gatilho:** O usuário seleciona um trecho do texto e clica em "Adicionar Comentário" ou pressiona Ctrl+Alt+M.  

**Fluxo principal:**
1. O usuário seleciona um bloco de texto no editor.
2. O usuário clica no botão "Comentar" ou usa o atalho de teclado.
3. O sistema destaca o trecho selecionado em amarelo e abre uma caixa de texto lateral focada.
4. O usuário digita o comentário e clica em "Enviar".
5. O sistema grava o comentário no banco de dados vinculando ao ID do documento, coordenadas de caractere e ID do usuário.
6. A interface renderiza o comentário no painel lateral de comentários.

**Fluxos alternativos:**
- *Resolver comentário:* O usuário clica em "Resolver". O sistema oculta o comentário da barra lateral e remove o destaque em amarelo do texto.

**Fluxos de exceção:**
- *Texto comentado excluído:* Se o trecho do texto que continha o destaque de comentário for apagado nas edições, o comentário é movido para uma seção especial "Comentários Órfãos".

**Pós-condições:** O comentário é associado ao trecho textual e salvo no banco de dados.

**Critérios de aceite:**
- [ ] O painel lateral deve permitir responder a comentários criando threads de discussão organizadas.
- [ ] A inclusão do comentário deve ser notificada aos coautores do projeto.

**Prioridade:** Alta  
**Complexidade estimada:** Média
