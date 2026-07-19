### Caso de Uso: Contabilizar caracteres

**ID:** UC-029  
**Requisito relacionado:** RF-29 (contabilizar caracteres)  
**Ator(es):** Sistema  
**Pré-condições:** Um texto está aberto no editor ou selecionado.  
**Gatilho:** Modificação do conteúdo no editor de texto.  

**Fluxo principal:**
1. O usuário digita ou apaga caracteres no editor.
2. O sistema calcula o comprimento da string de texto puro (removendo tags de formatação) em tempo real.
3. O rodapé do editor atualiza o contador exibindo a quantidade de caracteres total.

**Fluxos alternativos:**
- *Excluir espaços:* O usuário clica sobre o contador de caracteres para alternar a exibição entre "com espaços" e "sem espaços".

**Fluxos de exceção:**
- *Nenhum erro esperado:* A contagem de caracteres é uma operação primitiva síncrona extremamente rápida.

**Pós-condições:** O número total de caracteres é exibido de forma legível no rodapé.

**Critérios de aceite:**
- [ ] O contador deve apresentar a quantidade com espaços (ex: "5.430 caracteres") por padrão.
- [ ] Ao alternar para "sem espaços", o cálculo deve subtrair todos os caracteres de espaço em branco (`\s`).
- [ ] As tags internas de formatação de Rich Text não podem ser somadas à contagem de caracteres do usuário.

**Prioridade:** Crítica  
**Complexidade estimada:** Baixa
