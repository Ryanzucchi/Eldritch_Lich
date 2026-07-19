### Caso de Uso: Cadastrar fichas de eventos históricos (enciclopédia)

**ID:** UC-288  
**Requisito relacionado:** RF-288 (cadastrar fichas de eventos históricos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na seção de worldbuilding (história/lore) do projeto.  
**Gatilho:** O usuário clica em "Novo Evento Histórico" no menu de enciclopédia/lore.  

**Fluxo principal:**
1. O usuário acessa o menu lateral e seleciona "História/Enciclopédia" -> "Nova Ficha de Evento".
2. O sistema abre a ficha técnica de evento histórico solicitando: Nome do Evento, Data do Evento, Descrição, Antecedentes, Consequências e Documentos de Apoio.
3. O usuário preenche as informações e insere a data correspondente.
4. O usuário clica em "Salvar".
5. O sistema grava o evento na tabela de eventos históricos no banco de dados.
6. O evento passa a constar na lista lateral do diretório e é incluído de forma automática na timeline geral do projeto.

**Fluxos alternativos:**
- *Vincular documento:* O usuário associa um capítulo de texto inteiro como relato detalhado do evento histórico na própria ficha de enciclopédia.

**Fluxos de exceção:**
- *Nome duplicado:* O sistema solicita outro nome caso o evento histórico já exista.

**Pós-condições:** A ficha técnica do evento histórico é gravada e sincronizada com a timeline do projeto.

**Critérios de aceite:**
- [ ] O cadastro do evento histórico deve suportar calendários fictícios configurados no projeto.
- [ ] O inserção no banco de dados e atualização na timeline devem levar menos de 500ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
