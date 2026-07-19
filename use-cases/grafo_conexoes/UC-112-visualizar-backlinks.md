### Caso de Uso: Visualizar backlinks

**ID:** UC-112  
**Requisito relacionado:** RF-112 (visualizar backlinks)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Outros documentos do projeto possuem hyperlinks internos apontando para o texto ativo.  
**Gatilho:** O usuário abre um documento e clica na aba "Backlinks" ou "Mencionados em".  

**Fluxo principal:**
1. O usuário abre o arquivo "A Batalha do Moinho".
2. O usuário clica em "Ver Backlinks" no menu lateral do editor.
3. O sistema varre o banco de dados de conexões mapeando todos os arquivos que contêm links ativos apontando para "A Batalha do Moinho".
4. A interface abre um painel exibindo a lista de arquivos de origem.
5. Ao lado de cada item da lista, o sistema renderiza um trecho textual mostrando o contexto em que a menção ocorre no arquivo original.
6. O usuário clica em um item para navegar até a página de origem.

**Fluxos alternativos:**
- *Exibição compacta:* Os backlinks são exibidos em formato de notas de rodapé de forma estática no fim do documento.

**Fluxos de exceção:**
- *Sem referências:* Se nenhum outro documento mencionar o texto ativo, o painel exibe "Nenhum backlink encontrado para este documento".

**Pós-condições:** A lista das fontes que fazem referência ao documento ativo é exibida na interface.

**Critérios de aceite:**
- [ ] O tempo de varredura e retorno dos backlinks para um documento deve ser inferior a 300ms.
- [ ] O trecho contextualizado deve destacar o link de destino em negrito.

**Prioridade:** Alta  
**Complexidade estimada:** Média
