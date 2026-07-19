### Caso de Uso: Mapear arco de desenvolvimento de personagem

**ID:** UC-149  
**Requisito relacionado:** RF-149 (mapear arco de desenvolvimento de personagem)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** Personagens e cenas estão vinculados no banco de dados.  
**Gatilho:** O usuário abre o painel do personagem e seleciona "Visualizar Arco de Desenvolvimento".  

**Fluxo principal:**
1. O usuário abre o perfil de um personagem e clica em "Arco do Personagem".
2. O sistema identifica todos os capítulos onde o personagem é citado e lê as valências de conflito registradas.
3. A IA compõe o mapeamento da jornada do personagem (ex: mapeia alteração de traços de personalidade).
4. O sistema exibe um gráfico de linha do tempo de desenvolvimento, exibindo marcos de mudança de atributos, perdas/ganhos de itens ou relacionamentos.
5. O usuário clica em um ponto do gráfico para abrir a descrição da cena responsável pela mudança.

**Fluxos alternativos:**
- *Edição manual:* O usuário desenha os pontos de inflexão do personagem manualmente no gráfico de arco para servir de roteiro de planejamento.

**Fluxos de exceção:**
- *Personagem não citado:* Se o personagem foi cadastrado mas não aparece nos textos, o sistema exibe "Nenhuma atividade de escrita registrada para este personagem".

**Pós-condições:** O arco de desenvolvimento e transformação do personagem ao longo do enredo é exibido de forma visual.

**Critérios de aceite:**
- [ ] O gráfico deve apresentar a jornada clássica do personagem correlacionada com a linha do tempo geral do projeto.
- [ ] O tempo de cálculo e renderização do arco de desenvolvimento deve ser de no máximo 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
