### Caso de Uso: Registrar log de quem editou o quê e quando

**ID:** UC-136  
**Requisito relacionado:** RF-136 (registrar log de quem editou o quê e quando)  
**Ator(es):** Sistema  
**Pré-condições:** Ações de edição ou exclusão de dados são realizadas por usuários no projeto.  
**Gatilho:** Execução de gravação ou atualização de registros na base de dados.  

**Fluxo principal:**
1. Um usuário ("Colaborador A") altera o parágrafo 2 do documento "Capítulo 1" às 15:30.
2. No momento de processar a requisição no backend, o sistema gera uma entrada de log na tabela de auditoria.
3. O log registra: ID do Usuário, ID do Projeto, Ação, ID do Recurso afetado, Data/Hora (timestamp UTC), IP e o delta da alteração.
4. O log é salvo no banco de dados.

**Fluxos alternativos:**
- *Log de exclusão:* O log grava o nome antigo do recurso excluído e a lista de dependências afetadas para possibilitar auditoria.

**Fluxos de exceção:**
- *Falha no sistema de auditoria:* Se o banco de logs estiver inacessível, o sistema tenta gravar localmente em arquivos de texto de log de erro rotativos no servidor.

**Pós-condições:** A ação do usuário é auditada e registrada de forma inalterável no banco de logs.

**Critérios de aceite:**
- [ ] O log de auditoria deve ser somente de inserção (append-only), impedindo edições ou exclusões de registros por qualquer usuário.
- [ ] A gravação do log não deve acrescentar mais de 50ms de latência na requisição de edição principal.

**Prioridade:** Alta  
**Complexidade estimada:** Média
