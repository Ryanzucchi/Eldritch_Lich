### Caso de Uso: Permitir customização visual avançada (ícones, cores, fontes) sem impacto em outras funcionalidades (RNF)

**ID:** UC-448  
**Requisito relacionado:** RNF-Low-1 (customização visual avançada sem impactos)  
**Ator(es):** Usuário, Sistema  
**Pré-condições:** Módulo de customização visual e painel de temas avançados ativado.  
**Gatilho:** O usuário altera cores de pastas e ícones na interface de worldbuilding.  

**Fluxo principal:**
1. O usuário abre o diretório de pastas do seu projeto e seleciona as propriedades visuais de uma pasta específica.
2. O sistema abre a modal de personalização rápida contendo seletores de cores e ícones.
3. O usuário seleciona a cor e o ícone desejados e clica em salvar.
4. O sistema grava as preferências de personalização visual na tabela de configurações e aplica o estilo CSS correspondente na tela do usuário.
5. O usuário visualiza a pasta atualizada com as novas cores e ícones na tela sem que as demais abas do caderno sofram alterações de comportamento.

**Fluxos alternativos:**
- *Customização de fontes:* O usuário seleciona uma fonte de escrita para o editor (ex: Outfit) nas configurações, e o sistema carrega o arquivo de tipografia assincronamente sem travar a tela de digitação.

**Fluxos de exceção:**
- *Erro no arquivo de fonte:* Se o arquivo de fonte importado estiver quebrado, o sistema desativa a fonte de forma automática e restaura a tipografia padrão para manter a legibilidade.

**Pós-condições:** As customizações visuais de ícones, fontes e cores são salvas e aplicadas na interface do usuário.

**Critérios de aceite:**
- [ ] As customizações visuais do usuário não devem interferir na velocidade de renderização da árvore de pastas (deve carregar em menos de 100ms).
- [ ] A aplicação deve suportar o reset das configurações visuais de volta ao tema padrão com um clique.

**Prioridade:** Baixa  
**Complexidade estimada:** Média
