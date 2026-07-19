### Caso de Uso: Alternar tema claro/escuro

**ID:** UC-159  
**Requisito relacionado:** RF-159 (alternar tema claro/escuro)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está com a interface ativa na tela.  
**Gatilho:** O usuário clica no botão "Alternar Tema" no cabeçalho global do sistema.  

**Fluxo principal:**
1. O usuário clica no botão do ícone de Sol/Lua no topo direito da barra global.
2. O sistema detecta o tema atual ativo da interface (ex: "Tema Claro").
3. O sistema altera o tema da aplicação para "Tema Escuro", alterando as variáveis CSS de cores (planos de fundo escuros, textos em cores claras).
4. O sistema grava o tema ativo como preferência do usuário no localStorage.
5. A interface re-renderiza com cores escuras de alto contraste.

**Fluxos alternativos:**
- *Sincronizar com o SO:* O usuário escolhe a opção "Tema: Automático", fazendo o sistema obter o esquema de cores ativo do sistema operacional e aplicar.

**Fluxos de exceção:**
- *Atraso na renderização:* O sistema usa transições CSS suaves para suavizar a troca de cores das bordas e planos de fundo em menos de 150ms.

**Pós-condições:** A interface da aplicação passa a exibir o tema de cores escolhido pelo usuário.

**Critérios de aceite:**
- [ ] O tema escuro deve reduzir o brilho geral da tela sem comprometer o contraste de leitura dos caracteres (atender WCAG AA).
- [ ] O estado selecionado (claro/escuro) deve persistir entre logins e recarregamentos de página.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
