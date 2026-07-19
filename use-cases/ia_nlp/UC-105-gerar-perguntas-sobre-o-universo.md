### Caso de Uso: Gerar perguntas sobre o universo

**ID:** UC-105  
**Requisito relacionado:** RF-105 (gerar perguntas sobre o universo)  
**Ator(es):** Sistema, IA  
**Pré-condições:** O projeto possui conteúdo textual e fichas de entidades cadastradas.  
**Gatilho:** O usuário abre o painel "Perguntas de Escrita" ou clica em "Testar Consistência / Gerar Perguntas por IA".  

**Fluxo principal:**
1. O sistema lê as informações estruturadas e textos do projeto.
2. A IA formula perguntas críticas de consistência ou curiosidades baseadas em trechos obscuros, implícitos ou potenciais furos no enredo.
3. O sistema exibe a lista de perguntas geradas na interface.
4. O usuário clica sobre a pergunta para respondê-la ou marcá-la como anotação pendente de escrita (TODO).

**Fluxos alternativos:**
- *Modo Quiz:* O sistema gera perguntas no estilo quiz de múltipla escolha sobre os fatos cadastrados nas fichas para testar o conhecimento de leitores ou colaboradores.

**Fluxos de exceção:**
- *Dados insuficientes:* Se o projeto possuir poucas informações escritas, o sistema notifica: "Escreva mais detalhes no projeto para que a IA possa gerar perguntas sobre o seu universo".

**Pós-condições:** Uma lista de perguntas reflexivas ou de consistência sobre o universo é apresentada ao usuário.

**Critérios de aceite:**
- [ ] O sistema de IA deve categorizar as perguntas em: "Inconsistências", "Pontas Soltas" e "Curiosidades".
- [ ] O tempo máximo de geração de uma lista com 5 perguntas deve ser menor que 3 segundos.

**Prioridade:** Média  
**Complexidade estimada:** Alta
