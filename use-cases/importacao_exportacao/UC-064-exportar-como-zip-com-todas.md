### Caso de Uso: Exportar como zip com todas pastas textos e conexões

**ID:** UC-064  
**Requisito relacionado:** RF-64 (exportar como zip com todas pastas textos e conexões)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui pastas, textos e dados de conexão de entidades cadastrados.  
**Gatilho:** O usuário seleciona a opção "Exportar Projeto Consolidado (.zip)" no menu do sistema.  

**Fluxo principal:**
1. O usuário clica em "Exportar como ZIP".
2. O sistema inicia o empacotamento em segundo plano.
3. O backend recria a árvore física de diretórios (pastas e subpastas) do usuário.
4. O sistema grava cada documento de texto no formato selecionado (.md ou .txt) dentro de sua pasta correspondente.
5. O sistema gera um arquivo JSON de configuração (ex: `conexoes.json`) contendo todas as arestas de conexões de entidades, metadados e linha do tempo.
6. O sistema compacta todos os arquivos em um arquivo ZIP.
7. O navegador do usuário inicia o download automático do arquivo `[nome_do_projeto]_export.zip`.

**Fluxos alternativos:**
- *Exportar anexos:* O usuário opta por incluir ou não imagens anexadas aos textos e capas no pacote ZIP.

**Fluxos de exceção:**
- *Estouro de memória no servidor:* Em projetos massivos com muitas imagens, se o servidor falhar ao compactar, o sistema cancela a tarefa e exibe "Erro ao exportar. Tente realizar a exportação sem os arquivos de mídia".

**Pós-condições:** O arquivo compactado com a estrutura completa e dados de conexão é baixado na máquina do usuário.

**Critérios de aceite:**
- [ ] A estrutura de pastas no arquivo ZIP baixado deve replicar exatamente a hierarquia de pastas da árvore lateral do projeto.
- [ ] O arquivo `conexoes.json` incluído deve manter a consistência com IDs mapeados nos arquivos do projeto.

**Prioridade:** Alta  
**Complexidade estimada:** Média
