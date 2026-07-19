### Caso de Uso: Responder a ações críticas (salvar, editar) em menos de 1 segundo (RNF)

**ID:** UC-424  
**Requisito relacionado:** RNF-Critical-11 (responder a ações críticas em menos de 1 segundo)  
**Ator(es):** Sistema (Backend/Banco de Dados)  
**Pré-condições:** Banco de dados indexado e API de escrita otimizada.  
**Gatilho:** O usuário clica em "Salvar" ou realiza uma alteração de dados crítica.  

**Fluxo principal:**
1. O usuário clica em "Salvar" ao editar informações na interface.
2. O backend recebe a chamada da API contendo a payload com os dados atualizados.
3. O backend processa a escrita gravando na tabela correspondente.
4. O banco de dados confirma o salvamento físico e o sistema envia a resposta de confirmação de sucesso de volta ao cliente.
5. O tempo total transcorrido entre o clique do usuário e a resposta visual de sucesso na tela é inferior a 1 segundo.

**Fluxos alternativos:**
- *Escrita assíncrona otimista:* O cliente exibe o indicador visual de salvamento imediato na interface, enquanto envia a transação de rede em background de forma silenciosa e paralela.

**Fluxos de exceção:**
- *Carga elevada:* Sob picos de tráfego extremos em que a gravação direta demore mais de 1 segundo, o sistema redireciona a chamada para uma fila de processamento assíncrono, respondendo "Salvando em background" de imediato para não travar a tela.

**Pós-condições:** A alteração crítica é gravada na base de dados.

**Critérios de aceite:**
- [ ] 95% das requisições de salvamento e edições de dados de fichas devem responder em até 800ms.
- [ ] O tempo total de resposta de ponta a ponta na API deve ser monitorado por ferramentas de APM.

**Prioridade:** Crítica  
**Complexidade estimada:** Média
