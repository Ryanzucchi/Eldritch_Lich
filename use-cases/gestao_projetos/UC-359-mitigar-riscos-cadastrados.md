### Caso de Uso: Mitigar riscos cadastrados

**ID:** UC-359  
**Requisito relacionado:** RF-358 (mitigar riscos cadastrados)  
**Ator(es):** Gestor do Projeto, Sistema  
**Pré-condições:** Riscos de projetos identificados e cadastrados.  
**Gatilho:** O gestor detalha as ações de contingência para os riscos.  

**Fluxo principal:**
1. O gestor abre a "Matriz de Riscos" e clica no risco cadastrado correspondente.
2. O gestor seleciona a aba "Plano de Mitigação".
3. O gestor preenche a Ação Preventiva (para reduzir probabilidade) e a Ação de Contingência (caso o risco ocorra).
4. O gestor atribui um colaborador responsável pela execução do plano e define a data limite de monitoramento.
5. O gestor clica em "Salvar Plano".
6. O sistema atualiza o status do risco para "Mitigado / Monitorado" e anexa o plano ao histórico do risco.

**Fluxos alternativos:**
- *Disparar plano de contingência:* O risco ocorre. O gestor clica em "Ativar Plano de Contingência". O sistema dispara notificações urgentes para todos os envolvidos detalhando as ações imediatas.

**Fluxos de exceção:**
- *Responsável inválido:* Se o responsável associado for desativado do sistema, o gestor recebe alerta solicitando atualização do encarregado de mitigação do risco.

**Pós-condições:** O plano de mitigação estruturado é gravado no banco de dados e vinculado ao respectivo risco.

**Critérios de aceite:**
- [ ] A ficha técnica do risco deve exibir de forma clara o histórico de mitigação e ações adotadas com data e hora.
- [ ] O salvamento do plano deve demorar menos de 150ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
