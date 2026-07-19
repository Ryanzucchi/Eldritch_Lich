### Caso de Uso: Criar automaticamente hyperlinks e backlinks

**ID:** UC-113  
**Requisito relacionado:** RF-113 (criar automaticamente hyperlinsk e backlinks)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Existem entidades catalogadas no projeto com nomes oficiais configurados.  
**Gatilho:** O usuário edita o texto e para de digitar (debounce de 3 segundos) ou conclui o salvamento do arquivo.  

**Fluxo principal:**
1. O sistema lê o texto modificado pelo usuário.
2. A IA cruza as palavras do texto com a lista de títulos de arquivos e nomes de entidades cadastrados no projeto.
3. O sistema converte automaticamente a palavra detectada em um hyperlink direcionando para a ficha de entidade ou texto correspondente.
4. O sistema atualiza o índice de backlinks do documento de destino de forma automática.
5. O link e o backlink passam a constar nos relatórios e visualizações do projeto.

**Fluxos alternativos:**
- *Aceitação por hover:* A palavra detectada ganha um sublinhado tracejado azul. Ao passar o mouse, exibe um balão sugerindo a criação do link.

**Fluxos de exceção:**
- *Auto-links indesejados:* Se a palavra for um termo comum que coincide com o nome de uma entidade, o usuário pode clicar no link e selecionar "Desativar auto-link para esta palavra".

**Pós-condições:** Os links internos e backlinks correspondentes são gerados e indexados de forma automatizada no banco de dados.

**Critérios de aceite:**
- [ ] O gerador automático de links não deve sobrescrever formatações manuais ou links externos inseridos pelo usuário.
- [ ] O tempo de processamento dos auto-links deve ser assíncrono e não deve travar a digitação.

**Prioridade:** Média  
**Complexidade estimada:** Alta
