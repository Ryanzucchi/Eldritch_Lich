### Caso de Uso: Visualizar galeria de imagens do projeto

**ID:** UC-270  
**Requisito relacionado:** RF-270 (visualizar galeria de imagens do projeto)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Existem arquivos de imagem (capas, brasões, retratos de personagens, mapas) cadastrados no projeto.  
**Gatilho:** O usuário clica na seção "Mídia" ou "Galeria" no menu lateral do projeto.  

**Fluxo principal:**
1. O usuário clica na aba "Galeria de Mídias" do projeto.
2. O sistema varre a tabela de imagens e arquivos de mídia associados a todas as fichas de entidades e mapas do projeto.
3. A interface renderiza uma grade contendo as miniaturas das imagens em ordem de data de envio.
4. O usuário interage aplicando filtros rápidos (ex: "Exibir apenas fotos de personagens" ou "Exibir apenas mapas").
5. O usuário clica em uma miniatura de foto.
6. O sistema abre a imagem em modo lightbox em alta resolução na tela, permitindo ver os metadados do arquivo e em qual ficha técnica de entidade ela está ativa.

**Fluxos alternativos:**
- *Pesquisa na Galeria:* O usuário digita o nome de uma entidade na busca da galeria. O sistema exibe apenas as imagens associadas à ficha técnica correspondente.

**Fluxos de exceção:**
- *Mídias órfãs:* Imagens carregadas na pasta de uploads que não estão vinculadas a nenhuma ficha são listadas sob a aba "Mídias Não Utilizadas", permitindo ao usuário excluí-las para liberar cota de espaço da conta.

**Pós-condições:** O painel de fotos e metadados da galeria do projeto é exibido na tela.

**Critérios de aceite:**
- [ ] O grid de galeria deve suportar paginação ou rolagem infinita (lazy loading) para otimizar desempenho de carregamento.
- [ ] A abertura da imagem no lightbox deve ocorrer em menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
