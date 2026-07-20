### Caso de Uso: Criar e editar Grafo de Metas Narrativas (GMN)

**ID:** UC-454  
**Requisito relacionado:** RF-194 (quadro de progresso), RF-195 (recomendar afazeres)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na tela de planejamento (outliner) do projeto e deseja estruturar a causalidade do enredo.  
**Gatilho:** O usuário acessa a aba "Grafo de Metas Narrativas" na barra lateral ou painel de planejamento.  

**Fluxo principal:**
1. O usuário abre o editor visual do Grafo de Metas Narrativas (GMN).
2. O usuário adiciona um novo nó de meta, definindo:
   - Tipo de Meta: *Exposição (Setting)*, *Personagem (Character)* ou *Conflito (Conflict)*.
   - Título e Descrição Detalhada da meta (ex: "Kael encontra o medalhão na floresta").
   - Entidades relacionadas (personagens, locais e objetos da Wiki).
   - Limiar de similaridade semântica de conclusão ($\tau_i$).
3. O usuário cria uma aresta direcionada entre a Meta A (origem) e a Meta B (destino) para declarar precedência causal.
4. O sistema executa síncronamente o algoritmo de verificação de ciclos (Algoritmo de Kahn) para garantir que o grafo se mantenha como um DAG (Directed Acyclic Graph).
5. O sistema valida que a conexão não cria dependências circulares.
6. O sistema persiste a alteração do grafo localmente no IndexedDB.

**Fluxos alternativos:**
- *Importação de Metas:* O sistema analisa o outline textual existente do livro e sugere nós de metas baseados em parágrafos estruturados do roteiro, deixando-os como rascunhos para o usuário conectar no grafo.

**Fluxos de exceção:**
- *Detecção de Ciclo:* Se a nova aresta gerar uma dependência circular (ex: A depende de B, que depende de A), o sistema cancela a conexão na interface, emite um alerta não-intrusivo informando *"Erro: Esta conexão gera um paradoxo causal infinito (A depende de B)"*, e impede a persistência no banco.

**Pós-condições:** O GMN é salvo localmente no IndexedDB com os novos nós, arestas e metadados lógicos.

**Critérios de aceite:**
- [ ] A criação de arestas deve rodar a checagem de aciclicidade localmente em menos de 5ms para grafos com até 500 nós.
- [ ] O editor do grafo deve diferenciar visualmente os nós de Exposição, Personagem e Conflito através de ícones ou cores discretas.
- [ ] A exclusão de um nó deve remover todas as suas arestas de entrada e saída associadas de forma atômica no banco de dados local.

**Prioridade:** Alta  
**Complexidade estimada:** Alta
