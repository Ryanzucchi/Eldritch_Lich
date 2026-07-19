### Caso de Uso: Restaurar backup completo do projeto

**ID:** UC-227  
**Requisito relacionado:** RF-227 (restaurar backup completo do projeto)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** O projeto possui backups (pontos de restauração) automáticos ou manuais armazenados na nuvem.  
**Gatilho:** O usuário clica em "Restaurar Backup" na lista de pontos de restauração.  

**Fluxo principal:**
1. O proprietário acessa a aba "Manutenção e Backups" nas configurações do projeto.
2. O sistema exibe a lista de pontos de restauração passados disponíveis para a conta.
3. O proprietário seleciona a linha do backup desejada e clica em "Restaurar".
4. O sistema exibe um modal de aviso de segurança informando que a ação é crítica e substituirá todo o estado do projeto ativo.
5. O proprietário confirma a ação digitando sua senha.
6. O sistema limpa as tabelas do projeto ativo no banco de dados e repopula todas as tabelas (pastas, capítulos, entidades, timeline, mapa) com as informações do backup.
7. O projeto recarrega a tela com as informações do backup.

**Fluxos alternativos:**
- *Restaurar em um novo projeto:* O usuário opta por restaurar o backup em um novo projeto paralelo, mantendo o projeto ativo atual intacto e criando uma cópia do estado antigo.

**Fluxos de exceção:**
- *Senha inválida:* O sistema bloqueia o processo e exibe a mensagem: "Senha inválida. Ação abortada".

**Pós-condições:** O projeto é reconfigurado para o estado exato correspondente ao ponto de restauração selecionado.

**Critérios de aceite:**
- [ ] A restauração deve ser atômica e executada dentro de uma única transação no banco de dados para evitar estados parciais inconsistentes.
- [ ] O tempo total de transição e restauração do banco de dados deve ser menor que 8 segundos para projetos padrão.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
