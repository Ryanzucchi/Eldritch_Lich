### Caso de Uso: Visualizar linhagem familiar (ascendentes/descendentes)

**ID:** UC-175  
**Requisito relacionado:** RF-175 (visualizar linhagem familiar)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O personagem possui ascendentes ou descendentes cadastrados na árvore familiar.  
**Gatilho:** O usuário clica em "Ver Linhagem de Sangue" ou "Linhagem Direta" na ficha do personagem.  

**Fluxo principal:**
1. O usuário abre a aba de genealogia de um personagem.
2. O usuário seleciona a opção de visualização "Linhagem Linear".
3. O sistema calcula a trilha ancestral vertical direta (ex: Arthur <- Uther <- Constantino) e a linhagem de descendência vertical direta (Arthur -> Galahad).
4. A interface exibe a linhagem em formato de lista hierárquica com recuos visuais, focando exclusivamente no sangue direto e omitindo cônjuges externos e ramos colaterais.
5. O usuário visualiza com clareza a sucessão de títulos e heranças dinásticas de forma vertical.

**Fluxos alternativos:**
- *Filtrar por linhagem materna ou paterna:* O usuário opta por visualizar exclusivamente a linhagem patrilineal ou matrilineal do personagem.

**Fluxos de exceção:**
- *Linhagem isolada:* Se não houver ascendentes ou descendentes diretos cadastrados além do personagem, a interface indica: "Nenhuma linhagem direta mapeada".

**Pós-condições:** A linhagem direta (ascendente ou descendente) é exibida de forma linear na tela.

**Critérios de aceite:**
- [ ] A lista de linhagem deve destacar os anos de nascimento e morte de cada antecessor/sucessor ao lado de seu nome.
- [ ] A navegação deve permitir saltar diretamente para qualquer ficha de personagem listada.

**Prioridade:** Média  
**Complexidade estimada:** Média
