### Caso de Uso: Organizar texto em pastas

**ID:** UC-010  
**Requisito relacionado:** RF-10 (organizar texto em pastas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Pelo menos uma pasta e um texto existem no projeto. O usuário tem privilégios de escrita.  
**Gatilho:** O usuário arrasta o texto para cima de uma pasta ou escolhe a ação "Mover para Pasta" nas opções do texto.  

**Fluxo principal:**
1. O usuário clica e arrasta o texto no painel de navegação lateral.
2. O usuário posiciona o cursor com o arquivo arrastado sobre a pasta destino desejada.
3. A pasta destino destaca-se visualmente (borda ou cor de fundo diferenciada) sinalizando ser uma dropzone activa.
4. O usuário solta o botão do mouse.
5. O sistema dispara uma requisição interna atualizando a propriedade `id_pasta_pai` do texto com o ID da pasta destino.
6. A árvore de diretórios é renderizada novamente com a hierarquia atualizada, mostrando o texto recuado dentro da pasta.

**Fluxos alternativos:**
- *Mover via menu de contexto:* O usuário clica com o botão direito no texto, seleciona "Mover para...", navega por um seletor modal com a árvore de pastas do projeto, escolhe a pasta destino e clica em "Confirmar".

**Fluxos de exceção:**
- *Movimentação circular ou inválida:* Se o usuário tentar mover uma pasta para dentro de si mesma ou para dentro de um subdiretório dela mesma, o sistema impede a ação, exibe um toast de erro ("Ação inválida: pasta pai não pode ser filha de si mesma") e retorna a pasta à sua posição original.

**Pós-condições:** A relação hierárquica do texto com a pasta está atualizada no banco de dados e refletida visualmente.

**Critérios de aceite:**
- [ ] O drag and drop deve funcionar de forma fluida nos navegadores homologados (Chrome, Firefox, Edge, Safari).
- [ ] A alteração do parentesco no banco de dados deve ocorrer em menos de 500ms.
- [ ] Ao arrastar um texto sobre uma pasta colapsada e manter por mais de 1,5 segundos, a pasta deve se expandir automaticamente exibindo seu conteúdo.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
