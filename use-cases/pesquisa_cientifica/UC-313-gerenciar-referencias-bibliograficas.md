### Caso de Uso: Gerenciar referências bibliográficas

**ID:** UC-313  
**Requisito relacionado:** RF-312 (gerenciar referências bibliográficas)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** O usuário está no módulo de pesquisa científica/acadêmica do projeto.  
**Gatilho:** O usuário clica em "Adicionar Referência Bibliográfica" no painel da biblioteca.  

**Fluxo principal:**
1. O usuário acessa o módulo de "Referências e Citações".
2. O usuário clica em "Nova Referência".
3. O sistema abre o formulário solicitando: Tipo de Obra (livro, artigo, etc.), Título, Autores, Editora/Revista, Ano de Publicação, Volume, Páginas e URL/DOI.
4. O usuário preenche as informações e clica em "Salvar".
5. O sistema valida os campos obrigatórios e insere o registro na tabela de referências.
6. A referência passa a constar na lista da biblioteca de pesquisa do projeto.

**Fluxos alternativos:**
- *Importar via DOI/ISBN:* O usuário insere apenas o código DOI no campo de busca rápida. O sistema realiza busca em bancos de metadados acadêmicos externos e preenche todos os campos do formulário automaticamente.

**Fluxos de exceção:**
- *Falha de conexão:* Se a busca automática pelo DOI falhar por instabilidade de rede externa, o sistema exibe o alerta "Não foi possível carregar os dados. Preencha os campos manualmente" e reabre o formulário.

**Pós-condições:** A referência bibliográfica é registrada e catalogada na base de dados do projeto.

**Critérios de aceite:**
- [ ] O parser deve aceitar a importação em lote de arquivos de exportação bibliográfica comuns (formatos BibTeX, RIS).
- [ ] A gravação da nova referência no banco deve durar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
