### Caso de Uso: Criar relações de parentesco (pai, mãe, filhos, cônjuges)

**ID:** UC-173  
**Requisito relacionado:** RF-173 (criar relações de parentesco)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Pelo menos dois personagens distintos estão cadastrados no projeto.  
**Gatilho:** O usuário gerencia relacionamentos na ficha técnica de um personagem.  

**Fluxo principal:**
1. O usuário abre a ficha do personagem "Arthur".
2. O usuário clica em "Adicionar Familiar".
3. O sistema abre um modal solicitando selecionar o personagem (autocomplete) e o grau de parentesco (Dropdown: Pai, Mãe, Filho(a), Irmão/Irmã, Cônjuge/Parceiro).
4. O usuário seleciona o personagem "Uther" e escolhe a opção "Pai".
5. O usuário clica em "Confirmar Vínculo".
6. O sistema insere a relação na tabela de parentesco no banco de dados.
7. A ficha de Arthur exibe "Pai: Uther" e a ficha de Uther exibe automaticamente "Filho: Arthur".

**Fluxos alternativos:**
- *Relações de adoção:* O usuário seleciona a opção "Adotivo / Vínculo Não Biológico" para representar relacionamentos de adoção ou tutoria de forma visualmente diferenciada na árvore.

**Fluxos de exceção:**
- *Paradoxo biológico:* Se o usuário tentar associar como "Filho" um personagem cuja data de nascimento seja anterior à do pai, o sistema exibe um alerta de inconsistência biológica, mas permite salvar sob confirmação.

**Pós-condições:** O relacionamento familiar bidirecional é gravado e indexado no banco de dados.

**Critérios de aceite:**
- [ ] O banco de dados deve refletir a bidirecionalidade lógica da relação (se A é pai de B, B é filho de A) de forma íntegra.
- [ ] A inserção e atualização na interface devem levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
