### Caso de Uso: Realizar backup periódico automático dos dados (RNF)

**ID:** UC-417  
**Requisito relacionado:** RNF-Critical-4 (realizar backup periódico automático dos dados)  
**Ator(es):** Sistema, Servidor de Backup (Infraestrutura)  
**Pré-condições:** Agendador de tarefas ativo e espaço disponível em servidor de storage de backups.  
**Gatilho:** Disparo do cron job de backup programado (ex: diariamente às 02:00 da manhã).  

**Fluxo principal:**
1. O agendador de tarefas em background dispara o job de backup na madrugada.
2. O sistema realiza um snapshot consistente em tempo real do banco de dados.
3. O sistema compacta e criptografa o arquivo de backup resultante utilizando a chave AES-256.
4. O sistema realiza o upload seguro do arquivo para um servidor de armazenamento isolado geograficamente (outra região).
5. O sistema registra a data, tamanho, hash e status de sucesso do backup na tabela de auditoria.
6. O sistema executa rotina de purga, removendo backups com mais de 30 dias para otimização de espaço.

**Fluxos alternativos:**
- *Replicação síncrona:* O banco de dados secundário (leitura em espelho) recebe cópias síncronas de todas as transações da base principal de forma instantânea para alta disponibilidade e prevenção de catástrofes.

**Fluxos de exceção:**
- *Falha no upload:* Se o backup falhar por falta de espaço no servidor de destino ou queda de rede, o sistema envia alertas críticos via e-mail e SMS para a equipe de DevOps/SRE.

**Pós-condições:** O arquivo compactado e criptografado de backup diário é salvo de forma segura na nuvem isolada.

**Critérios de aceite:**
- [ ] O tempo total de indisponibilidade ou lentidão da aplicação durante a execução do snapshot de backup deve ser imperceptível aos usuários (< 2 segundos).
- [ ] O sistema deve reter cópias diárias por 30 dias, semanais por 4 semanas e mensais por 12 meses.

**Prioridade:** Crítica  
**Complexidade estimada:** Alta
