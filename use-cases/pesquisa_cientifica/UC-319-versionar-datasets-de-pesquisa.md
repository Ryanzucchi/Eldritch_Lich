### Caso de Uso: Versionar datasets de pesquisa

**ID:** UC-319  
**Requisito relacionado:** RF-318 (versionar datasets de pesquisa)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** O usuário possui arquivos estruturados de dados (CSV, JSON, XLSX) associados ao projeto.  
**Gatilho:** O usuário faz upload de uma nova versão de um arquivo de dados tabulares.  

**Fluxo principal:**
1. O usuário acessa a aba "Datasets / Dados do Projeto".
2. O usuário localiza o arquivo correspondente e clica em "Atualizar Dataset".
3. O sistema abre o campo de upload e solicita um resumo descritivo das alterações feitas.
4. O usuário seleciona o novo arquivo local, escreve o comentário de alteração e confirma.
5. O backend recebe o arquivo, gera o identificador de versão correspondente, calcula um hash de integridade (SHA-256) e salva o arquivo de forma paralela no diretório de versionamento.
6. A interface passa a listar a nova versão na lista disponível, mantendo opções de comparação e download.

**Fluxos alternativos:**
- *Reverter versão:* O usuário clica em "Restaurar Versão Anterior" e o sistema promove aquela versão para ser o conjunto de dados ativo utilizado pelo motor de estatísticas do projeto.

**Fluxos de exceção:**
- *Estouro de armazenamento:* Se o arquivo for excessivamente grande e exceder o espaço disponível da conta, o sistema bloqueia a importação e exibe: "Erro: Limite de armazenamento de datasets atingido".

**Pós-condições:** A nova versão do conjunto de dados é armazenada de forma segura na nuvem, mantendo o histórico de versões anteriores acessível.

**Critérios de aceite:**
- [ ] O sistema deve validar a estrutura de colunas do novo arquivo em relação à versão anterior (alertando caso haja colunas deletadas).
- [ ] O tempo de hashing de integridade de arquivos de até 50MB deve ser inferior a 1,5 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
