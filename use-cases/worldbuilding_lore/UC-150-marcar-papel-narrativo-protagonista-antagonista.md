### Caso de Uso: Marcar papel narrativo (protagonista, antagonista, secundário)

**ID:** UC-150  
**Requisito relacionado:** RF-150 (marcar papel narrativo)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O personagem está catalogado na base de entidades.  
**Gatilho:** O usuário acessa as propriedades de classificação na ficha de um personagem.  

**Fluxo principal:**
1. O usuário abre o perfil do personagem.
2. O usuário clica no seletor de campo "Papel Narrativo".
3. O sistema apresenta as opções em dropdown: "Protagonista", "Antagonista", "Secundário", "Coadjuvante" ou "Figurante".
4. O usuário seleciona "Antagonista" e confirma.
5. O sistema grava o papel na tabela de atributos do personagem no banco de dados.
6. O sistema atualiza o ícone visual ou a moldura do personagem no diretório lateral e no Grafo de Entidades.

**Fluxos alternativos:**
- *Filtro no Grafo:* O usuário pode filtrar o grafo de relacionamentos para exibir apenas as conexões entre "Protagonistas" e "Antagonistas", ocultando os secundários.

**Fluxos de exceção:**
- *Sem papel definido:* Por padrão, ao cadastrar um personagem, o sistema o classifica inicialmente como "Secundário" até que o usuário altere manualmente.

**Pós-condições:** O papel do personagem na estrutura dramática da história é salvo e refletido nos componentes visuais.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a nova classificação e disparar a re-renderização visual do card do personagem em até 100ms.
- [ ] A alteração de papel deve atualizar a indexação estatística do dashboard do projeto.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
