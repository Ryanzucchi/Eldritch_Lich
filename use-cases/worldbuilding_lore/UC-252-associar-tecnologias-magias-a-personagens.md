### Caso de Uso: Associar tecnologias/magias a personagens (habilidades)

**ID:** UC-252  
**Requisito relacionado:** RF-252 (associar tecnologias/magias a personagens)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens e nós de tecnologias/magias estão cadastrados no projeto.  
**Gatilho:** O usuário edita a ficha técnica de habilidades de um personagem.  

**Fluxo principal:**
1. O usuário abre o perfil do personagem.
2. O usuário clica na aba "Habilidades / Poderes".
3. O usuário clica em "Aprender Habilidade".
4. O sistema abre uma lista autocomplete exibindo os nós de magias e tecnologias cadastrados.
5. O usuário seleciona a habilidade correspondente, define o nível de proficiência e a data de aprendizado.
6. O usuário clica em "Salvar".
7. O sistema grava a filiação de habilidade no banco de dados.
8. A ficha do personagem passa a listar a habilidade sob sua respectiva árvore.

**Fluxos alternativos:**
- *Atribuição direta no Grafo:* O usuário abre a visualização da Árvore de Magia Geral, clica com o botão direito no nó do feitiço e seleciona "Atribuir a Personagem", preenchendo as informações.

**Fluxos de exceção:**
- *Nó deletado:* Se o nó do feitiço for apagado da árvore geral futuramente, a habilidade desaparece silenciosamente do perfil do personagem sem quebrar sua ficha.

**Pós-condições:** A habilidade do personagem é salva na base de dados do projeto.

**Critérios de aceite:**
- [ ] A ficha do personagem deve exibir o status de proficiência e a descrição detalhada da habilidade ao passar o mouse.
- [ ] O tempo total de salvamento deve ser menor que 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
