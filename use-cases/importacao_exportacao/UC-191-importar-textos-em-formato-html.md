### Caso de Uso: Importar textos em formato HTML

**ID:** UC-191  
**Requisito relacionado:** RF-191 (importar textos em formato HTML)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um arquivo `.html` válido contendo texto estruturado.  
**Gatilho:** O usuário seleciona "Importar Arquivo (.html)" no menu do diretório de textos do projeto.  

**Fluxo principal:**
1. O usuário clica com o botão direito em uma pasta do projeto e seleciona "Importar" -> "Arquivo HTML".
2. O sistema abre o seletor de arquivos local.
3. O usuário seleciona o arquivo e confirma.
4. O backend lê o arquivo HTML, executa a sanitização do código (removendo scripts e tags inválidas) e mapeia os elementos semânticos para o formato estruturado do editor.
5. O sistema cria um novo arquivo de texto na pasta correspondente com o nome baseado no título do arquivo importado.
6. O editor carrega o texto formatado (negritos, itálicos, cabeçalhos, listas e tabelas convertidos).

**Fluxos alternativos:**
- *Importação por arrasto:* O usuário arrasta o arquivo `.html` de seu computador diretamente para a árvore de diretórios na interface lateral para iniciar a importação.

**Fluxos de exceção:**
- *Arquivo sem conteúdo legível:* Se o arquivo HTML não contiver elementos de texto úteis, o sistema aborta o carregamento e notifica: "Falha na importação. O arquivo não contém texto legível".

**Pós-condições:** O arquivo HTML externo é importado como um documento de texto ativo no projeto.

**Critérios de aceite:**
- [ ] O parser deve remover tags de estilo inline estranhas e scripts para garantir a integridade do editor.
- [ ] O tempo total de parser e criação do documento de tamanho padrão deve ser menor que 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média
