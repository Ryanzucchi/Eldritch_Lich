### Caso de Uso: Importar projetos

**ID:** UC-120  
**Requisito relacionado:** RF-120 (importar projetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um arquivo ZIP válido contendo a estrutura de dados de projeto do sistema.  
**Gatilho:** O usuário clica no botão "Importar Projeto (.zip)" no Dashboard.  

**Fluxo principal:**
1. O usuário clica em "Importar Projeto".
2. O sistema abre a caixa de upload de arquivos do sistema operacional.
3. O usuário seleciona o arquivo ZIP correspondente e clica em abrir.
4. O sistema envia o arquivo ZIP para o backend, onde o parser descompacta o arquivo e lê a estrutura dos textos e tabelas em JSON.
5. O sistema valida a integridade do pacote ZIP.
6. O sistema cria as tabelas do projeto no banco de dados populando com os dados importados e grava os textos nas respectivas pastas.
7. O novo projeto importado aparece no Dashboard do usuário.

**Fluxos alternativos:**
- *Importação de plataformas terceiras:* O sistema possui adaptadores dedicados para importar estruturas de diretórios de ferramentas como Scrivener ou Obsidian.

**Fluxos de exceção:**
- *Arquivo ZIP inválido:* Se o ZIP não contiver o arquivo de índice esperado ou estiver corrompido, o sistema cancela a tarefa e exibe: "Falha na importação. Arquivo ZIP inválido".

**Pós-condições:** O projeto externo é convertido em um projeto ativo e independente na conta do usuário.

**Critérios de aceite:**
- [ ] O parser deve ser capaz de processar e validar a integridade dos dados importados em lote.
- [ ] O tempo total de importação de um projeto com até 100 capítulos de texto deve ser menor que 10 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média
