### Caso de Uso: Visualizar modo tela cheia (editor)

**ID:** UC-164  
**Requisito relacionado:** RF-164 (visualizar modo tela cheia (editor))  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O editor de texto está aberto.  
**Gatilho:** O usuário clica no ícone de "Maximizar/Tela Cheia" no cabeçalho do editor.  

**Fluxo principal:**
1. O usuário clica em "Tela Cheia do Editor".
2. O sistema aciona o modo de tela cheia para o editor de texto via Fullscreen API do navegador.
3. O navegador passa a exibir apenas a folha digital do editor na tela inteira, ocultando as abas do navegador e a barra de tarefas do sistema operacional.

**Fluxos alternativos:**
- *Modo Cenário:* O editor oculta o cursor e a barra de rolagem se o usuário passar mais de 5 segundos sem digitar, mantendo apenas o texto.

**Fluxos de exceção:**
- *Atalho bloqueado:* Caso o navegador bloqueie o foco, o sistema ajusta o foco do teclado para garantir que a digitação permaneça ativa.

**Pós-condições:** O editor de texto é exibido em modo tela cheia no monitor do usuário.

**Critérios de aceite:**
- [ ] Pressionar a tecla 'Esc' ou clicar no ícone de fechar deve desativar instantaneamente o modo de tela cheia.
- [ ] O modo tela cheia do editor deve ser independente do modo foco, mantendo seletivamente barras laterais caso o usuário deseje.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
