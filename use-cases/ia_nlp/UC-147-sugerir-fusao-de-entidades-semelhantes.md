### Caso de Uso: Sugerir fusão de entidades semelhantes automaticamente

**ID:** UC-147  
**Requisito relacionado:** RF-147 (sugerir fusão de entidades semelhantes automaticamente)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Múltiplas entidades estão cadastradas de forma independente no projeto.  
**Gatilho:** Execução periódica de rotina de limpeza de dados em background ou carregamento do Dashboard.  

**Fluxo principal:**
1. A IA analisa o banco de dados de entidades mapeando atributos (descrição física, nascimento, relacionamentos e nomes).
2. A IA identifica duas fichas distintas com alto índice de similaridade (ex: "Lorde Baelish" e "Petyr Baelish").
3. O sistema insere um alerta na barra de ferramentas sugerindo a fusão devido à semelhança de atributos.
4. O usuário clica no alerta e abre a tela de conciliação e fusão de dados.
5. O usuário aprova e executa a fusão.

**Fluxos alternativos:**
- *Fusão de locais:* O sistema identifica locais semelhantes (ex: "Winterfell" e "Castelo de Winterfell") e sugere a consolidação no mapa e diretórios de forma equivalente.

**Fluxos de exceção:**
- *Gêmeos ou homônimos reais:* Se o escritor sinalizar que as entidades são propositalmente distintas, clica em "Não sugerir fusão para estas entidades novamente".

**Pós-condições:** Fichas duplicadas identificadas são fundidas otimizando os dados estruturados do projeto.

**Critérios de aceite:**
- [ ] O algoritmo de sugestão de fusão deve usar distância Levenshtein para nomes e similaridade vetorial para descrições.
- [ ] A rotina de busca de duplicados deve rodar em background de forma silenciosa e leve.

**Prioridade:** Média  
**Complexidade estimada:** Alta
