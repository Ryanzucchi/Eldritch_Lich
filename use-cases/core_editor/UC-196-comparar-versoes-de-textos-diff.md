### Caso de Uso: Comparar versões de textos (diff side-by-side)

**ID:** UC-196  
**Requisito relacionado:** RF-196 (comparar versões de textos (diff side-by-side))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto possui pelo menos duas versões registradas no histórico.  
**Gatilho:** O usuário seleciona duas versões e clica em "Comparar Side-by-Side".  

**Fluxo principal:**
1. O usuário acessa a aba "Histórico de Versões" de um texto.
2. O usuário seleciona a "Versão A" e a "Versão B (Atual)".
3. O usuário clica em "Comparar Lado a Lado".
4. O sistema divide a tela verticalmente em dois painéis do editor:
   - Painel Esquerdo: Exibe o texto da Versão A, destacando em vermelho as palavras apagadas.
   - Painel Direito: Exibe o texto da Versão B, destacando em verde as palavras inseridas.
5. As barras de rolagem de ambos os painéis são vinculadas (sincronizadas) durante a navegação.

**Fluxos alternativos:**
- *Diff inline:* O usuário altera para a visualização inline, onde exclusões e inclusões são mostradas no mesmo editor de forma corrida.

**Fluxos de exceção:**
- *Versões idênticas:* Se as versões selecionadas forem iguais, o sistema informa: "Nenhuma diferença encontrada entre as versões".

**Pós-condições:** A comparação de diferenças lado a lado é exibida de forma sincronizada na tela.

**Critérios de aceite:**
- [ ] A rolagem sincronizada deve ter precisão de pixel para manter os parágrafos correspondentes alinhados na tela.
- [ ] A geração do diff lado a lado para um capítulo de 5.000 palavras deve demorar menos de 1,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
