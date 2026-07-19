### Caso de Uso: Criar brasão/insígnia de facções (gerador visual ou upload)

**ID:** UC-179  
**Requisito relacionado:** RF-179 (criar brasão/insígnia de facções)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A organização/facção está cadastrada no projeto.  
**Gatilho:** O usuário clica em "Editar Brasão" na ficha da facção.  

**Fluxo principal:**
1. O usuário abre a ficha de uma organização e clica em "Adicionar Brasão/Símbolo".
2. O sistema abre um modal com duas abas: "Fazer Upload" e "Criar Brasão Rápido".
3. O usuário seleciona "Fazer Upload", escolhe o arquivo contendo a imagem da insígnia e confirma.
4. O sistema realiza o upload da imagem para o servidor, gera miniaturas otimizadas e associa a imagem à organização.
5. A ficha da facção passa a renderizar o brasão de forma destacada no cabeçalho.

**Fluxos alternativos:**
- *Criar Brasão Rápido (Gerador Visual):* O usuário escolhe o formato do escudo, cor de fundo e adiciona um ícone da galeria do sistema. O sistema mescla os elementos em um arquivo SVG consolidado e o salva como imagem oficial do brasão.

**Fluxos de exceção:**
- *Upload excessivo:* Se o usuário tentar enviar uma imagem superior a 5MB, o sistema barra o envio e solicita um arquivo menor.

**Pós-condições:** A imagem do brasão é processada e vinculada à organização no projeto.

**Critérios de aceite:**
- [ ] O gerador visual interno de brasões em SVG deve exportar arquivos válidos de no máximo 200KB.
- [ ] A miniatura do brasão deve ser renderizada corretamente ao lado de todos os membros associados no diretório.

**Prioridade:** Média  
**Complexidade estimada:** Média
