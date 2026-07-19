### Caso de Uso: Associar itens/objetos a personagens (posse)

**ID:** UC-282  
**Requisito relacionado:** RF-282 (associar itens/objetos a personagens)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens e itens estão cadastrados no projeto.  
**Gatilho:** O usuário edita a ficha de inventário de um personagem.  

**Fluxo principal:**
1. O usuário abre la ficha de um personagem (ex: "Arthur").
2. O usuário clica na aba "Inventário / Posses".
3. O usuário clica em "Equipar / Adicionar Item".
4. O sistema abre a busca de itens do projeto.
5. O usuário seleciona o item desejado e define a data de obtenção e o tipo de posse (Dropdown: Equipado, Carregando, Guardado).
6. O usuário clica em "Salvar".
7. O sistema grava o relacionamento na tabela correspondente.
8. A ficha do personagem passa a listar o item sob o seu inventário e a ficha do item correspondente exibe o campo de proprietário atualizado.

**Fluxos alternativos:**
- *Transferir item:* O usuário clica em "Transferir Item" na ficha do objeto e seleciona outro personagem como novo possuidor. O sistema atualiza os registros de inventário de ambos de forma simultânea.

**Fluxos de exceção:**
- *Itens exclusivos:* Se o item for configurado como exclusivo/único e o usuário tentar atribuí-lo a um segundo personagem sem desvincular do primeiro, o sistema alerta e solicita confirmação para a transferência automática.

**Pós-condições:** O item é associado ao inventário do personagem na base de dados do projeto.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a chave de relacionamento de forma indexada.
- [ ] A interface da aba de inventário deve atualizar em tempo real em menos de 150ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
