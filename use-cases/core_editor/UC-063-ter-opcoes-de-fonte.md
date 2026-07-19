### Caso de Uso: Ter opções de fonte

**ID:** UC-063  
**Requisito relacionado:** RF-63 (ter opções de fonte)  
**Ator(es):** Usuário (Escritor)  
**Pré-condições:** O editor de texto está aberto.  
**Gatilho:** O usuário seleciona um trecho de texto e clica no seletor de fontes na barra de ferramentas.  

**Fluxo principal:**
1. O usuário seleciona um trecho ou coloca o cursor em um parágrafo.
2. O usuário abre o seletor drop-down de fontes (exibe fontes como Times New Roman, Arial, Courier Prime, Atkinson Hyperlegible).
3. O usuário seleciona a fonte desejada.
4. O sistema aplica a estilização CSS no editor e atualiza o esquema estruturado do documento com o tipo da fonte no respectivo bloco.

**Fluxos alternativos:**
- *Mudar fonte padrão do projeto:* O usuário muda a fonte padrão nas configurações do editor, fazendo com que todo o texto do projeto que não possua estilização manual mude para a nova fonte.

**Fluxos de exceção:**
- *Fonte externa indisponível:* Se uma fonte carregada via web falhar ao baixar devido a problemas de rede, o editor reverte para uma fonte fallback segura correspondente (serif/sans-serif).

**Pós-condições:** O texto do editor é renderizado com a fonte selecionada.

**Critérios de aceite:**
- [ ] O seletor de fontes deve incluir fontes otimizadas para leitura (ex: Atkinson Hyperlegible) e escrita literária padrão.
- [ ] A alteração de fonte deve ser renderizada em menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
