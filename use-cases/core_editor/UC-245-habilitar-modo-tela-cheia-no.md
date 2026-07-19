### Caso de Uso: Habilitar modo tela cheia no modo leitura

**ID:** UC-245  
**Requisito relacionado:** RF-245 (habilitar modo tela cheia no modo leitura)  
**Ator(es):** Usuário (Leitor/Escritor)  
**Pré-condições:** O texto do capítulo está carregado no Modo Leitura.  
**Gatilho:** O usuário clica no botão "Tela Cheia do Modo Leitura" ou pressiona a tecla F11.  

**Fluxo principal:**
1. O usuário visualiza o texto no Modo Leitura.
2. O usuário clica no ícone de "Maximizar" no cabeçalho ou barra flutuante de leitura.
3. O sistema aciona o modo de tela cheia do navegador (via Fullscreen API) para o painel de leitura.
4. A página do livro expande-se ocupando 100% da tela física, ocultando abas do navegador e barras de tarefas.
5. O usuário realiza a leitura sem interrupções visuais externas.

**Fluxos alternativos:**
- *Paginação por teclado:* No modo leitura em tela cheia, o usuário utiliza as setas esquerda e direita do teclado para passar as páginas de texto lateralmente, simulando a leitura física.

**Fluxos de exceção:**
- *Bloqueio de tela cheia:* Em dispositivos móveis onde o navegador impede a tela cheia automática, o sistema maximiza os elementos visuais internos cobrindo a totalidade da janela visível (viewport).

**Pós-condições:** O Modo Leitura é apresentado em tela cheia no monitor do usuário.

**Critérios de aceite:**
- [ ] Pressionar 'Esc' deve fechar o modo de tela cheia imediatamente, retornando à visualização de leitura normal.
- [ ] A transição e paginação lateral devem rodar de forma fluida.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
