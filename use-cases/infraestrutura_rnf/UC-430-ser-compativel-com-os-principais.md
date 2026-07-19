### Caso de Uso: Ser compatível com os principais navegadores (Chrome, Firefox, Safari, Edge) (RNF)

**ID:** UC-430  
**Requisito relacionado:** RNF-High-6 (compatibilidade com navegadores principais)  
**Ator(es):** Sistema (Frontend / Código Transpilado)  
**Pré-condições:** Código do frontend compilado utilizando transpiladores (Babel) e prefixadores de CSS automáticos.  
**Gatilho:** O usuário acessa a plataforma a partir de diferentes navegadores.  

**Fluxo principal:**
1. O usuário abre o sistema utilizando o navegador Apple Safari ou Mozilla Firefox.
2. O navegador baixa o pacote de código JS e CSS transpilado e compatível da plataforma.
3. O motor de renderização executa os scripts de Web APIs padrão.
4. A página é carregada sem falhas de sintaxe de JavaScript ou quebras de estilos e posicionamentos CSS.
5. Todas as funcionalidades (editor, chat via WebSocket, arrastar e soltar do Kanban) operam com comportamento e layout idênticos aos exibidos no Google Chrome.

**Fluxos alternativos:**
- *Polyfills de suporte:* Se o usuário acessar de um navegador com suporte reduzido a alguma API nativa de áudio ou vídeo, o sistema carrega polyfills específicos em background para manter a funcionalidade ativa.

**Fluxos de exceção:**
- *Navegador obsoleto:* Se o usuário tentar acessar a plataforma utilizando um navegador totalmente desatualizado ou sem suporte de segurança (ex: Internet Explorer), o sistema exibe uma página estática orientando a atualização.

**Pós-condições:** A aplicação é executada de forma correta e consistente no navegador utilizado pelo usuário.

**Critérios de aceite:**
- [ ] O código Javascript gerado não deve conter sintaxes modernas incompatíveis com navegadores sem transpilamento prévio (Babel ES6 target).
- [ ] A aplicação deve ser testada e homologada nas últimas 3 versões estáveis dos navegadores Google Chrome, Mozilla Firefox, Apple Safari e Microsoft Edge.

**Prioridade:** Alta  
**Complexidade estimada:** Média
