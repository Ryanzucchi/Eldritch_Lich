### Caso de Uso: Mesclar ramos alternativos na cronologia

**ID:** UC-263  
**Requisito relacionado:** RF-263 (mesclar ramos alternativos na cronologia)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem pelo menos duas timelines paralelas ativas no projeto.  
**Gatilho:** O usuário clica no botão "Mesclar Linhas do Tempo" no painel de controle do multiverso.  

**Fluxo principal:**
1. O usuário acessa a visualização de cronologias e clica em "Mesclar Ramos".
2. O sistema abre um modal solicitando selecionar a Timeline de Origem e a Timeline de Destino.
3. O usuário define o evento de convergência (onde as duas linhas temporais voltam a se encontrar).
4. O usuário confirma.
5. O sistema executa a mesclagem: une a trilha cronológica a partir do ponto de convergência e unifica as duas ramificações em uma única linha principal no banco de dados.
6. O grafo temporal passa a exibir a união dos caminhos em um nó comum.

**Fluxos alternativos:**
- *Convergência por evento inédito:* O usuário cria um evento de mesclagem do zero no ponto de fusão das timelines, unindo os personagens que estavam separados.

**Fluxos de exceção:**
- *Conflito de datas de eventos concomitantes:* Se a mesclagem gerar eventos repetidos na mesma data com detalhes diferentes, o sistema abre uma tela de conciliação de eventos para que o usuário decida qual versão manter ou se deve concatenar as descrições.

**Pós-condições:** As duas linhas temporais paralelas são integradas e unificadas a partir do ponto de convergência selecionado.

**Critérios de aceite:**
- [ ] A mesclagem de cronologias deve ser transacional.
- [ ] A visualização gráfica após o merge deve exibir os caminhos se unindo de forma suave no nó do evento de destino.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta
