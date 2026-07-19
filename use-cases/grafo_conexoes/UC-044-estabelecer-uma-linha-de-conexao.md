### Caso de Uso: Estabelecer uma linha de conexão entre duas entidades

**ID:** UC-044  
**Requisito relacionado:** RF-44 (estabelecer uma linha de conexão entre duas entidades)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** As entidades (personagens, locais, objetos, organizações) existem e estão catalogadas.  
**Gatilho:** O usuário desenha ou especifica um link entre entidades no painel de relações.  

**Fluxo principal:**
1. O usuário acessa a ferramenta "Grafo de Entidades".
2. O usuário clica no botão "Criar Vínculo".
3. O usuário clica na Entidade A (ex: Personagem "Arthur") e arrasta uma linha até a Entidade B (ex: Organização "Ordem dos Cavaleiros").
4. O sistema abre um pequeno formulário sobre a linha pedindo para especificar a relação (ex: "Membro de") e sua intensidade (peso).
5. O usuário preenche os campos e confirma.
6. O sistema atualiza o grafo, exibindo a linha de conexão rotulada e colorida.

**Fluxos alternativos:**
- *Criar relação a partir da ficha técnica:* O usuário adiciona a relação escrevendo os detalhes no formulário da ficha da entidade, e a linha é gerada automaticamente no grafo.

**Fluxos de exceção:**
- *Entidade destino excluída concorrentemente:* Se a Entidade B for deletada por outro usuário antes de concluir a criação do link, o sistema exibe "Erro: A entidade de destino não está mais disponível" e cancela o desenho da linha.

**Pós-condições:** O relacionamento estruturado entre as entidades é gravado e representado visualmente.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar as chaves estrangeiras de ambas as entidades na tabela de arestas do grafo.
- [ ] A linha desenhada no canvas do grafo deve possuir setas direcionais e rótulos legíveis.

**Prioridade:** Alta  
**Complexidade estimada:** Média
