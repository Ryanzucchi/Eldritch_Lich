### Caso de Uso: Fixar textos

**ID:** UC-128  
**Requisito relacionado:** RF-128 (fixar textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O texto existe no projeto.  
**Gatilho:** O usuário clica em "Fixar Texto" no menu de contexto do arquivo na árvore lateral.  

**Fluxo principal:**
1. O usuário abre o menu de contexto de um texto e seleciona "Fixar no Topo".
2. O sistema altera o status do atributo `fixado` para `true` no banco de dados.
3. O sistema move o item para o topo da listagem de arquivos da pasta atual, ignorando a ordenação padrão.
4. A interface exibe um ícone de pino ao lado do título do texto para indicar que está fixado.

**Fluxos alternativos:**
- *Desafixar:* O usuário clica em "Desafixar" e o sistema retorna o texto à sua posição de ordenação natural.

**Fluxos de exceção:**
- *Múltiplos itens fixados:* Se o usuário fixar vários textos na mesma pasta, o sistema ordena os fixados entre si por ordem alfabética.

**Pós-condições:** O texto é fixado no topo de seu respectivo nível hierárquico na árvore de arquivos.

**Critérios de aceite:**
- [ ] O ícone do pino deve ser renderizado de forma clara e visível.
- [ ] A fixação do texto na interface deve ser refletida de forma imediata.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
