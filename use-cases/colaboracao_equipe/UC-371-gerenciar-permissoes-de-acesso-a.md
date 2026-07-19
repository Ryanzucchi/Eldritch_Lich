### Caso de Uso: Gerenciar permissões de acesso a arquivos

**ID:** UC-371  
**Requisito relacionado:** RF-370 (gerenciar permissões de acesso a arquivos)  
**Ator(es):** Proprietário/Gestor do Arquivo, Colaboradores, Sistema  
**Pré-condições:** O arquivo está carregado no sistema ou compartilhado em canais.  
**Gatilho:** O proprietário clica em "Permissões de Acesso" no menu do arquivo.  

**Fluxo principal:**
1. O usuário abre o painel de propriedades de um arquivo.
2. O usuário clica em "Gerenciar Acessos".
3. O sistema abre o modal contendo a lista de acessos individuais e o link público de compartilhamento.
4. O usuário adiciona o e-mail do colaborador e define sua permissão (Visualizador, Editor, Administrador).
5. O usuário altera o nível de acesso geral da URL do link de compartilhamento (ex: Qualquer pessoa com link pode visualizar).
6. O usuário clica em "Salvar Permissões".
7. O sistema grava as regras na tabela correspondente do banco de dados.

**Fluxos alternativos:**
- *Herança de permissões:* Se o arquivo for movido para uma pasta restrita, ele herda automaticamente as regras de controle de acesso da pasta pai, revogando privilégios de membros comuns de forma automática.

**Fluxos de exceção:**
- *Remover o próprio acesso:* O proprietário do arquivo é impedido de remover suas próprias permissões administrativas do arquivo antes de atribuir outro usuário como proprietário master.

**Pós-condições:** As novas regras de permissões são aplicadas, bloqueando acessos não autorizados de imediato.

**Critérios de aceite:**
- [ ] A validação de tokens e sessões ao carregar arquivos protegidos via API de mídia deve demorar menos de 100ms.
- [ ] A interface deve listar os logs das últimas alterações de permissões efetuadas no arquivo.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
