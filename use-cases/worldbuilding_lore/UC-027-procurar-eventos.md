### Caso de Uso: Procurar eventos

**ID:** UC-027  
**Requisito relacionado:** RF-27 (procurar eventos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos da linha do tempo/cronologia estão cadastrados no projeto.  
**Gatilho:** O usuário pesquisa por um evento na barra de busca cronológica ou global.  

**Fluxo principal:**
1. O usuário abre a linha do tempo ou o painel de busca de eventos.
2. O usuário digita palavras-chave associadas a um evento (ex: "Grande Batalha", "Coroação").
3. O sistema busca no título, descrição e data dos eventos cadastrados na timeline do projeto.
4. O sistema apresenta a lista de eventos correspondentes com suas datas cronológicas fictícias e os textos do projeto que estão vinculados a cada evento.
5. O usuário clica no evento e o sistema destaca a posição do evento na linha do tempo visual.

**Fluxos alternativos:**
- *Filtro por período:* O usuário pode buscar eventos definindo um intervalo de anos/datas (ex: do ano 1000 ao ano 1050).

**Fluxos de exceção:**
- *Nenhum evento no período:* O sistema informa que não há eventos cadastrados no intervalo selecionado e exibe uma linha do tempo vazia.

**Pós-condições:** O evento localizado é exibido no contexto da linha do tempo do projeto.

**Critérios de aceite:**
- [ ] O tempo de resposta para busca e renderização de eventos filtrados na linha do tempo deve ser menor que 500ms.
- [ ] Cada evento retornado na busca deve exibir sua data cronológica formatada e os links para os textos de cena relacionados.

**Prioridade:** Média  
**Complexidade estimada:** Média
