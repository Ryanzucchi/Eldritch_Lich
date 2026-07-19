### Caso de Uso: Personalizar cores

**ID:** UC-085  
**Requisito relacionado:** RF-85 (personalizar cores)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** As configurações de aparência estão acessíveis.  
**Gatilho:** O usuário clica na paleta de cores ou tema de colorização do projeto.  

**Fluxo principal:**
1. O usuário acessa "Configurações de Aparência" -> "Cores do Tema".
2. O sistema exibe um mapa de paletas de cores padrão e um seletor de cores customizadas.
3. O usuário altera a cor primária para indigo e a cor de fundo para slate dark.
4. O sistema atualiza as variáveis CSS globais da aplicação com os novos valores.
5. O sistema armazena o mapa de cores no banco de dados de preferências do usuário.

**Fluxos alternativos:**
- *Colorir itens individuais:* O usuário altera a cor de fundo de uma pasta específica na árvore lateral.

**Fluxos de exceção:**
- *Cores com baixo contraste:* Se o usuário escolher uma combinação com contraste inferior a 4.5:1 (WCAG), o sistema emite um aviso sugerindo cores com melhor contraste.

**Pós-condições:** A aplicação atualiza o esquema de cores e aplica a nova identidade visual.

**Critérios de aceite:**
- [ ] A aplicação de novas paletas de cores deve cobrir botões, textos, menus e destaques da interface.
- [ ] As cores personalizadas devem ser salvas e sincronizadas entre as sessões do usuário.

**Prioridade:** Baixa  
**Complexidade estimada:** Baixa
