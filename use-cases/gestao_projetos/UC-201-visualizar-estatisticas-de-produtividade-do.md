### Caso de Uso: Visualizar estatísticas de produtividade do colaborador

**ID:** UC-201  
**Requisito relacionado:** RF-201 (visualizar estatísticas de produtividade do colaborador)  
**Ator(es):** Usuário (Escritor/Admin), Sistema  
**Pré-condições:** O projeto possui atividade de múltiplos colaboradores registrada na tabela de logs.  
**Gatilho:** O usuário clica na aba "Produtividade da Equipe" no painel de estatísticas.  

**Fluxo principal:**
1. O usuário acessa o Dashboard de estatísticas e clica em "Métricas dos Colaboradores".
2. O sistema exibe um seletor contendo a lista de membros do projeto.
3. O usuário seleciona o colaborador desejado.
4. O sistema processa os logs e exibe:
   - Gráfico de palavras escritas por dia pelo colaborador.
   - Horários de maior atividade de escrita.
   - Lista de capítulos com maior contribuição desse membro.
5. O usuário visualiza o relatório de rendimento.

**Fluxos alternativos:**
- *Métricas individuais:* Se o projeto for privado (individual), a tela exibe apenas o relatório de produtividade do próprio usuário escritor.

**Fluxos de exceção:**
- *Privacidade ativada:* Se o colaborador configurou seu perfil para ocultar dados de produtividade detalhados, o sistema exibe apenas as contagens gerais de palavras adicionadas, omitindo dados comportamentais.

**Pós-condições:** As estatísticas individuais de rendimento e constância de escrita do colaborador selecionado são exibidas.

**Critérios de aceite:**
- [ ] A contagem das estatísticas de produtividade deve ser recalculada e guardada no banco periodicamente de forma assíncrona.
- [ ] O carregamento dos gráficos estatísticos deve demorar menos de 1 segundo.

**Prioridade:** Média  
**Complexidade estimada:** Média
