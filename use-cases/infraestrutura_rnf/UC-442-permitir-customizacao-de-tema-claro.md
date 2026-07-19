### Caso de Uso: Permitir customização de tema (claro/escuro) sem impacto de performance (RNF)

**ID:** UC-442  
**Requisito relacionado:** RNF-Medium-6 (customização de tema claro/escuro)  
**Ator(es):** Usuário, Sistema  
**Pré-condições:** Variáveis nativas CSS de controle de tema configuradas na raiz do documento.  
**Gatilho:** O usuário clica no seletor de tema (switch claro/escuro) no cabeçalho.  

**Fluxo principal:**
1. O usuário clica em "Alternar para Tema Escuro".
2. O sistema altera o atributo ou classe da tag principal do documento HTML (ex: `data-theme="dark"`).
3. O navegador lê a alteração e atualiza as cores mapeadas pelas variáveis de cor CSS na tela.
4. O sistema grava a preferência de tema do usuário no armazenamento local (LocalStorage).
5. A interface transiciona as cores de forma suave utilizando propriedades CSS nativas.

**Fluxos alternativos:**
- *Detecção automática:* O usuário opta por sincronizar o tema com o sistema operacional, e a plataforma altera o tema de acordo com o esquema de cores ativo do dispositivo (`prefers-color-scheme`).

**Fluxos de exceção:**
- *Flashes de cor no carregamento:* O sistema executa um script inline de leitura do LocalStorage no cabeçalho antes de renderizar o corpo da página, evitando flashes visuais brancos ao carregar em modo escuro.

**Pós-condições:** O tema da aplicação é alternado e salvo de forma imediata na tela do usuário.

**Critérios de aceite:**
- [ ] A alteração de tema não deve forçar re-renderizações (re-renders) pesadas de componentes React/JS, ocorrendo de forma puramente visual na camada do navegador.
- [ ] O tempo total de transição visual de cores ao clicar no switch de tema deve ser inferior a 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
