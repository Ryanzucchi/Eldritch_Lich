### Caso de Uso: Poder desenhar entre o texto

**ID:** UC-062  
**Requisito relacionado:** RF-62 (poder desenhar entre o texto)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O usuário está editando um texto e possui um dispositivo de entrada compatível (mouse, trackpad ou caneta digital).  
**Gatilho:** O usuário clica na ferramenta "Desenho Livre" na barra de formatação do editor.  

**Fluxo principal:**
1. O usuário clica no ícone de "Desenhar entre o texto" no editor.
2. O sistema insere um canvas transparente inline entre os parágrafos atuais do texto, abrindo uma barra de ferramentas de desenho (lápis, borracha, espessura e cores).
3. O usuário desenha livremente sobre a área do canvas.
4. O usuário clica em "Concluir Desenho".
5. O sistema desativa as ferramentas de desenho, rasteriza o traço vetorial e salva a imagem gerada associada àquela posição do editor.

**Fluxos alternativos:**
- *Edição de desenho existente:* O usuário dá um duplo clique sobre o desenho inline para reabrir as ferramentas de edição vetorial e alterar os traços.

**Fluxos de exceção:**
- *Redimensionamento de tela:* O desenho é salvo em formato vetorial SVG responsivo para se adaptar corretamente a diferentes larguras de tela do editor sem truncar.

**Pós-condições:** O desenho é incorporado e persistido de forma inline no documento de texto.

**Critérios de aceite:**
- [ ] A inserção e uso do canvas de desenho não devem afetar a rolagem ou a performance de digitação do editor de texto.
- [ ] O desenho deve ser renderizado e salvo de forma vetorial (SVG) para evitar perda de resolução.

**Prioridade:** Baixa  
**Complexidade estimada:** Alta
