### Caso de Uso: Fixar pastas

**ID:** UC-155  
**Requisito relacionado:** RF-155 (fixar pastas)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** A pasta de destino existe na árvore do projeto.  
**Gatilho:** O usuário clica em "Fixar Pasta no Topo" no menu de opções da pasta.  

**Fluxo principal:**
1. O usuário clica com o botão direito na pasta selecionada na barra lateral.
2. O usuário escolhe a opção "Fixar no Topo".
3. O sistema altera o status do atributo `fixada` para `true` no banco de dados.
4. O sistema reposiciona a pasta para o topo de seu nível hierárquico, ignorando regras de ordenação padrão.
5. A interface exibe um ícone de pino sobre a pasta fixada.

**Fluxos alternativos:**
- *Desafixar pasta:* O usuário clica em "Desafixar" e o sistema retorna a pasta à sua posição de ordenação natural.

**Fluxos de exceção:**
- *Múltiplos itens fixados:* Se houver múltiplas pastas e textos fixados no mesmo nível, o sistema coloca as pastas fixadas no topo seguidas pelos textos fixados.

**Pós-condições:** A pasta fica ancorada no topo do seu nível de diretório na interface lateral.

**Critérios de aceite:**
- [ ] O pino indicador de fixação deve ser renderizado de forma clara na interface lateral.
- [ ] A fixação da pasta deve atualizar a interface em menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
