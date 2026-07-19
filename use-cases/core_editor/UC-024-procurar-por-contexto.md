### Caso de Uso: Procurar por contexto

**ID:** UC-024  
**Requisito relacionado:** RF-24 (procurar por contexto)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** O projeto possui busca vetorial semântica ativada e textos previamente indexados.  
**Gatilho:** O usuário digita uma consulta conceitual na barra de busca e seleciona "Busca Semântica/Por Contexto".  

**Fluxo principal:**
1. O usuário digita uma dúvida ou conceito (ex: "onde os personagens discutem a traição do rei").
2. O sistema envia a busca para um modelo de embedding que gera a representação vetorial da consulta.
3. O sistema calcula a similaridade vetorial contra os blocos de texto indexados no banco vetorial.
4. O sistema retorna os trechos de textos semanticamente mais próximos da intenção de busca do usuário, mesmo que não contenham as palavras exatas (ex: retorna cenas sobre "a deslealdade de Varian").
5. O usuário clica no resultado para ser levado ao trecho.

**Fluxos alternativos:**
- *Busca híbrida:* O sistema combina a pontuação de similaridade semântica (vetores) com busca lexical tradicional (BM25) para refinar a precisão.

**Fluxos de exceção:**
- *Banco de dados vetorial inacessível:* Se o serviço de busca vetorial falhar, o sistema exibe "Busca semântica indisponível no momento. Realizando busca padrão por palavras-chave" e reverte para a busca convencional.

**Pós-condições:** Os trechos semanticamente relevantes são apresentados ao usuário de forma ranqueada por relevância conceitual.

**Critérios de aceite:**
- [ ] Os resultados semânticos devem retornar em até 1,5 segundos.
- [ ] Cada resultado exibido deve mostrar a porcentagem de correspondência conceitual estimada pela IA.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
