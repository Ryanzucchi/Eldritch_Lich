### Caso de Uso: Mencionar usuários em comentários

**ID:** UC-133  
**Requisito relacionado:** RF-133 (mencionar usuários em comentários)  
**Ator(es):** Usuário (Escritor/Colaborador), Sistema  
**Pré-condições:** O projeto possui colaboradores vinculados e o usuário está criando um comentário.  
**Gatilho:** O usuário digita o caractere `@` na caixa de texto de um comentário.  

**Fluxo principal:**
1. O usuário abre a caixa de comentário de um parágrafo.
2. O usuário digita `@`.
3. O sistema exibe um popover flutuante com a listagem de nomes dos colaboradores ativos no projeto.
4. O usuário digita as primeiras letras do nome (ex: `@Ar`) para filtrar a lista.
5. O usuário seleciona o colaborador na lista e pressiona Enter.
6. O sistema insere o marcador do usuário no comentário.
7. O usuário conclui o comentário e clica em "Enviar".
8. O sistema registra o comentário e envia uma notificação diretamente para a conta do usuário mencionado.

**Fluxos alternativos:**
- *Mencionar todos:* O usuário digita `@todos` para enviar um alerta a todos os colaboradores vinculados ao projeto de uma vez só.

**Fluxos de exceção:**
- *Usuário mencionado removido do projeto:* Se o colaborador for removido do projeto posteriormente, o comentário mantém o nome textual da menção, mas o link de perfil correspondente fica desativado.

**Pós-condições:** O comentário com a menção é salvo e a notificação correspondente é enfileirada.

**Critérios de aceite:**
- [ ] A listagem de filtro rápido de usuários citados deve abrir em menos de 100ms após digitar `@`.
- [ ] A menção inserida deve gerar uma notificação por e-mail caso o destinatário não esteja online no momento.

**Prioridade:** Alta  
**Complexidade estimada:** Média
