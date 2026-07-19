### Caso de Uso: Extrair texto de imagens

**ID:** UC-088  
**Requisito relacionado:** RF-88 (extrair texto de imagens)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O processo de OCR (UC-087) foi concluído com sucesso em uma imagem.  
**Gatilho:** O usuário clica no botão "Copiar Texto Extraído" ou "Inserir no Editor".  

**Fluxo principal:**
1. O usuário visualiza o modal de texto extraído do OCR da imagem.
2. O usuário revisa o texto gerado pela extração.
3. O usuário clica em "Inserir no Editor".
4. O sistema insere o texto extraído na posição do cursor ativo no editor.
5. A imagem original permanece salva, mas seu conteúdo passa a fazer parte do texto editável.

**Fluxos alternativos:**
- *Criar novo documento:* O usuário clica em "Salvar como Novo Texto", gerando um arquivo contendo a transcrição da imagem no projeto.

**Fluxos de exceção:**
- *Editor fechado:* Se o usuário tentar inserir o texto no editor sem nenhum documento aberto, o sistema força a criação de um novo documento e insere o conteúdo.

**Pós-condições:** O conteúdo textual extraído da imagem é incorporado no fluxo de edição do projeto.

**Critérios de aceite:**
- [ ] A inserção do texto no editor deve preservar quebras de linha detectadas no OCR para manter a estrutura original de parágrafos.
- [ ] O texto copiado deve ser limpo de marcações internas do OCR.

**Prioridade:** Média  
**Complexidade estimada:** Média
