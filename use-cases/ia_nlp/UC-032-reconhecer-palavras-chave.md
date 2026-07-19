### Caso de Uso: Reconhecer palavras-chave

**ID:** UC-032  
**Requisito relacionado:** RF-32 (reconhecer palavras-chave)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O texto tem conteúdo no editor.  
**Gatilho:** O usuário clica em "Extrair Palavras-chave" ou o sistema executa em background após salvamento.  

**Fluxo principal:**
1. O sistema extrai o texto puro do editor.
2. O sistema executa um algoritmo estatístico (ex: TF-IDF, YAKE! ou KeyBERT) para encontrar os termos mais importantes e informativos do texto.
3. O sistema seleciona as 10 principais palavras-chave identificadas.
4. O sistema lista e exibe as palavras-chave no cabeçalho ou painel de metadados do texto.
5. O usuário seleciona quais palavras-chave deseja adicionar automaticamente como tags permanentes do documento.

**Fluxos alternativos:**
- *Remoção de palavra-chave sugerida:* O usuário clica no ícone "x" ao lado de uma palavra-chave sugerida para descartá-la.

**Fluxos de exceção:**
- *Texto sem termos significativos:* Se o texto for composto apenas por stopwords, nenhuma palavra-chave é gerada.

**Pós-condições:** As palavras-chave sugeridas e aprovadas são salvas como metadados do texto.

**Critérios de aceite:**
- [ ] O algoritmo deve ignorar stopwords e pontuações de forma nativa no idioma identificado.
- [ ] A extração de palavras-chave deve rodar em menos de 1 segundo para textos de tamanho padrão.

**Prioridade:** Média  
**Complexidade estimada:** Média
