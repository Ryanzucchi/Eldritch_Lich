### Caso de Uso: Avaliar desempenho de funcionários

**ID:** UC-309  
**Requisito relacionado:** RF-308 (avaliar desempenho de funcionários)  
**Ator(es):** Administrador/Gestor, Funcionário, Sistema  
**Pré-condições:** O funcionário está cadastrado e ativo no sistema.  
**Gatilho:** O RH inicia o ciclo de avaliação de desempenho periódico.  

**Fluxo principal:**
1. O gestor acessa o painel de RH -> "Avaliações de Desempenho".
2. O gestor clica em "Nova Avaliação" e seleciona o modelo de questionário.
3. O gestor escolhe os participantes: o avaliado e os avaliadores (autoavaliação, gestor e pares).
4. Os avaliadores acessam o portal de RH e respondem aos questionários de competências atribuindo notas e feedbacks.
5. O sistema compila as notas de todas as respostas recebidas.
6. O sistema gera um relatório radar de competências contendo pontos fortes e oportunidades de desenvolvimento.
7. O gestor revisa os resultados com o funcionário e clica em "Concluir Avaliação".

**Fluxos alternativos:**
- *Avaliação por Metas:* O sistema busca o percentual de cumprimento de metas individuais do funcionário e insere a nota de metas automaticamente no relatório final de desempenho.

**Fluxos de exceção:**
- *Avaliador ausente/inativo:* Se um dos avaliadores for desligado antes de preencher o questionário, o gestor de RH o remove da lista para possibilitar o encerramento do relatório.

**Pós-condições:** O relatório consolidado de avaliação de desempenho do colaborador é persistido na base de dados.

**Critérios de aceite:**
- [ ] O sistema deve manter sigilo nas notas individuais dos pares avaliadores (exibir apenas médias agregadas).
- [ ] O relatório deve conter gráficos visuais legíveis de fácil interpretação.

**Prioridade:** Média  
**Complexidade estimada:** Média
