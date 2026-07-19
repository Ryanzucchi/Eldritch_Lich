### Caso de Uso: Seguir princípios de acessibilidade (WCAG) para leitores de tela e navegação por teclado (RNF)

**ID:** UC-432  
**Requisito relacionado:** RNF-High-8 (acessibilidade WCAG)  
**Ator(es):** Sistema (Interface / HTML Semântico)  
**Pré-condições:** Estrutura HTML5 semântica e atributos WAI-ARIA corretamente mapeados nos componentes.  
**Gatilho:** Um usuário com deficiência visual ou motora navega pela plataforma utilizando teclado ou leitor de tela.  

**Fluxo principal:**
1. O usuário acessa a plataforma e inicia a navegação utilizando a tecla Tab.
2. O sistema exibe um indicador visual claro de foco (outline colorido) em cada elemento ativo selecionado na sequência de navegação.
3. O leitor de tela traduz em áudio o texto e os atributos de acessibilidade dos elementos focados (ex: `aria-expanded="false"`, `role="button"`).
4. O usuário utiliza a tecla Enter ou Barra de Espaço para acionar as opções de menus ou botões.
5. O sistema executa o comando e atualiza o estado lido na tela para o usuário.

**Fluxos alternativos:**
- *Atalhos de acessibilidade rápidos:* O usuário pressiona atalhos de teclado (ex: `Alt + 1`) para saltar os menus iniciais e ir diretamente para a caixa de edição de texto principal, agilizando o uso.

**Fluxos de exceção:**
- *Imagens sem tag alt:* Mídias inseridas sem descrição alternativa (alt tag) são ignoradas pelo leitor de tela ou descritas genericamente como "Imagem ilustrativa" para evitar a leitura ruidosa de caminhos brutos de arquivos.

**Pós-condições:** O usuário consegue navegar, ler e realizar ações críticas da plataforma por teclado ou leitor de tela de forma independente.

**Critérios de aceite:**
- [ ] O contraste de cores entre o texto e o plano de fundo em toda a interface deve atender à taxa mínima de 4.5:1 (nível AA da WCAG).
- [ ] A interface deve ser navegável por teclado sem armadilhas de foco (keyboard traps) que impeçam o usuário de retroceder ou fechar modais.

**Prioridade:** Alta  
**Complexidade estimada:** Média
