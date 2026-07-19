### Caso de Uso: Visualizar sumário interativo do texto (tabela de conteúdos)

**ID:** UC-246  
**Requisito relacionado:** RF-246 (visualizar sumário interativo do texto)  
**Ator(es):** Usuário (Escritor/Leitor), Sistema  
**Pré-condições:** O texto do documento possui subtítulos estruturados com formatações de títulos (H1, H2, H3) no editor.  
**Gatilho:** O usuário clica no botão "Sumário / Outline" no editor ou painel lateral.  

**Fluxo principal:**
1. O usuário abre o painel lateral do sumário interativo do documento.
2. O sistema varre o corpo do texto ativo localizando tags de cabeçalho.
3. O sistema monta uma lista hierárquica e recuada baseada no nível dos títulos.
4. O usuário clica sobre o item correspondente ao subtítulo desejado no sumário.
5. O sistema faz a rolagem vertical do editor de texto principal, posicionando o subtítulo selecionado no topo da visualização.

**Fluxos alternativos:**
- *Sumário do projeto:* O usuário abre a aba "Sumário do Livro" na barra lateral e visualiza toda a sequência de títulos de capítulos e seções organizadas de forma consolidada.

**Fluxos de exceção:**
- *Texto sem cabeçalhos:* Se o documento for corrido e não contiver nenhum título, o painel do sumário exibe "Sumário vazio. Adicione cabeçalhos ao texto".

**Pós-condições:** A lista estruturada de títulos do documento é exibida com rolagem rápida funcional.

**Critérios de aceite:**
- [ ] A seleção do item do sumário deve mover o cursor do editor de texto diretamente para o início do cabeçalho correspondente.
- [ ] A varredura de cabeçalhos e montagem do sumário de um arquivo de 10.000 palavras devem durar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
