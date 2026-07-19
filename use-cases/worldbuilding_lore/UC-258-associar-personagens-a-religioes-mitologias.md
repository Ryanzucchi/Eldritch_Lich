### Caso de Uso: Associar personagens a religiões/mitologias (crença)

**ID:** UC-258  
**Requisito relacionado:** RF-258 (associar personagens a religiões/mitologias)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** Personagens e religiões estão cadastrados no projeto.  
**Gatilho:** O usuário edita a ficha de perfil social do personagem.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um personagem.
2. No painel de cultura e perfil, o usuário clica em "Adicionar Religião/Crença".
3. O sistema exibe o dropdown de crenças do projeto.
4. O usuário seleciona a religião correspondente e define o Nível de Devoção (Dropdown: Devoto Fiel, Praticante Nominal, Cético, Fanático).
5. O usuário clica em "Salvar".
6. O sistema grava o vínculo na base de dados.
7. A ficha do personagem passa a exibir o nome e símbolo da religião e seu grau de devoção.

**Fluxos alternativos:**
- *Herege:* O usuário altera o status para "Herege/Ex-membro" e o sistema remove o personagem da lista de devotos ativos daquela religião.

**Fluxos de exceção:**
- *Religião excluída:* Se a religião for deletada do projeto, a associação é removida do perfil do personagem de forma automática.

**Pós-condições:** O vínculo de devoção religiosa do personagem é gravado no banco de dados.

**Critérios de aceite:**
- [ ] O símbolo da religião deve ser exibido ao lado do nome do personagem em sua ficha técnica de forma compacta.
- [ ] A associação deve atualizar as estatísticas de religiosidade do projeto.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
