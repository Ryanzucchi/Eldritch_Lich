### Caso de Uso: Reconhecer entidades (personagens, locais, objetos, organizações)

**ID:** UC-018  
**Requisito relacionado:** RF-18 (reconhecer entidades (personagens, locais, objetos, organizações))  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto possui conteúdo e a análise inteligente de entidades está ativa nas configurações.  
**Gatilho:** O usuário clica em "Detectar Entidades" ou o sistema executa a análise em background após o salvamento automático.  

**Fluxo principal:**
1. O sistema envia o texto do documento para o pipeline de Reconhecimento de Entidades Nomeadas (NER) baseado em IA.
2. O pipeline NER analisa o texto e identifica termos que representam pessoas, locais, objetos físicos e organizações, associando scores de probabilidade.
3. O sistema destaca visualmente no texto as entidades identificadas (ex: Personagens em azul, Locais em verde, etc.) com marcações sutis.
4. O usuário clica sobre uma entidade destacada para visualizar sua ficha descritiva ou criar uma nova entrada na wiki do projeto.

**Fluxos alternativos:**
- *Cadastro manual:* Se uma entidade não for detectada pela IA, o usuário pode selecionar o texto manualmente e clicar em "Marcar como Entidade", escolhendo seu tipo.

**Fluxos de exceção:**
- *Falso positivo de entidade:* Se a IA classify erroneamente uma palavra comum como personagem, o usuário pode clicar sobre ela e selecionar "Remover marcação de entidade" ou "Ignorar esta entidade neste documento".

**Pós-condições:** As entidades nomeadas identificadas são salvas e associadas ao texto no banco de dados.

**Critérios de aceite:**
- [ ] O modelo NER deve ser otimizado para lidar com nomes fictícios/fantásticos usando contexto gramatical (ex: precedido de pronomes ou verbos de ação).
- [ ] A extração deve categorizar as entidades em pelo menos quatro tipos: Personagem, Local, Objeto e Organização.
- [ ] A renderização gráfica das tags de entidades sobre o texto do editor deve ser dinâmica e não prejudicar a performance de rolagem.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
