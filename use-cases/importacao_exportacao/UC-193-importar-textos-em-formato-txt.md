### Caso de Uso: Importar textos em formato TXT

**ID:** UC-193  
**Requisito relacionado:** RF-193 (importar textos em formato TXT)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um arquivo `.txt` contendo texto puro.  
**Gatilho:** O usuário clica em "Importar TXT" no gerenciador lateral do projeto.  

**Fluxo principal:**
1. O usuário clica em "Importar Texto (.txt)" na pasta correspondente.
2. O sistema abre a caixa de diálogo do SO para seleção do arquivo.
3. O usuário seleciona o arquivo e confirma.
4. O backend lê o arquivo TXT utilizando codificação UTF-8, cria um novo documento de texto, injeta o texto bruto e substitui quebras de linha sequenciais por novos parágrafos padrão.
5. O arquivo de texto é aberto no editor para escrita.

**Fluxos alternativos:**
- *Colagem rápida:* O usuário copia o conteúdo do bloco de notas e o cola diretamente no corpo de um editor vazio criado na hora.

**Fluxos de exceção:**
- *Arquivo binário renomeado:* Se o usuário tentar enviar um arquivo binário renomeado para `.txt`, o parser detecta caracteres de controle inválidos e cancela o upload: "O arquivo selecionado não é um arquivo de texto válido".

**Pós-condições:** O conteúdo do arquivo TXT é importado como texto ativo no projeto.

**Critérios de aceite:**
- [ ] O sistema deve limpar caracteres invisíveis ou de controle inconsistentes.
- [ ] A criação do arquivo importado deve durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
