### Caso de Uso: Cadastrar fichas de itens/objetos (inventário)

**ID:** UC-281  
**Requisito relacionado:** RF-281 (cadastrar fichas de itens/objetos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está na seção de worldbuilding (itens/equipamentos) do projeto.  
**Gatilho:** O usuário clica em "Novo Item / Objeto" no menu do inventário do projeto.  

**Fluxo principal:**
1. O usuário clica na opção "Criar Novo Item".
2. O sistema abre a ficha técnica padrão de itens solicitando: Nome do Item, Tipo (arma, armadura, relíquia), Descrição Física, História/Lore e Propriedades Especiais.
3. O usuário preenche as informações do item.
4. O usuário clica em "Salvar".
5. O sistema grava o registro do item na tabela de inventário/objetos do banco de dados.
6. O item passa a constar na lista lateral do diretório de worldbuilding.

**Fluxos alternativos:**
- *Criar a partir de modelo:* O usuário cria o item baseado em um template pré-configurado de item (ex: Arma Lendária) que já inicializa com atributos adicionais prontos para preenchimento.

**Fluxos de exceção:**
- *Nome duplicado:* O sistema sugere usar outro nome caso o item já exista para evitar problemas de busca e hyperlinks.

**Pós-condições:** A ficha técnica do item é cadastrada e salva na base de dados do projeto.

**Critérios de aceite:**
- [ ] A ficha técnica deve aceitar formatação em negrito/itálico no campo de história e propriedades.
- [ ] O salvamento do novo item no banco deve ocorrer em até 200ms.

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
