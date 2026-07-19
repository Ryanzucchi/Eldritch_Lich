### Caso de Uso: Escrever textos

**ID:** UC-001  
**Requisito relacionado:** RF-1 (escrever textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O usuário está autenticado e possui um projeto aberto.  
**Gatilho:** O usuário clica no botão "Criar Novo Texto" ou "Novo Capítulo".  

**Fluxo principal:**
1. O usuário clica na opção "Criar Novo Texto" no painel de navegação lateral ou menu do projeto.
2. O sistema inicializa um novo documento vazio no banco de dados e abre a interface do editor de texto focada nesse novo documento.
3. O usuário digita o conteúdo desejado no editor.
4. O editor exibe o texto digitado em tempo real com formatação visual básica.
5. O usuário insere um título para o texto (opcional).

**Fluxos alternativos:**
- *Edição de título vazio:* Se o usuário não fornecer um título, o sistema atribui o título provisório "Sem título" automaticamente ao salvar ou fechar o arquivo.

**Fluxos de exceção:**
- *Perda inesperada de conexão:* O sistema exibe um alerta sutil de rede e redireciona o salvamento para o cache local do navegador (IndexedDB) para posterior sincronização em nuvem.

**Pós-condições:** O novo texto é criado e armazenado no estado local/banco de dados com o ID associado ao projeto.

**Critérios de aceite:**
- [ ] O editor deve renderizar a entrada de texto do teclado com latência inferior a 50ms.
- [ ] O sistema deve aceitar caracteres Unicode (UTF-8), incluindo acentuações da língua portuguesa e emojis.
- [ ] O documento recém-criado deve conter pelo menos os campos: `id`, `titulo`, `conteudo`, `data_criacao` e `data_atualizacao`.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa
