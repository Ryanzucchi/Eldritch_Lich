### Caso de Uso: Arquivar mensagens do chat

**ID:** UC-216  
**Requisito relacionado:** RF-216 (arquivar mensagens do chat)  
**Ator(es):** Usuário (Admin/Owner do Projeto), Sistema  
**Pré-condições:** Existem mensagens de chat cadastradas na base de dados.  
**Gatilho:** O administrador solicita o arquivamento de um canal ou histórico de conversações antigas.  

**Fluxo principal:**
1. O administrador acessa as configurações de chat do canal correspondente.
2. O administrador clica na opção "Arquivar Conversas".
3. O sistema abre um modal solicitando o critério temporal (ex: arquivar mensagens com mais de 30 dias).
4. O administrador seleciona e clica em "Confirmar Arquivamento".
5. O sistema atualiza o status das mensagens filtradas para `arquivada = true` na base de dados.
6. As mensagens desaparecem da barra de chat ativa e ficam acessíveis apenas na aba "Arquivo de Mensagens" para consulta histórica e auditoria.

**Fluxos alternativos:**
- *Arquivar canal completo:* O administrador arquiva o canal inteiro. O canal é fechado para novos envios e movido para a pasta de canais arquivados.

**Fluxos de exceção:**
- *Desarquivar canal:* O administrador acessa a lista de arquivados e clica em "Reativar Canal", retornando-o para a aba ativa de chat.

**Pós-condições:** As mensagens de chat são removidas da linha de visualização diária e movidas para a base de arquivo.

**Critérios de aceite:**
- [ ] O arquivamento de mensagens em lote não deve impactar o desempenho da rede de chat ativa.
- [ ] A interface deve carregar as mensagens arquivadas em modo somente leitura.

**Prioridade:** Baixa  
**Complexidade estimada:** Baixa
