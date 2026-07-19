### Caso de Uso: Filtrar eventos por local

**ID:** UC-170  
**Requisito relacionado:** RF-170 (filtrar eventos por local)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Eventos da timeline possuem locais associados.  
**Gatilho:** O usuário interage com o filtro de local no painel de timeline.  

**Fluxo principal:**
1. O usuário visualiza o painel de timeline do projeto.
2. O usuário abre o filtro "Locais" no cabeçalho e seleciona um local (ex: "Eldoria").
3. O sistema varre os eventos e oculta todos aqueles que não ocorreram em "Eldoria".
4. A timeline passa a exibir apenas a cronologia de acontecimentos restrita àquela localidade.
5. O usuário visualiza de forma linear a história exclusiva daquele local.

**Fluxos alternativos:**
- *Filtro direto a partir da ficha:* O usuário abre a ficha técnica do local e clica em "Ver Timeline do Local", abrindo o painel de timelines com o filtro pré-aplicado.

**Fluxos de exceção:**
- *Sem locais correspondentes:* Se não existirem eventos na localidade selecionada, exibe "Nenhum evento registrado nesta localidade".

**Pós-condições:** O painel de timeline exibe apenas os eventos cronológicos ambientados no local selecionado.

**Critérios de aceite:**
- [ ] O filtro de local deve funcionar de forma combinada com outros filtros ativos (ex: filtrar por local e por personagem).
- [ ] A transição e recálculo dos cards da timeline devem demorar menos de 100ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
