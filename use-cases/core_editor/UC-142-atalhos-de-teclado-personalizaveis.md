### Caso de Uso: Atalhos de teclado personalizáveis

**ID:** UC-142  
**Requisito relacionado:** RF-142 (atalhos de teclado personalizáveis)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O menu de configurações gerais está acessível.  
**Gatilho:** O usuário acessa "Configurações" -> "Atalhos de Teclado".  

**Fluxo principal:**
1. O usuário abre a tabela de atalhos de teclado configurados no sistema.
2. O sistema exibe a lista de comandos e suas respectivas teclas de atalho.
3. O usuário clica em "Editar" no comando desejado (ex: "Modo Foco").
4. O sistema exibe o prompt de captura de teclas.
5. O usuário pressiona a combinação (ex: `Ctrl+Alt+F`) no teclado físico.
6. O sistema captura a combinação (verificando conflitos com outros comandos) e grava o novo mapeamento no banco de dados de preferências.
7. O novo atalho passa a comandar a ação correspondente.

**Fluxos alternativos:**
- *Restaurar padrões:* O usuário clica em "Restaurar Atalhos Padrão" para resetar todas as associações de teclas do sistema.

**Fluxos de exceção:**
- *Combinação reservada:* Se o usuário tentar mapear um atalho bloqueado pelo próprio navegador ou SO, o sistema impede a gravação e notifica sobre a impossibilidade.

**Pós-condições:** Os atalhos de teclado são atualizados de acordo com a preferência do usuário.

**Critérios de aceite:**
- [ ] O sistema de captura de atalhos deve suportar teclas modificadoras (`Ctrl`, `Alt`, `Shift`, `Cmd` no macOS).
- [ ] A reatribuição de teclas deve ser validada instantaneamente contra colisões com outros atalhos.

**Prioridade:** Baixa  
**Complexidade estimada:** Média
