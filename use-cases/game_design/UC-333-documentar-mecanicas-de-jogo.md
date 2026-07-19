### Caso de Uso: Documentar mecânicas de jogo

**ID:** UC-333  
**Requisito relacionado:** RF-332 (documentar mecânicas de jogo)  
**Ator(es):** Usuário (Game Designer), Sistema  
**Pré-condições:** O usuário está no módulo de Game Design (GDD) do projeto.  
**Gatilho:** O usuário clica em "Nova Mecânica de Jogo" no menu de documentação de regras do jogo.  

**Fluxo principal:**
1. O usuário acessa "GDD" -> "Mecânicas de Jogo".
2. O usuário clica em "Criar Nova Mecânica".
3. O sistema abre o formulário de cadastro solicitando: Nome da Mecânica, Tipo (combate, exploração), Core Loop associado, Gatilho de Entrada, Ação Realizada e Estado de Retorno.
4. O usuário preenche as informações estruturadas da mecânica.
5. O usuário clica em "Salvar".
6. O sistema grava a mecânica na tabela correspondente.
7. A mecânica é listada no diretório GDD do projeto.

**Fluxos alternativos:**
- *Desenhar fluxo:* O usuário abre o canvas de fluxograma integrado na própria ficha da mecânica para desenhar de forma visual o ciclo de ação do jogador.

**Fluxos de exceção:**
- *Mecânica sem nome:* O sistema exige o preenchimento de nome descritivo para gravação de integridade.

**Pós-condições:** A mecânica de jogo é cadastrada e catalogada no GDD do projeto.

**Critérios de aceite:**
- [ ] A ficha de mecânica de jogo deve suportar anexo de imagens e GIFs ilustrativos de gameplay.
- [ ] A gravação no banco de dados deve levar menos de 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
