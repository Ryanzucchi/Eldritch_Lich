### Caso de Uso: Criar canais de chat por assunto/pasta

**ID:** UC-215  
**Requisito relacionado:** RF-215 (criar canais de chat por assunto/pasta)  
**Ator(es):** Usuário (Colaborador/Admin), Sistema  
**Pré-condições:** O painel de chat do projeto está ativo.  
**Gatilho:** O usuário clica em "Criar Novo Canal" na seção de chat.  

**Fluxo principal:**
1. O usuário abre o chat lateral e clica no botão "+" ao lado de "Canais".
2. O sistema abre um modal solicitando o nome do canal e descrição.
3. O usuário insere os dados e clica em "Confirmar".
4. O sistema cria o canal de chat isolado na base de dados.
5. O novo canal aparece na lista lateral do chat para todos os colaboradores do projeto.
6. Ao clicar no canal, os membros acessam a thread de conversas exclusiva sobre o assunto delimitado.

**Fluxos alternativos:**
- *Canal automático de pasta:* O sistema cria de forma automática um canal de chat privado para cada pasta de capítulos principal criada no diretório, agrupando as discussões daquela divisão.

**Fluxos de exceção:**
- *Sem permissão:* Se um colaborador for bloqueado em uma pasta, ele perde o acesso visual e de interação no canal de chat privado correspondente àquela pasta.

**Pós-condições:** O canal de chat temático é inicializado no projeto.

**Critérios de aceite:**
- [ ] O canal de chat deve permitir silenciar notificações individuais para o usuário.
- [ ] A criação de canais de chat deve atualizar as telas dos colaboradores em tempo real.

**Prioridade:** Média  
**Complexidade estimada:** Média
