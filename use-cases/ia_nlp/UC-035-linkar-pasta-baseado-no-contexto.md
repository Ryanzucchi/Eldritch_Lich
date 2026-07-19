### Caso de Uso: Linkar pasta baseado no contexto de seus textos

**ID:** UC-035  
**Requisito relacionado:** RF-35 (linkar pasta baseado no contexto de seus textos)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Existem pastas criadas que contêm múltiplos textos com conteúdos definidos.  
**Gatilho:** O usuário visualiza o grafo de conexões ou as propriedades de uma pasta.  

**Fluxo principal:**
1. O sistema consolida as representações semânticas (vetores) de todos os textos presentes dentro de uma determinada pasta ("Pasta A").
2. O sistema faz o mesmo para outras pastas do projeto.
3. A IA compara os perfis semânticos agregados das pastas para identificar relações temáticas fortes (ex: a pasta "Arco da Traição" possui alta correlação temática com a pasta "Reino do Norte").
4. O sistema sugere um link contextual entre as pastas na árvore de arquivos ou no painel de visualização em grafo.
5. O usuário clica em "Aprovar link entre pastas" para oficializar o relacionamento.

**Fluxos alternativos:**
- *Filtro no Grafo:* O usuário pode visualizar essa conexão no grafo geral para identificar conexões de alto nível entre grupos de textos.

**Fluxos de exceção:**
- *Pastas vazias:* Pastas sem textos dentro são desconsideradas no mapeamento e agrupamento contextual.

**Pós-condições:** A relação contextual entre pastas é registrada no banco de dados de relacionamentos do projeto.

**Critérios de aceite:**
- [ ] A consolidação vetorial deve ponderar textos mais longos ou marcados como "importantes" com pesos maiores.
- [ ] O cálculo de correlação de pastas deve rodar de forma assíncrona sob demanda para evitar sobrecarga.

**Prioridade:** Média  
**Complexidade estimada:** Alta
