### Caso de Uso: Documentar sistema de regras

**ID:** UC-334  
**Requisito relacionado:** RF-333 (documentar sistema de regras)  
**Ator(es):** Usuário (Game Designer), Sistema  
**Pré-condições:** Módulo de regras ativo no projeto.  
**Gatilho:** O usuário cria um documento de sistema de regras gerais do jogo ou RPG.  

**Fluxo principal:**
1. O usuário acessa "GDD" -> "Regras do Jogo".
2. O usuário clica em "Novo Conjunto de Regras".
3. O sistema abre o formulário estruturado solicitando: Nome da Regra, Categoria (combate, exploração), Fórmula de Cálculo (ex: `Dano = Ataque * 1.5 - Defesa`) e Condições Especiais.
4. O usuário digita a regra utilizando a notação matemática correspondente.
5. O usuário clica em "Salvar".
6. O sistema valida as variáveis da fórmula e grava a regra na tabela correspondente no banco de dados.

**Fluxos alternativos:**
- *Vincular regra a atributos:* O usuário linka as variáveis da fórmula diretamente aos atributos de personagens da base de dados (ex: linka a variável "Ataque" ao atributo "força" do personagem).

**Fluxos de exceção:**
- *Fórmula inválida:* Se a fórmula contiver parênteses abertos sem fechamento ou caracteres não matemáticos inválidos, o sistema impede o salvamento e exibe: "Erro: Sintaxe matemática de fórmula inválida".

**Pós-condições:** A regra matemática/lógica é salva e cadastrada na base de dados do projeto.

**Critérios de aceite:**
- [ ] O parser de fórmulas deve checar a validade matemática da equação antes de persistir no banco.
- [ ] A inserção da regra no banco de dados deve demorar menos de 300ms.

**Prioridade:** Alta  
**Complexidade estimada:** Média
