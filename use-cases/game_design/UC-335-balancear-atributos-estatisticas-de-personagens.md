### Caso de Uso: Balancear atributos/estatísticas de personagens jogáveis

**ID:** UC-335  
**Requisito relacionado:** RF-334 (balancear atributos/estatísticas de personagens jogáveis)  
**Ator(es):** Usuário (Game Designer), Sistema  
**Pré-condições:** Personagens jogáveis com fichas de estatísticas cadastradas.  
**Gatilho:** O usuário edita a tabela de curvas de evolução de atributos dos personagens.  

**Fluxo principal:**
1. O usuário acessa "GDD" -> "Balanceamento de Personagens".
2. O sistema exibe uma planilha contendo os atributos (Vida, Mana, Força, Defesa) de todos os personagens jogáveis de acordo com seus níveis (nível 1 ao 50).
3. O usuário seleciona o personagem desejado (ex: "Guerreiro").
4. O usuário altera os valores do fator de progressão na planilha.
5. O sistema recalcula automaticamente todas as linhas da tabela em background.
6. A tela exibe um gráfico de linha mostrando a curva de evolução do Guerreiro ao longo dos níveis em comparação com a curva do Mago.
7. O usuário confirma os novos valores clicando em "Salvar Ajustes de Balanceamento".
8. O sistema atualiza os atributos e a curva na tabela correspondente no banco.

**Fluxos alternativos:**
- *Ajustar por curva visual:* O usuário arrasta pontos de controle de uma curva visual (Bezier) para suavizar a evolução de força dos personagens sem preencher números manualmente.

**Fluxos de exceção:**
- *Atributos inválidos:* Se o usuário preencher valores de atributos zerados ou negativos para níveis avançados, o sistema bloqueia o salvamento para evitar crashes de balanceamento.

**Pós-condições:** Os valores de progressão e a curva de balanceamento dos atributos do personagem são atualizados na base de dados.

**Critérios de aceite:**
- [ ] A re-renderização do gráfico comparativo ao alterar qualquer valor da planilha deve durar menos de 200ms.
- [ ] A planilha de balanceamento deve permitir exportação rápida dos dados em formato CSV.

**Prioridade:** Média  
**Complexidade estimada:** Alta
