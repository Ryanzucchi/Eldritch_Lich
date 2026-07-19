### Caso de Uso: Ter visualização em grafo

**ID:** UC-057  
**Requisito relacionado:** RF-57 (ter visualização em grafo)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui documentos, tags, pastas e entidades cadastradas e interconectadas.  
**Gatilho:** O usuário clica na aba "Visualizar Grafo" no menu do projeto.  

**Fluxo principal:**
1. O usuário clica em "Visualizar Grafo" no painel principal.
2. O sistema lê todos os nós do projeto (pastas, arquivos, entidades) e suas arestas (relações, links, tags comuns).
3. O sistema renderiza o Grafo Geral do Universo no canvas, onde cada tipo de nó possui uma cor e ícone diferente.
4. O usuário interage com o grafo, aplicando zoom, arrastando nós e filtrando elementos.

**Fluxos alternativos:**
- *Navegar pelo Grafo:* O usuário dá um duplo clique em um nó do grafo e o sistema abre o arquivo correspondente para edição imediata.

**Fluxos de exceção:**
- *Falha de renderização do Canvas:* Se o navegador não suportar WebGL ou Canvas 2D acelerado por hardware, o sistema reverte para uma árvore hierárquica textual convencional e exibe um aviso.

**Pós-condições:** O grafo global do projeto é exibido de forma interativa e navegável na interface do usuário.

**Critérios de aceite:**
- [ ] A renderização e simulação física do grafo devem rodar a pelo menos 30 FPS no navegador em projetos de até 300 nós.
- [ ] O grafo deve possuir uma barra de busca rápida para localizar e focar em nós específicos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
