### Caso de Uso: Organizar textos por tags

**ID:** UC-013  
**Requisito relacionado:** RF-13 (organizar textos por tags)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto está aberto no editor ou selecionado na lista de arquivos.  
**Gatilho:** O usuário clica na seção de Tags do documento.  

**Fluxo principal:**
1. O usuário clica na área "Adicionar Tags" no painel de metadados do texto.
2. O sistema exibe uma lista de tags já existentes no projeto com uma barra de busca e digitação rápida.
3. O usuário digita o nome de uma nova tag ou seleciona uma tag da lista.
4. O usuário confirma a seleção (ou aperta Enter).
5. O sistema vincula a tag ao documento (relação N:M entre textos e tags) no banco de dados.
6. A interface exibe a tag como um selo (*badge*) colorido ao lado do título ou no painel de metadados do texto.

**Fluxos alternativos:**
- *Remover tag:* O usuário clica no ícone "x" da tag correspondente para desvinculá-la do texto.

**Fluxos de exceção:**
- *Tag muito longa:* Se o usuário tentar criar uma tag com mais de 30 caracteres, o sistema trunca o input e notifica: "Tags devem ter no máximo 30 caracteres".

**Pós-condições:** A associação do texto à tag é registrada no banco de dados, permitindo buscas e filtros.

**Critérios de aceite:**
- [ ] O sistema deve salvar tags de forma case-insensitive para evitar duplicatas.
- [ ] A inserção de tags deve disparar atualizações instantâneas no indexador de busca.
- [ ] O usuário deve conseguir associar um número ilimitado de tags a um único texto.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
