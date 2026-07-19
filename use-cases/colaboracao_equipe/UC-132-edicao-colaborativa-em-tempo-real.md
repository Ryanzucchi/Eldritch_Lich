### Caso de Uso: Edição colaborativa em tempo real

**ID:** UC-132  
**Requisito relacionado:** RF-132 (edição colaborativa em tempo real)  
**Ator(es):** Usuários (Colaboradores), Sistema  
**Pré-condições:** Múltiplos usuários possuem permissão de escrita e estão com o mesmo documento aberto no editor simultaneamente.  
**Gatilho:** Qualquer um dos colaboradores digita ou apaga caracteres no editor.  

**Fluxo principal:**
1. O Colaborador A e o Colaborador B estão com o mesmo capítulo aberto em suas telas.
2. O Colaborador A insere uma frase no primeiro parágrafo.
3. O sistema captura a alteração localmente e envia o delta de alteração estruturado (via algoritmo CRDT ou OT) através de uma conexão WebSocket segura.
4. O servidor recebe o delta, concilia a ordem das operações e retransmite para o Colaborador B.
5. O editor na tela do Colaborador B renderiza a nova frase imediatamente no parágrafo correspondente.

**Fluxos alternativos:**
- *Desconexão temporária:* Se um dos colaboradores perder a conexão, o editor entra em modo de reconciliação local e sincroniza as edições acumuladas assim que o canal WebSocket for restabelecido.

**Fluxos de exceção:**
- *Conflitos insolúveis:* Em caso raro de divergência de conciliação de texto que o CRDT não consiga mesclar de forma limpa, o sistema gera duas ramificações de parágrafos na tela e solicita que um dos colaboradores clique em qual versão manter.

**Pós-condições:** O documento é editado de forma simultânea por múltiplos autores mantendo a consistência dos caracteres gravados no banco de dados.

**Critérios de aceite:**
- [ ] A latência de replicação dos caracteres digitados entre as telas dos colaboradores na mesma região geográfica deve ser inferior a 150ms.
- [ ] O sistema não deve apresentar perda de caracteres ou caracteres embaralhados em testes de escrita concorrente rápida de 5 usuários.

**Prioridade:** Crítica  
**Complexidade estimada:** Alta
