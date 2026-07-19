### Caso de Uso: Importar textos em formato Markdown

**ID:** UC-192  
**Requisito relacionado:** RF-192 (importar textos em formato Markdown)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um arquivo com extensão `.md` ou `.markdown`.  
**Gatilho:** O usuário clica em "Importar Markdown" no menu da pasta do projeto.  

**Fluxo principal:**
1. O usuário clica em "Importar Markdown" na pasta selecionada.
2. O sistema abre a janela de upload do sistema operacional.
3. O usuário escolhe o arquivo `.md` correspondente e confirma.
4. O backend lê o texto em Markdown e o converte em representação estruturada rich-text (convertendo `#` em cabeçalhos, `**` em negritos, `[[link]]` em hyperlinks internos).
5. O sistema cria o arquivo de texto no diretório correspondente.
6. O texto formatado é aberto no editor para exibição.

**Fluxos alternativos:**
- *Importação múltipla:* O usuário seleciona múltiplos arquivos `.md` simultaneamente no gerenciador. O sistema os importa em lote mantendo seus respectivos nomes originais.

**Fluxos de exceção:**
- *Codificação incompatível:* Se o arquivo utilizar codificação antiga que altere a acentuação brasileira, o sistema tenta converter para UTF-8 de forma automática ou alerta o usuário.

**Pós-condições:** O documento Markdown é integrado e disponibilizado para edição no projeto.

**Critérios de aceite:**
- [ ] O conversor deve traduzir tabelas Markdown e citações (`>`) de forma visualmente correta no editor.
- [ ] O tempo de processamento deve ser de no máximo 500ms por arquivo.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
