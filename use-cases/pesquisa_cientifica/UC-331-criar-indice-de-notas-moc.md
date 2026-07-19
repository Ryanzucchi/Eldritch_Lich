### Caso de Uso: Criar índice de notas (MOC - Map of Content)

**ID:** UC-331  
**Requisito relacionado:** RF-330 (criar índice de notas (MOC - Map of Content))  
**Ator(es):** Usuário (Escritor/Pesquisador), Sistema  
**Pré-condições:** Notas atômicas cadastradas e conectadas.  
**Gatilho:** O usuário clica em "Criar Mapa de Conteúdo (MOC)" no menu de notas.  

**Fluxo principal:**
1. O usuário acessa a pasta de Notas e seleciona "Novo Mapa de Conteúdo (MOC)".
2. O sistema cria um documento especial de índice de tópicos.
3. O usuário digita o título do índice (ex: "MOC: Física de Partículas").
4. O usuário adiciona hyperlinks diretos organizando as notas atômicas em formato de lista hierárquica e sequencial de leitura (ex: "1. Introdução: [[Nota A]]", "2. Detalhes: [[Nota B]]").
5. O usuário clica em "Salvar MOC".
6. O sistema grava o índice e indexa os hyperlinks internos na base de dados.

**Fluxos alternativos:**
- *MOC dinâmico automático:* O usuário adiciona uma tag de busca (ex: `#física`) na nota de MOC. O sistema gera dinamicamente uma listagem em tempo real de todas as notas do projeto contendo aquela tag correspondente.

**Fluxos de exceção:**
- *Links quebrados:* Se alguma nota atômica linkada no MOC for excluída, o sistema sinaliza visualmente a linha correspondente como link quebrado no MOC e sugere desvincular.

**Pós-condições:** O documento de MOC (índice estruturado de notas) é persistido na base de dados do projeto.

**Critérios de aceite:**
- [ ] A interface do MOC deve permitir arrastar e reposicionar a ordem das notas do índice com animação fluida.
- [ ] A gravação do MOC no banco de dados deve levar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
