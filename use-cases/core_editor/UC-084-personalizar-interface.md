### Caso de Uso: Personalizar interface

**ID:** UC-084  
**Requisito relacionado:** RF-84 (personalizar interface)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O usuário está na tela de configurações de preferência.  
**Gatilho:** O usuário clica em "Personalizar Interface" ou "Layout".  

**Fluxo principal:**
1. O usuário abre o painel de configurações do usuário e seleciona a seção "Interface".
2. O sistema apresenta opções para alterar: Densidade do layout, Visibilidade da barra lateral, Tamanho dos painéis e Posição do menu de navegação.
3. O usuário altera a densidade para "Compacto" e ativa "Recolher barra lateral por padrão".
4. O sistema aplica os estilos CSS de layout e salva os dados na tabela de preferências de usuário.

**Fluxos alternativos:**
- *Restaurar padrões:* O usuário clica em "Restaurar layout padrão", fazendo o sistema resetar todos os estilos de interface salvos.

**Fluxos de exceção:**
- *Falha ao salvar preferências na nuvem:* O sistema salva localmente no localStorage para garantir que a interface continue personalizada na máquina atual até reconectar.

**Pós-condições:** O layout visual da aplicação se ajusta às preferências do usuário.

**Critérios de aceite:**
- [ ] O layout compacto deve reduzir margens e paddings em pelo menos 30% em relação ao layout confortável.
- [ ] As mudanças de layout devem ser aplicadas instantaneamente sem necessidade de recarregar a página.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
