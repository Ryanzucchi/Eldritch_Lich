### Caso de Uso: Mover textos entre pastas

**ID:** UC-012  
**Requisito relacionado:** RF-12 (mover textos entre pastas)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto já está em uma pasta e existe outra pasta de destino no projeto.  
**Gatilho:** O usuário arrasta o texto de uma pasta para outra na árvore de arquivos, ou usa a opção "Mover para Pasta".  

**Fluxo principal:**
1. O usuário clica com o botão direito sobre o texto e clica em "Mover para...".
2. O sistema exibe um modal contendo a árvore de pastas e subpastas disponíveis no projeto.
3. O usuário clica na pasta destino e confirma em "Mover".
4. O sistema atualiza o `id_pasta_pai` do texto para o ID da nova pasta destino.
5. O sistema remove o texto da visualização sob a pasta antiga e o insere na nova pasta na barra de navegação lateral.

**Fluxos alternativos:**
- *Arrastar e soltar direto:* O usuário arrasta o texto para fora da pasta antiga e o solta em cima da pasta nova.

**Fluxos de exceção:**
- *Pasta destino não existe:* Se a pasta de destino tiver sido excluída por outro colaborador simultaneamente, o sistema exibe "Esta pasta de destino já não existe. Atualizando lista de pastas..." e cancela a operação.

**Pós-condições:** O texto é realocado com sucesso na nova pasta hierárquica.

**Critérios de aceite:**
- [ ] A atualização do parentesco da pasta no banco de dados deve ocorrer em menos de 500ms.
- [ ] O menu de seleção de pasta no modal deve refletir a hierarquia de pastas completa e atualizada em tempo real.
- [ ] O usuário deve poder mover múltiplos textos selecionados de uma vez só (seleção múltipla e movimentação em lote).

**Prioridade:** Crítica  
**Complexidade estimada:** Média
