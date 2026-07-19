### Caso de Uso: Suporte a leitor de tela (acessibilidade)

**ID:** UC-160  
**Requisito relacionado:** RF-160 (suporte a leitor de tela)  
**Ator(es):** Usuário (Escritor com deficiência visual), Sistema  
**Pré-condições:** O usuário possui um software leitor de tela ativo em sua máquina.  
**Gatilho:** O usuário navega pela aplicação utilizando as teclas Tab, setas direcionais ou atalhos de leitura.  

**Fluxo principal:**
1. O usuário acessa a página web do sistema.
2. O leitor de tela lê de forma estruturada as seções principais da interface graças ao uso de marcações HTML5 semânticas (como `<header>`, `<nav>`, `<main>`).
3. Ao focar em elementos interativos, o sistema fornece rótulos descritivos precisos via atributos ARIA (ex: `aria-label="Pasta de Personagens, expandida"`, `role="button"`).
4. Ao navegar pelo editor de texto, os atributos ARIA expõem o conteúdo da linha ativa e informam sobre desvios gramaticais.

**Fluxos alternativos:**
- *Atalhos de acessibilidade:* O usuário pressiona uma combinação de teclas padrão de acessibilidade para saltar diretamente para a caixa de digitação principal do editor.

**Fluxos de exceção:**
- *Imagens sem descrição:* Se o usuário focar em uma imagem que não possui `alt` definido, o sistema avisa o escritor sobre a importância de preencher a descrição textual na aba de propriedades.

**Pós-condições:** O usuário com deficiência visual consegue ler, navegar e editar dados de forma independente na aplicação.

**Critérios de aceite:**
- [ ] Todos os elementos e botões interativos devem possuir rótulos acessíveis descritivos (ARIA labels).
- [ ] A aplicação deve ser navegável de ponta a ponta utilizando apenas o teclado.

**Prioridade:** Alta  
**Complexidade estimada:** Média
