### Caso de Uso: Visualizar lista de colaboradores online no projeto

**ID:** UC-211  
**Requisito relacionado:** RF-211 (visualizar lista de colaboradores online no projeto)  
**Ator(es):** Usuário (Colaborador), Sistema  
**Pré-condições:** O projeto possui compartilhamento ativo e o usuário está com o projeto aberto.  
**Gatilho:** Entrada de novos usuários no espaço de trabalho ou abertura do painel de equipe.  

**Fluxo principal:**
1. O usuário abre o projeto.
2. O sistema estabelece conexão WebSocket com o servidor de presença.
3. No canto superior direito da barra global, o sistema exibe os avatares dos usuários online no momento (com ponto indicador verde).
4. O usuário passa o mouse sobre o avatar para ler o nome e o status (ex: "Colaborador B - Ativo").
5. Quando um colaborador fecha o projeto ou desconecta, o sistema detecta a desconexão e remove seu avatar da listagem em tempo real.

**Fluxos alternativos:**
- *Modo Invisível:* O usuário configura seu status para "Invisível" nas preferências do perfil. O sistema oculta seu avatar dos demais colaboradores mesmo com o projeto aberto.

**Fluxos de exceção:**
- *Instabilidade de conexão:* Se o WebSocket cair, o sistema esmaece a lista de online e tenta restabelecer o sinal em background de forma silenciosa.

**Pós-condições:** A lista atualizada de colaboradores ativos em tempo real é exibida no cabeçalho da interface.

**Critérios de aceite:**
- [ ] A entrada ou saída de um usuário deve ser refletida na tela dos demais em até 500ms.
- [ ] O painel deve suportar até 20 avatares online simultaneamente, agrupando excedentes sob um rótulo "+X".

**Prioridade:** Alta  
**Complexidade estimada:** Média
