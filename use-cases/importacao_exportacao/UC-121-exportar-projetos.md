### Caso de Uso: Exportar projetos

**ID:** UC-121  
**Requisito relacionado:** RF-121 (exportar projetos)  
**Ator(es):** Usuário (Escritor/Admin), Sistema  
**Pré-condições:** O projeto existe no banco de dados e o usuário tem permissão de leitura/exportação.  
**Gatilho:** O usuário seleciona "Exportar Projeto" no Dashboard ou menu de configurações do projeto.  

**Fluxo principal:**
1. O usuário acessa a tela de exportação de projeto.
2. O sistema oferece opções de formato (ex: Pacote de Dados do Sistema .zip, ou pasta de arquivos estruturada em Markdown).
3. O usuário seleciona a opção "Backup Nativo (.zip)" e clica em "Iniciar Exportação".
4. O sistema gera arquivos JSON consolidados com os metadados do projeto (fichas, timelines, relacionamentos, permissões) e exporta os textos organizados nas respectivas pastas físicas.
5. O sistema compacta a estrutura em um ZIP.
6. O navegador inicia o download automático do arquivo `[nome_do_projeto]_export.zip`.

**Fluxos alternativos:**
- *Exportação para plataformas externas:* O usuário seleciona exportar a estrutura no formato compatível com Obsidian (arquivos Markdown linkados via double brackets).

**Fluxos de exceção:**
- *Erro de download:* O download falha. O usuário pode clicar em "Tentar Novamente" para re-iniciar a transferência do arquivo gerado temporariamente no servidor (válido por 1 hora).

**Pós-condições:** O arquivo compactado com todos os dados estruturados do projeto é baixado.

**Critérios de aceite:**
- [ ] A exportação nativa deve incluir todas as imagens de mídia e capas vinculadas no projeto.
- [ ] O processo de empacotamento deve rodar de forma assíncrona.

**Prioridade:** Alta  
**Complexidade estimada:** Média
