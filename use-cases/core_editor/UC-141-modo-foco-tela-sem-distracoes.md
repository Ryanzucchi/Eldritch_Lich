### Caso de Uso: Modo foco / tela sem distrações

**ID:** UC-141  
**Requisito relacionado:** RF-141 (modo foco / tela sem distrações)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O editor de texto está aberto.  
**Gatilho:** O usuário clica no botão "Modo Foco" na barra de status ou pressiona o atalho F11 (ou Ctrl+Shift+F).  

**Fluxo principal:**
1. O usuário ativa o Modo Foco.
2. O sistema esconde instantaneamente todos os elementos periféricos da interface: barra de arquivos lateral, painel de metadados, cabeçalhos de navegação e rodapés.
3. O editor de texto se expande para ocupar 100% da tela, centralizando o bloco de texto.
4. O sistema entra em modo de tela cheia do navegador (Fullscreen API).
5. O usuário digita em um ambiente visual limpo.

**Fluxos alternativos:**
- *Foco em Linha:* O usuário ativa a opção correspondente. O sistema esmaece em 80% todos os parágrafos do documento, exceto o parágrafo em que o cursor está ativo no momento.

**Fluxos de exceção:**
- *Fullscreen bloqueado:* Se a política do navegador impedir a tela cheia automática, o sistema oculta os painéis internos mantendo a página no tamanho normal da janela atual, exibindo uma instrução de suporte.

**Pós-condições:** A interface fica simplificada e livre de menus distrativos.

**Critérios de aceite:**
- [ ] Ao pressionar 'Esc' ou clicar no ícone de fechar flutuante, a interface deve restaurar todos os painéis e sair do modo tela cheia.
- [ ] A ocultação de painéis no Modo Foco não deve redefinir o estado de arquivos abertos ou a posição do cursor.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
