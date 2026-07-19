### Caso de Uso: Associar itens/objetos a locais (localização)

**ID:** UC-283  
**Requisito relacionado:** RF-283 (associar itens/objetos a locais)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de itens e locais cadastradas no projeto.  
**Gatilho:** O usuário edita as propriedades geográficas do item ou o posiciona no mapa.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um local.
2. No painel de itens do local, o usuário clica em "Adicionar Item".
3. O sistema abre a busca de itens do projeto.
4. O usuário seleciona o item correspondente e define o status de localização (Dropdown: Escondido, Perdido, Guardado).
5. O usuário clica em "Salvar".
6. O sistema grava o relacionamento na tabela correspondente no banco de dados.
7. A ficha do local passa a listar o item e a ficha do item exibe a localização correspondente.

**Fluxos alternativos:**
- *Posicionar no atlas:* O usuário arrasta o pino do item da lista lateral e o solta diretamente sobre o mapa geográfico, gravando as coordenadas exatas do objeto.

**Fluxos de exceção:**
- *Local excluído:* A associação correspondente é limpa da ficha do item de forma automática caso o local seja deletado.

**Pós-condições:** A localização geográfica do item é salva na base de dados do projeto.

**Critérios de aceite:**
- [ ] O banco de dados deve manter consistência referencial.
- [ ] Clicar na localização na ficha do item deve abrir a página do local em painel split-view.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
