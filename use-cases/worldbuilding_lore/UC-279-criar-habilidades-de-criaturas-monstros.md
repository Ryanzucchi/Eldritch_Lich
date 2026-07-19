### Caso de Uso: Criar habilidades de criaturas/monstros

**ID:** UC-279  
**Requisito relacionado:** RF-279 (criar habilidades de criaturas/monstros)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A ficha da criatura está cadastrada no bestiário.  
**Gatilho:** O usuário adiciona ou edita habilidades específicas na ficha da criatura.  

**Fluxo principal:**
1. O usuário abre a ficha de uma criatura no bestiário.
2. O usuário acessa o painel de "Habilidades Naturais".
3. O usuário clica em "Nova Habilidade".
4. O sistema abre campos solicitando: Nome da Habilidade, Tipo (Ativo/Passivo), Efeito e Frequência de uso.
5. O usuário preenche as informações e clica em "Salvar".
6. O sistema grava a habilidade na tabela de atributos de poderes de criaturas do bestiário.
7. A habilidade passa a constar com estilo destacado no perfil da criatura.

**Fluxos alternativos:**
- *Vincular a árvore de magias:* O usuário seleciona uma habilidade já cadastrada na árvore de magias global do projeto em vez de criar uma habilidade exclusiva de criatura.

**Fluxos de exceção:**
- *Nome em branco:* O sistema impede o salvamento caso o nome da habilidade esteja em branco.

**Pós-condições:** A habilidade da criatura é salva e anexada ao perfil do bestiário.

**Critérios de aceite:**
- [ ] A interface deve permitir listar as habilidades da criatura em formato de lista simples recolhível para otimizar espaço.
- [ ] O tempo total de salvamento deve ser de no máximo 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
