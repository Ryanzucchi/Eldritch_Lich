### Caso de Uso: Filtrar personagens por facção/organização

**ID:** UC-177  
**Requisito relacionado:** RF-177 (filtrar personagens por facção/organização)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens com filiações a facções/organizações configuradas.  
**Gatilho:** O usuário filtra a listagem de diretório ou o grafo por facção.  

**Fluxo principal:**
1. O usuário acessa o diretório geral de personagens.
2. O usuário clica no seletor de filtros e abre o dropdown de facções.
3. O usuário seleciona a facção desejada (ex: "Ordem dos Magos").
4. O sistema processa e oculta temporariamente todos os personagens que não pertençam à facção da listagem lateral.
5. O usuário visualiza apenas o elenco de magos e seus cargos.

**Fluxos alternativos:**
- *Filtrar no Grafo:* O usuário acessa o Grafo de Entidades e clica no filtro visual por facção. O canvas esmaece personagens de facções neutras ou inimigas, mantendo a rede da facção selecionada em destaque na tela.

**Fluxos de exceção:**
- *Facção vazia:* Se a organização selecionada estiver sem membros cadastrados, o sistema exibe: "Nenhum personagem de filiação ativa".

**Pós-condições:** A interface renderiza apenas os personagens pertencentes à facção selecionada no filtro.

**Critérios de aceite:**
- [ ] O tempo de processamento e atualização da lista filtrada deve ser menor que 100ms.
- [ ] A interface deve disponibilizar atalho rápido para limpar o filtro de facção com um clique.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
