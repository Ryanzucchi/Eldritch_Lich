### Caso de Uso: Criar múltiplos projetos

**ID:** UC-117  
**Requisito relacionado:** RF-117 (criar múltiplos projetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está autenticado e possui uma conta ativa.  
**Gatilho:** O usuário clica em "Novo Projeto" na tela do Dashboard principal da conta.  

**Fluxo principal:**
1. O usuário clica no botão "Criar Novo Projeto".
2. O sistema apresenta um modal de criação de projeto solicitando: Nome do Projeto, Gênero Literário e Visibilidade (privado/compartilhado).
3. O usuário preenche as informações e clica em "Criar".
4. O sistema cria um novo namespace exclusivo de banco de dados para o projeto na conta do usuário.
5. O sistema redireciona o usuário para o espaço de trabalho do novo projeto em branco.

**Fluxos alternativos:**
- *Criar a partir de modelo:* O usuário seleciona um template de projeto pronto que já inicializa com pastas e estruturas pré-configuradas.

**Fluxos de exceção:**
- *Limite do plano:* Se o usuário no plano gratuito tentar criar mais projetos do que o limite permitido, o sistema bloqueia e sugere o upgrade para o plano Premium.

**Pós-condições:** Um novo projeto independente é inicializado no banco de dados e focado no painel do usuário.

**Critérios de aceite:**
- [ ] A criação do novo projeto no banco de dados deve ocorrer em até 1,5 segundos.
- [ ] Os dados de cada projeto devem residir de forma isolada, impedindo vazamentos de dados entre projetos.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
