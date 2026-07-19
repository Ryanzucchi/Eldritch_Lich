### Caso de Uso: Importar textos em formato DOCX

**ID:** UC-194  
**Requisito relacionado:** RF-194 (importar textos em formato DOCX)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário possui um arquivo no formato do Microsoft Word (`.docx`).  
**Gatilho:** O usuário clica em "Importar DOCX" no gerenciador de arquivos do projeto.  

**Fluxo principal:**
1. O usuário clica na pasta e seleciona "Importar" -> "Arquivo Word (.docx)".
2. O sistema solicita a seleção do arquivo local.
3. O usuário seleciona o arquivo `.docx` desejado e confirma.
4. O backend faz o upload do arquivo e aciona o conversor OpenXML.
5. O conversor extrai os elementos do Word: parágrafos, cabeçalhos, listas, negritos, itálicos, cores e tabelas estruturadas, ignorando estilos proprietários complexos de página.
6. O sistema cria e abre o novo documento contendo o texto e suas formatações originais convertidas.

**Fluxos alternativos:**
- *Importação com imagens embutidas:* Se o arquivo DOCX contiver imagens embutidas, o conversor as extrai, faz o upload como mídias do projeto e reinsere os links correspondentes no corpo do texto final.

**Fluxos de exceção:**
- *Formato DOC antigo:* Se o usuário tentar importar um arquivo no formato antigo `.doc` (Word 97-2003), o sistema impede a conversão e solicita salvar o arquivo como `.docx` antes de importar.

**Pós-condições:** O conteúdo e formatação do arquivo DOCX são convertidos e criados no editor do projeto.

**Critérios de aceite:**
- [ ] O parser deve manter a hierarquia de parágrafos e recuos simples intactos.
- [ ] O processo de conversão para documentos de até 10.000 palavras deve demorar menos de 4 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média
