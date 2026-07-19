### Caso de Uso: Associar imagens a fichas de criaturas/monstros (ilustrações)

**ID:** UC-280  
**Requisito relacionado:** RF-280 (associar imagens a fichas de criaturas/monstros)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A ficha da criatura está cadastrada e o arquivo de imagem está disponível localmente ou na galeria.  
**Gatilho:** O usuário clica em "Adicionar Ilustração" na ficha da criatura.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de uma criatura no bestiário.
2. No cabeçalho da ficha, o usuário clica sobre a área de imagem "Adicionar Ilustração/Foto".
3. O sistema abre o modal de seleção da Galeria de Mídias.
4. O usuário seleciona ou faz o upload da ilustração correspondente e confirma.
5. O sistema processa a imagem em formato WebP, vinculando o ID do arquivo à ficha técnica da criatura.
6. A imagem é renderizada como retrato oficial no topo da ficha técnica da criatura.

**Fluxos alternativos:**
- *Galeria interna da espécie:* O usuário insere múltiplas ilustrações na aba "Galeria de Fotos" da criatura para retratar variações de cor ou gênero da espécie.

**Fluxos de exceção:**
- *Upload corrompido:* O sistema barra o arquivo e exibe a mensagem de erro padrão solicitando imagem em formato adequado.

**Pós-condições:** A imagem ilustrativa é vinculada e renderizada na ficha técnica da criatura.

**Critérios de aceite:**
- [ ] A imagem do retrato da criatura deve ser indexada de forma automática na Galeria de Mídias global do projeto.
- [ ] O tempo de processamento e atualização na tela deve ser inferior a 1,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
