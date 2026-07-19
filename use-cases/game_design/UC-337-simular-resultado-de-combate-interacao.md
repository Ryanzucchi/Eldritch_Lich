### Caso de Uso: Simular resultado de combate/interação com base em regras

**ID:** UC-337  
**Requisito relacionado:** RF-337 (simular resultado de combate)  
**Ator(es):** Usuário (Game Designer), Sistema  
**Pré-condições:** Personagens e fórmulas de combate cadastrados e ativos.  
**Gatilho:** O usuário clica em "Simular Combate" no painel de balanceamento.  

**Fluxo principal:**
1. O usuário acessa o painel de simulações do GDD.
2. O usuário seleciona o Atacante (Guerreiro) e o Defensor (Mago), bem como o nível de ambos.
3. O usuário escolhe a ação de ataque especial da lista.
4. O usuário clica em "Executar Simulação de Combate".
5. O sistema busca os atributos de ambos no banco de dados, recupera a fórmula de combate correspondente da tabela de regras e calcula os resultados matemáticos de forma isolada.
6. O sistema exibe o relatório detalhado do dano resultante, chance de acerto crítico, consumo de recursos e pontos de vida restantes.

**Fluxos alternativos:**
- *Simulação de múltiplos turnos:* O usuário seleciona "Combate Completo (Auto-battle)". O sistema roda 100 rodadas de simulação e exibe a estatística de probabilidade de vitória de cada personagem.

**Fluxos de exceção:**
- *Atributo nulo:* Se o Guerreiro ou o Mago possuir algum atributo vital em branco (ex: Defesa do Mago está cadastrada como nula), o sistema avisa: "Não é possível realizar a simulação. Defesa do Mago está com valor nulo".

**Pós-condições:** O relatório consolidado de dados e estatísticas do combate simulado é exibido na tela.

**Critérios de aceite:**
- [ ] A simulação matemática e renderização do relatório do duelo individual devem ocorrer em menos de 500ms.
- [ ] A simulação de auto-battle de 100 rodadas deve durar menos de 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
