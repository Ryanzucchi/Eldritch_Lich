### Caso de Uso: Associar imagens a fichas de itens/objetos (ilustrações)

**ID:** UC-287  
**Requisito relacionado:** RF-287 (associar imagens a fichas de itens/objetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A ficha do item está cadastrada e o arquivo de imagem está disponível localmente ou na galeria.  
**Gatilho:** O usuário clica em "Adicionar Ilustração" na ficha do item.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um item.
2. No cabeçalho da ficha, o usuário clica sobre a área de imagem "Adicionar Ilustração".
3. O sistema abre o modal de seleção da Galeria de Mídias.
4. O usuário seleciona a ilustração correspondente e confirma.
5. O sistema processa a imagem em formato WebP, vinculando o ID do arquivo à ficha técnica do item.
6. A imagem é renderizada como retrato oficial no topo da ficha do item.

**Fluxos alternativos:**
- *Galeria de fotos do item:* O usuário insere múltiplas ilustrações secundárias na aba "Galeria de Fotos" do próprio item para retratar o objeto sob diferentes ângulos.

**Fluxos de exceção:**
- *Upload de arquivo inválido:* O sistema impede a importação de arquivos não suportados e solicita imagem em formato adequado.

**Pós-condições:** A imagem ilustrativa é vinculada e renderizada na ficha técnica do item.

**Critérios de aceite:**
- [ ] A imagem do retrato do item deve ser indexada automaticamente na Galeria de Mídias global do projeto.
- [ ] O tempo de processamento e atualização na tela deve ser de no máximo 1,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
