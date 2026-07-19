### Caso de Uso: Criar modelos de textos

**ID:** UC-137  
**Requisito relacionado:** RF-137 (criar modelos (templates) de textos)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O editor está aberto e o usuário possui um texto formatado que deseja reutilizar.  
**Gatilho:** O usuário clica em "Salvar como Modelo de Texto" no menu do documento.  

**Fluxo principal:**
1. O usuário edita um texto estruturando campos padronizados (ex: "Cena 1: Introdução", "Cena 2: Conflito").
2. O usuário clica em "Salvar como Template".
3. O sistema abre um modal solicitando um nome para o modelo e uma descrição.
4. O usuário clica em "Salvar".
5. O sistema grava o conteúdo do texto na tabela de templates da conta.
6. Ao criar um novo texto futuramente, o modelo passa a constar na lista de opções rápidas de inicialização.

**Fluxos alternativos:**
- *Usar modelo padrão:* O usuário escolhe modelos pré-configurados do sistema (ex: Ficha de Personagem padrão) ao inicializar um novo documento.

**Fluxos de exceção:**
- *Duplicidade de nome:* O sistema alerta caso o nome já exista e sugere sobrescrever o modelo anterior.

**Pós-condições:** O modelo de texto é cadastrado e disponibilizado para novos arquivos.

**Critérios de aceite:**
- [ ] O modelo salvo deve reter estruturas de cabeçalhos e formatações ricas.
- [ ] A aplicação do modelo a um novo texto deve carregar o conteúdo em menos de 500ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
