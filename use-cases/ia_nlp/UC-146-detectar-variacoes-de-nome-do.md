### Caso de Uso: Detectar variações de nome do mesmo personagem

**ID:** UC-146  
**Requisito relacionado:** RF-146 (detectar variações de nome do mesmo personagem)  
**Ator(es):** Sistema, IA  
**Pré-condições:** Personagens estão catalogados com seus nomes oficiais nas fichas de entidades.  
**Gatilho:** Salvamento do texto ou acionamento de checagem.  

**Fluxo principal:**
1. O sistema analisa o texto em background em busca de menções que lembrem apelidos ou variações ortográficas dos nomes de personagens (ex: encontra "Ze" e o personagem é "José").
2. A IA calcula o contexto semântico e a presença de outros personagens na cena para identificar se refere-se ao mesmo personagem.
3. O sistema exibe um relatório com as correspondências sugeridas.
4. O usuário clica sobre a sugestão para cadastrar a variação como apelido oficial ou para substituir os termos nos capítulos.

**Fluxos alternativos:**
- *Mapear apelidos novos:* A IA sugere "Adicionar apelido nas fichas de entidades". O usuário aceita e a ficha correspondente é atualizada.

**Fluxos de exceção:**
- *Homônimos reais:* Se existir outro personagem na história com o apelido detectado, o usuário descarta o alerta para evitar associação incorreta.

**Pós-condições:** As variações de nomenclatura de um mesmo personagem são mapeadas no banco de aliases da entidade.

**Critérios de aceite:**
- [ ] A IA deve considerar regras linguísticas de derivação de apelidos em português brasileiro (ex: "Francisco" -> "Chico").
- [ ] A precisão de mapeamento de aliases de personagens deve ser de no mínimo 85%.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
