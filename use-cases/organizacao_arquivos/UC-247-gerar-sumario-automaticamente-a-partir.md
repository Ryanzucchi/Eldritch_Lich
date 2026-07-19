### Caso de Uso: Gerar sumário automaticamente a partir de títulos

**ID:** UC-247  
**Requisito relacionado:** RF-247 (gerar sumário automaticamente a partir de títulos)  
**Ator(es):** Sistema  
**Pré-condições:** O usuário edita o texto e insere ou remove cabeçalhos.  
**Gatilho:** Inatividade pós-digitação (debounce de 2 segundos) no editor de texto.  

**Fluxo principal:**
1. O usuário digita no editor e insere um cabeçalho formatando-o como Título.
2. O sistema detecta a alteração no esquema do documento.
3. Em background, o listener do editor atualiza a árvore lógica de cabeçalhos.
4. O sistema regenera o sumário lateral de forma automática, adicionando o novo item na listagem sem necessidade de checagem manual.

**Fluxos alternativos:**
- *Remoção automática:* O usuário apaga o cabeçalho do editor. O sistema detecta a deleção e remove o respectivo item do sumário lateral instantaneamente.

**Fluxos de exceção:**
- *Títulos duplicados:* Se houver dois títulos idênticos no mesmo texto, o sistema os exibe separadamente no sumário indexando-os com suas respectivas coordenadas físicas distintas.

**Pós-condições:** O sumário é atualizado dinamicamente refletindo a estrutura de títulos no texto.

**Critérios de aceite:**
- [ ] O processamento em background da árvore de cabeçalhos não deve causar lentidão ou lag de digitação no editor.
- [ ] A atualização do sumário na tela ao digitar deve demorar menos de 100ms após o período de debounce.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
