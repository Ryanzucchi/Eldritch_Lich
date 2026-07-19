### Caso de Uso: Manter consistência dos dados em edição colaborativa em tempo real (RNF)

**ID:** UC-428  
**Requisito relacionado:** RNF-High-4 (consistência de dados em edição colaborativa)  
**Ator(es):** Sistema (Servidor de Sincronização / WebSockets)  
**Pré-condições:** Algoritmo de resolução de conflitos (ex: CRDT) ativo no editor de texto.  
**Gatilho:** Dois ou mais colaboradores realizam edições simultâneas e concorrentes no mesmo parágrafo de um documento.  

**Fluxo principal:**
1. O Usuário A e o Usuário B estão editando simultaneamente o mesmo texto.
2. O Usuário A insere um caractere e o Usuário B edita outra palavra na mesma linha com diferença de milissegundos.
3. O sistema de sincronização no backend recebe os eventos de alteração de ambos os clientes via WebSockets de forma paralela.
4. O sistema aplica o algoritmo de transformação de dados (CRDT/OT) reconciliando as posições de cursores e das edições sem que haja sobrescritas brutas.
5. O sistema replica as atualizações consolidadas de volta aos navegadores de ambos em tempo real.
6. A interface exibe o texto atualizado de forma consistente e idêntica em ambos os navegadores.

**Fluxos alternativos:**
- *Edição offline de volta online:* Se as edições concorrentes ocorrerem em estados offline prolongados, o sistema exibe o painel de divergência de versões (diff) para resolução manual das partes.

**Fluxos de exceção:**
- *Conexão interrompida:* Se a conexão do WebSocket cair, a aplicação desativa a sincronização em tempo real na tela do usuário desconectado, alterando para o modo de salvamento local individual.

**Pós-condições:** O documento é editado de forma concorrente e a consistência do texto é garantida em tempo real.

**Critérios de aceite:**
- [ ] A latência de sincronização e reflexo de digitação entre os colaboradores conectados na mesma página deve ser inferior a 300ms.
- [ ] A aplicação do algoritmo de concorrência não deve corromper a estrutura e a ordem dos caracteres do documento.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
