### Caso de Uso: Associar facções a eventos históricos (envolvimento/aliança)

**ID:** UC-291  
**Requisito relacionado:** RF-291 (associar facções a eventos históricos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** Facções e eventos históricos estão cadastrados no projeto.  
**Gatilho:** O usuário edita o envolvimento de organizações na ficha do evento histórico.  

**Fluxo principal:**
1. O usuário abre a ficha técnica de um evento histórico (ex: "Guerra da Primavera").
2. No painel de facções envolvidas, o usuário clica em "Adicionar Facção".
3. O sistema abre a busca de facções do projeto.
4. O usuário seleciona a facção desejada e define a posição política da organização no evento (Dropdown: Beligerante, Aliado, Mediador, Neutro).
5. O usuário clica em "Salvar".
6. O sistema grava o relacionamento na tabela correspondente no banco de dados.
7. A ficha do evento passa a listar a facção envolvida e a ficha da facção exibe o acontecimento em sua aba de histórico.

**Fluxos alternativos:**
- *Associação em lote:* O usuário seleciona várias facções e as marca coletivamente com o mesmo alinhamento no evento.

**Fluxos de exceção:**
- *Facção excluída:* Se a facção for deletada, o sistema limpa a associação correspondente da ficha do evento de forma segura.

**Pós-condições:** O envolvimento político/militar da facção no evento histórico é registrado na base de dados.

**Critérios de aceite:**
- [ ] A ficha do evento deve listar as organizações separadas pelo seu papel/alinhamento de forma legível.
- [ ] O salvamento da relação deve demorar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
