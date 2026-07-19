### Caso de Uso: Garantir que buscas retornem resultados relevantes em menos de 2 segundos (RNF)

**ID:** UC-443  
**Requisito relacionado:** RNF-Medium-7 (busca rápida de dados e arquivos)  
**Ator(es):** Sistema (Motor de Busca / Banco de Dados)  
**Pré-condições:** Índices de busca de texto completo ativos e configurados no banco de dados.  
**Gatilho:** O usuário digita termos na caixa de busca global e confirma.  

**Fluxo principal:**
1. O usuário digita a pesquisa no campo de busca global e pressiona Enter.
2. O backend recebe a chamada da API de busca.
3. O banco de dados realiza a consulta indexada cruzando dados de personagens, locais e itens cadastrados no projeto correspondente.
4. O sistema ordena os resultados por relevância lógica baseando-se em tags e proximidade de caracteres.
5. O sistema retorna a lista de dados correspondentes e a interface renderiza na tela em menos de 2 segundos.

**Fluxos alternativos:**
- *Busca aproximada:* O usuário digita o termo com pequenos erros ortográficos. O sistema utiliza algoritmos de busca fuzzy (ex: distância de Levenshtein) para encontrar e apresentar os termos mais prováveis.

**Fluxos de exceção:**
- *Timeout de busca:* Se a consulta demorar mais de 2 segundos sob alta concorrência de banco, o sistema aborta o processo e avisa: "A busca demorou muito para responder. Refine sua pesquisa".

**Pós-condições:** Os resultados de busca ordenados por relevância e semântica são exibidos na tela.

**Critérios de aceite:**
- [ ] 98% das requisições de busca textual simples sobre o banco do projeto devem responder em até 1,5 segundos.
- [ ] A busca deve ignorar stop words (como "de", "o", "a") para maximizar a relevância dos itens encontrados.

**Prioridade:** Alta  
**Complexidade estimada:** Média
