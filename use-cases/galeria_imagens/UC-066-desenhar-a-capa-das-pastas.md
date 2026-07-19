### Caso de Uso: Desenhar a capa das pastas

**ID:** UC-066  
**Requisito relacionado:** RF-66 (desenhar a capa das pastas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui pastas no projeto e acessa as propriedades de uma pasta.  
**Gatilho:** O usuário seleciona "Editar Capa da Pasta" -> "Desenhar Capa".  

**Fluxo principal:**
1. O usuário abre o painel de edição visual da pasta.
2. O usuário clica na área da capa e seleciona a opção "Desenhar".
3. O sistema abre um canvas/editor de ilustrações simples (ferramentas de pintura, formas geométricas, texto e cores).
4. O usuário cria o desenho da capa e clica em "Salvar Capa".
5. O sistema rasteriza e otimiza a imagem em formato comprimido (.webp) e associa como imagem de capa (`capa_url`) da pasta.
6. A árvore lateral ou a visualização em grade exibe o desenho criado como capa da pasta.

**Fluxos alternativos:**
- *Desenhar sobre template:* O usuário escolhe um template de fundo fornecido pelo sistema e desenhar elementos adicionais por cima dele.

**Fluxos de exceção:**
- *Falha ao persistir a capa:* Se houver erro de upload no bucket de mídia, o sistema reverte para o estado da capa anterior e exibe um erro amigável.

**Pós-condições:** A capa da pasta é atualizada com o desenho rasterizado.

**Critérios de aceite:**
- [ ] A ferramenta de desenho deve oferecer pelo menos pincel, linhas, retângulos, círculos e balde de tinta.
- [ ] O arquivo final salvo no servidor deve ser comprimido de forma a não exceder 500KB.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta
