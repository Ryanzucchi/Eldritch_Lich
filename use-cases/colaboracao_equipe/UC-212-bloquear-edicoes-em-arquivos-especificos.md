### Caso de Uso: Bloquear edições em arquivos específicos (concorrente)

**ID:** UC-212  
**Requisito relacionado:** RF-212 (bloquear edições em arquivos específicos (concorrente))  
**Ator(es):** Usuário (Colaborador), Sistema  
**Pré-condições:** O projeto possui edição colaborativa habilitada.  
**Gatilho:** O usuário abre um documento para escrita ou o administrador bloqueia manualmente o arquivo.  

**Fluxo principal:**
1. O Colaborador A abre o arquivo "Capítulo 7" no editor.
2. O sistema envia um sinal de bloqueio temporário de escrita (Exclusive Write Lock) para o servidor.
3. O Colaborador B tenta abrir o mesmo arquivo.
4. O sistema abre o arquivo na tela do Colaborador B em modo leitura (read-only) e exibe um alerta: "Arquivo bloqueado para edições por: Colaborador A".
5. O editor desativa a digitação para o Colaborador B.
6. Quando o Colaborador A fecha o arquivo ou fica inativo por mais de 10 minutos, o sistema revoga o bloqueio e libera o arquivo para escrita.

**Fluxos alternativos:**
- *Bloqueio Permanente de Revisão:* O administrador altera o status do texto para "Finalizado", travando a escrita para todos os colaboradores por padrão.

**Fluxos de exceção:**
- *Perda de conexão do detentor do lock:* Se o Colaborador A desconectar abruptamente, o servidor mantém o lock por 2 minutos e depois o libera automaticamente (heartbeat timeout).

**Pós-condições:** O arquivo fica protegido contra escritas concorrentes sobrepostas de múltiplos editores.

**Critérios de aceite:**
- [ ] O lock exclusivo deve ser gerenciado em base de memória rápida do servidor (ex: Redis) para evitar condições de corrida.
- [ ] O tempo de resposta ao solicitar ou revogar um lock deve ser menor que 150ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
