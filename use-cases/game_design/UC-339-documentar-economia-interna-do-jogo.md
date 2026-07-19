### Caso de Uso: Documentar economia interna do jogo (itens, moedas, trocas)

**ID:** UC-339  
**Requisito relacionado:** RF-338 (documentar economia interna do jogo)  
**Ator(es):** Usuário (Game Designer), Sistema  
**Pré-condições:** Itens cadastrados no inventário do projeto.  
**Gatilho:** O usuário edita os parâmetros de economia ou tabelas de lojas.  

**Fluxo principal:**
1. O usuário acessa "GDD" -> "Economia e Lojas".
2. O usuário clica em "Nova Loja / Tabela de Trocas".
3. O usuário digita o nome do estabelecimento.
4. O usuário seleciona quais itens estão à venda na loja e preenche os campos: Preço de Compra (em moedas de ouro), Preço de Venda e Limite de Estoque.
5. O usuário clica em "Salvar".
6. O sistema grava a tabela de comércio e preços no banco de dados.
7. A economia e os valores de liquidez dos itens passam a constar nos relatórios de balanceamento econômico do projeto.

**Fluxos alternativos:**
- *Calcular modificadores de preço:* O usuário ativa um modificador de economia (ex: "Evento de Inflação"). O sistema eleva automaticamente em 20% os preços de compra de todos os itens de combate em todas as lojas cadastradas do reino.

**Fluxos de exceção:**
- *Preço de venda maior que compra:* Se o usuário preencher um preço de venda do item maior do que o preço de compra por engano, o sistema emite um alerta de segurança avisando sobre o risco de loop infinito de moedas.

**Pós-condições:** A tabela de precificação econômica dos itens de comércio é salva na base de dados.

**Critérios de aceite:**
- [ ] A interface de economia deve fornecer um relatório consolidado com a média de valor dos itens por raridade.
- [ ] A gravação no banco de dados deve levar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
