### Caso de Uso: Visualizar histórico de guerras e tratados

**ID:** UC-182  
**Requisito relacionado:** RF-182 (visualizar histórico de guerras e tratados)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos diplomáticos (guerras e tratados) com facções associadas estão cadastrados na timeline.  
**Gatilho:** O usuário clica em "Histórico de Conflitos" nas opções de uma facção ou seção correspondente.  

**Fluxo principal:**
1. O usuário acessa a página diplomática do projeto ou a ficha técnica de uma facção.
2. O usuário clica na aba "Guerras e Tratados".
3. O sistema busca na timeline todos os eventos categorizados como conflito ou tratado vinculados àquela facção.
4. O sistema exibe uma linha do tempo vertical simplificada contendo apenas os marcos bélicos e acordos de paz em ordem cronológica.
5. O usuário visualiza o histórico condensado e os saldos diplomáticos da facção selecionada.

**Fluxos alternativos:**
- *Mapear perdas territoriais:* O histórico exibe links direcionando para os mapas das regiões ganhas ou perdidas nos respectivos tratados de paz.

**Fluxos de exceção:**
- *Sem conflitos:* Se a facção for neutra e nunca tiver participado de conflitos, o sistema exibe "Histórico pacífico. Nenhuma guerra ou tratado registrado".

**Pós-condições:** O histórico diplomático focado de guerras e tratados da facção é exibido de forma linear na interface.

**Critérios de aceite:**
- [ ] Os eventos bélicos ativos devem ser exibidos com destaque em vermelho e os tratados de paz em verde.
- [ ] A consulta e montagem do histórico de conflitos devem durar menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
