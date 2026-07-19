### Caso de Uso: Associar imagens a fichas de eventos históricos (ilustrações/cenas)

**ID:** UC-295  
**Requisito relacionado:** RF-295 (associar imagens a fichas de eventos históricos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A ficha do evento histórico está cadastrada e o arquivo de imagem está disponível.  
**Gatilho:** O usuário clica em "Adicionar Imagem de Ilustração" na ficha do evento histórico.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um evento histórico.
2. No painel de mídias do evento, o usuário clica em "Adicionar Ilustração".
3. O sistema abre o modal de seleção da Galeria de Mídias.
4. O usuário seleciona ou faz o upload da ilustração correspondente e confirma.
5. O sistema processa a imagem em formato WebP, vinculando o ID da imagem ao registro do evento histórico.
6. A imagem é renderizada como retrato oficial da cena na ficha correspondente e passa a ilustrar o banner do evento na timeline interativa.

**Fluxos alternativos:**
- *Galeria de fotos do evento:* O usuário insere múltiplas ilustrações de cenas secundárias do evento histórico em um carrossel de fotos na ficha.

**Fluxos de exceção:**
- *Arquivo corrompido:* O sistema impede o upload e solicita formato suportado.

**Pós-condições:** A imagem ilustrativa é vinculada e renderizada na ficha de evento histórico e na timeline.

**Critérios de aceite:**
- [ ] A miniatura da imagem deve ilustrar o evento na listagem da timeline interativa de forma responsiva.
- [ ] O tempo total de salvamento e vinculação deve ser menor que 1,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
