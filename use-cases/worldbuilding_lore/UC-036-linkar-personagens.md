### Caso de Uso: Linkar personagens

**ID:** UC-036  
**Requisito relacionado:** RF-36 (linkar personagens)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens estão catalogados no diretório de entidades do projeto.  
**Gatilho:** O usuário abre a ficha de um personagem e clica em "Adicionar Relacionamento".  

**Fluxo principal:**
1. O usuário abre o perfil do "Personagem A".
2. O usuário clica no botão "Adicionar Relação com Personagem".
3. O sistema exibe um seletor modal com a lista de outros personagens cadastrados no projeto.
4. O usuário seleciona o "Personagem B" e escolhe o tipo de conexão (ex: "Aliado", "Mentor").
5. O usuário escreve uma breve descrição da relação (opcional).
6. O sistema cria a conexão no banco de dados de entidades.
7. A interface atualiza a árvore de relações exibindo o vínculo estabelecido.

**Fluxos alternativos:**
- *Link automático por texto:* O sistema detecta que o "Personagem A" e o "Personagem B" aparecem juntos frequentemente na mesma frase e sugere a criação de um link entre eles no painel lateral de sugestões.

**Fluxos de exceção:**
- *Relações circulares redundantes:* Se o usuário tentar criar uma relação idêntica à que já existe, o sistema exibe "Esta relação já está registrada" e cancela o salvamento.

**Pós-condições:** O vínculo entre os personagens é salvo na base de dados de relacionamentos do grafo do projeto.

**Critérios de aceite:**
- [ ] O sistema deve suportar tipos de relacionamentos simétricos e assimétricos.
- [ ] A conexão criada deve ser representada visualmente na tela de visualização em grafo.

**Prioridade:** Alta  
**Complexidade estimada:** Média
