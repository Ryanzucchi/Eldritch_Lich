### Caso de Uso: Colocar imagens como capa de textos

**ID:** UC-068  
**Requisito relacionado:** RF-68 (colocar imagens como capa de textos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Um texto existe e o usuário possui uma imagem local.  
**Gatilho:** O usuário seleciona "Definir Capa do Documento" no editor do texto ou painel lateral de metadados.  

**Fluxo principal:**
1. O usuário abre o texto no editor e clica em "Adicionar Capa".
2. O sistema abre o diálogo do sistema operacional para carregar a imagem.
3. O usuário seleciona a imagem e confirma.
4. O sistema realiza o upload do arquivo para o bucket de armazenamento e associa o link gerado à propriedade `capa_url` do documento.
5. O topo do editor de texto passa a exibir a imagem de capa em formato banner estilizado.

**Fluxos alternativos:**
- *Remover capa:* O usuário clica no botão "Remover Capa" no topo do banner para desassociar a imagem.

**Fluxos de exceção:**
- *Erro de upload:* Caso ocorra perda de conexão no upload, o sistema mantém o estado anterior do documento e exibe o alerta "Falha no envio da imagem de capa".

**Pós-condições:** O texto tem uma imagem associada como capa e exibida no cabeçalho do editor.

**Critérios de aceite:**
- [ ] O banner de capa no editor de texto deve ser responsivo e redimensionar dinamicamente sem distorcer a imagem (object-fit).
- [ ] O tamanho do upload da imagem deve ser limitado a 5MB.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
