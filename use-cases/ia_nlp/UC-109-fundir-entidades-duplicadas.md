### Caso de Uso: Fundir entidades duplicadas

**ID:** UC-109  
**Requisito relacionado:** RF-109 (fundir entidades duplicadas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem duas entidades cadastradas separadamente que representam o mesmo personagem ou objeto (ex: "Artie" e "Arthur").  
**Gatilho:** O usuário seleciona duas entidades e clica em "Fundir Entidades" ou aceita uma sugestão automática de fusão da IA.  

**Fluxo principal:**
1. O usuário seleciona a entidade "Artie" e a entidade "Arthur" na lista do diretório.
2. O usuário clica em "Fundir".
3. O sistema abre uma tela de conciliação exibindo as fichas de ambos os registros em paralelo.
4. O usuário seleciona qual nome será o principal ("Arthur") e resolve conflitos de atributos.
5. O usuário clica em "Confirmar Fusão".
6. O sistema atualiza o banco de dados: transfere todos os relacionamentos, arestas de grafos, localizações de mapa e referências de texto de "Artie" para "Arthur".
7. O registro de "Artie" é deletado permanentemente do banco de dados.

**Fluxos alternativos:**
- *Mesclagem de tags:* O sistema adiciona "Artie" como apelido/sinônimo oficial na ficha de "Arthur" para manter a rastreabilidade.

**Fluxos de exceção:**
- *Fusão de tipos diferentes:* Se o usuário tentar fundir um personagem com um local, o sistema impede a ação e exibe "Não é possível fundir entidades de categorias distintas".

**Pós-condições:** As duas entidades duplicadas são consolidadas em um único registro no banco de dados e no grafo.

**Critérios de aceite:**
- [ ] A fusão de registros deve atualizar todas as tabelas de referência e chaves estrangeiras no banco de dados de forma transacional.
- [ ] Os hyperlinks existentes nos textos que direcionavam para a entidade antiga devem ser reescritos dinamicamente.

**Prioridade:** Alta  
**Complexidade estimada:** Média
