### Caso de Uso: Duplicar projeto

**ID:** UC-119  
**Requisito relacionado:** RF-119 (duplicar projeto)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto de origem existe na conta do usuário e o usuário tem permissão de administração.  
**Gatilho:** O usuário clica em "Duplicar" no menu de opções do projeto no Dashboard.  

**Fluxo principal:**
1. O usuário acessa a listagem de projetos no Dashboard.
2. O usuário clica no ícone de opções no card do projeto e seleciona "Duplicar".
3. O sistema abre uma caixa de confirmação exibindo o nome do novo projeto proposto no formato `[Nome do Projeto Original] (Cópia)`.
4. O usuário confirma.
5. O sistema realiza a clonagem completa das tabelas do projeto de origem no banco de dados (pastas, arquivos de textos, entidades, relacionamentos, timelines).
6. O novo projeto duplicado aparece na listagem do Dashboard do usuário.

**Fluxos alternativos:**
- *Duplicação parcial:* O usuário seleciona quais módulos deseja copiar para o novo projeto (ex: opta por duplicar apenas o mapa de entidades e a timeline, sem copiar os capítulos).

**Fluxos de exceção:**
- *Espaço insuficiente:* O sistema interrompe o processo se a cópia for exceder a cota de armazenamento e exibe mensagem informativa de cota esgotada.

**Pós-condições:** Uma réplica dos dados do projeto é gerada no banco de dados do usuário.

**Critérios de aceite:**
- [ ] A duplicação de projetos de tamanho padrão (com até 50 textos) deve ser concluída em menos de 5 segundos.
- [ ] O log de histórico de auditoria do projeto original não deve ser clonado para o projeto duplicado.

**Prioridade:** Média  
**Complexidade estimada:** Média
