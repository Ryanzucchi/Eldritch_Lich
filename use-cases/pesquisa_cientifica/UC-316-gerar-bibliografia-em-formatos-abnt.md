### Caso de Uso: Gerar bibliografia em formatos (ABNT, APA, etc.)

**ID:** UC-316  
**Requisito relacionado:** RF-315 (gerar bibliografia em formatos (ABNT, APA, etc.))  
**Ator(es):** Usuário (Pesquisador), Sistema  
**Pré-condições:** Existem referências bibliográficas cadastradas na biblioteca do projeto.  
**Gatilho:** O usuário clica em "Gerar Lista de Referências / Bibliografia" no painel de exportação.  

**Fluxo principal:**
1. O usuário acessa a biblioteca do projeto e seleciona as referências que utilizou no seu texto.
2. O usuário clica no botão "Gerar Bibliografia".
3. O sistema abre o seletor de estilos acadêmicos (ABNT, APA, MLA, Vancouver).
4. O usuário seleciona o estilo desejado (ex: "ABNT NBR 6023").
5. O sistema busca as informações cadastrais das referências no banco e executa o processador de estilo de citação.
6. A interface renderiza a lista de referências formatada na tela em ordem alfabética de acordo com o padrão selecionado.
7. O usuário copia o bloco de texto formatado ou exporta em arquivo RTF/TXT.

**Fluxos alternativos:**
- *Citação rápida inline:* Ao escrever no editor de textos, o usuário digita `/citar` e seleciona uma referência. O sistema insere a citação rápida correspondente no formato correto inline (ex: `(SILVA, 2026, p. 12)`).

**Fluxos de exceção:**
- *Dados incompletos:* Se campos obrigatórios exigidos pelo padrão estiverem vazios, o sistema destaca a linha do item com um alerta sutil sobre a pendência cadastral.

**Pós-condições:** A lista de bibliografia formatada sob o padrão selecionado é disponibilizada para visualização e cópia.

**Critérios de aceite:**
- [ ] O gerador deve seguir com precisão as normas de pontuação, itálicos, negritos e ordenação exigidos por cada padrão selecionado.
- [ ] A geração da bibliografia de 50 itens deve demorar menos de 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
