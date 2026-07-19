### Caso de Uso: Integrar metas com avaliação de desempenho

**ID:** UC-351  
**Requisito relacionado:** RF-350 (integrar metas com avaliação de desempenho)  
**Ator(es):** Administrador/RH, Gestor, Sistema  
**Pré-condições:** Avaliação de desempenho e metas individuais configuradas para o mesmo período de avaliação.  
**Gatilho:** O RH inicia o cálculo final do ciclo de avaliação de desempenho.  

**Fluxo principal:**
1. O gestor acessa o painel de RH -> "Avaliação de Desempenho" -> "Ciclos de Avaliação".
2. O gestor abre a ficha de avaliação do funcionário.
3. O sistema calcula a nota média das avaliações qualitativas de competências (autoavaliação, pares, gestor).
4. O sistema busca automaticamente o índice de atingimento das KRs e OKRs atribuídos ao funcionário naquele período.
5. O sistema combina ambos os fatores aplicando os pesos parametrizados (ex: 60% qualitativo, 40% quantitativo de metas).
6. O sistema exibe o resultado ponderado unificado no relatório final de performance.
7. O gestor de RH salva e aprova a nota consolidada.

**Fluxos alternativos:**
- *Cálculo de bônus salarial:* O sistema usa a nota de atingimento integrado para sugerir uma comissão ou bônus proporcional para lançamento automático na folha de pagamento seguinte.

**Fluxos de exceção:**
- *Colaborador sem metas:* Se o colaborador não possuir metas individuais associadas no período, a avaliação qualitativa assume 100% do peso, gerando um aviso explicativo no cabeçalho do relatório.

**Pós-condições:** A nota de performance integrada (metas + competências) é salva na tabela de avaliações do funcionário.

**Critérios de aceite:**
- [ ] A fórmula de integração e os pesos devem ser customizáveis pelo gestor de RH antes do início do ciclo.
- [ ] O processamento e cálculo da nota integrada devem durar menos de 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
