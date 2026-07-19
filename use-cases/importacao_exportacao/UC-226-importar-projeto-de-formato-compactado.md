### Caso de Uso: Importar projeto de formato compactado (.zip)

**ID:** UC-226  
**Requisito relacionado:** RF-226 (importar projeto de formato compactado (.zip))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um arquivo ZIP válido contendo a estrutura de dados oficial do sistema.  
**Gatilho:** O usuário clica em "Importar de Backup (.zip)" no Dashboard geral.  

**Fluxo principal:**
1. O usuário clica em "Importar Novo Projeto a partir de Backup (.zip)".
2. O sistema solicita a seleção do arquivo compactado local.
3. O usuário escolhe o arquivo ZIP e clica em importar.
4. O backend faz o upload do arquivo, descompacta os arquivos temporariamente no servidor e valida o arquivo de manifesto.
5. O sistema popula o banco de dados com as tabelas lidas do JSON do pacote e salva os arquivos físicos de capítulos nas novas pastas criadas.
6. O novo projeto importado aparece no Dashboard do usuário.

**Fluxos alternativos:**
- *Substituir projeto ativo:* O usuário importa o ZIP de dentro de um projeto aberto para restaurá-lo e sobrescrever o estado atual em vez de criar um projeto novo.

**Fluxos de exceção:**
- *Versão de manifesto incompatível:* Se o arquivo for de uma versão muito antiga ou de ferramenta incompatível, o sistema cancela a importação e exibe: "Importação abortada: Versão de backup inválida ou não suportada".

**Pós-condições:** A base de dados do projeto e seus respectivos arquivos físicos são restaurados a partir da estrutura compactada importada.

**Critérios de aceite:**
- [ ] O parser deve checar e rejeitar arquivos contendo caminhos relativos maliciosos (Path Traversal Vulnerability) no descompactamento.
- [ ] O tempo total de importação deve ser menor que 10 segundos para projetos padrão.

**Prioridade:** Alta  
**Complexidade estimada:** Média
