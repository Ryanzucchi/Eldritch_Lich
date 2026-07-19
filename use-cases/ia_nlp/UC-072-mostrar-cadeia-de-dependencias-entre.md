### Caso de Uso: Mostrar cadeia de dependências entre entidades

**ID:** UC-072  
**Requisito relacionado:** RF-72 (mostrar cadeia de dependências entre entidades)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O projeto possui múltiplas entidades cadastradas e interconectadas.  
**Gatilho:** O usuário seleciona "Exibir Cadeia de Dependências" a partir de uma entidade no grafo ou ficha técnica.  

**Fluxo principal:**
1. O usuário abre a ficha da entidade "Facção Rebelde".
2. O usuário clica na aba "Cadeia de Dependências".
3. O sistema calcula o fluxo de relacionamentos direcionados que saem ou chegam à entidade na base de dados.
4. O sistema exibe um fluxograma/diagrama de dependências hierárquico (ex: "Facção Rebelde" depende de -> "Financiamento Secreto" -> "Lorde Varis" -> "Castelo do Leste").
5. O usuário interage com o fluxograma para expandir ou colapsar níveis da cadeia.

**Fluxos alternativos:**
- *Destaque no Grafo Geral:* O usuário opta por visualizar a cadeia destacando as arestas e nós envolvidos diretamente no canvas do grafo global do projeto.

**Fluxos de exceção:**
- *Entidade isolada:* Se a entidade não tiver nenhuma conexão cadastrada, a interface exibe "Esta entidade não possui dependências registradas".

**Pós-condições:** A cadeia lógica e hierárquica de dependências da entidade é apresentada de forma visual.

**Critérios de aceite:**
- [ ] A visualização deve suportar até 5 níveis de encadeamento sem perdas de performance de tela.
- [ ] O usuário deve conseguir exportar o diagrama de dependências como arquivo SVG ou texto em formato Mermaid.

**Prioridade:** Média  
**Complexidade estimada:** Média
