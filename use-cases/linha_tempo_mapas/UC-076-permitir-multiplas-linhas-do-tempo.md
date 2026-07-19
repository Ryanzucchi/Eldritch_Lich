### Caso de Uso: Permitir múltiplas linhas do tempo paralelas

**ID:** UC-076  
**Requisito relacionado:** RF-76 (permitir múltiplas linhas do tempo paralelas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui a funcionalidade de linhas do tempo ativa.  
**Gatilho:** O usuário acessa a aba Linha do Tempo e clica em "Nova Linha do Tempo Paralela".  

**Fluxo principal:**
1. O usuário acessa o módulo de Timeline.
2. O usuário clica em "Gerenciar Linhas do Tempo".
3. O usuário seleciona a opção "Criar Linha Paralela".
4. O sistema solicita que o usuário selecione uma timeline existente para servir de base ("Linha Origem") e um ponto de bifurcação (evento de ramificação).
5. O usuário seleciona as informações e confirma.
6. O sistema clona os eventos da timeline base anteriores ao ponto de bifurcação e cria uma nova timeline isolada para os eventos posteriores à data selecionada.
7. A interface exibe um seletor no topo da tela permitindo que o usuário alterne visualmente entre as linhas.

**Fluxos alternativos:**
- *Timeline paralela independente:* O usuário cria uma timeline totalmente em branco, sem clonar nenhuma outra existente, para representar acontecimentos isolados.

**Fluxos de exceção:**
- *Ponto de bifurcação inexistente:* Se o usuário não selecionar um evento de bifurcação válido, o sistema cria a linha como uma cópia idêntica completa da original.

**Pós-condições:** O banco de dados registra a nova timeline com os relacionamentos de parentesco e os respectivos eventos isolados.

**Critérios de aceite:**
- [ ] Alterações de eventos na linha paralela não devem alterar os eventos da linha base de origem pós-bifurcação.
- [ ] A tela de visualização cronológica deve permitir a exibição de duas linhas paralelas lado a lado para comparação.

**Prioridade:** Média  
**Complexidade estimada:** Alta
