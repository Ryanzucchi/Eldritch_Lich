### Caso de Uso: Emitir holerite/contracheque

**ID:** UC-310  
**Requisito relacionado:** RF-309 (emitir holerite/contracheque)  
**Ator(es):** Sistema, Funcionário, Administrador/RH  
**Pré-condições:** A folha de pagamento do período correspondente está calculada e aprovada.  
**Gatilho:** A folha de pagamento é liberada pelo gestor para consulta.  

**Fluxo principal:**
1. O gestor do RH clica em "Liberar Holerites aos Funcionários" na tela de fechamento de folha.
2. O sistema gera um arquivo PDF individual para cada funcionário contendo: cabeçalho corporativo, descrição detalhada de proventos/descontos e bases de INSS/FGTS.
3. O sistema disponibiliza o PDF na área de autoatendimento do funcionário.
4. O funcionário correspondente é notificado por e-mail e push de que o holerite do período está disponível.
5. O funcionário acessa seu painel, visualiza o demonstrativo e clica em "Baixar PDF".
6. O navegador inicia o download do arquivo de contracheque.

**Fluxos alternativos:**
- *Assinatura digital:* O funcionário clica em "Dar Ciente" e assina digitalmente o recebimento do holerite na própria plataforma.

**Fluxos de exceção:**
- *Folha pendente:* O sistema impede a emissão de holerites individuais de um período cujo status não esteja marcado como "Fechado/Aprovado".

**Pós-condições:** O holerite individual em formato PDF é gerado, disponibilizado e baixado pelo funcionário.

**Critérios de aceite:**
- [ ] O PDF do holerite deve atender aos padrões legais de layout de recibo de pagamento salarial.
- [ ] A notificação por e-mail e liberação devem ser processadas em background de forma assíncrona.

**Prioridade:** Alta  
**Complexidade estimada:** Média
