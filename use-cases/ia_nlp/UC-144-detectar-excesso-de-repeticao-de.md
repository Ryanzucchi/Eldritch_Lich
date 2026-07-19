### Caso de Uso: Detectar excesso de repetição de palavras (estilo)

**ID:** UC-144  
**Requisito relacionado:** RF-144 (detectar excesso de repetição de palavras)  
**Ator(es):** Sistema  
**Pré-condições:** O texto ativo possui conteúdo no editor.  
**Gatilho:** O usuário clica na aba "Estilo / Repetição de Palavras" ou salva o documento.  

**Fluxo principal:**
1. O usuário aciona a ferramenta de "Análise de Repetições".
2. O sistema analisa a proximidade de termos idênticos ou com o mesmo lema em um intervalo próximo (janela de palavras).
3. O sistema destaca visualmente no texto as palavras repetidas com um sublinhado cinza.
4. Na barra lateral de ferramentas, o sistema exibe o mapa de termos repetidos com sugestões de sinônimos contextualizados.
5. O usuário clica em um sinônimo sugerido para realizar a substituição no editor.

**Fluxos alternativos:**
- *Filtro de stopwords:* O sistema ignora automaticamente pronomes, artigos e conjunções comuns na análise de repetição.

**Fluxos de exceção:**
- *Repetições intencionais:* O escritor clica em "Ignorar para esta palavra" para remover os alertas em casos de figuras de linguagem.

**Pós-condições:** As palavras com repetição excessiva em trechos contíguos são sinalizadas.

**Critérios de aceite:**
- [ ] A análise de proximidade deve calcular a densidade de ocorrência do termo em janelas móveis de 100 a 200 palavras.
- [ ] O tempo total de mapeamento estético em um texto de 2.000 palavras deve ser inferior a 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
