### Caso de Uso: Procurar frases

**ID:** UC-023  
**Requisito relacionado:** RF-23 (procurar frases)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário tem o projeto aberto.  
**Gatilho:** O usuário digita uma sequência de palavras entre aspas ou seleciona a opção "Buscar frase exata" na barra de busca.  

**Fluxo principal:**
1. O usuário abre o painel de busca avançada do projeto.
2. O usuário digita uma frase inteira (ex: "o segredo do castelo abandonado").
3. O sistema realiza uma busca por correspondência de frase exata (procurando a sequência exata de tokens contíguos no indexador).
4. O sistema lista os trechos de texto que contém a correspondência exata.
5. O usuário clica no trecho de interesse para abri-lo diretamente na linha correspondente no editor.

**Fluxos alternativos:**
- *Ignorar pontuação:* Por padrão, a busca ignora pontuações intermediárias (como vírgulas ou pontos de exclamação) para encontrar a frase correspondente.

**Fluxos de exceção:**
- *Texto de busca vazio:* O sistema desabilita o botão de busca enquanto o campo de entrada estiver vazio ou contiver apenas espaços.

**Pós-condições:** As frases correspondentes são exibidas e destacadas no editor ao serem selecionadas.

**Critérios de aceite:**
- [ ] O sistema deve encontrar correspondências mesmo que estejam separadas por quebras de linha suaves (soft-breaks).
- [ ] A velocidade da busca de frase exata em todo o projeto deve ser inferior a 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
