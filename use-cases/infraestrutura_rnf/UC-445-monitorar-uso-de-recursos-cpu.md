### Caso de Uso: Monitorar uso de recursos (CPU, memória, armazenamento) com alertas automáticos (RNF)

**ID:** UC-445  
**Requisito relacionado:** RNF-Medium-9 (monitoramento de recursos com alertas automáticos)  
**Ator(es):** Sistema, Agente de Monitoramento (Infraestrutura)  
**Pré-condições:** Agente de métricas instalado e monitorando os servidores e banco de dados.  
**Gatilho:** O uso de hardware (CPU, Memória, Disco) ultrapassa o limite configurado de 85% de utilização.  

**Fluxo principal:**
1. O servidor de banco de dados sofre alta carga e o consumo de memória atinge 87% de utilização.
2. O agente de monitoramento coleta as métricas e identifica que o limite de alerta (85%) foi superado.
3. O sistema de monitoramento gera um evento de alerta em background.
4. O sistema dispara notificações automáticas contendo o servidor afetado, recurso e percentual de uso para o e-mail dos administradores e canal Slack de DevOps.
5. O time de SRE analisa o alerta de forma preventiva para redimensionar o hardware antes que ocorram indisponibilidades de banco.

**Fluxos alternativos:**
- *Alertas para usuários:* O sistema de monitoramento detecta que o armazenamento de mídias de um cliente atingiu 95% do plano contratado e envia uma notificação automática por e-mail sugerindo limpeza ou upgrade de cota.

**Fluxos de exceção:**
- *Falha repentina (OOM):* Se ocorrer um pico de exaustão instantâneo que impeça o envio de alertas preventivos, o sistema reinicia o processo e dispara o log de erro pós-evento de falha crítica de hardware de imediato.

**Pós-condições:** Os alertas de exaustão de hardware são emitidos, possibilitando manutenções proativas e preventivas da equipe de SRE.

**Critérios de aceite:**
- [ ] O atraso entre a coleta do pico de recurso e o recebimento da notificação no Slack da equipe de engenharia deve ser inferior a 1 minuto.
- [ ] O monitoramento de hardware deve rodar de forma contínua com intervalo máximo de amostragem de 10 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média
