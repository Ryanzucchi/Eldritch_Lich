### Caso de Uso: Acompanhar progresso de metas ao longo do tempo

**ID:** UC-348  
**Requisito relacionado:** RF-347 (acompanhar progresso de metas ao longo do tempo)  
**Ator(es):** Gestor, Colaboradores, Sistema  
**Pré-condições:** Objetivos e KRs cadastrados com vínculos a tarefas de apoio.  
**Gatilho:** O usuário acessa o painel "Acompanhamento de Metas".  

**Fluxo principal:**
1. O gestor abre a aba de OKRs estratégicas do projeto.
2. O sistema busca no banco as KRs ativas e calcula o progresso atualizado de cada uma com base no percentual de conclusão das tarefas associadas.
3. A interface apresenta o painel contendo: gráfico de tendência (progresso planejado vs realizado), status da OKR (No Prazo, Atrasado, Crítico) e projeção estimada de atingimento da meta.
4. O gestor analisa quais metas estão em atraso para tomar decisões de alocação de equipe.

**Fluxos alternativos:**
- *Exportar gráficos:* O gestor exporta os gráficos de progresso em formato de imagem (PNG) para incluir em apresentações ou relatórios.

**Fluxos de exceção:**
- *Ausência de atividade:* Se a KR possuir tarefas associadas mas nenhuma alteração de status tiver ocorrido no período, o gráfico exibe progresso estagnado com um alerta de inatividade.

**Pós-condições:** Os relatórios analíticos de andamento das metas temporais são calculados e exibidos na tela.

**Critérios de aceite:**
- [ ] A re-renderização dos gráficos e relatórios estatísticos de metas estratégicas deve demorar menos de 1 segundo.
- [ ] Os gráficos devem ser responsivos adaptando-se a telas de múltiplos tamanhos.

**Prioridade:** Alta  
**Complexidade estimada:** Média
