### Caso de Uso: Criar propriedades/efeitos de itens/objetos

**ID:** UC-286  
**Requisito relacionado:** RF-286 (criar propriedades/efeitos de itens/objetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** A ficha do item/objeto está cadastrada no inventário.  
**Gatilho:** O usuário adiciona ou edita propriedades físicas ou mágicas na ficha do item.  

**Fluxo principal:**
1. O usuário abre a ficha técnica do item correspondente.
2. O usuário acessa o painel de "Propriedades e Efeitos".
3. O usuário clica em "Nova Propriedade".
4. O sistema abre campos solicitando: Nome da Propriedade, Tipo de Efeito, Descrição do Efeito e Condição de Ativação.
5. O usuário insere os dados e clica em "Salvar".
6. O sistema grava a propriedade na tabela de atributos de efeitos de itens no banco de dados.
7. A propriedade passa a constar com estilo visual destacado no perfil do item.

**Fluxos alternativos:**
- *Vincular a feitiço:* O usuário vincula a propriedade a um feitiço já cadastrado na árvore de magias global, representando que o item canaliza aquela magia.

**Fluxos de exceção:**
- *Sem nome de efeito:* O sistema impede o salvamento caso o nome do efeito esteja em branco.

**Pós-condições:** A propriedade especial do item é salva e anexada ao perfil correspondente.

**Critérios de aceite:**
- [ ] A interface deve permitir listar as propriedades em formato compacto na ficha do item.
- [ ] O salvamento no banco de dados deve levar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
