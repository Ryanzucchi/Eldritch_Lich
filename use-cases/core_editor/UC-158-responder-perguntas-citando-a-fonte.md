### Caso de Uso: Responder perguntas citando a fonte (texto/trecho)

**ID:** UC-158  
**Requisito relacionado:** RF-158 (responder perguntas citando a fonte)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** O usuário efetuou uma pergunta ao assistente de IA sobre o universo do projeto.  
**Gatilho:** A IA conclui a geração da resposta à pergunta do usuário.  

**Fluxo principal:**
1. O usuário digita a pergunta no chat de lore (ex: "Quantos anos Arthur tinha quando seu pai morreu?").
2. A IA pesquisa nos textos e constrói a resposta factual.
3. O sistema identifica os trechos exatos de texto de onde extraiu os dados.
4. O sistema renderiza a resposta no chat acompanhada por links clicáveis e numerados (notas de referência, ex: `[1]`).
5. O usuário clica no link `[1]` e o sistema abre o arquivo na linha correspondente no editor ao lado.

**Fluxos alternativos:**
- *Citar múltiplas fontes:* Se o fato for mencionado em vários trechos, a IA agrupa todas as fontes com links separados no rodapé da resposta.

**Fluxos de exceção:**
- *Fonte em metadados:* Se a informação vier de fichas e não de capítulos de texto, a IA exibe o link direcionando para a ficha do personagem correspondente.

**Pós-condições:** A resposta da IA é apresentada contendo a fundamentação textual detalhada e os hyperlinks correspondentes.

**Critérios de aceite:**
- [ ] Cada citação fornecida deve expor o nome do arquivo de origem, o capítulo e o número aproximado da linha do trecho.
- [ ] Clicar no link de citação deve focar e destacar temporariamente o trecho de origem no editor de texto.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
