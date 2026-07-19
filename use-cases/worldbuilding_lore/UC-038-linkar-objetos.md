### Caso de Uso: Linkar objetos

**ID:** UC-038  
**Requisito relacionado:** RF-38 (linkar objetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Os objetos estão catalogados como entidades no projeto.  
**Gatilho:** O usuário acessa o menu de relacionamentos da ficha de um objeto.  

**Fluxo principal:**
1. O usuário acessa a ficha de um objeto (ex: "Anel do Poder").
2. O usuário seleciona a opção "Vincular Entidade".
3. O sistema abre a lista de entidades.
4. O usuário escolhe a entidade de destino (ex: escolhe o personagem "Frodo") e atribui a relação (ex: "Possuído por", "Escondido em").
5. O sistema grava o vínculo no banco de dados.
6. A ficha do objeto passa a exibir quem é o detentor atual e onde ele se encontra.

**Fluxos alternativos:**
- *Rastreamento automático:* O sistema atualiza o link de localização de um objeto analisando o texto das cenas em que o objeto é mencionado sendo movido.

**Fluxos de exceção:**
- *Múltiplos donos exclusivos:* Se a relação for de propriedade exclusiva e o usuário tentar associar a outro personagem, o sistema pergunta: "Este objeto pertence a [Personagem A]. Deseja transferir a posse para [Personagem B]?".

**Pós-condições:** O relacionamento do objeto com outras entidades do universo é persistido.

**Critérios de aceite:**
- [ ] O sistema deve listar na aba do objeto todas as suas conexões históricas de posse e localização.
- [ ] O objeto deve constar automaticamente no inventário da entidade vinculada.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
