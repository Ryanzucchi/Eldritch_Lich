### Caso de Uso: Gerenciar processo de desligamento

**ID:** UC-308  
**Requisito relacionado:** RF-307 (gerenciar processo de desligamento)  
**Ator(es):** Administrador/RH, Sistema  
**Pré-condições:** O funcionário a ser desligado está cadastrado no sistema com status ativo.  
**Gatilho:** O gestor de RH inicia o processo de desligamento de um colaborador.  

**Fluxo principal:**
1. O gestor de RH abre a ficha de um funcionário.
2. O gestor clica na opção "Iniciar Desligamento".
3. O gestor seleciona o Tipo de Desligamento, insere a Data e define se haverá aviso prévio trabalhado ou indenizado.
4. O gestor clica em "Calcular Rescisão".
5. O sistema faz o cálculo estimado das verbas rescisórias (saldo de salário, férias proporcionais, 13º proporcional).
6. O gestor aprova os valores e clica em "Efetivar Desligamento".
7. O sistema altera o status do colaborador para "Desativado", bloqueia imediatamente todas as suas credenciais de login e gera a guia de pagamento rescisório.

**Fluxos alternativos:**
- *Desligamento programado:* O gestor agenda o desligamento para uma data futura, e o sistema agenda o bloqueio de acessos em background para o dia definido.

**Fluxos de exceção:**
- *Único administrador:* Se o gestor tentar desligar o único usuário administrador master da plataforma, o sistema bloqueia e exige que outro administrador master seja cadastrado e ativado antes do desligamento.

**Pós-condições:** O funcionário é desligado, suas credenciais de login são invalidadas e os valores de rescisão são calculados.

**Critérios de aceite:**
- [ ] O bloqueio de credenciais e tokens do funcionário demitido deve ser instantâneo e total na API de autenticação.
- [ ] O cálculo rescisório deve seguir os parâmetros da legislação trabalhista brasileira.

**Prioridade:** Alta  
**Complexidade estimada:** Média
