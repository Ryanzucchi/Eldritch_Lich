### Caso de Uso: Rastrear hipóteses e experimentos

**ID:** UC-318  
**Requisito relacionado:** RF-317 (rastrear hipóteses e experimentos)  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** Módulo de pesquisa ativa estruturado no projeto.  
**Gatilho:** O usuário clica em "Nova Hipótese" ou "Novo Experimento".  

**Fluxo principal:**
1. O usuário abre o painel do laboratório do projeto acadêmico e clica em "Adicionar Hipótese".
2. O sistema abre um formulário solicitando: Enunciado da Hipótese, Variáveis Analisadas e Metodologia.
3. O usuário preenche e salva a hipótese.
4. O usuário acessa a aba "Experimentos Realizados" e clica em "Registrar Experimento" para aquela hipótese.
5. O usuário insere os dados de execução, data, parâmetros medidos e define o resultado (Confirmado, Refutado, Inconclusivo).
6. O sistema grava a relação na base de dados.
7. O painel passa a exibir um gráfico de progresso mostrando a taxa de confirmação das hipóteses do projeto.

**Fluxos alternativos:**
- *Vincular a notas de estudo:* O usuário associa notas de campo contendo diários de laboratório como evidências físicas daquele experimento.

**Fluxos de exceção:**
- *Tentativa de exclusão:* Se o usuário tentar apagar uma hipótese que já possui experimentos registrados, o sistema bloqueia e orienta a arquivar a hipótese em vez de excluí-la para manter o histórico de integridade científica.

**Pós-condições:** O histórico estruturado de hipóteses científicas e seus respectivos testes empíricos é gravado na base de dados.

**Critérios de aceite:**
- [ ] A interface do laboratório deve apresentar um status visível diferenciando hipóteses ativas, confirmadas e refutadas.
- [ ] O processamento estatístico dos experimentos de pesquisa deve rodar em menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
