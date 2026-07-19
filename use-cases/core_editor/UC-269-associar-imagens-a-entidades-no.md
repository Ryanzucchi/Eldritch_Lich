### Caso de Uso: Associar imagens a entidades no mapa (fotos/capas)

**ID:** UC-269  
**Requisito relacionado:** RF-269 (associar imagens a entidades no mapa)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Fichas de entidades com imagens cadastradas e pins associados no mapa.  
**Gatilho:** O usuário passa o cursor ou clica em um marcador de entidade no mapa geográfico.  

**Fluxo principal:**
1. O usuário abre o mapa geográfico e localiza o pino da entidade correspondente (ex: "Winterfell").
2. O usuário passa o cursor sobre o pino de Winterfell.
3. O sistema abre o popover de resumo.
4. O sistema busca no banco e carrega a imagem de capa cadastrada na ficha de Winterfell.
5. O popover renderiza a miniatura da imagem no topo, acompanhada do título e resumo da ficha técnica.
6. O usuário visualiza a imagem ilustrada na popover do mapa.

**Fluxos alternativos:**
- *Mudar foto a partir do mapa:* O usuário clica em "Editar Imagem" diretamente no popover flutuante do mapa, realiza o upload de nova foto e o sistema atualiza a ficha da entidade de imediato.

**Fluxos de exceção:**
- *Entidade sem imagem cadastrada:* Se a ficha não contiver imagem, o popover exibe o pino e o texto de resumo de forma compacta, omitindo o container de imagem.

**Pós-condições:** A imagem associada à entidade é exibida de forma contextualizada no popover do marcador no mapa.

**Critérios de aceite:**
- [ ] A miniatura da imagem exibida no popover deve ter proporção otimizada para caber no container do popup sem distorção.
- [ ] O tempo de carregamento da imagem de visualização no popup deve ser menor que 200ms após o clique no pino.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
