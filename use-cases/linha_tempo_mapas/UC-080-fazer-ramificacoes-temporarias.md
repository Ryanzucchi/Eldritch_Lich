### Caso de Uso: Fazer ramificacoes temporárias

**ID:** UC-080  
**Requisito relacionado:** RF-80 (fazer ramificacoes temporárias)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está editando um projeto e deseja testar alterações sem criar um Universo Alternativo permanente.  
**Gatilho:** O usuário clica no botão "Ramificação Temporária" na barra de status do projeto.  

**Fluxo principal:**
1. O usuário clica em "Criar Ramificação Temporária".
2. O sistema cria um snapshot das tabelas do projeto correspondentes à sessão atual no cache local (IndexedDB).
3. A barra de status muda para a cor roxa com a etiqueta "Ramificação Ativa: [Temporária]".
4. O usuário faz edições no texto, exclui personagens ou move pastas.
5. Ao concluir os testes, o usuário clica em "Mesclar Alterações" ou em "Descartar Ramificação".

**Fluxos alternativos:**
- *Salvar como Universo Alternativo:* O usuário decide que a ramificação temporária ficou excelente e clica em "Salvar como Universo Alternativo" para convertê-la em um namespace definitivo.

**Fluxos de exceção:**
- *Fechamento do navegador:* Se a sessão do navegador expirar ou o usuário fechar a página com a ramificação ativa, ao reabrir o sistema pergunta se deseja restaurar ou descartar os dados pendentes.

**Pós-condições:** As alterações da ramificação temporária são aplicadas em definitivo ou limpas do cache.

**Critérios de aceite:**
- [ ] A ramificação temporária deve ser salva localmente na máquina do usuário para evitar tráfego desnecessário no servidor.
- [ ] O descarte da ramificação deve ser concluído de forma instantânea (< 100ms) restaurando o estado anterior limpo do projeto.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
