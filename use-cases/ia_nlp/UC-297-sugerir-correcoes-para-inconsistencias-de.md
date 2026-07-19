### Caso de Uso: Sugerir correções para inconsistências de timeline

**ID:** UC-297  
**Requisito relacionado:** RF-297 (sugerir correções para inconsistências de timeline)  
**Ator(es):** Sistema, Usuário (Escritor)  
**Pré-condições:** O relatório de inconsistências de timeline localizou violações de enredo.  
**Gatilho:** O usuário clica em "Ver Soluções / Resolver" ao lado de uma inconsistência listada no relatório.  

**Fluxo principal:**
1. O usuário acessa o Relatório de Inconsistências e seleciona uma das contradições de enredo apontadas.
2. O usuário clica em "Ver Soluções".
3. O sistema analisa os dados e sugere opções de correção automatizadas na tela (ex: alterar data do evento, alterar data biográfica de falecimento, ou remover a participação do personagem no evento).
4. O usuário seleciona uma das opções sugeridas e clica em "Aplicar Opção".
5. O sistema executa a correção automática diretamente no banco de dados e atualiza a ficha correspondente.
6. A inconsistência é marcada como resolvida e desaparece do relatório de erros.

**Fluxos alternativos:**
- *Desfazer alteração:* O usuário clica em desfazer para reverter a correção imediata caso perceba que a mudança prejudicou outros trechos do enredo.

**Fluxos de exceção:**
- *Novas inconsistências:* Se a aplicação de uma correção gerar outra inconsistência subsequente, o sistema alerta o usuário e possibilita reverter a ação.

**Pós-condições:** A base de dados do projeto é reconfigurada e corrigida com base na opção selecionada.

**Critérios de aceite:**
- [ ] A aplicação da solução sugerida deve ocorrer dentro de uma transação atômica no banco.
- [ ] O recálculo de integridade do enredo após a correção deve durar menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Alta
