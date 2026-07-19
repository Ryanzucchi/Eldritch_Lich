### Caso de Uso: Restaurar versão específica

**ID:** UC-197  
**Requisito relacionado:** RF-197 (restaurar versão específica)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na tela de comparação de versões.  
**Gatilho:** O usuário clica no botão "Restaurar esta Versão" correspondente a um dos painéis.  

**Fluxo principal:**
1. O usuário clica em "Restaurar esta Versão" na coluna que exibe a "Versão A".
2. O sistema exibe um modal de confirmação explicando que a versão ativa atual será substituída pela Versão A, mas que a versão ativa atual será salva no histórico.
3. O usuário clica em "Confirmar Restauração".
4. O sistema atualiza o conteúdo do documento ativo no banco de dados com a cópia exata dos dados da Versão A.
5. O editor de texto principal recarrega o conteúdo restaurado.

**Fluxos alternativos:**
- *Restaurar trecho específico:* O usuário seleciona apenas um parágrafo da coluna antiga e o reverte no editor ativo.

**Fluxos de exceção:**
- *Conflito de edição concorrente:* Se outro colaborador salvar uma edição no mesmo texto enquanto o usuário confirmava a restauração, o sistema impede a ação direta e alerta o usuário para revisar as alterações.

**Pós-condições:** A versão histórica selecionada substitui o conteúdo do documento ativo de forma segura.

**Critérios de aceite:**
- [ ] A ação de restauração deve gerar um log de auditoria associado ao usuário que a executou.
- [ ] A restauração de dados deve ser transacional.

**Prioridade:** Alta  
**Complexidade estimada:** Média
