### Caso de Uso: Organizar texto em subpastas

**ID:** UC-011  
**Requisito relacionado:** RF-11 (organizar texto em subpastas)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O usuário possui pastas criadas no projeto.  
**Gatilho:** O usuário clica em "Nova Pasta" estando com uma pasta selecionada ou arrasta uma pasta para dentro de outra na árvore lateral.  

**Fluxo principal:**
1. O usuário clica com o botão direito sobre uma pasta existente ("Pasta Pai") no painel lateral de navegação.
2. O usuário seleciona a opção "Criar Subpasta".
3. O sistema abre uma caixa de entrada para digitar o nome da subpasta.
4. O usuário digita o nome e pressiona Enter.
5. O sistema cria o registro da pasta com `id_pasta_pai` referenciando a "Pasta Pai" no banco de dados.
6. A interface atualiza o painel exibindo a subpasta recuada abaixo da pasta pai.

**Fluxos alternativos:**
- *Mover pasta existente:* O usuário arrasta uma pasta existente para dentro de outra pasta, transformando-a em subpasta.

**Fluxos de exceção:**
- *Profundidade máxima de pastas:* O sistema limita a hierarquia a no máximo 10 níveis de profundidade. Se o usuário tentar criar além disso, o sistema impede e exibe: "Limite de subpastas atingido (máximo 10 níveis)".

**Pós-condições:** A subpasta é criada sob a pasta pai, mantendo a relação de parentesco estruturada na base de dados.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a nova pasta apontando para o ID da pasta pai.
- [ ] A árvore lateral de arquivos deve permitir expandir e colapsar a subpasta mantendo seu estado (aberto/fechado) em cache.
- [ ] Mover um texto para a subpasta deve seguir a mesma lógica de hierarquia.

**Prioridade:** Alta  
**Complexidade estimada:** Média
