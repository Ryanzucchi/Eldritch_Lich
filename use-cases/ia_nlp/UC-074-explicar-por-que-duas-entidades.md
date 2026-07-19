### Caso de Uso: Explicar por que duas entidades foram conectadas

**ID:** UC-074  
**Requisito relacionado:** RF-74 (explicar por que duas entidades foram conectadas)  
**Ator(es):** Usuário (Escritor), Sistema, IA  
**Pré-condições:** Existem conexões cadastradas de forma automática pela IA ou manual pelo usuário.  
**Gatilho:** O usuário clica em uma linha de conexão (aresta) no grafo de entidades e seleciona "Explicar Conexão".  

**Fluxo principal:**
1. O usuário abre o Grafo de Entidades.
2. O usuário clica sobre a linha que conecta o personagem "Arthur" ao local "Floresta de Whispering".
3. O usuário clica no botão "Explicar Conexão".
4. O sistema varre os textos do projeto buscando as frases e parágrafos indexados onde ambas as entidades aparecem juntas.
5. O sistema abre um balão lateral listando as justificativas textuais (ex: "Conectados porque: 1. No Capítulo 1 (linha 45), Arthur se perde na Floresta...").
6. O usuário lê as referências com links diretos para os arquivos correspondentes.

**Fluxos alternativos:**
- *Explicação de relações de IA:* Se o vínculo foi criado de forma automática pela IA, o sistema exibe o raciocínio detalhado gerado pelo modelo de linguagem no momento da criação.

**Fluxos de exceção:**
- *Conexão manual sem notas:* Se a conexão foi criada manualmente e o usuário não deixou descrições, o sistema exibe "Conexão criada manualmente pelo usuário. Nenhuma evidência textual adicional encontrada".

**Pós-condições:** As referências textuais e causais que justificam o vínculo entre as duas entidades são apresentadas na tela.

**Critérios de aceite:**
- [ ] O sistema deve exibir os trechos exatos de texto onde as entidades são correlacionadas.
- [ ] A busca por co-ocorrências e correlações deve levar menos de 1 segundo.

**Prioridade:** Alta  
**Complexidade estimada:** Média
