### Caso de Uso: Criar hyperlinks externos

**ID:** UC-111  
**Requisito relacionado:** RF-111 (criar hyperlinks externos)  
**Ator(es):** Usuário (Escritor), Sistema  
**Pré-condições:** O texto está aberto no editor.  
**Gatilho:** O usuário seleciona uma palavra e insere uma URL externa.  

**Fluxo principal:**
1. O usuário seleciona uma palavra no editor de texto.
2. O usuário clica em "Inserir Link" ou pressiona Ctrl+K.
3. O sistema abre uma caixa de diálogo de inserção de link.
4. O usuário insere um link externo completo (ex: `https://pt.wikipedia.org/wiki/Idade_Media`).
5. O sistema valida a URL.
6. O sistema aplica o hyperlink na palavra selecionada.
7. O editor exibe o texto formatado como link ativo sublinhado com um ícone de link externo.

**Fluxos alternativos:**
- *Colagem rápida:* O usuário copia uma URL e a cola diretamente sobre a palavra selecionada no editor. O sistema converte automaticamente a palavra em link contendo a URL colada.

**Fluxos de exceção:**
- *URL malformada:* Se o usuário digitar uma URL inválida sem o protocolo, o sistema tenta corrigir inserindo `https://` automaticamente ou alerta: "URL inválida".

**Pós-condições:** O link externo está inserido e funcional no documento de texto.

**Critérios de aceite:**
- [ ] O link externo deve abrir em uma nova aba do navegador (`target="_blank"`) e possuir atributos de segurança (`rel="noopener noreferrer"`).
- [ ] A alteração deve ser gravada no esquema de dados estruturado do editor em menos de 100ms.

**Prioridade:** Média  
**Complexidade estimada:** Baixa
