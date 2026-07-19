### Caso de Uso: Procurar personagens

**ID:** UC-025  
**Requisito relacionado:** RF-25 (procurar personagens)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens estão catalogados no projeto (manualmente ou via NER).  
**Gatilho:** O usuário abre a busca rápida de entidades e digita o nome de um personagem.  

**Fluxo principal:**
1. O usuário abre o painel de personagens do projeto.
2. O usuário digita o nome do personagem (ex: "Arthur") na barra de filtro rápido de entidades.
3. O sistema filtra instantaneamente os perfis de personagem cadastrados e exibe as menções a ele nos textos do projeto.
4. O usuário clica no resultado "Menções no Texto" e vê a lista de capítulos e frases onde o nome ou apelidos configurados aparecem.
5. Ao clicar em uma menção, o sistema abre o editor e foca na linha exata.

**Fluxos alternativos:**
- *Busca por apelido:* Se o personagem "Arthur" tiver cadastrado em sua ficha o apelido "Artie", a busca por "Artie" também retornará o personagem Arthur e suas respectivas menções.

**Fluxos de exceção:**
- *Personagem não catalogado:* Se o personagem não estiver na lista de entidades, o sistema oferece um link rápido: "Personagem não encontrado. Deseja cadastrar '[Nome]' como novo personagem?".

**Pós-condições:** O usuário localiza o perfil do personagem e todas as suas aparições nos textos.

**Critérios de aceite:**
- [ ] A indexação de menções deve mapear variações de nomes cadastradas na ficha de entidade do personagem.
- [ ] A busca e listagem das aparições de um personagem no projeto devem carregar em até 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
