### Caso de Uso: Agrupar palavras

**ID:** UC-020  
**Requisito relacionado:** RF-20 (agrupar palavras)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O usuário solicitou a análise lexical de um texto ou projeto.  
**Gatilho:** O usuário clica na ferramenta de "Análise Lexical" -> "Agrupar Palavras".  

**Fluxo principal:**
1. O usuário aciona a opção "Agrupar Palavras" no painel de estatísticas textuais do editor.
2. O sistema extrai todas as palavras do texto e remove stopwords correspondentes ao idioma do texto.
3. O sistema aplica o processo de lematização ou stemming para agrupar variações da mesma palavra raiz.
4. O sistema gera uma lista ordenada por frequência com os termos principais e suas variações agrupadas.
5. O sistema exibe o resultado na forma de uma nuvem de palavras interativa ou uma tabela de frequência.

**Fluxos alternativos:**
- *Filtro de exclusão:* O usuário pode clicar com o botão direito em uma palavra na lista e selecionar "Ocultar deste agrupamento" para refinar o resultado.

**Fluxos de exceção:**
- *Erro no processamento linguístico:* Se a lematização falhar, o sistema reverte para o agrupamento literal exato de palavras (case-insensitive) e exibe uma notificação informando o ocorrido.

**Pós-condições:** O sistema apresenta a distribuição e agrupamento lexical do documento para fins de análise estilística.

**Critérios de aceite:**
- [ ] O sistema de lematização deve carregar o dicionário correspondente ao idioma do texto em menos de 1 segundo.
- [ ] Stopwords comuns do português brasileiro devem ser ignoradas por padrão na geração da frequência.
- [ ] Clicar em um termo agrupado deve destacar todas as ocorrências de suas variações no editor de texto.

**Prioridade:** Média  
**Complexidade estimada:** Média
