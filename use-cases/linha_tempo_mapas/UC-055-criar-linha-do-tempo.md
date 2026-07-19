### Caso de Uso: Criar linha do tempo

**ID:** UC-055  
**Requisito relacionado:** RF-55 (criar linha do tempo)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O usuário possui um projeto aberto e permissões de escrita.  
**Gatilho:** O usuário clica no botão "Criar Nova Linha do Tempo" ou acessa o módulo de cronologia.  

**Fluxo principal:**
1. O usuário clica na opção "Criar Linha do Tempo" no painel de ferramentas.
2. O sistema abre um formulário solicitando: Nome da Linha do Tempo, Descrição e Tipo de Calendário (padrão Gregoriano ou Calendário Customizado).
3. O usuário insere as informações e clica em "Criar".
4. O sistema cria um novo registro de timeline no banco de dados e abre a visualização da linha do tempo vazia.

**Fluxos alternativos:**
- *Duplicar Linha do Tempo:* O usuário clica em "Duplicar" em uma timeline existente para criar uma versão alternativa dela (útil para universos paralelos).

**Fluxos de exceção:**
- *Nome vazio:* Se o usuário tentar criar sem nomear, o sistema exibe "O campo Nome é obrigatório" e mantém o modal de criação aberto.

**Pós-condições:** A nova linha do tempo é cadastrada na base de dados e exibida na interface.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a data de criação, autor e permissões de acesso da timeline.
- [ ] O sistema deve permitir a criação de múltiplas linhas do tempo independentes no mesmo projeto.

**Prioridade:** Alta  
**Complexidade estimada:** Média
