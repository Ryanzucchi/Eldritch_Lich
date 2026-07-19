### Caso de Uso: Associar eventos à facção

**ID:** UC-181  
**Requisito relacionado:** RF-181 (associar eventos à facção)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A facção (organização) e os eventos cronológicos já existem no projeto.  
**Gatilho:** O usuário gerencia as propriedades de filiação de um evento da timeline.  

**Fluxo principal:**
1. O usuário acessa a timeline e clica em editar em um evento.
2. O usuário localiza o campo "Facções Envolvidas/Relacionadas".
3. O sistema abre uma caixa de pesquisa de múltipla escolha com a lista de facções do projeto.
4. O usuário seleciona as facções correspondentes.
5. O usuário clica em "Salvar".
6. O sistema atualiza a tabela de relacionamento entre eventos e facções no banco de dados.
7. O card do evento passa a exibir os mini-brasões das facções associadas.

**Fluxos alternativos:**
- *Filtrar timeline:* O usuário seleciona uma facção e visualiza apenas os eventos em que ela esteve envolvida na timeline geral.

**Fluxos de exceção:**
- *Sem vinculo:* O evento pode permanecer sem vínculos com facções, sendo classificado como evento neutro.

**Pós-condições:** O evento da timeline fica associado às organizações indicadas.

**Critérios de aceite:**
- [ ] A associação deve exibir os mini-brasões correspondentes no card da timeline com resolução nítida.
- [ ] A gravação na tabela de ligação deve demorar menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
