### Caso de Uso: Revisar metas periodicamente (check-in)

**ID:** UC-350  
**Requisito relacionado:** RF-349 (revisar metas periodicamente (check-in))  
**Ator(es):** Colaborador (Responsável pela KR), Gestor, Sistema  
**Pré-condições:** OKRs cadastradas com responsáveis associados.  
**Gatilho:** Abertura do período semanal de check-in de metas do projeto.  

**Fluxo principal:**
1. O colaborador responsável pela KR recebe a notificação de lembrete semanal de check-in.
2. O colaborador clica na notificação e acessa o formulário de check-in.
3. O sistema exibe o valor anterior registrado da KR.
4. O colaborador insere o novo valor medido, escreve a nota de progresso e confirma.
5. O colaborador clica em "Salvar Check-in".
6. O sistema grava o check-in no banco de dados e atualiza de imediato o progresso consolidado da KR na tela do gestor.

**Fluxos alternativos:**
- *Check-in automático:* Se a KR estiver conectada a uma métrica automatizada do sistema (ex: número de builds bem-sucedidos), a plataforma coleta os dados e faz o check-in do novo valor de forma automática.

**Fluxos de exceção:**
- *Validação de limites:* Se o colaborador preencher por engano um valor que signifique regressão fora do limite aceitável de dados, o sistema solicita confirmação do valor digitado antes de fechar o registro.

**Pós-condições:** O novo marco semanal de progresso da KR é salvo na linha do tempo histórica de check-ins de objetivos.

**Critérios de aceite:**
- [ ] A interface deve listar a linha do tempo de todos os comentários e marcações de check-in efetuados.
- [ ] A gravação do check-in na base de dados deve durar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
