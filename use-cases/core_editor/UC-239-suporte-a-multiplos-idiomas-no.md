### Caso de Uso: Suporte a múltiplos idiomas no sistema (i18n)

**ID:** UC-239  
**Requisito relacionado:** RF-239 (suporte a múltiplos idiomas no sistema (i18n))  
**Ator(es):** Sistema  
**Pré-condições:** Arquivos de dicionário de tradução do sistema (ex: `pt-BR.json`, `en-US.json`) contendo chaves e valores estruturados de tradução estão cadastrados na base de código da aplicação.  
**Gatilho:** Inicialização da aplicação no navegador ou carregamento da interface.  

**Fluxo principal:**
1. O usuário acessa o site da aplicação.
2. O sistema lê as configurações de idioma do navegador do visitante (`navigator.language`) para detectar o idioma preferido.
3. O sistema carrega o dicionário correspondente na memória da aplicação.
4. O sistema renderiza a interface traduzindo dinamicamente todas as chaves (ex: o rótulo da árvore lateral que exibia "Personagens" passa a ser renderizado como "Characters").

**Fluxos alternativos:**
- *Idioma de fallback:* Se o usuário utilizar um idioma que o sistema não possui suporte, o sistema carrega o idioma padrão configurado de fallback (ex: "en-US").

**Fluxos de exceção:**
- *Chave de tradução ausente:* Se uma chave de texto não constar no dicionário do idioma selecionado por omissão, o sistema renderiza a chave de fallback correspondente ou o próprio nome da chave.

**Pós-condições:** A interface da aplicação é apresentada no idioma detectado ou de fallback.

**Critérios de aceite:**
- [ ] Todas as telas, botões, modais e placeholders do sistema devem possuir chaves de tradução suportadas no sistema de i18n.
- [ ] A troca e renderização dinâmica do dicionário de idiomas no carregamento inicial deve durar menos de 200ms.

**Prioridade:** Média  
**Complexidade estimada:** Média
