### Caso de Uso: Calcular impostos e encargos trabalhistas

**ID:** UC-312  
**Requisito relacionado:** RF-311 (calcular impostos e encargos trabalhistas)  
**Ator(es):** Sistema, Administrador/RH  
**Pré-condições:** A folha de pagamento do período está calculada ou em processamento.  
**Gatilho:** O sistema realiza o fechamento da folha ou o gestor solicita a apuração fiscal.  

**Fluxo principal:**
1. O gestor acessa o painel fiscal e clica em "Apuração de Encargos".
2. O sistema faz a leitura dos proventos da folha ativa e calcula os tributos devidos pela empresa: FGTS, INSS Patronal e RAT/FAP, além das provisões de 13º salário e férias.
3. O sistema calcula também as retenções na fonte efetuadas (INSS e IRRF retidos dos colaboradores).
4. O sistema gera a guia ou relatório com os valores consolidados das obrigações da folha.
5. O gestor exporta os dados ou envia para a contabilidade.

**Fluxos alternativos:**
- *Integração com eSocial:* O sistema gera a guia de declaração de encargos no formato XML compatível com as obrigações acessórias federais.

**Fluxos de exceção:**
- *Tabela desatualizada:* Se a tabela de alíquotas do INSS/IRRF do ano corrente não estiver cadastrada no sistema, o cálculo é suspenso com um alerta solicitando atualização cadastral de parâmetros pelo administrador.

**Pós-condições:** As provisões e encargos trabalhistas são consolidados e registrados na tabela fiscal do banco.

**Critérios de aceite:**
- [ ] Os cálculos devem seguir estritamente as regras de dedução progressiva e limites de teto de contribuição vigentes.
- [ ] A apuração de encargos de folha padrão deve rodar em menos de 2 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
