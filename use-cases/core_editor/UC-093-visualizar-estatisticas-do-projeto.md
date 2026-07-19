### Caso de Uso: Visualizar estatísticas do projeto

**ID:** UC-093  
**Requisito relacionado:** RF-93 (visualizar estatísticas do projeto)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui textos escritos e histórico de atividade.  
**Gatilho:** O usuário clica no botão "Estatísticas" ou "Dashboard do Projeto".  

**Fluxo principal:**
1. O usuário acessa a aba "Estatísticas".
2. O sistema calcula métricas agregadas do projeto: total de palavras escritas, total de caracteres, quantidade de pastas, número de textos, quantidade de entidades catalogadas, e média de palavras por capítulo.
3. O sistema renderiza na tela um dashboard com gráficos de linha de progresso de escrita diária, gráfico de pizza de distribuição de entidades por tipo, e cards de status.
4. O usuário interage com o gráfico aplicando filtros por período de tempo (semana, mês, ano).

**Fluxos alternativos:**
- *Estimativa de tempo de leitura:* O dashboard apresenta a estatística do tempo de leitura total estimado para todo o projeto.

**Fluxos de exceção:**
- *Projeto vazio:* Se o projeto não contiver dados, a interface exibe "Nenhuma estatística disponível ainda. Comece a escrever para popular os gráficos".

**Pós-condições:** O usuário visualiza o relatório analítico do progresso e dimensões do projeto.

**Critérios de aceite:**
- [ ] Os gráficos estatísticos devem ser gerados em menos de 1 segundo utilizando bibliotecas leves.
- [ ] A contagem das estatísticas agregadas deve ser atualizada em background após cada evento de salvamento de arquivo.

**Prioridade:** Média  
**Complexidade estimada:** Média
