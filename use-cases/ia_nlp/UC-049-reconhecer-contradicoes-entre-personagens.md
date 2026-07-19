### Caso de Uso: Reconhecer contradições entre personagens

**ID:** UC-049  
**Requisito relacionado:** RF-49 (reconhecer contradições entre personagens)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Fichas de personagens com atributos (como cor de olhos, altura) estão cadastradas e os textos mencionam esses atributos.  
**Gatilho:** Processamento automático do texto escrito ou verificação explícita solicitada pelo usuário.  

**Fluxo principal:**
1. O sistema envia a narrativa e as fichas de personagens envolvidas na cena para a IA.
2. A IA correlaciona as descrições no texto com as propriedades cadastradas na ficha de entidade do personagem (ex: a ficha diz que Arthur tem "olhos castanhos", mas a narrativa afirma: "Arthur piscou seus olhos verdes").
3. A IA identifica a contradição.
4. O sistema destaca a contradição no editor com um sublinhado lilás e exibe os detalhes da ficha do personagem no balão informativo.

**Fluxos alternativos:**
- *Atualizar Ficha:* O usuário clica em "Atualizar Ficha do Personagem" a partir do texto para alterar o registro oficial (ex: muda a cor dos olhos na ficha para verde).

**Fluxos de exceção:**
- *Disfarce intencional:* Se o personagem estiver usando disfarces ou ilusões, o escritor pode selecionar "Ignorar contradição - Disfarce" no menu do balão.

**Pós-condições:** Contradições entre a descrição textual e os metadados dos personagens são apresentadas.

**Critérios de aceite:**
- [ ] A IA deve analisar atributos físicos básicos: cor de olhos, cabelo, cicatrizes, altura relativa, destreza e status (vivo/morto).
- [ ] O processamento deve ter alta precisão para evitar excesso de falsos positivos gerados por descrições poéticas.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
