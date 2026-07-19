### Caso de Uso: Reconhecer palavras

**ID:** UC-016  
**Requisito relacionado:** RF-16 (reconhecer palavras)  
**Ator(es):** Sistema  
**Pré-condições:** O usuário está digitando no editor de texto.  
**Gatilho:** Digitação de caracteres terminados por espaço ou pontuação, ou carregamento de documento.  

**Fluxo principal:**
1. À medida que o usuário digita no editor, o sistema quebra o fluxo de texto em tokens (palavras) usando expressões regulares ajustadas ao idioma do documento.
2. O sistema valida cada token em relação ao dicionário ativo do idioma.
3. Se a palavra não for reconhecida no dicionário, o sistema a sinaliza visualmente com um sublinhado vermelho.

**Fluxos alternativos:**
- *Adicionar ao dicionário:* O usuário clica com o botão direito na palavra sublinhada e seleciona "Adicionar ao dicionário", fazendo com que o sistema passe a reconhecê-la no projeto.

**Fluxos de exceção:**
- *Dicionário inacessível:* Se o dicionário local/servidor falhar ao carregar, o sistema desabilita temporariamente a validação de palavras e remove os sublinhados vermelhos para evitar falsos alertas.

**Pós-condições:** O texto é analisado em nível de palavra e as palavras não reconhecidas são reportadas ao usuário.

**Critérios de aceite:**
- [ ] O tokenizador deve ignorar caracteres de controle e marcas de formatação Rich Text ao isolar as palavras.
- [ ] O reconhecimento e validação de palavras não devem causar latência ou lentidão visível na digitação (tempo de execução < 10ms).

**Prioridade:** Alta  
**Complexidade estimada:** Baixa
