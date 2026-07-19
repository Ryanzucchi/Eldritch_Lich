### Caso de Uso: Filtrar árvore de tecnologias/magias por facção

**ID:** UC-256  
**Requisito relacionado:** RF-256 (filtrar árvore de tecnologias/magias por facção)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A visualização em grafo da árvore está aberta e existem facções associadas a tecnologias.  
**Gatilho:** O usuário seleciona o filtro de facção no painel da árvore de conhecimento.  

**Fluxo principal:**
1. O usuário visualiza o Grafo de Tecnologias correspondente.
2. O usuário abre o filtro "Facções" e seleciona a facção desejada (ex: "Império de Valoria").
3. O sistema analisa e esmaece todos os nós de conhecimento que a facção selecionada não detém.
4. O sistema destaca de forma vibrante os nós correspondentes ao arsenal tecnológico e científico dominado por ela.

**Fluxos alternativos:**
- *Destaque de monopólio:* O sistema destaca em cores exclusivas as tecnologias dominadas exclusivamente pela facção selecionada que nenhuma outra facção possui.

**Fluxos de exceção:**
- *Facção sem conhecimentos:* Se a facção selecionada não possuir tecnologias cadastradas, o grafo é esmaecido por completo.

**Pós-condições:** O grafo da árvore destaca o progresso de desenvolvimento tecnológico da facção selecionada.

**Critérios de aceite:**
- [ ] A alteração do realce no canvas deve rodar de forma instantânea.
- [ ] O filtro deve funcionar em conjunto com a comparação de facções rivais (visualizar o gap tecnológico).

**Prioridade:** Média  
**Complexidade estimada:** Média
