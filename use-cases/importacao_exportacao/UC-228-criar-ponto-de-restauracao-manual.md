### Caso de Uso: Criar ponto de restauração manual (backup)

**ID:** UC-228  
**Requisito relacionado:** RF-228 (criar ponto de restauração manual (backup))  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O projeto possui dados cadastrados.  
**Gatilho:** O usuário clica em "Criar Ponto de Restauração" no menu do projeto.  

**Fluxo principal:**
1. O usuário acessa "Manutenção e Backups".
2. O usuário clica em "Criar Novo Ponto de Restauração".
3. O sistema solicita uma descrição para identificar o backup.
4. O usuário insere a descrição e clica em "Salvar Backup".
5. O backend captura a foto instantânea (snapshot) do estado de todas as tabelas do projeto e dos arquivos físicos e grava na base de dados de snapshots.
6. O novo ponto de restauração passa a constar na lista de backups com data, hora, autor e descrição.

**Fluxos alternativos:**
- *Backup automático:* O sistema cria de forma automatizada pontos de restauração temporários a cada 24 horas de edições de projetos.

**Fluxos de exceção:**
- *Limite de backups excedido:* Se a conta do usuário estourar o limite de backups permitidos na cota, o sistema desabilita o botão e orienta a excluir pontos de restauração antigos para liberar espaço.

**Pós-condições:** O snapshot do projeto é criado e listado no painel de segurança.

**Critérios de aceite:**
- [ ] O backup manual deve gravar os dados com precisão, garantindo integridade de todas as referências cruzadas e links do projeto.
- [ ] O tempo de processamento do snapshot em background deve ser menor que 3 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média
