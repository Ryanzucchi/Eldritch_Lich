### Caso de Uso: Salvar textos

**ID:** UC-003  
**Requisito relacionado:** RF-3 (salvar textos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário realizou alterações em um documento aberto no editor.  
**Gatilho:** O usuário clica no botão "Salvar" ou pressiona o atalho Ctrl+S (ou Cmd+S no macOS).  

**Fluxo principal:**
1. O usuário pressiona o atalho Ctrl+S ou clica no ícone de salvar (disquete) na barra de ferramentas.
2. O sistema envia a requisição de atualização de dados para a API do backend com o novo conteúdo.
3. O backend valida a requisição, atualiza o registro no banco de dados e registra a timestamp de `data_atualizacao`.
4. O backend retorna um status de sucesso (HTTP 200) à interface.
5. A interface exibe brevemente uma notificação ou indicador visual discreto: "Texto salvo".

**Fluxos alternativos:**
- *Interface offline:* Se o sistema detectar ausência de conexão com a internet, salva o arquivo localmente no IndexedDB e atualiza o estado para "Salvo localmente (offline)".

**Fluxos de exceção:**
- *Falha de gravação no banco de dados:* O sistema exibe o erro "Erro ao salvar no servidor. Tente novamente." e mantém o editor em estado "Não salvo", preservando o conteúdo na tela.

**Pós-condições:** O conteúdo update é persistido com sucesso no banco de dados centralizado ou no armazenamento local.

**Critérios de aceite:**
- [ ] O salvamento manual no backend deve ser processado em até 1 segundo sob condições normais de rede (latência < 100ms).
- [ ] O indicador visual de modificação (ex: ponto sutil de alteração pendente) deve sumir imediatamente após a confirmação.
- [ ] O payload de salvamento deve ser enviado em formato JSON estruturado contendo o ID do texto, título, conteúdo e versão atual.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa
