### Caso de Uso: Criar ramificação do texto (branch) para testes

**ID:** UC-198  
**Requisito relacionado:** RF-198 (criar ramificação do texto (branch) para testes)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O arquivo de texto de origem está salvo no projeto.  
**Gatilho:** O usuário clica na opção "Criar Ramificação (Branch)" no menu do documento.  

**Fluxo principal:**
1. O usuário abre o capítulo de texto desejado.
2. O usuário clica com o botão direito sobre o arquivo na árvore lateral e seleciona "Criar Branch de Testes".
3. O sistema abre um modal solicitando um nome para o branch (ex: "Final Alternativo").
4. O usuário confirma.
5. O sistema clona logicamente o documento em uma tabela de branches, criando uma cópia isolada vinculada ao arquivo principal.
6. A árvore lateral passa a exibir uma ramificação aninhada abaixo do capítulo principal.
7. O usuário edita o branch livremente, sem afetar o texto principal.

**Fluxos alternativos:**
- *Múltiplos branches:* O usuário cria vários branches a partir do mesmo capítulo para testar diferentes rumos para a história.

**Fluxos de exceção:**
- *Ramificações aninhadas:* O sistema restringe o nível de branches para no máximo 1 nível de profundidade e desabilita a opção dentro de um branch ativo.

**Pós-condições:** O branch de texto isolado é criado na base de dados e disponibilizado para edição de testes.

**Critérios de aceite:**
- [ ] O branch de testes deve possuir status visual claramente diferenciado na árvore de diretórios (ex: ícone de bifurcação).
- [ ] O tempo de criação lógica do branch deve ser menor que 300ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
