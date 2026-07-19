### Caso de Uso: Exportar textos em formato DOCX

**ID:** UC-163  
**Requisito relacionado:** RF-163 (exportar textos em formato DOCX)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto a ser exportado está disponível no projeto.  
**Gatilho:** O usuário clica em "Exportar para DOCX" no menu de opções.  

**Fluxo principal:**
1. O usuário seleciona o capítulo ou livro e clica em "Exportar como DOCX (Word)".
2. O sistema abre opções de layout e estilos (fontes padrão, espaçamento entre linhas e recuo de parágrafo).
3. O usuário seleciona as preferências e clica em "Gerar Documento".
4. O backend converte a árvore do editor de rich-text para a estrutura XML padrão OpenXML (.docx).
5. O sistema inicia o download automático do arquivo `.docx`.

**Fluxos alternativos:**
- *Incluir notas de rodapé:* O usuário ativa a opção "Exportar comentários como Notas de Revisão", gerando balões de revisão nativos do Word.

**Fluxos de exceção:**
- *Falha na conversão de tabelas:* Se o texto contiver tabelas complexas e o parser falhar, o sistema as exporta no formato de texto tabulado simples.

**Pós-condições:** O arquivo DOCX formatado e editável para editores de texto de mercado é baixado.

**Critérios de aceite:**
- [ ] O DOCX exportado deve respeitar a estrutura de parágrafos, recuos, cores e formatações de cabeçalhos (H1, H2, H3).
- [ ] O processamento do DOCX deve ser feito em menos de 2 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Média
