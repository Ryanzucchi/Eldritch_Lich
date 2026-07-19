### Caso de Uso: Marcar facção/organização do personagem

**ID:** UC-176  
**Requisito relacionado:** RF-176 (marcar facção/organização do personagem)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** Personagens e entidades do tipo Organização/Facção estão cadastrados no projeto.  
**Gatilho:** O usuário edita a filiação de um personagem.  

**Fluxo principal:**
1. O usuário acessa a ficha técnica de um personagem.
2. No painel de filiações, o usuário clica em "Adicionar Filiação/Facção".
3. O sistema exibe a lista de organizações do projeto.
4. O usuário seleciona a organização desejada (ex: "Cavaleiros da Távola Redonda").
5. O sistema solicita selecionar o cargo do personagem dentro da organização (Dropdown: Líder, Membro, Aliado, Espião, Ex-membro).
6. O usuário define o cargo e confirma.
7. O sistema grava o vínculo de filiação no banco de dados.
8. A ficha do personagem passa a exibir o brasão correspondente e o personagem é indexado no diretório de membros da organização.

**Fluxos alternativos:**
- *Múltiplas filiações:* O usuário vincula o mesmo personagem a outra organização secundária, definindo seu papel correspondente.

**Fluxos de exceção:**
- *Organização excluída:* Se a organização for deletada do projeto, a associação é removida do perfil do personagem de forma automática.

**Pós-condições:** O personagem é associado e indexado à organização na base de dados do projeto.

**Critérios de aceite:**
- [ ] O brasão da facção deve ser exibido ao lado do nome do personagem em sua ficha técnica de forma compacta.
- [ ] A associação deve atualizar o grafo de rede do projeto.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
