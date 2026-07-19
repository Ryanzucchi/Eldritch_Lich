### Caso de Uso: Associar personagens a eventos históricos (participação)

**ID:** UC-289  
**Requisito relacionado:** RF-289 (associar personagens a eventos históricos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Personagens e eventos históricos estão cadastrados no projeto.  
**Gatilho:** O usuário edita a participação de personagens na ficha do evento histórico.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um evento histórico.
2. No painel de participantes, o usuário clica em "Adicionar Personagem / Participante".
3. O sistema abre a busca de personagens.
4. O usuário seleciona o personagem correspondente e define o seu papel no evento (Dropdown: Protagonista, Testemunha, Vítima, Comandante).
5. O usuário clica em "Salvar".
6. O sistema grava a relação na tabela correspondente.
7. A ficha do evento passa a listar o personagem como participante e a ficha do personagem exibe a participação correspondente na aba de biografia.

**Fluxos alternativos:**
- *Adicionar na ficha do personagem:* O usuário abre a ficha do personagem, acessa a aba de histórico e clica em "Adicionar Evento Histórico" para cadastrar o marco biográfico de forma reversa.

**Fluxos de exceção:**
- *Personagem excluído:* Se o personagem participante for deletado, o sistema o remove da lista de participantes do evento de forma silenciosa.

**Pós-condições:** A relação de participação do personagem no acontecimento histórico é salva na base de dados.

**Critérios de aceite:**
- [ ] O banco de dados deve registrar a chave estrangeira de relacionamento de forma íntegra.
- [ ] O tempo total de salvamento do relacionamento deve ser menor que 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
