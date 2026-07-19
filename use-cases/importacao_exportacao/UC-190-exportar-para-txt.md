### Caso de Uso: Exportar para TXT

**ID:** UC-190  
**Requisito relacionado:** RF-190 (exportar para TXT)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto existe no projeto.  
**Gatilho:** O usuário clica em "Exportar como Texto Puro (.txt)" no menu.  

**Fluxo principal:**
1. O usuário seleciona o capítulo e escolhe "Exportar como Texto Puro (.txt)".
2. O sistema lê o conteúdo do editor, remove todas as formatações ricas (negrito, itálico, cores, marcadores) e retém apenas o texto bruto.
3. O sistema cria o arquivo com a extensão `.txt` contendo a codificação UTF-8.
4. O navegador inicia o download do arquivo.

**Fluxos alternativos:**
- *Exportar livro em TXT:* O sistema concatena todos os textos em um único arquivo, inserindo o título do capítulo no início de cada divisão.

**Fluxos de exceção:**
- *Mídias no texto:* As imagens e blocos de mídia são ignorados do arquivo TXT, substituídos por uma marcação sutil indicando a presença da mídia.

**Pós-condições:** O arquivo em texto puro sem formatações (.txt) é gerado e baixado pelo usuário.

**Critérios de aceite:**
- [ ] O arquivo final deve ser codificado em UTF-8 e possuir quebras de linha legíveis.
- [ ] O tempo total de exportação de um capítulo de tamanho padrão em TXT deve ser de no máximo 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
