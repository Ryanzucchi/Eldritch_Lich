### Caso de Uso: Modo leitura (sem edição, layout limpo)

**ID:** UC-187  
**Requisito relacionado:** RF-187 (modo leitura)  
**Ator(es):** Usuário (Leitor/Escritor)  
**Pré-condições:** O texto do capítulo está cadastrado no projeto.  
**Gatilho:** O usuário clica no botão "Modo Leitura" na barra de ferramentas do editor.  

**Fluxo principal:**
1. O usuário ativa o Modo Leitura.
2. O sistema altera o editor de texto para modo de visualização estático (readOnly).
3. A interface remove barras de ferramentas de formatação e as marcas de cursor piscantes.
4. A folha de texto ganha um espaçamento de margens mais largo e tipografia dedicada para leitura limpa.

**Fluxos alternativos:**
- *Modo Sépia:* O usuário altera as cores de fundo para sépia ou cinza para diminuir a fadiga visual.

**Fluxos de exceção:**
- *Edição concorrente:* Se outro colaborador editar o texto em tempo real enquanto o usuário lê, o texto atualiza na tela de forma silenciosa, sem interromper a rolagem do leitor.

**Pós-condições:** O editor entra em modo de exibição de texto limpo e bloqueia modificações de teclado.

**Critérios de aceite:**
- [ ] O clique em links internos deve continuar ativo no modo leitura para permitir navegar entre capítulos interligados de forma fluida.
- [ ] A re-renderização da tela para o formato livro deve ocorrer em menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
