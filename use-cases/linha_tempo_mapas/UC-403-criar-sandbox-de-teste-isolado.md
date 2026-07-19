### Caso de Uso: Criar sandbox de teste isolado do universo canônico

**ID:** UC-403  
**Requisito relacionado:** RF-398 (criar sandbox de teste isolado do universo canônico)  
**Ator(es):** Usuário (Escritor/Game Designer), Sistema  
**Pré-condições:** Universo do projeto cadastrado com personagens, locais e regras.  
**Gatilho:** O usuário clica em "Criar Sandbox (E se?)" no painel do universo.  

**Fluxo principal:**
1. O usuário acessa o painel de Worldbuilding do projeto.
2. O usuário clica no botão "Criar Novo Sandbox de Teste".
3. O sistema solicita a digitação de um nome de controle (ex: "Sandbox: Protagonista Vilão").
4. O usuário insere o nome e confirma.
5. O sistema cria um clone completo de toda a estrutura relacional do universo canônico (personagens, locais, linhas temporais) para uma área isolada e protegida no banco de dados.
6. A interface passa a exibir o distintivo em destaque "Modo Sandbox (Não Canônico)" no cabeçalho da plataforma.

**Fluxos alternativos:**
- *Clone parcial:* O usuário seleciona clonar apenas um conjunto de personagens e um capítulo específico para testar interações rápidas.

**Fluxos de exceção:**
- *Limites de cota:* Se a conta do usuário atingiu o limite de ambientes de sandbox simultâneos permitidos, o sistema impede a ação e solicita a exclusão de ambientes antigos.

**Pós-condições:** O ambiente de sandbox isolado é inicializado e disponibilizado para edições experimentais.

**Critérios de aceite:**
- [ ] O clone lógico do universo no banco de dados deve ocorrer em até 1 segundo.
- [ ] O distintivo visual de modo Sandbox deve ser proeminente em todas as telas para evitar confusão de dados.

**Prioridade:** Alta  
**Complexidade estimada:** Média
