### Caso de Uso: Comparar duas linhas do tempo

**ID:** UC-079  
**Requisito relacionado:** RF-79 (comparar duas linhas do tempo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui pelo menos duas linhas do tempo.  
**Gatilho:** O usuário acessa o módulo de cronologia e clica em "Comparar Linhas do Tempo".  

**Fluxo principal:**
1. O usuário abre o painel da Timeline.
2. O usuário seleciona o botão "Comparar Timelines".
3. O usuário seleciona as duas linhas do tempo que deseja contrastar.
4. O sistema renderiza na tela duas linhas do tempo horizontais empilhadas verticalmente, compartilhando a mesma escala de datas.
5. O sistema desenha conectores visuais verticais pontilhados entre os eventos equivalentes presentes em ambas as linhas, evidenciando desvios ou datas conflitantes.
6. O usuário rola a escala temporal e visualiza a divergência dos acontecimentos em tempo real.

**Fluxos alternativos:**
- *Lista de divergências:* O usuário alterna para o modo lista, exibindo uma tabela com as diferenças exatas de datas e desfechos de eventos entre as duas timelines.

**Fluxos de exceção:**
- *Calendários incompatíveis:* Se as duas linhas do tempo usarem escalas incompatíveis, o sistema exige que o usuário defina um "ponto de ancoragem" (evento comum de data equivalente manual) para alinhar os eixos.

**Pós-condições:** As duas linhas do tempo são dispostas de forma alinhada na tela para análise de divergências cronológicas.

**Critérios de aceite:**
- [ ] A escala de zoom e rolagem horizontal deve ser sincronizada entre as duas timelines renderizadas.
- [ ] O sistema deve indicar visualmente os eventos que são exclusivos de uma das timelines.

**Prioridade:** Média  
**Complexidade estimada:** Alta
