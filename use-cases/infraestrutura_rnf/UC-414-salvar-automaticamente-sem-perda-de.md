### Caso de Uso: Salvar automaticamente sem perda de progresso em caso de queda de conexão (RNF)

**ID:** UC-414  
**Requisito relacionado:** RNF-Critical-1 (salvar automaticamente sem perda em queda de conexão)  
**Ator(es):** Sistema, Infraestrutura Cliente/Servidor  
**Pré-condições:** O usuário está ativamente editando um documento de texto ou ficha técnica no editor.  
**Gatilho:** A conexão de rede com a internet é interrompida (offline).  

**Fluxo principal:**
1. O usuário está digitando no editor e a conexão com a internet cai.
2. O sistema detecta a perda de sinal local e exibe uma notificação de controle visual no rodapé da página.
3. O sistema desvia o salvamento automático das novas edições de texto da API remota para o banco de dados local do navegador (IndexedDB).
4. O usuário continua escrevendo e editando normalmente sem interrupções de interface.
5. Quando a conexão é restabelecida, o sistema detecta o sinal de rede ativo, executa a sincronização dos dados locais salvos com a API do servidor e exibe a mensagem de sucesso.

**Fluxos alternativos:**
- *Conflito de versão:* Se o documento foi editado em outra máquina enquanto o usuário estava offline, o sistema exibe o painel de resolução de conflitos de diff visual na volta online, exigindo a seleção da versão vencedora.

**Fluxos de exceção:**
- *Cache local lotado:* Se o IndexedDB do navegador do usuário estiver sem espaço livre para novas edições, o sistema exibe popup de erro crítico e bloqueia temporariamente a digitação para evitar a perda de novos dados no buffer.

**Pós-condições:** Todos os dados editados offline são salvos localmente no navegador e sincronizados de forma íntegra sem perdas ao retornar a conexão.

**Critérios de aceite:**
- [ ] Nenhuma palavra ou caractere digitado offline deve ser perdido durante a transição de rede.
- [ ] O tempo de detecção de queda e transição do salvamento de rede para o local deve ser imediato (< 50ms).

**Prioridade:** Crítica  
**Complexidade estimada:** Alta
