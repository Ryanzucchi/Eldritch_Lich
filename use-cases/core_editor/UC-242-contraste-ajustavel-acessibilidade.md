### Caso de Uso: Contraste ajustável (acessibilidade)

**ID:** UC-242  
**Requisito relacionado:** RF-242 (contraste ajustável)  
**Ator(es):** Usuário (Escritor com baixa visão), Sistema  
**Pré-condições:** A aplicação está aberta na tela.  
**Gatilho:** O usuário clica no seletor de "Ajuste de Contraste" no painel de acessibilidade.  

**Fluxo principal:**
1. O usuário clica no menu de acessibilidade no cabeçalho ou rodapé.
2. O sistema exibe opções de contraste: "Contraste Padrão", "Alto Contraste Escuro" (texto amarelo em fundo preto), "Alto Contraste Claro" (texto preto em fundo branco).
3. O usuário seleciona "Alto Contraste Escuro".
4. O sistema aplica uma classe CSS de alto contraste global no `<body>`, forçando a substituição de todas as cores de fundo para preto e de todos os textos para amarelo ou branco, removendo sombras e gradientes decorativos.
5. A interface passa a ser exibida nas cores de alta visibilidade selecionadas.

**Fluxos alternativos:**
- *Inversão de Cores:* O usuário ativa a chave "Inverter Cores" para aplicar um filtro CSS rápido de inversão global (`filter: invert(1)`) como recurso de acessibilidade.

**Fluxos de exceção:**
- *Imagens ilegíveis:* No modo de alto contraste, o sistema mantém as imagens originais intactas, mas adiciona bordas de alto relevo ao seu redor para separá-las claramente do fundo.

**Pós-condições:** As novas cores de alto contraste são aplicadas em toda a interface do usuário.

**Critérios de aceite:**
- [ ] O modo de alto contraste deve atender ou superar as métricas de contraste mínimo da especificação WCAG 2.1 nível AAA.
- [ ] A transição e repintura da tela devem ocorrer em menos de 100ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
