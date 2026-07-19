### Caso de Uso: Colocar imagens como capa de pastas

**ID:** UC-067  
**Requisito relacionado:** RF-67 (colocar imagens como capa de pastas)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Uma pasta existe e o usuário possui um arquivo de imagem local.  
**Gatilho:** O usuário escolhe "Definir Capa da Pasta" -> "Upload de Imagem".  

**Fluxo principal:**
1. O usuário clica com o botão direito na pasta e seleciona "Definir Imagem de Capa".
2. O sistema abre o diálogo de seleção de arquivo local.
3. O usuário seleciona o arquivo de imagem (.png, .jpg) e confirma.
4. O sistema executa o upload do arquivo para o servidor de arquivos, gerando versões em miniatura (thumbnail) e resolução padrão.
5. O sistema vincula o endereço da imagem ao atributo de capa da pasta no banco de dados.
6. A miniatura da imagem passa a ser exibida como ícone ou plano de fundo da pasta na interface de exibição.

**Fluxos alternativos:**
- *Arrastar imagem:* O usuário arrasta uma imagem de seu computador e a solta diretamente em cima do ícone da pasta na interface.

**Fluxos de exceção:**
- *Upload rejeitado:* Se o arquivo for corrompido ou de formato não suportado, o sistema cancela a operação e alerta o usuário.

**Pós-condições:** A pasta passa a usar a imagem enviada como sua representação visual de capa.

**Critérios de aceite:**
- [ ] O sistema deve redimensionar e cortar automaticamente a imagem enviada para proporções quadradas (1:1) ou de capa (3:4) recomendadas.
- [ ] A renderização da miniatura na árvore de arquivos deve levar menos de 200ms após o carregamento inicial.

**Prioridade:** Média  
**Complexidade estimada:** Média
