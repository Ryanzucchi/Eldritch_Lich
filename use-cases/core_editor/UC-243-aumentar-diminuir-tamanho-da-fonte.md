### Caso de Uso: Aumentar/diminuir tamanho da fonte (acessibilidade)

**ID:** UC-243  
**Requisito relacionado:** RF-243 (aumentar/diminuir tamanho da fonte)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A interface da aplicação está ativa.  
**Gatilho:** O usuário clica nos botões "A+" ou "A-" no painel de acessibilidade ou usa os atalhos correspondentes.  

**Fluxo principal:**
1. O usuário abre as configurações visuais ou clica nos controles "A+" (Aumentar Fonte) e "A-" (Diminuir Fonte) na barra de ferramentas.
2. O usuário clica três vezes no botão "A+".
3. O sistema lê o fator de escala de fonte ativo e o incrementa em etapas (chegando a 130%).
4. O sistema altera o tamanho da fonte base na folha de estilos global do elemento HTML principal.
5. Toda a tipografia da interface se expande proporcionalmente mantendo a coerência do layout.

**Fluxos alternativos:**
- *Ajuste exclusivo do editor:* O usuário ajusta o tamanho da fonte apenas para a área de escrita do capítulo de texto, mantendo as barras de menus e arquivos na escala padrão.

**Fluxos de exceção:**
- *Layout quebrado:* Se o usuário aumentar o tamanho da fonte a níveis extremos, o sistema ativa barras de rolagem horizontais automáticas em painéis flexíveis para evitar que os textos fiquem ocultos de forma inacessível.

**Pós-condições:** A escala do tamanho das fontes da interface é atualizada.

**Critérios de aceite:**
- [ ] O sistema deve suportar redimensionamento de fonte de até 200% sem perda de funcionalidades.
- [ ] A re-renderização tipográfica da tela deve ser imediata (< 50ms).

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
