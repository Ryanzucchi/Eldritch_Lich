### Caso de Uso: Alternar fonte do editor (serifada/sem serifa/mono)

**ID:** UC-244  
**Requisito relacionado:** RF-244 (alternar fonte do editor)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O editor de texto está aberto.  
**Gatilho:** O usuário escolhe a família de fontes no menu de visualização do editor.  

**Fluxo principal:**
1. O usuário abre as configurações visuais do editor de texto.
2. O sistema exibe as opções de famílias tipográficas homologadas: "Serifada", "Sem Serifa" e "Monoespaçada".
3. O usuário seleciona a opção "Monoespaçada".
4. O sistema atualiza a variável CSS de tipografia do editor de texto.
5. O texto do capítulo passa a ser renderizado na fonte selecionada.

**Fluxos alternativos:**
- *Instalar fontes locais:* O usuário digita o nome de uma fonte do sistema operacional instalada em seu computador no campo personalizado do menu para utilizá-la.

**Fluxos de exceção:**
- *Fonte indisponível:* Se a fonte local digitada pelo usuário não estiver instalada, o sistema reverte para o fallback padrão do grupo selecionado.

**Pós-condições:** A família tipográfica do editor é atualizada conforme a seleção do usuário.

**Critérios de aceite:**
- [ ] A alteração tipográfica deve afetar apenas a visualização de digitação no editor, sem alterar a formatação do arquivo gravada no banco ou na exportação.
- [ ] O tempo de transição tipográfica na tela deve ser menor que 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
