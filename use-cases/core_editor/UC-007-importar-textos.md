### Caso de Uso: Importar textos

**ID:** UC-007  
**Requisito relacionado:** RF-7 (importar textos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está dentro de um projeto e possui um arquivo local válido (.txt, .md).  
**Gatilho:** O usuário clica no botão "Importar Arquivo" ou arrasta o arquivo para a área de importação.  

**Fluxo principal:**
1. O usuário clica na opção "Importar Arquivo" na barra de ações ou no menu de importação.
2. O sistema abre a janela de upload do sistema operacional.
3. O usuário seleciona o arquivo (.txt ou .md) e confirma a seleção.
4. O sistema processa o arquivo, faz a leitura dos metadados e do corpo textual.
5. O sistema realiza a sanitização do texto e converte a formatação Markdown básica para o formato de edição estruturado interno.
6. O sistema insere o novo documento no projeto atual, atribuindo como título o nome original do arquivo.
7. O sistema abre o texto importado no editor e atualiza a barra de arquivos lateral.

**Fluxos alternativos:**
- *Importação por arrastar e soltar:* O usuário arrasta o arquivo de sua máquina diretamente para a barra lateral do projeto, pulando as etapas de diálogo do SO.

**Fluxos de exceção:**
- *Arquivo com extensão não suportada:* O sistema exibe uma mensagem de erro ("Extensão inválida. Formatos aceitos: .txt, .md") e interrompe o upload.
- *Arquivo com tamanho excessivo:* Se o arquivo exceder o limite (ex: 5MB), o sistema cancela a operação e exibe um erro informando sobre o limite de tamanho.

**Pós-condições:** O conteúdo do arquivo externo é transformado em um texto nativo persistido dentro do projeto do usuário.

**Critérios de aceite:**
- [ ] O parser deve importar corretamente codificações UTF-8 e ISO-8859-1 sem corromper caracteres especiais (acentuações).
- [ ] Títulos, parágrafos, listas e negritos do formato original em markdown devem ser convertidos sem perda para o editor WYSIWYG.
- [ ] O tempo total de processamento e criação de arquivo para textos de até 50 mil palavras deve ser inferior a 2 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Média
