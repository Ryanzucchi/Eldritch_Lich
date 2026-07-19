### Caso de Uso: Alternar permissão de escrita de pasta (bloquear/liberar)

**ID:** UC-205  
**Requisito relacionado:** RF-205 (alternar permissão de escrita de pasta (bloquear/liberar))  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** A pasta existe e o usuário tem cargo de administração do projeto.  
**Gatilho:** O administrador clica em "Bloquear Pasta" ou "Liberar Pasta" no menu de contexto.  

**Fluxo principal:**
1. O administrador clica com o botão direito sobre a pasta correspondente na árvore de arquivos lateral.
2. O administrador seleciona a opção "Permissões da Pasta".
3. O sistema abre um modal de controle de acesso.
4. O administrador clica na chave "Bloquear Escrita para Colaboradores (Somente Leitura)".
5. O administrador clica em "Aplicar Alteração".
6. O sistema atualiza o status de permissão da pasta no banco de dados e adiciona um ícone de cadeado ao lado do nome da pasta.
7. A partir deste momento, todos os colaboradores têm o acesso de escrita bloqueado nos arquivos contidos dentro dessa pasta.

**Fluxos alternativos:**
- *Bloqueio direcionado:* O administrador escolhe bloquear a escrita da pasta apenas para um colaborador específico, mantendo a permissão ativa para os demais membros.

**Fluxos de exceção:**
- *Bloquear si mesmo:* O sistema impede que o proprietário (Owner) bloqueie seu próprio acesso de escrita na pasta para evitar travamento acidental.

**Pós-condições:** O status de permissão de escrita da pasta e seus subdocumentos é alterado e aplicado às contas dos colaboradores.

**Critérios de aceite:**
- [ ] A restrição de escrita deve ser validada tanto na interface do editor quanto nos endpoints de gravação de arquivos da API (backend).
- [ ] A propagação do bloqueio a todos os subarquivos da pasta deve durar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
