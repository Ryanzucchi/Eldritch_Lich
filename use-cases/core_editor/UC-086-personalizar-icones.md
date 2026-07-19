### Caso de Uso: Personalizar ícones

**ID:** UC-086  
**Requisito relacionado:** RF-86 (personalizar ícones)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** Árvore de arquivos com pastas e textos criados.  
**Gatilho:** O usuário seleciona "Alterar Ícone" no menu de opções de um arquivo ou pasta.  

**Fluxo principal:**
1. O usuário clica com o botão direito sobre uma pasta e escolhe "Mudar Ícone".
2. O sistema abre um popover contendo um catálogo de ícones organizados por categorias.
3. O usuário busca por "usuário" e seleciona um ícone de silhueta de personagem.
4. O sistema atualiza o ícone da pasta no banco de dados.
5. A interface exibe imediatamente o novo ícone selecionado ao lado do nome da pasta.

**Fluxos alternativos:**
- *Upload de ícone customizado:* O usuário envia uma imagem SVG pequena de sua própria máquina para servir de ícone.

**Fluxos de exceção:**
- *SVG inválido no upload:* Se o arquivo SVG enviado contiver tags suspeitas (scripts/XSS), o sistema rejeita o upload e alerta sobre a invalidade.

**Pós-condições:** O item selecionado passa a exibir o ícone customizado.

**Critérios de aceite:**
- [ ] O catálogo padrão deve disponibilizar pelo menos 100 ícones vetoriais comuns.
- [ ] A troca do ícone na árvore de diretórios deve ser instantânea (< 100ms).

**Prioridade:** Baixa  
**Complexidade estimada:** Baixa
