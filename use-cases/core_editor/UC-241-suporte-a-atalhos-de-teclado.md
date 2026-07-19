### Caso de Uso: Suporte a atalhos de teclado para leitores de tela

**ID:** UC-241  
**Requisito relacionado:** RF-241 (suporte a atalhos de teclado para leitores de tela)  
**Ator(es):** Usuário (Escritor com deficiência visual), Sistema  
**Pré-condições:** O leitor de tela está ativo e o usuário está com o aplicativo aberto.  
**Gatilho:** O usuário aciona atalhos de navegação de acessibilidade.  

**Fluxo principal:**
1. O usuário pressiona a combinação de teclas de acessibilidade (ex: `Alt+Ctrl+S` para ir ao sumário ou `Alt+Ctrl+E` para focar na escrita do editor).
2. O sistema intercepta o evento e move o foco de foco do HTML para a seção de destino correspondente.
3. O sistema atualiza os atributos ARIA na região focada para forçar o leitor de tela a anunciar a nova seção e as instruções locais.

**Fluxos alternativos:**
- *Listar atalhos por voz:* O usuário aciona o atalho `Alt+Ctrl+H` e o sistema abre um popup contendo o guia de atalhos e ativa leituras sequenciais automáticas.

**Fluxos de exceção:**
- *Colisão de atalho:* Se a combinação configurada colidir com atalhos nativos críticos do leitor de tela do usuário, o sistema permite o uso de teclas modificadoras secundárias.

**Pós-condições:** O foco de navegação da interface é movido e anunciado pelo leitor de tela.

**Critérios de aceite:**
- [ ] O sistema de foco de teclado deve seguir as regras de conformidade ARIA.
- [ ] A alteração do foco de teclado deve durar menos de 50ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
