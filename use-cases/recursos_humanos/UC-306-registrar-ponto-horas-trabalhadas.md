### Caso de Uso: Registrar ponto/horas trabalhadas

**ID:** UC-306  
**Requisito relacionado:** RF-305 (registrar ponto/horas trabalhadas)  
**Ator(es):** Funcionário, Sistema  
**Pré-condições:** O funcionário está logado no sistema em seu dispositivo de trabalho.  
**Gatilho:** O funcionário clica em "Registrar Ponto".  

**Fluxo principal:**
1. O funcionário abre o dashboard inicial do sistema.
2. O funcionário clica no botão "Registrar Ponto".
3. O sistema captura a data e o horário oficial do servidor da aplicação e a geolocalização.
4. O sistema grava a batida na tabela de pontos do banco.
5. O sistema exibe a mensagem de confirmação do registro correspondente.
6. No final do expediente, o funcionário realiza o mesmo processo para a saída, e o sistema calcula a jornada diária realizada.

**Fluxos alternativos:**
- *Solicitação de Ajuste:* O funcionário solicita ajuste de ponto preenchendo justificativa por escrito caso esqueça de bater. O ajuste segue para aprovação do gestor de RH.

**Fluxos de exceção:**
- *Registro duplicado:* Se o funcionário tentar registrar o ponto duas vezes em menos de 2 minutos por erro, o sistema exibe "Batida duplicada detectada" e impede a gravação repetida.

**Pós-condições:** O registro de presença e jornada de trabalho é salvo de forma definitiva.

**Critérios de aceite:**
- [ ] O horário do registro de ponto deve ser blindado contra adulterações de fuso horário do dispositivo do cliente.
- [ ] A consulta do espelho de ponto mensal pelo funcionário deve carregar em menos de 500ms.

**Prioridade:** Crítica  
**Complexidade estimada:** Alta
