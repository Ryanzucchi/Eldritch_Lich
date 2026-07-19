### Caso de Uso: Responder perguntas sobre o universo

**ID:** UC-106  
**Requisito relacionado:** RF-106 (responder perguntas sobre o universo)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** O usuário tem uma caixa de chat com a IA ativa ou deseja obter respostas automáticas a partir de perguntas.  
**Gatilho:** O usuário digita uma pergunta no chat de assistência ou clica em "Deixar a IA responder" em uma pergunta gerada.  

**Fluxo principal:**
1. O usuário envia uma pergunta ou solicita a resposta automática a uma dúvida do enredo.
2. A IA realiza uma busca semântica em todos os textos do projeto e nas tabelas de metadados do universo.
3. A IA compõe uma resposta objetiva baseada exclusivamente nos fatos explícitos ou implícitos encontrados na base do projeto.
4. O sistema exibe a resposta na tela.

**Fluxos alternativos:**
- *Responder citando fonte:* O sistema exibe a resposta acompanhada por citações dos trechos de capítulos e fichas técnicas de onde extraiu as conclusões.

**Fluxos de exceção:**
- *Informação indisponível:* Se a informação não constar em nenhuma parte do projeto, a IA responde honestamente: "Não encontrei referências sobre o assunto nos arquivos. Deseja definir essa informação agora?".

**Pós-condições:** A resposta estruturada e contextualizada é exibida ao usuário.

**Critérios de aceite:**
- [ ] A IA não deve alucinar; a resposta deve ser derivada diretamente das fontes textuais ou fichas cadastradas no projeto.
- [ ] A latência de resposta do chatbot de lore deve ser inferior a 2,5 segundos.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
