### Caso de Uso: Colocar imagens e texto como capa de pastas e texto

**ID:** UC-069  
**Requisito relacionado:** RF-69 (colocar imagens e texto como capa de pastas e texto)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Pastas ou textos criados no projeto.  
**Gatilho:** O usuário acessa a opção de personalização visual avançada da capa da pasta ou texto.  

**Fluxo principal:**
1. O usuário abre o editor de capa avançado para um arquivo ou pasta.
2. O sistema apresenta opções para: Fazer upload de uma imagem de fundo, escolher a cor de overlay, digitar um texto de título customizado e selecionar a tipografia.
3. O usuário insere a imagem de fundo, digita o texto sobreposto e formata a tipografia.
4. O sistema compõe e renderiza a visualização em tempo real.
5. O usuário confirma o salvamento.
6. O sistema processa a composição em um único arquivo de imagem comprimido (ou salva os dados de estilo para renderização dinâmica) e o define como a capa definitiva.

**Fluxos alternativos:**
- *Posicionamento de texto:* O usuário arrasta o bloco de texto sobre a imagem de capa para escolher a melhor posição (esquerda, centro, direita, etc.).

**Fluxos de exceção:**
- *Imagem falha ao carregar:* O sistema utiliza uma cor sólida de fundo padrão e exibe apenas o texto formatado para não quebrar a exibição do card.

**Pós-condições:** A capa customizada com imagem e texto sobreposto é gerada e associada ao item correspondente.

**Critérios de aceite:**
- [ ] A sobreposição de texto deve garantir legibilidade automática aplicando sombras ou filtros de escurecimento (backdrop overlay) na imagem de fundo.
- [ ] A composição gerada deve ser consistente em todas as telas de visualização.

**Prioridade:** Baixa  
**Complexidade estimada:** Média
