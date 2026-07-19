### Caso de Uso: Definir jornada do herói (etapas)

**ID:** UC-396  
**Requisito relacionado:** RF-395 (definir jornada do herói)  
**Ator(es):** Usuário (Escritor/Roteirista), Sistema  
**Pré-condições:** Personagem principal e cenas cadastrados.  
**Gatilho:** O usuário clica em "Mapear Jornada do Herói" na ficha do protagonista.  

**Fluxo principal:**
1. O usuário acessa "Arquitetura da História" -> "Jornada do Personagem".
2. O usuário seleciona o protagonista e escolhe o modelo "Jornada do Herói (12 etapas)".
3. O sistema cria a linha visual de desenvolvimento listando as etapas (Mundo Comum, Chamado à Aventura, Recusa do Chamado, etc.).
4. O usuário clica em cada etapa correspondente e associa a respectiva cena do livro.
5. O usuário digita uma nota explicativa sobre a transformação psicológica do protagonista naquela etapa e confirma.
6. O sistema grava a jornada e os relacionamentos correspondentes no banco de dados.

**Fluxos alternativos:**
- *Modelos alternativos:* O usuário opta pelo modelo simplificado de 8 etapas (Story Circle de Dan Harmon), adaptando o painel de preenchimento para os novos campos estruturais.

**Fluxos de exceção:**
- *Personagem excluído:* Se o protagonista associado à jornada for deletado, o sistema desassocia os dados da jornada correspondente, emitindo um aviso explicativo na tela de arquitetura.

**Pós-condições:** O mapa estruturado contendo a jornada do protagonista é salvo no banco de dados do projeto.

**Critérios de aceite:**
- [ ] A tela de jornada do herói deve permitir visualizar graficamente o arco da jornada em formato circular clássico.
- [ ] A gravação no banco de dados deve levar menos de 250ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
