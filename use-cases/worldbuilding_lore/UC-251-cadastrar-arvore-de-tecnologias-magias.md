### Caso de Uso: Cadastrar árvore de tecnologias/magias (sistema)

**ID:** UC-251  
**Requisito relacionado:** RF-251 (cadastrar árvore de tecnologias/magias (sistema))  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na seção de worldbuilding (regras do universo) do projeto.  
**Gatilho:** O usuário clica em "Nova Árvore de Habilidades/Tecnologias" ou "Novo Sistema de Magia".  

**Fluxo principal:**
1. O usuário clica em "Criar Árvore de Conhecimento".
2. O sistema abre um formulário solicitando: Nome da Árvore e descrição das regras físicas ou mágicas básicas.
3. O usuário salva as informações.
4. O sistema abre um canvas de fluxograma onde o usuário adiciona nós de tecnologias ou magias específicas.
5. O usuário desenha setas direcionadas ligando os nós para representar pré-requisitos de aprendizagem.
6. O sistema grava a estrutura lógica e as dependências direcionadas no banco de dados.

**Fluxos alternativos:**
- *Formato de Tabela:* O usuário prefere preencher uma tabela de itens cadastrando os pré-requisitos via seletores dropdown, dispensando o canvas visual.

**Fluxos de exceção:**
- *Ciclos de dependência:* Se o usuário tentar desenhar uma conexão que crie uma dependência cíclica contraditória, o sistema impede o vínculo e emite um alerta explicando o paradoxo.

**Pós-condições:** A árvore lógica de habilidades ou tecnologias do universo é cadastrada no banco de dados.

**Critérios de aceite:**
- [ ] O canvas de árvore deve permitir adicionar e editar campos de descrição detalhada e custos para cada nó.
- [ ] A gravação e consistência dos nós do grafo no banco devem durar menos de 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Alta
