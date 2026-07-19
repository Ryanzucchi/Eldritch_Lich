### Caso de Uso: Criar modelos de estrutura de pastas

**ID:** UC-138  
**Requisito relacionado:** RF-138 (criar modelos de estrutura de pastas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário estruturou uma árvore de diretórios no projeto e deseja salvá-la como modelo.  
**Gatilho:** O usuário clica com o botão direito na pasta raiz e seleciona "Salvar Estrutura como Modelo".  

**Fluxo principal:**
1. O usuário clica em "Salvar Estrutura como Modelo".
2. O sistema abre um modal solicitando um título (ex: "Organização de Trilogia Fantástica").
3. O sistema varre recursivamente toda a árvore sob a pasta selecionada mapeando os nomes e a hierarquia.
4. O sistema grava a árvore estruturada em formato JSON na tabela de modelos de pastas.
5. Ao criar uma nova pasta em qualquer projeto, o usuário pode selecionar "Aplicar Modelo de Estrutura" para recriar a hierarquia.

**Fluxos alternativos:**
- *Aplicar na criação de projeto:* Ao criar um projeto novo, o usuário seleciona o modelo de pastas para inicializar o espaço de trabalho com a estrutura completa montada de imediato.

**Fluxos de exceção:**
- *Estrutura muito profunda:* O sistema valida se a estrutura a ser salva respeita a profundidade máxima permitida e avisa caso haja nós inválidos.

**Pós-condições:** O modelo de diretórios é salvo e disponibilizado para aplicação rápida.

**Critérios de aceite:**
- [ ] A recriação de uma árvore com até 20 pastas a partir de um modelo deve demorar menos de 1 segundo.
- [ ] O modelo deve salvar apenas os nomes e hierarquias das pastas, sem copiar os textos que residiam nelas.

**Prioridade:** Média  
**Complexidade estimada:** Média
