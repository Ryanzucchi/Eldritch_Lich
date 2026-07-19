### Caso de Uso: Criar referências cruzadas entre capítulos

**ID:** UC-394  
**Requisito relacionado:** RF-393 (criar referências cruzadas entre capítulos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto literário ou acadêmico possui múltiplos capítulos e seções cadastrados.  
**Gatilho:** O usuário insere um link de referência cruzada no texto de um capítulo.  

**Fluxo principal:**
1. O usuário edita um capítulo do livro.
2. O usuário clica no ícone "Inserir Referência Cruzada" na barra de ferramentas.
3. O sistema abre a modal listando as entidades disponíveis (outros capítulos, seções, imagens ou tabelas).
4. O usuário seleciona o capítulo e a seção de destino correspondente.
5. O sistema insere um link dinâmico no texto (ex: "ver Capítulo 1, página 12").
6. O sistema mapeia o link na tabela de referências cruzadas.

**Fluxos alternativos:**
- *Páginas dinâmicas:* Se o capítulo de destino crescer e a seção referenciada mudar de página, o sistema recalcula de forma dinâmica o valor da tag de visualização atualizando a paginação.

**Fluxos de exceção:**
- *Destino excluído:* Se a seção ou capítulo referenciado for excluído do projeto, o sistema altera a cor da tag de referência cruzada para cinza exibindo a marcação "Referência quebrada".

**Pós-condições:** O link dinâmico de referência cruzada é inserido no texto e monitorado.

**Critérios de aceite:**
- [ ] O recálculo de links e páginas das referências cruzadas na visualização final do manuscrito deve ocorrer de forma automática antes da exportação em PDF.
- [ ] A inserção da referência cruzada no banco de dados deve levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
