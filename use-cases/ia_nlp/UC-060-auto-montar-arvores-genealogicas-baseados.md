### Caso de Uso: Auto montar árvores genealógicas baseados no texto

**ID:** UC-060  
**Requisito relacionado:** RF-60 (auto montar árvores genealógicas baseados no texto)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Existem textos no projeto que mencionam relações familiares entre os personagens.  
**Gatilho:** O usuário seleciona "Auto-montar Árvore" a partir de um texto ou projeto.  

**Fluxo principal:**
1. O usuário clica em "Gerar Árvore Genealógica por IA" na aba de ferramentas.
2. A IA varre o texto dos capítulos selecionados em busca de declarações de parentesco (ex: "Arthur, filho de Uther").
3. A IA compila a tabela de relações de parentesco extraídas.
4. O sistema gera uma árvore genealógica visual de rascunho com os graus de parentesco identificados.
5. O sistema exibe um painel lado a lado mostrando a árvore proposta e as justificativas textuais.
6. O usuário clica em "Confirmar e Salvar Árvore".

**Fluxos alternativos:**
- *Atualizar existente:* A IA detecta novas menções de parentesco ao longo da escrita e sugere adições em uma árvore genealógica já existente.

**Fluxos de exceção:**
- *Conflitos de parentesco:* Se diferentes trechos de texto contarem versões conflitantes, a IA exibe as alternativas com os respectivos trechos e solicita que o usuário resolva manualmente.

**Pós-condições:** A árvore genealógica é estruturada e gravada de forma automatizada.

**Critérios de aceite:**
- [ ] O sistema de IA deve justificar cada aresta de parentesco criada referenciando o arquivo e a linha de origem.
- [ ] O tempo total de análise para a montagem de árvore genealógica em um romance com até 50 mil palavras deve ser de no máximo 10 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
